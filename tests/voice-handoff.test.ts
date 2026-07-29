import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  buildVoiceHandoffUrl,
  parseVoiceHandoff,
  resolveVoiceHandoff,
  VOICE_HANDOFF_PRESETS,
  VOICE_HANDOFF_SOURCE,
} from '../src/lib/voice-handoff';

test('生成并解析规范的声音交接参数', () => {
  const voice = VOICE_HANDOFF_PRESETS[1];
  const url = new URL(buildVoiceHandoffUrl(voice), 'http://localhost');

  assert.equal(url.pathname, '/ugc-video-generator');
  assert.equal(url.searchParams.get('source'), VOICE_HANDOFF_SOURCE);
  assert.equal(url.searchParams.get('voice_name'), voice.name);
  assert.equal(url.searchParams.get('voice_language'), voice.language);
  assert.equal(url.searchParams.get('voice_accent'), voice.accent);
  assert.equal(url.searchParams.get('voice_gender'), voice.gender);
  assert.deepEqual(parseVoiceHandoff(url.searchParams), voice);
});

test('拒绝来源不匹配或被篡改的声音参数', () => {
  const voice = VOICE_HANDOFF_PRESETS[0];
  const url = new URL(buildVoiceHandoffUrl(voice), 'http://localhost');

  url.searchParams.set('source', 'unknown-source');
  assert.equal(parseVoiceHandoff(url.searchParams), null);

  url.searchParams.set('source', VOICE_HANDOFF_SOURCE);
  url.searchParams.set('voice_gender', 'Female');
  assert.equal(parseVoiceHandoff(url.searchParams), null);
});

test('拒绝未知、缺失或超长的声音配置', () => {
  assert.equal(
    resolveVoiceHandoff({
      name: 'Unknown',
      language: 'English',
      accent: 'American English accent',
      gender: 'Male',
    }),
    null
  );
  assert.equal(resolveVoiceHandoff({ name: 'Ethan' }), null);
  assert.equal(
    resolveVoiceHandoff({
      name: 'Ethan'.repeat(20),
      language: 'English',
      accent: 'American English accent',
      gender: 'Male',
    }),
    null
  );
});
