'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  Copy,
  Download,
  FileAudio,
  Loader2,
  Maximize2,
  Mic2,
  RefreshCw,
  Sparkles,
  Trash2,
  Wand2,
  X,
} from 'lucide-react';

type VoiceMode = 'describe' | 'clone';
type HistoryFilter = 'all' | VoiceMode;
type TaskStatus = 'pending' | 'processing' | 'succeeded' | 'failed' | 'submitted';

interface VoiceTask {
  id: string;
  mode: VoiceMode;
  prompt: string;
  previewText: string;
  createdAt: number;
  status: TaskStatus;
  cloneAudioUrl?: string;
  cloneModel?: string;
  remoteTaskId?: string;
  audioUrl?: string;
  errorMessage?: string;
}

const STORAGE_KEY = 'voice-test-history-v1';
const POLL_MAX = 120;

const DEFAULT_PROMPT = '温柔女声';
const DEFAULT_PREVIEW_TEXT =
  '15秒电影级环球旅行MV，首帧为自然真实的环境开场，通过镜头缓慢推进自然引出主角进入画面，节奏柔和，整体色彩统一为高级通透旅行风。';
const DEFAULT_CLONE_TEXT = '你好，欢迎使用声音克隆试听功能。这是一段用于验证音色效果的示例口播。';
const CLONE_MODEL_OPTIONS = [
  'speech-2.8-hd',
  'speech-2.8-turbo',
  'speech-2.6-hd',
  'speech-2.6-turbo',
  'speech-02-hd',
  'speech-02-turbo',
  'speech-01-hd',
  'speech-01-turbo',
] as const;

const uiFocus =
  'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600';
const uiInput =
  `w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition ${uiFocus}`;
const uiTextarea =
  `w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm leading-6 text-slate-900 placeholder:text-slate-400 shadow-sm transition ${uiFocus}`;
const uiPrimary =
  'inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 text-sm font-semibold text-white shadow-md shadow-teal-600/20 transition hover:bg-teal-700 disabled:pointer-events-none disabled:opacity-50 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600';
const uiSecondary =
  `inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50 ${uiFocus}`;
const uiIconBtn =
  `inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 ${uiFocus}`;

function loadHistory(): VoiceTask[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as VoiceTask[];
    return Array.isArray(parsed)
      ? parsed.slice(-80).map((item) => ({
          ...item,
          mode: item.mode === 'clone' ? 'clone' : 'describe',
        }))
      : [];
  } catch {
    return [];
  }
}

function saveHistory(tasks: VoiceTask[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks.slice(-80)));
  } catch {
    /* ignore */
  }
}

function isGenerating(status: TaskStatus) {
  return status === 'pending' || status === 'processing';
}

function timeAgo(ts: number) {
  const seconds = Math.floor((Date.now() - ts) / 1000);
  if (seconds < 60) return '刚刚';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} 分钟前`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} 小时前`;
  return `${Math.floor(seconds / 86400)} 天前`;
}

export default function VoiceTestPage() {
  const [mode, setMode] = useState<VoiceMode>('describe');
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [previewText, setPreviewText] = useState(DEFAULT_PREVIEW_TEXT);
  const [cloneAudioUrl, setCloneAudioUrl] = useState('');
  const [cloneModel, setCloneModel] = useState<(typeof CLONE_MODEL_OPTIONS)[number]>('speech-2.8-hd');
  const [cloneText, setCloneText] = useState(DEFAULT_CLONE_TEXT);
  const [tasks, setTasks] = useState<VoiceTask[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>('all');
  const [submitting, setSubmitting] = useState(false);
  const [uploadingCloneAudio, setUploadingCloneAudio] = useState(false);
  const [cloneUploadError, setCloneUploadError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [promptModalOpen, setPromptModalOpen] = useState(false);

  const pollTimersRef = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());
  const pollCountRef = useRef<Map<string, number>>(new Map());
  const selectedTask = useMemo(
    () => tasks.find((item) => item.id === selectedId) || tasks[tasks.length - 1] || null,
    [selectedId, tasks]
  );
  const filteredTasks = useMemo(
    () => tasks.filter((item) => historyFilter === 'all' || item.mode === historyFilter),
    [historyFilter, tasks]
  );

  useEffect(() => {
    const loaded = loadHistory();
    setTasks(loaded);
    setSelectedId(loaded[loaded.length - 1]?.id || null);
  }, []);

  useEffect(() => {
    saveHistory(tasks);
  }, [tasks]);

  useEffect(() => {
    return () => {
      pollTimersRef.current.forEach((timer) => clearInterval(timer));
      pollTimersRef.current.clear();
    };
  }, []);

  const stopPoll = (localId: string) => {
    const timer = pollTimersRef.current.get(localId);
    if (timer) clearInterval(timer);
    pollTimersRef.current.delete(localId);
    pollCountRef.current.delete(localId);
  };

  const startPoll = (localId: string, taskId: string, excludeAudioUrl?: string) => {
    pollCountRef.current.set(localId, 0);
    const tick = async () => {
      const count = (pollCountRef.current.get(localId) || 0) + 1;
      pollCountRef.current.set(localId, count);
      if (count > POLL_MAX) {
        stopPoll(localId);
        setTasks((prev) =>
          prev.map((item) =>
            item.id === localId
              ? {
                  ...item,
                  status: 'submitted',
                  errorMessage: '轮询超时，任务仍可能通过服务端回调返回结果。',
                }
              : item
          )
        );
        return;
      }

      try {
        const query = new URLSearchParams({ task_id: taskId });
        if (excludeAudioUrl) query.set('exclude_audio_url', excludeAudioUrl);
        const res = await fetch(`/api/voice-test?${query.toString()}`);
        const data = (await res.json()) as {
          status?: TaskStatus;
          audio_url?: string | null;
          error?: string | null;
          hint?: string | null;
        };
        if (!res.ok) {
          stopPoll(localId);
          setTasks((prev) =>
            prev.map((item) =>
              item.id === localId ? { ...item, status: 'failed', errorMessage: data.error || `查询失败 (${res.status})` } : item
            )
          );
          return;
        }
        if (data.status === 'succeeded' && data.audio_url) {
          stopPoll(localId);
          setTasks((prev) =>
            prev.map((item) =>
              item.id === localId ? { ...item, status: 'succeeded', audioUrl: data.audio_url || undefined } : item
            )
          );
          return;
        }
        if (data.status === 'failed' || data.status === 'submitted') {
          stopPoll(localId);
          setTasks((prev) =>
            prev.map((item) =>
              item.id === localId
                ? { ...item, status: data.status || 'submitted', errorMessage: data.error || data.hint || '未返回音频地址' }
                : item
            )
          );
        }
      } catch {
        stopPoll(localId);
        setTasks((prev) =>
          prev.map((item) => (item.id === localId ? { ...item, status: 'failed', errorMessage: '网络异常' } : item))
        );
      }
    };
    void tick();
    pollTimersRef.current.set(localId, setInterval(() => void tick(), 3000));
  };

  const createTask = async (source?: VoiceTask) => {
    const nextMode = source ? source.mode || 'describe' : mode;
    const nextPrompt = (source?.prompt || prompt).trim();
    const nextPreviewText = (source?.previewText || previewText).trim();
    const nextCloneAudioUrl = (source?.cloneAudioUrl || cloneAudioUrl).trim();
    const nextCloneModel = (source?.cloneModel || cloneModel).trim();
    const nextCloneText = (source?.previewText || cloneText).trim();
    if (submitting) return;
    if (nextMode === 'clone') {
      if (!/^https?:\/\//i.test(nextCloneAudioUrl) || !nextCloneText) return;
    } else if (!nextPrompt || !nextPreviewText) {
      return;
    }

    const localId = `voice-${Date.now()}`;
    const newTask: VoiceTask = {
      id: localId,
      mode: nextMode,
      prompt: nextMode === 'clone' ? `克隆试听 · ${nextCloneModel}` : nextPrompt,
      previewText: nextMode === 'clone' ? nextCloneText : nextPreviewText,
      cloneAudioUrl: nextMode === 'clone' ? nextCloneAudioUrl : undefined,
      cloneModel: nextMode === 'clone' ? nextCloneModel : undefined,
      createdAt: Date.now(),
      status: 'pending',
    };
    setTasks((prev) => [...prev, newTask]);
    setSelectedId(localId);
    setSubmitting(true);

    try {
      const res = await fetch('/api/voice-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          nextMode === 'clone'
            ? {
                mode: 'clone',
                audio_url: nextCloneAudioUrl,
                model: nextCloneModel,
                text: nextCloneText,
              }
            : {
                mode: 'describe',
                prompt: nextPrompt,
                preview_text: nextPreviewText,
              }
        ),
      });
      const data = (await res.json()) as { error?: string; task_id?: string; audio_url?: string | null };
      if (!res.ok || !data.task_id) {
        setTasks((prev) =>
          prev.map((item) =>
            item.id === localId ? { ...item, status: 'failed', errorMessage: data.error || `请求失败 (${res.status})` } : item
          )
        );
        return;
      }
      setTasks((prev) =>
        prev.map((item) =>
          item.id === localId
            ? {
                ...item,
                status: data.audio_url ? 'succeeded' : 'processing',
                remoteTaskId: data.task_id,
                audioUrl: data.audio_url || undefined,
              }
            : item
        )
      );
      if (!data.audio_url) startPoll(localId, data.task_id, nextMode === 'clone' ? nextCloneAudioUrl : undefined);
    } catch {
      setTasks((prev) =>
        prev.map((item) => (item.id === localId ? { ...item, status: 'failed', errorMessage: '网络错误' } : item))
      );
    } finally {
      setSubmitting(false);
    }
  };

  const deleteTask = (task: VoiceTask) => {
    stopPoll(task.id);
    setTasks((prev) => prev.filter((item) => item.id !== task.id));
    if (selectedId === task.id) {
      const next = tasks.filter((item) => item.id !== task.id);
      setSelectedId(next[next.length - 1]?.id || null);
    }
  };

  const copyTaskId = async (task: VoiceTask) => {
    const text = task.remoteTaskId || task.id;
    await navigator.clipboard.writeText(text);
    setCopiedId(task.id);
    setTimeout(() => setCopiedId(null), 1200);
  };

  const clearForm = () => {
    if (mode === 'clone') {
      setCloneAudioUrl('');
      setCloneText('');
      setCloneUploadError(null);
    } else {
      setPrompt('');
      setPreviewText('');
    }
  };

  const uploadCloneAudio = async (file: File) => {
    if (!file || uploadingCloneAudio) return;
    setUploadingCloneAudio(true);
    setCloneUploadError(null);
    try {
      const form = new FormData();
      form.append('file', file, file.name || 'voice.mp3');
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setCloneUploadError(data.error || `上传失败 (${res.status})`);
        return;
      }
      setCloneAudioUrl(data.url);
    } catch {
      setCloneUploadError('上传失败，请稍后重试');
    } finally {
      setUploadingCloneAudio(false);
    }
  };

  return (
    <main data-page="voice-test" className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-teal-700 ${uiFocus}`}
            >
              <ChevronLeft className="h-4 w-4" />
              返回
            </Link>
            <div>
              <h1 className="text-base font-semibold text-slate-950">Voice Test</h1>
              <p className="text-xs text-slate-500">voice_design 创建任务与结果回调验证</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700 sm:flex">
            <Mic2 className="h-3.5 w-3.5" />
            model_version_id: voice-design
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[360px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)_320px] lg:px-6">
        <aside className="min-h-[calc(100vh-7.5rem)] space-y-4">
          <section className="h-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setMode('describe')}
                className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition ${uiFocus} ${
                  mode === 'describe' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Wand2 className="h-4 w-4" />
                描述生成
              </button>
              <button
                type="button"
                onClick={() => setMode('clone')}
                className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition ${uiFocus} ${
                  mode === 'clone' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileAudio className="h-4 w-4" />
                克隆录音
              </button>
            </div>

            {mode === 'describe' ? (
              <div className="mt-4 space-y-4">
                <label className="block">
                  <span className="mb-1.5 flex items-center justify-between text-xs font-semibold text-slate-600">
                    <span>声音 Prompt</span>
                    <button
                      type="button"
                      onClick={() => setPromptModalOpen(true)}
                      className={`${uiIconBtn} h-7 w-7`}
                      title="放大编辑 Prompt"
                      aria-label="放大编辑声音 Prompt"
                    >
                      <Maximize2 className="h-3.5 w-3.5" />
                    </button>
                  </span>
                  <textarea
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    className={`${uiTextarea} min-h-[112px]`}
                    placeholder="例如：温柔女声、成熟男声、活泼童声"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 flex items-center justify-between text-xs font-semibold text-slate-600">
                    <span>示例声音口播</span>
                    <span className="font-normal text-slate-400">{previewText.length} 字</span>
                  </span>
                  <textarea
                    value={previewText}
                    onChange={(event) => setPreviewText(event.target.value)}
                    className={`${uiTextarea} min-h-[176px]`}
                    placeholder="输入用于试听的口播文案"
                  />
                </label>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <button type="button" onClick={clearForm} className={uiSecondary}>
                    <X className="h-4 w-4" />
                    清空
                  </button>
                  <button
                    type="button"
                    onClick={() => void createTask()}
                    disabled={submitting || !prompt.trim() || !previewText.trim()}
                    className={uiPrimary}
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    发起任务
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-slate-600">参考录音 URL</span>
                  <input
                    value={cloneAudioUrl}
                    onChange={(event) => setCloneAudioUrl(event.target.value)}
                    className={uiInput}
                    placeholder="https://example.com/voice.mp3"
                  />
                  <span className="mt-2 block text-xs leading-5 text-amber-700">
                    建议使用 10 秒以上、语音清晰、单人说话、背景噪声少的音频。
                  </span>
                </label>

                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-700">本地上传参考录音</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        支持 mp3、wav、m4a、aac 等音频文件，上传后自动填入 URL。录音建议 10 秒以上、单人清晰说话、背景噪声少。
                      </p>
                    </div>
                    <label className={`${uiSecondary} shrink-0 cursor-pointer ${uploadingCloneAudio ? 'pointer-events-none opacity-50' : ''}`}>
                      {uploadingCloneAudio ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileAudio className="h-4 w-4" />}
                      上传
                      <input
                        type="file"
                        accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.flac"
                        className="hidden"
                        disabled={uploadingCloneAudio}
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          event.target.value = '';
                          if (file) void uploadCloneAudio(file);
                        }}
                      />
                    </label>
                  </div>
                  {cloneUploadError && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs leading-5 text-red-600">{cloneUploadError}</p>}
                </div>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-slate-600">试听模型</span>
                  <select
                    value={cloneModel}
                    onChange={(event) => setCloneModel(event.target.value as (typeof CLONE_MODEL_OPTIONS)[number])}
                    className={uiInput}
                  >
                    {CLONE_MODEL_OPTIONS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1.5 flex items-center justify-between text-xs font-semibold text-slate-600">
                    <span>试听文本</span>
                    <span className="font-normal text-slate-400">{cloneText.length} / 1000 字</span>
                  </span>
                  <textarea
                    value={cloneText}
                    onChange={(event) => setCloneText(event.target.value.slice(0, 1000))}
                    className={`${uiTextarea} min-h-[176px]`}
                    placeholder="输入克隆声音的试听文本"
                  />
                </label>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <button type="button" onClick={clearForm} className={uiSecondary}>
                    <X className="h-4 w-4" />
                    清空
                  </button>
                  <button
                    type="button"
                    onClick={() => void createTask()}
                    disabled={submitting || !/^https?:\/\//i.test(cloneAudioUrl.trim()) || !cloneText.trim()}
                    className={uiPrimary}
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    发起克隆
                  </button>
                </div>
              </div>
            )}
          </section>

        </aside>

        <section className="min-h-[calc(100vh-7.5rem)] rounded-2xl border border-slate-200 bg-white shadow-sm">
          {selectedTask ? (
            <div className="flex min-h-full flex-col">
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5">
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
                      {selectedTask.mode === 'clone' ? 'voice_cloning' : 'voice_design'}
                    </span>
                    {selectedTask.remoteTaskId && (
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                        {selectedTask.remoteTaskId}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-slate-950">{selectedTask.prompt}</h2>
                  <p className="mt-1 text-sm text-slate-500">{timeAgo(selectedTask.createdAt)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button type="button" onClick={() => void copyTaskId(selectedTask)} className={uiIconBtn} title="复制任务 ID">
                    <Copy className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => void createTask(selectedTask)} disabled={submitting} className={uiIconBtn} title="再次生成">
                    <RefreshCw className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => deleteTask(selectedTask)} className={`${uiIconBtn} hover:text-red-600`} title="删除">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-5 p-5">
                <div className="space-y-5">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                        {isGenerating(selectedTask.status) ? <Loader2 className="h-5 w-5 animate-spin" /> : <Mic2 className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">试听结果</p>
                        <p className="text-xs text-slate-500">
                          {selectedTask.status === 'succeeded'
                            ? '音频已返回'
                            : selectedTask.status === 'failed'
                              ? '任务失败'
                              : '正在等待上游返回音频'}
                        </p>
                      </div>
                    </div>

                    {selectedTask.audioUrl ? (
                      <div className="space-y-3">
                        <audio src={selectedTask.audioUrl} controls className="w-full" />
                        <div className="rounded-xl border border-slate-200 bg-white p-3">
                          <div className="mb-1.5 flex items-center justify-between gap-3">
                            <p className="text-xs font-semibold text-slate-600">生成音频 URL</p>
                            <button
                              type="button"
                              onClick={() => void navigator.clipboard.writeText(selectedTask.audioUrl || '')}
                              className={`${uiIconBtn} h-7 w-7`}
                              title="复制音频 URL"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <p className="break-all text-xs leading-5 text-slate-600">{selectedTask.audioUrl}</p>
                        </div>
                        <a href={selectedTask.audioUrl} download className={uiSecondary}>
                          <Download className="h-4 w-4" />
                          下载音频
                        </a>
                      </div>
                    ) : (
                      <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white">
                        <div className="max-w-sm px-6 text-center">
                          {selectedTask.status === 'failed' ? (
                            <>
                              <p className="text-sm font-semibold text-red-600">生成失败</p>
                              <p className="mt-2 text-xs leading-5 text-slate-500">{selectedTask.errorMessage || '请查看上游返回信息'}</p>
                            </>
                          ) : (
                            <>
                              <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-teal-600" />
                              <p className="text-sm font-semibold text-slate-700">任务处理中</p>
                              <p className="mt-2 text-xs leading-5 text-slate-500">
                                页面会轮询任务详情；服务端也会接收回调结果。
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {copiedId === selectedTask.id && <p className="mt-3 text-xs font-medium text-teal-700">已复制任务 ID</p>}
                    {selectedTask.status === 'submitted' && selectedTask.errorMessage && (
                      <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-700">{selectedTask.errorMessage}</p>
                    )}
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-5">
                    <h3 className="mb-2 text-sm font-semibold text-slate-900">
                      {selectedTask.mode === 'clone' ? '试听文本' : '示例声音口播'}
                    </h3>
                    <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">{selectedTask.previewText}</p>
                  </div>
                  {selectedTask.mode === 'clone' && selectedTask.cloneAudioUrl && (
                    <div className="rounded-2xl border border-slate-200 p-5">
                      <h3 className="mb-2 text-sm font-semibold text-slate-900">参考录音</h3>
                      <audio src={selectedTask.cloneAudioUrl} controls className="w-full" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[520px] items-center justify-center px-5">
              <div className="max-w-sm rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                <Mic2 className="mx-auto mb-3 h-8 w-8 text-slate-400" />
                <p className="text-sm font-semibold text-slate-700">还没有 voice test 任务</p>
                <p className="mt-2 text-xs leading-5 text-slate-500">在左侧输入声音 prompt 和示例口播后发起任务。</p>
              </div>
            </div>
          )}
        </section>

        <aside className="min-h-[calc(100vh-7.5rem)] rounded-2xl border border-slate-200 bg-white shadow-sm xl:sticky xl:top-20">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <h2 className="text-sm font-semibold text-slate-900">任务记录</h2>
            <span className="text-xs text-slate-400">{filteredTasks.length}</span>
          </div>
          <div className="border-b border-slate-100 p-2">
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1">
              {[
                { id: 'all' as const, label: 'All' },
                { id: 'describe' as const, label: '描述生成' },
                { id: 'clone' as const, label: '克隆录音' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setHistoryFilter(item.id)}
                  className={`h-8 rounded-lg px-2 text-xs font-semibold transition ${uiFocus} ${
                    historyFilter === item.id ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="max-h-[calc(100vh-8.5rem)] overflow-y-auto p-2">
            {filteredTasks.length === 0 ? (
              <div className="px-3 py-8 text-center text-sm text-slate-400">暂无任务</div>
            ) : (
              filteredTasks
                .slice()
                .reverse()
                .map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => setSelectedId(task.id)}
                    className={`mb-2 block w-full rounded-xl border p-3 text-left transition ${uiFocus} ${
                      selectedTask?.id === task.id
                        ? 'border-teal-200 bg-teal-50/80'
                        : 'border-transparent bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-slate-800">{task.prompt}</p>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          task.status === 'succeeded'
                            ? 'bg-emerald-100 text-emerald-700'
                            : task.status === 'failed'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {task.status === 'succeeded'
                          ? '完成'
                          : task.status === 'failed'
                            ? '失败'
                            : task.status === 'submitted'
                              ? '已提交'
                              : '处理中'}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{task.previewText}</p>
                    <p className="mt-2 text-[11px] text-slate-400">{timeAgo(task.createdAt)}</p>
                  </button>
                ))
            )}
          </div>
        </aside>
      </div>

      {promptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4">
          <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-slate-900">声音 Prompt</h2>
              <button
                type="button"
                onClick={() => setPromptModalOpen(false)}
                className={uiIconBtn}
                title="关闭"
                aria-label="关闭 Prompt 弹窗"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5">
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                className={`${uiTextarea} min-h-[360px]`}
                autoFocus
                placeholder="例如：温柔女声、成熟男声、活泼童声"
              />
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-400">{prompt.length} 字</span>
                <button type="button" onClick={() => setPromptModalOpen(false)} className={uiPrimary}>
                  完成
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
