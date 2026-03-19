/**
 * 通过本服务代理上传到 Crevibe batch_upload_images，返回可给下游图生图 / 图生视频用的 URL。
 */
export async function uploadCrevibeImages(files: File[]): Promise<string[]> {
  if (files.length === 0) return [];
  const fd = new FormData();
  for (const f of files) {
    fd.append('images', f, f.name || 'image.jpg');
  }
  const res = await fetch('/api/upload/crevibe-batch-images', {
    method: 'POST',
    body: fd,
  });
  const j = (await res.json()) as { urls?: string[]; error?: string };
  if (!res.ok) {
    throw new Error(j.error || `上传失败 ${res.status}`);
  }
  if (!j.urls?.length) {
    throw new Error(j.error || '未返回 URL');
  }
  return j.urls;
}
