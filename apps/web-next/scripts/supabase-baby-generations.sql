-- AI Baby Generator 历史记录表
-- 在 Supabase SQL Editor 中运行此脚本

CREATE TABLE IF NOT EXISTS baby_generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email TEXT NOT NULL,
    image_url TEXT NOT NULL,
    gender TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建基于 user_email 的索引以加速历史记录查询
CREATE INDEX IF NOT EXISTS idx_baby_generations_user_email ON baby_generations(user_email);

-- 可选：启用 RLS (Row Level Security)，并配置策略
-- ALTER TABLE baby_generations ENABLE ROW LEVEL SECURITY;
--由于目前所有读写操作都通过服务端的 supabaseAdmin (Service Role Key) 进行，
--因此可以暂时不启用 RLS 或仅允许 Service Role 访问。
