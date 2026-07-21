# PhotoGrid Web Creation 页面产品需求文档

> 文档版本：V1.0  
> 创建日期：2026-07-20  
> 产品模块：Creation Hub  
> 页面路由：`/creation`  
> 文档状态：原型评审稿  
> 适用范围：Web 桌面端优先，兼顾平板与移动端

---

## 1. 文档目的

本文档用于说明 PhotoGrid Web Creation 页面的产品定位、信息架构、功能规则、交互流程、数据要求和验收标准，供产品、设计、前端、后端、算法、测试和运营共同评审。

Creation 页面是 PhotoGrid Web 各类 AI 创作能力的统一入口与内容管理中心，不承担完整编辑器职责。用户从 Creation 发现工具、选择模板或提交 Agent 需求后，进入对应的独立工具页面完成具体任务；生成结果和上传素材统一在 Projects 区域管理。

---

## 2. 背景与问题

PhotoGrid Web 已存在 AI Image、AI Video、AI Photo Editor、E-commerce Video、AI Avatar、Background Remover 等多个独立工具页面。随着工具数量增加，当前产品面临以下问题：

1. 用户需要提前知道工具名称，才能找到正确入口。
2. 工具、模板、生成结果和上传素材分散，返回与继续创作成本较高。
3. 不同工具各自维护模板分类，缺少统一发现入口。
4. 新用户更容易从“我要完成什么”出发，而不是从工具名称出发。
5. 老用户需要快速回到最近任务、素材或常用工具。

因此需要一个聚合层，将“提出需求、发现工具、使用模板、管理结果”组织为连续流程，同时保留各工具独立页面的专业工作区。

---

## 3. 产品定位

### 3.1 一句话定位

Creation 是 PhotoGrid Web 的 AI 创作首页，帮助用户从自然语言、工具、模板或历史项目四种路径快速开始和继续创作。

### 3.2 核心价值

| 价值 | 说明 |
|---|---|
| 统一发现 | 汇总各类 AI 图片、视频、编辑和设计工具 |
| 降低决策成本 | 通过 Agent 理解需求并推荐合适工作流 |
| 模板复用 | 统一浏览各功能的可用模板、风格和 Avatar 预设 |
| 任务续接 | 管理生成结果、编辑项目、Agent 会话和上传文件 |
| 独立工作区分发 | Creation 负责入口和管理，具体能力继续在独立页面执行 |

### 3.3 产品边界

Creation 页面负责：

- 展示 Agent 统一输入入口。
- 展示运营内容和推荐工具。
- 提供完整工具目录。
- 提供跨功能模板目录。
- 提供 Projects 与 My Upload 管理入口。
- 跳转到具体工具、编辑器或 Agent 工作区。

Creation 页面不负责：

- 在聚合页内实现完整图片或视频编辑器。
- 在聚合页内承载长链路 Agent 对话。
- 在聚合页内完成复杂模型参数配置。
- 取代各工具已有的独立页面和工作流。

---

## 4. 目标与衡量指标

### 4.1 产品目标

1. 用户在进入页面后 10 秒内找到合适的创作入口。
2. 降低新用户对工具名称和能力边界的理解成本。
3. 提升模板使用率、工具点击率和历史项目续作率。
4. 建立跨工具统一的任务与素材管理结构。
5. 为后续个性化推荐、运营配置和 Agent 编排预留扩展能力。

### 4.2 核心指标

| 指标 | 定义 |
|---|---|
| Creation 到工具点击率 | 进入 Creation 后点击任一工具的用户占比 |
| Agent 启动率 | 进入 Creation 后点击 Send 并进入 Agent 的用户占比 |
| 模板使用率 | 浏览 Templates 后点击使用模板的用户占比 |
| 项目续作率 | 打开 Projects 后继续编辑、重建或下载的用户占比 |
| 首次有效操作耗时 | 页面加载完成至第一次工具、模板或 Agent 操作的时间 |
| Creation 跳失率 | 未发生有效操作即离开的用户占比 |

---

## 5. 目标用户与主要场景

### 5.1 目标用户

| 用户类型 | 核心诉求 |
|---|---|
| 电商卖家 | 快速制作商品图、详情页、UGC 广告和商品展示视频 |
| 内容创作者 | 生成短视频、社交图片、海报和热门风格内容 |
| 普通图片用户 | 去背景、消除、增强、修复和拼图 |
| 营销与运营人员 | 复用品牌内容、模板和批量素材 |
| 回访用户 | 快速找到历史任务、Agent 会话和上传文件 |

### 5.2 核心使用场景

1. 用户描述目标，由 Agent 判断任务类型并进入对应工作流。
2. 用户明确知道工具名称，从 Tools 直接进入独立页面。
3. 用户先浏览效果，从 Templates 选择可复用样式或结构。
4. 用户从 Projects 重新打开历史结果或编辑项目。
5. 用户从 My Upload 查找自己上传的图片、视频和音频。

---

## 6. 页面信息架构

### 6.1 总体结构

```text
Creation
├── Sidebar
│   ├── Brand / Collapse
│   ├── Create New
│   ├── Home
│   ├── Tools
│   ├── Templates
│   ├── Projects
│   ├── Resources
│   │   ├── Blog
│   │   ├── Price
│   │   └── Language
│   └── User Profile
└── Main Content
    ├── Home
    │   ├── Agent Entry
    │   ├── What's New
    │   ├── Recommended Tools
    │   └── Template Recommendations
    ├── Tools Library
    ├── Templates Library
    └── Projects
        ├── Projects
        └── My Upload
```

### 6.2 一级导航命名

| 导航 | 定位 | 命名原则 |
|---|---|---|
| Home | 聚合首页 | 展示最常用入口和推荐内容 |
| Tools | 完整工具目录 | 用户知道要使用哪类能力时进入 |
| Templates | 可直接复用的模板、风格和 Avatar 预设 | 使用 `Templates` 而非 `Inspire`，强调可操作性 |
| Projects | 历史任务、编辑项目和上传素材管理 | 页面内通过一级切换区分 Projects 与 My Upload |

`Inspire` 暂不作为一级导航。后续若加入社区作品、案例、教程和趋势内容，可新增 Inspire，并将 Templates 作为其子模块或保留独立入口。

---

## 7. 全局框架需求

### 7.1 左侧边栏

#### 7.1.1 展开状态

- 桌面端默认宽度约 248px，并固定铺满视口高度。
- 顶部展示 PhotoGrid Logo、品牌名称和收起按钮。
- Logo、Create New 和各导航图标保持同一视觉中轴。
- 一级导航仅展示标题，不展示描述文字。
- 当前页面使用浅青色背景和青色图标高亮。
- Resources 固定在主导航下方区域。
- 底部展示用户头像与用户名，不展示 UID。

#### 7.1.2 收起状态

- 宽度约 84px，仅展示图标和必要短标签。
- Logo hover 时切换为展开按钮。
- 当前激活项仍需保留明确高亮。
- 收起和展开过程使用 200-300ms 平滑动画。

#### 7.1.3 Create New

- 展开状态为带加号的主按钮。
- 收起状态仅展示加号图标。
- MVP 可暂不配置跳转；正式上线前必须确定目标：Agent 新会话、创建菜单或默认编辑器。

### 7.2 视觉规范

- 页面仅使用浅色主题。
- 主内容背景为白色。
- 不使用深色整页背景或大面积装饰渐变。
- 卡片圆角建议 8-14px，避免过度圆润。
- 青色为主交互色，深色用于主要文字和发送按钮。
- 页面内容密度以桌面首屏可发现多个入口为目标。

### 7.3 页面标题

- Tools 与 Templates 在内容区左上角显示简洁页面标题。
- Projects 标题同时承担 `Projects / My Upload` 一级切换，不额外重复标题。
- Home 不展示冗余的 Home 页面标题，直接从 Agent 入口开始。

---

## 8. Home 功能需求

### 8.1 Agent 统一入口

#### 8.1.1 目标

让不了解工具体系的用户直接描述创作目标，由 Agent 识别场景、补全信息并进入对应工作流。

#### 8.1.2 默认状态

- 标题：`Create images, videos, posters, and brand assets with AI`。
- 输入区域支持自然语言描述。
- 左下角提供：
  - 添加图片或视频。
  - Auto 模式。
  - 资产入口。
  - Prompt 或知识参考入口。
- 右下角提供 Send 按钮。
- 输入框下方展示三类快速任务：
  - E-commerce Video。
  - AI Editor。
  - AI Filter。

#### 8.1.3 分类展开规则

点击快速任务后，原卡片区域切换为该分类的子任务：

| 一级分类 | 子任务 |
|---|---|
| E-commerce Video | Short Drama Ad、UGC Ad、TVC Ad、Product Showcase |
| AI Editor | Auto Removal、Image Enhance、Background Removal |
| AI Filter | Product Filter、Portrait Filter、Style Filter、Color Filter |

交互要求：

- 点击一级分类只展开子任务，不默认选中第一个子任务。
- 点击子任务后，在输入框顶部显示选中胶囊和对应参数。
- 点击胶囊关闭按钮后，退出当前子任务并回到一级分类列表。
- 点击 Back 返回一级分类列表，并清空当前子任务参数。

#### 8.1.4 UGC Ad 参数

UGC Ad 选中后，输入框顶部以单行紧凑表单展示：

| 参数 | 控件 | 默认值/示例 |
|---|---|---|
| Product Name | 文本输入 | Enter product name |
| Spoken Language | 下拉 | English |
| Aspect Ratio / Platform | 下拉 | TikTok/Reels - 9:16 |
| Target Audience | 下拉 | Auto |
| Usage Scene | 下拉 | Auto |

不在该单行参数区展示：

- Product Image。
- Avatar。
- Background。
- Spoken Content。

素材上传和补充说明仍通过输入区左下角入口与正文完成。

#### 8.1.5 Send 与登录校验

- 未登录用户点击 AI Agent 工具入口时，先弹出登录引导。
- 未登录用户在 Home Agent 入口点击 Send 时，先弹出登录引导。
- 登录成功后恢复用户输入、已选子任务和参数，并继续进入 Agent 工作区。
- 已登录用户点击 Send 后创建 Agent Session，并进入独立 Agent 页面。

#### 8.1.6 Agent 下游能力边界

Creation 仅负责入口。进入 Agent 工作区后支持以下节点：

1. 需求理解：识别 `scene_type` 与 `task_type`。
2. 图片/视频分析：识别主体、风格、色调、构图和文字。
3. 信息追问：根据电商、视频、修图等场景补齐参数。
4. 设计生成：文生图或图生图。
5. 修图：调用现有消除、增强、换背景、抠图能力。
6. 视频生成：静态图转视频、视频模板和音乐。
7. 内容清单确认：批量任务生成前确认具体产出。
8. Manual 模式确认：生成前确认模型、参数和积分。
9. 过程反馈：理解、重连、失败、生成进度和预估时间。

### 8.2 What's New

- 横向单行滚动展示运营内容。
- 每张卡片仅展示真实图片、标题和右上角标签。
- 不展示卡片描述、额外图标或 View All。
- 桌面端首屏应露出 3-4 张卡片并提示后续内容可横向浏览。
- 内容由运营后台配置，支持上下线时间、排序、地区和语言。
- 点击后可跳转活动页、工具页、模板页或外部内容页。

### 8.3 Recommended Tools

- 合并原“大工具卡片”和 Quick Tools，形成单一推荐工具区。
- 左侧展示两张重点大卡，当前为 AI Image 与 AI Video。
- 右侧展示紧凑工具网格，并在右下角提供 More 入口。
- More 点击后切换到 Tools 页面。
- 卡片内容使用真实工具名称，不随布局参考图替换产品内容。
- 大卡图标置于标题左侧。

### 8.4 Home 模板推荐

- 顶部使用一级标签切换或定位不同模板场景。
- 多个模板场景可纵向排列，顶部标签点击后平滑定位。
- 每个场景使用横向流式卡片，支持左右浏览。
- 卡片默认只展示图片和标题。
- hover 时每张卡片均显示 `Use same style`。
- 不展示冗余的卡片右上角视频图标。

---

## 9. Tools 功能需求

### 9.1 页面结构

```text
Tools
├── Search Tools
├── Recently Used
├── 一级类型：Image / Video / Utility
└── 工具分类列表
```

### 9.2 搜索

- 支持按工具名称、别名和能力关键词搜索。
- 搜索结果实时过滤。
- 无结果时展示空状态和清空搜索操作。

### 9.3 Recently Used

- 默认展示最近使用的 3 个工具。
- 卡片仅展示图标和标题，不展示描述文字。
- 未登录或无历史记录时，可使用默认推荐工具替代。

### 9.4 工具分类

#### Image Tools

- AI Image。
- Grid。
- AI Photo Editor。
- AI Filter。
- Image Upscaler。
- Background Remover。
- Object Remover。
- Photo Restoration。
- Watermark Remover。

#### Video Tools

- AI Video。
- E-commerce Video。
- AI Avatar。

#### Creative Utilities

- AI Agent。

分类规则：

- Grid 属于 Image Tools。
- AI Image 与 AI Filter 必须在工具目录中可见。
- 不展示 Featured、Editing 或 Soon 分类/标签。
- `AI Editor` 的工具名称统一为 `AI Photo Editor`。

### 9.5 工具卡片

- 展示真实预览图、工具图标、标题和简短描述。
- 点击后进入该工具独立页面。
- 未实现或未开放的工具不可使用空链接冒充可用状态，应禁用或由配置控制隐藏。
- 工具列表、排序和推荐位应支持后台配置。

---

## 10. Templates 功能需求

### 10.1 命名原则

左侧一级导航使用 `Templates`，不使用 `Inspire`。

原因：当前内容均为可直接使用的模板、风格或预设，用户目标是“选择并使用”，而非单纯浏览案例。未来加入社区作品、教程和趋势内容时，再新增 Inspire。

### 10.2 一级模板分类

| 分类 | 内容范围 | 推荐卡片比例 |
|---|---|---|
| AI Video | 剧情、情侣、运动、幻想、节日、宠物视频模板 | 4:5 或 9:16 |
| AI Image | 电商场景、热门风格、Yearbook、光效、人像和产品风格 | 1:1 |
| E-commerce Video | UGC Review、Product Demo、Unboxing、Before & After、Lifestyle | 4:5 或 9:16 |
| AI Avatar | 生活、商务、时尚、运动、年龄与性别预设 | 3:4 |
| Collage & Poster | 营销、社交、计划、创意、生活时刻和节日静态模板 | 4:5，按真实模板比例扩展 |

### 10.3 二级筛选

- 仅展示当前一级分类对应的二级筛选。
- 默认选中 All。
- 切换一级分类后，二级筛选和搜索词重置。
- 二级筛选支持横向滚动，不换行挤压。

### 10.4 搜索

- 搜索范围限定在当前一级分类。
- 支持模板标题、分类标签、行业和场景关键词。
- 搜索结果展示数量。
- 无结果时提供 Clear Filters。

### 10.5 模板卡片

- 展示真实预览图、模板标题、分类标签和必要时长。
- hover 时展示使用按钮。
- CTA 根据内容类型使用：
  - 视频与静态结构：`Use template`。
  - AI Image：`Use style`。
  - AI Avatar：`Use avatar`。
- 点击后进入对应工具，并携带模板 ID、默认参数和来源参数。
- 不在 Creation 页直接加载完整编辑器。

### 10.6 大规模内容策略

- 一次仅显示一个一级模板库，避免五类内容全部纵向展开。
- 首次加载建议返回 20-30 条，后续使用分页或无限加载。
- 支持运营排序、个性化排序和默认趋势排序。
- 每个模板必须包含可用状态、目标工具和参数版本，避免模板与工具能力不兼容。

---

## 11. Projects 功能需求

### 11.1 一级切换

Projects 页面标题区直接提供：

- Projects。
- My Upload。

两个选项使用标题样式作为 tab，不额外放置重复的 Projects 标题或胶囊容器。

### 11.2 Projects 工具栏

同一行展示：

- 任务类型 tab。
- Tool 下拉筛选。
- Time Range。
- View Mode。
- 搜索框。
- Select 多选入口。

搜索框不得单独占用一整行。窄屏时允许按优先级折行，但应保持控件成组。

### 11.3 任务类型筛选

一级任务类型：

- All。
- Image。
- Video。
- Audio。
- Agent Sessions。
- Avatar。

二级 Tool 下拉：

- All。
- AI Agent。
- AI Image。
- AI Video。
- AI Voice。
- AI Photo Editor。
- E-commerce Video。
- AI Avatar。
- Background Remover。

规则：

- Agent Sessions 与 Avatar 选中时，不展示二级 Tool 筛选。
- Audio 的二级 Tool 仅展示 All、AI Voice 和适用的上传来源。
- `My Upload` 不作为 Projects 的普通任务标签；上传文件统一放在 My Upload 一级切换下。
- 二级默认文案使用 `All`，不使用 `All Tools`。

### 11.4 Time Range

- 默认 All time。
- 快捷选项包含 Today。
- 支持日历选择具体日期或日期范围。
- 选择后仅展示更新时间在范围内的任务。
- 可清除并恢复 All time。

### 11.5 View Mode

- Group by date：按日期分组，默认模式。
- Flat list：取消日期分组。
- 后续可扩展卡片大小，但 MVP 不要求用户自定义任意尺寸。

### 11.6 项目卡片统一结构

图片、视频、Avatar、Agent Session 和编辑项目使用统一结构：

1. 预览区域。
2. 左上角类型标签。
3. hover 右上角 More 按钮。
4. 可编辑标题。
5. 文件大小。
6. 更新时间。

标签规则：

| 数据条件 | 卡片标签 |
|---|---|
| `tool = AI Photo Editor` | Project |
| `taskType = Image` | Image |
| `taskType = Video` | Video |
| `taskType = Audio` | Audio |
| `taskType = Agent Sessions` | Agent Session |
| `taskType = Avatar` | Avatar |

### 11.7 More 菜单

hover 卡片后显示 More 按钮，点击后提供：

- Rename。
- Download。
- Delete。

Delete 为破坏性操作，正式版必须二次确认。没有下载产物的任务不展示 Download。

### 11.8 多选

- 点击 Select 进入多选模式。
- 卡片左上角展示复选框。
- 支持批量 Download 和 Delete。
- 退出多选后清空选择。
- 批量 Delete 必须二次确认并展示选中数量。

### 11.9 Audio 卡片

- 预览区使用播放按钮和波形，不强制生成封面图片。
- 标题、文件大小和时间仍放在卡片预览区下方，与其他任务卡片保持一致。
- 普通点击直接播放/暂停，不打开详情弹窗。
- 播放中状态应明确显示，并保证同一时间最多播放一个音频。

### 11.10 任务点击行为

| 类型 | 点击行为 |
|---|---|
| Image | 打开通用详情弹窗 |
| Video | 打开通用详情弹窗并支持播放 |
| Audio | 卡片内播放，不打开弹窗 |
| Avatar | 打开 Avatar 专用详情弹窗 |
| AI Photo Editor Project | 直接进入 AI Photo Editor |
| Agent Session | 直接进入对应 Agent 会话 |

### 11.11 通用详情弹窗

- 左侧展示图片或视频内容。
- 右侧展示标题、参考素材、Prompt、模型、比例、尺寸、时长、文件大小和更新时间。
- 底部提供 Recreate、Edit、Download。
- Recreate 返回原工具并带入原参数。
- Edit 仅在存在对应编辑能力时展示。
- 支持关闭按钮和 Esc 关闭。

### 11.12 Avatar 详情弹窗

保持浅色主题，展示：

- Avatar 标题与重命名入口。
- Base Image。
- Body Three Views：正面、侧面、背面。
- Voice 信息与试听。
- Switch Voice。
- Recreate。
- Create Similar Avatar。
- Generate Video。

---

## 12. My Upload 功能需求

### 12.1 定位

My Upload 用于管理用户主动上传的源文件，与系统生成任务分离。

### 12.2 类型筛选

- All。
- Image。
- Video。
- Audio。

My Upload 不再作为独立标签混入 Projects 的 Tool 分类。

### 12.3 页面规则

- My Upload 页面不展示搜索框。
- 支持 Time Range 与 View Mode。
- 支持多选、批量下载和删除。
- 图片和视频可打开详情弹窗。
- 音频直接播放，不打开详情弹窗。
- 卡片视觉结构与 Projects 保持一致。

---

## 13. 核心用户流程

### 13.1 Agent 发起任务

```text
进入 Creation
→ 输入需求或选择快速任务
→ 补充任务参数
→ 点击 Send
→ 登录校验
→ 创建 Agent Session
→ 进入 Agent 工作区
→ 生成结果写入 Projects
```

### 13.2 从工具开始

```text
进入 Creation
→ Tools
→ 搜索或选择工具
→ 登录/权限校验
→ 进入独立工具页
→ 完成任务
→ 结果写入 Projects
```

### 13.3 从模板开始

```text
进入 Creation
→ Templates
→ 选择一级类型
→ 筛选或搜索模板
→ 点击 Use template/style/avatar
→ 登录校验
→ 进入目标工具并加载模板参数
→ 结果写入 Projects
```

### 13.4 继续历史项目

```text
进入 Creation
→ Projects
→ 按任务类型、工具或时间筛选
→ 打开卡片
→ 查看详情或直接进入对应工作区
→ 继续编辑、重建或下载
```

---

## 14. 数据结构建议

### 14.1 Tool

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 工具唯一标识 |
| `name` | string | 展示名称 |
| `category` | enum | Image、Video、Utility |
| `description` | string | 简短描述 |
| `icon_url` | string | 图标 |
| `cover_url` | string | 卡片预览图 |
| `route` | string | 目标页面 |
| `availability` | enum | active、disabled、hidden |
| `auth_required` | boolean | 是否要求登录 |
| `sort_order` | number | 排序 |

### 14.2 Template

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 模板唯一标识 |
| `title` | string | 模板标题 |
| `template_type` | enum | ai_video、ai_image、ecommerce_video、avatar、design |
| `category` | string | 二级分类 |
| `cover_url` | string | 预览图 |
| `preview_url` | string? | 视频或动态预览 |
| `duration` | number? | 视频时长 |
| `aspect_ratio` | string | 画面比例 |
| `target_tool` | string | 目标工具 ID |
| `payload` | object | 模板默认参数 |
| `version` | string | 模板配置版本 |
| `availability` | enum | active、disabled、hidden |

### 14.3 Project

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 项目/任务唯一标识 |
| `title` | string | 可编辑标题 |
| `task_type` | enum | image、video、audio、agent_session、avatar、project |
| `tool_id` | string | 来源工具 |
| `status` | enum | processing、success、failed、draft |
| `cover_url` | string? | 封面图，音频可为空 |
| `output_url` | string? | 结果文件 |
| `file_size` | number? | 文件大小 |
| `prompt` | string? | 原始 Prompt |
| `parameters` | object | 模型和生成参数 |
| `created_at` | datetime | 创建时间 |
| `updated_at` | datetime | 更新时间 |

### 14.4 Upload

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 上传文件唯一标识 |
| `name` | string | 文件名 |
| `media_type` | enum | image、video、audio |
| `url` | string | 文件地址 |
| `cover_url` | string? | 封面，音频可为空 |
| `file_size` | number | 文件大小 |
| `duration` | number? | 音视频时长 |
| `created_at` | datetime | 上传时间 |

---

## 15. 状态与异常处理

### 15.1 通用状态

每个数据模块必须支持：

- Loading：使用保持布局稳定的骨架屏。
- Empty：解释当前没有内容，并给出下一步操作。
- Error：展示失败原因和 Retry。
- Offline：提示网络不可用，不丢失输入内容。
- Permission denied：说明权限要求并提供登录或升级入口。

### 15.2 Agent 状态

| 状态 | 中文 | 英文 |
|---|---|---|
| thinking | 思考中 | Understanding Your Request... |
| reconnecting | 重连中 | Reconnecting... |
| reconnectFailed | 重连失败 | Connection Failed |
| generating | 生成中 | Generating... |
| failed | 生成失败 | Generation Failed |

### 15.3 项目状态

- processing：卡片展示进度和预估时间。
- failed：展示失败标签和 Retry。
- draft：允许继续编辑。
- success：允许查看、下载、重建和编辑。

---

## 16. 登录、权限与积分

- Home、Tools 和 Templates 可允许未登录用户浏览。
- Agent Send、使用模板、进入需保存结果的工具、Projects 和 My Upload 需要登录。
- 登录弹窗关闭后保留当前页面、输入和筛选状态。
- 需要积分的生成操作必须在实际提交前展示积分消耗。
- 无积分时提供升级或购买入口，不直接丢弃任务配置。
- Price 与 Upgrade 的展示由商业化配置控制，不在 Creation 原型中强制固定位置。

---

## 17. 响应式与可访问性

### 17.1 响应式

| 断点 | 行为 |
|---|---|
| ≥ 1280px | 展开侧边栏，工具/模板/项目卡片最多 5 列 |
| 768-1279px | 侧边栏可收起，卡片 3-4 列 |
| < 768px | 侧边栏变为抽屉或底部导航，卡片 2 列，工具栏允许折行 |

要求：

- 不出现无意义的横向页面滚动。
- 模板分类和任务 tab 可在自身容器内横向滚动。
- 标题、按钮和标签不得重叠或被截断到不可理解。
- 固定侧边栏不遮挡右侧内容。

### 17.2 可访问性

- 所有图标按钮必须具有可读 `aria-label`。
- tab 使用正确的选中状态。
- 弹窗支持键盘焦点锁定、Esc 关闭和关闭后焦点恢复。
- 可交互卡片支持键盘 Enter/Space。
- 文本与背景对比度满足 WCAG AA。
- 不仅依赖颜色表达选中、失败或禁用状态。

---

## 18. 埋点需求

| 事件 | 触发时机 | 关键参数 |
|---|---|---|
| `creation_page_view` | 进入 Creation | source、login_status、locale |
| `creation_sidebar_click` | 点击一级导航 | nav_id、collapsed |
| `creation_sidebar_toggle` | 收起/展开侧边栏 | target_state |
| `creation_agent_mode_click` | 点击 Agent 分类或子任务 | group_id、template_id |
| `creation_agent_send` | 点击 Send | template_id、has_media、login_status |
| `creation_promo_click` | 点击 What's New | content_id、position |
| `creation_tool_click` | 点击工具 | tool_id、section、position |
| `creation_template_filter` | 切换模板分类 | type、category |
| `creation_template_use` | 使用模板 | template_id、type、target_tool |
| `creation_project_filter` | 使用项目筛选 | task_type、tool、time_range、view_mode |
| `creation_project_open` | 打开任务 | project_id、task_type、tool_id |
| `creation_project_action` | 重命名、下载、删除、重建或编辑 | project_id、action |
| `creation_upload_open` | 打开上传文件 | upload_id、media_type |

---

## 19. 优先级与版本范围

### 19.1 P0 - MVP 上线必须具备

- 固定可收起侧边栏。
- Home Agent 入口与登录校验。
- What's New 和 Recommended Tools。
- Tools 搜索、分类和真实路由。
- Templates 五类入口、二级筛选、搜索和模板跳转。
- Projects/My Upload 一级切换。
- Projects 类型筛选、Tool 筛选、搜索和日期分组。
- 统一任务卡片与基础详情弹窗。
- Audio 卡片播放。
- 空状态、错误状态和 Loading 状态。
- 核心埋点。

### 19.2 P1 - 上线后优化

- Time Range 完整日期范围选择。
- View Mode 和卡片尺寸偏好持久化。
- 批量下载与批量删除。
- Avatar 专用详情和语音切换。
- 模板动态预览与无限加载。
- 运营后台动态配置推荐位和 What's New。
- 最近使用工具个性化。

### 19.3 P2 - 后续探索

- 个性化工具和模板排序。
- Inspire 社区内容、案例和教程。
- 跨工具收藏夹。
- 品牌资产与团队协作。
- Creation 全局命令面板。

---

## 20. 原型现状与待接入能力

当前 `/creation` 原型已表达主要布局和前端交互，但以下内容仍属于 mock 或待接入状态：

| 能力 | 当前状态 | 上线要求 |
|---|---|---|
| 工具和模板数据 | 本地静态数据 | 接入配置或内容服务 |
| Agent Send | 原型按钮 | 接入登录、会话创建和路由 |
| 部分工具入口 | 使用 `#` 占位 | 配置真实路由或隐藏 |
| Recently Used | 固定示例 | 接入用户使用历史 |
| Project 数据 | 本地示例 | 接入统一任务服务 |
| Rename/Download/Delete | 视觉交互 | 接入真实接口、状态和错误处理 |
| Time Range/View Mode | 原型交互 | 接入真实筛选和偏好持久化 |
| Audio 播放 | 波形原型 | 接入真实音频 URL 和播放状态 |
| 模板使用 | hover CTA | 接入模板参数和目标工具 |
| 登录与积分 | 未完整接入 | 接入统一账户与商业化能力 |

---

## 21. 验收标准

### 21.1 全局

- `/creation` 可稳定访问，`/en/creation` 可正确跳转或加载国际化版本。
- 桌面端侧边栏固定铺满视口，展开与收起不遮挡主内容。
- 页面保持浅色主题，无深色整页区域。
- 所有可见工具入口均有明确可用状态和正确目标路由。

### 21.2 Home

- Agent 分类、子任务、参数和关闭胶囊交互符合第 8.1 节。
- 未登录点击 Agent Send 时出现登录引导，登录后恢复上下文。
- What's New 仅展示图片、标题和右上角标签。
- Recommended Tools 的 More 可进入 Tools。
- 所有 Home 模板卡片 hover 时均显示使用按钮。

### 21.3 Tools

- AI Image、AI Filter 和 Grid 均出现在 Image Tools。
- Recently Used 卡片不展示描述。
- 搜索可正确过滤工具并展示空状态。
- 页面不出现 Featured、Editing 和 Soon。

### 21.4 Templates

- 五个一级分类均可切换。
- 切换一级分类后重置二级筛选和搜索。
- 搜索仅作用于当前一级分类。
- 不同模板类型使用正确比例和 CTA。
- 点击模板可携带模板 ID 进入正确工具。

### 21.5 Projects

- Projects 与 My Upload 使用标题式一级切换。
- 任务类型、Tool、Time Range、View Mode 和搜索位于同一工具区。
- 项目默认按日期分组，并可切换 Flat list。
- 卡片展示类型、标题、大小和时间，More 菜单包含 Rename、Download、Delete。
- Audio 点击播放且不打开详情弹窗。
- AI Photo Editor Project 和 Agent Session 点击后直接进入对应页面。
- 图片、视频和 Avatar 打开正确的详情弹窗。
- 多选、取消和批量操作不触发卡片详情。

---

## 22. 待确认问题

1. Create New 最终跳转 Agent、默认编辑器还是创建类型菜单？
2. Agent 工作区的正式路由与 Session 数据结构是什么？
3. Templates 使用后由 URL 参数、服务端草稿还是本地状态传递模板配置？
4. AI Avatar 在 Templates 中属于可直接使用的 Avatar，还是生成 Avatar 的模板？
5. Projects 是否统一收录所有工具任务，还是仅收录保存成功的结果？
6. Audio 是否参与批量选择和批量删除，还是只允许单文件操作？
7. My Upload 是否需要容量管理、文件夹和上传入口？
8. Time Range 使用创建时间还是最后更新时间作为筛选字段？
9. 国际化首发支持哪些语言，模板和运营内容是否按地区独立配置？
10. Blog、Price、Language 和用户头像菜单的最终跳转与权限规则是什么？

---

## 23. 评审结论模板

| 角色 | 结论 | 负责人 | 截止时间 |
|---|---|---|---|
| 产品 | 待评审 |  |  |
| 设计 | 待评审 |  |  |
| 前端 | 待评审 |  |  |
| 后端 | 待评审 |  |  |
| 算法/Agent | 待评审 |  |  |
| 测试 | 待评审 |  |  |
| 运营 | 待评审 |  |  |

