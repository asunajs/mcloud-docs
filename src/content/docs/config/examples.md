---
title: 配置示例
description: 常见的 mcloud-sign v2 配置场景
---

## 最小配置

```json
{
  "version": 2,
  "caiyun": [
    {
      "auth": "Base64 编码的认证字符串"
    }
  ]
}
```

## 多账号与通用配置

```json
{
  "version": 2,
  "caiyun": [
    {
      "auth": "账号一认证信息",
      "nickname": "主号"
    },
    {
      "auth": "账号二认证信息",
      "nickname": "小号",
      "是否打印今日云朵": false
    }
  ],
  "common": {
    "backupWaitTime": 20,
    "剩余多少天刷新token": 10
  }
}
```

第二个账号的 `是否打印今日云朵` 会覆盖 `common` 或内置默认值。

## 活动配置

```json
{
  "version": 2,
  "caiyun": [
    {
      "auth": "认证信息",
      "红包派对": { "开启": true },
      "云朵大作战": {
        "开启": true,
        "目标排名": 500,
        "游戏时间": 300,
        "开启兑换": false,
        "邀请用户": []
      },
      "春日拍拍大作战": { "开启": true }
    }
  ]
}
```

`春日拍拍大作战` 是拍拍系列活动的当前配置名，春日、夏日、秋日等期次共用同一业务实现。

## 消息推送

```json
{
  "version": 2,
  "caiyun": [{ "auth": "认证信息" }],
  "message": {
    "title": "mcloud-sign 运行结果",
    "onlyError": true,
    "minLevel": "info",
    "pushplus": {
      "token": "你的 token"
    }
  }
}
```

`onlyError` 只在出现 `error` 类型日志时触发。业务 `fail` 是 info 级结果，不影响退出码，也不会触发 `onlyError`。
