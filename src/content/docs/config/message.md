---
title: 消息推送
description: 推送触发条件、内容过滤与渠道配置
---

在顶层 `message` 字段配置推送：

```json
{
  "version": 2,
  "caiyun": [{ "auth": "认证信息" }],
  "message": {
    "title": "mcloud-v2 运行推送",
    "onlyError": false,
    "minLevel": "info",
    "pushplus": { "token": "你的 token" }
  }
}
```

## 全局字段

| 字段 | 默认值 | 说明 |
| --- | --- | --- |
| `title` | `"mcloud-v2 运行推送"` | 推送标题 |
| `onlyError` | `false` | 只有出现 `error` 类型日志时才发送 |
| `minLevel` | `"info"` | 控制推送正文收录哪些日志类型 |

### onlyError 与 fail

`error` / `fatal` 表示运行错误；`fail` 是 info 级业务结果。

- `fail` 不影响 CLI 退出码。
- `fail` 不会触发 `onlyError`。
- `minLevel: "error"` 的内容过滤会收录映射到最低过滤组的 `error`、`fatal` 和 `fail`，但这不会改变 `fail` 的业务语义。

## minLevel

| 值 | 推送正文包含内容 |
| --- | --- |
| `error` | `error`、`fatal`，以及业务结果类型 `fail` |
| `warn` | 上述内容及 `warn` |
| `info` | 上述内容及 `info`、`success`、`start`（默认） |
| `debug` | 全部日志 |

`onlyError` 决定是否发送，`minLevel` 决定发送时正文包含哪些内容，两者职责不同。

## 支持渠道

| 渠道 | 配置字段 | 必填字段 |
| --- | --- | --- |
| PushPlus | `pushplus` | `token` |
| Server酱 | `serverChan` | `token` |
| 企业微信应用 | `workWeixin` | `corpid`、`corpsecret` |
| 企业微信机器人 | `workWeixinBot` | `url` |
| Telegram | `tgBot` | `token`、`chat_id`；可选 `apiHost` |
| Bark | `bark` | `key`；可选 `level` |
| 钉钉 | `dingTalk` | `token`；可选 `secret` |
| SMTP 邮件 | `email` | `host`、`from`、`pass` |
| 回逍 | `twoIm` | `key`、`sid` |
| 自定义请求 | `customPost` | `url`；支持单个对象或数组 |

:::note[运行时差异]
当前邮件推送在共享模块中动态导入 `nodemailer`，已提交构建配置没有为 txiki.js 替换成无操作适配。Node.js 可按配置使用 SMTP；txiki.js 目标启用邮件推送前需要单独验证兼容性。
:::

## Telegram 示例

```json
{
  "message": {
    "tgBot": {
      "token": "bot token",
      "chat_id": "chat id",
      "apiHost": "api.telegram.org"
    }
  }
}
```

## 自定义请求

```json
{
  "message": {
    "customPost": {
      "url": "https://example.com/notify",
      "method": "POST",
      "headers": {
        "Authorization": "Bearer ..."
      },
      "data": {
        "title": "{title}",
        "content": "{text}"
      }
    }
  }
}
```

`url` 和 `data` 支持 `{title}`、`{text}` 占位符。认证 token、Webhook、邮箱授权码等均属于敏感配置，不应提交到版本控制。
