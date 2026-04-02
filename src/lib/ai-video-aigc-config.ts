/** AI 视频页 AIGC 配置（存浏览器，无需 .env 即可调试） */
export const AIVIDEO_AIGC_STORAGE_KEY = 'ai-video-aigc-config-v1';

/** 与文生视频 curl 一致，未配置时使用的默认值 */
export const AIVIDEO_AIGC_DEFAULTS: Pick<AivideoAigcConfig, 'callback_url' | 'user_id' | 'app_id' | 'tenant_id'> = {
  callback_url: 'http://47.89.173.41:22356',
  user_id: 'pg001',
  app_id: 'phorogrid',
  tenant_id: 'pgtest',
};

export type AivideoAigcConfig = {
  callback_url: string;
  user_id: string;
  app_id?: string;
  tenant_id?: string;
  model_version_id?: string;
  /** 轮询地址，须含 {task_id}，如 https://xxx?task_id={task_id} */
  task_query_url?: string;
  /** 可选，作为 Authorization Bearer */
  api_key?: string;
};

export function loadAivideoAigcConfig(): Partial<AivideoAigcConfig> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(AIVIDEO_AIGC_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<AivideoAigcConfig>;
  } catch {
    return {};
  }
}

export function saveAivideoAigcConfig(c: AivideoAigcConfig) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AIVIDEO_AIGC_STORAGE_KEY, JSON.stringify(c));
}

export function aigcConfigReady(c: Partial<AivideoAigcConfig>): boolean {
  return Boolean(c.callback_url?.trim() && c.user_id?.trim());
}

/** 表单优先，再读 localStorage，再回退到默认（避免「填了接口设置但没点保存」时生成不带参） */
export function mergeAigcFormWithStored(form: Partial<AivideoAigcConfig>): Partial<AivideoAigcConfig> {
  const s = loadAivideoAigcConfig();
  const pick = (fa?: string, sb?: string, def?: string) => {
    const a = (fa ?? '').trim();
    const b = (sb ?? '').trim();
    const d = (def ?? '').trim();
    return a || b || d || undefined;
  };
  return {
    callback_url: pick(form.callback_url, s.callback_url, AIVIDEO_AIGC_DEFAULTS.callback_url),
    user_id: pick(form.user_id, s.user_id, AIVIDEO_AIGC_DEFAULTS.user_id),
    app_id: pick(form.app_id, s.app_id, AIVIDEO_AIGC_DEFAULTS.app_id),
    tenant_id: pick(form.tenant_id, s.tenant_id, AIVIDEO_AIGC_DEFAULTS.tenant_id),
    model_version_id: pick(form.model_version_id, s.model_version_id),
    task_query_url: pick(form.task_query_url, s.task_query_url),
    api_key: pick(form.api_key, s.api_key),
  };
}
