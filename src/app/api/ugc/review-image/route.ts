import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_DOUBAO_BASE_URL = 'https://nexus.fashionlabs.cn';
const DEFAULT_GROUP_NAME = 'ugc-video-review-assets';
const DEFAULT_PROJECT_NAME = 'default';
const DEFAULT_UID = 'pg001';
const DEFAULT_GROUP_DESCRIPTION = 'UGC 视频生成图片审核分组';

type JsonRecord = Record<string, unknown>;

function asObject(value: unknown): JsonRecord | null {
  return value && typeof value === 'object' ? (value as JsonRecord) : null;
}

function pickResult(payload: unknown): JsonRecord | null {
  const root = asObject(payload);
  if (!root) return null;
  const data = asObject(root.data);
  const result = asObject(data?.Result) || asObject(data?.result);
  return result;
}

function pickMessage(payload: unknown): string {
  const root = asObject(payload);
  if (!root) return '';
  const message = typeof root.message === 'string' ? root.message.trim() : '';
  if (message) return message;
  const data = asObject(root.data);
  const error = asObject(data?.Error) || asObject(data?.error);
  const errorMessage = typeof error?.Message === 'string' ? error.Message.trim() : typeof error?.message === 'string' ? error.message.trim() : '';
  return errorMessage;
}

function normalizeStatus(status: unknown): 'Active' | 'Failed' | 'Processing' | 'Unknown' {
  if (typeof status !== 'string') return 'Unknown';
  const s = status.trim().toLowerCase();
  if (s === 'active') return 'Active';
  if (s === 'failed') return 'Failed';
  if (s === 'processing') return 'Processing';
  return 'Unknown';
}

async function doubaoPost(
  baseUrl: string,
  path: string,
  token: string,
  body: JsonRecord
): Promise<{ ok: boolean; status: number; payload: unknown; text: string }> {
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: {
      Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let payload: unknown = text;
  try {
    payload = JSON.parse(text) as unknown;
  } catch {
    // keep plain text
  }
  return { ok: res.ok, status: res.status, payload, text };
}

async function ensureGroupId(baseUrl: string, token: string, projectName: string, uid: string): Promise<string> {
  const groupIdFromEnv = process.env.DOUBAO_ASSET_GROUP_ID?.trim();
  if (groupIdFromEnv) return groupIdFromEnv;

  const groupName = process.env.DOUBAO_ASSET_GROUP_NAME?.trim() || DEFAULT_GROUP_NAME;
  const groupDescription = process.env.DOUBAO_ASSET_GROUP_DESCRIPTION?.trim() || DEFAULT_GROUP_DESCRIPTION;

  const createRes = await doubaoPost(baseUrl, '/api/v1/doubao/asset/group/create', token, {
    name: groupName,
    description: groupDescription,
    group_type: 'AIGC',
    project_name: projectName,
    uid,
  });
  const createResult = pickResult(createRes.payload);
  const createdId = typeof createResult?.Id === 'string' ? createResult.Id.trim() : '';
  if (createRes.ok && createdId) return createdId;

  const listRes = await doubaoPost(baseUrl, '/api/v1/doubao/asset/group/list', token, {
    filters: {
      name: groupName,
      group_type: 'AIGC',
    },
    page_number: 1,
    page_size: 20,
    project_name: projectName,
    uid,
  });
  const listResult = pickResult(listRes.payload);
  const items = Array.isArray(listResult?.Items) ? (listResult?.Items as unknown[]) : [];
  const match = items
    .map((item) => asObject(item))
    .find((item) => item && typeof item.Name === 'string' && item.Name.trim() === groupName);
  const listedId = match && typeof match.Id === 'string' ? match.Id.trim() : '';
  if (listRes.ok && listedId) return listedId;

  throw new Error(
    pickMessage(createRes.payload) ||
      pickMessage(listRes.payload) ||
      '无法创建或获取 Doubao 资产审核分组，请检查 DOUBAO_ASSET_GROUP_ID/权限配置'
  );
}

export async function POST(req: NextRequest) {
  let body: {
    image_url?: string;
    name?: string;
    project_name?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON 无效' }, { status: 400 });
  }

  const imageUrl = (body.image_url || '').trim();
  if (!/^https?:\/\//i.test(imageUrl)) {
    return NextResponse.json({ error: 'image_url 必须是 http(s) 地址' }, { status: 400 });
  }

  const token =
    process.env.DOUBAO_ASSET_API_KEY?.trim() ||
    process.env.IMA_PRO_API_KEY?.trim() ||
    process.env.AIGC_API_KEY?.trim();
  if (!token) {
    return NextResponse.json(
      { error: '缺少 Doubao 鉴权 token，请配置 DOUBAO_ASSET_API_KEY（或复用 IMA_PRO_API_KEY）' },
      { status: 501 }
    );
  }

  const baseUrl = (process.env.DOUBAO_ASSET_BASE_URL?.trim() || DEFAULT_DOUBAO_BASE_URL).replace(/\/+$/, '');
  const projectName = (body.project_name || process.env.DOUBAO_ASSET_PROJECT_NAME || DEFAULT_PROJECT_NAME).trim();
  const uid =
    process.env.DOUBAO_ASSET_UID?.trim() ||
    process.env.IMA_PRO_USER_ID?.trim() ||
    process.env.AIGC_USER_ID?.trim() ||
    DEFAULT_UID;
  const assetName = (body.name || `ugc-review-${Date.now()}`).trim().slice(0, 64) || `ugc-review-${Date.now()}`;

  try {
    const groupId = await ensureGroupId(baseUrl, token, projectName, uid);
    const syncRes = await doubaoPost(baseUrl, '/api/v1/doubao/asset/sync/create', token, {
      group_id: groupId,
      url: imageUrl,
      name: assetName,
      asset_type: 'Image',
      project_name: projectName,
      uid,
    });

    if (!syncRes.ok) {
      return NextResponse.json(
        {
          passed: false,
          status: 'Failed',
          reason: pickMessage(syncRes.payload) || `审核请求失败 (${syncRes.status})`,
          raw: process.env.NODE_ENV === 'development' ? syncRes.payload : undefined,
        },
        { status: syncRes.status >= 400 ? syncRes.status : 502 }
      );
    }

    const result = pickResult(syncRes.payload);
    const status = normalizeStatus(result?.Status);
    const assetId = typeof result?.Id === 'string' ? result.Id.trim() : '';
    const errorObj = asObject(result?.Error);
    const errorMessage =
      (typeof errorObj?.Message === 'string' ? errorObj.Message.trim() : '') ||
      (typeof errorObj?.message === 'string' ? errorObj.message.trim() : '') ||
      pickMessage(syncRes.payload);

    if (status === 'Active' && assetId) {
      return NextResponse.json({
        passed: true,
        status,
        asset_id: assetId,
        asset_uri: `asset://${assetId}`,
      });
    }

    if (status === 'Failed') {
      return NextResponse.json({
        passed: false,
        status,
        reason: errorMessage || '图片审核失败',
      });
    }

    return NextResponse.json({
      passed: false,
      status,
      reason: status === 'Processing' ? '图片审核超时，当前仍在处理中，请稍后重试' : '图片审核未通过',
      raw: process.env.NODE_ENV === 'development' ? syncRes.payload : undefined,
    });
  } catch (error) {
    return NextResponse.json(
      {
        passed: false,
        status: 'Failed',
        reason: error instanceof Error ? error.message : '图片审核失败',
      },
      { status: 502 }
    );
  }
}
