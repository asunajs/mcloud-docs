---
title: 配置详解
description: mcloud-sign v2 配置文件格式、查找规则与优先级
---

:::tip[配置生成器]
可使用 [配置生成器](/config-generator) 创建或导入 `asign.json`。生成器中的 JSON Schema 用于编辑提示；程序加载 JSON 时按项目设计直接解析，不依赖 schema 做运行时校验。
:::

## 配置文件

当前自动搜索以下文件，优先级从左到右：

1. `asign.json`
2. `asign.config.js`
3. `asign.config.mjs`

搜索目录依次为：

1. 当前工作目录。
2. 当前工作目录下的 `config/`。
3. 执行文件所在目录（与工作目录不同时）。
4. 执行文件所在目录下的 `config/`。

也可调用 `run("/absolute/path/to/asign.json")` 显式指定路径。

:::note[JS/MJS 配置转换]
加载 `asign.config.js` 或 `asign.config.mjs` 时，程序会将配置转换并保存为同目录的 `asign.json`。之后建议使用生成的 JSON 文件。
:::

## 完整结构

```json
{
  "version": 2,
  "caiyun": [
    {
      "auth": "认证字符串",
      "nickname": "主账号",
      "直播口令": {
        "开启": false
      }
    }
  ],
  "common": {
    "backupWaitTime": 20,
    "catalog": "/",
    "是否打印今日云朵": true,
    "剩余多少天刷新token": 10
  },
  "message": {
    "title": "mcloud-v2 运行推送",
    "onlyError": false,
    "minLevel": "info"
  }
}
```

## 合并优先级

每个账号的最终配置按以下顺序合并：

```text
默认配置 → common 通用配置 → caiyun[] 账号配置
```

账号级同名字段优先，因此可在 `common` 设置多数账号共用的值，只对个别账号单独覆盖。

## 多账号

```json
{
  "version": 2,
  "caiyun": [
    { "auth": "账号一的认证信息", "nickname": "主号" },
    { "auth": "账号二的认证信息", "nickname": "小号" }
  ]
}
```

账号按数组顺序执行。模块状态、临时文件和活动 token 应保存在当前账号上下文中，不跨账号共享。

## 活动配置

```json
{
  "version": 2,
  "caiyun": [
    {
      "auth": "认证信息",
      "红包派对": { "开启": true },
      "云朵大作战": { "开启": false },
      "春日拍拍大作战": { "开启": true },
      "直播口令": { "开启": false }
    }
  ]
}
```

- `春日拍拍大作战` 是当前保留的配置名，业务实现 `playAiSpecialTask` 用于拍拍系列活动；春日、夏日、秋日只是不同活动期次。
- `直播口令` 默认关闭。开启后会并行采集 WebSocket 与固定小红书主页 HTML，合并去重后由当前账号领取。
- `AI新头像` 的 schema 仍保留，但当前业务函数和 CLI 调度尚未实现。
- 微信签到、微信抽奖、摇一摇已过期，不应继续配置。

完整字段见 [默认配置](/config/default)、[配置项说明](/config/schema) 和 [消息推送](/config/message)。
