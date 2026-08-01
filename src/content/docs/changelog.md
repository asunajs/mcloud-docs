---
title: 更新日志
description: mcloud-sign 主要版本与已提交能力变化
---

## 当前已提交状态

- 提供 `drawRedFlower(codes, configPath?)` 独立入口，可加载指定配置并遍历账号领取口令。
- 直播 WebSocket 口令抓取核心任务已实现，但缺少配置开关和 CLI 默认调度。
- Runtime Adapter 已覆盖 Buffer、文件系统、路径、加密、压缩和进程信息；WebSocket 尚未纳入统一接口。
- Node.js 与 txiki.js CLI 构建命令均输出 `out/index.mjs`，不会同时生成带运行时后缀的两个文件。
- `fail` 按最低推送过滤组收录，但 `onlyError` 只检查 `error` 类型日志。
- 微信签到、微信抽奖和摇一摇已过期，不再实现。

:::note[文档发布边界]
本页只记录 `mcloud-sign` Git `HEAD` 已提交能力。未提交工作区中的试验或后续开发不会提前作为正式能力发布。
:::

## v2.1.0

- 新增推送日志级别配置 `minLevel`。
- 优化红包派对日志输出。
- 将 `fail` 输出调整为 info 级业务结果。

## v2.0.0

- 引入 v2 配置结构和多包架构。
- 新增小红花口令兑换与独立兑换入口。
- 推进 Node.js / txiki.js 双运行时支持。

## 历史功能说明

早期版本曾实现微信签到、微信抽奖和摇一摇。对应活动或接口现已过期；历史记录仅用于说明版本演进，不代表当前可用能力。
