---
title: 配置项说明
description: 所有配置字段的详细说明
---

## 账号配置项 (CaiyunConfig)

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `auth` | `string` | ✅ | - | Cookie authorization 字段，最少 10 字符 |
| `nickname` | `string` | ❌ | - | 昵称（可选，便于多账号区分） |
| `shake` | `ShakeConfig` | ❌ | `{ enable: true, num: 6, delay: 2 }` | 摇一摇配置 |
| `backupWaitTime` | `number` | ❌ | `20` | 备份等待时间（秒），范围 5-120 |
| `tasks` | `TasksConfig` | ❌ | `{ skipTasks: [], 每月上传任务单日数量: 5 }` | 任务配置 |
| `catalog` | `string` | ❌ | `"/"` | 上传文件使用的目录 ID |
| `是否打印今日云朵` | `boolean` | ❌ | `true` | 是否打印今日云朵统计 |
| `剩余多少天刷新token` | `number` | ❌ | `10` | 剩余多少天刷新 token，范围 1-30 |
| `微信抽奖` | `WechatDrawConfig` | ❌ | `{ 次数: 1, 间隔: 500 }` | 微信抽奖配置 |
| `AI新头像` | `AINewAvatarConfig` | ❌ | `{ 开启: false, 每日生成次数: 5 }` | AI 新头像配置 |
| `云朵大作战` | `CloudBattleConfig` | ❌ | `{ 开启: false, ... }` | 云朵大作战配置 |
| `春日拍拍大作战` | `SpringBattleConfig` | ❌ | `{ 开启: false }` | 春日拍拍大作战配置 |
| `文件获取方式` | `number` | ❌ | `1` | 文件获取方式，值为 `1` 或 `2` |
| `mail139` | `Mail139Config` | ❌ | `{ enable: false, ... }` | mail139 配置 |

## 摇一摇配置 (ShakeConfig)

| 字段 | 类型 | 默认值 | 范围 | 说明 |
| --- | --- | --- | --- | --- |
| `enable` | `boolean` | `true` | - | 是否开启摇一摇 |
| `num` | `number` | `6` | 0-100 | 摇一摇次数 |
| `delay` | `number` | `2` | 1-60 | 每次间隔时间（秒） |

## 任务配置 (TasksConfig)

| 字段 | 类型 | 默认值 | 范围 | 说明 |
| --- | --- | --- | --- | --- |
| `shareFile` | `string` | `undefined` | - | 分享任务默认使用的文件 ID |
| `skipTasks` | `number[]` | `[]` | - | 跳过的任务 ID 列表 |
| `每月上传任务单日数量` | `number` | `5` | 1-99 | 每月上传任务单日上传数量 |

## 微信抽奖配置 (WechatDrawConfig)

| 字段 | 类型 | 默认值 | 范围 | 说明 |
| --- | --- | --- | --- | --- |
| `次数` | `number` | `1` | 0-50 | 微信抽奖次数 |
| `间隔` | `number` | `500` | 100-5000 | 微信抽奖间隔（毫秒） |

## AI 新头像配置 (AINewAvatarConfig)

| 字段 | 类型 | 默认值 | 范围 | 说明 |
| --- | --- | --- | --- | --- |
| `开启` | `boolean` | `false` | - | 是否开启 AI 新头像功能 |
| `每日生成次数` | `number` | `5` | 1-20 | 每日生成次数 |

## 云朵大作战配置 (CloudBattleConfig)

| 字段 | 类型 | 默认值 | 范围 | 说明 |
| --- | --- | --- | --- | --- |
| `开启` | `boolean` | `false` | - | 是否开启云朵大作战 |
| `目标排名` | `number` | `500` | ≥1 | 目标排名 |
| `开启兑换` | `boolean` | `false` | - | 是否开启兑换 |
| `邀请用户` | `string[]` | `[]` | - | 邀请用户的手机号列表 |
| `游戏时间` | `number` | `300` | 60-600 | 游戏时间（秒） |

## 春日拍拍大作战配置 (SpringBattleConfig)

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `开启` | `boolean` | `false` | 是否开启春日拍拍大作战 |

## mail139 配置 (Mail139Config)

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `enable` | `boolean` | `false` | 是否开启 mail139 任务自动化 |
| `sid` | `string` | `""` | mail139 sid |
| `rmkey` | `string` | `""` | mail139 rmkey |
| `aiChatMessage` | `string` | `"你好"` | AI 工作台对话内容 |
| `sendMailTo` | `string` | `""` | 发邮件收件人 |
| `sendMailSubject` | `string` | `""` | 邮件主题 |
| `sendMailContent` | `string` | `""` | 邮件正文 |
