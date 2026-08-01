---
title: 云朵兑换
description: 查看奖品与整点兑换
---

单文件 CLI 导出 `printExchangeList` 和 `exchange`，可以在普通签到之外独立调用。

## 查看奖品

```javascript
import { printExchangeList } from "./index.node.mjs";

await printExchangeList();
```

函数会加载当前配置并打印可兑换奖品、云朵价格、库存与兑换限制。

## 兑换指定奖品

```javascript
import { exchange } from "./index.node.mjs";

// 奖品 ID + 第一个账号
await exchange(251230069, 1);

// 按名称查找 + 按昵称选择账号
await exchange("腾讯视频", "主账号");
```

账号数字从 `1` 开始；字符串按 `nickname` 匹配。

## 提前量

第三个参数是整点前的请求提前量，默认 `10` 毫秒：

```javascript
await exchange(251230069, "主账号", 50);
```

执行流程包括等待预热时间、上报访问日志、获取滑块偏移量、精确等待整点和提交兑换。验证失败代码为 `514` 时会重新获取滑块并重试一次。

## 多账号并发

```javascript
await exchange([
  [251230069, "主账号"],
  ["酷狗音乐", "小号"]
], 50);
```

数组项为 `[奖品 ID 或名称, 账号索引或昵称]`；第二个参数在数组模式下作为提前量。

## 测试模式

第四个参数 `true` 会跳过时间等待并立即兑换：

```javascript
await exchange(251230069, 1, 10, true);
```

这仍会实际请求兑换接口，只应在明确需要时使用。

## 指定配置文件

`exchange` 的第五个参数可指定配置路径：

```javascript
await exchange(251230069, 1, 10, false, "/absolute/path/to/asign.json");
```
