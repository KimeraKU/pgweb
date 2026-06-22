'use client';

import { ChangeEvent, useMemo, useRef, useState } from 'react';
import { CheckCircle2, Copy, ImagePlus, Loader2, Play, Trash2, UploadCloud, XCircle } from 'lucide-react';
import { uploadCrevibeImages } from '@/lib/crevibe-upload';

type ItemStatus = 'queued' | 'uploading' | 'uploaded' | 'creating' | 'done' | 'failed';

interface BatchItem {
  id: string;
  file: File;
  previewUrl: string;
  imageUrl?: string;
  taskId?: string;
  status: ItemStatus;
  error?: string;
  raw?: unknown;
}

const statusLabel: Record<ItemStatus, string> = {
  queued: '待上传',
  uploading: '上传中',
  uploaded: '已上传',
  creating: '创建任务中',
  done: '已获得 tk-id',
  failed: '失败',
};

function makeItem(file: File): BatchItem {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    file,
    previewUrl: URL.createObjectURL(file),
    status: 'queued',
  };
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error || '未知错误');
}

export default function IntentRecognitionPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<BatchItem[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const summary = useMemo(() => {
    const total = items.length;
    const done = items.filter((item) => item.status === 'done').length;
    const failed = items.filter((item) => item.status === 'failed').length;
    const pending = total - done - failed;
    return { total, done, failed, pending };
  }, [items]);

  const setItem = (id: string, patch: Partial<BatchItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    if (!imageFiles.length) return;
    setItems((prev) => [...prev, ...imageFiles.map(makeItem)]);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFiles(Array.from(event.target.files || []));
    event.target.value = '';
  };

  const clearItems = () => {
    items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setItems([]);
    setCopied(false);
  };

  const runBatch = async () => {
    if (isRunning || items.length === 0) return;
    setIsRunning(true);
    setCopied(false);

    const snapshot = items.slice();
    for (const item of snapshot) {
      if (item.status === 'done') continue;
      try {
        setItem(item.id, { status: 'uploading', error: undefined });
        const [imageUrl] = await uploadCrevibeImages([item.file]);
        setItem(item.id, { status: 'creating', imageUrl });

        const res = await fetch('/api/intent-recognition/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image_url: imageUrl }),
        });
        const data = (await res.json()) as { task_id?: string; error?: string; raw?: unknown };
        if (!res.ok) throw new Error(data.error || `创建任务失败 ${res.status}`);
        setItem(item.id, {
          status: 'done',
          taskId: data.task_id || '',
          raw: data.raw,
        });
      } catch (error) {
        setItem(item.id, { status: 'failed', error: getErrorMessage(error) });
      }
    }

    setIsRunning(false);
  };

  const copyResults = async () => {
    const lines = items
      .map((item) => item.taskId?.trim())
      .filter((taskId): taskId is string => Boolean(taskId));
    await navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-teal-700">PhotoGridImageEnhancer</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-normal text-slate-950">批量图片意图识别</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              批量上传图片后，页面会先走项目里的 Crevibe 图片上传接口拿到 URL，再按单图创建 text_to_text 意图识别任务。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={copyResults}
              disabled={items.length === 0}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-50"
            >
              <Copy className="h-4 w-4" />
              {copied ? '已复制' : '复制结果'}
            </button>
            <button
              type="button"
              onClick={clearItems}
              disabled={isRunning || items.length === 0}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              清空
            </button>
            <button
              type="button"
              onClick={runBatch}
              disabled={isRunning || items.length === 0}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-teal-600 px-5 text-sm font-semibold text-white shadow-sm shadow-teal-600/20 transition hover:bg-teal-700 disabled:pointer-events-none disabled:opacity-50"
            >
              {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              开始请求
            </button>
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-[minmax(320px,0.38fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              onDrop={(event) => {
                event.preventDefault();
                handleFiles(Array.from(event.dataTransfer.files || []));
              }}
              onDragOver={(event) => event.preventDefault()}
              className="flex min-h-[260px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-5 py-8 text-center transition hover:border-teal-400 hover:bg-teal-50/40"
            >
              <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleInputChange} />
              <UploadCloud className="h-10 w-10 text-teal-600" />
              <span className="mt-4 text-base font-semibold text-slate-900">上传或拖放图片</span>
              <span className="mt-2 text-sm leading-6 text-slate-500">支持多选，本页会逐张上传并创建意图识别任务。</span>
            </button>

            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <h2 className="text-sm font-semibold text-slate-900">当前批次</h2>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-slate-50 p-3">
                  <dt className="text-slate-500">总数</dt>
                  <dd className="mt-1 text-xl font-semibold text-slate-950">{summary.total}</dd>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <dt className="text-slate-500">处理中</dt>
                  <dd className="mt-1 text-xl font-semibold text-slate-950">{summary.pending}</dd>
                </div>
                <div className="rounded-lg bg-emerald-50 p-3">
                  <dt className="text-emerald-700">成功</dt>
                  <dd className="mt-1 text-xl font-semibold text-emerald-800">{summary.done}</dd>
                </div>
                <div className="rounded-lg bg-rose-50 p-3">
                  <dt className="text-rose-700">失败</dt>
                  <dd className="mt-1 text-xl font-semibold text-rose-800">{summary.failed}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="min-h-[420px] rounded-lg border border-slate-200 bg-white">
            {items.length === 0 ? (
              <div className="flex h-full min-h-[420px] flex-col items-center justify-center px-6 text-center text-slate-500">
                <ImagePlus className="h-10 w-10 text-slate-300" />
                <p className="mt-3 text-sm">还没有图片，先选择一个批次。</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {items.map((item, index) => (
                  <article key={item.id} className="grid gap-4 p-4 md:grid-cols-[96px_minmax(0,1fr)_minmax(220px,0.42fr)]">
                    <div className="relative h-24 w-24 overflow-hidden rounded-lg bg-slate-100">
                      <img src={item.previewUrl} alt="" className="h-full w-full object-cover" />
                      <span className="absolute left-1.5 top-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[11px] font-medium text-white">
                        #{index + 1}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="max-w-full truncate text-sm font-semibold text-slate-900">{item.file.name}</h3>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                          {(item.file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                      <div className="mt-3 space-y-2 text-xs leading-5 text-slate-500">
                        <p className="truncate">
                          <span className="font-medium text-slate-700">图片 URL：</span>
                          {item.imageUrl || '-'}
                        </p>
                        <p className="truncate">
                          <span className="font-medium text-slate-700">tk-id：</span>
                          {item.taskId || '-'}
                        </p>
                        {item.error && <p className="text-rose-600">{item.error}</p>}
                      </div>
                    </div>

                    <div className="flex items-start justify-between gap-3 md:justify-end">
                      <span
                        className={[
                          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
                          item.status === 'done'
                            ? 'bg-emerald-50 text-emerald-700'
                            : item.status === 'failed'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-sky-50 text-sky-700',
                        ].join(' ')}
                      >
                        {item.status === 'done' ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : item.status === 'failed' ? (
                          <XCircle className="h-3.5 w-3.5" />
                        ) : item.status === 'queued' || item.status === 'uploaded' ? null : (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        )}
                        {statusLabel[item.status]}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
