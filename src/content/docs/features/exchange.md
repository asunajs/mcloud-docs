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

## 定时整点抢兑

创建 `rush.mjs`，在整点前运行：

```javascript
import { useExchange, loadConfig } from "./index.mjs";

const { config } = await loadConfig();
const { exchange } = await useExchange(config[0]);

// 整点前运行，自动等待到整点并抢兑
// 参数为奖品 ID 数组（从 printExchangeList 获取）
await exchange([231228018]);

// 第二个参数为等待偏移量（毫秒），正数提前，负数延后，默认 10ms
await exchange([231228018], 50); // 提前 50ms
await exchange([231228018], -20); // 延后 20ms
```

```bash
# 在整点前几分钟运行
node rush.mjs
```

**抢兑流程**：预热（滑块验证）→ 精确等待整点 → 立即兑换

## 跳过等待直接兑换

```javascript
const { exchange } = await useExchange(config[0], { skipDelay: true });
await exchange([231228018]);
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
