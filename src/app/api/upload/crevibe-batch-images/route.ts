import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_UPLOAD =
  'https://test-api.crevibe.ai/api/v1/client/fashion/batch_upload_images';

/** 从上游 JSON 中尽量解析出图片 URL 列表 */
function extractImageUrls(payload: unknown): string[] {
  if (payload === null || payload === undefined) return [];
  if (typeof payload === 'string' && /^https?:\/\//i.test(payload.trim())) {
    return [payload.trim()];
  }
  if (!Array.isArray(payload) && typeof payload === 'object') {
    const o = payload as Record<string, unknown>;
    const tryKeys = ['urls', 'image_urls', 'data', 'images', 'list', 'results'];
    for (const k of tryKeys) {
      const v = o[k];
      if (Array.isArray(v)) {
        const fromArr = v
          .map((item) => {
            if (typeof item === 'string' && /^https?:\/\//i.test(item)) return item;
            if (item && typeof item === 'object' && 'url' in item && typeof (item as { url: string }).url === 'string') {
              return (item as { url: string }).url;
            }
            return null;
          })
          .filter(Boolean) as string[];
        if (fromArr.length) return fromArr;
      }
    }
  }
  if (Array.isArray(payload)) {
    return payload.filter((x): x is string => typeof x === 'string' && /^https?:\/\//i.test(x));
  }
  const found: string[] = [];
  const walk = (v: unknown, depth: number) => {
    if (depth > 8) return;
    if (typeof v === 'string' && /^https?:\/\//i.test(v) && /\.(jpe?g|png|gif|webp)(\?|$)/i.test(v)) {
      found.push(v);
      return;
    }
    if (Array.isArray(v)) v.forEach((x) => walk(x, depth + 1));
    else if (v && typeof v === 'object') Object.values(v).forEach((x) => walk(x, depth + 1));
  };
  walk(payload, 0);
  return [...new Set(found)];
}

/**
 * 代理 Crevibe 批量上传（multipart field: images）
 * 环境变量：CREVIBE_BATCH_UPLOAD_URL（可选）、CREVIBE_API_KEY（可选 Bearer）
 */
export async function POST(req: NextRequest) {
  const uploadUrl = process.env.CREVIBE_BATCH_UPLOAD_URL?.trim() || DEFAULT_UPLOAD;

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: '需要 multipart/form-data' }, { status: 400 });
  }

  const files = formData.getAll('images').filter((x): x is File => x instanceof File && x.size > 0);
  if (files.length === 0) {
    return NextResponse.json({ error: '请至少上传一张图（字段名 images）' }, { status: 400 });
  }

  const upstream = new FormData();
  for (const f of files) {
    upstream.append('images', f, f.name || 'image.jpg');
  }

  const headers: Record<string, string> = {};
  const key = process.env.CREVIBE_API_KEY?.trim();
  if (key) headers.Authorization = key.startsWith('Bearer ') ? key : `Bearer ${key}`;

  let res: Response;
  try {
    res = await fetch(uploadUrl, { method: 'POST', headers, body: upstream });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: `上传请求失败: ${msg}` }, { status: 502 });
  }

  const text = await res.text();
  let data: unknown = null;
  try {
    data = JSON.parse(text) as unknown;
  } catch {
    /* 可能纯文本 URL */
  }

  if (!res.ok) {
    const err =
      (data && typeof data === 'object' && 'message' in data && String((data as { message: string }).message)) ||
      (data && typeof data === 'object' && 'error' in data && String((data as { error: string }).error)) ||
      text ||
      res.statusText;
    return NextResponse.json({ error: err, upstream_status: res.status }, { status: res.status >= 400 ? res.status : 502 });
  }

  const urls = extractImageUrls(data ?? text);
  if (urls.length === 0) {
    return NextResponse.json(
      {
        error: '上游未解析到图片 URL，请对照实际响应在 route 中调整 extractImageUrls。',
        raw: data ?? text,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ urls, count: urls.length });
}
