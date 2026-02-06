# AI Filter 产品需求文档 (PRD)

> **文档版本**: V1.0  
> **创建日期**: 2026-02-02  
> **最后更新**: 2026-02-02  
> **产品名称**: AI Filter（AI 滤镜）  
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

AI Filter 是聚合编辑器（Aggregation Editor）左侧边栏「应用」Tab 下的应用之一，为用户提供基于画板图片或本地上传图片的 AI 滤镜效果选择与应用能力。用户可在同一面板内完成图片来源选择、分类浏览与滤镜效果点击，后续可对接「应用滤镜」将效果作用于画板图层。

### 1.2 核心价值

- **双源输入**：支持从画板选中图片图层直接作为滤镜对象，或通过拖放/上传从设备添加图片，减少切换与重复上传。
- **分类浏览**：按分类（如 Hot、AI Star、AI Weather、Pet、Portrait、Landscape、Vintage）快速筛选滤镜风格。
- **一站式操作**：在编辑器内完成选图 → 选分类 → 选滤镜的流程，无需跳转其他页面。
- **与画布联动**：在 AI Filter 页时，选中画板上的图片图层不会自动切到「图片」Tab，保持当前展示画板选中图，便于对比与应用。

### 1.3 目标用户

- 在聚合编辑器中需要对已有图片施加风格化、艺术化滤镜的创作者
- 需要按场景（人像、宠物、风景、复古等）快速试效果的轻度用户
- 依赖画板内已有图层的编辑流程、希望少切换 Tab 的用户

---

## 2. 入口与布局

### 2.1 入口

- **位置**：左侧边栏 → **Apps** Tab → 应用网格中，为首期可点击的 5 个应用之一（与 AI Image Generator、Image enhancer、Background remover、Magic Eraser 并列）。
- **标识**：名称为「AI Filter」（多语言见后），图标为 `icon/Icon/Edit/AI Editor.svg`（AI Editor 图标），背景渐变为 `from-violet-200 to-purple-100`。
- **行为**：点击后在该侧栏下方以**动态 App Tab** 形式打开「AI Filter」内容区，与「batch」等常驻 Tab 并列；Tab 可关闭（hover 显示关闭按钮）。
- **左侧栏 Tab 形态**：由 Apps 打开的动态 Tab 在左侧栏仅显示**圆形 logo**（AI Editor 图标置于圆形容器内，无文字），与常驻 Tab（图标 + 文字）形成差异；悬停时通过 `title` 展示「AI Filter」。

### 2.2 内容区整体布局

- **顶部**：固定标题栏，展示当前应用名称（多语言键 `aiFilter`）。
- **主体**：单列可滚动区域，从上到下依次为：
  1. **图片区**：有画板选中图片时显示该图预览；否则显示上传/拖放区。
  2. **分类 Tag 栏**：横向可滚动的分类标签（左/右箭头 + 隐藏滚动条）。
  3. **滤镜效果网格**：3 列网格，每格为「缩略图 + 文案」的滤镜卡片，可纵向滚动。

---

## 3. 功能需求详述

### 3.1 图片来源与预览

- **画板选中图优先**：
  - 当用户在画布上选中的图层为**图片类型**且该图层有 `imageUrl` 时，AI Filter 内容区顶部显示该图片的预览（方形比例，最大高度约 128px，圆角、边框、object-contain），**不显示**上传框。
  - 当无选中图片或选中图层非图片/无图片地址时，显示上传/拖放区。
- **与 Tab 联动**：用户在 AI Filter Tab 下选中画板中的图片图层时，**不**自动切换到「图片」Tab，仍停留在 AI Filter，仅更新顶部预览图为该图层图片（见 [Aggregation Editor] 与 editor 逻辑）。
- **上传区（无选中图时展示）**：
  - 虚线边框容器，最小高度约 140px，内有三部分文案 + 一个「上传」按钮。
  - 文案第一段两行：`aiFilterUploadLine1` + `aiFilterUploadLine2`（如「拖放图片，」「或从设备添加」）。
  - 文案第二段：`aiFilterSelectFromArtboard`（如「从画板选择图片」/「Select image from artboard」）。
  - 按钮：Upload 图标 + `upload` 文案（如「上传」），主色 teal。
  - 拖放：支持 `dragOver` / `dragLeave` / `drop`，拖入时边框与背景高亮（如 border-teal-400、bg-teal-50）；当前为占位，无实际上传/解析逻辑。

### 3.2 分类 Tag 栏

- **分类列表**（当前写死）：`Hot`、`AI Star`、`AI Weather`、`Pet`、`Portrait`、`Landscape`、`Vintage`。
- **交互**：单选，选中项为 teal 实心背景 + 白字，未选为灰字；点击切换分类，下方滤镜网格随分类切换（当前实现中网格内容与分类暂未联动，为占位）。
- **滚动**：标签过多时横向滚动，隐藏滚动条；左侧「可向左滚动」时显示左箭头按钮，右侧「可向右滚动」时显示右箭头按钮，点击分别向左/右平滑滚动一定距离（如 120px），与其它 Tab 分类栏行为一致。

### 3.3 滤镜效果网格

- **布局**：3 列网格，间距约 8px，整体可纵向滚动，底部留白。
- **单卡**：每个滤镜为一张卡片，包含：
  - **上方**：正方形比例缩略图区域，当前为占位（灰色底 + Sparkles 图标），无真实滤镜预览图。
  - **下方**：一行文案，小号字体、截断，展示滤镜名称（如 Puppy Face、Angel Wings、Bubblegum Pop、Baby Career、Heart Spotlight、Valentine Accent、Cupid Shot、Love Mood Grid、Rose Moment、Sweetheart Dish、Valentine Cutie、Valentine Mood 等）。
- **交互**：点击卡片为占位（无应用滤镜到画板/当前图的后端或画布逻辑），卡片 hover 时边框与背景高亮（如 border-teal-300、bg-teal-50/50）。

### 3.4 其他交互

- **点击外部**：无全局弹窗，无额外关闭逻辑。
- **无障碍**：分类栏左右箭头按钮可加 `aria-label`（如「向左滚动」「向右滚动」）；上传区若后续支持文件选择，需保证焦点与键盘可操作。

---

## 4. 界面与交互

### 4.1 尺寸与样式约定

- 侧栏内容区宽度：约 320px（w-80）。
- 标题栏：px-4 py-3，底部分隔线。
- 上传区：圆角 xl、虚线边框 2px，拖拽高亮为 teal 系。
- 分类 Tag：圆角 lg，px-3 py-1.5，text-xs，与 Ratio/Layout 等 Tab 的 tag 风格一致。
- 滤镜卡片：圆角 lg，边框 gray-200，背景 gray-50，hover 时 teal 系。

### 4.2 与主 PRD 的一致性

- 左侧边栏、动态 App Tab、多语言等遵循 [Aggregation Editor PRD](./aggregation-editor-prd.md) 的通用约定。
- 模板分类中的「AI Filter」入口（若有）使用同一多语言键 `templateCategoryAIFilter`，与当前应用名称区分用途即可。

---

## 5. 多语言与文案

### 5.1 已用 i18n 键（中/英）

| 键 | 中文 | 英文 |
|----|------|------|
| aiFilter | AI Filter | AI Filter |
| aiFilterDragDrop | 将文件拖放到此处 | Drag and drop your files here |
| aiFilterUploadLine1 | 拖放图片， | Drag and drop images, |
| aiFilterUploadLine2 | 或从设备添加 | or add from your device |
| aiFilterSelectFromArtboard | Select image from artboard | Select image from artboard |
| upload | 上传 | Upload |
| templateCategoryAIFilter | AI Filter | AI Filter |

说明：`aiFilterSelectFromArtboard` 中文当前为英文占位，建议后续改为「从画板选择图片」等中文文案。分类名称（Hot、AI Star 等）与滤镜名称（Puppy Face、Angel Wings 等）当前为产品内写死英文，如需多语言可后续拆为 i18n。

---

## 6. 后续扩展说明

以下为当前未实现或仅占位的部分，PRD 仅作范围说明，不做实现承诺：

- **上传/拖放**：实际文件解析、预览、与「当前处理图」的绑定；多图或单图策略。
- **分类与滤镜数据**：分类与滤镜列表由后端或配置下发；切换分类后网格内容联动。
- **滤镜预览图**：每个滤镜卡片的缩略图来源（CDN/生成接口）。
- **应用滤镜**：点击某滤镜后，将效果应用到画板当前选中图层或当前「处理图」的完整流程（接口、画布更新、撤销/重做）。
- **从画板选择图片**：若用户未选图层，是否提供「从画板选择一张图」的列表或点击画布选图的能力，与 `aiFilterSelectFromArtboard` 文案对应。

以上扩展需与后端、AI 能力及聚合编辑器整体规划对齐后再细化需求与优先级。
