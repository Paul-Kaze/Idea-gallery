-- ============================================================================
-- 积分充值订单表 (credit_orders)
-- 用于记录通过 Creem 等支付渠道充值的订单及金额，并利用 checkout_id 保证 Webhook 幂等性
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.credit_orders (
    -- 本地订单的唯一标识
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- 充值用户的 ID
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- 核心字段：Creem 返回的结账单 ID，用于防重
    checkout_id TEXT UNIQUE NOT NULL,

    -- 购买的 Creem 套餐 ID（如 prod_xxx_500）
    product_id TEXT NOT NULL,
    
    -- 本次订单实际发放的积分数量
    credits_awarded INTEGER NOT NULL,
    
    -- 订单状态（可选扩展：pending, completed, failed）
    status TEXT DEFAULT 'completed',
    
    -- 订单创建时间
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 索引配置
-- ============================================================================

-- 基于用户 ID 创建索引，方便后续在前台页面展示“我的充值记录”
CREATE INDEX IF NOT EXISTS idx_credit_orders_user_id ON public.credit_orders(user_id);

-- 基于 Checkout ID 创建索引，确保 Webhook 来的并发请求能极快地验证幂等性
CREATE INDEX IF NOT EXISTS idx_credit_orders_checkout_id ON public.credit_orders(checkout_id);

COMMENT ON TABLE public.credit_orders IS '记录用户通过支付购买积分的订单明细，防止重复发账';
