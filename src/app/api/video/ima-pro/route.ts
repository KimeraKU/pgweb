import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_CREATE_URL = 'https://nexus.fashionlabs.cn/api/v1/aigc/task/create';
const DEFAULT_QUERY_URL = 'https://nexus.fashionlabs.cn/api/v1/task/detail/query/{task_id}';

const DEFAULT_TENANT_ID = 'pgtest';
const DEFAULT_USER_ID = 'pg001';
const DEFAULT_APP_ID = 'photogrid';
const DEFAULT_APP_KIND = 'imagent';
const DEFAULT_CALLBACK_URL = 'http://47.89.173.41:22356';
const DEFAULT_MODEL_VERSION_ID = 'ima-pro';

const TASK_ID_KEYS = ['id_task', 'task_id', 'taskId', 'id', 'request_id', 'job_id', 'jobId', 'trace_id'];
const VIDEO_URL_KEYS = ['video_url', 'videoUrl', 'output_url', 'result_url', 'video', 'preview_url'];
const THUMB_URL_KEYS = ['cover_url', 'thumbnail_url', 'thumbnailUrl', 'poster_url', 'preview_image_url'];
const STATUS_KEYS = ['task_status', 'status', 'state'];

type ImaElementItem =
  | { reference_type: 'text'; prompt: string; reference_role?: string }
  | { reference_type: 'image'; image: { url: string }; reference_role?: string }
  | { reference_type: 'video'; video: { url: string }; reference_role?: string }
  | { reference_type: 'audio'; audio: { url: string }; reference_role?: string };

function sanitizeElementList(input: unknown): ImaElementItem[] {
  if (!Array.isArray(input)) return [];
  const next: ImaElementItem[] = [];

  for (const item of input) {
    if (!item || typeof item !== 'object') continue;
    const obj = item as Record<string, unknown>;
    const referenceType = String(obj.reference_type || '').trim().toLowerCase();
    const referenceRole =
      typeof obj.reference_role === 'string' && obj.reference_role.trim()
        ? obj.reference_role.trim()
        : undefined;

    if (referenceType === 'text') {
      const prompt = typeof obj.prompt === 'string' ? obj.prompt.trim() : '';
      if (!prompt) continue;
      next.push({ reference_type: 'text', prompt, reference_role: referenceRole });
      continue;
    }

    if (referenceType === 'image') {
      const image = obj.image as Record<string, unknown> | undefined;
      const url = typeof image?.url === 'string' ? image.url.trim() : '';
      if (!url) continue;
      next.push({ reference_type: 'image', image: { url }, reference_role: referenceRole });
      continue;
    }

    if (referenceType === 'video') {
      const video = obj.video as Record<string, unknown> | undefined;
      const url = typeof video?.url === 'string' ? video.url.trim() : '';
      if (!url) continue;
      next.push({ reference_type: 'video', video: { url }, reference_role: referenceRole });
      continue;
    }

    if (referenceType === 'audio') {
      const audio = obj.audio as Record<string, unknown> | undefined;
      const url = typeof audio?.url === 'string' ? audio.url.trim() : '';
      if (!url) continue;
      next.push({ reference_type: 'audio', audio: { url }, reference_role: referenceRole });
    }
  }

  return next;
}

function looksLikeVideoUrl(url: string): boolean {
  const u = url.toLowerCase();
  return /\.(mp4|mov|m4v|webm)(\?|$)/.test(u);
}

function looksLikeImageUrl(url: string): boolean {
  const u = url.toLowerCase();
  return /\.(jpg|jpeg|png|webp|gif)(\?|$)/.test(u);
}

function extractMediaFromDetail(payload: unknown): { videoUrl: string; thumbnailUrl: string } {
  if (!payload || typeof payload !== 'object') return { videoUrl: '', thumbnailUrl: '' };

  const root = payload as Record<string, unknown>;
  const dataObj = root.data && typeof root.data === 'object' ? (root.data as Record<string, unknown>) : null;
  const nestedData =
    dataObj && dataObj.data && typeof dataObj.data === 'object'
      ? (dataObj.data as Record<string, unknown>)
      : null;

  const previewCandidates: unknown[] = [
    dataObj?.preview,
    nestedData?.preview,
    root.preview,
  ];

  let videoUrl = '';
  let thumbnailUrl = '';

  for (const preview of previewCandidates) {
    if (!Array.isArray(preview)) continue;
    for (const item of preview) {
      if (!item || typeof item !== 'object') continue;
      const rec = item as Record<string, unknown>;
      const contentType = String(rec.content_type || '').toLowerCase();

      if (Array.isArray(rec.result_items)) {
        for (const rawItem of rec.result_items) {
          if (!rawItem || typeof rawItem !== 'object') continue;
          const resultItem = rawItem as Record<string, unknown>;
          const url = typeof resultItem.url === 'string' ? resultItem.url.trim() : '';
          const resultType = String(resultItem.content_type || contentType).toLowerCase();
          if (!url || !/^https?:\/\//i.test(url)) continue;
          if (!videoUrl && (resultType === 'video' || looksLikeVideoUrl(url))) {
            videoUrl = url;
          }
          if (!thumbnailUrl && (resultType === 'cover' || looksLikeImageUrl(url))) {
            thumbnailUrl = url;
          }
        }
      }

      if (Array.isArray(rec.list)) {
        for (const rawUrl of rec.list) {
          if (typeof rawUrl !== 'string') continue;
          const url = rawUrl.trim();
          if (!url || !/^https?:\/\//i.test(url)) continue;
          if (!videoUrl && (contentType === 'video' || looksLikeVideoUrl(url))) {
            videoUrl = url;
          }
          if (!thumbnailUrl && (contentType === 'cover' || looksLikeImageUrl(url))) {
            thumbnailUrl = url;
          }
        }
      }
    }
    if (videoUrl || thumbnailUrl) break;
  }

  return { videoUrl, thumbnailUrl };
}

function findDeepString(payload: unknown, keys: string[], visited?: Set<unknown>): string {
  if (payload === null || payload === undefined) return '';
  const seen = visited ?? new Set<unknown>();
  if (seen.has(payload)) return '';

  if (typeof payload === 'string') {
    const v = payload.trim();
    if (v) return v;
    return '';
  }
  if (typeof payload !== 'object') return '';

  seen.add(payload);
  const obj = payload as Record<string, unknown>;

  for (const key of keys) {
    const value = obj[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number' && !Number.isNaN(value)) return String(value);
  }

  for (const value of Object.values(obj)) {
    if (value !== null && value !== undefined) {
      const found = findDeepString(value, keys, seen);
      if (found) return found;
    }
  }

  return '';
}

function pickTaskId(payload: unknown): string {
  return findDeepString(payload, TASK_ID_KEYS);
}

function findDeepUrl(payload: unknown, keys: string[], visited?: Set<unknown>): string {
  if (payload === null || payload === undefined) return '';
  const seen = visited ?? new Set<unknown>();
  if (seen.has(payload)) return '';

  if (typeof payload === 'string') return '';
  if (typeof payload !== 'object') return '';

  seen.add(payload);
  const obj = payload as Record<string, unknown>;

  for (const key of keys) {
    const value = obj[key];
    if (typeof value === 'string' && /^https?:\/\//i.test(value.trim())) return value.trim();
  }

  for (const value of Object.values(obj)) {
    if (value !== null && value !== undefined) {
      const found = findDeepUrl(value, keys, seen);
      if (found) return found;
    }
  }

  return '';
}

function extractStatus(payload: unknown): string {
  if (payload && typeof payload === 'object') {
    const top = payload as Record<string, unknown>;
    const dataObj = top.data && typeof top.data === 'object' ? (top.data as Record<string, unknown>) : null;
    const statusFromData = dataObj ? findDeepString(dataObj, STATUS_KEYS) : '';
    if (statusFromData) return statusFromData.toLowerCase();
  }
  const status = findDeepString(payload, STATUS_KEYS);
  return status.toLowerCase();
}

function extractError(payload: unknown): string {
  if (!payload || typeof payload !== 'object') return '';
  const top = payload as Record<string, unknown>;
  const dataObj = top.data && typeof top.data === 'object' ? (top.data as Record<string, unknown>) : null;

  const fromTask = dataObj ? findDeepString(dataObj, ['task_msg', 'error_message', 'fail_reason']) : '';
  if (fromTask) return fromTask;

  const fromError = findDeepString(payload, ['error', 'error_message', 'fail_reason', 'task_msg']);
  if (fromError) return fromError;

  const maybeMessage = findDeepString(payload, ['message']);
  if (maybeMessage && maybeMessage.toLowerCase() !== 'success') return maybeMessage;
  return '';
}

function mapStatus(statusRaw: string, hasVideoUrl: boolean): 'processing' | 'succeeded' | 'failed' | 'submitted' {
  const failedSet = new Set(['failed', 'error', 'cancelled', 'canceled', 'fail', '-1', '0']);
  const succeededSet = new Set(['succeeded', 'success', 'completed', 'complete', 'done', 'finish', 'finished', 'ok', '2', '3']);

  if (failedSet.has(statusRaw)) return 'failed';
  if (hasVideoUrl) return 'succeeded';
  if (succeededSet.has(statusRaw)) return 'submitted';
  return 'processing';
}

export async function POST(req: NextRequest) {
  let body: {
    prompt?: string;
    element_list?: unknown[];
    duration?: number;
    aspect_ratio?: string;
    audio?: boolean;
    source_image_url?: string;
    source_image_urls?: string[];
    category?: 'text_to_video' | 'image_to_video';
    callback_url?: string;
    user_id?: string;
    tenant_id?: string;
    app_id?: string;
    app_kind?: string;
    model_version_id?: string;
    api_key?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: '请求体须为 JSON' }, { status: 400 });
  }

  const prompt = (body.prompt || '').trim();
  const providedElementList = sanitizeElementList(body.element_list);
  const hasTextElement = providedElementList.some((item) => item.reference_type === 'text');
  if (!prompt && !hasTextElement) {
    return NextResponse.json({ error: 'prompt 必填（或在 element_list 中提供 text 元素）' }, { status: 400 });
  }

  const duration = Number(body.duration);
  const safeDuration = Number.isFinite(duration) && duration > 0 ? Math.round(duration) : 15;
  const aspectRatio = (body.aspect_ratio || 'adaptive').trim() || 'adaptive';

  const imageUrls = [
    ...(Array.isArray(body.source_image_urls) ? body.source_image_urls : []),
    body.source_image_url || '',
  ]
    .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    .map((item) => item.trim());

  const fallbackElementList: ImaElementItem[] = [];
  if (prompt) {
    fallbackElementList.push({
      reference_type: 'text',
      prompt,
    });
  }
  for (const url of imageUrls.slice(0, 7)) {
    fallbackElementList.push({
      reference_type: 'image',
      image: { url },
      reference_role: 'reference_image',
    });
  }
  const elementList = providedElementList.length > 0 ? providedElementList : fallbackElementList;
  if (elementList.length === 0) {
    return NextResponse.json({ error: 'element_list 不能为空' }, { status: 400 });
  }

  const category = (body.category || '').trim();
  const isValidCategory = category === 'text_to_video' || category === 'image_to_video';
  const hasVisualRefs = elementList.some((item) => item.reference_type === 'image' || item.reference_type === 'video');
  const aigcCategory = isValidCategory ? category : hasVisualRefs ? 'image_to_video' : 'text_to_video';

  const payload = {
    tenant_id: (body.tenant_id || process.env.IMA_PRO_TENANT_ID || process.env.AIGC_TENANT_ID || DEFAULT_TENANT_ID).trim(),
    user_id: (body.user_id || process.env.IMA_PRO_USER_ID || process.env.AIGC_USER_ID || DEFAULT_USER_ID).trim(),
    app_id: (body.app_id || process.env.IMA_PRO_APP_ID || process.env.AIGC_APP_ID || DEFAULT_APP_ID).trim(),
    app_kind: (body.app_kind || process.env.IMA_PRO_APP_KIND || process.env.AIGC_APP_KIND || DEFAULT_APP_KIND).trim(),
    aigc_category: aigcCategory,
    callback_url: (body.callback_url || process.env.IMA_PRO_CALLBACK_URL || process.env.AIGC_CALLBACK_URL || DEFAULT_CALLBACK_URL).trim(),
    model_version_id: (body.model_version_id || process.env.IMA_PRO_MODEL_VERSION_ID || DEFAULT_MODEL_VERSION_ID).trim(),
    parameters: {
      element_list: elementList,
      audio: body.audio ?? true,
      aspect_ratio: aspectRatio,
      duration: safeDuration,
    },
  };

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const apiKey =
    (body.api_key && String(body.api_key).trim()) ||
    process.env.IMA_PRO_API_KEY?.trim() ||
    process.env.AIGC_API_KEY?.trim();
  if (apiKey) headers.Authorization = apiKey.startsWith('Bearer ') ? apiKey : `Bearer ${apiKey}`;

  let upstreamRes: Response;
  try {
    upstreamRes = await fetch(process.env.IMA_PRO_CREATE_URL?.trim() || DEFAULT_CREATE_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '创建任务失败' },
      { status: 502 }
    );
  }

  const text = await upstreamRes.text();
  let raw: unknown = text;
  try {
    raw = JSON.parse(text) as unknown;
  } catch {
    // keep raw text
  }

  if (!upstreamRes.ok) {
    const msg =
      (raw && typeof raw === 'object' && 'message' in raw && String((raw as { message: unknown }).message)) ||
      (raw && typeof raw === 'object' && 'error' in raw && String((raw as { error: unknown }).error)) ||
      text ||
      upstreamRes.statusText;

    return NextResponse.json(
      { error: msg, upstream_status: upstreamRes.status, raw: process.env.NODE_ENV === 'development' ? raw : undefined },
      { status: upstreamRes.status >= 400 ? upstreamRes.status : 502 }
    );
  }

  const taskId = pickTaskId(raw);
  if (!taskId) {
    return NextResponse.json(
      {
        error: '上游未返回可识别的 task_id',
        raw: process.env.NODE_ENV === 'development' ? raw : undefined,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ task_id: taskId, raw: process.env.NODE_ENV === 'development' ? raw : undefined });
}

export async function GET(req: NextRequest) {
  const taskId = req.nextUrl.searchParams.get('task_id')?.trim();
  if (!taskId) {
    return NextResponse.json({ error: '缺少 query: task_id' }, { status: 400 });
  }

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const apiKey =
    req.nextUrl.searchParams.get('api_key')?.trim() ||
    process.env.IMA_PRO_API_KEY?.trim() ||
    process.env.AIGC_API_KEY?.trim();
  if (apiKey) headers.Authorization = apiKey.startsWith('Bearer ') ? apiKey : `Bearer ${apiKey}`;

  const pollFromClient = req.nextUrl.searchParams.get('poll_url')?.trim();
  const queryTpl = (pollFromClient && decodeURIComponent(pollFromClient)) || process.env.IMA_PRO_QUERY_URL?.trim() || DEFAULT_QUERY_URL;
  const encTaskId = encodeURIComponent(taskId);

  const detailUrl = (() => {
    if (queryTpl.includes('{task_id}')) return queryTpl.replace('{task_id}', encTaskId);
    if (queryTpl.includes('?')) return `${queryTpl}${queryTpl.endsWith('?') ? '' : '&'}id_task=${encTaskId}`;
    return `${queryTpl.replace(/\/+$/, '')}/${encTaskId}`;
  })();

  let upstreamRes: Response;
  let text: string;
  try {
    upstreamRes = await fetch(detailUrl, {
      method: 'GET',
      headers,
    });
    text = await upstreamRes.text();

    const shouldTryPostFallback =
      !upstreamRes.ok &&
      [400, 404, 405].includes(upstreamRes.status);

    if (shouldTryPostFallback) {
      const postUrl = queryTpl.includes('{task_id}')
        ? queryTpl.replace('{task_id}', '').replace(/\/+$/, '')
        : queryTpl;
      const postRes = await fetch(postUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ id_task: taskId }),
      });
      const postText = await postRes.text();
      upstreamRes = postRes;
      text = postText;
    }
  } catch (error) {
    return NextResponse.json(
      { status: 'failed', error: error instanceof Error ? error.message : '查询任务失败' },
      { status: 502 }
    );
  }

  let raw: unknown = text;
  try {
    raw = JSON.parse(text) as unknown;
  } catch {
    // keep raw text
  }

  if (!upstreamRes.ok) {
    const msg =
      (raw && typeof raw === 'object' && 'message' in raw && String((raw as { message: unknown }).message)) ||
      (raw && typeof raw === 'object' && 'error' in raw && String((raw as { error: unknown }).error)) ||
      text ||
      upstreamRes.statusText;

    return NextResponse.json(
      {
        status: 'failed',
        error: msg,
        raw: process.env.NODE_ENV === 'development' ? raw : undefined,
      },
      { status: upstreamRes.status >= 400 ? upstreamRes.status : 502 }
    );
  }

  const mediaFromDetail = extractMediaFromDetail(raw);
  const videoUrl = mediaFromDetail.videoUrl || findDeepUrl(raw, VIDEO_URL_KEYS) || '';
  const thumbnailUrl = mediaFromDetail.thumbnailUrl || findDeepUrl(raw, THUMB_URL_KEYS) || '';
  const statusRaw = extractStatus(raw);
  const status = mapStatus(statusRaw, Boolean(videoUrl));
  const errorMessage = extractError(raw);

  return NextResponse.json({
    status,
    raw_status: statusRaw || null,
    video_url: videoUrl || null,
    thumbnail_url: thumbnailUrl || null,
    error: status === 'failed' ? errorMessage || '视频生成失败' : null,
    hint:
      status === 'submitted'
        ? '任务已完成但查询结果中未返回 video_url，请检查查询接口字段或改为回调落库。'
        : null,
    raw: process.env.NODE_ENV === 'development' ? raw : undefined,
  });
}
