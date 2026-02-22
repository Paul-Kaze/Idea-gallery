-- 为 users 表增加 email 和 credits 字段
-- email 用于唯一识别用户并在登录时同步
-- credits 用于记录用户积分余额（Creem 支付集成）

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS email TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 0;

-- 为 email 字段创建索引以提高查询效率
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

COMMENT ON COLUMN public.users.email IS '用户邮箱，用于唯一标识和登录同步';
COMMENT ON COLUMN public.users.credits IS '用户剩余积分余额';
