-- ============================================================================
-- AI 图片画廊数据库迁移脚本
-- 文件: ai_gallery.sql
-- 描述: 创建 AI 图片画廊应用所需的数据库表结构、索引和安全策略
-- 数据库: Supabase (PostgreSQL)

-- 用户表 (users)
-- 存储应用用户信息，主要用于 Google OAuth 认证
-- ----------------------------------------------------------------------------
create table if not exists public.users (
  -- 主键：使用 UUID 作为唯一标识符，自动生成随机 UUID
  id uuid primary key default gen_random_uuid(),
  
  -- 用户显示名称：必填字段，不能为空
  name text not null,
  
  -- 用户头像 URL：可选字段，存储用户头像的链接
  avatar_url text,
  
  -- 创建时间：记录用户账户创建的时间，默认为当前时间
  created_at timestamptz not null default now(),
  
  -- 过期时间：可选字段，可用于实现临时用户或会话管理
  expires_at timestamptz
);

-- ----------------------------------------------------------------------------
-- 图片/视频表 (images)
-- 存储 AI 生成的图片和视频的元数据信息
-- ----------------------------------------------------------------------------
create table if not exists public.images (
  -- 主键：使用 UUID 作为唯一标识符，自动生成随机 UUID
  id uuid primary key default gen_random_uuid(),
  
  -- 媒体类型：只能是 'image' 或 'video' 两种类型
  type text not null check (type in ('image','video')),
  
  -- AI 模型名称：记录生成此媒体的 AI 模型（如 DALL-E、Stable Diffusion、Sora 等）
  model text not null,
  
  -- 生成提示词：用户输入的 AI 生成提示词
  prompt text not null,
  
  -- 缩略图 URL：用于列表展示的小尺寸图片链接
  thumbnail_url text not null,
  
  -- 完整图 URL：原始尺寸或高质量版本的链接
  full_url text not null,
  
  -- 宽度：媒体文件的像素宽度
  width int not null,
  
  -- 高度：媒体文件的像素高度
  height int not null,
  
  -- 持续时间：仅对视频有效，存储视频时长（如 "00:01:30"）
  duration text,
  
  -- 上传时间：记录媒体文件上传的时间，默认为当前时间
  uploaded_at timestamptz not null default now(),
  
  -- 用户外键：关联到 users 表，表示此媒体的上传者
  user_id uuid references public.users(id)
);

-- ----------------------------------------------------------------------------
-- 索引创建
-- 优化查询性能，提高数据检索速度
-- ----------------------------------------------------------------------------

-- 按上传时间降序索引：用于按时间顺序展示图片（最新优先）
create index if not exists images_uploaded_at_idx on public.images (uploaded_at desc);

-- 用户 ID 索引：优化按用户查询图片的性能
create index if not exists images_user_id_idx on public.images (user_id);

-- ----------------------------------------------------------------------------
-- 参考图片表 (reference_images)
-- 存储与目标图片相关的参考图片信息
-- 例如：用户上传的参考图、风格参考图等
-- ----------------------------------------------------------------------------
create table if not exists public.reference_images (
  -- 主键：使用 UUID 作为唯一标识符，自动生成随机 UUID
  id uuid primary key default gen_random_uuid(),
  
  -- 文件路径：可选字段，存储服务器上的文件路径
  path text,
  
  -- 图片 URL：必填字段，存储参考图片的访问链接
  url text not null,
  
  -- 目标图片外键：关联到 images 表，表示此参考图属于哪个目标图片
  -- on delete cascade：当目标图片被删除时，自动删除相关的参考图片
  target_image_id uuid not null references public.images(id) on delete cascade
);

-- ============================================================================
-- 行级安全策略 (Row Level Security - RLS)
-- 控制不同用户对数据的访问权限
-- ============================================================================

-- 启用所有表的行级安全策略
-- 启用后，所有数据访问都会受到策略的限制（除非使用服务角色）
alter table public.images enable row level security;
alter table public.reference_images enable row level security;
alter table public.users enable row level security;

-- ----------------------------------------------------------------------------
-- 公共读取策略（无需登录）
-- 允许所有用户（包括未登录用户）查看图片和参考图片
-- ----------------------------------------------------------------------------

-- 删除已存在的策略（如果存在），避免冲突
drop policy if exists "public read images" on public.images;

-- 为 images 表创建公共读取策略
create policy "public read images" on public.images
  for select                    -- 仅适用于 SELECT 查询
  to public                     -- 对所有用户生效（包括未认证用户）
  using (true);                 -- 无条件允许：所有行都可以被查询

-- 删除已存在的策略（如果存在）
drop policy if exists "public read reference images" on public.reference_images;

-- 为 reference_images 表创建公共读取策略
create policy "public read reference images" on public.reference_images
  for select                    -- 仅适用于 SELECT 查询
  to public                     -- 对所有用户生效
  using (true);                 -- 无条件允许：所有行都可以被查询

-- ----------------------------------------------------------------------------
-- 用户表访问策略（需要认证）
-- 只允许已认证用户查看用户信息
-- ----------------------------------------------------------------------------

-- 删除已存在的策略（如果存在）
drop policy if exists "self read users" on public.users;

-- 为 users 表创建认证用户读取策略
create policy "self read users" on public.users
  for select                    -- 仅适用于 SELECT 查询
  to authenticated              -- 仅对已认证用户生效
  using (true);                 -- 无条件允许：认证用户可以查看所有用户信息

comment on table public.images is 'AI 生成的图片和视频元数据，包含模型、提示词、尺寸等信息';

comment on table public.reference_images is '与目标图片关联的参考图片，用于展示生成过程中的参考素材';

comment on table public.users is '应用用户信息表，主要用于 Google OAuth 认证用户管理';
