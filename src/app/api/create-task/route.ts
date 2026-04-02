import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_CREATE_URL = 'https://artface.linkv.live/api/v1/aigc/task/create';
const DEFAULT_CALLBACK_URL = 'http://47.89.173.41:22356';

function pickTaskId(payload: unknown): string {
  if (!payload || typeof payload !== 'object') return '';
  const obj = payload as Record<string, unknown>;
  const keys = ['id_task', 'task_id', 'taskId', 'id', 'request_id', 'job_id'];
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number' && !Number.isNaN(value)) return String(value);
  }
  for (const value of Object.values(obj)) {
    const found = pickTaskId(value);
    if (found) return found;
  }
  return '';
}

function pickImageUrl(payload: unknown): string | null {
  if (!payload) return null;
  if (typeof payload === 'string' && /^https?:\/\//i.test(payload.trim())) return payload.trim();
  if (Array.isArray(payload)) {
    for (const item of payload) {
      const found = pickImageUrl(item);
      if (found) return found;
    }
    return null;
  }
  if (typeof payload === 'object') {
    const obj = payload as Record<string, unknown>;
    const keys = ['image_url', 'url', 'result_url', 'output_url', 'results', 'data', 'result'];
    for (const key of keys) {
      const found = pickImageUrl(obj[key]);
      if (found) return found;
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  let body: {
    prompt?: string;
    input_images?: string[];
    aspect_ratio?: string;
    size?: string;
    callback_url?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON 无效' }, { status: 400 });
  }

  const prompt = body.prompt?.trim();
  if (!prompt) {
    return NextResponse.json({ error: 'prompt 必填' }, { status: 400 });
  }

  const requestTaskId = `tk-${Date.now()}${Math.random().toString(36).slice(2, 14).toUpperCase()}`;

  const input_images = Array.isArray(body.input_images)
    ? body.input_images.filter((item): item is string => typeof item === 'string' && /^https?:\/\//i.test(item))
    : [];

  const payload = {
    id_task: requestTaskId,
    tenant_id: process.env.GEMINI3_TENANT_ID?.trim() || 'test',
    user_id: process.env.GEMINI3_USER_ID?.trim() || 'fsl001',
    app_id: process.env.GEMINI3_APP_ID?.trim() || '123',
    app_kind: 'imagent',
    aigc_category: 'image_to_image',
    callback_url:
      body.callback_url?.trim() ||
      process.env.GEMINI3_CALLBACK_URL?.trim() ||
      process.env.AIGC_CALLBACK_URL?.trim() ||
      DEFAULT_CALLBACK_URL,
    model_version_id: 'gemini-3-pro-image-preview',
    input_images,
    parameters: {
      prompt,
      aspect_ratio: body.aspect_ratio || '1:1',
      size: body.size || '2K',
    },
  };

  let res: Response;
  try {
    res = await fetch(process.env.GEMINI3_CREATE_URL?.trim() || DEFAULT_CREATE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '创建任务失败' },
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
          (data && typeof data === 'object' && 'message' in data && String((data as { message: string }).message)) ||
          (data && typeof data === 'object' && 'error' in data && String((data as { error: string }).error)) ||
          text ||
          res.statusText,
      },
      { status: res.status >= 400 ? res.status : 502 }
    );
  }

  return NextResponse.json({
    id_task: pickTaskId(data) || requestTaskId,
    image_url: pickImageUrl(data),
    raw: process.env.NODE_ENV === 'development' ? data : undefined,
  });
}
