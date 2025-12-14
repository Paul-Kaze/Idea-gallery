## 当前状态概述
- 现有前端为 React 18 + Vite 单页应用；入口 `index.html` → `src/main.tsx` → `src/App.tsx`
- 样式采用 Tailwind CSS v4 的预编译输出与 `src/styles/globals.css`；未发现 `tailwind.config`/`postcss.config`
- 无后端/API 实现，数据为前端本地 Mock；无测试配置
- 关键路径：`src/components/ImageGallery.tsx`、`ImageCard.tsx`、`ImageDetailModal.tsx`、`AuthButton.tsx`

## 需求要点解读
- 保持现有 UI 与交互不变：瀑布流、懒加载、详情弹窗、下载按钮、登录入口
- 优先向后兼容：最小改动迁移，支持快速回滚
- 改造重心在后端逻辑与性能：引入规范化 API、缓存、CDN、图片处理与下载优化
- 技术选型：主框架采用 Next.js 最新稳定版（`next@latest`），保留现有 CSS 架构；API 按 Next.js Route Handlers 最佳实践

## 总体迁移策略
- 单仓多应用并行迁移：新增 `apps/web-next`（Next.js）与保留 `apps/legacy`（当前 Vite）；阶段性切换路由与数据源，确保向后兼容与可回滚
- 组件原样迁移：以 Client Component 方式移入 `app/` 路由，保留原有 Tailwind 类名与交互逻辑
- 样式“不动刀”：优先直接引入现有 `index.css` 与 `globals.css` 到 Next 全局样式，避免重编译与视觉差异
- API 增量上线：先以 Mock/文件源实现接口形状，再接入真实存储与数据库；逐步替换前端数据源

## 技术选型与约束
- Next.js：App Router（`app/`）、Route Handlers（`app/api/*/route.ts`）、Edge/Node 双运行时
- 样式：沿用 Tailwind v4 预编译 CSS 与 `globals.css`；若需构建接入，再补充 `postcss` 管线，确保输出一致
- 数据访问：Prisma + PostgreSQL（图片元数据与用户信息）；对象存储选型 S3/OSS；统一以环境变量管理凭证
- 认证：NextAuth.js（Google OAuth），会话存储为 JWT 或数据库会话；UI 维持现状（登录按钮/头像/退出）
- 图片：`next/image` 优化与域名白名单；缩略图与原图分域；CDN 缓存
- 测试：Vitest + React Testing Library（单元/组件），Playwright（端到端）；覆盖核心路径与 API

## 模块改造方案
### 前端页面与组件
- `app/page.tsx`：首页瀑布流主页面，迁移 `ImageGallery` 为 Client Component，保持懒加载与占位符逻辑
- 弹窗：迁移 `ImageDetailModal` 为 Client Component，继续使用遮罩与滚动锁定；下载按钮直连后端下载接口
- 头像/登录入口：迁移 `AuthButton`，在登录成功后展示头像与“退出登录”下拉

### 样式与 CSS 架构
- 直接引入现有全局样式：`app/globals.css` 仅 `@import` 现有 `src/index.css` 与 `src/styles/globals.css`
- 不改动类名/层级/主题变量；若 Next 构建需要 PostCSS 支持，接入但输出必须与当前一致（通过视觉回归验证）

### 路由与交互
- 路由保持单页体验：主页面 `app/page.tsx`；详情弹窗仍由点击缩略图触发，非路由级别弹窗
- 懒加载：以 `IntersectionObserver` 或 `next/image` 默认懒加载；首屏优先加载

### 后端 API 层（Next.js Route Handlers）
- 图片列表：`GET /api/images?page&size&viewport`，返回缩略图链接、模型、总数与分页标记；缓存策略 `revalidate` + CDN
- 图片详情：`GET /api/images/:id`，返回模型、完整提示词、上传时间、原图链接、参考图列表（存在时）
- 图片下载：`GET /api/download?id&type=original|thumb`，返回文件流，设置 `Content-Disposition` 与合适的 `Cache-Control`
- 用户认证：`POST /api/auth/google`（NextAuth 路由），输入 Google Token，返回用户信息与短期登录令牌

### 存储与元数据
- 元数据表：图片（id、model、prompt、ref_ids、uploaded_at、user_id）、参考图（id、path、url、target_id）、用户（id、name、avatar、expires_at）
- 文件存储：原图与缩略图分桶/目录；生成缩略图（宽 800 等比）并记录路径与访问 URL

### 认证与会话
- 未登录：显示“登录”按钮；点击触发 Google OAuth（弹窗/重定向）；成功后返回头像
- 已登录：头像 + 下拉仅“退出登录”；退出后清理会话并回到未登录状态

### 性能优化
- 列表接口：数据库索引（图片 id、user_id、uploaded_at）；分页查询 + 轻量响应体
- 缓存：`route segment config` + `revalidate`（ISR），CDN 边缘缓存缩略图与参考图
- 图片优化：`next/image` 响应式 `sizes`、域名白名单；占位符低清图/骨架屏
- 并发与限流：IP 级限流（100 req/min），下载接口加入签名校验与临时 URL

## 分阶段实施路线图
- 阶段 1：创建 `apps/web-next`，接入现有全局样式与组件最小子集，跑通首页静态版本
- 阶段 2：实现四个 API 接口的 Mock 版本并替换前端数据源
- 阶段 3：接入真实存储与数据库、图片处理与下载流；启用缓存与 CDN
- 阶段 4：接入 NextAuth Google 登录，替换前端模拟登录
- 阶段 5：性能调优（缓存、索引、`next/image` 参数）；视觉与交互回归
- 阶段 6：完善测试覆盖与文档；准备切流与回滚方案

## 测试覆盖计划
- 单元测试：组件交互（瀑布流懒加载、弹窗开关、下载按钮）、工具函数
- API 测试：列表/详情/下载/认证的成功与错误路径、分页与边界
- 端到端：首屏加载、滚动懒加载、点击详情、参考图悬浮、登录与退出
- 视觉回归：关键页面的截图对比，确保样式与布局不变
- 覆盖率阈值：语句/分支/函数/行 ≥ 80%

## 风险与兼容性策略
- 样式差异风险：采用视觉回归与对比构建，若发现差异立即回滚到 `apps/legacy`
- SSR 副作用：纯客户端组件迁移，避免 `window` 依赖在服务端执行；必要时 `use client`
- Tailwind 构建差异：优先使用现有预编译 CSS；仅在确认安全时接入 Tailwind 构建管线
- 数据与存储：先从 Mock 到受限真实环境，再逐步扩容；所有敏感配置信息通过环境变量管理

## 交付与验收
- 性能：首页 LCP/INP 不低于现有；接口 P95 延迟与错误率达标
- 文档：技术说明（架构、部署、环境变量）、API 规范（请求/响应/错误码）、测试与回滚指南
- 质量：通过所有回归用例与覆盖率阈值；零 UI/交互回归
