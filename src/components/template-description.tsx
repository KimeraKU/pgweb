'use client';

import { useState, useRef, useEffect } from 'react';

/** 描述区域折叠时固定为 4 行高（按行高倍数）；leading-relaxed = 1.625 */
const COLLAPSED_LINES = 4;
const LINE_HEIGHT_REL = 1.625;
/** 描述超过此字符数则显示「详情」按钮（与高度测量二选一满足即可） */
const SHOW_DETAIL_CHAR_THRESHOLD = 120;

export function TemplateDescription({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const fullTextRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const full = fullTextRef.current;
    const container = containerRef.current;
    if (!full || !container) return;

    const check = () => {
      const style = getComputedStyle(full);
      let lineHeightPx = parseFloat(style.lineHeight);
      if (Number.isNaN(lineHeightPx)) {
        const fontSize = parseFloat(style.fontSize) || 14;
        lineHeightPx = fontSize * LINE_HEIGHT_REL;
      }
      const collapsedHeight = lineHeightPx * COLLAPSED_LINES;
      const contentHeight = full.offsetHeight;
      setHasOverflow(contentHeight > collapsedHeight);
    };

    let ro: ResizeObserver | null = null;
    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        check();
        ro = new ResizeObserver(check);
        ro.observe(container);
        ro.observe(full);
      });
    });

    return () => {
      cancelAnimationFrame(rafId);
      ro?.disconnect();
    };
  }, [text]);

  const showByLength = text.length > SHOW_DETAIL_CHAR_THRESHOLD;
  const showDetailButton = (hasOverflow || showByLength) && !expanded;

  return (
    <div className="relative text-gray-600 text-sm leading-relaxed">
      {expanded ? (
        <>
          <p>{text}</p>
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="mt-1 text-teal-600 hover:text-teal-700 font-medium text-sm"
          >
            收起
          </button>
        </>
      ) : (
        <div ref={containerRef} className="relative w-full">
          {/* 用于测量全文高度：与可见区域同宽，绝对定位不占流，invisible 仍参与布局测量 */}
          <p
            ref={fullTextRef}
            className="absolute left-0 right-0 top-0 w-full text-sm leading-relaxed pointer-events-none invisible"
            aria-hidden
          >
            {text}
          </p>
          {/* 只裁文字，高度 4 行；详情按钮放在外面，避免被裁掉 */}
          <div
            className="overflow-hidden text-sm leading-relaxed"
            style={{ maxHeight: `${COLLAPSED_LINES * LINE_HEIGHT_REL}em` }}
          >
            <p className="text-sm leading-relaxed">{text}</p>
          </div>
          {showDetailButton && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="mt-1 text-teal-600 hover:text-teal-700 font-medium text-sm"
            >
              详情
            </button>
          )}
        </div>
      )}
    </div>
  );
}
