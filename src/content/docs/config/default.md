---
title: 默认配置
description: 当前源码生成的账号与通用配置默认值
---

以下默认值来自 `mcloud-sign/packages/shared/generated/defaults.ts`。配置文件可以只写需要覆盖的字段。

## 账号默认值

```json
{
  "backupWaitTime": 20,
  "tasks": {
    "skipTasks": [],
    "每月上传任务单日数量": 5
  },
  "是否打印今日云朵": true,
  "剩余多少天刷新token": 10,
  "AI新头像": {
    "开启": false,
    "每日生成次数": 10
  },
  "红包派对": {
    "开启": true
  },
  "云朵大作战": {
    "开启": false,
    "邀请用户": [],
    "游戏时间": 300,
    "目标排名": 500,
    "开启兑换": false
  },
  "春日拍拍大作战": {
    "开启": true
  },
  "直播口令": {
    "开启": false
  },
  "mail139": {
    "aiChatMessage": "你好",
    "sendMailTo": "",
    "sendMailSubject": "",
    "sendMailContent": ""
  }
}
```

## 通用配置默认值

```json
{
  "backupWaitTime": 20,
  "catalog": "/",
  "是否打印今日云朵": true,
  "剩余多少天刷新token": 10
}
```

`common.colorize` 未设置时由 CLI 自动检测终端是否支持彩色输出。

:::note
`AI新头像` 配置仍存在，但当前业务函数与 CLI 调度尚未实现。`春日拍拍大作战` 是拍拍系列活动的配置名，不表示实现只适用于春日一期。
:::
