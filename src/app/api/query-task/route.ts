import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_QUERY_URL = 'https://artface.linkv.live/api/v1/aigc/task/query';

function pickStatus(payload: unknown): string {
  if (!payload || typeof payload !== 'object') return '';
  const obj = payload as Record<string, unknown>;
  const keys = ['task_status', 'status', 'state'];
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  for (const value of Object.values(obj)) {
    const found = pickStatus(value);
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
    const keys = ['image_url', 'url', 'result_url', 'output_url', 'results', 'data', 'result', 'preview', 'result_items', 'list'];
    for (const key of keys) {
      const found = pickImageUrl(obj[key]);
      if (found) return found;
    }
    for (const value of Object.values(obj)) {
      const found = pickImageUrl(value);
      if (found) return found;
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  let body: { id_task?: string; model?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON 无效' }, { status: 400 });
  }

  const id_task = body.id_task?.trim();
  if (!id_task) {
    return NextResponse.json({ error: 'id_task 必填' }, { status: 400 });
  }

  let res: Response;
  try {
    res = await fetch(process.env.GEMINI3_QUERY_URL?.trim() || DEFAULT_QUERY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_task }),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '查询任务失败' },
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
    status: pickStatus(data),
    image_url: pickImageUrl(data),
    raw: process.env.NODE_ENV === 'development' ? data : undefined,
  });
}
