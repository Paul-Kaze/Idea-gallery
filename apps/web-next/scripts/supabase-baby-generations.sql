-- Dommi production Supabase schema
-- Run this in the Supabase SQL editor before enabling paid generation.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Users synced from NextAuth Google sign-in.
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    name TEXT,
    avatar_url TEXT,
    credits INTEGER NOT NULL DEFAULT 0 CHECK (credits >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS email TEXT,
    ADD COLUMN IF NOT EXISTS name TEXT,
    ADD COLUMN IF NOT EXISTS avatar_url TEXT,
    ADD COLUMN IF NOT EXISTS credits INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE UNIQUE INDEX IF NOT EXISTS users_email_key ON public.users (email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users (created_at DESC);

-- Generation history for tools such as AI Baby Generator.
CREATE TABLE IF NOT EXISTS public.tool_generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    user_email TEXT NOT NULL,
    tool_name TEXT NOT NULL,
    result_url TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    credits_cost INTEGER NOT NULL DEFAULT 0 CHECK (credits_cost >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.tool_generations
    ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS user_email TEXT,
    ADD COLUMN IF NOT EXISTS tool_name TEXT,
    ADD COLUMN IF NOT EXISTS result_url TEXT,
    ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS credits_cost INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_tool_generations_user_email_created_at
    ON public.tool_generations (user_email, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tool_generations_user_id_created_at
    ON public.tool_generations (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tool_generations_tool_name_created_at
    ON public.tool_generations (tool_name, created_at DESC);

-- Credit orders processed from Creem webhooks.
CREATE TABLE IF NOT EXISTS public.credit_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    checkout_id TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    package_key TEXT,
    credits_awarded INTEGER NOT NULL CHECK (credits_awarded > 0),
    status TEXT NOT NULL DEFAULT 'completed',
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.credit_orders
    ADD COLUMN IF NOT EXISTS checkout_id TEXT,
    ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    ADD COLUMN IF NOT EXISTS product_id TEXT,
    ADD COLUMN IF NOT EXISTS package_key TEXT,
    ADD COLUMN IF NOT EXISTS credits_awarded INTEGER,
    ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'completed',
    ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE UNIQUE INDEX IF NOT EXISTS credit_orders_checkout_id_key ON public.credit_orders (checkout_id);
CREATE INDEX IF NOT EXISTS idx_credit_orders_user_id_created_at
    ON public.credit_orders (user_id, created_at DESC);

-- Legacy table retained only for compatibility with older exports.
CREATE TABLE IF NOT EXISTS public.baby_generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    image_url TEXT NOT NULL,
    gender TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_baby_generations_user_email
    ON public.baby_generations (user_email, created_at DESC);

-- Shared updated_at trigger.
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_users_updated_at ON public.users;
CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_credit_orders_updated_at ON public.credit_orders;
CREATE TRIGGER set_credit_orders_updated_at
BEFORE UPDATE ON public.credit_orders
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS: server-side service role bypasses RLS. Authenticated clients can only read their own rows.
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.baby_generations ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'users' AND policyname = 'users_select_own_email'
    ) THEN
        CREATE POLICY users_select_own_email
        ON public.users
        FOR SELECT
        TO authenticated
        USING (LOWER(email) = LOWER(COALESCE(auth.jwt() ->> 'email', '')));
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'tool_generations' AND policyname = 'tool_generations_select_own_email'
    ) THEN
        CREATE POLICY tool_generations_select_own_email
        ON public.tool_generations
        FOR SELECT
        TO authenticated
        USING (LOWER(user_email) = LOWER(COALESCE(auth.jwt() ->> 'email', '')));
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'credit_orders' AND policyname = 'credit_orders_select_own_user'
    ) THEN
        CREATE POLICY credit_orders_select_own_user
        ON public.credit_orders
        FOR SELECT
        TO authenticated
        USING (
            user_id IN (
                SELECT id
                FROM public.users
                WHERE LOWER(email) = LOWER(COALESCE(auth.jwt() ->> 'email', ''))
            )
        );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'baby_generations' AND policyname = 'baby_generations_select_own_email'
    ) THEN
        CREATE POLICY baby_generations_select_own_email
        ON public.baby_generations
        FOR SELECT
        TO authenticated
        USING (LOWER(user_email) = LOWER(COALESCE(auth.jwt() ->> 'email', '')));
    END IF;
END $$;

-- Optional RPC for production credit safety: deduct credits and write history in one locked operation.
CREATE OR REPLACE FUNCTION public.spend_credits_for_tool(
    p_user_email TEXT,
    p_tool_name TEXT,
    p_result_url TEXT,
    p_metadata JSONB DEFAULT '{}'::jsonb,
    p_credits_cost INTEGER DEFAULT 0
)
RETURNS TABLE (generation_id UUID, remaining_credits INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_current_credits INTEGER;
    v_generation_id UUID;
BEGIN
    IF p_credits_cost < 0 THEN
        RAISE EXCEPTION 'invalid_credits_cost';
    END IF;

    SELECT id, credits
    INTO v_user_id, v_current_credits
    FROM public.users
    WHERE email = p_user_email
    FOR UPDATE;

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'user_not_found';
    END IF;

    IF v_current_credits < p_credits_cost THEN
        RAISE EXCEPTION 'insufficient_credits';
    END IF;

    UPDATE public.users
    SET credits = credits - p_credits_cost
    WHERE id = v_user_id
    RETURNING credits INTO remaining_credits;

    INSERT INTO public.tool_generations (
        user_id,
        user_email,
        tool_name,
        result_url,
        metadata,
        credits_cost
    )
    VALUES (
        v_user_id,
        p_user_email,
        p_tool_name,
        p_result_url,
        COALESCE(p_metadata, '{}'::jsonb),
        p_credits_cost
    )
    RETURNING id INTO v_generation_id;

    generation_id := v_generation_id;
    RETURN NEXT;
END;
$$;

-- Optional RPC for webhook idempotency: record one checkout and award credits once.
CREATE OR REPLACE FUNCTION public.award_credits_for_checkout(
    p_checkout_id TEXT,
    p_user_email TEXT,
    p_product_id TEXT,
    p_package_key TEXT,
    p_credits_awarded INTEGER,
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_remaining_credits INTEGER;
BEGIN
    IF p_credits_awarded <= 0 THEN
        RAISE EXCEPTION 'invalid_credits_awarded';
    END IF;

    SELECT u.id, u.credits
    INTO v_user_id, v_remaining_credits
    FROM public.users u
    WHERE u.email = p_user_email
    FOR UPDATE;

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'user_not_found';
    END IF;

    IF EXISTS (SELECT 1 FROM public.credit_orders WHERE checkout_id = p_checkout_id) THEN
        RETURN v_remaining_credits;
    END IF;

    INSERT INTO public.credit_orders (
        checkout_id,
        user_id,
        product_id,
        package_key,
        credits_awarded,
        status,
        metadata
    )
    VALUES (
        p_checkout_id,
        v_user_id,
        p_product_id,
        p_package_key,
        p_credits_awarded,
        'completed',
        COALESCE(p_metadata, '{}'::jsonb)
    );

    UPDATE public.users
    SET credits = credits + p_credits_awarded
    WHERE id = v_user_id
    RETURNING credits INTO v_remaining_credits;

    RETURN v_remaining_credits;
END;
$$;

REVOKE ALL ON FUNCTION public.spend_credits_for_tool(TEXT, TEXT, TEXT, JSONB, INTEGER) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.award_credits_for_checkout(TEXT, TEXT, TEXT, TEXT, INTEGER, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.spend_credits_for_tool(TEXT, TEXT, TEXT, JSONB, INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION public.award_credits_for_checkout(TEXT, TEXT, TEXT, TEXT, INTEGER, JSONB) TO service_role;
