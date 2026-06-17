---
title: 技术栈
description: 项目使用的技术栈
---

## 核心技术

| 类别 | 技术 | 说明 |
| --- | --- | --- |
| 运行时 | Node.js (ESM) | >= 18 |
| 语言 | TypeScript 6.0+ | 类型安全 |
| 构建 | tsup | 基于 esbuild 的 TypeScript 打包工具 |
| Lint | oxlint | 超快的代码检查器 |
| Format | oxfmt | 高性能格式化工具 |

## 依赖库

| 类别 | 库 | 说明 |
| --- | --- | --- |
| HTTP | ofetch | 基于 Fetch API 的轻量级 HTTP 客户端 |
| 加密 | crypto-js | 加密工具 |
| 图片处理 | fast-png | PNG 图片处理 |
| 配置解析 | magicast | 配置文件解析 |
| 日志 | consola | 日志输出 |
| 存储 | unstorage | 存储抽象层 |
| 工具库 | es-toolkit | 工具函数集 |
| 日期 | dayjs | 日期处理 |
| 配置合并 | defu | 配置合并工具 |
| 序列化 | destr | 安全的 JSON 解析 |

## 可选依赖

| 库 | 说明 |
| --- | --- |
| hpagent | HTTP/HTTPS 代理支持 |
| nodemailer | 邮件发送 |

## 项目结构

```
mcloud-sign/
├── src/
│   ├── api/              # API 接口层
│   ├── services/         # 业务服务层
│   ├── types/            # TypeScript 类型定义
│   ├── utils/            # 工具函数
│   ├── constant/         # 常量配置
│   ├── core.ts           # 核心逻辑
│   └── index.ts          # 入口文件
├── dist/                 # 构建产物（多文件）
├── out/                  # 单文件发布版本
├── package.json
├── tsconfig.json
├── tsup.config.ts        # tsup 构建配置
├── asign.config.js       # 应用配置文件
└── SECURITY.md           # 安全最佳实践
```
