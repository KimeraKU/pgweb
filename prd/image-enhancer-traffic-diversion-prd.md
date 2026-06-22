# Image Enhancer 场景化导流链路 PRD

> 版本：V1.1  
> 日期：2026-06-04  
> 页面：`/image-enhancer`  
> 目标：在 Image Enhancer 结果链路中增加场景化下一步推荐，将增强后的图片自然承接到下游创作功能

---

## 1. 需求背景

Image Enhancer 是当前高流量、低门槛的工具页。用户主要完成“上传图片 -> 高清增强 -> 下载结果”这一单次任务后离开，链路结束较快，缺少向下游创作功能的自然承接。

当前主要问题有三点：

1. 用户完成增强后，不清楚下一步还能做什么。
2. 产品没有把高流量工具页转化为下游功能入口。
3. 如果只是普通跳转，用户进入目标页后仍需重新上传图片，操作成本高，转化意愿弱。

因此，需要在用户拿到增强结果这一高意图时机，结合图片内容推荐合适的下一步创作功能，并在点击后自动带入增强后的图片及对应参数，降低跳转和使用成本，提升下游任务创建率。

核心判断：

- 用户刚拿到高清图时，是最适合推荐下一步创作的时机。
- 推荐必须基于图片内容和使用场景，而不是无差别展示工具入口。
- 点击推荐后必须自动带入增强后的图片并预填目标页参数，否则只是普通广告位。

---

## 2. 需求目标

在 Image Enhancer 结果链路中增加“下一步推荐”能力，将增强后的图片继续承接到下游创作场景，提升工具页的功能转化效率。

### 2.1 核心目标

1. 在不影响 Image Enhancer 主链路完成率和下载率的前提下，提升下游创作功能进入率。
2. 通过图片意图识别，让推荐内容与用户上传图片场景匹配。
3. 点击推荐后自动带入增强图和目标页参数，降低重复上传成本。
4. 验证场景化推荐是否能提升下游任务创建率。

### 2.2 成功指标

| 指标 | 口径 | 说明 |
| --- | --- | --- |
| 推荐点击率 CTR | 推荐卡点击人数 / 推荐卡曝光人数 | 辅助判断推荐吸引力 |
| 下游任务创建率 | 下游任务创建人数 / Image Enhancer 结果页曝光人数 | 实验主指标 |
| 目标页打开率 | 目标页打开人数 / 推荐点击人数 | 判断跳转链路是否顺畅 |
| 图片带入成功率 | 成功读取增强图人数 / 目标页打开人数 | 判断承接体验是否成立 |

### 2.3 保护指标

| 指标 | 要求 |
| --- | --- |
| Image Enhancer 下载率 | 不能下降 |
| Image Enhancer 结果页流失率 | 不能上升 |
| 目标页返回率 | 不能异常升高 |
| 推荐模块加载失败率 | 需可监控、可降级 |

---

## 3. 功能方案

用户上传图片后，系统并行执行两项任务：

1. 图片高清增强任务。
2. 图片意图分析任务。

页面展示增强进度，同时补充 AI 分析状态提示，例如：

```text
高清增强中
正在识别图片内容和创作方向
```

增强完成后，在结果页展示 2 个推荐卡片。推荐内容基于图片分析结果和后台配置生成。

每个推荐卡包含：

- 素材图或视频。
- 场景标签。
- 卡片标题。
- 说明文案。
- 按钮文案。
- 目标路由。

用户点击任一推荐后，跳转至对应目标页，并自动完成以下动作：

1. 带入增强后的图片。
2. 预填对应分类、参数或默认内容。
3. 用户无需重新上传。

如果图片意图分析失败、超时或置信度不足，则降级展示通用推荐内容。

---

## 4. 用户流程

```text
用户上传图片
-> 图片高清增强开始
-> Agent 图片意图分析开始
-> 处理中展示 AI 分析状态
-> 高清增强完成
-> 判断 Agent 是否已返回
-> 返回且置信度达标：读取 intent_key 对应推荐配置
-> 未返回 / 失败 / 低置信度：读取 generic_fallback 默认推荐
-> 结果页展示 2 个推荐卡
-> 用户点击推荐
-> 保存图片 handoff 数据
-> 跳转目标页
-> 目标页自动带入图片并预填分类 / 参数
-> 用户创建下游任务
```

---

## 5. MVP 范围

### 5.1 支持的意图类型

| intent_key | 意图名称 | 适用图片 | 用户后续意图 |
| --- | --- | --- | --- |
| `portrait_headshot` | 人像头像 | 单人头像、自拍、证件照、职业照、简历照、社交头像、近景人像、半身人像 | 让人物更清晰，更适合头像、职业展示、社交资料或数字人生成 |
| `life_event_photo` | 生活纪念照 | 婚礼、生日、亲子、旅行、聚会、毕业、节日、家庭合影、朋友合照、活动照片、老照片修复 | 保留回忆、修清晰、去路人/杂物、分享或制作纪念内容 |
| `product_ecommerce` | 商品电商图 | 商品图、白底商品图、商品特写、菜单、海报、品牌图、logo、包装图、美妆、服饰、3C、食品、饮料、店铺营销素材 | 让商品更适合上架、发布、转发、生成营销图或商品视频 |
| `document_readability` | 文档可读性 | 文档、截图、票据、收据、银行截图、付款凭证、手写笔记、表格、证据截图、文字图片 | 看清文字、保留证据、归档、转发、OCR 或重新整理图片内容 |
| `listing_space_vehicle` | 房产空间车辆 | 房产、室内空间、卧室、客厅、浴室、户型图、建筑外观、车辆、汽车内饰、车辆展示图 | 让租售、装修、民宿、车辆转卖素材更清晰可信 |
| `anime_game_fanart` | 动漫游戏二创 | 二次元角色、动漫截图、游戏截图、插画、表情包、贴纸、3D 模型、粉丝图、同人图、装饰图案 | 修清晰后继续头像、壁纸、贴纸、分享、打印或二创 |
| `generic_fallback` | 通用兜底 | 无法明确判断、图片内容混杂、置信度不足、无法归入以上任一类型 | 通用图片增强或继续编辑 |

### 5.2 首期推荐目标

首期每个意图固定展示 2 个推荐位，推荐内容由后台配置控制。

| intent_key | 主推荐 | 次推荐 |
| --- | --- | --- |
| `portrait_headshot` | AI Filter / AI Headshot 方向 | AI Video / Avatar 或 Effect 模板 |
| `life_event_photo` | AI Editor / 去路人去杂物方向 | AI Video / 回忆纪念模板 |
| `product_ecommerce` | UGC Video Generator | AI Video / Ecommerce 模板 |
| `document_readability` | AI Editor / OCR 或清晰阅读方向 | 图片编辑 / 裁剪整理方向 |
| `listing_space_vehicle` | AI Video / Listing 或展示模板 | AI Editor / 背景优化方向 |
| `anime_game_fanart` | AI Filter / 风格化方向 | AI Video / Effect 模板 |
| `generic_fallback` | AI Filter | AI Video / Featured 模板 |

具体工具名称、卡片文案、素材和路由以后台配置为准。

### 5.3 本期不做

- 不展示 3 个以上推荐。
- 不做复杂个性化排序。
- 不做多图综合意图识别。
- 不做用户长期画像建模。
- 不让 Agent 直接生成推荐卡文案。
- 不让 Agent 直接决定目标路由。
- 不做下载前强制弹窗打断。

---

## 6. 页面交互

### 6.1 处理中

右侧处理区域展示主任务和分析状态：

```text
高清增强中
正在识别图片内容和创作方向
```

规则：

- Agent 分析不阻塞高清增强。
- Agent 分析失败时，结果页使用 `generic_fallback` 推荐。
- 用户不需要主动操作。
- 不展示复杂技术状态，避免增加理解成本。

### 6.2 结果页推荐模块

结果页右侧展示推荐区：

```text
这张图还可以这样用
[推荐卡 1] [推荐卡 2]
```

推荐卡规则：

- 两张卡同规格、同权重。
- 每张卡包含：素材图/视频、标签、标题、说明文案、按钮。
- 推荐区不能挤压“继续上传”和“下载全部”按钮。
- 用户可以忽略推荐，继续下载。
- 推荐模块不使用强弹窗，不阻断主链路。

### 6.3 下载后推荐弹窗

下载后推荐弹窗作为 A/B Test 方案，不作为默认方案。

```text
图片已下载，还可以继续创作
[查看推荐] [关闭]
```

规则：

- 只在首次下载后出现。
- 用户已点击推荐则不出现。
- 用户关闭后本次任务不再出现。
- 弹窗推荐内容与结果页推荐卡保持一致。
- 弹窗不能阻塞下载动作，必须在下载触发后展示。

---

## 7. 意图识别方案

### 7.1 职责边界

Agent 只负责识别图片意图，返回唯一 `intent_key`、置信度和简短理由。

Agent 不负责：

- 生成营销文案。
- 推荐具体工具。
- 决定目标路由。
- 决定卡片素材。

推荐工具、推荐卡片、路由参数全部由后台配置决定。

这样做的原因：

1. 推荐卡文案可运营配置。
2. 路由和参数可随产品能力调整。
3. 避免 Agent 输出不稳定影响前端展示。
4. 方便做 A/B Test 和推荐位下线。

### 7.2 Agent 系统提示词

```text
你是 PhotoGrid Image Enhancer 的图片内容意图识别 Agent。

你的任务是根据用户上传的图片内容，判断用户最可能的后续创作意图，并匹配一个唯一的 Agent 意图 key。你只负责识别和分类，不要生成营销文案，不要推荐工具，不要解释过程。

可选意图 key 只能从以下列表中选择：

1. portrait_headshot
适用：单人头像、自拍、证件照、职业照、简历照、社交头像、近景人像、半身人像。
用户意图：让人物更清晰、更适合头像、职业展示、社交资料或数字人生成。

2. life_event_photo
适用：婚礼、生日、亲子、旅行、聚会、毕业、节日、家庭合影、朋友合照、活动照片、老照片修复。
用户意图：保留回忆、修清晰、去路人/杂物、用于分享或制作纪念内容。

3. product_ecommerce
适用：商品图、白底商品图、商品特写、菜单、海报、品牌图、logo、包装图、美妆、服饰、3C、食品、饮料、店铺营销素材。
用户意图：让商品更清晰、更适合上架、发布、转发、生成营销图或商品视频。

4. document_readability
适用：文档、截图、票据、收据、银行截图、付款凭证、手写笔记、表格、证据截图、文字图片。
用户意图：看清文字、保留证据、归档、转发、OCR 或重新整理图片内容。

5. listing_space_vehicle
适用：房产、室内空间、卧室、客厅、浴室、户型图、建筑外观、车辆、汽车内饰、车辆展示图。
用户意图：让租售、装修、民宿、车辆转卖素材更清晰可信，用于列表页、社媒或客户沟通。

6. anime_game_fanart
适用：二次元角色、动漫截图、游戏截图、插画、表情包、贴纸、3D 模型、粉丝图、同人图、装饰图案。
用户意图：修清晰后继续头像、壁纸、贴纸、分享、打印或二创。

7. generic_fallback
适用：无法明确判断、图片内容混杂、置信度不足、无法归入以上任一类型。
用户意图：通用图片增强或继续编辑。

判断规则：
- 如果图片中有明确商品主体，并且看起来像售卖、展示、上架或营销素材，优先判断为 product_ecommerce。
- 如果图片主要是单人头像、自拍、职业形象，优先判断为 portrait_headshot。
- 如果图片是多人、家庭、活动、旅行或纪念场景，优先判断为 life_event_photo。
- 如果图片中文字、截图、票据、表格是主要信息，优先判断为 document_readability。
- 如果图片主体是房间、建筑、户型、汽车或车辆内饰，优先判断为 listing_space_vehicle。
- 如果图片是动漫、游戏、插画、表情包、贴纸或二次元内容，优先判断为 anime_game_fanart。
- 如果多个类型同时存在，选择用户最可能继续创作或变现的主要意图。
- 如果置信度低于 0.6，使用 generic_fallback。

输出要求：
只输出 JSON，不要输出 Markdown，不要输出解释。

JSON 格式：
{
  "intent_key": "product_ecommerce",
  "confidence": 0.86,
  "reason": "图片主体是商品展示图，适合继续生成电商营销素材"
}

字段要求：
- intent_key：必须是 7 个可选 key 之一。
- confidence：0 到 1 的数字，保留两位小数。
- reason：一句简短中文理由，不超过 30 个字。
```

### 7.3 意图识别接口

```text
POST /api/recommendation/intent
```

请求：

```json
{
  "asset_id": "string",
  "image_url": "string",
  "file_name": "string",
  "width": 1080,
  "height": 1080
}
```

返回：

```json
{
  "intent_key": "product_ecommerce",
  "confidence": 0.86,
  "reason": "图片主体是商品展示图",
  "duration_ms": 11400,
  "usage": {
    "total_tokens": 2495,
    "input_tokens": 1877,
    "output_tokens": 52,
    "reasoning_tokens": 566,
    "cost_usd": 0.01117
  }
}
```

### 7.4 识别超时与降级

识别任务不允许阻塞高清结果展示。

推荐展示规则：

1. Agent 准时返回且置信度达标：展示对应 `intent_key` 推荐。
2. Agent 未返回：展示默认推荐。
3. Agent 失败：展示 `generic_fallback` 推荐。
4. Agent 置信度 `< 0.6`：展示 `generic_fallback` 推荐。
5. 当前用户不在 Agent 实验组：展示默认推荐，不调用 Agent。

建议超时配置：

| 配置项 | 建议值 | 说明 |
| --- | --- | --- |
| 前端推荐等待上限 | 3s | 高清结果页最多等待推荐配置 3s |
| 后端 Agent 最长等待 | 15s | 超过后记录 timeout |
| 低置信度阈值 | 0.6 | 低于该值使用 `generic_fallback` |

如果高清增强已完成但 Agent 未返回，结果页立即展示默认推荐。Agent 后续返回只记录识别结果和埋点，不强制刷新用户已看到的推荐，避免页面跳动。

---

## 8. 默认推荐逻辑

默认推荐用于以下场景：

1. Agent 未返回。
2. Agent 调用失败。
3. Agent 识别置信度 `< 0.6`。
4. 当前用户不在 Agent 实验组。
5. 成本控制策略要求不调用 Agent。

默认推荐不依赖 LLM，直接由后台配置返回。

首期默认推荐建议：

| 场景 | 推荐 1 | 推荐 2 |
| --- | --- | --- |
| `generic_fallback` | AI Filter | AI Video / Featured 模板 |

P1 可增加轻量规则，在不调用 LLM 的情况下做弱分流：

- 文件名或来源上下文明显包含商品信息时，优先使用 `product_ecommerce` 默认推荐。
- 图片宽高和内容特征明显接近证件照/头像时，优先使用 `portrait_headshot` 默认推荐。

轻量规则只作为优化项，不作为 MVP 强依赖。

---

## 9. 推荐卡片后台配置

后台新增「Image Enhancer 推荐配置」模块。

### 9.1 推荐系统提示词配置

支持配置 Agent 识别提示词。

调用 Agent 识别接口拿到 `intent_key` 后，再根据后台配置渲染对应推荐卡片。

### 9.2 意图类型配置

支持配置字段：

| 字段 | 说明 |
| --- | --- |
| `intent_key` | 意图唯一 key |
| `intent_name` | 意图名称 |
| `description` | 意图说明 |
| `recognition_rule` | 识别规则说明 |
| `confidence_threshold` | 置信度阈值，默认 0.6 |
| `enabled` | 启用状态 |
| `sort_order` | 排序 |

### 9.3 推荐工具配置

支持配置每个意图下的主推荐工具和次推荐工具。

| 字段 | 说明 |
| --- | --- |
| `intent_key` | 绑定意图 |
| `recommendation_rank` | 推荐位，1 / 2 |
| `target_tool` | 目标工具 |
| `target_route` | 目标路由 |
| `target_category` | 目标分类参数 |
| `target_params` | 其它预填参数 |
| `should_handoff_image` | 是否带入原图/增强图 |
| `enabled` | 启用状态 |

### 9.4 推荐卡片配置

支持配置字段：

| 字段 | 说明 |
| --- | --- |
| `card_title` | 卡片标题 |
| `button_text` | 按钮文案 |
| `description` | 说明文案 |
| `media_url` | 素材图/视频 |
| `media_type` | `image` / `video` |
| `tag_text` | 标签 |
| `enabled` | 启用状态 |

### 9.5 配置降级

- 某意图未配置推荐卡：使用 `generic_fallback` 配置。
- 某推荐位关闭：只展示剩余推荐位。
- 两个推荐位都不可用：隐藏推荐模块。
- 目标页不可用：后台下线对应推荐位或替换目标路由。

---

## 10. 目标页承接要求

这是本需求的强制要求。

点击推荐后，目标页必须做到：

1. 自动读取增强后的图片。
2. 自动带入图片到目标功能。
3. 自动预填对应分类或参数。
4. 不要求用户重新上传。
5. 读取成功后清理 handoff 数据。

### 10.1 路由与预填规则

| 推荐目标 | 路由示例 | 必须预填 |
| --- | --- | --- |
| AI Filter | `/editor?app=ai-filter&source=image-enhancer-reco&intent=portrait_headshot` | 打开 AI Filter，并把图片加入画布 |
| AI Video Effect | `/ai-video?category=featured&source=image-enhancer-reco&intent=anime_game_fanart` | 切到对应视频模板分类，带入参考图 |
| UGC Video Generator | `/ugc-video-generator?source=image-enhancer-reco&intent=product_ecommerce` | 带入商品图，预填商品图字段 |
| AI Video Ecommerce | `/ai-video?category=ecommerce&source=image-enhancer-reco&intent=product_ecommerce` | 切到 ecommerce 分类，带入参考图 |
| AI Editor | `/editor?source=image-enhancer-reco&intent=life_event_photo` | 把图片加入画布，预选对应编辑工具 |

### 10.2 Handoff 数据

推荐点击时保存：

```json
{
  "handoffId": "string",
  "imageUrl": "string",
  "enhancedImageUrl": "string",
  "assetId": "string",
  "intentKey": "product_ecommerce",
  "sourcePage": "image-enhancer",
  "target": "ugc-video-generator",
  "createdAt": 1780560000000
}
```

目标页读取后清理，避免影响下一次跳转。

### 10.3 Handoff 失败策略

- 目标页读取 handoff 成功：自动带图并记录成功埋点。
- 目标页读取 handoff 失败：展示普通目标页，并记录失败埋点。
- Handoff 数据过期：展示普通目标页，并提示用户可重新上传。

---

## 11. 用户分层与实验策略

### 11.1 推荐展示人群

本期推荐模块面向所有用户展示，不区分新用户、免费用户、会员用户。

但埋点必须带用户身份字段，用于后续分析不同人群的推荐效果：

- `user_type`：`guest` / `new_user` / `registered_user` / `subscriber`
- `membership_status`：`free` / `pro`
- `is_first_image_enhancer_task`：`true` / `false`

### 11.2 Agent 调用策略

MVP 实验期建议仅对实验组用户调用 Agent，Control 组不调用 Agent。

如果预算敏感，可先按小流量灰度：

| 灰度比例 | 每 10,000 次上传 Agent 成本估算 |
| --- | --- |
| 10% | 约 $9.41 |
| 20% | 约 $18.81 |
| 50% | 约 $47.03 |
| 100% | 约 $94.06 |

不调用 Agent 的用户展示 `generic_fallback` 默认推荐。

---

## 12. 成本与耗时评估

基于 6 条样本任务数据，Agent 单次识别成本和耗时如下：

### 12.1 样本均值

| 指标 | 均值 |
| --- | ---: |
| 总 token | 2,346 |
| 输入 token | 1,875 |
| 输出 token | 49 |
| reasoning token | 422 |
| 生成耗时 | 12.46s |
| 单次成本 | $0.00941 |

### 12.2 成本区间

| 口径 | 单次成本 | 每 1,000 次 | 每 10,000 次 | 每 100,000 次 |
| --- | ---: | ---: | ---: | ---: |
| 最低样本 | $0.00682 | $6.82 | $68.24 | $682.40 |
| 样本均值 | $0.00941 | $9.41 | $94.06 | $940.57 |
| P95 粗估 | $0.01228 | $12.28 | $122.77 | $1,227.70 |
| 最高样本 | $0.01265 | $12.65 | $126.46 | $1,264.60 |

### 12.3 结论

成本可接受，建议预算按 `$0.01 / 次` 估算。

但 Agent 延迟较高：

- 平均耗时：12.46s。
- 最高耗时：20.68s。
- 图片超分主任务约 7s。

因此 Agent 不适合作为结果页强依赖链路。本期推荐展示必须具备默认推荐和超时兜底，不允许等待 Agent 返回后才展示高清结果页。

---

## 13. A/B Test 方案

### 13.1 实验分组

| 组别 | 方案 | Agent 调用 |
| --- | --- | --- |
| Control | 无推荐 | 不调用 |
| A | 结果页直接展示推荐卡 | 调用 |
| B | 用户点击下载后展示推荐弹窗 | 调用 |

实验要回答的问题：

```text
推荐应该出现在结果页，还是出现在下载完成后？
哪个触点能带来更多下游任务创建，同时不影响 Image Enhancer 主任务完成？
```

### 13.2 实验口径

推荐使用用户分桶，而不是曝光分桶。

统一分母：

```text
完成增强并看到结果页的用户数
```

核心比较：

```text
下游任务创建用户数 / 完成增强并看到结果页的用户数
```

辅助比较：

```text
推荐点击用户数 / 推荐曝光用户数
目标页打开用户数 / 推荐点击用户数
图片带入成功用户数 / 目标页打开用户数
```

### 13.3 可能被 Challenge 的点

| Challenge | 原因 | 规避方式 |
| --- | --- | --- |
| A、B 曝光人群不一致 | A 面向结果页用户，B 只面向下载用户 | 主指标使用 `result_shown_user` 作为统一分母 |
| 只看 CTR 不公平 | B 组用户已点击下载，意图更强 | CTR 只做辅助指标，主看下游任务创建率 |
| B 组可能伤害下载体验 | 弹窗如果阻塞下载会被认为打扰 | 必须先触发下载，再展示弹窗 |
| A 组可能影响主任务 | 推荐卡可能挤压下载按钮 | 下载率作为保护指标，下降即判失败 |
| 没有 Control 无法判断增量 | A vs B 只能比较形式，不能证明推荐本身有效 | 保留 Control 组，至少小流量 |

### 13.4 成功标准

- A 或 B 相比 Control，下游任务创建率提升。
- 获胜组相比另一实验组，下游任务创建率更高。
- 目标页图片带入成功率稳定。
- Image Enhancer 下载率不下降。
- 结果页流失率不升高。

---

## 14. 埋点

### 14.1 事件

| 事件名 | 触发时机 |
| --- | --- |
| `image_enhancer_upload_started` | 用户上传图片 |
| `image_enhancer_process_started` | 开始高清增强 |
| `image_intent_detect_started` | Agent 开始分析 |
| `image_intent_detect_succeeded` | Agent 成功返回 |
| `image_intent_detect_failed` | Agent 分析失败 |
| `image_intent_detect_timeout` | Agent 分析超时 |
| `image_enhancer_result_shown` | 高清结果页展示 |
| `image_enhancer_reco_exposed` | 推荐卡曝光 |
| `image_enhancer_reco_clicked` | 推荐卡点击 |
| `image_enhancer_reco_modal_shown` | 下载后推荐弹窗展示 |
| `image_enhancer_reco_modal_closed` | 下载后推荐弹窗关闭 |
| `image_enhancer_handoff_saved` | 保存图片 handoff |
| `image_enhancer_reco_target_opened` | 目标页打开 |
| `image_enhancer_handoff_loaded` | 目标页成功读取 handoff |
| `image_enhancer_handoff_failed` | 目标页读取 handoff 失败 |
| `image_enhancer_downstream_task_created` | 下游功能创建任务 |
| `image_enhancer_download_clicked` | 用户点击下载 |

### 14.2 公共参数

| 参数 | 说明 |
| --- | --- |
| `intent_key` | 7 类意图 key |
| `confidence` | 意图识别置信度 |
| `recommendation_id` | 推荐卡 ID |
| `recommendation_rank` | 推荐位序号 |
| `target_page` | 目标页 |
| `source_page` | 固定为 `image-enhancer` |
| `asset_id` | 图片资源 ID |
| `handoff_id` | 跨页传图 ID |
| `experiment_group` | `control` / `result_card` / `download_modal` |
| `reco_surface` | `result_page` / `download_modal` |
| `fallback_reason` | `timeout` / `failed` / `low_confidence` / `not_in_agent_group` / `config_missing` |
| `user_type` | `guest` / `new_user` / `registered_user` / `subscriber` |
| `membership_status` | `free` / `pro` |
| `is_first_image_enhancer_task` | 是否首次使用 Image Enhancer |

### 14.3 成本与性能参数

| 参数 | 说明 |
| --- | --- |
| `task_id` | Agent 任务 ID |
| `detect_duration_ms` | 识别耗时 |
| `total_tokens` | 总 token |
| `input_tokens` | 输入 token |
| `output_tokens` | 输出 token |
| `reasoning_tokens` | reasoning token |
| `detect_cost_usd` | 单次识别成本 |

### 14.4 指标口径

推荐点击率：

```text
overall_ctr = 推荐卡点击人数 / 推荐卡曝光人数
card_ctr = 单卡片点击人数 / 单卡片曝光人数
intent_ctr = 某 intent_key 下推荐点击人数 / 某 intent_key 下推荐曝光人数
```

核心转化指标：

```text
下游任务创建率 = 下游任务创建人数 / Image Enhancer 结果页曝光人数
```

CTR 只能说明推荐被点了，不能证明导流链路有效。真正有效的是用户进入目标页后是否创建了 AI Filter、UGC Video、AI Video 等下游任务。

---

## 15. MVP 验收标准

- 上传图片后，处理中能看到 AI 分析状态。
- 高清结果展示不等待 Agent 强依赖返回。
- Agent 准时返回且置信度达标时，结果页展示对应 `intent_key` 的 2 个推荐卡。
- Agent 失败、超时、低置信度时，结果页展示 `generic_fallback` 默认推荐。
- 人像头像图可识别为 `portrait_headshot`。
- 商品图可识别为 `product_ecommerce`。
- 文档截图可识别为 `document_readability`。
- 动漫/游戏/插画可识别为 `anime_game_fanart`。
- 点击推荐后，目标页自动带入增强图。
- 目标页能自动进入对应分类或功能状态。
- Handoff 读取成功后清理数据。
- 下载能力不受影响。
- 推荐曝光、点击、目标页打开、handoff 成功、下游任务创建均有埋点。
- Agent 成本、耗时、token 用量可记录和统计。

---

## 16. 风险与应对

| 风险 | 影响 | 应对 |
| --- | --- | --- |
| Agent 识别太慢 | 推荐晚于高清结果，影响体验 | 结果页不等待 Agent，超时展示默认推荐 |
| Agent 识别不准 | 推荐不匹配，点击率低 | 低置信度走 fallback，后台可下线意图或调整提示词 |
| 推荐卡配置缺失 | 结果页展示异常 | 配置缺失时使用 `generic_fallback`，仍缺失则隐藏模块 |
| 目标页无法带图 | 用户觉得只是普通跳转 | handoff 成功率作为核心承接指标 |
| 推荐影响下载 | 主链路受损 | 下载率作为保护指标，异常则降级或下线推荐 |
| 成本随流量放大 | 预算不可控 | 实验组调用 Agent，非实验组走默认推荐 |

---

## 17. 最终结论

本期采用：

```text
Agent 意图识别
-> 后台配置推荐卡
-> 默认推荐兜底
-> 点击推荐后 handoff 带图
-> 目标页自动预填分类 / 参数
```

其中，Agent 只负责返回 `intent_key`，不负责生成推荐文案和目标路由。

基于当前样本数据，Agent 单次成本约 `$0.01`，成本可接受；但平均耗时约 `12.46s`，明显长于图片超分主任务，因此不应成为结果页强依赖。

本期推荐展示优先级：

1. Agent 准时返回且置信度达标：展示对应 `intent_key` 推荐。
2. Agent 超时、失败、低置信度：展示 `generic_fallback`。
3. 用户不在 Agent 实验组：展示默认推荐。

“目标页自动带图并预填分类/参数”是必须项。没有这一步，推荐只是普通跳转，不能有效完成从 Image Enhancer 到下游功能的转化。
