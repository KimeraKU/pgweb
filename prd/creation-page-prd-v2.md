# PhotoGrid Web Creation 页面产品需求文档

> 文档版本：V2.0  
> 创建日期：2026-07-20  
> 页面路由：`/creation`  
> 文档状态：功能评审稿  
> 产品形态：Agent-first 创作入口（过渡版本）与项目管理中心  
> 终端范围：桌面端优先，兼容平板与移动端

---

## 0. 文档说明

### 0.1 本版调整

本版按照业务需求文档常用的功能层级重新编写：

1. 需求背景。
2. 产品目标与范围。
3. 用户与核心场景。
4. 页面设计与具体功能。
5. 商业化。
6. 服务端与接口。
7. 状态与异常。
8. 数据与权限。
9. 后续迭代。
10. 埋点。
11. 非功能要求。
12. 验收标准。
13. 待确认问题。

其中“需求背景、页面设计、商业化、接口、后续迭代、埋点”与参考需求层级一致；产品目标、用户场景、数据模型、权限、异常、响应式、可访问性、性能、验收标准等为 Creation 页面上线所需的补充维度。

### 0.2 产品原则

- PhotoGrid Web 的长期方向是从“工具优先”逐步演进为“Agent 优先”的创作产品。
- Agent 将成为默认创作入口，负责理解需求、拆解任务、编排工作流并调用全部工具能力。
- 当前版本处于过渡阶段，采用 Agent 与 Tools/Templates 直接入口并存的双入口结构。
- Creation 是 Agent-first 演进过程中的创作入口、能力聚合和任务续接页面，不是新的全功能编辑器。
- 当前具体创作仍可在独立工具、编辑器或 Agent 工作区中完成；后续由 Agent 统一调度这些能力。
- Creation 内所有可见入口必须可用、可解释、可追踪。
- 页面保持浅色主题和高信息密度。
- Tools 和 Templates 在过渡阶段承担能力发现、专业直达和 Agent 失败兜底，后续逐步转为 Agent 可调用的能力库与预设库。

---

## 1. 需求背景

PhotoGrid Web 当前以独立工具为主要创作入口，已经拥有 AI Image、AI Video、AI Photo Editor、AI Filter、E-commerce Video、AI Avatar、Background Remover、Image Upscaler 等多项能力。该模式能够承载专业、明确的单工具任务，但随着工具和模板数量持续增加，也带来了入口分散、能力理解成本高、跨工具流程中断和历史结果难以统一管理的问题。

PhotoGrid Web 的后续产品方向，是逐步从“用户先选择工具”演进为“用户先表达目标”。Agent 将成为主要创作入口，用户无需提前理解具体工具，只需通过自然语言和素材描述需求；Agent 负责：

1. 理解用户意图和创作场景。
2. 判断任务所需的图片、视频、编辑、Avatar 或电商能力。
3. 追问缺失信息并整理任务参数。
4. 拆解单步或多步创作任务。
5. 调用 PhotoGrid 已有工具和模型能力。
6. 汇总过程状态、结果和可继续操作。
7. 将任务、会话和产出统一沉淀到 Projects。

当前 Agent 的能力覆盖、跨工具编排、稳定性和用户习惯尚处于建设阶段，因此本次 Creation 不是直接移除传统工具入口，而是一个 Agent-first 的过渡版本：

- Home 顶部将 Agent 作为最主要、最优先的创作入口。
- Tools 保留全部独立工具，承接明确需求、专业用户和 Agent 暂未覆盖的任务。
- Templates 保留模板与风格发现能力，并逐步转化为 Agent 可调用的预设和工作流入口。
- Projects/My Upload 统一承接 Agent 会话、独立工具任务、生成结果和源素材。
- What's New 与 Recommended Tools 帮助用户理解当前能力，并为 Agent 能力迁移提供运营引导。

本阶段需要同时保证两件事：一是让用户开始形成“先向 Agent 表达目标”的使用习惯；二是在 Agent 尚未完全覆盖所有任务时，保留可靠、清晰的工具直达路径，避免影响现有创作效率。

### 1.1 产品演进阶段

| 阶段 | 产品形态 | Agent 职责 | Tools/Templates 职责 |
|---|---|---|---|
| 阶段一：当前过渡期 | Agent 与直接入口并存 | 理解需求、推荐或启动部分工作流 | 主要承担能力发现、专业直达和兜底 |
| 阶段二：Agent 编排期 | Agent 成为主要入口 | 可调用大部分工具，完成跨工具任务和参数传递 | 转为能力库、模板库和高级用户入口 |
| 阶段三：Agent-first 稳定期 | 默认从 Agent 开始创作 | 统一理解、规划、调用、反馈和结果管理 | 作为可选专业模式、能力管理和人工修正入口 |

### 1.2 迁移原则

- 不一次性移除用户熟悉的工具入口。
- Agent 每覆盖一项能力，都需要具备明确的调用成功率、失败兜底和结果回流。
- 直接工具入口与 Agent 调用必须复用同一能力服务，避免两套结果和参数口径。
- Agent 无法理解、无权限或调用失败时，应推荐用户进入对应工具继续完成任务。
- Projects 使用统一任务模型承接 Agent 与独立工具结果，保证创作历史连续。
- 通过埋点持续观察 Agent 启动率、调用成功率和用户回退到 Tools 的原因，再决定入口权重调整。

---

## 2. 产品目标与范围

### 2.1 产品目标

1. 建立 Agent-first 的页面认知，让 Agent 成为最优先、最明显的创作入口。
2. 验证用户能否从“表达目标”开始，而不是必须先理解并选择工具。
3. 建立 Agent 调用 PhotoGrid 全部工具所需的统一能力注册、参数和任务协议。
4. 在过渡期保留稳定的 Tools/Templates 直接入口，避免 Agent 覆盖不足影响用户完成任务。
5. 用户进入页面后 10 秒内找到一个可执行的创作入口。
6. 提升 Agent 启动率、Agent 工具调用成功率和多步任务完成率。
7. 提升模板使用率、历史项目续作率和结果下载率。
8. 建立 Agent、工具、模板、任务和上传文件的统一数据口径。

### 2.2 本期范围

本期包含：

- 固定且可收起的左侧边栏。
- Home 聚合首页。
- Agent 统一输入入口。
- Agent 任务分类、子任务参数和 Session 创建入口。
- Agent 无法覆盖或调用失败时进入对应独立工具的兜底路径。
- What's New 运营展示。
- Recommended Tools 推荐工具。
- Home 模板推荐内容流。
- Tools 完整工具目录。
- Templates 跨功能模板库。
- Projects 历史任务与项目管理。
- My Upload 上传文件管理。
- 项目详情弹窗和 Avatar 专用详情弹窗。
- 登录校验、权限校验、核心埋点和基础状态。

### 2.3 非本期范围

- 在 Creation 内实现完整图片编辑器。
- 在 Creation 内实现完整视频时间线。
- 在 Creation 内承载长链路 Agent 对话。
- 在 Creation 内暴露完整模型高级参数。
- Agent 在本期完整调用并编排全部 PhotoGrid 工具。
- 立即取消或隐藏现有 Tools/Templates 直接入口。
- 社区作品、创作者主页和公开内容发布。
- 团队空间、品牌资产协作和审批流。

### 2.4 核心指标

| 指标 | 定义 | 建议目标 |
|---|---|---|
| 有效入口点击率 | 进入 Creation 后点击 Agent、工具、模板或项目的用户占比 | 上线后建立基线 |
| Agent 启动率 | 点击 Send 并成功创建 Agent Session 的用户占比 | 上线后建立基线 |
| Agent 新建任务占比 | 通过 Agent 创建的任务数 / Creation 新建任务总数 | 持续提升 |
| Agent 工具调用成功率 | Agent 发起工具调用后成功获得有效结果的调用占比 | 按工具建立基线并持续提升 |
| Agent 任务完成率 | Agent Session 最终产生有效结果的会话占比 | 上线后建立基线 |
| Agent 转工具率 | Agent 无法完成后进入独立工具继续操作的会话占比 | 区分主动专业操作与失败兜底 |
| 工具点击率 | 点击任一工具卡片的用户占比 | 上线后建立基线 |
| 模板使用率 | 浏览 Templates 后使用模板的用户占比 | 上线后建立基线 |
| 项目续作率 | 打开 Projects 后执行 Edit、Recreate 或进入原工作区的用户占比 | 上线后建立基线 |
| 首次有效操作耗时 | 页面加载完成到第一次有效操作的时间 | P50 ≤ 10 秒 |
| 页面跳失率 | 未发生有效操作即离开的用户占比 | 持续下降 |

---

## 3. 用户与核心场景

### 3.1 目标用户

| 用户 | 典型需求 |
|---|---|
| 电商卖家 | 商品图、详情页、UGC 广告、商品展示视频 |
| 内容创作者 | 短视频、社交图片、热门效果、Avatar 内容 |
| 图片编辑用户 | 增强、去背景、消除、修复、滤镜和拼图 |
| 营销运营人员 | 模板复用、批量素材、品牌内容和广告创意 |
| 回访用户 | 找到历史任务、会话和上传文件继续处理 |

### 3.2 核心场景

1. 默认创作：用户向 Agent 描述目标，Agent 理解需求并调用合适工具。
2. 跨工具创作：Agent 将任务拆解为图片生成、修图、视频生成等多个步骤并串联执行。
3. Agent 兜底：Agent 暂不支持或调用失败时，带着已有输入和参数进入对应工具。
4. 专业直达：明确知道工具的用户从 Tools 直接进入独立页面。
5. 模板开始：用户从 Templates 选择模板或风格，进入 Agent 或目标工具。
6. 继续上次任务：用户从 Projects 打开 Agent Session 或历史工具任务。
7. 查找源素材：用户从 My Upload 管理图片、视频和音频。

---

## 4. 页面设计与具体功能

### 4.1 页面总体框架

页面由左侧固定边栏和右侧内容区组成。

```text
┌──────────────────┬──────────────────────────────────────┐
│ Sidebar          │ Main Content                         │
│                  │                                      │
│ Logo / Collapse  │ Home / Tools / Templates / Projects  │
│ Create New       │                                      │
│ Home             │ 当前一级页面内容                     │
│ Tools            │                                      │
│ Templates        │                                      │
│ Projects         │                                      │
│                  │                                      │
│ Resources        │                                      │
│ User Profile     │                                      │
└──────────────────┴──────────────────────────────────────┘
```

#### 4.1.1 页面路由

- 默认路由：`/creation`。
- 国际化兼容路由：`/en/creation`。
- 页面刷新后应恢复当前一级页面；建议通过 URL query 或子路由持久化，如 `?tab=templates`。
- 浏览器前进/后退应同步一级页面状态。

#### 4.1.2 内容区规则

- 主内容背景为白色。
- Home 不重复展示 Home 标题。
- Tools 与 Templates 在左上角展示简洁页面标题。
- Projects 标题区域直接承担 Projects / My Upload 切换。
- 桌面端内容最大宽度建议 1280px，保持居中。

---

### 4.2 左侧边栏

#### 4.2.1 顶部品牌区

展开状态展示：

- PhotoGrid Logo。
- PhotoGrid 品牌名称。
- 收起按钮，位于品牌名称右侧。

收起状态展示：

- 默认展示 Logo。
- hover Logo 时切换为展开按钮。
- 点击后恢复展开状态。

对齐规则：

- Logo 中心线与下方 Create New、一级导航图标中心线一致。
- 展开状态 Logo 和品牌名称不可被收起按钮遮挡。

#### 4.2.2 Create New

- 位置：品牌区下方。
- 展开状态：青色主按钮，展示加号和 `Create New`。
- 收起状态：仅展示加号图标。
- hover：颜色加深，不改变按钮尺寸。
- 点击行为待确认，候选方案：
  1. 新建 Agent 会话。
  2. 打开创建类型菜单。
  3. 进入默认编辑器。
- 正式上线前不得保留无反馈空按钮。

#### 4.2.3 一级导航

从上到下：

1. Home。
2. Tools。
3. Templates。
4. Projects。

规则：

- 仅展示图标和标题，不展示描述文字。
- 激活项使用浅青色背景、青色图标和文字。
- 点击切换右侧内容区，不刷新整个页面。
- 点击当前激活项时保持原页面滚动位置或回到顶部，规则需统一。

#### 4.2.4 Resources

展示：

- Blog。
- Price。
- Language。

规则：

- Resources 位于主导航下方靠近底部位置。
- Language 点击后打开语言菜单。
- 切换语言后保留当前一级页面和筛选状态。
- Blog、Price 必须配置正式路由，不得使用 `#` 上线。

#### 4.2.5 用户信息

- 位于侧边栏底部。
- 展示用户头像和用户名。
- 不展示 UID。
- 未登录时展示登录入口。
- 点击后打开账户菜单，候选内容：Account、Subscription、Sign out。

#### 4.2.6 收起与展开

- 展开宽度约 248px。
- 收起宽度约 84px。
- 动画时长 200-300ms。
- 边栏固定铺满视口高度。
- 右侧内容边距随边栏宽度同步变化，不出现遮挡和跳动。

---

### 4.3 Home 页面

Home 从上到下包含：

1. Agent 统一入口。
2. What's New。
3. Recommended Tools。
4. 模板推荐内容流。

#### 4.3.1 Agent 统一入口

##### 4.3.1.1 默认内容

- 标题：`Create images, videos, posters, and brand assets with AI`。
- 多行需求输入区。
- 默认占位：`Describe what you want to create -- images, videos, posters, brand visuals, and more...`。
- 左下角按钮：
  - 添加图片或视频。
  - Auto 模式。
  - 资产选择。
  - Prompt/知识参考。
- 右下角按钮：Send。
- 输入区下方展示一级快速任务卡片。

##### 4.3.1.2 一级快速任务

| 一级分类 | 描述 | 子任务 |
|---|---|---|
| E-commerce Video | Product ad videos | Short Drama Ad、UGC Ad、TVC Ad、Product Showcase |
| AI Editor | Retouch and enhance | Auto Removal、Image Enhance、Background Removal |
| AI Filter | Styles and presets | Product Filter、Portrait Filter、Style Filter、Color Filter |

交互：

- 点击一级分类后，原卡片区切换为该分类的子任务。
- 仅展开分类，不自动选中第一个子任务。
- 子任务区展示当前分类标题和 Back。
- 点击 Back 返回一级分类，清空当前子任务和参数。

##### 4.3.1.3 子任务选中

- 点击子任务后，在输入框顶部显示选中任务胶囊。
- 胶囊包含任务图标、名称和关闭按钮。
- 同时展示该任务对应的参数输入项。
- 点击胶囊关闭按钮：
  - 清空当前子任务。
  - 清空该子任务参数。
  - 退出子任务列表。
  - 返回一级分类列表。
- 切换到其他一级分类时关闭当前子任务。

##### 4.3.1.4 UGC Ad 参数

UGC Ad 顶部参数采用单行紧凑表单：

| 参数 | 控件 | 默认值 | 选项示例 |
|---|---|---|---|
| Product Name | 输入框 | 空 | 最多 50 字符 |
| Spoken Language | 下拉 | English | English、Chinese、Spanish |
| Aspect Ratio / Platform | 下拉 | TikTok/Reels - 9:16 | TikTok/Reels、YouTube Shorts、Instagram Feed |
| Target Audience | 下拉 | Auto | Gen Z、Parents、Beauty shoppers、Tech buyers |
| Usage Scene | 下拉 | Auto | Product demo、Unboxing、Review、Problem solution |

不在单行参数区展示：

- Product Image。
- Avatar。
- Background。
- Spoken Content。

素材通过 Add 入口上传；补充内容通过主输入区描述。

##### 4.3.1.5 Send

点击 Send 后执行：

1. 校验是否输入文字、上传素材或选择任务。
2. 校验登录态。
3. 未登录时打开登录弹窗。
4. 登录成功后恢复输入、素材、任务和参数。
5. 创建 Agent Session。
6. 跳转独立 Agent 工作区。

按钮状态：

- 默认：Send。
- 不满足提交条件：禁用。
- 创建会话中：禁用，展示 loading 和 `Creating...`。
- 创建失败：恢复可点击并展示错误提示。

##### 4.3.1.6 登录触发时机

- 点击 Tools 中的 AI Agent 卡片。
- 点击 Home Agent 的 Send。
- 使用需要保存结果的模板或工具。

##### 4.3.1.7 Agent 工作区下游节点

Creation 仅负责启动，后续工作区包含：

1. 需求理解：输出 `scene_type` 与 `task_type`。
2. 图片/视频分析：识别主体、风格、色调、构图、文字和关键特征。
3. 信息追问：按电商、视频、修图或通用设计场景补齐信息。
4. 内容清单确认：多图、多视频和营销素材包生成前确认产出。
5. 生成前确认：Manual 模式下确认模型、参数和积分。
6. 图片生成、修图或视频生成。
7. 过程反馈：理解、重连、失败、进度和预估时间。
8. 结果写入 Projects。

#### 4.3.2 What's New

##### 4.3.2.1 内容

- 真实运营图片。
- 标题。
- 右上角标签。

不展示：

- 描述文字。
- 右上角功能图标。
- View All。

##### 4.3.2.2 排布

- 单行横向滚动。
- 桌面首屏露出 3-4 张卡片。
- 卡片宽度固定，不因标题长短改变。
- 标题最多两行，超出截断。

##### 4.3.2.3 点击

- 根据内容配置跳转工具、模板、活动或文章页面。
- 外链需明确新窗口策略。
- 运营内容支持地区、语言、上下线时间和排序。

#### 4.3.3 Recommended Tools

##### 4.3.3.1 排布

- 左侧两张重点大卡。
- 右侧紧凑工具网格。
- 大卡宽度小于右侧网格区域，避免挤压。
- 大卡图标位于标题左侧。
- 工具区不展示 View All 和 All Tools 文本按钮。
- 网格右下角提供 More 卡片。

##### 4.3.3.2 默认内容

重点大卡：

- AI Image。
- AI Video。

紧凑入口可包含：

- AI Photo Editor。
- AI Filter。
- Image Upscaler。
- Background Remover。
- E-commerce Video。
- AI Avatar。
- 其他运营推荐工具。

##### 4.3.3.3 点击

- 工具卡片进入对应独立页面。
- More 切换至 Tools。
- 不可用工具隐藏或禁用，不展示 Soon。

#### 4.3.4 Home 模板推荐

##### 4.3.4.1 层级

- 顶部一级场景 tab。
- 多个场景内容块纵向排列。
- 顶部 tab 点击后定位到对应内容块。
- 下方模板只保留一层分类，不继续嵌套多级 tab。

##### 4.3.4.2 卡片

- 横向流式排布。
- 默认只展示图片和标题。
- 每张卡片 hover 时显示 `Use same style`。
- 不展示卡片右上角视频图标。
- 卡片使用真实内容图。

---

### 4.4 Tools 页面

#### 4.4.1 搜索

- 页面顶部展示 Search Tools。
- 支持工具名称、别名和能力关键词。
- 输入时实时过滤。
- 清空后恢复完整列表。
- 无结果时展示空状态和 Clear Search。

#### 4.4.2 Recently Used

- 标题：Recently used。
- 默认展示最近使用的 3 个工具。
- 卡片只展示图标和标题，不展示描述。
- 未登录或无历史记录时展示默认推荐。
- 点击更新最近使用记录并进入工具。

#### 4.4.3 顶部任务类型

- Image。
- Video。
- Utility。

点击后定位或过滤对应工具分区。选中状态使用标题下划线，不使用大胶囊。

#### 4.4.4 Image Tools

- AI Image。
- Grid。
- AI Photo Editor。
- AI Filter。
- Image Upscaler。
- Background Remover。
- Object Remover。
- Photo Restoration。
- Watermark Remover。

规则：

- Grid 放在图片分类。
- AI Image 与 AI Filter 必须可见。
- `AI Editor` 统一命名为 `AI Photo Editor`。
- 不展示 Featured 和 Editing 分类。

#### 4.4.5 Video Tools

- AI Video。
- E-commerce Video。
- AI Avatar。

#### 4.4.6 Creative Utilities

- AI Agent。

#### 4.4.7 工具卡片

展示：

- 真实预览图。
- 工具图标。
- 工具标题。
- 一行或两行简短描述。

点击：

- 已登录且有权限：进入工具页。
- 未登录且工具要求登录：打开登录弹窗，成功后继续跳转。
- 无权限：打开权限或订阅提示。
- 工具未开放：由后台隐藏，不显示 Soon。

---

### 4.5 Templates 页面

#### 4.5.1 命名

- 一级导航使用 Templates。
- 不使用 Inspire。
- 原因：当前内容均可直接使用，用户预期是套用模板或风格。
- 后续社区案例、趋势和教程可单独建设 Inspire。

#### 4.5.2 一级类型

| 一级类型 | 内容 | 默认比例 |
|---|---|---|
| AI Video | 剧情、运动、幻想、节日、宠物等视频模板 | 多比例瀑布流，视频以竖版为主 |
| AI Image | 电商、热门风格、Yearbook、光效、人像和产品风格 | 方形与竖版混排 |
| E-commerce Video | UGC Review、Product Demo、Unboxing、Before & After、Lifestyle | 竖版为主 |
| AI Avatar | 商务、生活、时尚、运动、年龄感 Avatar | 3:4 与竖版混排 |
| Collage & Poster | 营销、社交、计划、创意、生活时刻和节日模板 | 按模板真实比例 |

#### 4.5.3 一级切换

- 以紧凑图标卡片展示五个类型。
- 默认选中 AI Video。
- 点击切换结果列表。
- 切换后清空二级筛选和搜索词。
- 页面滚动位置回到结果区顶部。

#### 4.5.4 二级筛选

- 默认 All。
- 只展示当前一级类型的分类。
- 支持横向滚动。
- 选中状态使用深色胶囊。

分类示例：

- AI Video：Trending、Romance、Sports、Fantasy、Celebration、Pets。
- AI Image：E-commerce、Hot、AI Yearbook、AI Light、Portrait、Product。
- E-commerce Video：UGC Review、Product Demo、Unboxing、Before & After、Lifestyle。
- AI Avatar：Lifestyle、Business、Fashion、Sports、Young Adult、Mature。
- Collage & Poster：Marketing、Social、Planner、Creative、Moments、Festivals。

#### 4.5.5 搜索

- 搜索范围仅限当前一级类型。
- 支持标题、分类、行业和场景关键词。
- 搜索和二级筛选同时生效。
- 展示结果数量。
- 无结果时展示 Clear Filters。

#### 4.5.6 模板列表

- 使用多列瀑布流。
- 图片按真实比例或预设比例展示，不强制等高。
- 桌面端根据内容区宽度展示 4-5 列。
- 平板 3 列。
- 移动端 2 列。
- 列间距和上下间距保持紧凑。

#### 4.5.7 模板卡片

默认状态：

- 只展示图片。
- 视频模板可在右上角展示时长。
- 不在图片下方展示标题或副标题。
- 不展示左上角类型标签。

hover 状态：

- 图片增加底部深色渐变遮罩。
- 标题显示在图片左上角。
- 视频时长保留在右上角。
- `Use template` 显示在图片底部。
- 标题超长时单行截断，不与时长重叠。

CTA 文案：

- AI Video、E-commerce Video、Collage & Poster：Use template。
- AI Image：Use style。
- AI Avatar：Use avatar。

点击后：

1. 校验模板可用状态。
2. 校验登录和权限。
3. 创建目标工具草稿或构造模板参数。
4. 跳转目标工具。
5. 目标工具加载模板 ID、版本和默认参数。

#### 4.5.8 大数据量加载

- 首屏建议加载 20-30 条。
- 后续使用游标分页或无限加载。
- 切换筛选时取消上一次请求。
- 图片使用缩略图、懒加载和占位色。
- 模板下线后不可继续新建，但历史项目仍可打开。

---

### 4.6 Projects 页面

#### 4.6.1 标题与一级切换

- 标题区域同时展示 Projects 和 My Upload。
- 两者使用标题样式作为 tab。
- 不额外重复 Projects 标题。
- 当前选中项为深色，未选中项为浅灰。

#### 4.6.2 Projects 工具区

同一行展示：

- 任务类型 tab。
- Tool 下拉。
- Time Range。
- View Mode。
- 搜索框。
- Select。

规则：

- 搜索框不得单独占据一整行。
- 桌面端所有控件尽量保持同一行。
- 窄屏按优先级折行：任务类型 > 搜索 > 筛选工具。

#### 4.6.3 任务类型

- All。
- Image。
- Video。
- Audio。
- Agent Sessions。
- Avatar。

点击后：

- 清空 Tool 筛选。
- 关闭 More 菜单。
- 退出多选状态。
- 刷新任务列表。

#### 4.6.4 Tool 下拉

通用选项：

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

- 默认文案为 All，不使用 All Tools。
- 只展示当前任务类型实际存在的 Tool。
- Agent Sessions 与 Avatar 不展示二级 Tool 下拉。
- Audio 仅展示 All、AI Voice 和其他实际音频来源。
- My Upload 不作为 Projects 的 Tool 选项。

#### 4.6.5 Time Range

- 默认 All time。
- 快捷项：Today。
- 支持月份切换和日期范围选择。
- 选中日期使用青色高亮。
- 点击外部关闭日历。
- Esc 关闭日历。
- 清空后恢复 All time。
- 筛选字段默认使用 `updated_at`，最终需产品确认。

#### 4.6.6 View Mode

Grouping：

- Group by date，默认。
- Flat list。

可选扩展：

- Card size：Small、Medium、Large。

规则：

- View Mode 选择保存在用户偏好。
- Group by date 时展示日期标题。
- Flat list 时不展示日期标题。

#### 4.6.7 搜索

- 支持项目标题、Prompt 和工具名称。
- 输入实时过滤或 300ms debounce 请求。
- 无结果时展示空状态。
- My Upload 本期不展示搜索框。

#### 4.6.8 Select 多选

进入多选：

- 点击 Select。
- 卡片左上角显示复选框。
- 卡片点击切换选中状态，不打开详情。
- 顶部展示已选数量。

操作：

- Download。
- Delete。
- Cancel。

规则：

- 批量 Delete 二次确认。
- 批量 Download 仅包含可下载结果。
- 退出多选后清空全部选择。
- 切换任务类型或一级页面时退出多选。

#### 4.6.9 项目卡片

统一结构：

- 方形预览区域。
- 左上角类型标签。
- hover 右上角 More。
- 预览区下方为可编辑标题。
- 标题下方展示文件大小和更新时间。

标签规则：

| 条件 | 标签 |
|---|---|
| `tool = AI Photo Editor` | Project |
| `task_type = image` | Image |
| `task_type = video` | Video |
| `task_type = audio` | Audio |
| `task_type = agent_session` | Agent Session |
| `task_type = avatar` | Avatar |

标题编辑：

- 点击标题进入编辑。
- Enter 保存。
- Esc 取消。
- 点击外部保存。
- 保存失败恢复原值并提示。
- 标题最长 100 字符。

#### 4.6.10 More 菜单

操作：

- Rename。
- Download。
- Delete。

打开：

- hover 卡片显示 More。
- 点击 More 打开菜单。
- 同一时间只允许一个菜单打开。

关闭：

- 点击菜单操作。
- 点击外部。
- Esc。
- 切换筛选或页面。

Delete：

- 必须二次确认。
- 成功后移除卡片。
- 失败时保留卡片并提示原因。

#### 4.6.11 Audio 卡片

- 不要求封面图。
- 预览区展示播放按钮和波形。
- 标题、文件大小和时间位于预览区下方。
- 普通点击播放或暂停，不打开详情弹窗。
- 同一时间只播放一个音频。
- 切换页面或关闭标签时停止播放。
- hover More 仍提供 Rename、Download、Delete。

#### 4.6.12 卡片点击行为

| 类型 | 点击行为 |
|---|---|
| Image | 打开通用详情弹窗 |
| Video | 打开通用详情弹窗并播放 |
| Audio | 卡片内播放 |
| Avatar | 打开 Avatar 专用详情弹窗 |
| AI Photo Editor Project | 进入 AI Photo Editor |
| Agent Session | 进入对应 Agent 会话 |

#### 4.6.13 通用详情弹窗

布局：

- 左侧：内容预览。
- 右侧：标题、参考素材、Prompt 和参数。

右侧信息：

- Prompt。
- 来源 Tool。
- Model。
- Aspect Ratio。
- Resolution。
- Duration，视频时展示。
- File Size。
- Created Time / Updated Time。

底部操作：

- Recreate。
- Edit，存在编辑能力时展示。
- Download。

关闭：

- 右上角关闭按钮。
- 点击遮罩。
- Esc。

#### 4.6.14 Avatar 详情弹窗

保持浅色主题，展示：

- Avatar 标题和重命名入口。
- Base Image。
- Face Views，正式数据支持时展示。
- Body Three Views：Front、Side、Back。
- Voice 名称、试听和 Switch Voice。

底部操作：

- Recreate。
- Create Similar Avatar。
- Generate Video。

Generate Video 点击后携带 Avatar ID 进入 E-commerce Video 或 UGC Video 生成器。

---

### 4.7 My Upload 页面

#### 4.7.1 定位

管理用户主动上传的源文件，与系统生成任务分离。

#### 4.7.2 类型

- All。
- Image。
- Video。
- Audio。

#### 4.7.3 工具区

- 不展示搜索框。
- 展示 Time Range。
- 展示 View Mode。
- 展示 Select。

#### 4.7.4 卡片

- 结构与 Projects 统一。
- 左上角标签为 Image、Video 或 Audio。
- 标题默认使用文件名，可重命名。
- 展示文件大小和上传时间。
- 图片和视频打开详情。
- 音频卡片内播放。
- More 提供 Rename、Download、Delete。

#### 4.7.5 上传入口

当前原型未明确上传入口，正式方案需二选一：

1. My Upload 顶部提供 Upload 按钮。
2. 全局 Create New 菜单提供 Upload。

上传要求：

- 图片：jpg、jpeg、png、webp。
- 视频：mp4、mov、webm，具体限制待技术确认。
- 音频：mp3、wav、m4a。
- 上传前校验格式、大小和时长。
- 上传中展示进度。
- 失败支持 Retry。

---

## 5. 商业化

### 5.1 基础原则

- Home、Tools 和 Templates 可允许游客浏览。
- 需要创建任务、保存结果或访问历史内容时要求登录。
- 工具和模板可根据会员等级、积分和地区配置权限。
- Creation 负责说明权限和承接购买，不重复实现各工具的计费逻辑。

### 5.2 登录拦截

触发：

- Agent Send。
- 使用模板。
- 点击要求登录的工具。
- 进入 Projects 或 My Upload。

规则：

- 登录成功后恢复原操作。
- 保留 Agent 输入、已选任务、参数、搜索和筛选。
- 登录取消后停留原页面，不清空内容。

### 5.3 积分

- Agent 实际创建生成任务前展示预计积分。
- 从模板进入工具后，在目标工具提交生成前展示积分。
- 积分不足时提供购买或升级入口。
- 不可在用户点击后直接扣费而不确认。

### 5.4 会员能力

可配置权益示例：

- 高级模型。
- 更高分辨率。
- 更长视频。
- 更快队列。
- 商用授权。
- 更多 Avatar 槽位。
- 批量下载和批量生成。

### 5.5 商业化展示

- Price 保留在 Resources。
- 是否在主内容顶部展示 Upgrade 由商业化实验决定。
- 运营活动可通过 What's New 配置。
- Pro/会员标签仅在用户决策需要时展示，不在所有卡片重复堆叠。

---

## 6. 服务端与接口

接口路径为建议命名，最终可遵循现有网关规范。

### 6.1 Creation 配置

#### 6.1.1 获取页面配置

`GET /api/creation/config`

返回：

- 一级导航配置。
- Resources 路由。
- What's New 内容。
- Recommended Tools。
- Home 模板推荐区。
- 实验参数和地区配置。

要求：

- 支持语言和地区参数。
- 支持缓存和配置版本。
- 单个运营模块失败不阻塞整个页面。

### 6.2 Tools

#### 6.2.1 获取工具列表

`GET /api/creation/tools`

参数：

- `category`。
- `query`。
- `locale`。
- `region`。

返回字段：

- Tool ID。
- 名称与描述。
- 分类。
- 图标与封面。
- 路由。
- 登录要求。
- 会员要求。
- 可用状态。
- 排序。

#### 6.2.2 最近使用

`GET /api/creation/tools/recent`

- 登录用户返回真实历史。
- 游客返回默认推荐。
- 最多返回 3-6 条。

### 6.3 Templates

#### 6.3.1 获取模板

`GET /api/creation/templates`

参数：

- `type`。
- `category`。
- `query`。
- `cursor`。
- `limit`。
- `locale`。
- `region`。

返回：

- 模板列表。
- 下一页 cursor。
- 总量或当前结果数量。
- 分类聚合信息。

#### 6.3.2 使用模板

建议流程：

1. 前端提交 Template ID 和来源页面。
2. 服务端校验模板状态、版本、地区和权限。
3. 返回目标 Tool 和模板 payload。
4. 前端进入目标工具。
5. 目标工具创建草稿或加载模板。

推荐接口：

`POST /api/creation/templates/{template_id}/use`

请求：

```json
{
  "source": "creation_templates",
  "locale": "en-US"
}
```

响应：

```json
{
  "targetTool": "ai-video",
  "targetRoute": "/ai-video",
  "templateVersion": "v3",
  "payload": {},
  "draftId": "optional"
}
```

### 6.4 Agent Session

#### 6.4.1 创建 Session

`POST /api/agent/sessions`

前端执行：

1. 校验登录。
2. 上传本地素材并换取可访问 URL。
3. 汇总输入、任务模板和参数。
4. 请求创建 Session。
5. 跳转 Agent 工作区。

请求示例：

```json
{
  "prompt": "Create a skincare UGC ad",
  "groupId": "ecommerce-video",
  "templateId": "ugc-ad",
  "parameters": {
    "productName": "Example Product",
    "spokenLanguage": "English",
    "aspectRatio": "9:16",
    "platform": "TikTok/Reels",
    "targetAudience": "Auto",
    "usageScene": "Auto"
  },
  "assets": [],
  "source": "creation_home"
}
```

响应：

```json
{
  "sessionId": "session_xxx",
  "route": "/agent/session_xxx"
}
```

#### 6.4.2 创建失败

- 登录失效：返回 401，前端重新登录并可重试。
- 无权限：返回 403，展示升级或权限说明。
- 参数错误：返回 400，并定位具体参数。
- 服务错误：返回可重试错误，不清空输入。

#### 6.4.3 Agent 能力注册

为支持 Agent 逐步调用全部 PhotoGrid 工具，需要建立统一能力注册表。每项能力至少包含：

- Capability ID。
- 对应 Tool ID。
- 能力名称与描述。
- 支持的 `scene_type` 与 `task_type`。
- 输入参数 JSON Schema。
- 必填素材类型。
- 输出类型。
- 登录、会员和积分要求。
- 超时和重试规则。
- 失败后的目标工具兜底路由。
- 能力版本和可用状态。

推荐接口：

`GET /api/agent/capabilities`

Agent 与 Tools 直接入口必须调用同一底层能力服务，避免参数、计费、结果和质量标准不一致。

#### 6.4.4 Agent 工具调用

`POST /api/agent/sessions/{session_id}/tool-calls`

请求示例：

```json
{
  "capabilityId": "background-remover",
  "capabilityVersion": "v2",
  "input": {
    "imageUrl": "https://example.com/input.jpg",
    "outputBackground": "transparent"
  },
  "sourceStepId": "step_xxx",
  "idempotencyKey": "session_step_xxx"
}
```

要求：

- 支持幂等，避免重连或重试造成重复扣费和重复任务。
- 返回统一 Task ID，并写入 Agent Session。
- Agent 工作区展示工具名称、执行状态、预估时间和结果。
- 调用成功后将结果提供给后续步骤，并同步写入 Projects。
- 调用失败时返回结构化错误、是否可重试和兜底路由。
- 用户进入兜底工具时，自动带入 Agent 已收集的素材、Prompt 和可兼容参数。

### 6.5 Projects

#### 6.5.1 获取项目

`GET /api/projects`

参数：

- `task_type`。
- `tool_id`。
- `query`。
- `start_time`。
- `end_time`。
- `grouping`。
- `cursor`。
- `limit`。

#### 6.5.2 更新标题

`PATCH /api/projects/{project_id}`

```json
{
  "title": "New title"
}
```

#### 6.5.3 删除

`DELETE /api/projects/{project_id}`

- 建议使用软删除并保留短期恢复能力。
- 删除项目是否同步删除文件需后端明确。

#### 6.5.4 批量操作

`POST /api/projects/batch`

```json
{
  "action": "delete",
  "projectIds": ["p1", "p2"]
}
```

#### 6.5.5 Recreate

`POST /api/projects/{project_id}/recreate`

- 返回目标工具、原参数和新草稿 ID。
- 原项目不可用时返回明确原因。

### 6.6 My Upload

#### 6.6.1 获取上传文件

`GET /api/uploads`

参数：

- `media_type`。
- `start_time`。
- `end_time`。
- `grouping`。
- `cursor`。

#### 6.6.2 上传

建议沿用统一上传服务：

1. 请求上传凭证。
2. 前端直传对象存储。
3. 回调创建 Upload 记录。
4. 异步生成视频封面、音频时长和波形信息。

#### 6.6.3 删除

`DELETE /api/uploads/{upload_id}`

- 如果文件被项目引用，必须提示影响范围或仅移除用户库引用。

---

## 7. 状态与异常

### 7.1 通用状态

所有异步模块必须覆盖：

- Loading。
- Empty。
- Error。
- Retry。
- Offline。
- Permission denied。
- Rate limited。

#### 7.1.1 Loading

- 使用骨架屏保持布局稳定。
- 不在已加载内容上覆盖整页 loading。
- 分页加载仅在列表底部展示。

#### 7.1.2 Empty

示例：

- Projects 为空：提示从 Agent、Tools 或 Templates 开始创作。
- My Upload 为空：提示上传文件。
- 搜索无结果：展示清空搜索。
- 模板筛选无结果：展示 Clear Filters。

#### 7.1.3 Error

- 展示用户可理解的错误说明。
- 提供 Retry。
- 不因单个模块失败导致整个 Creation 白屏。

### 7.2 Agent 状态

| 状态 | 中文 | 英文 |
|---|---|---|
| thinking | 思考中 | Understanding Your Request... |
| reconnecting | 重连中 | Reconnecting... |
| reconnectFailed | 重连失败 | Connection Failed |
| creating | 创建任务中 | Creating... |
| generating | 生成中 | Generating... |
| failed | 生成失败 | Generation Failed |

### 7.3 Project 状态

| 状态 | 卡片表现 | 可用操作 |
|---|---|---|
| processing | 进度、预估时间、不可下载 | 查看、取消（如支持） |
| success | 正常预览 | 查看、编辑、重建、下载 |
| failed | 失败标签和原因 | Retry、Delete |
| draft | Draft 标签 | Continue、Rename、Delete |
| deleted | 默认不展示 | 恢复能力由后端决定 |

### 7.4 图片与视频加载失败

- 使用媒体占位图。
- 保留标题和操作。
- 提供重新加载。
- 不使用破损图片图标直接暴露。

---

## 8. 数据、权限与安全

### 8.1 Tool 数据

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `id` | string | 是 | 工具 ID |
| `name` | localized string | 是 | 名称 |
| `description` | localized string | 是 | 描述 |
| `category` | enum | 是 | image、video、utility |
| `route` | string | 是 | 目标路由 |
| `cover_url` | string | 是 | 预览图 |
| `icon_url` | string | 是 | 图标 |
| `auth_required` | boolean | 是 | 登录要求 |
| `entitlement` | string? | 否 | 会员要求 |
| `availability` | enum | 是 | active、disabled、hidden |
| `sort_order` | number | 是 | 排序 |

### 8.2 Template 数据

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `id` | string | 是 | 模板 ID |
| `title` | localized string | 是 | 标题 |
| `template_type` | enum | 是 | ai_video、ai_image、ecommerce_video、avatar、design |
| `category` | string | 是 | 二级分类 |
| `cover_url` | string | 是 | 封面 |
| `preview_url` | string? | 否 | 动态预览 |
| `aspect_ratio` | string | 是 | 比例 |
| `duration` | number? | 否 | 视频时长 |
| `target_tool` | string | 是 | 目标工具 |
| `payload` | object | 是 | 默认参数 |
| `version` | string | 是 | 配置版本 |
| `availability` | enum | 是 | active、disabled、hidden |

### 8.3 Project 数据

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `id` | string | 是 | 项目 ID |
| `title` | string | 是 | 标题 |
| `task_type` | enum | 是 | image、video、audio、agent_session、avatar、project |
| `tool_id` | string | 是 | 来源工具 |
| `status` | enum | 是 | processing、success、failed、draft |
| `cover_url` | string? | 否 | 封面，音频可为空 |
| `output_url` | string? | 否 | 结果文件 |
| `file_size` | number? | 否 | 文件大小 |
| `prompt` | string? | 否 | Prompt |
| `parameters` | object | 否 | 模型和参数 |
| `created_at` | datetime | 是 | 创建时间 |
| `updated_at` | datetime | 是 | 更新时间 |

### 8.4 Upload 数据

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `id` | string | 是 | 上传记录 ID |
| `name` | string | 是 | 文件名 |
| `media_type` | enum | 是 | image、video、audio |
| `url` | string | 是 | 文件 URL |
| `cover_url` | string? | 否 | 视频封面，音频可为空 |
| `file_size` | number | 是 | 文件大小 |
| `duration` | number? | 否 | 音视频时长 |
| `created_at` | datetime | 是 | 上传时间 |

### 8.5 权限

- 用户只能访问自己的 Projects 和 My Upload。
- 公开模板和公开 Avatar 可被所有用户浏览。
- 私有 Avatar 不得通过 URL 被其他用户访问。
- 下载 URL 使用短时签名。
- 删除、重命名和批量操作必须校验资源归属。
- 前端隐藏不等于权限控制，后端必须再次校验。

### 8.6 安全

- 上传文件进行 MIME、扩展名和文件头校验。
- 对图片、视频和音频执行安全扫描。
- Prompt 和标题输出时防止 XSS。
- 外部运营链接采用白名单。
- 删除与付费操作记录审计日志。

---

## 9. P1/P2 后续迭代

### 9.1 P1

- What's New 运营后台。
- 建立 Agent 能力注册表和统一参数 Schema。
- Agent 可调用 AI Image、AI Video、AI Photo Editor、Background Remover 等主要工具。
- 支持 Agent 单工具调用的进度、失败重试和结果回流。
- 支持 Agent 调用失败后带参数进入独立工具。
- Tools 最近使用个性化。
- Templates 动态预览、分页和收藏。
- Time Range 完整日期范围。
- View Mode 偏好持久化。
- Projects 批量下载与删除。
- Avatar 语音切换和 Generate Video 参数传递。
- 项目失败重试和生成进度。
- 上传入口与容量展示。

### 9.2 P2

- Agent 成为默认新建创作入口，直接工具入口降低为次级入口。
- Agent 支持多步骤规划、跨工具参数传递和结果串联。
- Agent 可调用全部已开放 PhotoGrid 工具和模板能力。
- Agent 根据用户历史、品牌资产和项目上下文进行个性化编排。
- Tools 转为能力库、专业模式和人工修正入口。
- Templates 转为 Agent 可调用的预设、工作流和风格库。
- Inspire：社区作品、趋势、案例和教程。
- 个性化工具与模板排序。
- 收藏夹和跨工具素材集合。
- Brand Kit。
- 团队空间与协作。
- 项目文件夹和标签。
- 全局命令面板。
- Creation 多工作区切换。

---

## 10. 埋点

### 10.1 页面与导航

| 事件 | 触发 | 参数 |
|---|---|---|
| `creation_page_view` | 页面加载成功 | source、login_status、locale、region |
| `creation_nav_click` | 点击一级导航 | nav_id、from_nav、sidebar_state |
| `creation_sidebar_toggle` | 收起或展开 | target_state |
| `creation_create_new_click` | 点击 Create New | login_status |
| `creation_resource_click` | 点击 Resources | resource_id |

### 10.2 Agent

| 事件 | 触发 | 参数 |
|---|---|---|
| `creation_agent_group_click` | 点击一级任务 | group_id |
| `creation_agent_template_click` | 点击子任务 | group_id、template_id |
| `creation_agent_template_clear` | 关闭选中胶囊 | template_id |
| `creation_agent_add_media` | 点击添加素材 | media_type |
| `creation_agent_send_click` | 点击 Send | template_id、has_prompt、asset_count、login_status |
| `creation_agent_session_success` | Session 创建成功 | session_id、template_id、latency |
| `creation_agent_session_failed` | 创建失败 | error_code、template_id |
| `creation_agent_tool_call` | Agent 发起工具调用 | session_id、capability_id、tool_id、step_id |
| `creation_agent_tool_call_success` | 工具调用成功 | session_id、capability_id、latency、credit_cost |
| `creation_agent_tool_call_failed` | 工具调用失败 | session_id、capability_id、error_code、retryable |
| `creation_agent_tool_fallback` | 从 Agent 进入独立工具 | session_id、tool_id、reason、has_prefilled_context |
| `creation_login_modal_view` | Agent 触发登录 | trigger |

### 10.3 Home 内容

| 事件 | 触发 | 参数 |
|---|---|---|
| `creation_promo_impression` | What's New 曝光 | content_id、position |
| `creation_promo_click` | 点击运营卡片 | content_id、position、target_type |
| `creation_recommended_tool_click` | 点击推荐工具 | tool_id、card_type、position |
| `creation_home_template_click` | 使用 Home 模板 | template_id、section_id、position |

### 10.4 Tools

| 事件 | 触发 | 参数 |
|---|---|---|
| `creation_tool_search` | 提交或停止输入 | query_length、result_count |
| `creation_tool_category_click` | 点击类型 | category |
| `creation_tool_click` | 点击工具 | tool_id、section、position、is_recent |
| `creation_tool_blocked` | 登录或权限阻断 | tool_id、reason |

### 10.5 Templates

| 事件 | 触发 | 参数 |
|---|---|---|
| `creation_template_type_click` | 切换一级类型 | template_type |
| `creation_template_category_click` | 切换二级分类 | template_type、category |
| `creation_template_search` | 搜索 | template_type、query_length、result_count |
| `creation_template_impression` | 卡片曝光 | template_id、position、type、category |
| `creation_template_hover` | hover 达到阈值 | template_id、duration_ms |
| `creation_template_use_click` | 点击使用 | template_id、target_tool、position |
| `creation_template_use_success` | 成功进入工具 | template_id、draft_id |

### 10.6 Projects 与 Upload

| 事件 | 触发 | 参数 |
|---|---|---|
| `creation_project_library_switch` | Projects/My Upload 切换 | target_library |
| `creation_project_filter` | 修改筛选 | task_type、tool_id、time_range、view_mode |
| `creation_project_search` | 搜索 | query_length、result_count |
| `creation_project_open` | 打开项目 | project_id、task_type、tool_id |
| `creation_project_action` | Rename/Download/Delete/Edit/Recreate | project_id、action |
| `creation_project_select` | 进入多选或选择卡片 | selected_count |
| `creation_project_batch_action` | 批量操作 | action、selected_count、success_count |
| `creation_audio_play` | 音频播放 | asset_id、source_library |
| `creation_avatar_generate_video` | Avatar 生成视频 | avatar_id |
| `creation_upload_action` | 上传、下载、删除 | upload_id、action、media_type |

### 10.7 商业化

| 事件 | 触发 | 参数 |
|---|---|---|
| `creation_paywall_view` | 展示会员或积分弹窗 | trigger、tool_id、template_id |
| `creation_paywall_purchase_click` | 点击购买 | plan_id、trigger |
| `creation_purchase_success` | 支付成功回调 | plan_id、order_id、trigger |

---

## 11. 非功能要求

### 11.1 性能

- 页面核心框架首屏 LCP 目标 ≤ 2.5s，具体以线上环境基线为准。
- Tools、Templates、Projects 分模块懒加载。
- 图片使用响应式缩略图和懒加载。
- 切换 tab 不重复请求未过期数据。
- 搜索使用 debounce 和请求取消。
- 长列表使用分页、无限加载或虚拟化。
- 单个模块失败不影响侧边栏和其他模块。

### 11.2 响应式

| 宽度 | 要求 |
|---|---|
| ≥ 1280px | 展开侧边栏，列表最多 5 列 |
| 768-1279px | 侧边栏可收起，列表 3-4 列 |
| < 768px | 侧边栏使用抽屉或移动导航，列表 2 列 |

规则：

- 不出现页面级横向滚动。
- tab 和筛选可在自身容器横向滚动。
- 文字、标签、按钮和卡片不得重叠。
- 固定侧边栏不得遮挡内容。

### 11.3 可访问性

- 图标按钮提供 `aria-label` 和 tooltip。
- tab 提供正确选中状态。
- 弹窗支持焦点锁定、Esc 和焦点恢复。
- 可交互卡片支持键盘 Enter/Space。
- 对比度满足 WCAG AA。
- 状态不能只靠颜色表达。
- 动画尊重 `prefers-reduced-motion`。

### 11.4 国际化

- 所有展示文案由 i18n 管理，不在组件中散落硬编码。
- 中文环境展示中文，非中文默认英文。
- 工具、模板和运营内容支持本地化字段。
- 切换语言保留页面状态。
- 长英文、德语等场景不得破坏卡片与按钮布局。

### 11.5 兼容性

- 支持当前和前两个主要版本的 Chrome、Safari、Edge。
- 触屏设备不依赖 hover 才能完成核心操作；模板卡片点击应可直接进入或首次点击展示操作。

---

## 12. 优先级与里程碑

### 12.1 P0

- 页面框架和侧边栏。
- Home 将 Agent 作为首屏最主要创作入口。
- Agent 入口、任务分类、Session 创建和登录恢复。
- Agent 与 Tools/Templates 双入口并存，直接工具路径保持完整可用。
- 建立 Agent、Tool、Template、Project 的统一 ID 和来源字段。
- What's New 和 Recommended Tools。
- Tools 搜索、分类和真实路由。
- Templates 五类、筛选、搜索、瀑布流和模板跳转。
- Projects/My Upload 基础列表、筛选和日期分组。
- 项目详情、Avatar 详情和 Audio 播放。
- Rename、Download、Delete 基础操作。
- 通用 Loading、Empty、Error。
- 核心接口和埋点。

### 12.2 P1

- Agent 能力注册表。
- Agent 调用主要 PhotoGrid 工具。
- Agent 工具调用进度、错误重试和 Projects 回流。
- Agent 失败后带上下文进入独立工具。
- 完整 Time Range 和 View Mode。
- 多选和批量操作。
- 最近工具个性化。
- 模板动态预览、收藏和无限加载。
- 运营后台。
- Avatar 语音和视频链路。
- 上传入口和容量管理。

### 12.3 P2

- Agent-first 默认创作流程。
- Agent 全工具调用和多步骤工作流编排。
- Tools/Templates 转为 Agent 能力库和专业直达入口。
- Inspire。
- Brand Kit。
- 团队协作。
- 个性化推荐。
- 文件夹和标签。

---

## 13. 验收标准

### 13.1 页面框架

- `/creation` 可访问，国际化路由行为明确。
- 侧边栏固定铺满视口，展开与收起不遮挡内容。
- Logo、Create New 和一级导航图标中轴对齐。
- 页面保持浅色主题。
- 用户区不展示 UID。

### 13.2 Home

- Agent 在首屏的视觉层级和操作优先级高于 Tools、Templates 与运营内容。
- Agent 一级分类、子任务、Back 和关闭胶囊交互正确。
- UGC Ad 只展示 Product Name、Language、Aspect/Platform、Target Audience、Usage Scene。
- Agent Send 登录后恢复上下文。
- Agent 无法覆盖或调用失败时，可携带已有上下文进入对应工具。
- What's New 只展示图片、标题和右上角标签。
- Recommended Tools 的 More 进入 Tools。
- Home 每张模板 hover 都展示 Use same style。

### 13.3 Tools

- AI Image、AI Filter 和 Grid 位于 Image Tools。
- Recently Used 不展示描述。
- 不展示 Featured、Editing 和 Soon。
- 搜索、分类和点击路由正确。
- 空路由工具不会作为正常可用入口上线。

### 13.4 Templates

- 五个一级类型可切换，并重置二级筛选和搜索。
- 搜索仅作用于当前类型。
- 模板列表为响应式瀑布流。
- 默认只显示图片，视频可显示时长。
- hover 时左上显示标题，底部显示 CTA。
- 卡片图片下方无标题和副标题。
- 长标题不与右上时长重叠。
- 模板点击携带 ID 和版本进入正确工具。

### 13.5 Projects

- Projects 与 My Upload 使用标题式切换。
- 任务类型和工具区保持同一布局区域。
- 默认按日期分组，可切换 Flat list。
- 卡片展示标签、标题、大小和时间。
- More 包含 Rename、Download、Delete。
- Audio 点击播放，不打开详情。
- AI Photo Editor Project 和 Agent Session 直接进入对应页面。
- Image、Video、Avatar 打开正确详情。
- 多选时卡片点击不打开详情。

### 13.6 My Upload

- 不展示搜索框。
- 仅展示 All、Image、Video、Audio。
- 卡片与 Projects 结构一致。
- Audio 无封面时正常展示波形卡片。

### 13.7 状态、权限与埋点

- Loading、Empty、Error 和 Retry 均可验证。
- 未登录和无权限场景有明确拦截与恢复。
- 删除操作有二次确认。
- 核心点击和成功/失败事件均能上报。

---

## 14. 原型与正式能力差异

| 模块 | 当前原型 | 正式上线要求 |
|---|---|---|
| 页面状态 | React 本地 state | URL 或路由持久化 |
| 工具数据 | 本地静态数据 | 配置服务 |
| 模板数据 | 本地静态数据 | 模板服务与分页 |
| 图片资源 | 本地示例图 | CDN 真实素材与缩略图 |
| Agent Send | 原型按钮 | 登录、素材上传、Session 接口和跳转 |
| 工具路由 | 部分 `#` | 正式路由或隐藏 |
| Recently Used | 固定示例 | 用户历史服务 |
| Projects | 本地示例 | 统一项目服务 |
| Rename/Download/Delete | 视觉交互 | 真实接口和错误恢复 |
| Time Range/View Mode | 部分原型 | 真实筛选与偏好持久化 |
| Audio | 波形原型 | 音频 URL、真实播放和互斥状态 |
| 登录和积分 | 未完整接入 | 账户、权限和商业化服务 |

---

## 15. 待确认问题

1. Create New 的最终行为是什么？
2. 一级页面状态使用 query 还是子路由？
3. Agent 工作区正式路由和 Session 数据结构是什么？
4. Agent 是否在 Creation 提交前展示积分，还是进入工作区后展示？
5. Templates 使用后通过 URL、草稿接口还是服务端 Session 传参？
6. AI Avatar 在 Templates 中是现成 Avatar 还是 Avatar 生成模板？
7. Projects 是否收录所有任务，还是仅收录成功结果和草稿？
8. Audio 是否参与批量选择和批量删除？
9. My Upload 的上传入口位于页面还是 Create New？
10. 删除 Upload 时如何处理被项目引用的文件？
11. Time Range 使用创建时间还是更新时间？
12. View Mode 是否需要卡片大小设置？
13. Blog、Price、Language 和账户菜单的正式路由是什么？
14. 国际化首发语言和地区范围是什么？
15. 工具和模板的会员权益由统一权限服务还是各工具分别维护？

---

## 16. 评审记录

| 角色 | 结论 | 负责人 | 时间 | 备注 |
|---|---|---|---|---|
| 产品 | 待评审 |  |  |  |
| 设计 | 待评审 |  |  |  |
| 前端 | 待评审 |  |  |  |
| 后端 | 待评审 |  |  |  |
| Agent/算法 | 待评审 |  |  |  |
| 测试 | 待评审 |  |  |  |
| 运营 | 待评审 |  |  |  |
