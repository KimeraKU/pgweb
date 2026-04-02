# ugc_app_video_generator_v2

## Identity
Generate high-converting UGC-style app advertisement video prompts using multi-asset inputs (model + UI + features).

This module supports:
- Talking Head (口播)
- Voiceover (TTS旁白)
- Multi-asset composition (model + UI)

---

## Input

```json
{
  "model_image": "optional",
  "app_ui": "required",
  "product_name": "optional",
  "features": [
    {
      "name": "",
      "benefit": ""
    }
  ],
  "target_user": "optional",
  "mode": "talking_head / voiceover / both",
  "composition_mode": "model + ui / ui_only / single_image",
  "duration": "15s"
}
```

---

## Core Goal

Transform:
- product features
- visual assets

Into:
- UGC scripts
- structured video prompts
- high-converting ad content

---

## Process

### Step 1: Asset Analysis

#### Model Layer
- face expression
- persona
- trust signal

#### UI Layer
- feature visibility
- interaction clarity
- screen readability

---

### Step 2: Feature → Pain Mapping

Convert features into:

```json
{
  "feature": "",
  "pain_point": "",
  "hook": "",
  "demo_action": "",
  "result": ""
}
```

---

### Step 3: Asset Role Assignment

```json
{
  "model": "trust layer",
  "ui": "proof layer"
}
```

Mapping:

| Stage | Asset |
|------|------|
| Hook | model |
| Problem | model |
| Demo | UI |
| Result | model / UI |
| CTA | model |

---

### Step 4: Scenario Composition

Build flow:

0–3s: model hook  
3–6s: model problem  
6–10s: UI demo  
10–13s: reaction  
13–15s: CTA  

---

### Step 5: Script Generation

#### Talking Head
Hook → Problem → Demo (UI) → Result → CTA

#### Voiceover
Hook → UI Demo → Feature Highlight → Result → CTA

---

### Step 6: Multi-Variation Output

Generate:
- multiple hooks
- multiple tones
- multiple personas

---

## Output

### A. Talking Head Prompt
- model + UI combined
- conversational delivery

### B. Voiceover Prompt
- UI-driven
- TTS narration

### C. Feature Mapping

### D. Variations

---

## Visual Rules

- iPhone handheld style
- natural lighting
- fast cuts
- UI clearly visible
- realistic framing

---

## Audio Rules

Talking Head:
- casual
- human pauses

Voiceover:
- soft
- neutral

---

## Supported Modes

### 1. Single Image Mode
model + phone combined

### 2. Multi-Asset Mode
model + UI

### 3. UI Only Mode
UI-driven ads

---

## Output Capability

Input:
- model image
- UI
- feature list

Output:
- 2 video prompt types
- multiple variations

---

## Core Insight

Model builds trust  
UI proves value  

---

## Engine Principle

Asset + Feature → Scenario → Script → Video

---

## Final Goal

Turn app features into scalable UGC ads
