---
title: 部署
description: 定时运行与自动化部署
---

## 定时运行

配合 cron 实现每日自动签到：

```bash
# 每天早上 8:00 执行
0 8 * * * cd /path/to/project && node index.mjs
```

## 编程方式运行

### 自动加载配置文件

```javascript
import { run } from "./index.mjs";
await run();
```

### 指定配置文件路径

```javascript
await run("/path/to/asign.json");
```

### 传入配置对象

```javascript
await run({
  caiyun: [{ auth: "你的auth" }],
});
```

### 单账号执行

```javascript
import { main } from "./index.mjs";
const result = await main({ auth: "你的auth" }, { logger: console });
```
