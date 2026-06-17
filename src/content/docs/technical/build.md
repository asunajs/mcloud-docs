---
title: 构建指南
description: 从源码构建项目
---

## 可用脚本

```bash
npm run build          # 使用 TypeScript 编译项目
npm run build:bundle   # 使用 tsup 构建单文件发布版本
npm run dev            # 开发模式运行
npm run start          # 运行生产版本
npm run lint           # 代码检查 (oxlint)
npm run fmt            # 代码格式化 (oxfmt)
npm run check          # 完整检查 (lint + format + type check)
```

## 构建单文件版本

```bash
npm run build:bundle
```

产物位于 `out/index.mjs`，是一个独立的可执行文件。

## 开发模式

```bash
npm run dev
```

## 完整检查

```bash
npm run check
```

这会依次执行：
1. 代码检查 (oxlint)
2. 代码格式化 (oxfmt)
3. TypeScript 编译
