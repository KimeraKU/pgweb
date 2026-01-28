// 布局框的位置和尺寸信息
export interface LayoutFrame {
  id: string;
  x: number; // 相对于画布的百分比位置 (0-100)
  y: number;
  width: number; // 相对于画布的百分比宽度 (0-100)
  height: number; // 相对于画布的百分比高度 (0-100)
  imageUrl?: string; // 框内显示的图片
}

// 布局模板定义
export interface LayoutTemplate {
  id: string;
  name: string;
  frames: LayoutFrame[]; // 布局包含的框
  preview: string; // 预览类型标识
}

// 图层定义
export interface CanvasLayer {
  id: string;
  name: string;
  type: 'layout' | 'image' | 'text' | 'element';
  layout?: LayoutTemplate; // 如果是 layout 类型
  imageUrl?: string; // 如果是 image 类型
  visible?: boolean;
  locked?: boolean;
  zIndex?: number; // 图层层级
  // 图层的位置和尺寸（相对于画布的百分比）
  x?: number; // 默认 0
  y?: number; // 默认 0
  width?: number; // 默认 100
  height?: number; // 默认 100
}
