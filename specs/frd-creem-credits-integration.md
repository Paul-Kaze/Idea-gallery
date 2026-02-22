[FRD]
# FRD: Creem 积分购买与展示集成

## 1. 概述

本功能为 Idea Gallery 项目集成 Creem 支付服务，实现用户积分（Credits）的购买与展示。核心交互路径为：用户点击顶部导航栏的 "Upgrade Plan" 按钮 → 弹出积分套餐选择弹窗 → 用户点击对应套餐的购买按钮 → 调用 Creem 支付服务 → 跳转至 Creem 支付页面完成支付 → 支付完成后通过 Webhook 更新用户积分余额。同时，顶部导航栏增加积分余额展示按钮，实时显示当前用户剩余积分数量。

### 技术方案

- **支付 SDK**: `@creem_io/nextjs` (Next.js 官方适配器)
- **积分存储**: 数据库 User 表新增 `credits` 字段
- **Webhook 验证**: HMAC-SHA256 签名校验
- **环境变量**: `CREEM_API_KEY`, `CREEM_WEBHOOK_SECRET`

---

## 2. 功能需求明细

| 一级功能 | 二级功能 | 三级功能 | 需求具体描述 | 优先级 |
|---|---|---|---|---|
| 顶部导航 | 积分展示按钮 | 显示位置 | 在 Header 右侧区域，"Upgrade Plan" 按钮左侧，新增一个独立的积分余额展示按钮。 | P0 |
| 顶部导航 | 积分展示按钮 | 显示内容 | 按钮内显示 Zap 图标 + 当前积分数量（如：⚡ 350）。未登录时隐藏该按钮。 | P0 |
| 顶部导航 | 积分展示按钮 | 实时刷新 | 用户完成支付后，积分余额需在下次页面加载或主动 refresh 时更新。 | P1 |
| 顶部导航 | 积分展示按钮 | 点击行为 | 点击积分展示按钮，直接打开升级弹窗（与 Upgrade Plan 按钮行为一致）。 | P2 |
| 顶部导航 | Upgrade Plan 按钮 | 打开弹窗 | 点击 "Upgrade Plan" 按钮，弹出积分套餐购买弹窗（Modal）。 | P0 |
| 积分购买弹窗 | 弹窗布局 | 弹窗结构 | Modal 居中展示，包含标题区、套餐卡片列表区、关闭按钮。背景添加半透明遮罩层。 | P0 |
| 积分购买弹窗 | 弹窗布局 | 标题区 | 顶部显示标题（如："Buy Credits"）和副标题（如："Power up your creativity"）。 | P1 |
| 积分购买弹窗 | 套餐卡片 | 卡片数量 | 展示至少 3 个积分套餐：小包（如 100 Credits / $2.99）、中包（如 500 Credits / $9.99）、大包（如 1200 Credits / $19.99）。 | P0 |
| 积分购买弹窗 | 套餐卡片 | 卡片内容 | 每个套餐卡片包含：套餐名称、积分数量、价格、单价（如：$0.030/credit）、"Buy" 购买按钮。 | P0 |
| 积分购买弹窗 | 套餐卡片 | 推荐标签 | 中包套餐添加"Most Popular"推荐标签，并以高亮样式区分。 | P1 |
| 积分购买弹窗 | 套餐卡片 | 购买按钮状态 | 正常态：可点击。加载态：点击后显示 Loading，禁止重复点击。错误态：请求失败时展示错误提示。 | P0 |
| 积分购买弹窗 | 套餐卡片 | 未登录处理 | 未登录用户点击购买，弹出提示引导登录，不跳转支付页面。 | P0 |
| Creem 支付集成 | Checkout 路由 | API 路由创建 | 新建 `app/api/checkout/route.ts`，使用 `@creem_io/nextjs` 的 `Checkout` 函数处理 GET 请求，接收 `productId` 参数，返回 Creem 支付页面 URL。 | P0 |
| Creem 支付集成 | Checkout 路由 | 参数传递 | 与 Creem 交互时，通过 `metadata.referenceId` 传递当前用户 ID，用于 Webhook 中识别需要充值的用户。 | P0 |
| Creem 支付集成 | Checkout 路由 | 成功跳转 | 支付成功后跳转至 `/payment/success` 页面，URL 包含 `checkout_id` 参数。 | P0 |
| Creem 支付集成 | Webhook 处理 | Webhook 路由创建 | 新建 `app/api/webhooks/creem/route.ts`，使用 HMAC-SHA256 验证 `creem-signature` 请求头，确保来源合法。 | P0 |
| Creem 支付集成 | Webhook 处理 | 事件处理 | 监听 `checkout.completed` 事件，根据 `metadata.referenceId` 找到对应用户，按套餐 `productId` 为用户积分字段（`credits`）增加对应积分数量。 | P0 |
| Creem 支付集成 | Webhook 处理 | 幂等性 | 记录已处理的 `checkoutId`，避免同一笔订单重复发放积分。 | P1 |
| 积分查询 API | 用户积分接口 | 接口创建 | 新建 `app/api/user/credits/route.ts`，GET 请求，返回当前登录用户的积分余额。 | P0 |
| 积分查询 API | 用户积分接口 | 权限校验 | 接口需进行 Session 校验，未登录返回 401。 | P0 |
| 支付成功页 | 成功页面 | 页面创建 | 新建 `app/payment/success/page.tsx`，展示支付成功提示，显示 Order ID，提供"返回首页"按钮。 | P1 |
| 数据库变更 | User 表 | 字段新增 | User 表新增 `credits` 整数字段，默认值为 `0`，用于记录用户积分余额。 | P0 |
| 数据库变更 | 订单记录表 | 表创建 | 新建 `CreditOrder` 表，记录每笔充值订单：`id`, `userId`, `checkoutId`, `productId`, `creditsAwarded`, `createdAt`。 | P1 |

---

## 3. 积分套餐配置

以下为前端静态配置的套餐信息（productId 需在 Creem 控制台创建后填入）：

| 套餐名 | Credits 数量 | 价格 | Creem Product ID |
|---|---|---|---|
| Starter Pack | 100 Credits | $2.99 | `prod_xxx_100` |
| Popular Pack | 500 Credits | $9.99 | `prod_xxx_500` |
| Pro Pack | 1200 Credits | $19.99 | `prod_xxx_1200` |

---

## 4. 错误处理

| 错误代码 | 场景 | 系统响应 |
|---|---|---|
| ERR-P001 | 用户未登录点击购买 | 弹出提示"请先登录后再购买"，提供登录按钮 |
| ERR-P002 | 调用 Checkout API 失败（网络/服务异常） | 按钮恢复正常态，Toast 提示"支付链接生成失败，请稍后重试" |
| ERR-P003 | Webhook 签名验证失败 | 返回 401，不处理积分发放 |
| ERR-P004 | Webhook 重复投递（checkoutId 已处理） | 返回 200（正常响应），不重复发放积分 |
| ERR-P005 | 找不到 Webhook 中的目标用户 | 记录错误日志，返回 200，需人工处理 |

---

## 5. API / 接口规范 (概要)

### 5.1 创建支付 Checkout

- **Endpoint**: `GET /api/checkout?productId={productId}&successUrl=/payment/success`
- **技术**: 使用 `@creem_io/nextjs` 的 `Checkout()` 处理函数
- **输入**: `productId` (Query Param), `referenceId` (用户ID，通过 metadata 传入)
- **输出**: 重定向至 Creem 支付页面 URL

### 5.2 查询当前用户积分

- **Endpoint**: `GET /api/user/credits`
- **Auth**: Session 必须存在
- **Output**:
  ```json
  {
    "credits": 350
  }
  ```

### 5.3 Webhook 接收积分充值事件

- **Endpoint**: `POST /api/webhooks/creem`
- **Header**: `creem-signature: <hmac_sha256_signature>`
- **Input** (事件 `checkout.completed`):
  ```json
  {
    "type": "checkout.completed",
    "data": {
      "id": "checkout_xxx",
      "product_id": "prod_xxx_500",
      "customer_id": "cust_xxx",
      "metadata": {
        "referenceId": "user_123"
      }
    }
  }
  ```
- **Output**: `{ "received": true }`

---

## 6. 新增/修改文件清单

| 操作 | 文件路径 | 说明 |
|---|---|---|
| 新增 | `app/api/checkout/route.ts` | Creem Checkout 路由处理 |
| 新增 | `app/api/webhooks/creem/route.ts` | Webhook 接收与积分发放 |
| 新增 | `app/api/user/credits/route.ts` | 查询当前用户积分接口 |
| 新增 | `app/payment/success/page.tsx` | 支付成功页面 |
| 新增 | `components/CreditsModal.tsx` | 积分套餐购买弹窗组件 |
| 修改 | `components/Header.tsx` | 新增积分展示按钮，为 Upgrade Plan 按钮绑定弹窗开关事件 |
| 修改 | `prisma/schema.prisma` | User 表新增 credits 字段，新增 CreditOrder 表 |
| 修改 | `.env.local` | 新增 `CREEM_API_KEY`, `CREEM_WEBHOOK_SECRET` |

---

## 7. 质量门禁 (Quality Gates)

在提交代码或合并请求前，必须通过以下命令：

- `npm run build` (确保构建成功，包含类型检查)
- `npm run lint` (确保代码风格符合规范)
- `npm run test` (运行单元测试，确保无回归)

---

## 8. 环境变量

```env
# .env.local
CREEM_API_KEY=creem_test_your_api_key_here
CREEM_WEBHOOK_SECRET=whsec_your_webhook_secret_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

[/FRD]
