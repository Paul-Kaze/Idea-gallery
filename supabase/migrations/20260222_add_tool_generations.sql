-- ============================================================================
-- 统一的工具生成历史表 (tool_generations)
-- 用于替代分散的 baby_generations 等表，支持利用 JSONB 存储不同工具特有的元数据
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.tool_generations (
    -- 主键：使用 UUID
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 用户邮箱/标识
    user_email TEXT NOT NULL,
    
    -- 工具名称：用于区分是哪个工具生成的记录 (例如 'ai_baby', 'logo_maker')
    tool_name TEXT NOT NULL,
    
    -- 生成结果的核心链接（图片、视频或文件的 URL）
    result_url TEXT NOT NULL,
    
    -- 特定工具的元数据 (核心设计)
    -- AI Baby Generator 示例: {"gender": "girl", "parent1_url": "...", "parent2_url": "..."}
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- 生成状态：可选字段 (例如 'success', 'failed')
    status TEXT DEFAULT 'success',
    
    -- 创建时间
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 索引配置
-- ============================================================================

-- 按用户邮箱建立索引，加速查询特定用户的记录
CREATE INDEX IF NOT EXISTS idx_tool_generations_user_email ON public.tool_generations(user_email);

-- 按工具名称建立索引，加速查询特定工具的汇总数据
CREATE INDEX IF NOT EXISTS idx_tool_generations_tool_name ON public.tool_generations(tool_name);

-- GIN 索引 (可选，目前先不加): 如果未来需要高频按 JSONB 内部某个特定键查询，可以建立
-- CREATE INDEX idx_tool_generations_metadata ON public.tool_generations USING GIN (metadata);

-- ============================================================================
-- 迁移提示：如何处理旧表 (baby_generations)
-- 在确认新表在生产环境稳定运行，且已完成老数据迁移（如果需要）后，
-- 可以通过以下命令删除老表：
-- DROP TABLE IF EXISTS public.baby_generations;
-- ============================================================================
