import { NextRequest, NextResponse } from 'next/server';

/**
 * 代理 LinkV/Artface AIGC 或 PPIO kling-o1-ref2v 创建任务 + 查询任务状态。
 *
 * 默认上游 Artface：
 * POST https://artface.linkv.live/api/v1/aigc/task/create
 * 多图：请求体传 input_images: [url1, url2, ...]（最多 7 张），上游用 input_images 数组。
 *
 * 可选 PPIO 上游（.env 配置 KLING_PPIO_CREATE_URL 为 PPIO 创建接口 URL）：
 * POST https://api.ppio.com/v3/async/kling-o1-ref2v
 * 多图：body.images 为参考图 URL 数组（0–7 张），与官方文档一致。
 *
 * .env.local 可选：
 * - AIGC_CALLBACK_URL / AIGC_USER_ID / AIGC_TASK_QUERY_URL（Artface 轮询）
 * - KLING_PPIO_CREATE_URL 使用 PPIO 时必填
 */

const DEFAULT_CREATE = 'https://artface.linkv.live/api/v1/aigc/task/create';

/** Kling O1：与上游 model_id / model_version_id 对齐，可 env 覆盖 */
const DEFAULT_KLING_O1_MODEL = 'kling-video-o1';

const AIGC_CATEGORIES = ['text_to_video', 'image_to_video', 'image_to_image', 'first_last_frame_to_video'] as const;

/** 上游 Artface 返回 data.id_task，兼容常见 task_id / taskId / id */
const TASK_ID_KEYS = ['task_id', 'taskId', 'id_task', 'id', 'request_id', 'job_id', 'jobId', 'trace_id'];

/** 从任意对象中取首个可用的任务 ID 字符串（含数字转 string） */
function takeId(o: Record<string, unknown> | null | undefined): string {
  if (!o || typeof o !== 'object') return '';
  for (const k of TASK_ID_KEYS) {
    const v = o[k];
    if (v === null || v === undefined) continue;
    if (typeof v === 'string' && v.trim()) return v.trim();
    if (typeof v === 'number' && !Number.isNaN(v)) return String(v);
  }
  return '';
}

/** 递归遍历对象，找到第一个名为 task_id/taskId/id 等的字段值（深度优先） */
function findTaskIdDeep(obj: unknown, visited?: Set<unknown>): string {
  if (obj === null || obj === undefined) return '';
  const seen = visited ?? new Set<unknown>();
  if (seen.has(obj)) return '';
  if (typeof obj !== 'object') return '';
  seen.add(obj);
  const o = obj as Record<string, unknown>;
  for (const k of TASK_ID_KEYS) {
    const v = o[k];
    if (v === null || v === undefined) continue;
    if (typeof v === 'string' && v.trim()) return v.trim();
    if (typeof v === 'number' && !Number.isNaN(v)) return String(v);
  }
  for (const k of Object.keys(o)) {
    const v = o[k];
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      const found = findTaskIdDeep(v, seen);
      if (found) return found;
    }
    if (Array.isArray(v)) {
      for (const item of v) {
        const found = findTaskIdDeep(item, seen);
        if (found) return found;
      }
    }
  }
  return '';
}

/** 从上游创建任务响应中提取 task_id：先按常见路径取，再递归整棵树查找 */
function pickTaskId(data: Record<string, unknown>): string {
  const d = data;
  const dataObj = typeof d.data === 'object' && d.data !== null ? (d.data as Record<string, unknown>) : null;
  const resultObj = typeof d.result === 'object' && d.result !== null ? (d.result as Record<string, unknown>) : null;
  const resultData =
    resultObj && typeof resultObj.data === 'object' && resultObj.data !== null
      ? (resultObj.data as Record<string, unknown>)
      : null;
  const dataResult =
    dataObj && typeof dataObj.result === 'object' && dataObj.result !== null
      ? (dataObj.result as Record<string, unknown>)
      : null;

  const from = takeId;
  const candidates = [
    from(d),
    from(dataObj),
    from(resultObj),
    from(resultData),
    from(dataResult),
    typeof d.result === 'string' ? d.result : '',
    typeof d.data === 'string' ? d.data : '',
  ];
  for (const c of candidates) {
    if (c) return c;
  }
  return findTaskIdDeep(data);
}

export async function POST(req: NextRequest) {
  const createUrl = process.env.AIGC_CREATE_URL?.trim() || DEFAULT_CREATE;

  let body: {
    prompt?: string;
    aspect_ratio?: string;
    duration?: string;
    mode?: string;
    category?: string;
    image_url?: string;
    input_images?: string[];
    first_frame?: string;
    last_frame?: string;
    id_task?: string;
    keep_original_sound?: boolean;
    /** 页面填写，优先于 .env */
    callback_url?: string;
    user_id?: string;
    app_id?: string;
    tenant_id?: string;
    model_version_id?: string;
    api_key?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: '请求体须为 JSON' }, { status: 400 });
  }

  /** 与文生视频 curl 一致：未配置时使用默认回调与 user_id */
  const DEFAULT_CALLBACK_URL = 'http://47.89.173.41:22356';
  const DEFAULT_USER_ID = '12343211';
  const callbackUrl =
    (body.callback_url && String(body.callback_url).trim()) ||
    process.env.AIGC_CALLBACK_URL?.trim() ||
    DEFAULT_CALLBACK_URL;
  const userId =
    (body.user_id && String(body.user_id).trim()) ||
    process.env.AIGC_USER_ID?.trim() ||
    DEFAULT_USER_ID;

  const prompt = (body.prompt || '').trim().slice(0, 2500);
  if (!prompt) {
    return NextResponse.json({ error: 'prompt 必填' }, { status: 400 });
  }

  let aigc_category = (body.category || 'text_to_video') as (typeof AIGC_CATEGORIES)[number];
  if (!AIGC_CATEGORIES.includes(aigc_category)) aigc_category = 'text_to_video';

  const input_images: string[] = [];
  if (aigc_category === 'image_to_video' && body.image_url) {
    input_images.push(body.image_url);
  }
  if (aigc_category === 'image_to_image') {
    if (Array.isArray(body.input_images) && body.input_images.length > 0) {
      for (const u of body.input_images) {
        if (typeof u === 'string' && u.trim() && /^https?:\/\//i.test(u.trim())) input_images.push(u.trim());
      }
    } else if (body.image_url) {
      input_images.push(body.image_url);
    }
  }
  if (aigc_category === 'first_last_frame_to_video') {
    if (body.first_frame) input_images.push(body.first_frame);
    if (body.last_frame) input_images.push(body.last_frame);
  }
  if (aigc_category === 'image_to_image' && input_images.length === 0) {
    return NextResponse.json({ error: '图生图模式需提供参考图（image_url 或 input_images）' }, { status: 400 });
  }

  const modelVersionId =
    (body.model_version_id && String(body.model_version_id).trim()) ||
    process.env.AIGC_MODEL_VERSION_ID?.trim() ||
    process.env.KLING_O1_MODEL_VERSION_ID?.trim() ||
    DEFAULT_KLING_O1_MODEL;
  const aspect_ratio = ['16:9', '9:16', '1:1'].includes(body.aspect_ratio || '')
    ? body.aspect_ratio!
    : '16:9';
  const duration = ['5', '10'].includes(body.duration || '') ? body.duration! : '5';

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const key =
    (body.api_key && String(body.api_key).trim()) || process.env.AIGC_API_KEY?.trim();
  if (key) headers.Authorization = key.startsWith('Bearer ') ? key : `Bearer ${key}`;

  const ppioUrl = process.env.KLING_PPIO_CREATE_URL?.trim();
  let res: Response;
  try {
    if (ppioUrl) {
      /** PPIO 官方 kling-o1-ref2v：images 为参考图 URL 数组（0-7 张） */
      const durationNum = duration === '10' ? 10 : 5;
      const ppioPayload = {
        images: input_images.slice(0, 7),
        prompt,
        duration: durationNum,
        aspect_ratio,
        keep_original_sound: body.keep_original_sound ?? false,
      };
      res = await fetch(ppioUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(ppioPayload),
      });
    } else {
      const upstream = {
        tenant_id:
          (body.tenant_id && String(body.tenant_id).trim()) ||
          process.env.AIGC_TENANT_ID?.trim() ||
          'arena',
        user_id: userId,
        app_id:
          (body.app_id && String(body.app_id).trim()) ||
          process.env.AIGC_APP_ID?.trim() ||
          'arena',
        app_kind: process.env.AIGC_APP_KIND?.trim() || 'imagent',
        aigc_category,
        callback_url: callbackUrl,
        model_version_id: modelVersionId,
        input_images,
        parameters: {
          prompt,
          aspect_ratio,
          duration,
        },
      };
      res = await fetch(createUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(upstream),
      });
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: `创建任务请求失败: ${msg}` }, { status: 502 });
  }

  const text = await res.text();
  let data: Record<string, unknown> = {};
  try {
    data = JSON.parse(text) as Record<string, unknown>;
  } catch {
    /* ignore */
  }

  if (!res.ok) {
    const err =
      (data.message as string) ||
      (data.error as string) ||
      (data.msg as string) ||
      text ||
      res.statusText;
    return NextResponse.json({ error: err, upstream_status: res.status }, { status: res.status >= 400 ? res.status : 502 });
  }

  const task_id = pickTaskId(data);
  if (!task_id) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[kling-o1] 上游未返回可识别的 task_id，完整响应:', JSON.stringify(data, null, 2));
    }
    return NextResponse.json(
      {
        error: '上游未返回 task_id，请根据实际响应在 route 中调整 pickTaskId。',
        hint: '打开开发者工具 → Network → 点开失败的 kling-o1 请求 → Response 里查看 raw 字段；或看本地终端日志。',
        raw: data,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ task_id, aigc_category });
}

const VIDEO_URL_KEYS = ['video_url', 'videoUrl', 'output_url', 'result_url', 'output', 'preview_url', 'video'];
const THUMB_KEYS = ['thumbnail_url', 'thumbnailUrl', 'cover_url', 'cover', 'preview_image', 'image_url'];
const STATUS_KEYS = ['status', 'task_status', 'state', 'status_code', 'code', 'result'];

function takeFirstUrl(obj: Record<string, unknown> | null, keys: string[]): string {
  if (!obj || typeof obj !== 'object') return '';
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === 'string' && v.trim() && (v.startsWith('http://') || v.startsWith('https://')))
      return v.trim();
  }
  return '';
}

function takeStatusRaw(obj: Record<string, unknown> | null): string {
  if (!obj || typeof obj !== 'object') return '';
  for (const k of STATUS_KEYS) {
    const v = obj[k];
    if (v === null || v === undefined) continue;
    const s = String(v).toLowerCase().trim();
    if (s) return s;
  }
  return '';
}

/** 递归找第一个像 URL 的字符串 */
function findUrlDeep(obj: unknown, keys: string[], visited?: Set<unknown>): string {
  if (obj === null || obj === undefined) return '';
  const seen = visited ?? new Set<unknown>();
  if (seen.has(obj)) return '';
  if (typeof obj === 'string' && obj.startsWith('http')) return obj.trim();
  if (typeof obj !== 'object') return '';
  seen.add(obj);
  const o = obj as Record<string, unknown>;
  for (const k of keys) {
    const v = o[k];
    if (typeof v === 'string' && v.trim() && (v.startsWith('http://') || v.startsWith('https://')))
      return v.trim();
  }
  for (const k of Object.keys(o)) {
    const v = o[k];
    if (v !== null && typeof v === 'object') {
      const found = findUrlDeep(v, keys, seen);
      if (found) return found;
    }
  }
  return '';
}

/** Artface 任务详情：data.preview[].result_items[] 里 content_type 为 video / cover 的 url */
function extractFromArtfacePreview(root: Record<string, unknown>): { video_url: string; thumbnail_url: string } {
  let video_url = '';
  let thumbnail_url = '';
  const preview = root.preview;
  if (!Array.isArray(preview)) return { video_url, thumbnail_url };
  for (const item of preview) {
    const rec = item as Record<string, unknown>;
    const resultItems = rec.result_items;
    if (Array.isArray(resultItems)) {
      for (const ri of resultItems) {
        const r = ri as Record<string, unknown>;
        const url = typeof r.url === 'string' ? r.url.trim() : '';
        const ct = String(r.content_type ?? '').toLowerCase();
        if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
          if (ct === 'video') video_url = video_url || url;
          if (ct === 'cover') thumbnail_url = thumbnail_url || url;
        }
      }
    }
    if (!video_url && Array.isArray(rec.list) && rec.list.length > 0 && typeof rec.list[0] === 'string') {
      const u = rec.list[0];
      if (u.startsWith('http')) video_url = u;
    }
  }
  if (!thumbnail_url && Array.isArray(preview) && preview.length > 1) {
    const second = preview[1] as Record<string, unknown>;
    if (Array.isArray(second.list) && second.list[0] && typeof second.list[0] === 'string' && second.list[0].startsWith('http'))
      thumbnail_url = second.list[0];
  }
  return { video_url, thumbnail_url };
}

function extractTaskFields(data: Record<string, unknown>) {
  const root =
    typeof data.data === 'object' && data.data !== null ? (data.data as Record<string, unknown>) : data;
  const statusRaw =
    takeStatusRaw(root) || takeStatusRaw(data) || '';

  const artface = extractFromArtfacePreview(root);
  const video_url =
    artface.video_url ||
    takeFirstUrl(root, VIDEO_URL_KEYS) ||
    takeFirstUrl(data, VIDEO_URL_KEYS) ||
    (typeof root.output === 'object' && root.output !== null
      ? takeFirstUrl(root.output as Record<string, unknown>, VIDEO_URL_KEYS)
      : '') ||
    findUrlDeep(data, VIDEO_URL_KEYS);

  const thumbnail_url =
    artface.thumbnail_url ||
    takeFirstUrl(root, THUMB_KEYS) ||
    takeFirstUrl(data, THUMB_KEYS) ||
    findUrlDeep(data, THUMB_KEYS);

  const error =
    (root.error as string) ||
    (root.error_message as string) ||
    (root.fail_reason as string) ||
    (data.message as string);

  return { statusRaw, video_url, thumbnail_url, error };
}

/** 轮询任务详情：Artface 用查询参数 id_task（路径形式易 404） */
const DEFAULT_TASK_QUERY_URL = 'https://artface.linkv.live/api/v1/task/detail/query?id_task={task_id}';

export async function GET(req: NextRequest) {
  const taskId = req.nextUrl.searchParams.get('task_id')?.trim();
  if (!taskId) {
    return NextResponse.json({ error: '缺少 query: task_id' }, { status: 400 });
  }

  const pollFromClient = req.nextUrl.searchParams.get('poll_url')?.trim();
  const queryTpl =
    (pollFromClient && decodeURIComponent(pollFromClient)) ||
    process.env.AIGC_TASK_QUERY_URL?.trim() ||
    DEFAULT_TASK_QUERY_URL;

  const buildUrl = (style: 'template' | 'path' | 'query_id_task' | 'query_task_id'): string => {
    const base = queryTpl.split('?')[0].replace(/\{task_id\}/g, '').replace(/\/+$/, '');
    const enc = encodeURIComponent(taskId);
    if (style === 'template') {
      return queryTpl.includes('{task_id}')
        ? queryTpl.replace('{task_id}', enc)
        : `${queryTpl.replace(/\?+$/, '')}${queryTpl.includes('?') ? '&' : '?'}task_id=${enc}`;
    }
    if (style === 'path') return `${base}/${enc}`;
    if (style === 'query_id_task') return `${base}?id_task=${enc}`;
    return `${base}?task_id=${enc}`;
  };

  const headers: Record<string, string> = {};
  const pollKey =
    req.nextUrl.searchParams.get('api_key')?.trim() || process.env.AIGC_API_KEY?.trim();
  if (pollKey) headers.Authorization = pollKey.startsWith('Bearer ') ? pollKey : `Bearer ${pollKey}`;

  const tryFetch = async (urlToTry: string): Promise<{ res: Response; text: string }> => {
    const r = await fetch(urlToTry, { method: 'GET', headers });
    const t = await r.text();
    return { res: r, text: t };
  };

  let res: Response;
  let text: string;
  try {
    ({ res, text } = await tryFetch(buildUrl('template')));
    if (res.status === 404) {
      const pathTry = await tryFetch(buildUrl('path'));
      if (pathTry.res.ok || pathTry.res.status !== 404) {
        res = pathTry.res;
        text = pathTry.text;
      }
      if (res.status === 404) {
        const queryTry = await tryFetch(buildUrl('query_task_id'));
        res = queryTry.res;
        text = queryTry.text;
      }
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg, status: 'failed' }, { status: 502 });
  }

  let data: Record<string, unknown> = {};
  try {
    data = JSON.parse(text) as Record<string, unknown>;
  } catch {
    /* ignore */
  }

  if (!res.ok) {
    return NextResponse.json(
      {
        status: 'failed',
        error: (data.message as string) || text || res.statusText,
      },
      { status: res.status >= 400 ? res.status : 502 }
    );
  }

  const { statusRaw, video_url, thumbnail_url, error } = extractTaskFields(data);

  const done = [
    'succeeded', 'success', 'completed', 'complete', 'done', 'finish', 'finished',
    'ok', '2', '3', 'succeed',
  ].includes(statusRaw);
  const failed = [
    'failed', 'error', 'cancelled', 'canceled', 'fail', '-1', '0',
  ].includes(statusRaw);

  let status: 'processing' | 'succeeded' | 'failed' = 'processing';
  if (failed) status = 'failed';
  else if (done && (video_url || thumbnail_url)) status = 'succeeded';
  else if (done && !video_url && !thumbnail_url) status = 'processing';

  if (process.env.NODE_ENV === 'development' && status === 'processing' && statusRaw) {
    console.warn('[kling-o1 poll] 可能已完成但未解析到视频/封面，上游响应:', JSON.stringify(data, null, 2));
  }

  return NextResponse.json({
    status,
    video_url: video_url || null,
    thumbnail_url: thumbnail_url || null,
    error: error || null,
    raw_status: statusRaw,
  });
}
