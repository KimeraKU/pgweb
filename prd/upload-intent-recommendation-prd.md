# 上传后意图识别推荐 PRD

> **文档版本**: V1.0  
> **创建日期**: 2026-05-11  
> **最后更新**: 2026-05-11  
> **产品名称**: Upload Intent Recommendation（上传后意图识别推荐）  
> **所属模块**: Image Enhancer 独立页面 `/image-enhancer`，后续可横向复用到其它上传入口  
> **参考**: [Image Enhancer PRD](./image-enhancer.md), [AI Filter PRD](./ai-filter.md), [AI Video PRD](./ai-video.md), [Aggregation Editor PRD](./aggregation-editor-prd.md)

---

## 1. 产品背景

### 1.1 问题定义

当前用户在 `/image-enhancer` 上传图片后的主链路只有“增强图片 -> 下载结果”。这条链路满足单点工具诉求，但没有把用户进一步引导到更高价值、与图片内容更匹配的创作场景。

例如：

- 用户上传日常自拍，本质诉求可能不是“只要变清晰”，而是“想变好看、想套滤镜、想做动态效果”。
- 用户上传商品图，本质诉求可能不是“只要变清晰”，而是“想做带动效的商品展示、想快速生成商品视频素材”。

如果我们能在上传后识别图片意图，并在主任务结果返回时同步推荐下一步工具页或模板页，就可以把单工具体验扩展成跨工具创作路径。

### 1.2 目标

- 在不打断 Image Enhancer 主链路的前提下，增加跨功能页导流。
- 让推荐结果更“像懂用户”，而不是无差别地展示工具入口。
- 验证“意图识别推荐”是否能提升 AI Filter、UGC Video、Video Template 等下游功能的进入率与任务创建率。

### 1.3 非目标

- 本期不做完整个性化推荐系统。
- 本期不做用户长期画像建模。
- 本期不做复杂多意图融合推荐。
- 本期不替代 Image Enhancer 的主功能，不改变“增强 -> 下载”的主任务完成路径。

---

## 2. 竞品分析

> 以下竞品结论基于 **2026-05-11** 查阅的官方公开页面；其中部分“策略推断”属于基于官方能力与页面结构的产品分析，不代表竞品明确公开了内部推荐逻辑。

### 2.1 Canva

#### 官方能力

- Canva 的 **Magic Design** 会根据用户提供的图片、文本或创意，推荐匹配主题和风格的设计模板。  
- Canva 也强调“上传你的媒体”后，可以直接进入编辑与模板化创作流程。

#### 产品启发

- **强项**：上传内容不是终点，而是模板推荐的起点。
- **启发**：最接近本需求的不是“AI 修图”，而是“基于上传内容推荐下一步创作类型”。
- **不足**：从公开信息看，Canva 更偏“设计模板推荐”，不是“识别自拍/商品后跳到特定工具页”的显式路由。

#### 对我们可借鉴点

- 推荐结果应带“与当前图片匹配”的语义，而不是裸工具列表。
- 推荐页最好直接落到“带分类/带模板上下文”的目标页，而不是泛入口。

### 2.2 Adobe Express

#### 官方能力

- Adobe Express 首页强调 **Start from your media**、**Start from templates**。
- 其图片编辑页在上传后，会继续引导用户做图片编辑、动画化和模板化创作。

#### 产品启发

- **强项**：上传媒体后可衔接“编辑”“动画”“模板”多个后续动作。
- **启发**：推荐不一定只是一张卡片，可以是“编辑类”与“创作类”两个方向并存。
- **不足**：从公开页面看，Adobe Express 更偏通用工作台，不强调强意图识别后的定向路由。

#### 对我们可借鉴点

- 推荐目标应覆盖“继续修图”和“去做成内容”两种路径。
- 推荐出现时机应放在用户主任务完成节点，而不是上传前打断。

### 2.3 Picsart

#### 官方能力

- Picsart 的 Photo Effects / AI Filters 都以“上传图片 -> 选择效果/滤镜”为主要流程。
- 其官方页面还会在同一工作流中展示相邻 AI 工具，如 AI video filters、AI enhance、AI background 等。

#### 产品启发

- **强项**：同一张图可以自然串联多个创作工具。
- **启发**：对于“自拍/日常照”这类素材，AI Filter 是非常自然的下一步，而不是额外教育成本很高的推荐。
- **不足**：公开页面更偏工具发现，不强调推荐理由或内容意图解释。

#### 对我们可借鉴点

- 自拍、人像场景推荐 AI Filter 是高自然度路径。
- 推荐模块要尽量轻，不要把结果页做成“第二个工具市场”。

### 2.4 CapCut

#### 官方能力

- CapCut 官方有 **Image to Video AI Generator**，强调把上传图片快速转为动态视频。
- 也有 **Image to Video Conversion Templates** 这类模板页，把图片转视频作为模板化创作入口。

#### 产品启发

- **强项**：上传图片到视频/模板的转化链路非常清晰。
- **启发**：对“自拍、人像、生活照”这类素材，推荐去带 effect / 模板的动态内容页具备合理性。
- **不足**：公开页面侧重“图转视频”单能力，不体现复杂的多目标推荐排序。

#### 对我们可借鉴点

- 可把“Video Template effect 分类”定义为自拍视频/动态特效的自然后续路径。
- 目标页必须带分类上下文，否则推荐点击后用户会掉进大而空的模板广场。

### 2.5 Photoroom

#### 官方能力

- Photoroom 官方明确把 **商品图 -> 商品视频** 作为核心链路。
- 其 Video Generator、Product Staging 都围绕商品图、电商素材、销售转化场景组织。

#### 产品启发

- **强项**：对商品图使用强垂类推荐，而不是给所有图一个通用视频入口。
- **启发**：商品图推荐 UGC Video 或电商模板页，是高价值且低歧义的方向。
- **不足**：偏电商垂类，不适合直接套到所有图片类型。

#### 对我们可借鉴点

- 商品图意图要单独建类，不能与普通生活照混在一起。
- 商品图推荐应优先落到“电商”上下文，而不是泛视频生成页。

### 2.6 竞品结论

综合来看，竞品普遍验证了三件事：

- **上传媒体是强入口**：用户上传内容后，最容易接受“下一步做什么”的引导。
- **推荐应绑定场景，不应只推工具名**：商品图去电商视频，人像去滤镜/特效，匹配感更强。
- **主链路不能被打断**：推荐应在结果页出现，作为“下一步建议”，而不是上传后立刻弹窗强打断。

对本项目最重要的结论是：

- **自拍/人像 -> AI Filter + Video Template Effect**
- **商品图 -> UGC Video + Video Template Ecommerce**

这两条是最值得先做的 MVP 路径。

---

## 3. 当前项目约束（基于现有代码）

截至 **2026-05-11**，仓库内已存在的相关目标页/模块为：

- Image Enhancer：独立页 `/image-enhancer`
- AI Video：独立页 `/ai-video`
- UGC Video Generator：独立页 `/ugc-video-generator`
- AI Filter：当前存在于 `/editor` 内部的动态 App Tab，**不是独立页面**

同时，代码中已确认：

- `/ai-video` 当前已有模板分类类型：`all` / `featured` / `ecommerce` / `drama` / `camera`
- “AI Filter” 已有 App Tab 结构和 PRD，但缺少独立深链入口
- “Video Template 的 effect 分类页” 在当前代码里**尚未看到现成独立页路由**，需要后续定义承接方式

因此本 PRD 中的推荐目标分两类：

### 3.1 已有可直接落地目标

- `UGC Video Generator`：`/ugc-video-generator`
- `AI Video - ecommerce 分类`：建议扩展为 `/ai-video?category=ecommerce`

### 3.2 需要补深链或新增承接目标

- `AI Filter`：建议扩展为 `/editor?app=ai-filter`
- `Video Template - effect 分类页`：建议统一到视频模板承接页，例如：
  - `/ai-video?category=effect`
  - 或未来独立页 `/video-template?category=effect`

---

## 4. 产品方案概述

### 4.1 核心定义

用户在 Image Enhancer 上传图片后，系统并行执行两件事：

1. 图片增强主任务  
2. 图片意图识别任务

当增强结果返回时，若意图识别结果也已返回，则在结果页同步展示“猜你接下来要做”的推荐模块。

### 4.2 产品原则

- **不打断主任务**：推荐不影响图片增强结果展示与下载。
- **推荐要可解释**：告诉用户为什么推荐这个工具/分类。
- **优先导向具体场景页**：尽量跳转到分类页或带上下文的工具页，而不是泛首页。
- **少而准**：首期只展示 2 个推荐，不做更多。

### 4.3 推荐位置

推荐模块建议出现在 Image Enhancer 上传结果页右侧区域的下载区上方或下载区下方，作为一个独立模块：

- 主推荐 1：更强主 CTA
- 次推荐 1：次级 CTA

示意结构：

```text
右侧结果区
├── 参数区 / 通用设置
├── 推荐模块：猜你接下来要做
│   ├── 主推荐卡
│   └── 次推荐卡
├── 继续上传
└── 下载全部
```

---

## 5. MVP 范围

### 5.1 首期支持的意图类型

本期仅支持 3 类：

1. **portrait_selfie**
   - 自拍、单人日常照、近景人像、生活方式自拍
2. **product_ecommerce**
   - 商品图、白底商品图、平铺商品图、产品特写、美妆/服饰/3C/食品商品图
3. **generic_fallback**
   - 无法高置信度识别时的兜底类型

### 5.2 首期推荐目标

#### portrait_selfie

- 主推荐：AI Filter
- 次推荐：Video Template - effect 分类

#### product_ecommerce

- 主推荐：UGC Video Generator
- 次推荐：AI Video - ecommerce 分类

#### generic_fallback

- 主推荐：AI Filter
- 次推荐：AI Video - featured 分类

### 5.3 本期不支持

- 多图意图融合识别
- 用户历史偏好排序
- 超过 2 个推荐位
- 推荐结果个性化文案动态生成

---

## 6. 功能需求详述

### 6.1 触发时机

- 用户在 `/image-enhancer` 页面通过上传入口选择本地图片后，立即触发意图识别任务。
- 意图识别与图片增强并行执行。
- 仅在增强结果页展示推荐模块。

### 6.2 输入

- 图片文件本身
- 可选辅助信息（如文件名、分辨率、宽高比）

### 6.3 意图识别输出结构

建议后端返回结构：

```json
{
  "intent_type": "portrait_selfie",
  "confidence": 0.91,
  "attributes": {
    "has_person": true,
    "person_count": 1,
    "is_close_up": true,
    "is_product_like": false,
    "background_type": "indoor"
  },
  "recommendations": [
    {
      "target_type": "tool",
      "target_id": "ai-filter",
      "target_route": "/editor?app=ai-filter",
      "reason_code": "portrait_style_enhancement"
    },
    {
      "target_type": "template_category",
      "target_id": "video-template-effect",
      "target_route": "/ai-video?category=effect",
      "reason_code": "portrait_motion_effect"
    }
  ]
}
```

### 6.4 推荐生成策略

本期建议采用 **模型识别 + 规则映射** 的混合方案。

#### 第 1 层：模型识别

模型只负责判断：

- 这是不是自拍/人像
- 这是不是商品图
- 置信度高不高

#### 第 2 层：规则映射

根据意图类型映射推荐目标：

- `portrait_selfie` -> `ai-filter` + `video-template-effect`
- `product_ecommerce` -> `ugc-video-generator` + `ai-video-ecommerce`
- 其他 -> fallback

#### 第 3 层：页面可用性检查

如果某目标页当前不可用，则自动降级：

- `video-template-effect` 不可用 -> 改推 `ai-video?category=featured`
- `ai-filter` 深链未实现 -> 改推 `/editor`

### 6.5 展示规则

- 推荐模块只在 `workStage === result` 时出现。
- 若识别结果超时或失败：
  - 不阻塞结果页；
  - 显示 fallback 推荐，或不展示推荐模块。
- 推荐卡最多 2 张。
- 推荐卡需要带“推荐理由”。

建议文案示例：

- 自拍图：
  - `这张图更适合做风格滤镜`
  - `试试把自拍做成动态特效视频`
- 商品图：
  - `这张图适合直接做商品展示视频`
  - `试试电商模板，快速生成卖点视频`

### 6.6 推荐卡信息结构

每张卡片需包含：

- 标题：目标工具或分类名
- 副标题：推荐理由
- 标签：如 `AI Filter` / `Effect` / `Ecommerce`
- CTA：`去试试`

### 6.7 点击行为

#### 6.7.1 AI Filter

建议目标：

- `/editor?app=ai-filter&source=image-enhancer-reco&intent=portrait_selfie&asset_id={id}`

行为：

- 打开 Editor
- 默认展开 AI Filter App Tab
- 尝试自动带入当前图片资产

#### 6.7.2 Video Template - effect 分类

建议目标：

- `/ai-video?category=effect&source=image-enhancer-reco&intent=portrait_selfie&asset_id={id}`

行为：

- 进入视频模板/AI Video 承接页
- 默认定位到 effect 分类
- 尝试保留当前图片作为参考图输入

#### 6.7.3 UGC Video Generator

建议目标：

- `/ugc-video-generator?source=image-enhancer-reco&intent=product_ecommerce&asset_id={id}`

行为：

- 进入 UGC 视频页
- 尝试带入当前图片作为封面或素材输入

#### 6.7.4 AI Video - ecommerce 分类

建议目标：

- `/ai-video?category=ecommerce&source=image-enhancer-reco&intent=product_ecommerce&asset_id={id}`

行为：

- 默认切到 ecommerce 分类
- 优先展示电商渲染模板

### 6.8 推荐模块关闭策略

本期建议不做显式关闭按钮，避免增加额外交互复杂度。  
用户不点击即可忽略。

后续如曝光过高、点击过低，可增加：

- `不感兴趣`
- `少推荐这一类`

---

## 7. 交互与文案

### 7.1 结果页信息层级

结果页右侧建议顺序：

1. 参数区 / 通用设置
2. 推荐模块：`猜你接下来要做`
3. 继续上传
4. 下载全部

### 7.2 推荐模块标题

候选：

- `猜你接下来要做`
- `基于这张图，推荐你继续创作`
- `这张图还可以这样用`

建议首期使用：

- **这张图还可以这样用**

### 7.3 卡片文案示例

#### 自拍 / 人像

- 卡片 1
  - 标题：`去 AI Filter`
  - 描述：`这张自拍更适合继续做滤镜风格化`
- 卡片 2
  - 标题：`试试视频特效模板`
  - 描述：`把静态自拍快速做成动态效果`

#### 商品图

- 卡片 1
  - 标题：`去 UGC Video`
  - 描述：`这张商品图适合直接生成带讲解感的视频素材`
- 卡片 2
  - 标题：`试试电商模板`
  - 描述：`快速套用商品展示视频模板`

---

## 8. 数据与埋点

### 8.1 关键埋点

- `intent_detect_started`
- `intent_detect_succeeded`
- `intent_detect_failed`
- `intent_reco_exposed`
- `intent_reco_clicked`
- `intent_reco_target_opened`
- `intent_reco_downstream_task_created`

### 8.2 埋点字段建议

- `source_page`
- `asset_id`
- `intent_type`
- `confidence`
- `reco_slot`
- `target_id`
- `target_route`
- `click_position`

### 8.3 核心指标

#### 北极星指标

- 推荐带来的下游任务创建率 uplift

#### 一级指标

- 推荐曝光率
- 推荐 CTR
- 推荐后目标页打开率
- 推荐后 24h 内下游任务创建率

#### 二级指标

- Image Enhancer 主任务完成率变化
- 下载率变化
- 推荐后页面停留时长

---

## 9. 算法与服务要求

### 9.1 延迟要求

- 意图识别结果应尽量在主任务结果返回前完成。
- 建议目标：
  - P50 < 800ms
  - P95 < 2000ms

### 9.2 失败兜底

- 模型失败：走 fallback 推荐
- 低置信度：走 generic_fallback
- 目标页不可用：替换为备用目标

### 9.3 隐私与合规

- 本期仅使用用户当前上传图片做即时识别。
- 不基于用户人脸身份做个体画像。
- 不在推荐文案中出现敏感判断，如年龄、性别、种族等。

---

## 10. 技术实现建议

### 10.1 推荐链路建议

```text
用户上传图片
  -> Image Enhancer 上传逻辑
  -> 并行调用 Intent Detect API
  -> 主结果返回
  -> 若 intent detect 已返回，则渲染推荐模块
  -> 用户点击推荐
  -> 跳转目标页并携带 asset_id / source / intent
```

### 10.2 前端状态建议

在 `/image-enhancer` 结果页新增：

- `intentRecoStatus`: `idle | loading | ready | failed`
- `intentRecoResult`

### 10.3 资产传递建议

不建议只传图片 URL，建议统一传：

- `asset_id`
- `source=image-enhancer-reco`
- `intent_type`

目标页自行根据 `asset_id` 拉取或复用素材。

### 10.4 现阶段实现优先级

#### P0

- 上传后并行识别
- 结果页展示 2 个推荐位
- 自拍 / 商品图 / fallback 三类规则
- AI Video ecommerce 深链
- UGC Video 深链

#### P1

- AI Filter 深链自动带图
- Video Template effect 分类承接页
- 推荐理由更精细化

#### P2

- 个性化排序
- 用户反馈闭环
- 更多意图类别

---

## 11. 风险与注意事项

### 11.1 推荐不准

风险：

- 自拍被识别成普通生活照
- 商品图被识别成静物图

应对：

- 首期只做两类高价值高置信意图
- 低置信度走 fallback

### 11.2 目标页承接断层

风险：

- 推荐点进去后看不到相关模板或图片没带过去，用户会觉得“被骗点击”

应对：

- 推荐必须尽量落到分类页
- 带上 `asset_id`
- 对不可承接目标做降级

### 11.3 推荐过重影响主任务

风险：

- 结果页信息过载

应对：

- 只放 2 个推荐位
- 视觉层级低于“下载全部”
- 不弹窗、不强打断

---

## 12. 开放问题

1. `AI Filter` 是否要在本期补成可深链打开的独立承接能力？
2. `Video Template - effect 分类页` 最终挂在 `/ai-video` 还是独立新页？
3. 推荐点击后，目标页是否必须自动带图，还是允许只跳转分类？
4. 商品图去 `UGC Video` 与去 `AI Video ecommerce` 的主次排序是否需要做 AB Test？
5. 是否需要给推荐模块增加“为什么推荐给我”的 tooltip？

---

## 13. 结论建议

如果你要快速推进这一轮需求，我建议按下面顺序做：

### 阶段一：验证价值

- 先在 Image Enhancer 结果页加推荐模块
- 只做两类识别：`portrait_selfie` / `product_ecommerce`
- 只接两个已可快速承接的目标：
  - `UGC Video`
  - `AI Video ecommerce`

### 阶段二：补强体验

- 补 `AI Filter` 深链
- 补 `Video Template effect` 分类承接页
- 增加推荐理由文案

### 阶段三：做成平台能力

- 把同一套意图识别推荐能力复用到 Background Remover、AI Filter 上传区、UGC Video 上传区

---

## 14. 信息来源（官方公开页面）

- Canva Magic Design 帮助页：<https://www.canva.com/pt_br/help/use-magic-design/>
- Canva 新闻稿（Magic Design / 上传媒体生成设计）：<https://www.canva.com/newsroom/news/supercharging-the-visual-suite/>
- Canva 图片上传页：<https://www.canva.com/features/image-upload/>
- Adobe Express 首页：<https://www.adobe.com/express>
- Adobe Express 图片编辑页：<https://www.adobe.com/express/feature/image/editor>
- Picsart AI Filters：<https://picsart.com/ai-filters/>
- Picsart Photo Effects：<https://picsart.com/photo-effects>
- CapCut Image to Video AI：<https://www.capcut.com/tools/ai-image-to-video>
- CapCut Image to Video Templates：<https://www.capcut.com/explore/image-to-video-conversion>
- Photoroom AI Video Generator：<https://www.photoroom.com/tools/video-generator>
- Photoroom Product Staging（iOS 帮助文档）：<https://help.photoroom.com/en/articles/13160304-show-a-product-in-a-realistic-scene-with-product-staging-ios>

---

## 15. 变更记录

### V1.0（2026-05-11）

- 初版文档创建
- 完成竞品分析
- 定义 MVP 意图类型、推荐规则、页面目标、埋点与技术约束
