import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const creationPageSource = readFileSync(new URL('../src/app/creation/page.tsx', import.meta.url), 'utf8');

test('Creation H5 使用紧凑首屏和移动导航断点', () => {
  assert.match(creationPageSource, /overflow-x-hidden/);
  assert.match(creationPageSource, /text-\[23px\].*sm:text-\[40px\]/);
  assert.match(creationPageSource, /h-\[120px\].*sm:h-\[150px\]/);
  assert.match(creationPageSource, /min-h-\[72px\].*md:min-h-\[148px\]/);
  assert.match(creationPageSource, /h-\[180px\].*sm:h-\[250px\]/);
  assert.doesNotMatch(creationPageSource, /Use same style/);
  assert.match(creationPageSource, /aria-label="打开 Creation 导航"/);
  assert.match(creationPageSource, /data-mobile-nav-close/);
  assert.match(creationPageSource, /data-testid="creation-mobile-profile-sheet"/);
  assert.match(creationPageSource, /h-\[100dvh\].*max-h-\[100dvh\]/);
  assert.match(creationPageSource, /mt-auto flex h-\[60px\]/);
  assert.match(creationPageSource, /creation-sheet-in/);
  assert.match(creationPageSource, /aria-label="6,234 credits"/);
  assert.doesNotMatch(creationPageSource, /group-hover:bg-\[#2aafb8\]/);
  assert.match(creationPageSource, /aria-label="Send"/);
  assert.match(creationPageSource, /h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950/);
  assert.doesNotMatch(creationPageSource, />\s*Send\s*<\/button>/);
  assert.match(creationPageSource, /data-testid="home-recommended-tools-grid"[\s\S]*grid-cols-4[^\"`]*md:grid-cols-2/);
  assert.match(creationPageSource, /min-h-\[72px\][^\"`]*flex-col[^\"`]*items-center[^\"`]*md:min-h-\[148px\]/);
  assert.match(creationPageSource, /contents md:col-span-2 md:grid/);
  assert.match(creationPageSource, /recommendedGridTools\.map\(\(tool, index\) =>/);
  assert.match(creationPageSource, /className=\{index >= 5 \? 'hidden md:flex' : ''\}/);
  assert.match(creationPageSource, /sr-only md:not-sr-only[^\"]*">\{tool\.description\}/);
  assert.match(creationPageSource, /matchMedia\('\(max-width: 767px\)'\)/);
  assert.match(creationPageSource, /data-testid="agent-template-fields"[^>]*hidden[^>]*md:flex/);
  assert.match(creationPageSource, /data-testid="agent-h5-template-titles"[\s\S]*allAgentTemplates\.map/);
  assert.match(creationPageSource, /aria-pressed=\{isSelected\}/);
  assert.match(creationPageSource, /data-testid="agent-desktop-mode-cards"[\s\S]*hidden[^\"`]*md:grid/);
});
