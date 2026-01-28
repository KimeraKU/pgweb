/**
 * 背景去除工具相关类型定义
 */

export type UserStatus = 'guest' | 'free' | 'pro';

export type TaskStatus = 'pending' | 'processing' | 'success' | 'failed';

export type ImageQuality = 'standard' | 'hd';

export interface ProcessedImage {
  id: string;
  originalUrl: string;
  processedUrl?: string;
  status: TaskStatus;
  originalName: string;
  width: number;
  height: number;
  error?: string;
}

export interface UserQuota {
  dailyLimit: number;
  usedToday: number;
  remaining: number;
}

export interface BatchTask {
  id: string;
  images: ProcessedImage[];
  totalCount: number;
  completedCount: number;
  failedCount: number;
}

export interface BackgroundOption {
  type: 'transparent' | 'color' | 'image';
  value?: string; // 颜色值或图片URL
}
