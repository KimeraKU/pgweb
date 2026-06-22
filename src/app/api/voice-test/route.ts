import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_CREATE_URL = 'https://artface.linkv.live/api/v1/aigc/task/create';
const DEFAULT_QUERY_URL = 'https://artface.linkv.live/api/v1/task/detail/query/{task_id}';
const DEFAULT_CALLBACK_URL = 'http://47.89.173.41:22356';

const TASK_ID_KEYS = ['id_task', 'task_id', 'taskId', 'id', 'request_id', 'job_id', 'jobId'];
const STATUS_KEYS = ['status', 'task_status', 'state', 'status_code', 'code', 'result'];
const AUDIO_URL_KEYS = [
  'audio_url',
  'audioUrl',
  'voice_url',
  'voiceUrl',
  'result_url',
  'output_url',
  'preview_url',
  'url',
  'output',
];

function takeTaskId(obj: Record<string, unknown> | null | undefined): string {
  if (!obj) return '';
  for (const key of TASK_ID_KEYS) {
    const value = obj[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number' && !Number.isNaN(value)) return String(value);
  }
  return '';
}

function findTaskIdDeep(payload: unknown, visited = new Set<unknown>()): string {
  if (!payload || typeof payload !== 'object' || visited.has(payload)) return '';
  visited.add(payload);
  const obj = payload as Record<string, unknown>;
  const current = takeTaskId(obj);
  if (current) return current;
  for (const value of Object.values(obj)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        const found = findTaskIdDeep(item, visited);
        if (found) return found;
      }
    } else if (value && typeof value === 'object') {
      const found = findTaskIdDeep(value, visited);
      if (found) return found;
    }
  }
  return '';
}

function takeStatus(payload: unknown, visited = new Set<unknown>()): string {
  if (!payload || typeof payload !== 'object' || visited.has(payload)) return '';
  visited.add(payload);
  const obj = payload as Record<string, unknown>;
  for (const key of STATUS_KEYS) {
    const value = obj[key];
    if (value !== null && value !== undefined && String(value).trim()) {
      return String(value).toLowerCase().trim();
    }
  }
  for (const value of Object.values(obj)) {
    if (value && typeof value === 'object') {
      const found = takeStatus(value, visited);
      if (found) return found;
    }
  }
  return '';
}

function isHttpUrl(value: unknown): value is string {
  return typeof value === 'string' && /^https?:\/\//i.test(value.trim());
}

function looksLikeAudioUrl(url: string): boolean {
  return /\.(mp3|wav|m4a|aac|ogg|flac)(\?|#|$)/i.test(url);
}

function findAudioUrl(payload: unknown, visited = new Set<unknown>(), excludedUrls = new Set<string>()): string {
  if (!payload || visited.has(payload)) return '';
  if (isHttpUrl(payload)) {
    const url = payload.trim();
    return looksLikeAudioUrl(url) && !excludedUrls.has(url) ? url : '';
  }
  if (typeof payload !== 'object') return '';
  visited.add(payload);
  if (Array.isArray(payload)) {
    for (const item of payload) {
      const found = findAudioUrl(item, visited, excludedUrls);
      if (found) return found;
    }
    return '';
  }

  const obj = payload as Record<string, unknown>;
  const isCloneInputParameters =
    typeof obj.audio_url === 'string' &&
    typeof obj.text === 'string' &&
    typeof obj.model === 'string' &&
    !('output_url' in obj) &&
    !('result_url' in obj) &&
    !('preview_url' in obj);
  if (isCloneInputParameters) return '';

  const previewAudioUrl = findAudioUrlFromPreview(obj, excludedUrls);
  if (previewAudioUrl) return previewAudioUrl;

  for (const key of AUDIO_URL_KEYS) {
    const value = obj[key];
    if (isHttpUrl(value) && !excludedUrls.has(value.trim())) return value.trim();
    const found = findAudioUrl(value, visited, excludedUrls);
    if (found) return found;
  }

  const contentType = String(obj.content_type ?? obj.type ?? obj.mime_type ?? '').toLowerCase();
  if (contentType.includes('audio') || contentType.includes('voice')) {
    for (const value of Object.values(obj)) {
      if (isHttpUrl(value) && !excludedUrls.has(value.trim())) return value.trim();
      const found = findAudioUrl(value, visited, excludedUrls);
      if (found) return found;
    }
  }

  for (const value of Object.values(obj)) {
    const found = findAudioUrl(value, visited, excludedUrls);
    if (found) return found;
  }
  return '';
}

function findAudioUrlFromPreview(obj: Record<string, unknown>, excludedUrls = new Set<string>()): string {
  const preview = obj.preview;
  if (!Array.isArray(preview)) return '';
  for (const item of preview) {
    if (!item || typeof item !== 'object') continue;
    const rec = item as Record<string, unknown>;
    const resultItems = rec.result_items;
    if (!Array.isArray(resultItems)) continue;
    for (const resultItem of resultItems) {
      if (!resultItem || typeof resultItem !== 'object') continue;
      const result = resultItem as Record<string, unknown>;
      const url = typeof result.url === 'string' ? result.url.trim() : '';
      const contentType = String(result.content_type ?? result.type ?? '').toLowerCase();
      if (url && /^https?:\/\//i.test(url) && !excludedUrls.has(url) && (contentType.includes('audio') || contentType.includes('voice'))) {
        return url;
      }
    }
  }
  return '';
}

function normalizeStatus(statusRaw: string, audioUrl: string): 'processing' | 'succeeded' | 'failed' | 'submitted' {
  if (audioUrl) return 'succeeded';
  if (['failed', 'error', 'cancelled', 'canceled', 'fail', '-1', '0'].includes(statusRaw)) return 'failed';
  if (['succeeded', 'success', 'completed', 'complete', 'done', 'finish', 'finished', 'ok', '2', '3', 'succeed'].includes(statusRaw)) {
    return 'submitted';
  }
  return 'processing';
}

async function parseResponse(res: Response): Promise<unknown> {
  const text = await res.text();
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function errorText(data: unknown, fallback: string): string {
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    return String(obj.message || obj.error || obj.msg || fallback);
  }
  return typeof data === 'string' && data ? data : fallback;
}

export async function POST(req: NextRequest) {
  let body: {
    mode?: 'describe' | 'clone';
    prompt?: string;
    preview_text?: string;
    audio_url?: string;
    model?: string;
    text?: string;
    callback_url?: string;
    user_id?: string;
    app_id?: string;
    tenant_id?: string;
    api_key?: string;
    model_version_id?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: '请求体须为 JSON' }, { status: 400 });
  }

  const mode = body.mode === 'clone' ? 'clone' : 'describe';
  const prompt = (body.prompt || '').trim();
  const previewText = (body.preview_text || '').trim();
  const audioUrl = (body.audio_url || '').trim();
  const cloneModel = (body.model || 'speech-2.8-hd').trim();
  const cloneText = (body.text || '').trim();

  if (mode === 'clone') {
    if (!/^https?:\/\//i.test(audioUrl)) return NextResponse.json({ error: 'audio_url 必须是 http(s) 地址' }, { status: 400 });
    if (!cloneText) return NextResponse.json({ error: 'text 必填' }, { status: 400 });
  } else {
    if (!prompt) return NextResponse.json({ error: 'prompt 必填' }, { status: 400 });
    if (!previewText) return NextResponse.json({ error: 'preview_text 必填' }, { status: 400 });
  }

  const payload = {
    tenant_id: (body.tenant_id || process.env.VOICE_TEST_TENANT_ID || 'test').trim(),
    user_id: (body.user_id || process.env.VOICE_TEST_USER_ID || 'evan').trim(),
    app_id: (body.app_id || process.env.VOICE_TEST_APP_ID || '123').trim(),
    app_kind: process.env.VOICE_TEST_APP_KIND?.trim() || 'imagent',
    aigc_category: mode === 'clone' ? 'voice_cloning' : 'voice_design',
    callback_url:
      (body.callback_url || process.env.VOICE_TEST_CALLBACK_URL || process.env.AIGC_CALLBACK_URL || DEFAULT_CALLBACK_URL).trim(),
    model_version_id: (
      body.model_version_id ||
      (mode === 'clone' ? process.env.VOICE_CLONING_MODEL_VERSION_ID : process.env.VOICE_TEST_MODEL_VERSION_ID) ||
      (mode === 'clone' ? 'voice-cloning' : 'voice-design')
    ).trim(),
    input_images: [],
    parameters:
      mode === 'clone'
        ? {
            audio_url: audioUrl,
            model: cloneModel,
            text: cloneText,
          }
        : {
            prompt,
            preview_text: previewText,
          },
  };

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const apiKey = (body.api_key || process.env.VOICE_TEST_API_KEY || process.env.AIGC_API_KEY || '').trim();
  if (apiKey) headers.Authorization = apiKey.startsWith('Bearer ') ? apiKey : `Bearer ${apiKey}`;

  let res: Response;
  try {
    res = await fetch(process.env.VOICE_TEST_CREATE_URL?.trim() || process.env.AIGC_CREATE_URL?.trim() || DEFAULT_CREATE_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : '创建任务失败' }, { status: 502 });
  }

  const data = await parseResponse(res);
  if (!res.ok) {
    return NextResponse.json({ error: errorText(data, res.statusText), upstream_status: res.status }, { status: res.status >= 400 ? res.status : 502 });
  }

  const taskId = findTaskIdDeep(data);
  if (!taskId) {
    return NextResponse.json(
      {
        error: `上游未返回 task_id，请检查 ${mode === 'clone' ? 'voice_cloning' : 'voice_design'} 创建任务响应。`,
        raw: process.env.NODE_ENV === 'development' ? data : undefined,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    task_id: taskId,
    audio_url: mode === 'clone' ? null : findAudioUrl(data) || null,
    raw: process.env.NODE_ENV === 'development' ? data : undefined,
  });
}

export async function GET(req: NextRequest) {
  const taskId = req.nextUrl.searchParams.get('task_id')?.trim();
  if (!taskId) return NextResponse.json({ error: '缺少 query: task_id' }, { status: 400 });
  const excludedAudioUrl = req.nextUrl.searchParams.get('exclude_audio_url')?.trim();
  const excludedUrls = new Set<string>(excludedAudioUrl ? [excludedAudioUrl] : []);

  const pollUrl = req.nextUrl.searchParams.get('poll_url')?.trim();
  const queryTemplate = pollUrl
    ? decodeURIComponent(pollUrl)
    : process.env.VOICE_TEST_QUERY_URL?.trim() || process.env.AIGC_TASK_QUERY_URL?.trim() || DEFAULT_QUERY_URL;
  const encodedTaskId = encodeURIComponent(taskId);
  const url = queryTemplate.includes('{task_id}')
    ? queryTemplate.replace(/\{task_id\}/g, encodedTaskId)
    : `${queryTemplate.replace(/\/+$/, '')}/${encodedTaskId}`;

  const headers: Record<string, string> = {};
  const apiKey = req.nextUrl.searchParams.get('api_key')?.trim() || process.env.VOICE_TEST_API_KEY?.trim() || process.env.AIGC_API_KEY?.trim();
  if (apiKey) headers.Authorization = apiKey.startsWith('Bearer ') ? apiKey : `Bearer ${apiKey}`;

  let res: Response;
  try {
    res = await fetch(url, { method: 'GET', headers });
  } catch (error) {
    return NextResponse.json({ status: 'failed', error: error instanceof Error ? error.message : '查询任务失败' }, { status: 502 });
  }

  const data = await parseResponse(res);
  if (!res.ok) {
    return NextResponse.json({ status: 'failed', error: errorText(data, res.statusText) }, { status: res.status >= 400 ? res.status : 502 });
  }

  const audioUrl = findAudioUrl(data, new Set<unknown>(), excludedUrls);
  const rawStatus = takeStatus(data);
  const status = normalizeStatus(rawStatus, audioUrl);
  return NextResponse.json({
    status,
    audio_url: audioUrl || null,
    error: status === 'failed' ? errorText(data, '生成失败') : null,
    hint: status === 'submitted' ? '任务已完成但查询接口未返回音频地址，请检查 callback_url 回调或查询响应字段。' : null,
    raw_status: rawStatus,
    raw: process.env.NODE_ENV === 'development' ? data : undefined,
  });
}
