# UGC Video 页面需求（需求稿）

## 1. 页面目标
- 提供从「商品图输入」到「候选场景图生成」再到「视频生成」的一站式工作流。
- 支持任务化管理，用户可查看历史、切换任务、重生成与失败恢复。
- 在保证可用性的前提下，减少重复填写与重复操作。

## 2. 页面范围
- 路由：`/ugc-video-generator`
- 三栏结构：
  - 左栏：输入与生成配置
  - 中栏：预览区与阶段操作
  - 右栏：任务列表（图片任务 / 视频任务）

## 3. 核心功能

### 3.1 输入与配置
- 商品图片上传（必填）
- 模特选择（预设 / 自定义 / 无）
- 背景选择（预设 / 自定义 / 无）
- 生成数量（1-8，默认 3）
- 比例选择（默认 `9:16`）
- Creative Prompt 输入（必填，最大 1000 字）

### 3.2 图片生成阶段
- 点击「生成模特场景图」创建一个 image run。
- 每个 run 可生成多候选图，候选状态：`pending/success/failed`。
- 生成按钮支持短冷却（防连点），冷却结束后可继续创建新 run。
- 任务失败时保留错误信息，支持后续重试。

### 3.3 图片 Regenerate
- 基于右侧选中候选图执行重生成。
- 规则：使用该候选图的原始生图请求参数重放（prompt + input_images + aspect_ratio）。
- 结果：新建任务，不覆盖原任务。
- 若缺少必要快照数据（prompt / input_images），需给出阻断提示。

### 3.4 视频生成阶段
- 对选中的成功候选图点击「生成 15s 视频」后创建视频任务。
- 视频状态：`video_prompting -> video_reviewing -> video_generating -> submitted/completed/failed`。
- 生成成功后展示可播放视频；失败时展示错误态与重试入口。

### 3.5 视频 Regenerate
- 对选中的视频任务执行重生成。
- 规则：复用该视频任务的主要参数（prompt/sourceImage/referenceImageUrls）并新建任务。
- 不覆盖原视频任务。

### 3.6 任务列表与展示
- 图片/视频任务支持 Tab 切换。
- 图片任务标题：展示用户输入 prompt 的截断预览（固定长度 + `...`）。
- 卡片信息：
  - 第一行：标题 + 比例（图片）/ 时长（视频）
  - 第二行：时间 + 状态
- 时间格式统一（中英文一致，24 小时格式）。
- 卡片需具备防撑宽约束（`truncate` + `overflow-x-hidden`）。

### 3.7 Prompt 处理逻辑
#### A. 图片首次生成（Generate Model Scene Images）
- 输入源：左栏 `Creative Prompt`（用户原始输入）。
- 处理链路：
  1. 调用 `/api/ugc/refine-image-prompt`，按候选索引生成候选级 refined prompt。
  2. 用 refined prompt 调用 `/api/create-task` 发起生图任务。
  3. 轮询 `/api/query-task` 获取图片结果。
- 落库/持久化：
  - run 级保存用户原始 creative prompt。
  - candidate 级保存该候选的 refined prompt（成功或失败都尽量保留，便于回放）。

#### B. 图片 Regenerate（右侧候选重生成）
- 输入源：右侧选中候选的“原始候选 prompt”（candidate.prompt）。
- 处理链路：
  1. 不再调用 `/api/ugc/refine-image-prompt`。
  2. 直接重放请求参数（prompt + input_images + aspect_ratio）到 `/api/create-task`。
  3. 新建 image run，不能覆盖原 run。
- 异常分支：
  - 若缺少 candidate.prompt 或缺少请求快照（input_images/aspect_ratio），阻断并提示。

#### C. 视频首次生成（Generate 15s Video）
- 输入源：选中候选图 + run 级 creative prompt。
- 处理链路：
  1. 调用 `/api/ugc/refine-video-prompt` 生成视频 prompt。
  2. 调用 `/api/ugc/review-image` 进行图片审核。
  3. 调用 `/api/video/ima-pro` 发起视频生成并轮询。
- 落库/持久化：
  - video task 保存最终视频 prompt，作为后续视频重生成输入。

#### D. 视频 Regenerate
- 输入源：右侧选中视频任务的 prompt/sourceImage/referenceImages。
- 处理链路：
  1. 复用选中视频任务 prompt（`reusePrompt=true`）。
  2. 不再调用 `/api/ugc/refine-video-prompt`。
  3. 继续走审核 + 视频生成流程，新建视频任务。
- 说明：
  - 当前是“复用参数再提交流程”，不是“原始 JSON 完全回放”。

## 4. 交互与状态要求

### 4.1 步骤指示器
- 两步：`1. Generate Model Scene Images`、`2. Generate Product Showcase Videos`
- 选中步骤为填色，未选中步骤为描边。
- 连线样式需在中英文下都不与步骤框重叠。

### 4.2 可用性约束
- 未上传商品图或未填 Creative Prompt 时，图片生成按钮禁用。
- 图片生成过程中，中栏显示对应加载/失败/成功预览态。
- 视频任务处理中显示进度态，支持后续轮询更新。

### 4.3 并发与一致性
- 连续创建图片任务时，主预览应绑定当前激活任务，不被旧任务回写覆盖。
- 任务切换后，详情区内容（图片/prompt/状态）需与选中任务一致。

## 5. 数据与持久化要求
- 前端需持久化最近任务历史（图片 run、视频 task、核心 prompt）。
- 刷新页面后可恢复任务列表与当前可展示状态。
- 持久化数据需过滤不可用临时 URL（如 blob）。

## 6. API 依赖（页面视角）
- 文件上传：`/api/upload`
- 图片 prompt 优化：`/api/ugc/refine-image-prompt`
- 图片创建任务：`/api/create-task`
- 图片查询任务：`/api/query-task`
- 视频 prompt 优化：`/api/ugc/refine-video-prompt`
- 图片审核：`/api/ugc/review-image`
- 视频创建/查询：`/api/video/ima-pro`

## 7. 非功能要求
- 响应速度：主要按钮点击需立即有反馈（状态变化/冷却态）。
- 稳定性：接口失败要有可理解错误提示，不可静默失败。
- 可观测：关键动作建议保留请求 ID / 任务 ID 以便排查。

## 8. 验收标准（UAT）
1. 能从商品图 + prompt 完成至少 1 轮图片生成并展示候选任务。
2. 图片 Regenerate 会新建任务且不覆盖原任务。
3. 视频生成可完成任务创建、轮询、成功播放与失败提示。
4. 视频 Regenerate 会新建任务且复用选中视频任务参数。
5. 右侧任务卡中英文展示一致，不出现宽度撑爆。
6. 刷新后任务历史可恢复（在持久化有效范围内）。
7. 默认比例为 `9:16`，生成数量范围为 `1-8`。
8. 图片首次生成必须经过 refine-image-prompt；图片 Regenerate 不允许再走 refine-image-prompt。
9. 视频首次生成必须经过 refine-video-prompt；视频 Regenerate 不允许再走 refine-video-prompt。
