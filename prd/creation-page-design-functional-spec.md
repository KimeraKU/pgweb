# 3. 页面设计与具体功能

> 文档名称：PhotoGrid Web Creation 页面设计与具体功能说明  
> 文档版本：V1.0  
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
- 页面级不得出现横向滚动条。

> **[截图占位 S01：Creation 页面整体布局]**  
> 截图范围：完整桌面页面，包含展开侧边栏和右侧 Home 首屏。  
> 建议标注：侧边栏宽度、内容最大宽度、Agent 首屏位置、页面左右边界。

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
| Home | 不重复展示 `Home` 标题，直接从 Agent 入口开始 |
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
> 建议标注：Logo 中轴、收起按钮、Create New、一级导航和底部账户区。

> **[截图占位 S03：侧边栏收起状态]**  
> 截图范围：完整收起侧边栏。  
> 建议标注：Logo hover 展开入口、导航图标、升级角标、积分缩写和头像。

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

点击目标仍需确认。正式上线前应在以下方案中确定一个：

1. 新建 Agent 会话。
2. 打开创建类型菜单。
3. 进入默认编辑器。

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

- Blog。
- Price。
- Language。

规则：

- Blog 和 Price 点击进入对应页面。
- Language 右侧展示箭头，点击打开语言菜单。
- 收起状态仅展示图标，并通过 tooltip 说明名称。
- 切换语言后保留当前一级页面和页面状态。
- 正式上线不得保留 `#` 空链接。

### 3.2.5 非会员升级横幅

位置：资源入口下方、积分胶囊上方。

展示条件：

- 仅非会员展示。
- 活动折扣由服务端配置，不在前端写死。

展开状态：

- 高度 40px。
- 使用皇冠图标。
- 文案示例：`Upgrade 50% off`。
- 粉色到橙色活动背景。

收起状态：

- 仅展示皇冠按钮。
- 右上角展示 `50%` 小角标。
- hover tooltip 展示完整优惠文案。

点击：

- 进入 Price 页面或打开套餐弹窗。
- 携带来源参数：`source=creation_sidebar`。

文案限制：

- 主文案最长 22 个英文字符或 10 个中文字符。
- 折扣角标最长 4 个字符，如 `50%`。
- 超出时单行截断，不允许换行撑高按钮。

> **[截图占位 S04：侧边栏底部商业化与账户区]**  
> 截图范围：Blog、Price、Language、升级横幅、积分胶囊和用户头像。  
> 建议标注：非会员展示逻辑、升级入口、积分充值入口和用户区层级。

### 3.2.6 积分胶囊

位置：升级横幅下方、用户头像上方。

展开状态：

- 左侧橙色积分图标。
- 中间显示完整积分余额，例如 `6,234`。
- 右侧青色圆形加号。
- 高度 40px。

收起状态：

- 显示缩写余额，例如 `6.2k`。
- 加号作为右上角小按钮或角标。
- tooltip 展示完整余额：`6,234 credits`。

数值规则：

- 0-999：显示完整数值。
- 1,000-999,999：展开状态显示千分位；收起状态保留一位小数，如 `6.2k`。
- ≥1,000,000：收起状态显示 `1.2m`。
- 余额读取失败时展示 `--`，不可误显示为 0。
- 数值变化使用静态更新，不使用影响阅读的跳动动画。

点击：

- 点击主体可进入积分明细或积分说明。
- 点击加号进入积分购买。
- 若主体和加号跳转相同，可合并为一个按钮。

### 3.2.7 用户信息

展示：

- 用户头像。
- 用户名。

未登录状态：

- 使用默认用户图标。
- 文案：`Log in`。
- 点击打开登录弹窗。

已登录状态：

- 用户名最长显示 20 个英文字符或 10 个中文字符。
- 超出单行截断，hover 显示完整名称。
- 点击打开账户菜单。

账户菜单建议包含：

- Account。
- Subscription。
- Credit history。
- Sign out。

---

## 3.3 Home 页面

### 3.3.1 模块顺序

Home 从上到下固定为：

1. Agent 统一入口。
2. What's New。
3. Recommended Tools。
4. 模板推荐内容流。

Agent 必须位于首屏并拥有最高视觉优先级。运营内容和工具推荐不得出现在 Agent 之前。

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

底部右侧按钮：

- Send。

> **[截图占位 S06：Agent 默认状态]**  
> 截图范围：标题、完整输入框、左下角按钮、Send 和一级快速任务。  
> 建议标注：输入区域、附件入口、Auto 模式和提交按钮。

### 3.3.3 Add media

点击后打开素材选择菜单：

- Upload image。
- Upload video。
- Choose from My Upload。
- Choose from Projects，可选。

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

默认展示三个一级分类：

| 分类 | 副标题 | 子任务 |
|---|---|---|
| E-commerce Video | Product ad videos | Short Drama Ad、UGC Ad、TVC Ad、Product Showcase |
| AI Editor | Retouch and enhance | Auto Removal、Image Enhance、Background Removal |
| AI Filter | Styles and presets | Product Filter、Portrait Filter、Style Filter、Color Filter |

卡片规则：

- 图标位于左侧。
- 标题单行。
- 副标题单行。
- 标题最长 24 个英文字符或 12 个中文字符。
- 副标题最长 40 个英文字符或 20 个中文字符。
- 超出单行截断并提供 tooltip。

点击：

- 原一级分类卡片切换为子任务卡片。
- 不自动选择第一个子任务。
- 显示当前一级分类名称和 Back。

> **[截图占位 S07：Agent 一级分类与子任务切换]**  
> 截图范围：左侧为一级分类状态，右侧为任一分类展开后的子任务状态。  
> 建议标注：分类点击、Back 和子任务列表变化。

### 3.3.5 Agent 子任务选中

点击子任务后：

- 输入框顶部出现任务胶囊。
- 胶囊包含图标、任务名称和关闭按钮。
- 同行展示该任务对应的参数。
- 输入框占位切换为任务专属文案。

关闭胶囊：

- 清空当前子任务。
- 清空子任务参数。
- 返回一级分类列表。
- 保留用户已输入的通用 Prompt 和已上传素材。

切换一级分类：

- 清空原子任务参数。
- 关闭原分类状态。
- 不清空通用 Prompt 和已上传素材。

> **[截图占位 S08：Agent 子任务选中状态]**  
> 截图范围：任务胶囊、参数行、专属占位和子任务卡片。  
> 建议标注：关闭胶囊后的返回逻辑。

### 3.3.6 UGC Ad 参数

UGC Ad 参数在输入框顶部单行展示：

| 参数 | 控件 | 默认值 | 限制 |
|---|---|---|---|
| Product Name | 文本输入 | 空 | 最多 50 个 Unicode 字符 |
| Spoken Language | 下拉 | English | 单选 |
| Aspect Ratio / Platform | 下拉 | TikTok/Reels - 9:16 | 单选 |
| Target Audience | 下拉 | Auto | 单选 |
| Usage Scene | 下拉 | Auto | 单选 |

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

> **[截图占位 S09：UGC Ad 参数状态]**  
> 截图范围：输入框顶部完整单行参数和下方 UGC Ad 子任务选中状态。  
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

- 左侧两张重点大卡。
- 右侧紧凑工具网格。
- 右下角为 More 卡片。

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
- hover 每张卡片均展示 `Use same style`。

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
2. 五个一级类型。
3. 二级分类和搜索。
4. 结果标题与数量。
5. 模板瀑布流。

> **[截图占位 S14：Templates 页面默认状态]**  
> 截图范围：一级类型、二级分类、搜索、结果数量和首屏瀑布流。  
> 建议标注：筛选层级和卡片列数。

### 3.5.2 一级类型

- AI Video。
- AI Image。
- E-commerce Video。
- AI Avatar。
- Collage & Poster。

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
- 搜索结果展示数量。

无结果：

- 标题：`No templates found`。
- 操作：`Clear filters`。
- 点击后清空搜索和二级分类，恢复 All。

### 3.5.5 模板瀑布流

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
- CTA 显示在图片底部。

标题规则：

- 最长 60 个英文字符或 30 个中文字符。
- hover 状态单行截断。
- 标题右侧预留时长空间，不得重叠。
- 完整标题通过 tooltip 或详情展示。

CTA：

| 类型 | 文案 |
|---|---|
| AI Video | Use template |
| E-commerce Video | Use template |
| Collage & Poster | Use template |
| AI Image | Use style |
| AI Avatar | Use avatar |

CTA 最长建议 18 个英文字符或 8 个中文字符。

点击：

1. 校验模板状态。
2. 校验登录和权限。
3. 创建目标工具草稿或获取模板参数。
4. 跳转目标工具。
5. 目标工具加载模板 ID、版本和默认参数。

> **[截图占位 S15：模板卡片 hover 状态]**  
> 截图范围：至少一张默认卡片和一张 hover 卡片。  
> 建议标注：左上标题、右上时长、底部 CTA 和遮罩。

### 3.5.7 触屏设备

触屏设备没有 hover，必须提供可执行方案：

- 点击卡片直接进入模板；或
- 第一次点击展示标题和 CTA，第二次点击执行。

建议直接进入模板，标题可通过卡片可访问名称和详情页展示，减少一次点击成本。

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
- Agent Sessions。
- Avatar。

点击后：

- Tool 恢复 All。
- 关闭 More 菜单。
- 退出多选。
- 刷新列表。

Tool 下拉适用于 All、Image、Video 和 Audio。

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
- Background Remover。

规则：

- 默认文案为 All，不使用 All Tools。
- 仅展示当前任务类型实际存在的 Tool。
- Audio 仅展示 All、AI Voice 和实际音频来源。
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

- 点击 Select。
- 卡片左上角显示复选框。
- 卡片点击切换选中，不打开详情。
- 顶部显示已选数量。

操作：

- Download。
- Delete。
- Cancel。

文案：

- 0 个：`Select items`。
- 1 个：`1 selected`。
- 多个：`{n} selected`。

规则：

- 批量 Delete 二次确认。
- 批量 Download 跳过不可下载项并说明数量。
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
| Templates 无结果 | No templates found | Clear filters |
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
- 关闭后焦点返回触发按钮。
- 弹窗打开时锁定页面背景滚动。
- 确认删除和支付弹窗不允许点击遮罩直接关闭，避免误操作。

### 3.8.7 Hover 与触屏

- Hover 只提供快捷信息，不得成为完成核心任务的唯一方式。
- 触屏设备必须可通过点击完成相同行为。
- hover 出现的 More、CTA 和标题需要有键盘焦点状态。
- 动画时长建议 150-250ms。
- 尊重 `prefers-reduced-motion`。

### 3.8.8 响应式

| 视口宽度 | 侧边栏 | 卡片列数 | 工具区 |
|---|---|---|---|
| ≥1280px | 默认展开 | 4-5 列 | 尽量单行 |
| 768-1279px | 可收起 | 3-4 列 | 允许分组折行 |
| <768px | 抽屉或移动导航 | 2 列 | 分两行或菜单化 |

检查要求：

- 最长文案不与图标、标签和按钮重叠。
- 模板瀑布流不出现断裂或超出容器。
- Projects 搜索框不在桌面端单独占一整行。
- 收起侧边栏底部升级、积分和头像均在视口内。
- 移动端不依赖 hover。

> **[截图占位 S23：响应式状态对比]**  
> 截图范围：桌面展开、桌面收起、平板和移动端四种状态。  
> 建议标注：侧边栏形态、卡片列数、筛选换行和文本适配。

### 3.8.9 可访问性

- 所有纯图标按钮提供 `aria-label`。
- 不常见图标提供 tooltip。
- tab 提供选中状态。
- 卡片支持 Enter/Space。
- 弹窗支持焦点锁定和焦点恢复。
- 文本和背景对比度满足 WCAG AA。
- 选中、错误、禁用不能只通过颜色表达。
- 图片提供符合业务语义的 alt；纯装饰图片使用空 alt。

---

## 3.9 截图占位索引

| 编号 | 截图内容 | 对应章节 |
|---|---|---|
| S01 | Creation 页面整体布局 | 3.1.2 |
| S02 | 侧边栏展开状态 | 3.2.1 |
| S03 | 侧边栏收起状态 | 3.2.1 |
| S04 | 侧边栏底部商业化与账户区 | 3.2.5 |
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
