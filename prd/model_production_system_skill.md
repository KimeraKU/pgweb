# Skill: model_production_system_skill

##  Identity
End-to-end system for generating **reusable, consistent virtual model assets** for e-commerce.

This is NOT a simple prompt generator.
This is a **Model Production System**:
- stable identity
- multi-angle digitals
- wardrobe control
- ad-ready outputs

---

# Input
```yaml
image: optional (face reference recommended)
product_type: fashion / beauty / fitness / general
target_platform: amazon / shopify / tiktok / luxury
model_style: optional
generate_mode: identity / digitals / ad / full_pipeline
```

---

# GLOBAL LINE (CORE)

```text
Create ONE ultra-realistic IMG model agency digital.

Maintain 1:1 fidelity for facial geometry, bone structure, proportions, and skin texture.
Do not alter identity across generations.

Skin must retain pores, texture, asymmetry, and imperfections.
No smoothing, no beautification, no CGI look.

Lighting: direct flash or clean commercial lighting.
Background: seamless light grey or white.

Camera: DSLR realism, 50–85mm lens, f8, sharp focus.
Color: neutral 5800k, no stylization.

Output must look like a real agency casting digital.
```

---

# STEP 1 — IDENTITY SYSTEM

```yaml
sex:
age:
ethnicity:
skin_tone:
hair_color:
hair_style:
eye_shape:
eye_color:
face_shape:
jawline:
cheekbones:
nose:
lips:
eyebrows:
freckles:
body_type:
height:
```

### Rules
- must be specific
- must describe bone structure
- must be reusable

---

# STEP 2 — DIGITALS SYSTEM

## Required Shots

### Portrait
- front
- left profile
- right profile

### Mid Shot
- front
- arms crossed
- 3/4 angle

### Full Body
- front
- profile
- confident pose

---

## Pose Rules
```text
Neutral expression
No smile
Direct or controlled gaze
Professional casting posture
```

---

# STEP 3 — WARDROBE SYSTEM

## Female Tops
- microfiber crop tank
- spaghetti strap top
- bandeau

## Bottoms
- low-rise jeans
- mini skirt
- swimwear

## Footwear
- barefoot
- sneakers
- heels

---

## Rules
- minimal
- neutral colors
- no branding interference

---

# STEP 4 — SCENE SYSTEM

## Studio
clean white / grey background

## Lifestyle
bathroom / bedroom / gym

## Luxury
editorial minimal interior

---

# STEP 5 — AD GENERATION

```text
Model wearing product naturally.

Product must be visible and readable.

Composition:
- front hero
- close-up
- lifestyle
- detail
```

---

# OUTPUT

## Identity Block
## Digital Shots Prompts
## Ad Prompts (3–5 variations)

---

# FULL PIPELINE OUTPUT

```text
Identity → Digitals → Ad Variations
```

---

# SUCCESS CRITERIA

- face never changes
- usable across multiple images
- product clearly visible
- looks like real commercial photography
