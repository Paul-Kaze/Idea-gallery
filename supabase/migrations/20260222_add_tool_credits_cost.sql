-- 为 tool_generations 表增加 credits_cost 字段
-- 用于记录每次使用特定工具所消耗的积分数量

ALTER TABLE public.tool_generations 
ADD COLUMN IF NOT EXISTS credits_cost INTEGER DEFAULT 0;

COMMENT ON COLUMN public.tool_generations.credits_cost IS '记录本次工具生成所消耗的积分数量';
