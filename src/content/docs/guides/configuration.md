---
title: 配置详解
description: mcloud-sign 配置文件格式与字段说明
---

:::tip[配置生成器]
不想手动编写配置？试试 [配置生成器](/config-generator)，通过表单快速生成 JSON 配置文件！
:::

## 配置文件格式

支持 JS 和 JSON 两种方式，放在项目根目录。

**文件名搜索顺序**：`asign.json` → `asign.json5` → `asign.config.js` → `asign.config.mjs` → `asign.config.cjs`

### JSON 方式

```json
{
  "caiyun": [
    {
      "auth": "你的auth字符串",
      "nickname": "账号1",
      "shake": { "enable": true, "num": 6, "delay": 2 }
    }
  ],
  "message": {
    "title": "签到推送",
    "pushplus": { "token": "xxx" }
  }
}
```

### JS 方式

```javascript
export default {
  caiyun: [
    {
      auth: "你的auth字符串",
      nickname: "账号1",
      shake: { enable: true, num: 6, delay: 2 },
    },
  ],
  message: {
    title: "签到推送",
    pushplus: { token: "xxx" },
  },
};
```

## 多账号

`caiyun` 为数组，每个元素是一个账号配置：

```json
{
  "caiyun": [
    { "auth": "auth字符串1", "nickname": "账号1" },
    { "auth": "auth字符串2", "nickname": "账号2" }
  ]
}
```
