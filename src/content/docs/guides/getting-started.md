---
title: 快速开始
description: 安装、配置和运行 mcloud-sign
---

## 环境要求

从源码开发或构建需要：

- Node.js >= 20
- npm >= 10

运行发布产物时，根据产物选择 Node.js 或 txiki.js。

## 安装与构建

```bash
git clone https://github.com/catlair/mcloud-sign.git
cd mcloud-sign
npm install

# 构建 Node.js 单文件
npm run build:cli

# 构建 txiki.js 单文件
npm run build:cli:tjs
```

两个命令默认都写入 `out/index.mjs`：

- `npm run build:cli` 生成 Node.js 目标。
- `npm run build:cli:tjs` 生成 txiki.js 目标，并会覆盖同名文件。

如需同时保留两个目标的产物，应在每次构建后自行复制或重命名。txiki.js 构建将 `tjs:*` 保留为运行时模块。

:::note
仓库根目录的 `npm run build` 会构建全部 workspaces，不等同于仅生成发布用 CLI 单文件。
:::

## 创建配置

推荐使用 [配置生成器](/config-generator)，或者在运行目录创建 `asign.json`：

```json
{
  "version": 2,
  "caiyun": [
    {
      "auth": "Base64 编码的认证字符串",
      "nickname": "主账号"
    }
  ]
}
```

`version` 固定为 `2`，`caiyun` 是账号数组，每个账号必须提供 `auth`。

### 获取 auth

1. 登录移动云盘网页或 App 对应页面。
2. 在浏览器开发者工具的 Network 面板中查看请求。
3. 复制请求头中的 `authorization` 完整值。
4. 将它写入本地配置；不要提交到 Git，也不要粘贴到公开日志或问题反馈中。

## 运行

### 开发模式

```bash
npm run dev:cli
```

### Node.js 单文件

```bash
node out/index.mjs
```

### 编程调用

```javascript
import { run } from "./out/index.mjs";

await run();
// 或指定配置文件
await run("/absolute/path/to/asign.json");
```

`run` 仅接受可选的配置文件路径，不接受配置对象。

## 默认执行流程

每个账号会独立初始化并依次执行：

1. 网盘签到、复活奖励和任务扩展。
2. 拍拍系列活动、趣玩 AI 抽奖和红包派对等已接入调度的活动。
3. 消息推送奖励、通知奖励、备份礼物和 App 任务。
4. 云朵大作战（按配置）。
5. 待领取奖品、领取云朵和临时文件清理。

:::caution[已过期功能]
微信签到 `signInWx`、微信抽奖 `wxDraw` 和摇一摇 `shakeTask` 已过期，不在当前 CLI 中执行，也不应继续配置。
:::

下一步可阅读 [配置详解](/guides/configuration) 和 [部署](/guides/deployment)。
