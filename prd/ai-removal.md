# AI Removal 产品需求文档 (PRD)

> **文档版本**: V1.0  
> **创建日期**: 2026-02-02  
> **最后更新**: 2026-02-12  
> **产品名称**: AI Removal（物体擦除）  
> **所属模块**: Aggregation Editor - Apps Tab  
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

AI Removal 是聚合编辑器（Aggregation Editor）内用于对单张图片进行「物体擦除」的工具。用户通过「应用」Tab 打开，在侧边栏选择模式与选区工具，在画布中央的**统一弹窗**内完成：笔刷涂抹选区 → 点击 Remove → 前后对比查看 → 放弃（回选区）或确认（更新/新增画布图层）。弹窗右上角关闭按钮用于退出工具并返回 Apps Tab。

### 1.2 核心价值

- **统一弹窗**：从选图到对比全程在同一画布弹窗内完成，弹窗尺寸与图片展示比例不变；Remove 后仅在同一弹窗内叠加对比滑杆与 Before/After 标识，不放大图片、不改变弹窗大小。
- **双入口**：支持从 Apps 列表点击进入（可带入选中的图或弹窗选图/上传），与 Image Enhancer 一致。
- **选区与结果分离**：无有效选区时禁用 Remove；Discard 仅回到选区步骤，不关闭 Tab；只有点击弹窗右上角叉或 Confirm 才关闭 AI Removal Tab 并返回 Apps。
- **画布联动**：Confirm 时若来源为「画布选中图层」则更新该图层图片，若来源为「上传/选图」则新增图片图层。

### 1.3 目标用户

- 需要在画板图片上去除局部物体（如路人、水印、杂物）的创作者
- 希望在同一编辑流程内完成选图、涂抹、预览、确认并回写画布的用户

---

## 2. 入口与布局

### 2.1 入口

#### 2.1.1 从 Apps 点击

- **位置**：左侧边栏 → **Apps** Tab → 应用网格，为首期可点击的 5 个应用之一（与 AI Image Generator、AI Filter、Image Enhancer、Background Remover 并列）。
- **标识**：名称为「AI Removal」（多语言键 `aiRemoval`），图标为 QuickRemovalIcon，背景渐变为 `from-gray-200 to-slate-200`。
- **行为**：点击后根据当前画板状态分支：
  - **已选中图片图层**：直接将该图层的 `imageUrl` 带入工具，并记录该图层 id（Confirm 时更新该图层）；打开 AI Removal 动态 Tab，**在画布区域显示统一图片弹窗**（选区步骤）。
  - **未选中图片图层**：不直接打开 Tab，先弹出「添加要擦除的图片」弹窗（见 3.1）；选图/上传后带入 URL，打开 AI Removal Tab，画布显示统一图片弹窗。
- **动态 Tab**：打开后在左侧栏仅显示圆形 logo（QuickRemovalIcon），悬停通过 `title` 展示「AI Removal」；Tab 可关闭（通过弹窗右上角叉关闭并返回 Apps，或通过其他 Tab 切换）。

#### 2.1.2 从图层工具栏（后续扩展）

- 当前版本**未**在图片图层悬浮工具栏提供「物体擦除」入口；可与 Image Enhancer 的「画质增强」入口对齐，后续在选中图片图层时增加一键进入 AI Removal 并带入该图。

### 2.2 布局

- **侧边栏（AI Removal Tab 内容区）**  
  - 顶部：固定标题栏，展示「AI Removal」。  
  - 主体（有图时）：
    - **模式**：High Quality / Fast 两个 Tab 式切换，High Quality 带「Hot」角标与 AI 图标。
    - **选区工具**：Brush / Magic / Auto Select 三选一（分段控件）。
    - **Size**：仅在选择 Brush 时显示，横向滑杆（1–100），与画布笔刷大小联动。
    - **Remove 按钮**：主操作按钮（渐变橙粉）；**无有效选区时禁用**（灰底、不可点），有笔刷绘制后启用。
    - **提示文案**：如「Paint over the object to remove」。
  - 无图时：仅展示一句提示「请上传或从画板选择一张图片」（`aiRemovalNoImageHint`）。

- **画布上的统一弹窗**  
  - **出现条件**：当前为 AI Removal Tab 且已带入一张图（`aiRemovalSourceUrl` 有值）。  
  - **位置**：覆盖**中间编辑区域**全屏，半透明白底（如 `bg-white/95`），内容居中。  
  - **弹窗结构**（始终一致，不因 Remove 前后改变尺寸）：
    - **图片区**：固定比例（如 3:4）、最大高度约 70vh，圆角边框阴影。
    - **选区步骤**：图片区显示原图 + 红色半透明笔刷绘制区域；用户涂抹后，侧栏 Remove 按钮变为可点。
    - **对比步骤**（点击 Remove 后）：同一图片区内叠加 Before/After 对比（可拖拽竖线滑杆）、左上 Before 分辨率、右上 After 分辨率；**图片下方**单独一行「放弃」「确认」按钮。
    - **右上角关闭（X）**：始终可见，点击后关闭 AI Removal Tab、清空状态并返回 Apps Tab。
  - **关闭与返回**：
    - **放弃**：仅关闭对比视图，回到选区步骤，不关闭 Tab。
    - **确认**：将结果写回画布（更新来源图层或新增图片图层），然后关闭 Tab 并返回 Apps。
    - **右上角 X**：不写回画布，直接关闭 Tab 并返回 Apps。

---

## 3. 功能需求详述

### 3.1 从 Apps 打开且无选中图时的入口弹窗

- **触发**：用户点击 Apps 中的 AI Removal，且当前未选中任何图片图层（或选中的不是图片类型/无 imageUrl）。
- **弹窗标题**：`aiRemovalModalTitle`（如「添加要擦除的图片」）。
- **弹窗内容**：  
  - **若画板中存在至少一个图片图层**：展示「上传图片」按钮 +「画板中的图片」列表（缩略图 + 名称），点击列表中某张图即带入该图并关闭弹窗、打开 AI Removal Tab 并显示画布上的统一弹窗（选区步骤）；此时**不**记录为「画布选中图层」来源，Confirm 时将**新增**图片图层。  
  - **若画板中不存在任何图片图层**：仅展示「上传图片」按钮。  
- **上传图片**：点击后触发本地文件选择（accept 图片），选择后生成对象 URL，带入该 URL 并关闭弹窗、打开 AI Removal Tab。当前为占位，无实际上传至服务端逻辑。  
- **关闭**：点击弹窗外部或关闭按钮可关闭弹窗，不打开 AI Removal。

### 3.2 侧边栏内容（模式 + 工具 + Remove）

- **模式（High Quality / Fast）**  
  - 两个 Tab：High Quality（带 AI 图标 + Hot 角标）、Fast（带 Zap 图标）。  
  - 选中项底部 teal 下划线。当前为 UI 占位，未参与去除接口参数（后续可对应不同模型或质量/速度策略）。  

- **选区工具（Brush / Magic / Auto Select）**  
  - 三选一分段控件，文案为 `aiRemovalBrush`、`aiRemovalMagic`、`aiRemovalAutoSelect`。  
  - **Brush**：当前唯一实现选区的工具；画布上显示红色半透明笔刷，拖拽绘制选区，笔刷大小由下方 Size 滑杆控制。  
  - **Magic / Auto Select**：当前仅 UI，画布行为与 Brush 一致；后续可实现「点选相似区域」「自动识别主体/背景」等。  

- **Size**  
  - 仅当工具为 Brush 时显示；标签 `aiRemovalSize`，滑杆 1–100，与画布笔刷半径联动（如 `(size/100)*40+4` 像素）。  

- **Remove 按钮**  
  - 文案 `aiRemovalRemove`；样式为渐变橙粉，hover 加深。  
  - **禁用规则**：无有效选区时禁用（灰底、灰字、`cursor-not-allowed`）。有效选区定义为：用户在画布图片上至少绘制过一笔（点击或拖拽产生笔刷轨迹）。  
  - **点击后**：侧栏不关闭；画布弹窗由「选区步骤」切换为「对比步骤」（同一弹窗内叠加滑杆与 Before/After 标签，下方显示放弃/确认）。  

- **无图时**：不展示模式/工具/Remove，仅展示 `aiRemovalNoImageHint`。

### 3.3 画布统一弹窗：选区步骤

- **图片区**：显示当前要擦除的图片（object-contain，不裁剪），比例与弹窗尺寸固定。  
- **笔刷**：红色半透明圆形笔刷，随鼠标移动显示；左键按下并拖拽在画布上绘制红色轨迹。  
- **选区状态**：任意一笔绘制后，侧栏 Remove 按钮变为可点；该状态在 Discard 回到选区步骤后保持（画布笔刷轨迹保留）。  
- **与侧栏联动**：Size 滑杆仅 Brush 时显示，与笔刷半径实时同步。

### 3.4 画布统一弹窗：对比步骤

- **触发**：用户点击侧栏 Remove 后，同一弹窗内切换为对比步骤。  
- **对比图**：  
  - 同一图片区，底层为「After」、顶层为「Before」，通过 `clip-path` 与可拖拽竖线滑杆控制左右可见比例。  
  - 图片使用 object-contain，与选区步骤一致，不放大、不改变弹窗尺寸。  
- **分辨率标签**：图片加载后读取原始宽高，左上角「Before [宽] * [高]」，右上角「After [宽] * [高]」。当前 After 与 Before 同图同尺寸占位（无真实去除接口时）。  
- **滑杆**：竖线中段圆形手柄（左右箭头图标），可横向拖动改变 Before/After 可见比例。  
- **按钮（图片下方单独一行）**：  
  - **放弃**：X 图标 + `imageEnhancerDiscard`（与 Image Enhancer 共用）；白底灰边。点击后**仅关闭对比视图、回到选区步骤**，不关闭 Tab。  
  - **确认**：Check 图标 + `confirm`；主色（teal）。点击后：若进入 AI Removal 时来自**画布选中图层**则更新该图层 `imageUrl` 为结果图；若来自**弹窗选图/上传**则在画布**新增**图片图层并选中；然后关闭 AI Removal Tab 并返回 Apps。  
- **右上角 X**：与选区步骤相同，点击后关闭 Tab、清空来源图与来源图层状态，返回 Apps；**不**写回画布。

### 3.5 其他交互

- 从 Apps 打开且已选中图片图层时，会记录 `aiRemovalSourceLayerId`，Confirm 时更新该图层；从弹窗选图/上传时 `aiRemovalSourceLayerId` 为 null，Confirm 时新增图层。  
- 侧边栏宽度约 320px，标题栏、圆角、边框与主 PRD 约定一致。  
- 每次新带入图片（无论从画布选中还是弹窗）时，**有效选区**状态重置为 false，Remove 按钮再次禁用直至用户绘制新的一笔。

---

## 4. 界面与交互

### 4.1 尺寸与样式约定

- 侧栏内容区宽度：约 320px（w-80）。  
- 模式 Tab、选区工具分段控件、Size 滑杆：圆角、灰底边框，与其它 App Tab 控件风格一致。  
- Remove 按钮：有选区时渐变 `from-orange-500 to-pink-500`，无选区时 `bg-gray-200 text-gray-400 cursor-not-allowed`。  
- 画布弹窗：覆盖中间编辑区域，半透明白底；图片区圆角、边框、阴影；对比滑杆为白线 + 圆形灰底白边手柄；放弃/确认按钮在图片下方一行，间距适中。  
- 右上角关闭：圆形灰底、X 图标，`absolute top-4 right-4 z-50`。

### 4.2 无障碍与语义

- 滑杆手柄使用 `aria-label="拖动对比"`。  
- 放弃 / 确认按钮使用 `aria-label` 与可见文案一致。  
- Remove 按钮在禁用时 `disabled={true}`，便于读屏与键盘焦点。  
- 右上角关闭按钮建议使用 i18n 文案（如「关闭」/ "Close"）作为 `aria-label`（当前可为占位）。

---

## 5. 多语言与文案

### 5.1 已用 i18n 键（中/英）

| 键 | 中文 | 英文 |
|----|------|------|
| aiRemoval | AI Removal | AI Removal |
| aiRemovalModalTitle | 添加要擦除的图片 | Add image to remove from |
| aiRemovalUploadImage | 上传图片 | Upload image |
| aiRemovalSelectFromArtboard | 从画板选择图片 | Select from artboard |
| aiRemovalNoImageHint | 请上传或从画板选择一张图片 | Upload or select an image |
| aiRemovalImagesOnArtboard | 画板中的图片 | Images on artboard |
| aiRemovalHighQuality | High Quality | High Quality |
| aiRemovalFast | Fast | Fast |
| aiRemovalBrush | Brush | Brush |
| aiRemovalMagic | Magic | Magic |
| aiRemovalAutoSelect | Auto Select | Auto Select |
| aiRemovalSize | Size | Size |
| aiRemovalRemove | Remove | Remove |
| aiRemovalPaintHint | Paint over the object to remove | Paint over the object to remove |
| aiRemovalHot | Hot | Hot |
| imageEnhancerBefore | Before | Before |
| imageEnhancerAfter | After | After |
| imageEnhancerDiscard | 放弃 | Discard |
| confirm | 确认 | Confirm |

说明：对比步骤中的 Before/After、放弃、确认与 Image Enhancer 共用 i18n 键；若需区分「物体擦除」场景文案可后续拆分。

---

## 6. 后续扩展说明

以下为当前未实现或仅占位的部分，PRD 仅作范围说明，不做实现承诺：

- **去除能力**：调用物体擦除/修复接口，传入原图与选区（笔刷轨迹或 mask），返回结果图；Confirm 时使用真实结果图 URL 更新/新增图层。  
- **选区参与请求**：将画布笔刷轨迹（或生成的 mask）随 Remove 请求发送给后端，用于指定擦除区域。  
- **Magic / Auto Select**：实现点选相似区域、自动识别主体或背景等选区方式，与 Brush 并列；画布交互与 Remove 请求需支持多种选区输入。  
- **High Quality / Fast**：与后端模型或队列策略联动，影响处理速度与效果。  
- **Loading 与错误态**：Remove 请求期间显示 loading（遮罩 + 文案）；请求失败时提示与重试。  
- **从画板选择时记录来源图层**：若入口弹窗「从画板选择」能明确选中某一图层，可传入该图层 id，Confirm 时更新该图层而非新增，与「从画布选中图层打开」行为一致。  
- **图层工具栏入口**：在图片图层悬浮工具栏增加「物体擦除」按钮，点击带入该图并打开 AI Removal，与 Image Enhancer「画质增强」入口对齐。  
- **关闭按钮 i18n**：弹窗右上角 X 的 `aria-label` 使用统一 i18n 键（如 `close`）。

以上扩展需与后端、AI 能力及聚合编辑器整体规划对齐后再细化需求与优先级。
