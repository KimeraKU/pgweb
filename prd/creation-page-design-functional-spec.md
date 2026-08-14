# 3. 页面设计与具体功能

> 文档名称：PhotoGrid Web Creation 页面设计与具体功能说明  
> 文档版本：V1.2
> 更新日期：2026-07-24
> 页面路由：`/creation`  
> 产品阶段：Agent-first 过渡版本  
> 说明：本文档仅描述页面结构、控件、文案、状态和交互；商业化策略、接口、埋点和数据结构在 Creation 主 PRD 中维护。

---

## 3.1 页面整体框架

### 3.1.1 页面定位

Creation 是 PhotoGrid Web 的统一创作入口与任务管理页面。

当前处于 Agent-first 过渡阶段：

- Agent 是 Home 首屏最主要的创作入口。
- Tools 保留独立工具直达能力，承接专业用户和 Agent 尚未覆盖的任务。
- Templates 提供模板、风格和 Avatar 预设发现能力。
- Projects/My Upload 统一管理 Agent 会话、工具任务、结果和源素材。

Creation 不在当前页面内实现完整图片编辑器、视频时间线或长链路 Agent 对话。

### 3.1.2 页面布局

页面采用“左侧固定导航 + 右侧内容区”结构。

| 区域 | 展开尺寸 | 收起尺寸 | 规则 |
|---|---:|---:|---|
| 左侧边栏 | 248px | 84px | 桌面端固定铺满视口高度 |
| 右侧内容区 | 自适应 | 自适应 | 随边栏宽度同步调整左边距 |
| 内容最大宽度 | 1280px | 1280px | 居中展示，保留页面内边距 |

视觉要求：

- 页面保持浅色主题。
- 主内容背景为白色。
- 左侧边栏使用白色背景和浅灰分隔线。
- 不使用深色整页背景。
- 不使用大面积装饰渐变、光球或无业务意义的装饰元素。
- 固定边栏不得遮挡右侧内容。
- 右上角积分与账户区位于 1280px 内容边界内，不占用左侧边栏空间。
- 页面级不得出现横向滚动条。

> **[截图占位 S01：Creation 页面整体布局]**  
> 截图范围：完整桌面页面，包含展开侧边栏、右上角账户区和 Home 首屏。
> 建议标注：侧边栏宽度、内容最大宽度、Agent 首屏位置、右上角账户区和页面左右边界。

### 3.1.3 一级页面

Creation 包含四个一级页面：

1. Home。
2. Tools。
3. Templates。
4. Projects。

切换规则：

- 点击左侧一级导航后，仅切换右侧内容，不刷新整个站点。
- 切换一级页面后默认滚动到该页面顶部。
- 页面刷新后应恢复当前一级页面；正式版建议使用 query 或子路由持久化。
- 浏览器前进/后退应同步一级页面状态。
- 切换一级页面时关闭当前打开的菜单、日历、筛选浮层和非必要弹窗。
- Agent 未提交的输入仅在 Home 内保留；离开 Home 后是否保留由产品确认，建议当前会话内保留。

### 3.1.4 页面标题规则

| 页面 | 标题规则 |
|---|---|
| Home | 不重复展示 `Home` 页面标题；Agent 主标题独占内容行并居中，账户区独立定位在右上角 |
| Tools | 内容区左上角展示 `Tools` |
| Templates | 内容区左上角展示 `Templates` |
| Projects | 使用 `Projects / My Upload` 标题式切换，不再重复展示页面标题 |

标题规范：

- 一级页面标题字号建议 15-18px。
- 使用半粗体，不使用营销型超大标题。
- 标题保持单行，最长建议 32 个英文字符或 16 个中文字符。
- 国际化文案超长时优先扩展容器，不缩放字号。

---

## 3.2 左侧边栏

### 3.2.1 顶部品牌区

展开状态展示：

- PhotoGrid Logo，建议尺寸 28×28px。
- 品牌名称 `PhotoGrid`。
- 收起按钮，位于品牌名称右侧。

收起状态展示：

- 默认展示 Logo。
- hover Logo 区域时，Logo 切换为展开箭头。
- 点击展开箭头恢复展开状态。

对齐规则：

- Logo、Create New 图标、一级导航图标保持同一纵向中轴。
- 品牌名称与 Logo 垂直居中。
- 收起按钮不得遮挡品牌名称。
- 展开和收起时 Logo 不发生明显跳动。

> **[截图占位 S02：侧边栏展开状态]**  
> 截图范围：完整展开侧边栏。  
> 建议标注：Logo 中轴、收起按钮、Create New、一级导航和资源入口。

> **[截图占位 S03：侧边栏收起状态]**  
> 截图范围：完整收起侧边栏。  
> 建议标注：Logo hover 展开入口、导航图标和资源入口图标。

### 3.2.2 Create New

位置：品牌区下方、一级导航上方。

展开状态：

- 青色主按钮。
- 左侧加号图标。
- 文案：`Create New`。
- 高度 44px。
- 宽度铺满侧边栏内容区。

收起状态：

- 显示 44×44px 圆形或圆角按钮。
- 仅展示加号图标。
- hover tooltip：`Create New`。

交互状态：

| 状态 | 表现 |
|---|---|
| Default | 青色背景、白色图标与文字 |
| Hover | 背景加深，不改变尺寸 |
| Active | 可使用轻微按压反馈 |
| Disabled | 本期不应出现无反馈禁用状态 |

点击后打开 `All Tools` 非模态工具菜单：

- 视觉沿用页面浅色体系：白色面板、浅灰描边与分组底色、青色 hover 和键盘焦点态。
- 桌面端在 Create New 按钮右侧展开，最大宽度 720px；窄屏在按钮下方展开并适配可用宽度。
- 面板设置可视区域最大高度并允许内部纵向滚动，避免超出视口。
- 标题区左侧展示 `All Tools`，右侧 `View all` 关闭菜单并进入 Tools 页面。
- 内容按 Tools 页相同的 `Image Tools`、`Video Tools`、`Creative Utilities` 三组排列；每组展示分类图标、分类标题和工具列表。
- 工具项展示图标和名称；已配置真实路由的工具直接跳转，尚无独立路由的工具关闭菜单并进入 Tools 页面。
- 打开菜单后焦点进入第一个工具；点击外部关闭；按 `Esc` 关闭并将焦点返回 Create New 按钮。
- 触发按钮必须通过 `aria-expanded` 暴露展开状态，弹层使用带标题关联的非模态 `dialog` 语义。
- 菜单与 Tools 页面共用同一份工具目录数据，禁止出现名称、分组、图标或路由不一致。

### 3.2.3 一级导航

从上到下：

1. Home。
2. Tools。
3. Templates。
4. Projects。

单个导航项：

- 左侧图标。
- 标题。
- 展开状态右侧箭头。

状态：

| 状态 | 表现 |
|---|---|
| Default | 深灰文字与图标，白色背景 |
| Hover | 浅灰背景，图标与文字变为青色 |
| Active | 浅青背景，青色图标与文字 |
| Collapsed | 图标居中，短标题可在图标下方展示 |

标题限制：

- 建议不超过 12 个英文字符或 6 个中文字符。
- 超出时单行截断并提供 tooltip。

### 3.2.4 资源入口

保留以下入口：

- Price 促销卡片。
- Blog。
- Language。

规则：

- Blog 点击进入对应页面；Price 促销卡片点击进入套餐与订阅页面。
- Price 展开状态使用约 56px 高的简洁紫色渐变卡片，按“优惠图标、`Price 50% OFF`、最右侧右箭头”单行排列；整张卡片作为套餐入口，不额外展示 CTA 文案、会员层级或补充利益点，也不使用装饰光斑或独立胶囊按钮。
- 桌面端收起侧边栏后，Price 卡片压缩为居中的优惠图标按钮，并通过 tooltip 和无障碍名称保留完整语义；窄屏保持完整卡片。
- Language 右侧展示箭头，点击打开语言菜单。
- 收起状态仅展示图标，并通过 tooltip 说明名称。
- 切换语言后保留当前一级页面和页面状态。
- 正式上线不得保留 `#` 空链接。

### 3.2.5 侧边栏职责边界

侧边栏底部仅保留 Price 促销卡片、Blog 和 Language 资源入口，顺序固定为 `Price → Blog → Language`。

- Price 是侧边栏内唯一允许出现的升级促销卡片，不得再重复展示其他升级横幅、积分余额、用户头像或用户名。
- 展开与收起侧边栏不影响右上角账户区的位置和状态。
- Price 促销卡片继续作为套餐与订阅的页面级入口。

### 3.2.6 右上角积分与账户入口

位置：右侧内容区顶部，右边缘与 1280px 内容容器对齐。

结构从左到右：

1. 积分胶囊。
2. 独立用户头像。

积分胶囊：

- 高度 40px。
- 左侧使用橙色积分图标。
- 中间显示完整千分位余额，例如 `6,234`。
- 不展示右侧青色圆形加号，积分胶囊仅保留积分图标和余额。
- 白色背景、浅灰描边和轻量阴影。

头像：

- 尺寸 40×40px。
- 使用圆形裁切，人物主体保持近景可辨识。
- 与积分胶囊保持约 10px 间距，不放入胶囊内部。

布局规则：

- Home 中账户区不参与 Agent 标题的宽度计算；Agent 标题保持独立居中。
- 超宽桌面可将账户区独立定位在 Home 内容右上角。
- 空间不足时，账户区单独占据标题上方一行并右对齐，禁止与标题重叠。
- Tools、Templates 和 Projects 中账户区与页面级标题/切换区共享顶部水平区域，但保持右对齐。

余额规则：

- 0-999：显示完整数值。
- 1,000-999,999：使用千分位，例如 `6,234`。
- ≥1,000,000：允许缩写为 `1.2m`，并通过可访问名称提供完整余额。
- 余额读取失败时展示 `--`，不可误显示为 0。
- 数值变化使用静态更新，不使用影响阅读的跳动动画。

> **[截图占位 S04：右上角积分与账户区]**
> 截图范围：积分胶囊、独立头像、积分 hover 卡和头像账户菜单。
> 建议标注：40px 控件高度、弹层对齐方式、菜单内容和互斥规则。

### 3.2.7 积分余额卡

触发：

- 鼠标进入积分胶囊或键盘焦点进入积分区域时打开。
- 鼠标离开积分胶囊与卡片整体区域，或焦点离开该区域时关闭。
- 触屏设备点击积分胶囊后应能打开同一内容。
- 打开积分卡时关闭头像账户菜单。

位置和尺寸：

- 卡片宽度 300px，高度约 264px。
- 位于积分胶囊下方，顶部间距约 12px。
- 卡片右边缘与积分胶囊右边缘对齐，因此相对头像菜单更靠左。
- 移动端优先保证卡片不超出视口。

内容：

1. 渐变头部：`Total purchased credits`、积分图标和完整余额。
2. `Usage details` 行及右侧箭头。
3. 深色主按钮：`Get more credits`。

点击规则：

- `Usage details` 进入积分使用明细。
- `Get more credits` 进入积分购买流程。
- 当前原型保留入口，正式路由和购买流程由商业化模块接入。

### 3.2.8 头像账户菜单

触发与关闭：

- 点击头像打开账户菜单；再次点击头像关闭。
- 点击菜单外部或按 Esc 关闭。
- 打开账户菜单时关闭积分余额卡。
- 同一时间只允许账户菜单和积分余额卡中的一个处于打开状态。

位置和视觉：

- 菜单位于头像下方并与头像右边缘对齐。
- 宽度约 210px，白色背景、18px 圆角和轻量阴影。
- 菜单内容不得改变右上角入口的尺寸和位置。

菜单内容从上到下：

1. 登录邮箱：当前原型为 `demo@photogrid.com`，超长时单行截断。
2. `Plan`：右侧显示当前等级，当前原型为 `Free`。
3. `Settings`。
4. `Log out`。

Plan 规则：

- 套餐等级支持 `Free`、`VIP`、`Pro` 和 `Ultra`。
- 点击 Plan 入口应打开订阅弹窗。
- 本轮仅实现 Plan 入口和当前等级展示，订阅弹窗暂不生成。

| 等级 | 建议文字颜色 |
|---|---|
| Free | 中性灰 |
| VIP | 橙色 |
| Pro | 紫色 |
| Ultra | 品红色 |

未登录状态：

- 使用默认用户图标。
- 点击后打开登录弹窗，不展示已登录账户菜单。
- Settings 路由和 Log out 流程在正式接入账户系统后补全。

---

## 3.3 Home 页面

### 3.3.1 模块顺序

Home 从上到下固定为：

1. Agent 统一入口。
2. What's New。
3. Recommended Tools。
4. 模板推荐内容流。

Agent 必须位于首屏并拥有最高视觉优先级。运营内容和工具推荐不得出现在 Agent 之前。

右上角积分与账户区属于全局工具区，不计入 Home 内容模块顺序，也不得挤压 Agent 标题宽度。

> **[截图占位 S05：Home 页面完整结构]**  
> 截图范围：从 Agent 到模板推荐的完整 Home 页面。  
> 建议标注：模块顺序、模块间距和首屏信息范围。

### 3.3.2 Agent 默认状态

标题：

- 英文：`Create images, videos, posters, and brand assets with AI`。
- 中文建议：`用 AI 创建图片、视频、海报和品牌素材`。
- 英文最长建议 72 个字符。
- 中文最长建议 32 个字符。
- 最多两行，禁止截断。
- 标题独占内容行，最大宽度约 680px，并在 Agent 内容区内居中。
- 不将积分胶囊或头像作为标题 flex 行的子项；窄屏下账户区位于标题上方。

输入区：

- 多行输入框。
- 默认最小高度约 150px。
- 最大输入 2000 个 Unicode 字符。
- 自动去除首尾空格。
- 仅输入空格视为空内容。
- 支持粘贴多行文本。
- 超过限制时阻止继续输入，并展示剩余字数或错误提示。

默认占位：

- 英文：`Describe what you want to create -- images, videos, posters, brand visuals, and more...`
- 中文：`描述你想创建的图片、视频、海报或品牌素材...`
- 占位最多两行，不作为实际输入提交。

底部左侧按钮：

- Add media。
- Auto。
- Assets。
- Prompt/knowledge。

底部工具栏按钮：

- Send 改为仅图标圆形按钮，与 Add media、Auto、Assets、Prompt/knowledge 和任务胶囊保持同一排；必须提供 `aria-label="Send"` 和 title，不再展示 `Send` 文字。

> **[截图占位 S06：Agent 默认状态]**  
> 截图范围：标题、完整输入框、左下角按钮、Send，以及桌面端一级快速任务或 H5 二级任务标题入口。
> 建议标注：输入区域、附件入口、Auto 模式和提交按钮。

### 3.3.3 Add media

点击后打开素材选择菜单：

- Upload image。
- Upload video。
- Choose from My Upload。
- Choose from Projects，可选。

当前 Creation 原型中，`Add media` 统一承载所有二级任务的图片选择，不在任务快捷参数中重复提供上传控件。选择本地图片后，缩略图回填到输入区最上方并独占一行；桌面端快捷参数位于其下方，任务胶囊位于输入框底部左侧工具栏；H5 隐藏快捷参数和任务胶囊，只保留参考图、可编辑 Prompt 与通用工具栏。缩略图支持逐张删除，切换二级任务或关闭桌面端任务胶囊时保留已选图片。后端上传、进度和失败重试仍按正式上传服务接入时实现。

上传限制建议：

| 类型 | 格式 | 单文件大小 | 数量 |
|---|---|---:|---:|
| 图片 | jpg、jpeg、png、webp | 20MB | 当前任务最多 10 张 |
| 视频 | mp4、mov、webm | 500MB | 当前任务最多 3 个 |

具体大小以现有上传服务为准。

上传状态：

- 上传中展示进度。
- 上传成功展示缩略图。
- hover 缩略图显示删除按钮。
- 上传失败展示 Retry 和 Delete。
- 点击 Send 前必须等待所有素材上传完成。

### 3.3.4 Agent 一级快速任务

响应式规则：

- 桌面端继续使用“一级分类 → 二级模板卡片”的两级选择流程。
- `<768px` 的 H5 不展示一级分类卡片，将四组共 16 个二级任务的名称平铺为单行横向滚动的紧凑标题按钮；按钮不展示描述、图标或预览图片。
- H5 首次进入自动选中第一项二级任务，使输入框立即展示该任务的模板参考图和真实 Prompt；点击其他标题时同步切换选中态、参考图和 Prompt，并保留用户上传图片。

默认展示四个一级分类：

| 分类 | 子任务 |
|---|---|
| E-commerce Poster | Product Poster、Social Media Ad、E-commerce Banner、Brand Campaign |
| Amazon Detail Images | Conversion A+ Set、Brand Story A+ Set、Features & Specs A+ Set、Comparison & Trust A+ Set |
| E-commerce Video | UGC Product Ad、Product Showcase、Before & After、VSL Conversion Ad |
| Trending AI Videos | Kiss Cam、The Final Hug、Match Day、AI Dance |

一级卡片规则：

- 图标位于左侧。
- 仅展示图标和标题，不展示副标题、描述或图片。
- 标题最长 24 个英文字符或 12 个中文字符。
- 桌面端单行四列；窄屏使用两列，标题允许自然换行且不得与图标重叠。

二级卡片规则：

- 采用模板预览样式，卡片内不展示任务标题或图标，可见内容仅包含一条简短任务描述和预览图片。
- 简短描述位于卡片顶部，使用具体动作直接说明对应标题的模板用途，不使用可套用于其他任务的泛化文案；最多展示两行。预览图片位于下方并作为卡片主体。
- 卡片与图片容器使用固定高度，图片以 `object-cover` 裁切，动态内容不得引起卡片尺寸跳动。
- 四个二级任务始终保持单行横向排列；可用宽度不足时横向滚动，不压缩为多行。
- 任务名称保留在选中后的底部任务胶囊和卡片无障碍标签中，不因视觉简化而丢失任务识别。

点击：

- 原一级分类卡片切换为子任务卡片。
- 自动选中该分类的第一个子任务，并立即在输入框顶部展示对应快捷参数、在底部左侧工具栏展示任务胶囊。
- 二级任务列表上方不展示分类标题和 Back。
- 退出二级任务列表的唯一入口为输入框底部左侧任务胶囊的关闭按钮。

> **[截图占位 S07：Agent 一级分类与子任务切换]**  
> 截图范围：左侧为一级分类状态，右侧为任一分类展开后的子任务状态。  
> 建议标注：一级卡片仅包含图标与标题、二级卡片仅包含顶部简短描述与下方大图，以及分类点击后的首项自动选中状态。

### 3.3.5 Agent 子任务选中

点击子任务后：

- 桌面端输入框底部左侧工具栏在 Prompt/knowledge 按钮后出现任务胶囊；H5 不展示任务胶囊，由下方标题按钮的选中态表达当前任务。
- 胶囊包含当前二级任务的图标、任务名称和关闭按钮。
- 桌面端输入框顶部独立展示该任务对应的参数及模板默认值，不与任务胶囊同行；H5 隐藏该快捷参数填选区。
- Prompt 区直接回填该任务可编辑的完整模板文案，不再只切换任务专属占位文案。
- 该任务的本地示例图通过通用上传区回填到输入区最上方，作为可删除的模板素材；不增加模板专属上传框。
- 切换到其他二级任务时，Prompt、参数和模板示例图同步覆盖为新模板数据；再次点击当前任务时恢复该模板默认数据。
- 切换同一分类下的二级任务时，任务胶囊的图标、颜色和名称同步更新为当前二级任务。
- 用户通过 `Add media` 上传的图片在任务切换时继续保留，并与模板示例图区分来源。

关闭胶囊：

- 清空当前子任务。
- 清空子任务参数。
- 移除当前模板示例图。
- 返回一级分类列表。
- 保留用户已输入的通用 Prompt 和用户上传素材。

重新选择一级分类：

- 先通过任务胶囊关闭按钮清空当前子任务及参数并返回一级分类列表。
- 再选择新的一级分类，并自动选中该分类的第一个子任务。
- 不清空通用 Prompt 和已上传素材。

> **[截图占位 S08：Agent 子任务选中状态]**  
> 截图范围：底部左侧任务胶囊、顶部参数行、已回填的可编辑模板 Prompt 和子任务卡片。
> 建议标注：胶囊在 Prompt/knowledge 按钮后的固定位置、模板 Prompt 与参数默认值的真实回填，以及关闭后的返回逻辑。

### 3.3.6 二级任务快捷参数

二级任务被选中后，桌面端对应参数在输入框顶部展示；H5 不展示快捷参数填选区。各分类参数结构如下：

| 分类 | 快捷参数 |
|---|---|
| E-commerce Poster | Headline / Campaign Title、Aspect Ratio、Quantity |
| Amazon Detail Images | Product Name、Language、A+ Format |
| E-commerce Video | Product Name、Target Audience、Usage Scene；部分任务增加 Spoken Language 或 Emotional Tone；Aspect Ratio 默认 9:16 |
| Trending AI Videos | Aspect Ratio，默认 9:16 |

快捷参数展示规则：

- 文本参数直接显示模板默认值；清空后展示完整输入提示，例如 `Please enter the product name`。
- 下拉框关闭时只显示当前值，例如 `9:16`、`Gen Z`，不拼接或叠加参数名称。
- 参数名称作为不可选择的分组标题显示在展开菜单弹层顶部，纯值选项位于标题下方；关闭状态控件内部及控件外均不显示参数名称标签。
- 文本参数与下拉框保持相同高度；多个参数换行时按控件底部对齐，控件不得遮挡相邻参数、Prompt 或输入区边界。
- 每个二级任务必须同时配置非空 Prompt 和与业务场景匹配的参数默认值；下拉默认值必须存在于对应选项集合中。
- 图片不属于快捷参数控件；模板示例图和用户图片统一在通用上传区展示，当前 16 个二级任务被选中时均自动回填至少一张本地模板示例图。
- 需要多种输入素材的任务按语义回填两张图：`Comparison & Trust A+ Set` 为主商品图和对比商品图，`Before & After` 为 Before 和 After，`Kiss Cam` 与 `The Final Hug` 均为人物一和人物二；其余任务保持单图。
- 每张模板图必须使用可区分用途的名称和无障碍文案；相关 Prompt 必须说明多张图的使用顺序，避免生成时混淆输入角色。
- 切换任务时整组替换模板示例图；用户图片继续保留并单独遵守最多 10 张、格式和大小限制。

UGC Product Ad 参数：

| 参数 | 控件 | 默认值 | 限制 |
|---|---|---|---|
| Product Name | 文本输入 | HydraSip Bottle | 最多 50 个 Unicode 字符 |
| Target Audience | 下拉 | Gen Z | 单选 |
| Usage Scene | 下拉 | Product demo | 单选 |
| Spoken Language | 下拉 | English | 单选 |
| Aspect Ratio | 下拉 | 9:16 | 单选 |

Product Name 规则：

- 去除首尾空格。
- 允许中英文、数字和常用标点。
- 仅输入空格视为空。
- 超过 50 字符时阻止继续输入。
- 为空时是否允许提交由 Agent 追问能力决定；建议允许提交并在工作区追问。

下拉文案最长建议：

- 英文 28 个字符。
- 中文 14 个字符。
- 超出时截断，选项菜单展示完整文案。

> **[截图占位 S09：UGC Product Ad 参数状态]**
> 截图范围：输入框顶部完整参数和下方 UGC Product Ad 子任务选中状态。
> 建议标注：Product Name、Language、Aspect、Audience、Scene。

### 3.3.7 Send

可提交条件：

- Prompt 非空；或
- 已上传至少一个素材；或
- 已选择一个子任务并填写其必要参数。

状态：

| 状态 | 文案 | 行为 |
|---|---|---|
| Empty | Send | 禁用 |
| Ready | Send | 可点击 |
| Creating | Creating... | 禁用并展示 loading |
| Failed | Send | 恢复可点击并展示错误 |

点击后：

1. 校验输入和上传状态。
2. 校验登录。
3. 未登录打开登录弹窗。
4. 登录成功恢复全部上下文。
5. 创建 Agent Session。
6. 进入独立 Agent 工作区。

失败处理：

- 不清空 Prompt、素材、子任务和参数。
- 在输入框附近展示错误提示。
- 错误文案最长两行。
- 提供 Retry 或允许再次点击 Send。

### 3.3.8 What's New

卡片只展示：

- 真实图片。
- 标题。
- 右上角标签。

排布：

- 单行横向滚动。
- 桌面首屏显示约 3-4 张。
- 卡片高度约 150px。
- 卡片宽度固定，动态内容不得改变布局。

文案限制：

- 标题最多 60 个英文字符或 30 个中文字符。
- 最多两行，超出截断。
- 标签最多 16 个英文字符或 8 个中文字符。
- 标签单行显示。

状态：

- Loading：横向卡片骨架。
- Empty：跳过该模块，后续模块自动上移。
- Error：上报异常，后续模块正常加载。

> **[截图占位 S10：What's New]**  
> 截图范围：完整标题和横向运营卡片。  
> 建议标注：图片、标题、右上角标签和横向滚动方向。

### 3.3.9 Recommended Tools

排布：

- 桌面端左侧两张重点大卡，右侧使用紧凑工具网格，右下角为 More 卡片。
- `<768px` 的 H5 按现有顺序仅保留前 7 个高频工具，并与 More 合并为两行四列轻量网格；图标位于标题上方，标题最多两行。其余工具不在 H5 首页展示，但继续保留在 Tools 页面。
- H5 不展示卡片底色、边框和描述，不改动保留工具的顺序、图标与跳转；More 与普通工具使用相同排版。

大卡：

- 图标位于标题左侧。
- 标题单行。
- 描述最多两行。
- 标题最长 24 个英文字符或 12 个中文字符。
- 描述最长 100 个英文字符或 50 个中文字符。

网格卡：

- 图标和标题。
- 标题最长 22 个英文字符或 11 个中文字符。

More：

- 点击切换到 Tools。

> **[截图占位 S11：Recommended Tools]**  
> 截图范围：两张大卡、右侧工具网格和 More。  
> 建议标注：大卡与网格宽度关系、图标位置和 More 跳转。

### 3.3.10 Home 模板推荐

结构：

- 顶部一级场景 tab。
- 下方多个模板内容块纵向排列。
- 顶部 tab 点击后平滑定位对应内容块。

内容块：

- 左侧或顶部展示场景标题。
- 模板单行横向流式排列。
- 支持左右滚动。
- 默认只展示图片和标题。
- H5 与桌面端均不展示 `Use same style` 覆盖按钮，整张卡片作为模板入口。

内容分类与左侧文案：

| 顶部一级分类 | 左侧对应分类 | 左侧说明文案 |
|---|---|---|
| Popular | Trending Photo Template | 不展示说明 |
| Popular | Trending AI Video Templates | 不展示说明 |
| Creative Effects | AI Dance | Make anyone move with AI dance effects. |
| Creative Effects | Anime | Turn photos into stunning anime art. |
| Creative Effects | Filters | Transform photos with AI-powered filters. |
| Creative Effects | Face Morph | Create fun and surprising face transformations. |
| Creative Effects | Art Styles | Turn photos into paintings and classic art. |
| Creative Effects | Photo to Video | Bring your photos to life with AI video. |
| Beauty | Portrait Effects | Transform portraits with AI effects. |
| Beauty | Idol Styles | 不展示说明 |
| Beauty | Fashion & Makeup | Highlight stylish outfits and makeup. |
| Beauty | Accessories | Try stylish outfits and accessories. |
| E-Commerce | Product Reviews | Create authentic product review content. |
| E-Commerce | Product Showcase | Highlight your product's key features. |
| E-Commerce | Before & After | Show clear product results and contrast. |
| E-Commerce | Product Photography | Create polished product photos with AI. |
| E-Commerce | E-Commerce Assets | Create visuals for stores and product listings. |
| E-Commerce | Platform Kits | Create ready-to-use visuals for online platforms. |
| Lifestyle | Kids | Create warm and playful edits for kids. |
| Lifestyle | Pets | 不展示说明 |
| Lifestyle | Duo Interaction | Create fun AI moments made for two. |
| Lifestyle | Travel & Wallpapers | Capture travel memories and HD wallpapers. |
| Lifestyle | Family Moments | Celebrate meaningful moments with family. |
| Seasonal | Back to School | Get ready for the new school season. |
| Seasonal | Birthday | 不展示说明 |
| Seasonal | Anniversary | 不展示说明 |
| Seasonal | Halloween | 不展示说明 |
| Seasonal | Christmas | 不展示说明 |
| Seasonal | Mother's Day | 不展示说明 |

固定规则：

- 顶部一级分类顺序固定为 `Popular → Creative Effects → Beauty → E-Commerce → Lifestyle → Seasonal`。
- 每个一级分类定位到该分类第一组内容块；同一一级分类下的对应分类保持连续排列。
- 需求表中未提供说明文案的分类不得自行补充占位文案。

文案限制：

- 场景标题最长 40 个英文字符或 20 个中文字符。
- 模板标题最长 48 个英文字符或 24 个中文字符。
- 标题单行截断。

> **[截图占位 S12：Home 模板推荐内容流]**  
> 截图范围：顶部场景 tab 和至少两个纵向模板内容块。  
> 建议标注：tab 定位、横向滚动和卡片 hover 操作。

---

## 3.4 Tools 页面

### 3.4.1 页面结构

从上到下：

1. 页面标题 Tools。
2. Search Tools。
3. Recently used。
4. 类型 tab：Image、Video、Utility。
5. 工具分类和卡片列表。

> **[截图占位 S13：Tools 页面完整结构]**  
> 截图范围：搜索、Recently used、类型 tab 和至少两个工具分类。  
> 建议标注：页面信息层级和卡片列数。

### 3.4.2 搜索

- 占位：`Search tools`。
- 最大输入 100 个 Unicode 字符。
- 去除首尾空格。
- 输入后 200-300ms debounce。
- 支持名称、别名和能力关键词。
- 搜索结果实时更新。
- 按 Esc 清空或失焦规则由交互统一规范决定。

空结果：

- 标题：`No tools found`。
- 辅助文案：`Try another keyword.`。
- 操作：`Clear search`。

### 3.4.3 Recently used

- 默认展示最近使用的 3 个工具。
- 卡片只展示图标和标题。
- 未登录或无记录时展示默认推荐。

标题限制：

- 工具标题最长 24 个英文字符或 12 个中文字符。
- 超出单行截断并提供 tooltip。

### 3.4.4 类型 tab

- Image。
- Video。
- Utility。

规则：

- 使用文本 tab 和下划线选中态。
- 不使用大面积胶囊。
- 点击后过滤或定位对应分区。
- tab 文案最长 12 个英文字符或 6 个中文字符。

### 3.4.5 工具分类

Image Tools：

- AI Image。
- Grid。
- AI Photo Editor。
- AI Filter。
- Image Upscaler。
- Background Remover。
- Object Remover。
- Photo Restoration。
- Watermark Remover。

Video Tools：

- AI Video。
- E-commerce Video。
- AI Avatar。

Creative Utilities：

- AI Agent。

固定规则：

- Grid 属于 Image Tools。
- `AI Editor` 统一命名为 `AI Photo Editor`。

### 3.4.6 工具卡片

展示：

- 真实预览图。
- 工具图标。
- 标题。
- 简短描述。

限制：

- 标题最长 32 个英文字符或 16 个中文字符，单行截断。
- 描述最长 120 个英文字符或 60 个中文字符，最多两行。
- 卡片图片保持固定高度，不因标题和描述改变。

点击：

- 可用且有权限：进入独立工具页。
- 未登录：登录成功后继续跳转。
- 无权限：展示订阅或权限弹窗。

---

## 3.5 Templates 页面

### 3.5.1 页面结构

从上到下：

1. 页面标题 Templates。
2. 六个一级类型。
3. 二级分类和搜索。
4. 模板瀑布流或 AI Voice 声音列表。

> **[截图占位 S14：Templates 页面默认状态]**  
> 截图范围：一级类型、二级分类、搜索和首屏瀑布流。
> 建议标注：筛选层级和卡片列数。

### 3.5.2 一级类型

- AI Video。
- AI Image。
- E-commerce Video。
- AI Avatar。
- AI Voice。
- Design。

规则：

- 默认选中 AI Video。
- 点击后清空二级分类和搜索词。
- 结果区回到顶部。
- 类型标题最长 24 个英文字符或 12 个中文字符。
- 窄屏允许 2-3 列换行，但单个按钮尺寸稳定。

### 3.5.3 二级分类

- 默认选中 All。
- 仅展示当前一级类型对应分类。
- 单行横向滚动。
- 选中项使用深色胶囊。
- 单个分类最长 22 个英文字符或 11 个中文字符。
- 超出截断，tooltip 展示完整名称。

### 3.5.4 搜索

- 占位根据一级类型变化，例如 `Search AI Video`。
- 最大输入 100 个 Unicode 字符。
- 搜索范围仅限当前一级类型。
- 搜索词和二级分类同时生效。
- 筛选区下方不重复展示当前类型标题或模板数量。

无结果：

- 标题：`No templates found`。
- 操作：`Clear filters`。
- 点击后清空搜索和二级分类，恢复 All。

### 3.5.5 模板瀑布流

- 筛选区与瀑布流之间保留约 20px 间距。
- 图片按不同纵横比排列。
- 桌面端 4-5 列。
- 平板 3 列。
- 移动端 2 列。
- 卡片之间保持 12-16px 间距。
- 首屏建议加载 20-30 条。
- 后续使用游标分页或无限加载。

### 3.5.6 模板卡片

默认状态：

- 只显示图片。
- 视频模板右上角可显示时长。

hover 状态：

- 增加深色渐变遮罩。
- 标题显示在图片左上角。
- 视频时长保留在右上角。
- 图片底部显示 `View details`。

标题规则：

- 最长 60 个英文字符或 30 个中文字符。
- hover 状态单行截断。
- 标题右侧预留时长空间，不得重叠。
- 完整标题通过 tooltip 或详情展示。

点击：

1. 点击卡片或 `View details` 打开模板详情弹窗。
2. AI Video 和 AI Image 使用左侧内容预览、右侧 Prompt、参数和操作的浅色详情结构。
3. E-commerce Video 使用专用浅色详情弹窗：左侧为浅灰底 9:16 视频预览，右侧依次展示 References、Video Type、Product Name、Spoken Language、Target Audience、Usage Scene、Product Benefit 和 `Recreate` 按钮。
4. Design 保持统一浅色弹窗和标题栏，内部左侧展示大图，右侧依次展示可展开描述、`Edit now`、Template Details（Size、Images）和 Relevant Categories；不展示 Design setup、Template pages 或 Similar designs。
5. AI Avatar 使用左侧 Base Image、右侧 Body Three Views 和 Voice 的结构。
6. 点击弹窗主按钮后校验登录和权限，并将模板 ID、版本和默认参数传递给目标工具。
7. 点击关闭按钮、背景遮罩或按 Esc 关闭弹窗。

> **[截图占位 S15：模板卡片 hover 状态]**  
> 截图范围：至少一张默认卡片和一张 hover 卡片。  
> 建议标注：左上标题、右上时长、底部 CTA 和遮罩。

### 3.5.7 触屏设备

触屏设备点击卡片直接打开模板详情弹窗。

AI Voice 卡片不打开模板详情弹窗，卡片本身不提供选中交互；点击播放按钮直接播放或暂停声音示例，点击 `Generate Video` 进入 E-commerce Video。

### 3.5.8 AI Voice 声音列表

选中 AI Voice 一级类型后，使用独立的浅色声音列表，不展示模板瀑布流和模板详情弹窗。

筛选区：

- `Language` 下拉：English、Spanish。
- `Accents` 下拉：根据现有声音数据动态生成口音选项。
- `Gender` 下拉：Male、Female。
- 搜索框占位：`Search voices...`。
- 四项条件同时生效，切换离开 AI Voice 后停止当前播放。

声音卡片：

- 当前包含 Ethan、Diego、Mariana、Lucia、Valeria、Camila 和 Sophie。
- 展示姓名、口音标签、性别标签、播放按钮、波形和 `Generate Video` 按钮。
- 声音卡片不设置默认选中项，不展示选中背景、选中描边或勾选标记；点击卡片空白区域不触发任何动作。
- 所有筛选控件和卡片使用白色或浅灰背景，不使用深色列表样式。
- 桌面端 3 列、平板 2 列、移动端 1 列。

视频交接规则：

- `Generate Video` 携带声音名称、语言、口音和性别进入 E-commerce Video。
- E-commerce Video 只接受当前声音白名单内完全匹配的参数组合，并在创作表单中展示来源为 Templates 的声音配置。
- 视频 Prompt 优化必须使用已接收的声音身份、语言、口音和性别；参数缺失、被篡改或不在白名单时不得带入生成链路。

播放规则：

- 点击播放按钮播放对应语言的声音示例，不改变卡片样式或产生选中状态。
- 播放时按钮切换为暂停图标，波形切换为青色动态状态。
- 同一时间只允许一个声音播放；播放其他声音前停止当前声音。
- 再次点击当前声音的暂停按钮立即停止。
- 播放结束、播放失败、离开 AI Voice 或组件卸载时恢复默认状态。

无结果：

- 标题：`No voices found`。
- 操作：`Clear filters`，恢复所有筛选和搜索条件。

---

## 3.6 Projects 页面

### 3.6.1 标题式一级切换

页面顶部展示：

- Projects。
- My Upload。

规则：

- 使用标题样式作为 tab。
- 当前选中项使用深色文字。
- 未选中项使用浅灰文字。
- 不再额外重复 Projects 标题。
- 切换时关闭详情、More 菜单和多选状态。

> **[截图占位 S16：Projects 页面整体结构]**  
> 截图范围：Projects/My Upload 标题式切换、工具区和按日期分组的项目卡片。  
> 建议标注：一级切换、任务类型、筛选工具区和日期分组。

### 3.6.2 Projects 工具区

同一行展示：

- 任务类型 tab。
- Tool 下拉。
- Time Range。
- View Mode。
- 搜索框。
- Select。

桌面规则：

- 搜索框不得单独占据一整行。
- 任务类型位于左侧。
- 筛选和搜索位于右侧。

窄屏折行优先级：

1. 任务类型。
2. 搜索。
3. Tool、Time Range、View Mode 和 Select。

### 3.6.3 任务类型

- All。
- Image。
- Video。
- Audio。
- Design。
- Agent Sessions。
- Avatar。

点击后：

- Tool 恢复 All。
- 关闭 More 菜单。
- 退出多选。
- 刷新列表。

Tool 下拉适用于 All、Image、Video、Audio 和 Design。

### 3.6.4 Tool 下拉

选项：

- All。
- AI Agent。
- AI Image。
- AI Video。
- AI Voice。
- AI Photo Editor。
- E-commerce Video。
- AI Avatar。
- Design。
- Background Remover。

规则：

- 默认文案为 All，不使用 All Tools。
- 仅展示当前任务类型实际存在的 Tool。
- Audio 仅展示 All、AI Voice 和实际音频来源。
- Design 仅展示 All、Design 和实际设计来源。
- 选项标题最长 28 个英文字符或 14 个中文字符。

### 3.6.5 Time Range

默认：All time。

内容：

- All time。
- Today。
- 年份和月份切换。
- 日历。
- 日期范围选择。

关闭：

- 点击外部。
- Esc。
- 切换一级页面。
- 打开其他工具区浮层。

筛选字段建议使用 `updated_at`，最终需确认。

> **[截图占位 S17：Time Range 日期选择]**  
> 截图范围：Time Range 按钮和展开日历。  
> 建议标注：All time、Today、月份切换、日期范围和选中状态。

### 3.6.6 View Mode

Grouping：

- Group by date，默认。
- Flat list。

可选 Card size：

- Small。
- Medium。
- Large。

规则：

- Group by date 展示日期标题。
- Flat list 直接连续排列卡片。
- 用户选择保存在账户偏好或本地存储。
- 打开 View Mode 时关闭 Time Range 和 Tool 菜单。

> **[截图占位 S18：View Mode]**  
> 截图范围：View Mode 按钮和展开菜单。  
> 建议标注：Grouping 与 Card size。

### 3.6.7 搜索

- 占位：`Search projects...`。
- 最大输入 100 个 Unicode 字符。
- 支持项目标题、Prompt 和工具名称。
- 使用 300ms debounce。
- 与任务类型、Tool 和 Time Range 同时生效。

无结果：

- 标题：`No projects found`。
- 辅助文案：`Try changing your search or filters.`。
- 操作：`Clear filters`。

### 3.6.8 Select 多选

进入多选：

- hover 卡片时，左上角类型标签切换为复选框。
- 勾选第一个复选框后进入多选模式。
- 多选模式下所有卡片左上角持续显示复选框。
- 卡片点击切换选中，不打开详情。
- 顶部显示已选数量。

操作：

- Download。
- Delete。
- Cancel。

文案：

- 1 个：`1 selected`。
- 多个：`{n} selected`。

规则：

- 批量 Delete 二次确认。
- 批量 Download 跳过不可下载项并说明数量。
- 取消最后一个已选项后自动退出多选模式。
- 切换任务类型、一级页面或退出多选时清空选择。

### 3.6.9 项目卡片

展示：

- 方形预览区。
- 左上角类型标签。
- hover 右上角 More。
- 预览区下方可编辑标题。
- 文件大小和更新时间。

标签规则：

| 条件 | 标签 |
|---|---|
| AI Photo Editor 项目 | Project |
| 图片结果 | Image |
| 视频结果 | Video |
| 音频结果 | Audio |
| 设计结果 | Design |
| Agent 会话 | Agent Session |
| Avatar | Avatar |

标题规则：

- 存储最大 100 个 Unicode 字符。
- 卡片默认单行截断。
- 点击标题进入编辑。
- Enter 保存。
- Esc 取消。
- 点击外部保存。
- 空标题不允许保存。
- 仅空格视为空。
- 保存失败恢复原标题并提示。

文件信息：

- 文件大小使用 KB、MB、GB 自动换算。
- 小数最多一位，例如 `48.2 MB`。
- 时间使用站点统一格式。
- 文件大小未知时显示 `--`。

### 3.6.10 More 菜单

操作：

- Rename。
- Download。
- Delete。

显示：

- hover 卡片后显示 More。
- 点击 More 打开菜单。
- 同一时间只允许一个菜单打开。

关闭：

- 点击操作。
- 点击外部。
- Esc。
- 切换筛选或页面。

Delete：

- 二次确认标题：`Delete project?`。
- 说明：`This action cannot be undone.`。
- 按钮：Cancel、Delete。
- Delete 使用危险色。

> **[截图占位 S19：项目卡片、多选和 More 菜单]**  
> 截图范围：普通卡片、hover More、多选卡片和展开菜单。  
> 建议标注：类型标签、标题编辑、文件信息和三项菜单操作。

### 3.6.11 Audio 卡片

- 预览区展示播放按钮和波形。
- 标题、大小和时间位于预览区下方。
- 普通点击播放或暂停，不打开详情。
- 同一时间只播放一个音频。
- 页面切换时停止播放。
- More 仍提供 Rename、Download、Delete。

音频辅助标签可展示语言或音色，最长 40 个英文字符或 20 个中文字符。

### 3.6.12 卡片点击行为

| 类型 | 点击行为 |
|---|---|
| Image | 打开通用详情弹窗 |
| Video | 打开通用详情弹窗并支持播放 |
| Audio | 卡片内播放 |
| Design | 直接进入 `/editor`，携带 `source=creation-project` 和项目标题参数，不打开详情弹窗 |
| Avatar | 打开 Avatar 专用详情弹窗 |
| AI Photo Editor Project | 进入 AI Photo Editor |
| Agent Session | 进入对应 Agent 会话 |

### 3.6.13 通用详情弹窗

布局：

- 左侧：图片或视频内容。
- 右侧：任务标题、参考素材、Prompt、模型和参数。

右侧内容：

- Prompt。
- Tool。
- Model。
- Aspect Ratio。
- Resolution。
- Duration，视频展示。
- File Size。
- Created Time。
- Updated Time。

Prompt：

- 默认展示完整内容区域，可滚动。
- 建议最大存储 20,000 个 Unicode 字符。
- 超长内容不撑高弹窗。
- 支持 Copy，可作为 P1。

底部操作：

- Recreate。
- Edit，有对应编辑能力时展示。
- Download。

关闭：

- 右上角关闭按钮。
- 点击背景遮罩。
- Esc。

> **[截图占位 S20：图片/视频通用详情弹窗]**  
> 截图范围：左侧内容和右侧 Prompt/参数区域。  
> 建议标注：参考素材、Prompt、基础参数和底部操作。

### 3.6.14 Avatar 详情弹窗

保持浅色主题。

展示：

- Avatar 标题和重命名入口。
- Base Image。
- Face Views，数据存在时展示。
- Body Three Views：Front、Side、Back。
- Voice 名称、试听和 Switch Voice。

底部操作：

- Recreate。
- Create Similar Avatar。
- Generate Video。

Generate Video：

- 携带 Avatar ID 进入 E-commerce Video 或 UGC Video 生成器。
- Avatar ID 传递失败时不允许静默跳转。

> **[截图占位 S21：Avatar 详情弹窗]**  
> 截图范围：Base Image、Face/Body Views、Voice 和底部操作。  
> 建议标注：Generate Video 跳转和 Voice 切换。

---

## 3.7 My Upload 页面

### 3.7.1 页面结构

- 通过 Projects 标题区切换到 My Upload。
- 展示类型、Time Range、View Mode 和 Select。

类型：

- All。
- Image。
- Video。
- Audio。

> **[截图占位 S22：My Upload 页面]**  
> 截图范围：My Upload 选中状态、类型 tab、工具区和文件卡片。  
> 建议标注：无搜索框、文件类型和卡片结构。

### 3.7.2 上传文件卡片

- 与 Projects 卡片结构一致。
- 标签为 Image、Video 或 Audio。
- 标题默认使用文件名。
- 支持重命名。
- 展示文件大小和上传时间。
- 图片和视频点击打开详情。
- 音频点击播放。
- More 提供 Rename、Download、Delete。

文件名规则：

- 存储最大 255 个字符。
- 卡片标题编辑建议最大 100 个 Unicode 字符。
- 保留扩展名或将扩展名单独管理，规则需统一。
- 禁止仅空格名称。
- 重名允许，但不建议强制覆盖。

### 3.7.3 上传入口

当前原型未明确上传入口，建议放在 My Upload 工具区右侧。

按钮文案：`Upload`。

点击后：

- 打开文件选择器。
- 支持图片、视频和音频。
- 上传中显示进度。
- 上传成功插入列表顶部。
- 上传失败保留失败项并支持 Retry。

如果 Upload 最终放入 Create New，应从 My Upload 提供明显入口跳转，避免空页面无操作。

---

## 3.8 通用交互与状态

### 3.8.1 文案与字数限制汇总

| 内容 | 最大长度 | 展示规则 |
|---|---:|---|
| Agent Prompt | 2000 Unicode 字符 | 多行输入，可滚动 |
| UGC Product Name | 50 Unicode 字符 | 单行输入 |
| 工具搜索 | 100 Unicode 字符 | 单行输入 |
| 模板搜索 | 100 Unicode 字符 | 单行输入 |
| 项目搜索 | 100 Unicode 字符 | 单行输入 |
| 工具标题 | 32 英文字符 / 16 中文字符建议值 | 单行截断 |
| 工具描述 | 120 英文字符 / 60 中文字符建议值 | 最多两行 |
| 模板标题 | 60 英文字符 / 30 中文字符建议值 | hover 单行截断 |
| 项目标题 | 100 Unicode 字符 | 卡片单行，编辑时完整显示 |
| 上传文件名 | 255 字符存储，100 字符编辑建议 | 卡片单行截断 |
| 运营卡片标题 | 60 英文字符 / 30 中文字符建议值 | 最多两行 |
| 标签/Badge | 16 英文字符 / 8 中文字符建议值 | 单行 |
| 账户邮箱 | 254 字符 | 菜单内单行截断 |
| 套餐等级 | Free / VIP / Pro / Ultra | Plan 行右对齐展示 |

说明：

- “建议值”用于设计和内容运营控制，不一定作为服务端强校验。
- 用户输入限制必须由前后端同时校验。
- Unicode 字符按产品统一规则计数，避免中英文计数不一致。
- 所有用户输入提交前去除首尾空格。
- 不允许仅空格内容。

### 3.8.2 Loading

- 页面框架先展示，模块独立加载。
- 使用骨架屏保持尺寸稳定。
- 列表分页 loading 位于列表底部。
- 不使用覆盖整页的永久 loading。
- Agent Session 创建中禁用重复提交。

### 3.8.3 Empty

| 场景 | 标题 | 建议操作 |
|---|---|---|
| Tools 搜索无结果 | No tools found | Clear search |
| Templates 无结果 | No templates Agent Sessions
Avatarfound | Clear filters |
| AI Voice 无结果 | No voices found | Clear filters |
| Projects 为空 | No projects yet | Start creating |
| Projects 筛选无结果 | No projects found | Clear filters |
| My Upload 为空 | No uploads yet | Upload |

空状态标题最长一行，辅助文案最长两行。

### 3.8.4 Error

- 单个模块失败不导致整页白屏。
- 展示简短错误说明和 Retry。
- 错误文案最多两行。
- 用户输入和已完成筛选不因错误被清空。
- 权限错误与网络错误使用不同文案。

建议通用文案：

- 网络失败：`Something went wrong. Please try again.`
- 无网络：`You're offline. Check your connection and try again.`
- 无权限：`You don't have access to this feature.`
- 会话过期：`Your session has expired. Please log in again.`

### 3.8.5 登录恢复

登录弹窗触发后保存：

- 当前一级页面。
- Agent Prompt。
- 已上传素材。
- Agent 子任务和参数。
- 模板 ID。
- 目标工具。
- Projects 筛选条件。

登录成功后继续原操作；登录取消后回到原页面，不清空上下文。

### 3.8.6 弹窗与浮层关闭规则

通用关闭方式：

- 点击右上角关闭按钮。
- 点击背景遮罩，确认类弹窗除外。
- Esc。

通用规则：

- 同一类型浮层同时只打开一个。
- 打开新浮层时关闭同区域旧浮层。
- 右上角积分余额卡与头像账户菜单互斥；打开其中一个必须关闭另一个。
- 头像账户菜单支持再次点击触发按钮、点击外部和 Esc 关闭。
- 积分余额卡支持 hover、键盘焦点和触屏点击触发。
- 关闭后焦点返回触发按钮。
- 弹窗打开时锁定页面背景滚动。
- 确认删除和支付弹窗不允许点击遮罩直接关闭，避免误操作。

### 3.8.7 Hover 与触屏

- Hover 只提供快捷信息，不得成为完成核心任务的唯一方式。
- 触屏设备必须可通过点击完成相同行为。
- hover 出现的 More、CTA 和标题需要有键盘焦点状态。
- 积分余额卡不得只依赖 hover，键盘焦点与触屏点击必须可打开。
- AI Voice 播放按钮必须提供播放/暂停状态，且不能同时播放多个声音。
- 动画时长建议 150-250ms。
- 尊重 `prefers-reduced-motion`。

### 3.8.8 响应式

| 视口宽度 | 侧边栏 | 卡片列数 | 工具区 |
|---|---|---|---|
| ≥1280px | 默认展开 | 4-5 列 | 尽量单行 |
| 768-1279px | 可收起 | 3-4 列 | 允许分组折行 |
| <768px | 抽屉或移动导航 | 2 列 | 分两行或菜单化 |

Creation H5 采用以下明确方案：

- 顶部使用 56px 吸顶栏，左侧为导航触发按钮与品牌标识，右侧保留积分与账户入口。
- 完整侧边栏改为左侧抽屉，不占用页面正常文档流；支持遮罩、关闭按钮和 Esc 关闭，切换一级页面后自动关闭。
- 抽屉打开时锁定背景滚动并限制键盘焦点在抽屉内；关闭后焦点返回顶栏导航触发按钮。
- Home 不重复渲染账户区；Agent 输入区压缩垂直留白，Send 使用底部工具栏图标按钮；H5 隐藏快捷参数和一级快速任务，直接展示全部二级任务标题横向入口。
- Home 模板内容块在窄屏取消 250px 左栏占高，标题和说明紧邻模板横滑区；模板预览仅展示图片和标题，不叠加 `Use same style` 按钮。
- H5 Home 采用紧凑视觉密度：Agent 标题约 23px，Prompt 使用较小留白；`What's new` 卡片、推荐工具入口和模板预览卡片分别控制在约 120px、72px、180px 高，避免桌面大卡片直接缩放到移动端造成首屏过度占高。
- H5 Recommended tools 按现有顺序仅展示前 7 个高频工具和 `More`，使用两行四列轻量网格；图标在上、标题在下，不展示卡片背景、边框和描述，描述可保留在无障碍文本中。其余工具仅在 Tools 页面展示，桌面端维持完整推荐大卡片和工具网格。
- H5 点击头像打开全屏底部账户面板：面板从底部上滑进入，右上角提供关闭按钮；顶部展示头像、`Demo` 和 `demo@photogrid.com`，中部按顺序展示 Credits、Plan、Setting、Language，底部提供 `Log out`。遮罩、Esc 和关闭按钮均可关闭面板，关闭后焦点返回头像。

检查要求：

- 最长文案不与图标、标签和按钮重叠。
- 模板瀑布流不出现断裂或超出容器。
- Projects 搜索框不在桌面端单独占一整行。
- 右上角积分胶囊、头像及其弹层不得超出视口或遮挡彼此。
- Home 窄屏状态下账户区位于 Agent 标题上方，桌面端可独立定位到内容区右上角。
- 移动端不依赖 hover。

> **[截图占位 S23：响应式状态对比]**  
> 截图范围：桌面展开、桌面收起、平板和移动端四种状态。  
> 建议标注：侧边栏形态、卡片列数、筛选换行和文本适配。

### 3.8.9 可访问性

- 所有纯图标按钮提供 `aria-label`。
- 积分胶囊和头像必须是两个独立焦点目标，并分别维护 `aria-expanded`。
- 头像菜单使用 menu/menuitem 语义，Plan 的可访问名称包含当前套餐等级。
- 不常见图标提供 tooltip。
- tab 提供选中状态。
- 卡片支持 Enter/Space。
- 弹窗支持焦点锁定和焦点恢复。
- 文本和背景对比度满足 WCAG AA。
- 选中、错误、禁用不能只通过颜色表达。
- 图片提供符合业务语义的 alt；纯装饰图片使用空 alt。
- AI Voice 卡片使用 listbox/option 选中语义，播放按钮的可访问名称包含声音名称和当前播放状态。

---

## 3.9 截图占位索引

| 编号 | 截图内容 | 对应章节 |
|---|---|---|
| S01 | Creation 页面整体布局 | 3.1.2 |
| S02 | 侧边栏展开状态 | 3.2.1 |
| S03 | 侧边栏收起状态 | 3.2.1 |
| S04 | 右上角积分与账户区 | 3.2.6-3.2.8 |
| S05 | Home 页面完整结构 | 3.3.1 |
| S06 | Agent 默认状态 | 3.3.2 |
| S07 | Agent 一级分类与子任务 | 3.3.4 |
| S08 | Agent 子任务选中状态 | 3.3.5 |
| S09 | UGC Ad 参数 | 3.3.6 |
| S10 | What's New | 3.3.8 |
| S11 | Recommended Tools | 3.3.9 |
| S12 | Home 模板推荐 | 3.3.10 |
| S13 | Tools 页面 | 3.4.1 |
| S14 | Templates 默认状态 | 3.5.1 |
| S15 | 模板卡片 hover | 3.5.6 |
| S16 | Projects 页面 | 3.6.1 |
| S17 | Time Range | 3.6.5 |
| S18 | View Mode | 3.6.6 |
| S19 | 项目卡片、多选和 More | 3.6.10 |
| S20 | 通用详情弹窗 | 3.6.13 |
| S21 | Avatar 详情弹窗 | 3.6.14 |
| S22 | My Upload 页面 | 3.7.1 |
| S23 | 响应式状态对比 | 3.8.8 |
