-- 为 images 表增加 reference_image 数组列，用于存储参考图片 URL 列表
alter table public.images
  add column if not exists reference_image text[] default '{}'::text[];

comment on column public.images.reference_image is '参考图片 URL 列表（数组），用于在详情侧栏展示';

