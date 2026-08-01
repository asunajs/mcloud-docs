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

根 `tsup.config.ts` 以 `packages/cli/src/index.ts` 为入口，关闭代码分割。两个构建命令默认都输出：

```text
out/index.mjs
```

- Node.js 目标：`platform: node`、`target: node20`。
- txiki.js 目标：`platform: neutral`、`target: esnext`，并将 `tjs:*` 标为 external。
- 版本号由根 `package.json` 注入 `__APP_VERSION__`。
- tjs 构建通过 alias 将 `packages/runtime/src/node.ts` 替换为 `tjs.ts`。
- 当前配置未为 Node.js 与 txiki.js 生成不同文件名；后一次构建会覆盖前一次产物。
- 当前 alias 不替换 SMTP 实现，Runtime 接口也尚未统一 WebSocket。

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

需要验证发布产物时，应分别运行两个 CLI 单文件构建，并在每次构建后检查 `out/index.mjs` 的依赖边界和目标运行时兼容性；不要假设两个目标产物会同时保留。
