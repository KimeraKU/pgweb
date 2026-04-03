# UGC App Video Generator PRD

## 0. 文档信息

- 产品名称：UGC App Video Generator
- 文档版本：v1.0（实现对齐版）
- 文档状态：Draft
- 更新时间：2026-04-03
- 对齐范围：`/src/app/ugc-video-generator/page.tsx` 及相关 API 路由当前实现

## 1. 背景与目标

### 1.1 背景

当前用户在做 App 广告素材时，通常要分多步完成：

- 先做商品/模特场景图
- 再基于选中图片做视频
- 多轮试错与重生成

该页面目标是把上述流程收敛到一个工作台内，支持连续创建任务、查看历史、快速重试。

### 1.2 目标

- 降低从输入创意到拿到可播视频的操作成本
- 支持多候选图并行生成与管理
- 支持图片和视频任务的任务化追踪
- 支持失败任务可重试，减少重复填写成本

### 1.3 核心成功指标（建议）

- 从点击“生成模特场景图”到出现首张成功候选图的中位时长
- 从确认候选图到拿到可播放视频 URL 的中位时长
- 图片任务成功率 / 视频任务成功率
- Regenerate 使用率与 Regenerate 成功率

## 2. 用户与场景

- 用户类型：素材运营、广告投放、增长、设计协作角色
- 典型目标：快速获得可用于投放测试的 UGC 风格 App 广告视频
- 典型场景：同一商品多风格生成、同一视频 prompt 多次重跑、失败任务恢复

## 3. 功能范围

### 3.1 In Scope

- 生图与生视频双阶段工作流（步骤 1/2）
- 商品图上传、模特/背景选择（预设与自定义）
- 多候选图生成（1-8）
- 图片候选确认并发起视频任务
- 图片 Regenerate / 视频 Regenerate
- 任务列表（图片与视频）与状态展示
- 任务历史持久化与恢复

### 3.2 Out of Scope

- 多人协作与权限
- 任务分享/导出管理后台
- 视频编辑时间线能力
- 复杂批处理编排（如定时、队列优先级策略）

## 4. 页面信息架构

- 左栏：输入与生成控制
- 中栏：预览区与当前阶段操作按钮
- 右栏：任务列表（图片任务 / 视频任务）

## 5. 关键流程

### 5.1 图片任务创建（Generate Model Scene Images）

前置条件：

- 已填写 Creative Prompt
- 已上传商品图片

流程：

1. 点击“生成模特场景图”
2. 按钮进入 1200ms 短冷却，防连点
3. 创建一个新的 image run，按生成数量创建多个候选（默认 3，最大 8）
4. 每个候选执行：
  - 调用 `/api/ugc/refine-image-prompt` 生成候选 prompt
  - 调用 `/api/create-task` 创建生图任务
  - 轮询 `/api/query-task` 获取结果图
5. run 状态在 `image_generating -> image_ready / failed` 间流转
6. 成功候选图可在中栏预览并进入后续视频流程

### 5.2 图片候选 Regenerate（已完成/失败任务）

触发点：

- 右侧选中某个候选任务后点击 `Regenerate`

当前规则（实现已改）：

- 不再重新走 refine-image-prompt
- 直接重放该候选图对应请求的核心参数：
  - `prompt`（候选原 prompt）
  - `input_images`（该 run 的请求快照）
  - `aspect_ratio`（该 run 的请求快照）
  - `size`（2K）
- 每次 Regenerate 都会新建一个新的 image run（单候选）
- 不覆盖原任务

异常分支：

- 若缺少候选原 prompt 或请求快照，给出提示并阻断重生成

### 5.3 图片确认并发起视频任务（Generate 15s Video）

触发点：

- 选中有图的候选，点击 `Generate 15s Video`

流程：

1. 以选中候选图作为 `sourceImageUrl`
2. 调用 `submitVideoTask(reusePrompt=false)`
3. 调用 `/api/ugc/refine-video-prompt` 生成视频 prompt
4. 调用 `/api/ugc/review-image` 做图片审核
5. 调用 `/api/video/ima-pro` 创建视频任务
6. 轮询 `/api/video/ima-pro?task_id=...` 获取可播视频 URL

### 5.4 视频 Regenerate

触发点：

- 选中视频任务后点击 `Regenerate Video`

当前规则：

- 使用当前选中视频任务参数优先重提（`productName/prompt/sourceImageUrl/referenceImageUrls`）
- `reusePrompt=true`，不再调用视频 prompt refine
- 仍会再次走图片审核与视频创建流程
- 每次 Regenerate Video 都会新建一条视频任务

说明：

- 视频 Regenerate 是“复用选中任务参数再提交流程”
- 不是“原始 JSON 100% 原样回放”

## 6. 字段与默认值

### 6.1 左栏输入

- 商品图：必填（支持本地上传）
- 模特：可选（预设/自定义/无）
- 背景：可选（预设/自定义/无）
- 生成数量：默认 3，范围 1-8
- 比例：默认 `9:16`
- Creative Prompt：最大 1000 字，必填

### 6.2 交互细节

- 生成按钮短冷却：1200ms
- 生成数量输入去除原生步进器，仅使用加减按钮与手填
- 步骤指示器：当前步骤为填色，未选中为描边

## 7. 任务列表展示规则（右栏）

### 7.1 图片任务卡

- 标题来源：用户输入的 creative prompt（run 级），不是处理后的候选 prompt
- 标题长度：截断到 12 字符后加 `...`
- 标题行右侧：显示比例（如 `9:16`）
- 下一行：左侧时间，右侧状态
- 时间格式：`MM/DD HH:mm`（中英文统一，24h）

### 7.2 视频任务卡

- 标题：`Video Task N`
- 标题行右侧：显示时长（`15s`）
- 下一行：左侧时间，右侧状态
- 卡片底部不再保留额外空白状态行

### 7.3 防撑宽策略

- 右栏容器与滚动区使用 `min-w-0` 与 `overflow-x-hidden`
- 卡片容器 `overflow-hidden`
- 标题文本 `truncate`

## 8. 状态机

### 8.1 页面主状态（TaskStatus）

- `draft`
- `image_generating`
- `image_ready`
- `image_confirmed`
- `video_prompting`
- `video_reviewing`
- `video_generating`
- `submitted`
- `completed`
- `failed`

### 8.2 图片候选状态

- `pending`
- `success`
- `failed`

### 8.3 视频轮询结果映射

- `processing`
- `submitted`
- `succeeded`
- `failed`

## 9. 数据模型与持久化

### 9.1 关键结构

- `ImageGenerationRun`
  - `creativePrompt`
  - `generationCount`
  - `aspectRatio`
  - `candidates`
  - `requestSnapshot`（含 `creativePrompt/modelName/sceneName/aspectRatio/inputImages`）
- `VideoTask`
  - `productName`
  - `sourceImageUrl`
  - `referenceImageUrls`
  - `prompt`
  - `status`
  - `remoteTaskId`

### 9.2 持久化策略（IndexedDB）

- 存储：`ugc_video_generator/history_v1`
- 上限：最多 50 个 image runs、20 个 video tasks
- 页面加载后自动恢复历史
- 对于可恢复状态的视频任务（`video_prompting/video_reviewing/video_generating/submitted`）自动恢复轮询

## 10. API 契约（当前实现）

### 10.1 图片相关

- `POST /api/ugc/refine-image-prompt`
  - 入参：`creativePrompt/modelName/sceneName/aspectRatio/candidateIndex/totalCount`
  - 出参：`prompt`
- `POST /api/create-task`
  - 入参：`prompt/input_images/aspect_ratio/size`
  - 出参：`id_task`（可选 `image_url`）
- `POST /api/query-task`
  - 入参：`id_task`
  - 出参：`status/image_url`

### 10.2 视频相关

- `POST /api/ugc/refine-video-prompt`
  - 入参：`creativePrompt/modelName/sceneName/aspectRatio/duration`
  - 出参：`prompt`
- `POST /api/ugc/review-image`
  - 入参：`image_url/name/project_name`
  - 出参：`passed/status/reason`
- `POST /api/video/ima-pro`
  - 入参：`element_list/aspect_ratio/duration/audio/model_version_id/...`
  - 出参：`task_id`
- `GET /api/video/ima-pro?task_id=...`
  - 出参：`status/video_url/thumbnail_url/error/hint`

### 10.3 上传

- `POST /api/upload`
  - 入参：`multipart/form-data` 文件
  - 出参：`url`

## 11. 轮询与限制

- 图片轮询：间隔 3s，最大 600 次
- 视频轮询：间隔 3s，最大 600 次
- 视频轮询超过上限后转 `submitted` 并提示稍后查看

## 12. 错误处理

- 入参缺失：前端拦截 + 弹窗提示
- 上游创建失败：任务标记 `failed` 并展示错误文案
- 轮询失败：任务标记 `failed`
- 审核未通过：视频任务标记 `failed`
- Regenerate 数据缺失（无 prompt/快照）：阻断并提示

## 13. 验收标准（UAT）

1. 不填写 Creative Prompt 或不上传商品图时，生成按钮禁用
2. 生成数量可设置 1-8，默认 3
3. 默认比例为 `9:16`
4. 点击图片生成按钮会有 1200ms 冷却防连点
5. 图片 Regenerate 会新建任务，不覆盖原任务
6. 图片 Regenerate 不再调用 refine-image-prompt
7. 视频 Regenerate 复用选中视频任务参数并新建任务
8. 右栏图片任务标题显示用户输入 prompt，超长截断为 12 字符 + `...`
9. 时间展示中英文一致，无英文逗号和 AM/PM
10. 右栏卡片在极长文案下不横向撑爆布局
11. 刷新页面后能恢复历史任务，且可恢复状态视频任务继续轮询

## 14. 后续迭代建议

- 视频 Regenerate 增加“严格原 JSON 回放”模式开关
- 任务级筛选与搜索
- 多任务并发配额与队列可视化
- 失败任务一键批量重试
- 结构化埋点与漏斗看板联动

