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
| WebSocket | 已提交直播任务直接使用 Node.js `ws` |
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
- 压缩与解压。
- 进程与运行环境信息。

当前已提交的 `Runtime` 接口不包含 WebSocket。直播任务仍直接导入 Node.js `ws`，因此 WebSocket 尚未纳入双运行时统一适配边界。

## 构建边界

根 `tsup.config.ts` 关闭代码分割，并分别提供 Node.js 与 txiki.js 构建目标：

- Node.js 使用 `platform: node` 和 `target: node20`。
- txiki.js 使用 `platform: neutral` 和 `target: esnext`，仅显式 externalize `tjs:*`。
- 两个命令都输出 `out/index.mjs`，后一次构建会覆盖前一次产物。
- tjs alias 只替换 Runtime 的 Node 实现；SMTP 和直播 WebSocket 尚未按构建目标拆分。

因此当前架构已统一多项基础运行时能力，但尚不能把所有功能视为完整的双运行时适配。
