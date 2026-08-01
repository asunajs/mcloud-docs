---
title: 构建与验证
description: 当前 workspace、CLI 单文件和质量检查命令
---

## 安装依赖

```bash
npm install
```

项目使用 npm workspaces，根安装会链接 `packages/*`。

## 常用命令

```bash
# 构建全部 workspaces
npm run build

# 构建 Node.js CLI 单文件
npm run build:cli

# 构建 txiki.js CLI 单文件
npm run build:cli:tjs

# 运行全部 workspace 测试
npm test

# 类型检查
npm run typecheck

# 代码检查
npm run lint

# 格式化
npm run fmt
```

## CLI 单文件产物

根 `tsup.config.ts` 以 `packages/cli/src/index.ts` 为入口，关闭代码分割并内联第三方运行依赖：

```text
out/index.node.mjs
out/index.tjs.mjs
```

- Node.js 目标：`platform: node`、`target: node20`。
- txiki.js 目标：`platform: neutral`、`target: esnext`。
- 版本号由根 `package.json` 注入 `__APP_VERSION__`。
- tjs 构建通过 alias 将 Node Runtime 与 SMTP 实现替换为 tjs 版本。

## 其他构建脚本

`scripts/build.ts` 还能生成 runtime 库和 `dist/mcloud-sign.*.mjs` 系列产物；`packages/cli/scripts/build-tjs.ts` 支持把 tjs bundle 编译或组合为目标平台可执行文件。这些脚本面向开发和发布流程，普通用户优先使用根 `build:cli` / `build:cli:tjs`。

## 验证建议

提交前至少运行：

```bash
npm test
npm run build
npm run typecheck
npm run lint
```

需要验证发布产物时，再额外运行两个 CLI 单文件构建，并检查产物中没有残留第三方裸导入。
