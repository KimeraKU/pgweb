/**
 * 工具函数
 * 
 * 通用的辅助函数集合
 */

/**
 * 格式化日期
 * @param date - 日期对象或时间戳
 * @param format - 格式化模式 (默认: 'YYYY-MM-DD')
 */
export function formatDate(date: Date | number, format = 'YYYY-MM-DD'): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day);
}

/**
 * 类名合并工具
 * @param classes - 类名数组
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * 延迟函数
 * @param ms - 延迟毫秒数
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
