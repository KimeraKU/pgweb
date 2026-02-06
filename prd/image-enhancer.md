# Image Enhancer 产品需求文档 (PRD)

> **文档版本**: V1.1  
> **创建日期**: 2026-02-02  
> **最后更新**: 2026-02-02  
> **产品名称**: Image Enhancer（画质增强）  
> **所属模块**: Aggregation Editor - Apps Tab / 图层工具栏  
> **参考**: [Aggregation Editor PRD](./aggregation-editor-prd.md)

---

## 📋 目录

1. [产品概述](#1-产品概述)
2. [入口与布局](#2-入口与布局)
3. [功能需求详述](#3-功能需求详述)
4. [界面与交互](#4-界面与交互)
5. [多语言与文案](#5-多语言与文案)
6. [后续扩展说明](#6-后续扩展说明)

---

## 1. 产品概述

### 1.1 产品定位

Image Enhancer 是聚合编辑器（Aggregation Editor）内用于对单张图片进行画质增强（如超分、清晰度提升）的工具。用户可通过「应用」Tab 或画布上选中图片图层后的「画质增强」入口打开，在侧边栏选择风格与背景模糊等参数，在画布中央以前后对比弹窗查看效果，并通过放弃/确认返回画布。

### 1.2 核心价值

- **双入口**：支持从 Apps 列表点击进入（可带入选中的图或弹窗选图/上传），以及从图层工具栏「画质增强」一键带入当前选中图片并打开工具。
- **前后对比在画布**：对比视图以弹窗形式直接叠在画布区域中央，展示 Before/After 分辨率与可拖拽滑杆，不占用侧边栏空间。
- **参数集中侧边栏**：风格（Standard / Vivid / Fresh）与 Background Blur 开关集中在 Image Enhancer 侧边栏，有图时显示，无图时提示上传或从画板选择。

### 1.3 目标用户

- 需要对画板中已有图片做画质提升、超分的创作者
- 希望在同一编辑流程内完成选图、调参、对比、确认的用户

---

## 2. 入口与布局

### 2.1 入口

#### 2.1.1 从 Apps 点击

- **位置**：左侧边栏 → **Apps** Tab → 应用网格，为首期可点击的 5 个应用之一（与 AI Image Generator、AI Filter、Background remover、Magic Eraser 并列）。
- **标识**：名称为「Image enhancer」（多语言键 `imageEnhancer`），图标为 `icon/Icon/Tool/High-Quality.svg`（HighQualityIcon），背景渐变为 `from-amber-200 to-orange-200`。
- **行为**：点击后根据当前画板状态分支：
  - **已选中图片图层**：直接将该图层的 `imageUrl` 带入工具，打开 Image Enhancer 动态 Tab，并**在画布区域中央显示前后对比弹窗**。
  - **未选中图片图层**：不直接打开 Tab，先弹出「添加要增强的图片」弹窗（见 3.1）。
- **动态 Tab**：打开后在左侧栏仅显示圆形 logo（HighQualityIcon），悬停通过 `title` 展示「Image enhancer」；点击放弃/确认或弹窗右上角 X 会关闭该 Tab 并返回 Apps。

#### 2.1.2 从图层工具栏「画质增强」点击

- **位置**：用户在画布上**选中一个图片类型图层**后，该图层上方出现的悬浮工具栏中，第一个按钮为「画质增强」（多语言键 `enhance`，图标 Wand2）。
- **行为**：点击后将该图层的 `imageUrl` 带入工具，若尚未打开 Image Enhancer Tab 则新增并选中该 Tab，并**在画布区域中央显示前后对比弹窗**；若已打开则仅更新当前增强图源并再次显示对比弹窗。

### 2.2 布局

- **侧边栏（Image Enhancer Tab 内容区）**  
  - 顶部：固定标题栏，展示「Image enhancer」。  
  - 主体：**不展示前后对比图**；仅展示：
    - 有图时：风格选择（下拉 Standard / Vivid / Fresh）、Background Blur 开关。  
    - 无图时：一句提示「请上传或从画板选择一张图片」（`imageEnhancerNoImageHint`）。  
  - **左下角 4K 按钮**：侧边栏底部固定一按钮，白底、teal 描边、圆角；左上角带「PRO」角标（紫到粉渐变）；主文案为「4K 超清」/「4K HD」（`imageEnhancer4k`），副文案为「最高 4096px」/「Up to 4096px」（`imageEnhancer4kSub`）。按钮始终可点（不禁用），PRO 角标仅作会员功能标识；与 4K 下载/画质策略的联动为后续扩展。

- **画布上的前后对比弹窗**  
  - 出现条件：当前为 Image Enhancer Tab 且已带入一张图（`imageEnhancerSourceUrl` 有值）且未关闭弹窗（`imageEnhancerComparisonVisible === true`）。  
  - 位置：覆盖**中间编辑区域**（画布所在区域）全屏，半透明白底（如 `bg-white/95`），内容居中。  
  - 内容：前后对比图（分辨率标签 + 可拖拽滑杆）+ 图片下方「放弃」「确认」按钮；右上角关闭按钮（X）。  
  - **关闭方式**：点击「放弃」、点击「确认」或点击右上角 X 后，**关闭对比弹窗、关闭 Image Enhancer Tab、返回 Apps Tab**，并清空当前增强图来源；用户需再次从 Apps 或图层工具栏进入 Image Enhancer 并选图才会重新显示对比弹窗。

---

## 3. 功能需求详述

### 3.1 从 Apps 打开且无选中图时的入口弹窗

- **触发**：用户点击 Apps 中的 Image Enhancer，且当前未选中任何图片图层（或选中的不是图片类型/无 imageUrl）。
- **弹窗标题**：`imageEnhancerModalTitle`（如「添加要增强的图片」）。
- **弹窗内容**：  
  - **若画板中存在至少一个图片图层**：展示「上传图片」按钮 +「画板中的图片」列表（缩略图 + 名称），点击列表中某张图即带入该图并关闭弹窗、打开 Image Enhancer Tab 并显示画布上的前后对比弹窗。  
  - **若画板中不存在任何图片图层**：仅展示「上传图片」按钮。  
- **上传图片**：点击后触发本地文件选择（accept 图片），选择后生成对象 URL，带入该 URL 并关闭弹窗、打开 Image Enhancer Tab 并显示前后对比弹窗。当前为占位，无实际上传至服务端逻辑。  
- **关闭**：点击弹窗外部或右上角关闭按钮可关闭弹窗，不打开 Image Enhancer。

### 3.2 侧边栏内容（风格 + Background Blur）

- **风格（Style）**  
  - 标签文案：`imageEnhancerStyle`（风格 / Style）。  
  - 控件：单行按钮，展示当前选中风格（Standard / Vivid / Fresh），右侧下拉箭头；点击展开下拉，选项为 `imageEnhancerStandard`、`imageEnhancerVivid`、`imageEnhancerFresh`。选中项高亮（如 teal 背景），点击选项后收起下拉；点击外部也可收起。  
- **Background Blur**  
  - 单行：左侧图标 + `imageEnhancerBackgroundBlur` 文案，右侧为开关（Toggle）。  
  - 开关：打开时为主色（如 teal），关闭为灰色；点击切换状态。当前为 UI 占位，无实际背景模糊能力。  
- **4K 按钮（侧边栏底部）**  
  - 位于侧边栏内容区左下角（flex 底部，与上方内容间隔）。  
  - 样式：圆角矩形、teal 描边、白底；左上角小角标「PRO」（`imageEnhancerProBadge`），紫到粉渐变背景、白字。  
  - 主文案：`imageEnhancer4k`（中文「4K 超清」、英文「4K HD」）；副文案：`imageEnhancer4kSub`（「最高 4096px」/「Up to 4096px」）。  
  - 交互：按钮**不禁用**，始终可点击；PRO 角标仅标识为会员相关能力，与 4K 下载/画质策略的联动为后续扩展。  
- **无图时**：不展示风格、Background Blur 与 4K 按钮，仅展示 `imageEnhancerNoImageHint` 提示。

### 3.3 画布上的前后对比弹窗

- **对比图区域**  
  - 比例约 3:4，最大高度约 70vh，居中；显示 Before（左）与 After（右）的拼接视图，中间为一条可左右拖动的**竖线滑杆**。  
  - **分辨率**：图片加载后读取原始宽高，左上角显示「Before [宽] * [高]」，右上角显示「After [宽] * [高]」。当前 After 分辨率以 4 倍占位（无真实增强接口时与 Before 同图）。  
  - **滑杆**：竖线中段有圆形手柄（带左右箭头图标），可横向拖动，改变 Before/After 可见比例；拖拽时随鼠标更新位置，松手结束。  
- **图片下方按钮**  
  - **放弃（叉）**：左侧按钮，X 图标 + `imageEnhancerDiscard`（放弃 / Discard）；样式为白底灰边。点击后**关闭对比弹窗、关闭 Image Enhancer Tab、返回 Apps Tab**，并清空当前增强图来源。  
  - **确认（勾）**：右侧按钮，Check 图标 + `confirm`（确认 / Confirm）；样式为主色（如 teal）。点击后**关闭对比弹窗、关闭 Image Enhancer Tab、返回 Apps Tab**，并清空当前增强图来源。  
- **右上角关闭（X）**：点击后与放弃/确认一致，**关闭对比弹窗、关闭 Image Enhancer Tab、返回 Apps Tab**，并清空当前增强图来源。  
- **关闭后**：用户回到 Apps Tab；再次使用 Image Enhancer 需从 Apps 或图层工具栏重新进入并选图。

### 3.4 其他交互

- 从 Apps 打开且已选中图片图层时，会设置「画板上前后对比弹窗」为显示状态（`imageEnhancerComparisonVisible = true`），与「从图层工具栏 Enhance」打开行为一致。  
- 侧边栏与主 PRD 约定一致：宽度约 320px，标题栏、圆角、边框与 teal 强调色与现有编辑器一致。

---

## 4. 界面与交互

### 4.1 尺寸与样式约定

- 侧栏内容区宽度：约 320px（w-80）。  
- 风格下拉、Background Blur 行：圆角、灰底边框，与 AI Filter、AI Image Generator 等 Tab 内控件风格一致。  
- 前后对比弹窗：覆盖中间编辑区域，半透明白底；对比图容器圆角、边框、阴影；分辨率标签为小号、圆角灰底；滑杆为白线 + 圆形灰底白边手柄；放弃/确认按钮间距适中，主次分明（确认为主色）。  
- 4K 按钮：侧边栏底部，teal 描边白底圆角；PRO 角标紫粉渐变、左上角叠在按钮上；主/副文案 teal 色，hover 时浅 teal 背景。

### 4.2 无障碍与语义

- 滑杆手柄使用 `aria-label="拖动对比"`。  
- 放弃 / 确认按钮使用 `aria-label` 与可见文案一致。  
- 风格下拉展开时，选项可被键盘聚焦并选择。

---

## 5. 多语言与文案

### 5.1 已用 i18n 键（中/英）

| 键 | 中文 | 英文 |
|----|------|------|
| imageEnhancer | Image enhancer | Image enhancer |
| imageEnhancerModalTitle | 添加要增强的图片 | Add image to enhance |
| imageEnhancerUploadImage | 上传图片 | Upload image |
| imageEnhancerSelectFromArtboard | 从画板选择图片 | Select from artboard |
| imageEnhancerNoImageHint | 请上传或从画板选择一张图片 | Upload or select an image to enhance |
| imageEnhancerImagesOnArtboard | 画板中的图片 | Images on artboard |
| imageEnhancerBefore | Before | Before |
| imageEnhancerAfter | After | After |
| imageEnhancerStyle | 风格 | Style |
| imageEnhancerStandard | Standard | Standard |
| imageEnhancerVivid | Vivid | Vivid |
| imageEnhancerFresh | Fresh | Fresh |
| imageEnhancerBackgroundBlur | Background Blur | Background Blur |
| imageEnhancerDiscard | 放弃 | Discard |
| imageEnhancer4k | 4K 超清 | 4K HD |
| imageEnhancer4kSub | 最高 4096px | Up to 4096px |
| imageEnhancerProBadge | PRO | PRO |
| confirm | 确认 | Confirm |
| enhance | 画质增强 | Enhance |
| upload | 上传 | Upload |

---

## 6. 后续扩展说明

以下为当前未实现或仅占位的部分，PRD 仅作范围说明，不做实现承诺：

- **上传**：实际文件上传至服务端、与增强任务的绑定及进度展示。  
- **真实增强能力**：调用画质增强/超分接口，生成真实 After 图与分辨率；当前 After 为同图 + 4 倍分辨率占位。  
- **确认后回写画布**：点击「确认」后，将增强结果写回画板当前选中图层或新图层（替换/新增）、撤销/重做支持。  
- **Background Blur**：与后端或前端滤镜能力联动，实际应用背景模糊效果。  
- **风格（Standard / Vivid / Fresh）**：与增强算法或后处理参数联动，影响 After 效果。  
- **4K 按钮与会员**：4K 按钮点击后与 4K 下载/画质策略的联动（如会员校验、最高 4096px 导出）；当前按钮为 UI 占位，始终可点。  
- **关闭行为**：当前已实现为「放弃/确认/右上角 X 均关闭 Image Enhancer Tab 并返回 Apps」；若后续需区分「仅关闭弹窗保留 Tab」与「关闭 Tab」可再补充策略。

以上扩展需与后端、AI 能力及聚合编辑器整体规划对齐后再细化需求与优先级。
