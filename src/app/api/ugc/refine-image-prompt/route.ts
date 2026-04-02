import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_BASE_URL = 'https://claude.zcheap.ai/v1';
const DEFAULT_API_KEY = 'sk-7bfa2015eac741211ea4f491cc30519d14fe99e3630737b73f505dd10e2e7556';

function normalizeContent(content: unknown): string {
  if (typeof content === 'string') return content.trim();
  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object' && 'text' in item) {
          return String((item as { text: unknown }).text);
        }
        return '';
      })
      .join('\n')
      .trim();
  }
  return '';
}

export async function POST(req: NextRequest) {
  let body: {
    creativePrompt?: string;
    modelName?: string;
    sceneName?: string;
    aspectRatio?: string;
    candidateIndex?: number;
    totalCount?: number;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON 无效' }, { status: 400 });
  }

  const creativePrompt = body.creativePrompt?.trim();
  if (!creativePrompt) {
    return NextResponse.json({ error: 'creativePrompt 必填' }, { status: 400 });
  }

  const skillPath = path.join(process.cwd(), 'prd', 'model_production_system_skill.md');
  const skillText = await fs.readFile(skillPath, 'utf8');

  const systemPrompt = [
    'You are a senior e-commerce prompt engineer.',
    'Use the following skill as your production standard.',
    skillText,
    'Your job: turn user creative input into ONE final image-generation prompt for Gemini 3 Pro.',
    'The output should be optimized for e-commerce UGC-style product visuals.',
    'Keep the product clearly visible, composition commercially usable, and model/scene instructions consistent.',
    'Do not explain your reasoning. Do not output markdown. Return only the final prompt text.',
  ].join('\n\n');

  const userPrompt = [
    `Creative prompt: ${creativePrompt}`,
    `Model selection: ${body.modelName || 'system default model strategy'}`,
    `Scene selection: ${body.sceneName || 'system default ecommerce scene strategy'}`,
    `Aspect ratio: ${body.aspectRatio || '1:1'}`,
    `Candidate index: ${(body.candidateIndex ?? 0) + 1}/${body.totalCount ?? 1}`,
    'Requirements:',
    '- Output one polished final prompt only.',
    '- Make it suitable for ecommerce ad image generation.',
    '- Preserve realistic commercial photography style.',
    '- The product must remain the visual hero.',
    '- If model/scene is not specified, infer a commercially reasonable default.',
    '- Make this candidate visually distinct from the others with a different composition emphasis, camera framing, or storytelling angle.',
  ].join('\n');

  let res: Response;
  try {
    res = await fetch(`${process.env.OPENAI_COMPAT_BASE_URL?.trim() || DEFAULT_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_COMPAT_API_KEY?.trim() || DEFAULT_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-5.4',
        store: false,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'prompt 优化请求失败' },
      { status: 502 }
    );
  }

  const text = await res.text();
  let data: unknown = null;
  try {
    data = JSON.parse(text) as unknown;
  } catch {
    data = text;
  }

  if (!res.ok) {
    return NextResponse.json(
      {
        error:
          (data && typeof data === 'object' && 'error' in data && JSON.stringify((data as { error: unknown }).error)) ||
          text ||
          res.statusText,
      },
      { status: res.status >= 400 ? res.status : 502 }
    );
  }

  const content =
    data && typeof data === 'object' && 'choices' in data && Array.isArray((data as { choices?: unknown[] }).choices)
      ? normalizeContent(((data as { choices: Array<{ message?: { content?: unknown } }> }).choices[0]?.message?.content ?? ''))
      : '';

  if (!content) {
    return NextResponse.json({ error: 'gpt-5.4 未返回可用 prompt', raw: data }, { status: 502 });
  }

  return NextResponse.json({
    prompt: content,
    raw: process.env.NODE_ENV === 'development' ? data : undefined,
  });
}
