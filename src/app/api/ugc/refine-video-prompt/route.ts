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
    duration?: number;
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

  const skillPath = path.join(process.cwd(), 'prd', 'ugc_app_video_generator_v2.md');
  const skillText = await fs.readFile(skillPath, 'utf8');

  const systemPrompt = [
    'You are a senior UGC app-ad video prompt engineer.',
    'Use the following skill as your production standard:',
    skillText,
    'Task: produce ONE final video-generation prompt for IMA Pro.',
    'The prompt should be production-ready, commercially usable, and focused on conversion.',
    'Return plain text only. Do not output markdown. Do not explain reasoning.',
  ].join('\n\n');

  const userPrompt = [
    `Creative prompt: ${creativePrompt}`,
    `Model selection: ${body.modelName || 'system default model strategy'}`,
    `Scene selection: ${body.sceneName || 'system default scene strategy'}`,
    `Aspect ratio: ${body.aspectRatio || 'adaptive'}`,
    `Duration: ${body.duration || 15}s`,
    'Requirements:',
    '- Output one polished final video prompt only.',
    '- Include clear timing beats for 0-3s / 3-6s / 6-10s / 10-13s / 13-15s.',
    '- Keep ecommerce narrative clear: hook -> problem -> demo -> result -> CTA.',
    '- Ensure model presence + product clarity + realistic UGC camera language.',
    '- Keep wording directly usable as text input for video generation.',
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
      { error: error instanceof Error ? error.message : '视频 prompt 优化请求失败' },
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
    return NextResponse.json({ error: 'gpt-5.4 未返回可用视频 prompt', raw: data }, { status: 502 });
  }

  return NextResponse.json({
    prompt: content,
    raw: process.env.NODE_ENV === 'development' ? data : undefined,
  });
}

