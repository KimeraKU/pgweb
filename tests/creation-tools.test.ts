import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  agentToolCard,
  featuredToolCards,
  toolCards,
  toolLibrarySections,
} from '../src/lib/creation-tools';

test('Create New 与 Tools 页面共用完整且唯一的工具目录', () => {
  const expectedTools = [...featuredToolCards, ...toolCards, agentToolCard];
  const groupedTools = toolLibrarySections.flatMap((section) => section.cards);

  assert.equal(groupedTools.length, expectedTools.length);
  assert.deepEqual(
    new Set(groupedTools.map((tool) => tool.name)),
    new Set(expectedTools.map((tool) => tool.name))
  );
  assert.equal(new Set(groupedTools.map((tool) => tool.name)).size, groupedTools.length);
});

test('工具分组和路由满足 Create New 菜单契约', () => {
  assert.deepEqual(
    toolLibrarySections.map((section) => section.title),
    ['Image Tools', 'Video Tools', 'Creative Utilities']
  );

  for (const section of toolLibrarySections) {
    assert.ok(section.id.length > 0);
    assert.ok(section.cards.length > 0);

    for (const tool of section.cards) {
      assert.ok(tool.name.length > 0);
      assert.ok(tool.description.length > 0);
      assert.match(tool.href, /^(\/[^\s]*|#)$/);
    }
  }
});
