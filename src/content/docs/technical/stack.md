---
title: 技术栈与架构
description: mcloud-sign monorepo、依赖方向与双运行时设计
---

## 技术栈

| 类别 | 技术 |
| --- | --- |
| 语言 | TypeScript 6 |
| 运行时 | Node.js 20+ / txiki.js |
| 工作区 | npm workspaces |
| 构建 | tsup / esbuild |
| HTTP | ofetch |
| WebSocket | Node.js 使用 `ws`，txiki.js 使用原生 WebSocket |
| 协议 | SockJS + Protobuf |
| 配置描述 | Valibot schema + 生成的类型和 JSON Schema |
| 测试 | Vitest + Node/tjs 运行时对比测试 |
| 质量工具 | oxlint / oxfmt / TypeScript |

## Monorepo

```text
mcloud-sign/
├── packages/
│   ├── runtime/   # Node.js / txiki.js 能力适配
│   ├── shared/    # 配置、日志、HTTP、推送、工具
│   ├── core/      # 业务任务、API 调用、直播协议
│   ├── cli/       # 命令行和单文件入口
│   └── api/       # API 服务入口
├── scripts/       # 统一构建脚本
├── test/          # 在线或集成诊断脚本
└── tsup.config.ts # CLI 单文件构建
```

## 依赖方向

```text
cli ─────┐
         ├──> core ──> shared ──> runtime
api ─────┘
```

- `runtime` 不依赖业务模块，负责跨运行时能力。
- `shared` 提供配置、日志、HTTP、推送和通用工具。
- `core` 实现账号初始化、签到、活动、直播口令和兑换。
- `cli` / `api` 是组合与调度层。

## Runtime Adapter

`@asunajs/runtime` 统一以下差异：

- 文件系统和路径。
- Buffer 与文本编码。
- 加密与随机字节。
- WebSocket 事件和二进制消息。
- 进程与运行环境信息。

Node.js WebSocket 适配器包装 `ws`；txiki.js 使用原生 WebSocket，并将 `binaryType` 设为 `arraybuffer`，以便 Protobuf 解码得到一致的二进制输入。

## 构建边界

CLI 单文件会内联第三方运行依赖：

- Node.js 版本只 externalize Node.js 内置模块。
- txiki.js 版本只 externalize `tjs:*`。
- SMTP 实现按构建目标替换：Node.js 使用真实实现，txiki.js 使用无操作适配。

这种边界使产物可独立分发，同时避免把运行时本身已经提供的模块重复打包。
