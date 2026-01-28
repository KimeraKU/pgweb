import { LayoutTemplate } from '@/types/layout';

// 生成布局模板数据
export function generateLayoutTemplates(category: string): LayoutTemplate[] {
  const layouts: LayoutTemplate[] = [];

  if (category === 'featured') {
    // 精选布局
    layouts.push(
      {
        id: 'f1',
        name: 'Full Screen',
        preview: 'full',
        frames: [{ id: '1', x: 0, y: 0, width: 100, height: 100 }],
      },
      {
        id: 'f2',
        name: 'Two Columns',
        preview: '2col-vertical',
        frames: [
          { id: '1', x: 0, y: 0, width: 50, height: 100 },
          { id: '2', x: 50, y: 0, width: 50, height: 100 },
        ],
      },
      {
        id: 'f3',
        name: 'Top Large',
        preview: 'top-large',
        frames: [
          { id: '1', x: 0, y: 0, width: 100, height: 60 },
          { id: '2', x: 0, y: 60, width: 50, height: 40 },
          { id: '3', x: 50, y: 60, width: 50, height: 40 },
        ],
      },
      {
        id: 'f4',
        name: 'Grid 2x2',
        preview: 'grid-2x2',
        frames: [
          { id: '1', x: 0, y: 0, width: 50, height: 50 },
          { id: '2', x: 50, y: 0, width: 50, height: 50 },
          { id: '3', x: 0, y: 50, width: 50, height: 50 },
          { id: '4', x: 50, y: 50, width: 50, height: 50 },
        ],
      },
      {
        id: 'f5',
        name: 'Centered Frame',
        preview: 'frame',
        frames: [{ id: '1', x: 10, y: 10, width: 80, height: 80 }],
      },
    );
  } else {
    // 根据数量生成布局
    const num = parseInt(category);
    
    // 如果解析失败，使用默认值 1
    if (isNaN(num) || num < 1) {
      const defaultVariants = getLayoutVariantsForCount(1);
      defaultVariants.forEach((variant, index) => {
        layouts.push({
          id: `${category}-${index + 1}`,
          name: `Layout ${index + 1}`,
          preview: `1-${index + 1}`,
          frames: variant,
        });
      });
    } else {
      // 为每个数量生成多种布局变体
      const layoutVariants = getLayoutVariantsForCount(num);
      
      layoutVariants.forEach((variant, index) => {
        layouts.push({
          id: `${category}-${index + 1}`,
          name: `Layout ${index + 1}`,
          preview: `${num}-${index + 1}`,
          frames: variant,
        });
      });
    }
  }

  return layouts;
}

// 根据数量生成布局变体
function getLayoutVariantsForCount(count: number): Array<Array<{ id: string; x: number; y: number; width: number; height: number }>> {
  const variants: Array<Array<{ id: string; x: number; y: number; width: number; height: number }>> = [];

  if (count === 1) {
    variants.push([{ id: '1', x: 0, y: 0, width: 100, height: 100 }]);
  } else if (count === 2) {
    // 2 个图片的布局变体
    variants.push(
      // 垂直分割
      [
        { id: '1', x: 0, y: 0, width: 50, height: 100 },
        { id: '2', x: 50, y: 0, width: 50, height: 100 },
      ],
      // 水平分割
      [
        { id: '1', x: 0, y: 0, width: 100, height: 50 },
        { id: '2', x: 0, y: 50, width: 100, height: 50 },
      ],
      // 左大右小
      [
        { id: '1', x: 0, y: 0, width: 60, height: 100 },
        { id: '2', x: 60, y: 0, width: 40, height: 100 },
      ],
    );
  } else if (count === 3) {
    // 3 个图片的布局变体
    variants.push(
      // 上1下2
      [
        { id: '1', x: 0, y: 0, width: 100, height: 50 },
        { id: '2', x: 0, y: 50, width: 50, height: 50 },
        { id: '3', x: 50, y: 50, width: 50, height: 50 },
      ],
      // 左1右2
      [
        { id: '1', x: 0, y: 0, width: 50, height: 100 },
        { id: '2', x: 50, y: 0, width: 50, height: 50 },
        { id: '3', x: 50, y: 50, width: 50, height: 50 },
      ],
      // 网格 1+2
      [
        { id: '1', x: 0, y: 0, width: 50, height: 50 },
        { id: '2', x: 50, y: 0, width: 50, height: 50 },
        { id: '3', x: 0, y: 50, width: 100, height: 50 },
      ],
    );
  } else if (count === 4) {
    // 4 个图片的布局变体
    variants.push(
      // 2x2 网格
      [
        { id: '1', x: 0, y: 0, width: 50, height: 50 },
        { id: '2', x: 50, y: 0, width: 50, height: 50 },
        { id: '3', x: 0, y: 50, width: 50, height: 50 },
        { id: '4', x: 50, y: 50, width: 50, height: 50 },
      ],
      // 上1下3
      [
        { id: '1', x: 0, y: 0, width: 100, height: 40 },
        { id: '2', x: 0, y: 40, width: 33.33, height: 60 },
        { id: '3', x: 33.33, y: 40, width: 33.33, height: 60 },
        { id: '4', x: 66.66, y: 40, width: 33.34, height: 60 },
      ],
    );
  } else {
    // 对于 count > 4 的情况，生成网格布局
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);
    const cellWidth = 100 / cols;
    const cellHeight = 100 / rows;
    
    const frames: Array<{ id: string; x: number; y: number; width: number; height: number }> = [];
    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      frames.push({
        id: `${i + 1}`,
        x: col * cellWidth,
        y: row * cellHeight,
        width: cellWidth,
        height: cellHeight,
      });
    }
    variants.push(frames);
  }

  // 如果变体不足 12 个，基于第一个变体生成更多变体
  if (variants.length > 0) {
    const baseVariant = variants[0];
    while (variants.length < 12) {
      const index = variants.length;
      variants.push(
        baseVariant.map((frame, idx) => ({
          ...frame,
          id: `${index + 1}-${idx + 1}`,
        }))
      );
    }
  } else {
    // 如果没有变体，创建一个默认的网格布局
    const defaultFrames: Array<{ id: string; x: number; y: number; width: number; height: number }> = [];
    const safeCount = Math.max(1, Math.min(count, 20)); // 限制在 1-20 之间
    const cols = Math.ceil(Math.sqrt(safeCount));
    const rows = Math.ceil(safeCount / cols);
    const cellWidth = 100 / cols;
    const cellHeight = 100 / rows;
    
    for (let i = 0; i < safeCount; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      defaultFrames.push({
        id: `${i + 1}`,
        x: col * cellWidth,
        y: row * cellHeight,
        width: cellWidth,
        height: cellHeight,
      });
    }
    variants.push(defaultFrames);
    
    // 生成更多变体
    while (variants.length < 12) {
      const index = variants.length;
      variants.push(
        defaultFrames.map((frame, idx) => ({
          ...frame,
          id: `${index + 1}-${idx + 1}`,
        }))
      );
    }
  }

  // 确保返回至少一个变体
  if (variants.length === 0) {
    variants.push([{ id: '1', x: 0, y: 0, width: 100, height: 100 }]);
  }

  return variants.slice(0, 12);
}
