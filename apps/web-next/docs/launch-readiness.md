# Dommi 上线前补齐清单

本文记录本轮已经处理的上线前 P0 项，以及正式发布前仍需要在部署平台和运营流程中确认的事项。

## 本轮已处理

### 1. 移除 Mock 登录接口

已删除 `app/api/auth/google/route.ts`。

正式登录入口统一使用 NextAuth：

```txt
/api/auth/[...nextauth]
```

README 中关于 `POST /api/auth/google` 的 Mock 登录说明也已移除。

### 2. 补完整 Supabase 生产迁移

已将 `scripts/supabase-baby-generations.sql` 替换为生产 schema。

迁移覆盖：

- `users`
- `tool_generations`
- `credit_orders`
- legacy `baby_generations`
- 用户邮箱、订单号等唯一约束
- 常用查询索引
- `updated_at` trigger
- RLS 策略
- 可选的积分安全 RPC：`spend_credits_for_tool`
- 可选的 webhook 幂等 RPC：`award_credits_for_checkout`

上线前需要在 Supabase SQL Editor 中执行该脚本。

### 3. 调整隐私文案

已移除 AI Baby Generator 工具页中的过度承诺文案：

- 不再写过度的加密等级承诺
- 不再写当前后端尚未实现的 24 小时自动删除承诺
- 不再写“遗传预测”“800 facial anchors”等当前产品未证明的能力

当前文案改为：照片会用于生成结果，生成结果可能保存在账号历史中，用户应上传有权限使用的图片，并查看隐私政策了解存储和删除细节。

### 4. 限制下载接口 URL 来源

已收紧 `app/api/tools/download/route.ts`。

现在只允许下载以下来源：

- `OSS_BUCKET + OSS_ENDPOINT` 组成的自有 OSS host
- `DOWNLOAD_ALLOWED_HOSTS` 配置的 CDN/资源 host
- `NEXT_PUBLIC_CDN_HOST` 配置的 CDN host

不再允许接口 fetch 任意外部 URL。

### 5. 补 SEO 基础设施

已新增：

- `app/sitemap.ts`
- `app/robots.ts`
- `/m` 模型索引页
- 全站 `metadataBase`
- 默认 Open Graph / Twitter metadata
- Google Search Console 环境变量：`GOOGLE_SITE_VERIFICATION`
- Bing Webmaster Tools 环境变量：`BING_SITE_VERIFICATION`

Sitemap 会包含首页、工具页、AI Baby Generator、模型索引页和所有模型详情页。

### 6. 移除用户可见服务端凭据文案

已将生成接口缺少服务端凭据时的用户可见错误改为：

```txt
Generation service is temporarily unavailable.
```

不再向用户展示服务端凭据相关字样。

### 7. 增加埋点与错误告警

已新增客户端和服务端埋点基础设施：

- `page_viewed`
- `signup_completed`
- `login_started`
- `login_completed`
- `upload_completed`
- `generation_started`
- `generation_succeeded`
- `generation_failed`
- `insufficient_credits`
- `checkout_started`
- `checkout_failed`
- `checkout_redirected`
- `payment_success`
- `payment_pending`
- `cta_clicked`
- `internal_link_clicked`

已新增通用错误告警 hook，用于 API、Creem webhook 和模型生成失败。配置 `ERROR_ALERT_WEBHOOK_URL` 或 `ALERT_WEBHOOK_URL` 后，会向对应 webhook 推送告警。

### 8. 补齐产品闭环页面

已新增 `/assets` 页面，用于展示账号下的生成历史。侧边栏 Assets 入口已从占位 `#` 改为真实路由。

支付成功页已改为 pending 状态，会轮询 checkout 状态或账户积分，避免 webhook 延迟时立即宣称积分已到账。

### 9. 拆分正式法律页面

已将 `/legal` 拆成法律中心和独立政策页：

- `/legal/terms`
- `/legal/privacy`
- `/legal/refund`
- `/legal/ai-content-policy`
- `/legal/deletion-policy`

### 10. 补 SEO 内链结构

已新增 baby generator 相关长尾页，并加入 sitemap：

- `/future-baby-generator`
- `/baby-ai-generator-free`
- `/ai-baby-face-generator-free`
- `/what-will-my-baby-look-like`

这些页面会互链到 `/ai-baby-generator` 和 `/tools/ai-baby-generator`。模型索引页 `/m` 也已增加到核心工具页和 AI Baby Generator 的内链。

## 正式上线前还需要确认

### Supabase

- 在生产项目执行 `scripts/supabase-baby-generations.sql`
- 确认 `users.email` 唯一索引存在
- 确认 `credit_orders.checkout_id` 唯一索引存在
- 确认服务端使用 `SUPABASE_SERVICE_ROLE_KEY`
- 确认前端不会直接写入 RLS 保护表

### 环境变量

生产环境至少需要配置：

```txt
NEXT_PUBLIC_APP_URL=https://dommi.ai
NEXT_PUBLIC_AUTH_ENABLED=true
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
POSTHOG_API_KEY=
POSTHOG_HOST=https://us.i.posthog.com
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
AUTH_SECRET=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
OSS_ENDPOINT=
OSS_BUCKET=
OSS_ACCESS_KEY_ID=
OSS_ACCESS_KEY_SECRET=
OPENROUTER_API_KEY=
CREEM_API_KEY=
CREEM_WEBHOOK_SECRET=
DOWNLOAD_ALLOWED_HOSTS=
ERROR_ALERT_WEBHOOK_URL=
GOOGLE_SITE_VERIFICATION=
BING_SITE_VERIFICATION=
```

### Legal

当前文案已经避免过度承诺，但正式上线仍建议补齐：

- Privacy Policy
- Terms of Service
- Refund Policy
- AI Content Policy
- Photo retention / deletion policy
- 联系邮箱和删除请求入口

### SEO

上线后需要提交：

- `https://dommi.ai/sitemap.xml` 到 Google Search Console
- `https://dommi.ai/sitemap.xml` 到 Bing Webmaster Tools

并检查：

- `/robots.txt` 可访问
- `/sitemap.xml` 可访问
- `/m` 可访问
- `/m/*` 模型页 canonical 正确
- `/ai-baby-generator` canonical 正确
- `/future-baby-generator` 等 baby 长尾页可访问

### 验证

本轮代码改动后已运行：

```bash
npm run build
npm run test
```

两个命令均通过。
