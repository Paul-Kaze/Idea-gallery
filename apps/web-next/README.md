# AI 图片画廊（Next.js 版）

## 技术栈
- Next.js（App Router，Route Handlers）
- 保留 Tailwind v4 预编译样式与 `globals.css`
- 数据：`@vercel/postgres`（可通过 `POSTGRES_URL`/`DATABASE_URL` 配置）
- 存储：AWS S3（`AWS_REGION`、`AWS_S3_BUCKET`、`AWS_ACCESS_KEY_ID`、`AWS_SECRET_ACCESS_KEY`）
- 认证：NextAuth Google（`GOOGLE_CLIENT_ID`、`GOOGLE_CLIENT_SECRET`）

## 启动
- 在 `apps/web-next` 目录安装依赖并运行 `npm run dev`
- 无环境变量时，接口回退到 Mock 数据

## 数据灌入（Supabase）
- 将 `SUPABASE_URL` 与 `SUPABASE_SERVICE_ROLE_KEY` 写入 `apps/web-next/.env`
- 生成测试数据：在项目根运行 `npm run generate:fixtures`
- 执行灌入：在 `apps/web-next` 运行 `npm run seed:supabase`
- 若未配置环境变量，脚本会退出并提示缺失变量

## API 说明
- `GET /api/images?page&size&viewport`：返回 `{ items, total, hasNext }`
- `GET /api/images/:id`：返回详情 `{ id, type, fullUrl, model, prompt, width, height, duration?, references[] }`
- `GET /api/download?id&type=original|thumb`：返回文件流或重定向到公开地址
- `POST /api/auth/google`：Mock 登录（真实登录：`/api/auth/[...nextauth]`）

## 性能与安全
- 接口设置 `Cache-Control` 与 `revalidate`
- 中间件实现 IP 限流（每分钟 100 次）
- 图片域名白名单：`images.unsplash.com`、`commondatastorage.googleapis.com`

## 测试
- 单元：Vitest + RTL；运行 `vitest`
- 覆盖率阈值：语句/分支/函数/行 ≥ 80%

## 回滚与切流
- 旧版保留于根目录（Vite SPA）；新版位于 `apps/web-next`
- 通过环境变量切换真实数据源与 Mock，快速回滚不影响 UI
## 已修复的运行时问题
- CSS 导入跨目录报错：Next.js 不允许从 `app/` 目录外直接 `@import` 根目录 `src/` 的样式。修复方式：将 `src/index.css` 与 `src/styles/globals.css` 完整拷贝至 `apps/web-next/styles/`，并在 `app/globals.css` 以相对路径导入（`@import '../styles/index.css'; @import '../styles/globals.css';`）。
- `react-responsive-masonry` 依赖缺失：运行时报 `Module not found: Can't resolve 'prop-types'`。修复方式：在 `apps/web-next/package.json` 增加依赖 `prop-types` 并安装。
- Hydration mismatch：服务端与客户端的瀑布流布局在水合过程中出现不一致（受视口与计算差异影响）。修复方式：在 `components/ImageGallery.tsx` 使用 `next/dynamic` 将 `ResponsiveMasonry` 与 `Masonry` 设为 `ssr:false`，仅在客户端渲染，从而避免服务端生成与客户端计算的差异。
- Next dev 锁冲突：`Unable to acquire lock .next/dev/lock`。修复方式：终止其他 dev 进程或删除锁文件后重启：`rm -f .next/dev/lock && npm run dev`。

## 测试与验证
- 在 `apps/web-next` 运行 `npm run test`，包含 API 与数据访问的覆盖率统计（≥ 85%），关键路由函数覆盖达 100%。
- 组件测试覆盖登录按钮交互、瀑布流卡片懒加载骨架、详情弹窗展开/关闭与下载按钮等核心交互。
