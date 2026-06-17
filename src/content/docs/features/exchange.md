---
title: 云朵兑换
description: 云朵兑换功能说明（普通兑换 + 整点抢兑）
---

兑换用于将签到累积的云朵兑换为奖品（如视频会员）。

## 查看可兑换奖品

创建 `exchange.mjs`：

```javascript
import { printExchangeList } from "./index.mjs";
await printExchangeList();
```

```bash
node exchange.mjs
```

输出示例：

```
------【兑换奖品列表】------
【热门兑换】
231228018 | 200云朵 | 视频会员7天 | 可兑换 | 今日剩余: 50/100
------------------------
```

## 整点抢兑

```javascript
import { exchange } from "./index.mjs";

// 单账号兑换（奖品ID + 账号手机号/昵称）
await exchange(251230069, "13800138000");

// 按名称兑换
await exchange("腾讯视频", "我的账号");

// 自定义提前量（毫秒，默认 10ms）
await exchange(251230069, "13800138000", 50);

// 多账号并发兑换
await exchange([
  [251230069, "13800138000"],
  ["酷狗音乐", "我的账号"],
], 50);
```

**抢兑流程**：自动等待到运行时间（9:59:40 或 11:59:40）→ 预热（滑块验证）→ 精确等待整点 → 立即兑换

跳过等待（测试用）：

```javascript
await exchange(251230069, "13800138000", 10, true);
```

## 按条件查找奖品

```javascript
import { getExchangeList, findPrize } from "./index.mjs";

const list = await getExchangeList();
if (!list) return;

// 按名称查找
const prize = findPrize(list, { name: "视频会员" });

// 按类型查找，优先库存最多的
const prize = findPrize(list, { type: 1, byRemainder: true });
```
