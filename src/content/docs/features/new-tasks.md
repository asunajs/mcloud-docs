---
title: AI 任务
description: AI 相关任务功能说明
---

所有 AI 相关任务都采用了**容错处理**策略，确保即使任务失败也不会影响原有程序的正常运行。

## 任务列表

### AI 相机任务 (task_id: 585)

- **功能**: 通过调用 AI 识图接口完成任务
- **实现**: `src/services/ai-tasks.ts` - `completeAiCameraTask`
- **触发条件**: 任务列表中出现 task_id 585 时自动执行
- **容错机制**:
  - 缺少用户信息时跳过
  - API 调用失败时记录警告但不中断流程
  - 异常捕获确保不影响其他任务

### 五一回忆上传任务 (task_id: 587)

- **功能**: 上传 10 张图片完成任务
- **实现**: `src/services/ai-tasks.ts` - `completeMaydayMemoryTask`
- **触发条件**: 任务列表中出现 task_id 587 时自动执行
- **目标**: 上传 10 张图片
- **容错机制**:
  - 分批上传，记录成功数量
  - 上传失败不影响后续任务
  - 查询任务状态失败时返回 false 但不抛出异常

### 出行攻略问 AI 任务 (task_id: 588)

- **功能**: 向 AI 助手询问出行攻略
- **实现**: `src/services/ai-tasks.ts` - `completeTravelGuideAiTask`
- **触发条件**: 任务列表中出现 task_id 588 时自动执行
- **容错机制**:
  - 缺少用户信息时跳过
  - API 调用失败时记录警告
  - 响应解析失败时安全返回

### 假期九宫格任务 (task_id: 589)

- **功能**: 生成假期九宫格图片
- **实现**: `src/services/ai-tasks.ts` - `completeHolidayNineGridTask`
- **触发条件**: 任务列表中出现 task_id 589 时自动执行
- **容错机制**:
  - 加密失败时跳过
  - 模板获取失败时记录警告
  - 任务登记失败时不中断流程

### 月度上传任务 (task_id: 522)

- **功能**: 补充上传至 100 次
- **实现**: `src/services/ai-tasks.ts` - `completeMonthlyUploadTask`
- **改进**:
  - 增加了重试机制（最多 3 次）
  - 批量上传提高效率
  - 实时查询任务进度
- **容错机制**:
  - 上传失败时继续尝试
  - 进度查询失败时返回当前状态
  - 异常捕获确保不影响其他任务

## 容错设计原则

- 所有任务都有独立的 try-catch 包裹
- 失败时记录日志但不抛出异常
- 使用 warn 级别日志而非 error
- 返回 boolean 值表示成功/失败，不中断流程
- 上传任务有次数限制（最多 100 次）
- API 调用有延迟控制（sleep 200-500ms）
