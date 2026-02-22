## 改动概览
- 在 `public.images` 表新增 `reference_image` 列，类型为数组（建议 `text[]`），用于存储参考图片 URL 列表。
- 后端详情接口在响应中透出 `reference_image: string[]`。
- 前端类型与 `ImageDetailModal` 右侧属性栏：当存在 `reference_image` 时新增展示区域，渲染缩略图列表。
- 兼容现状：列表接口不改；详情在 Modal 打开时补拉取，保证 `prompt` 与 `reference_image` 都能显示。

## 数据库（Supabase）
- 在迁移中为 `public.images` 增加列：`alter table public.images add column reference_image text[];`（可选默认值 `default '{}'::text[]`）。
- 现有迁移文件定义了 `images` 表（supabase/migrations/ai_gallery.sql:31-64）与 `reference_images` 关系表（supabase/migrations/ai_gallery.sql:82-95）。本次按需求直接在 `images` 表中维护列表列以简化读路径，保留关系表不动。

## 后端 API
- 详情接口文件：`apps/web-next/app/api/images/[id]/route.ts`
  - 扩展返回类型：在 `Detail` 中增加 `reference_image?: string[]`（apps/web-next/app/api/images/[id]/route.ts:1-11）。
  - DB 映射：把 `db.reference_image` 映射到响应 `reference_image`（apps/web-next/app/api/images/[id]/route.ts:38-47）。
  - Mock：可为 `DETAILS` 添加示例 `reference_image`（便于本地验证）。
- 数据访问：`apps/web-next/lib/db.ts`
  - 扩展 `DetailItem` 增加 `reference_image?: string[] | null`（apps/web-next/lib/db.ts:16-25）。
  - 在 `getImageDetail` 的 `select` 中加入 `reference_image` 字段（apps/web-next/lib/db.ts:79-85）。

## 前端类型
- `apps/web-next/types/media.ts` 添加可选字段 `reference_image?: string[]`（apps/web-next/types/media.ts:1-11）。
- 列表项保持不带 `reference_image`；详情获取后在 Modal 内部以局部状态补齐。

## 前端 UI（ImageDetailModal）
- 组件位置：`apps/web-next/components/ImageDetailModal.tsx`（已存在 UI，右侧属性栏见 apps/web-next/components/ImageDetailModal.tsx:88-122）。
- 新增：
  - 在组件内增加一个局部 `detail` 状态；当 `item.prompt` 为空或需要 `reference_image` 时，`useEffect` 触发拉取 `/api/images/${item.id}`，合并到显示数据。
  - 在右侧属性栏下方新增“参考图片”区域：当 `detail.reference_image?.length` > 0 时显示一个小网格（如 3 列，支持横向滚动），使用 `NextImageWithFallback` 渲染；点击缩略图在新标签打开原图。
  - 放置位置：紧随尺寸信息之后（apps/web-next/components/ImageDetailModal.tsx:116-121 之后插入一个块）。
  - 视频与图片统一显示参考图；不随媒体类型改变文案。

## 交互与兼容
- 现有页面 `apps/web-next/app/page.tsx` 通过列表接口填充 `MediaItem`，`prompt` 为空（apps/web-next/app/page.tsx:70-80）；Modal 中的详情补拉取可同时解决 `prompt` 与 `reference_image` 展示。
- 列表接口 `apps/web-next/app/api/images/route.ts` 无需改动。
- 若未来需要更丰富的参考图对象（含 id/缩略图），可把列类型升级为 `jsonb` 并统一映射。

## 验证与测试
- 单元测试：扩展 `apps/web-next/__tests__/components/ImageDetailModal.test.tsx`，新增用例验证当提供 `reference_image` 时渲染缩略图区域，并验证点击缩略图行为。
- 接口验证：本地加入 1-2 条 `DETAILS` 的 `reference_image` mock，打开 Modal 观察右栏展示。
- 数据库验证：执行迁移后插入一条含 `reference_image` 的记录，访问 `/api/images/:id` 确认返回数组。

## 变更影响
- 向后兼容：当 `reference_image` 缺失或为空数组时，前端不显示该区域。
- 安全与性能：保持 RLS 与缓存策略不变；参考图缩略图采用懒加载与受控尺寸以避免布局抖动。