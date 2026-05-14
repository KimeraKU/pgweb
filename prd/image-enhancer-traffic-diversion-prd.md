# Image Enhancer 流量分流 PRD

> 版本：V1.0  
> 日期：2026-05-11  
> 页面：`/image-enhancer`  
> 目标：将画质增强的高流量转化到 AI Filter、AI Video、UGC Video、视频模板等下游功能

---

## 1. 为什么做

Image Enhancer 是高流量、低门槛工具页。当前用户完成“上传 -> 高清增强 -> 下载”后，链路基本结束，无法把增强后的图片继续引导到更高价值的创作功能。

本需求要解决的问题是：

- 用户不知道增强后的图片还能继续做什么。
- 产品没有把高流量工具页转化为下游功能入口。
- 下游功能如果只是普通跳转，用户还要重新上传图片，转化成本高。

核心判断：

用户刚拿到高清图时，是最适合推荐下一步创作的时机。推荐必须基于图片内容，并且点击后自动带入图片和预填参数，否则只是广告位。

---

## 2. 做什么

用户上传图片后，系统并行执行两件事：

1. 画质增强任务。
2. PG Agent 图片意图分析。

增强完成后，结果页自动展示 2 个下一步推荐卡。用户点击任一推荐后，目标页必须自动带入增强后的图片，并预填对应分类、参数或默认内容。

---

## 3. MVP 范围

### 3.1 支持的意图类型

| 意图 | 说明 |
| --- | --- |
| `portrait_selfie` | 自拍、单人人像、生活照、近景头像 |
| `product_ecommerce` | 商品图、白底图、产品特写、电商素材 |
| `generic_fallback` | 无法高置信识别时的兜底类型 |

### 3.2 推荐目标

| 意图 | 推荐 1 | 推荐 2 |
| --- | --- | --- |
| `portrait_selfie` | AI Filter | AI Video / Effect 模板 |
| `product_ecommerce` | UGC Video Generator | AI Video / Ecommerce 模板 |
| `generic_fallback` | AI Filter | AI Video / Featured 模板 |

### 3.3 不做

- 不做 3 个以上推荐。
- 不做一大一小主次卡片。
- 不做下载前强制弹窗打断；下载后弹窗仅作为 A/B Test 方案。
- 不做历史个性化排序。
- 不做批量图片综合推荐。

---

## 4. 用户流程

```text
用户上传图片
-> 画质增强开始
-> PG Agent 同步分析图片意图
-> 处理中展示 Agent 分析状态
-> 高清结果完成
-> 根据实验组展示推荐卡或下载后推荐弹窗
-> 用户点击推荐
-> 保存图片 handoff 数据
-> 跳转目标页
-> 目标页自动带入图片并预填分类/参数
-> 用户创建下游任务
```

---

## 5. 页面交互

### 5.1 处理中

右侧展示：

```text
画质增强中...
PG Agent 智能分析已启动
正在识别图片内容和创作意图
```

规则：

- Agent 分析不阻塞高清增强。
- Agent 失败时，结果页使用 `generic_fallback` 推荐。
- 用户不需要主动操作。

### 5.2 结果页

结果页右侧展示推荐区：

```text
PG Agent 推荐
[推荐卡 1] [推荐卡 2]
```

推荐卡规则：

- 两张卡同规格、同权重。
- 每张卡包含：缩略图、功能标签、动作标题、短 CTA。
- 推荐区不能挤压“继续上传”和“下载全部”按钮。
- 用户可以忽略推荐，继续下载。

### 5.3 下载后推荐弹窗

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

## 6. 目标页承接要求

这是本需求的强制要求。

点击推荐后，目标页必须做到：

1. 自动读取增强后的图片。
2. 自动带入图片到目标功能。
3. 自动预填对应分类或参数。
4. 不要求用户重新上传。
5. 读取成功后清理 handoff 数据。

### 6.1 路由与预填规则

| 推荐目标 | 路由 | 必须预填 |
| --- | --- | --- |
| AI Filter | `/editor?app=ai-filter&source=image-enhancer-reco&intent=portrait_selfie` | 打开 AI Filter，并把图片加入画布 |
| AI Video Effect | `/ai-video?category=featured&source=image-enhancer-reco&intent=portrait_selfie` | 切到对应视频模板分类，带入参考图 |
| UGC Video Generator | `/ugc-video-generator?source=image-enhancer-reco&intent=product_ecommerce` | 带入商品图，预填商品图字段 |
| AI Video Ecommerce | `/ai-video?category=ecommerce&source=image-enhancer-reco&intent=product_ecommerce` | 切到 ecommerce 分类，带入参考图 |

### 6.2 Handoff 数据

推荐点击时保存：

```json
{
  "imageUrl": "string",
  "intentType": "portrait_selfie",
  "sourcePage": "image-enhancer",
  "target": "ai-filter",
  "createdAt": 1778460000000
}
```

目标页读取后清理，避免影响下一次跳转。

---

## 7. 技术方案

### 7.1 意图识别接口

```text
POST /api/recommendation/intent
```

请求：

```json
{
  "asset_id": "string",
  "image_url": "string",
  "file_name": "string"
}
```

返回：

```json
{
  "intent_type": "portrait_selfie",
  "confidence": 0.86,
  "recommendations": [
    {
      "id": "ai-filter",
      "title": "用滤镜重塑这张人像",
      "target": "editor_ai_filter",
      "href": "/editor?app=ai-filter&source=image-enhancer-reco&intent=portrait_selfie"
    }
  ]
}
```

### 7.2 降级规则

- 接口失败：使用 `generic_fallback`。
- 低置信度：使用 `generic_fallback`。
- 目标页 handoff 读取失败：展示普通目标页，但记录失败埋点。

---

## 8. 如何验证

### 8.1 MVP 验收

- 上传图片后，处理中能看到 PG Agent 分析状态。
- 高清完成后，A 组结果页自动展示 2 个推荐卡。
- B 组点击下载后展示推荐弹窗，且弹窗不阻塞下载。
- 人像图推荐 AI Filter 和视频特效方向。
- 商品图推荐 UGC Video 和电商视频方向。
- 点击推荐后，目标页自动带入图片。
- 目标页能自动进入对应分类或功能状态。
- 下载能力不受影响。

### 8.2 A/B Test 方案

| 组别 | 方案 |
| --- | --- |
| Control | 无推荐 |
| A | 结果页直接展示推荐卡 |
| B | 用户点击下载后展示推荐弹窗 |

实验要回答的问题：

```text
推荐应该出现在结果页，还是出现在下载完成后？
哪个触点能带来更多下游任务创建，同时不影响 Image Enhancer 主任务完成？
```

### 8.3 实验意义

这个 A/B Test 有意义，但前提是指标口径要设计正确。

A 组结果页推荐卡的特点：

- 曝光更早，覆盖所有看到结果页的用户。
- 更适合验证“增强完成后立刻推荐”能否提升下游功能进入率。
- 风险是推荐可能挤压结果页操作区，影响下载或增加干扰。

B 组下载后推荐弹窗的特点：

- 出现在用户完成主任务之后，对下载链路影响更小。
- 用户已经拿到结果，心理上更容易接受“下一步创作”。
- 曝光人群只包含点击下载的用户，覆盖面天然小于 A 组。

结论：

这个实验值得做，因为它比较的是两个关键触点：结果完成时 vs 下载完成后。但不能只比较推荐 CTR，需要比较“按增强完成用户计”的下游任务创建率，否则 B 组会因为曝光人群更高意图而产生偏差。

### 8.4 可能被 Challenge 的点

| Challenge | 原因 | 规避方式 |
| --- | --- | --- |
| A、B 曝光人群不一致 | A 面向结果页用户，B 只面向下载用户 | 主指标使用 `result_shown_user` 作为统一分母 |
| 只看 CTR 不公平 | B 组用户已点击下载，意图更强 | CTR 只做辅助指标，主看下游任务创建率 |
| B 组可能伤害下载体验 | 弹窗如果阻塞下载会被认为打扰 | 必须先触发下载，再展示弹窗 |
| A 组可能影响主任务 | 推荐卡可能挤压下载按钮 | 下载率作为保护指标，下降即判失败 |
| 没有 Control 无法判断增量 | A vs B 只能比较形式，不能证明推荐本身有效 | 建议保留 Control 组，至少小流量 |

### 8.5 实验口径

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

### 8.6 成功标准

- A 或 B 相比 Control，下游任务创建率提升。
- 获胜组相比另一实验组，下游任务创建率更高。
- 目标页图片带入成功率稳定。
- Image Enhancer 下载率不下降。
- 结果页流失率不升高。

---

## 9. 核心指标

### 9.1 主指标

| 指标 | 说明 |
| --- | --- |
| 下游任务创建率 | `下游任务创建用户数 / 结果页曝光用户数`，实验主指标 |
| 目标页打开率 | 点击推荐后成功进入目标页比例 |
| 图片带入成功率 | 目标页成功读取并使用增强图比例 |
| 推荐 CTR | 推荐曝光后的点击率，辅助判断触点吸引力 |

### 9.2 保护指标

| 指标 | 说明 |
| --- | --- |
| 下载率 | 推荐不能降低 Image Enhancer 下载率 |
| 结果页流失率 | 推荐不能导致更多用户直接离开 |
| 目标页返回率 | 点击推荐后立刻返回说明承接弱 |
| 弹窗关闭率 | B 组弹窗被关闭比例，过高说明打扰 |

---

## 10. 埋点

### 10.1 事件

| 事件名 | 触发时机 |
| --- | --- |
| `image_enhancer_upload_started` | 用户上传图片 |
| `image_enhancer_process_started` | 开始高清增强 |
| `pg_agent_analysis_started` | Agent 开始分析 |
| `pg_agent_analysis_succeeded` | Agent 成功返回 |
| `pg_agent_analysis_failed` | Agent 分析失败 |
| `image_enhancer_result_shown` | 高清结果页展示 |
| `pg_agent_reco_exposed` | 推荐卡曝光 |
| `pg_agent_reco_clicked` | 推荐卡点击 |
| `pg_agent_reco_modal_shown` | 下载后推荐弹窗展示 |
| `pg_agent_reco_modal_closed` | 下载后推荐弹窗关闭 |
| `pg_agent_handoff_saved` | 保存图片 handoff |
| `pg_agent_reco_target_opened` | 目标页打开 |
| `pg_agent_handoff_loaded` | 目标页成功读取 handoff |
| `pg_agent_handoff_failed` | 目标页读取 handoff 失败 |
| `pg_agent_reco_task_created` | 下游功能创建任务 |
| `image_enhancer_download_clicked` | 用户点击下载 |

### 10.2 公共参数

| 参数 | 说明 |
| --- | --- |
| `intent_type` | `portrait_selfie` / `product_ecommerce` / `generic_fallback` |
| `confidence` | 意图识别置信度 |
| `recommendation_id` | 推荐卡 ID |
| `recommendation_rank` | 推荐位序号 |
| `target_page` | 目标页 |
| `source_page` | 来源页，固定为 `image-enhancer` |
| `asset_id` | 图片资源 ID |
| `handoff_id` | 跨页传图 ID |
| `experiment_group` | `control` / `result_card` / `download_modal` |
| `reco_surface` | `result_page` / `download_modal` |

---

## 11. 最终结论

MVP 必须完成：

```text
PG Agent 分析
-> 根据实验组展示结果页推荐卡或下载后推荐弹窗
-> 点击推荐
-> 自动带图并预填目标页分类/参数
```

推荐 A/B Test 可以做，但要保留 Control，并使用“结果页曝光用户”为统一分母。否则 B 组因为只覆盖下载用户，CTR 可能虚高，容易被 challenge。

其中“目标页自动带图并预填分类/参数”是必须项。没有这一步，推荐只是普通跳转，不能有效完成从 Image Enhancer 到下游功能的转化。
