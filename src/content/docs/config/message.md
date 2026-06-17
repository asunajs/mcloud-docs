---
title: 消息推送
description: 消息推送渠道配置
---

在配置文件的 `message` 字段中配置推送渠道：

```json
{
  "caiyun": [{ "auth": "..." }],
  "message": {
    "title": "签到推送",
    "onlyError": false,
    "pushplus": { "token": "你的token" }
  }
}
```

## 支持的推送渠道

| 渠道 | 配置字段 | 说明 |
| --- | --- | --- |
| PushPlus | `pushplus: { token }` | [pushplus.plus](https://www.pushplus.plus/) |
| Server酱 | `serverChan: { token }` | [sct.ftqq.com](https://sct.ftqq.com/) |
| 企业微信应用 | `workWeixin: { corpid, corpsecret, agentid }` | 企业微信自建应用 |
| 企业微信机器人 | `workWeixinBot: { url }` | 群机器人 webhook |
| Telegram | `tgBot: { token, chat_id, proxy? }` | Telegram Bot |
| Bark | `bark: { key }` | iOS Bark |
| 钉钉 | `dingTalk: { token, secret }` | 钉钉机器人 |
| 邮件 | `email: { host, port, from, pass, to }` | SMTP 邮件 |
| TwoIm | `twoIm: { key, sid }` | 回逍推送 |
| 自定义 | `customPost: { url, data }` | 自定义 POST |

## 多渠道推送

```json
{
  "message": {
    "title": "签到推送",
    "pushplus": { "token": "xxx" },
    "tgBot": { "token": "xxx", "chat_id": "xxx" },
    "bark": { "key": "xxx" }
  }
}
```

## 仅错误推送

```json
{
  "message": {
    "onlyError": true
  }
}
```
