/**
 * TypeScript 类型定义
 * 
 * 在此文件中定义项目通用的类型
 */

// 示例：通用 API 响应类型
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// 示例：分页参数类型
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// 示例：分页响应类型
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
