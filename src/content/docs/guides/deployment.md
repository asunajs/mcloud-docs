---
title: 部署与定时运行
description: 使用单文件产物运行和调度 mcloud-sign
---

## Node.js 单文件部署

将以下文件放在同一工作目录：

```text
index.node.mjs
asign.json
```

运行：

```bash
node index.node.mjs
```

第三方运行依赖已经内联，无需在部署目录再次安装项目依赖。Node.js 内置模块仍由运行时提供。

## cron 定时运行

```text
# 每天早上 8:00 执行
0 8 * * * cd /path/to/mcloud-sign && /usr/bin/node index.node.mjs >> run.log 2>&1
```

建议：

- 使用绝对路径，避免 cron 的 PATH 与交互式终端不同。
- 保留工作目录切换，确保自动发现正确的配置文件。
- 对 `asign.json` 设置仅当前用户可读的文件权限。
- 先在终端手工运行一次，再加入定时任务。

## 编程调用

```javascript
import { run } from "./index.node.mjs";

// 自动搜索配置
await run();

// 指定配置文件
await run("/absolute/path/to/asign.json");
```

当前 `run(configPath?: string)` 只接受配置路径，不接受配置对象，也不导出 `main` 单账号入口。

## 独立功能入口

Node.js 单文件同时导出：

```javascript
import {
  drawRedFlower,
  exchange,
  printExchangeList,
  run,
} from "./index.node.mjs";
```

- `drawRedFlower(codes, configPath?)`：遍历配置账号领取指定口令。
- `exchange(...)`：独立兑换入口。
- `printExchangeList()`：打印兑换列表。

## txiki.js

项目也可生成 `out/index.tjs.mjs`。该版本使用 txiki.js Runtime Adapter，WebSocket、文件系统、加密和 Buffer 等能力由运行时抽象统一。SMTP 邮件推送仅在 Node.js 运行时可用，txiki.js 构建会使用对应的无操作适配实现。
