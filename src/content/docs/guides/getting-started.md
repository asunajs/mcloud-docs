---
title: 快速开始
description: 安装、配置和运行 mcloud-sign
---

## 环境要求

- Node.js >= 18
- npm / yarn / pnpm

## 安装

### 方式一：使用编译后的单文件（推荐）

1. 下载编译后的单文件 `index.mjs`，放在你的项目目录中
2. 安装可选依赖（如需代理或邮件推送）：

```bash
# hpagent（代理支持，可选）
npm install hpagent

# nodemailer（邮件推送，可选）
npm install nodemailer
```

### 方式二：从源码构建

```bash
git clone https://github.com/catlair/mcloud-sign.git
cd mcloud-sign
npm install
npm run build:bundle
```

产物在 `out/index.mjs`，复制出来即可使用。

## 配置

在同级目录创建 `asign.json`（或 `asign.config.js`）：

```json
{
  "caiyun": [
    {
      "auth": "你的auth字符串"
    }
  ]
}
```

### 如何获取 auth

1. 登录 [移动云盘网页版](https://m.mcloud.139.com)
2. 打开浏览器开发者工具 → Network
3. 找到任意请求，复制请求头中的 `authorization` 字段值

## 运行

```bash
node index.mjs
```

或创建一个入口脚本：

```javascript
import { run } from "./index.mjs";
await run();
```

## 执行顺序

运行后会自动执行以下任务：

1. `signIn` — 每日签到
2. `revivalRewardTask` — 复活奖励
3. `taskExpansionTask` — 备份翻倍
4. `signInWx` — 微信签到
5. `wxDraw` — 微信抽奖
6. `appTask` — 应用任务（上传、分享等）
7. `shakeTask` — 摇一摇（需配置开启）
8. `msgPushOnTask` — 消息推送奖励
9. `backupGiftTask` — 备份好礼
10. `aiAvatarTask` — AI 新头像（需配置开启）
11. `hc1tTask` — 云朵大作战（需配置开启）
12. `playAiSpecialTask` — 春日拍拍（需配置开启）
13. `receive` — 领取云朵
14. `printPendingPrizes` — 打印待领取奖品
