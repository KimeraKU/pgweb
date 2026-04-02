import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_UPLOAD =
  'https://test-api.crevibe.ai/api/v1/client/fashion/batch_upload_images';

function pickFirstUrl(payload: unknown): string | null {
  if (!payload) return null;
  if (typeof payload === 'string' && /^https?:\/\//i.test(payload.trim())) return payload.trim();
  if (Array.isArray(payload)) {
    for (const item of payload) {
      const found = pickFirstUrl(item);
      if (found) return found;
    }
    return null;
  }
  if (typeof payload === 'object') {
    const obj = payload as Record<string, unknown>;
    const keys = ['url', 'image_url', 'result_url', 'output_url', 'data', 'results', 'images', 'urls', 'list'];
    for (const key of keys) {
      const found = pickFirstUrl(obj[key]);
      if (found) return found;
    }
    for (const value of Object.values(obj)) {
      const found = pickFirstUrl(value);
      if (found) return found;
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: '需要 multipart/form-data' }, { status: 400 });
  }

  const file =
    formData.get('file') instanceof File
      ? (formData.get('file') as File)
      : formData.get('images') instanceof File
      ? (formData.get('images') as File)
      : null;

  if (!file || file.size <= 0) {
    return NextResponse.json({ error: '没有上传文件' }, { status: 400 });
  }

  const upstream = new FormData();
  upstream.append('images', file, file.name || 'image.jpg');

  const headers: Record<string, string> = {};
  const key = process.env.CREVIBE_API_KEY?.trim();
  if (key) headers.Authorization = key.startsWith('Bearer ') ? key : `Bearer ${key}`;

  let res: Response;
  try {
    res = await fetch(process.env.CREVIBE_BATCH_UPLOAD_URL?.trim() || DEFAULT_UPLOAD, {
      method: 'POST',
      headers,
      body: upstream,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '上传失败' },
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

  const url = pickFirstUrl(data);
  if (!url) {
    return NextResponse.json(
      { error: '上传成功但未解析到公网图片地址', raw: data },
      { status: 502 }
    );
  }

  return NextResponse.json({ url, code: 200 });
}
