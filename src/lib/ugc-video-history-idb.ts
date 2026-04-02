const DB_NAME = 'aggregation-editor';
const DB_VERSION = 1;
const STORE_NAME = 'ugc_video_generator';
const HISTORY_KEY = 'history_v1';

const MAX_IMAGE_RUNS = 50;
const MAX_VIDEO_TASKS = 20;

type CandidateStatus = 'pending' | 'success' | 'failed';
type ImageRunStatus = 'image_generating' | 'image_ready' | 'failed';
type VideoTaskStatus =
  | 'video_prompting'
  | 'video_reviewing'
  | 'video_generating'
  | 'submitted'
  | 'completed'
  | 'failed';

export interface PersistedGeneratedCandidate {
  id: string;
  imageUrl?: string;
  prompt: string;
  status: CandidateStatus;
  errorMessage?: string;
}

export interface PersistedImageGenerationRun {
  id: string;
  createdAt: number;
  creativePrompt: string;
  candidates: PersistedGeneratedCandidate[];
  status: ImageRunStatus;
  selectedCandidateId: string | null;
  generationCount: number;
  aspectRatio: string;
  errorMessage?: string;
}

export interface PersistedVideoTask {
  id: string;
  productName: string;
  sourceImageUrl: string;
  referenceImageUrls?: string[];
  videoUrl?: string;
  coverUrl?: string;
  prompt: string;
  status: VideoTaskStatus;
  remoteTaskId?: string;
  errorMessage?: string;
  createdAt: number;
}

export interface UGCVideoHistorySnapshot {
  creativePrompt: string;
  imageRuns: PersistedImageGenerationRun[];
  videoTasks: PersistedVideoTask[];
}

interface StoreRecord {
  key: string;
  value: UGCVideoHistorySnapshot;
}

function hasIndexedDb() {
  return typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined';
}

function isBlobUrl(url: string | undefined) {
  return Boolean(url && url.startsWith('blob:'));
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Failed to open IndexedDB'));
  });
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'));
  });
}

function transactionDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('IndexedDB transaction failed'));
    tx.onabort = () => reject(tx.error ?? new Error('IndexedDB transaction aborted'));
  });
}

function normalizeSnapshot(input: UGCVideoHistorySnapshot): UGCVideoHistorySnapshot {
  const creativePrompt = typeof input.creativePrompt === 'string' ? input.creativePrompt : '';
  const imageRuns = input.imageRuns
    .slice(0, MAX_IMAGE_RUNS)
    .map((run) => ({
      ...run,
      creativePrompt: typeof run.creativePrompt === 'string' ? run.creativePrompt : '',
      candidates: run.candidates.slice(0, 8).map((candidate) => ({
        ...candidate,
        imageUrl: isBlobUrl(candidate.imageUrl) ? undefined : candidate.imageUrl,
      })),
    }));

  const videoTasks = input.videoTasks
    .slice(0, MAX_VIDEO_TASKS)
    .map((task) => ({
      ...task,
      sourceImageUrl: isBlobUrl(task.sourceImageUrl) ? '' : task.sourceImageUrl,
      referenceImageUrls: Array.isArray(task.referenceImageUrls)
        ? task.referenceImageUrls.filter((url) => typeof url === 'string' && url.length > 0 && !isBlobUrl(url))
        : undefined,
      coverUrl: isBlobUrl(task.coverUrl) ? undefined : task.coverUrl,
      videoUrl: isBlobUrl(task.videoUrl) ? undefined : task.videoUrl,
    }))
    .filter((task) => task.sourceImageUrl.length > 0);

  return { creativePrompt, imageRuns, videoTasks };
}

function parseSnapshot(raw: unknown): UGCVideoHistorySnapshot | null {
  if (!raw || typeof raw !== 'object') return null;

  const record = raw as { creativePrompt?: unknown; imageRuns?: unknown; videoTasks?: unknown };
  if (!Array.isArray(record.imageRuns) || !Array.isArray(record.videoTasks)) return null;

  const candidateStatusSet: CandidateStatus[] = ['pending', 'success', 'failed'];
  const imageRunStatusSet: ImageRunStatus[] = ['image_generating', 'image_ready', 'failed'];
  const videoTaskStatusSet: VideoTaskStatus[] = [
    'video_prompting',
    'video_reviewing',
    'video_generating',
    'submitted',
    'completed',
    'failed',
  ];

  const imageRuns: PersistedImageGenerationRun[] = record.imageRuns
    .filter((run): run is Record<string, unknown> => Boolean(run && typeof run === 'object'))
    .map((run) => {
      const candidatesRaw = Array.isArray(run.candidates) ? run.candidates : [];
      const candidates: PersistedGeneratedCandidate[] = candidatesRaw
        .filter((candidate): candidate is Record<string, unknown> => Boolean(candidate && typeof candidate === 'object'))
        .map((candidate) => {
          const status = candidate.status;
          return {
            id: typeof candidate.id === 'string' ? candidate.id : '',
            imageUrl: typeof candidate.imageUrl === 'string' ? candidate.imageUrl : undefined,
            prompt: typeof candidate.prompt === 'string' ? candidate.prompt : '',
            status: candidateStatusSet.includes(status as CandidateStatus) ? (status as CandidateStatus) : 'failed',
            errorMessage: typeof candidate.errorMessage === 'string' ? candidate.errorMessage : undefined,
          };
        })
        .filter((candidate) => candidate.id.length > 0);

      const status = run.status;
      return {
        id: typeof run.id === 'string' ? run.id : '',
        createdAt: typeof run.createdAt === 'number' ? run.createdAt : Date.now(),
        creativePrompt: typeof run.creativePrompt === 'string' ? run.creativePrompt : '',
        candidates,
        status: imageRunStatusSet.includes(status as ImageRunStatus) ? (status as ImageRunStatus) : 'failed',
        selectedCandidateId: typeof run.selectedCandidateId === 'string' ? run.selectedCandidateId : null,
        generationCount: typeof run.generationCount === 'number' ? run.generationCount : candidates.length,
        aspectRatio: typeof run.aspectRatio === 'string' ? run.aspectRatio : '1:1',
        errorMessage: typeof run.errorMessage === 'string' ? run.errorMessage : undefined,
      };
    })
    .filter((run) => run.id.length > 0);

  const videoTasks: PersistedVideoTask[] = record.videoTasks
    .filter((task): task is Record<string, unknown> => Boolean(task && typeof task === 'object'))
    .map((task) => {
      const status = task.status;
      return {
        id: typeof task.id === 'string' ? task.id : '',
        productName: typeof task.productName === 'string' ? task.productName : '',
        sourceImageUrl: typeof task.sourceImageUrl === 'string' ? task.sourceImageUrl : '',
        referenceImageUrls: Array.isArray(task.referenceImageUrls)
          ? task.referenceImageUrls.filter((url): url is string => typeof url === 'string' && url.length > 0)
          : undefined,
        videoUrl: typeof task.videoUrl === 'string' ? task.videoUrl : undefined,
        coverUrl: typeof task.coverUrl === 'string' ? task.coverUrl : undefined,
        prompt: typeof task.prompt === 'string' ? task.prompt : '',
        status: videoTaskStatusSet.includes(status as VideoTaskStatus) ? (status as VideoTaskStatus) : 'failed',
        remoteTaskId: typeof task.remoteTaskId === 'string' ? task.remoteTaskId : undefined,
        errorMessage: typeof task.errorMessage === 'string' ? task.errorMessage : undefined,
        createdAt: typeof task.createdAt === 'number' ? task.createdAt : Date.now(),
      };
    })
    .filter((task) => task.id.length > 0);

  return normalizeSnapshot({
    creativePrompt: typeof record.creativePrompt === 'string' ? record.creativePrompt : '',
    imageRuns,
    videoTasks,
  });
}

export async function loadUGCVideoHistory(): Promise<UGCVideoHistorySnapshot | null> {
  if (!hasIndexedDb()) return null;

  let db: IDBDatabase | null = null;
  try {
    db = await openDatabase();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const record = await requestToPromise(store.get(HISTORY_KEY)) as StoreRecord | undefined;
    await transactionDone(tx);
    if (!record) return null;
    return parseSnapshot(record.value);
  } catch {
    return null;
  } finally {
    db?.close();
  }
}

export async function saveUGCVideoHistory(snapshot: UGCVideoHistorySnapshot): Promise<void> {
  if (!hasIndexedDb()) return;

  let db: IDBDatabase | null = null;
  try {
    db = await openDatabase();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const value = normalizeSnapshot(snapshot);
    store.put({ key: HISTORY_KEY, value } satisfies StoreRecord);
    await transactionDone(tx);
  } catch {
    // ignore storage errors to avoid affecting user flow
  } finally {
    db?.close();
  }
}
