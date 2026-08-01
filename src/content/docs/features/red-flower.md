---
title: 小红花与直播口令
description: 手工口令领取与直播口令核心任务边界
---

mcloud-sign 已提供手工口令领取入口，并包含直播 WebSocket 口令抓取的核心任务。

:::caution[尚未接入默认流程]
`liveRoomKoulingTask` 当前没有配置开关，也未接入 CLI 默认调度。正式配置 schema 中不存在 `直播口令` 字段，不应把它写入 `asign.json`。
:::

## 手工领取

单文件入口导出 `drawRedFlower`：

```javascript
import { drawRedFlower } from "./index.mjs";

await drawRedFlower([
  "云盘宠粉会员日",
  "会员日福利多多"
]);
```

该入口会加载配置并遍历全部有效账号。也可以传入第二个参数指定配置路径：

```javascript
await drawRedFlower(["口令内容"], "/absolute/path/to/asign.json");
```

## 领取过程

对每个账号，程序会：

1. 获取当前小红花数量。
2. 上报直播活动所需埋点。
3. 尝试领取首次参与奖励。
4. 逐个兑换口令。
5. 查询复活花和最终数量。

已兑换口令等接口业务结果会记录为 info；请求或运行异常才记录 error。

## 已提交的自动抓取核心

`getLiveKouling` 会尝试从移动云盘直播间获取口令：

1. 优先通过 WebSocket 实时监听直播弹幕。
2. 未获取到口令时，尝试读取聊天历史接口。
3. 使用集合合并去重后返回口令。

`liveRoomKoulingTask` 会调用该函数，再执行小红花领取。但它目前只是核心能力，不属于 CLI 默认执行流程。

## 注意事项

- 口令通常有活动时效，过期后接口会返回业务结果。
- 聊天历史接口可能不可用，代码会将其作为 WebSocket 未命中后的尝试，而不是可保证成功的来源。
- 手工调用时仍建议自行去重。
