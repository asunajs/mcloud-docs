---
title: 配置示例
description: 常见配置场景示例
---

## 最小配置

```javascript
export default {
  caiyun: [
    {
      auth: "你的authorization值",
    },
  ],
};
```

## 多账号配置

```javascript
export default {
  caiyun: [
    {
      auth: "authorization值1",
      nickname: "账号1",
    },
    {
      auth: "authorization值2",
      nickname: "账号2",
    },
  ],
};
```

## 完整配置

```javascript
export default {
  caiyun: [
    {
      auth: "你的authorization值",
      nickname: "我的账号",
      shake: {
        enable: true,
        num: 6,
        delay: 2,
      },
      backupWaitTime: 20,
      tasks: {
        skipTasks: [585],
        每月上传任务单日数量: 5,
      },
      catalog: "/",
      微信抽奖: {
        次数: 1,
        间隔: 500,
      },
      AI新头像: {
        开启: false,
        每日生成次数: 5,
      },
      云朵大作战: {
        开启: false,
        目标排名: 500,
        开启兑换: false,
        邀请用户: ["13800138000"],
        游戏时间: 300,
      },
      春日拍拍大作战: {
        开启: false,
      },
      文件获取方式: 1,
      mail139: {
        enable: false,
        sid: "",
        rmkey: "",
      },
    },
  ],
};
```

## 云朵大作战配置

```json
{
  "caiyun": [
    {
      "auth": "你的auth",
      "云朵大作战": {
        "开启": true,
        "目标排名": 500,
        "游戏时间": 300
      }
    }
  ]
}
```

配合邀请：

```json
{
  "云朵大作战": {
    "开启": true,
    "邀请用户": ["13800138000", "13900139000"]
  }
}
```
