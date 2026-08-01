---
title: 部署与定时运行
description: 使用单文件产物运行和调度 mcloud-sign
---

## Node.js 单文件部署

将以下文件放在同一工作目录：

```text
index.mjs
asign.json
```

运行：

```bash
node index.mjs
```

该命令使用根 `tsup.config.ts` 生成单文件入口。部署前应对实际产物做一次运行验证，确认目标环境能够提供产物保留的运行时模块。

## cron 定时运行

```text
# 每天早上 8:00 执行
0 8 * * * cd /path/to/mcloud-sign && /usr/bin/node index.mjs >> run.log 2>&1
```

建议：

- 使用绝对路径，避免 cron 的 PATH 与交互式终端不同。
- 保留工作目录切换，确保自动发现正确的配置文件。
- 对 `asign.json` 设置仅当前用户可读的文件权限。
- 先在终端手工运行一次，再加入定时任务。

## 编程调用

```javascript
import { run } from "./index.mjs";

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
} from "./index.mjs";
```

- `drawRedFlower(codes, configPath?)`：遍历配置账号领取指定口令。
- `exchange(...)`：独立兑换入口。
- `printExchangeList()`：打印兑换列表。

## txiki.js

运行 `npm run build:cli:tjs` 也会生成 `out/index.mjs`，并覆盖此前的 Node.js 目标产物。该构建通过 alias 将 Node Runtime 替换为 txiki.js Runtime，统一文件系统、路径、Buffer、加密、压缩和进程信息等基础能力。

当前已提交 Runtime 接口不包含 WebSocket；直播任务仍直接依赖 Node.js 的 `ws`。邮件推送也仍在共享推送模块中动态导入 `nodemailer`。因此不能把当前 txiki.js 产物描述为已经完整适配直播 WebSocket 与 SMTP，部署前应按实际启用功能验证。
