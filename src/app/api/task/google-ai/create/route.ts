import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_URL = 'https://artface.linkv.live/api/v1/task/google_ai/create';

function pickTaskId(data: Record<string, unknown>): string {
  const nested = typeof data.data === 'object' && data.data !== null ? (data.data as Record<string, unknown>) : null;
  return (
    (data.task_id as string) ||
    (data.taskId as string) ||
    (data.id as string) ||
    (nested?.task_id as string) ||
    (nested?.id as string) ||
    ''
  );
}

function pickImageUrl(data: Record<string, unknown>): string | undefined {
  const nested = typeof data.data === 'object' && data.data !== null ? (data.data as Record<string, unknown>) : null;
  const d = nested || data;
  return (
    (d.image_url as string) ||
    (d.output_url as string) ||
    (d.result_url as string) ||
    (typeof d.result === 'string' ? d.result : undefined)
  );
}

/**
 * 代理 Artface Google AI 图生图创建任务。
 * 与 curl: POST .../api/v1/task/google_ai/create 对齐。
 *
 * id_task 与回调策略：
 * - 客户端在创建时传 id_task（如 curl 示例：abcd-1234-aabbccdd-abcde-1234578-a-googleAi-100-627）。
 * - 上游完成后会 POST 到 data.callback_url，回调体里一般会带上该 id_task（或服务端返回的 task_id），
 *   接收方用 id_task 把回调结果与本次创建请求一一对应。
 * - 未传 id_task 时本路由自动生成：gemini-{timestamp}-{random}。
 *
 * 环境变量：AIGC_USER_ID、AIGC_CALLBACK_URL（写入 data.callback_url）；
 * 可选 GOOGLE_AI_CREATE_URL、GOOGLE_AI_APP_ID（默认 test）、AIGC_API_KEY。
 */
export async function POST(req: NextRequest) {
  const createUrl = process.env.GOOGLE_AI_CREATE_URL?.trim() || DEFAULT_URL;
  const user_id = process.env.AIGC_USER_ID?.trim();
  const callback_url = process.env.AIGC_CALLBACK_URL?.trim();

  if (!user_id) {
    return NextResponse.json({ error: '请配置 AIGC_USER_ID' }, { status: 501 });
  }
  if (!callback_url) {
    return NextResponse.json({ error: '请配置 AIGC_CALLBACK_URL（将写入 data.callback_url）' }, { status: 501 });
  }

  let body: {
    id_task?: string;
    prompt?: string;
    task_type?: string;
    model_name?: string;
    input_img_urls?: string[];
    parameters?: Record<string, unknown>;
    app_kind?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON 无效' }, { status: 400 });
  }

  const prompt = (body.prompt || '').trim();
  if (!prompt) {
    return NextResponse.json({ error: 'prompt 必填' }, { status: 400 });
  }

  const input_img_urls = Array.isArray(body.input_img_urls)
    ? body.input_img_urls.filter((u): u is string => typeof u === 'string' && u.length > 0)
    : [];
  if (input_img_urls.length === 0) {
    return NextResponse.json({ error: 'input_img_urls 至少一张图 URL' }, { status: 400 });
  }

  const id_task =
    body.id_task?.trim() ||
    `gemini-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  const app_id = process.env.GOOGLE_AI_APP_ID?.trim() || process.env.AIGC_APP_ID?.trim() || 'test';

  const payload = {
    app_id,
    app_kind: body.app_kind?.trim() || 'imagent',
    id_task,
    user_id,
    data: {
      callback_url,
      prompt,
      task_type: body.task_type?.trim() || 'gemini',
      model_name: body.model_name?.trim() || 'gemini-2.5-flash-image',
      input_img_urls,
      parameters:
        body.parameters && typeof body.parameters === 'object' && !Array.isArray(body.parameters)
          ? body.parameters
          : { aspectRatio: '16:9' },
    },
  };

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const key = process.env.AIGC_API_KEY?.trim();
  if (key) headers.Authorization = key.startsWith('Bearer ') ? key : `Bearer ${key}`;

  let res: Response;
  try {
    res = await fetch(createUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: `请求失败: ${msg}` }, { status: 502 });
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
      text ||
      res.statusText;
    return NextResponse.json({ error: err, upstream_status: res.status }, { status: res.status >= 400 ? res.status : 502 });
  }

  const task_id = pickTaskId(data);
  const image_url = pickImageUrl(data);

  return NextResponse.json({
    task_id: task_id || id_task,
    id_task,
    image_url: image_url || null,
    raw: process.env.NODE_ENV === 'development' ? data : undefined,
  });
}
