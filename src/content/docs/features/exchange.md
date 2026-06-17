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

### 基本用法

```javascript
import { exchange } from "./index.mjs";
await exchange(251230069, "13800138000");
```

第一个参数是奖品 ID（从 `printExchangeList` 获取），第二个参数是你的账号手机号。

### 按奖品名称兑换

如果不想记 ID，可以直接写奖品名称：

```javascript
import { exchange } from "./index.mjs";
await exchange("腾讯视频", "13800138000");
```

### 自定义提前量

默认在整点前 10ms 发起请求，可以调整：

```javascript
import { exchange } from "./index.mjs";
await exchange(251230069, "13800138000", 50);
```

第三个参数是提前多少毫秒，默认 10。

### 多账号同时兑换

```javascript
import { exchange } from "./index.mjs";
await exchange([
  [251230069, "13800138000"],
  ["酷狗音乐", "13900139000"],
], 50);
```

数组中每个元素是 `[奖品, 账号]`，最后一个参数是提前量。

### 跳过等待直接兑换

测试时可以跳过整点等待：

```javascript
import { exchange } from "./index.mjs";
await exchange(251230069, "13800138000", 10, true);
```

第四个参数 `true` 表示跳过等待，直接执行兑换。

**抢兑流程**：自动等待到运行时间（9:59:40 或 11:59:40）→ 预热（滑块验证）→ 精确等待整点 → 立即兑换

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
