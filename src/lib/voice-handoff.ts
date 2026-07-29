export type VoiceLanguage = 'English' | 'Spanish';
export type VoiceGender = 'Male' | 'Female';

export type VoiceHandoffPreset = {
  name: string;
  language: VoiceLanguage;
  accent: string;
  gender: VoiceGender;
  sample: string;
  hideGenderTag?: boolean;
};

export const VOICE_HANDOFF_SOURCE = 'creation-ai-voice';

export const VOICE_HANDOFF_PRESETS: readonly VoiceHandoffPreset[] = [
  {
    name: 'Ethan',
    language: 'English',
    accent: 'American English accent',
    gender: 'Male',
    hideGenderTag: true,
    sample: 'Hi, I am Ethan. Let us turn your next idea into a clear and engaging story.',
  },
  {
    name: 'Diego',
    language: 'Spanish',
    accent: 'Chilean Spanish accent',
    gender: 'Male',
    sample: 'Hola, soy Diego. Estoy listo para darle una voz natural y cercana a tu proyecto.',
  },
  {
    name: 'Mariana',
    language: 'Spanish',
    accent: 'Mexican Spanish accent',
    gender: 'Female',
    sample: 'Hola, soy Mariana. Hagamos que tu mensaje suene claro, cálido y memorable.',
  },
  {
    name: 'Lucia',
    language: 'Spanish',
    accent: 'Latin American Spanish accent',
    gender: 'Female',
    sample: 'Hola, soy Lucia. Puedo ayudarte a crear una narración natural para cualquier audiencia.',
  },
  {
    name: 'Valeria',
    language: 'Spanish',
    accent: 'Latin American Spanish accent',
    gender: 'Female',
    sample: 'Hola, soy Valeria. Demos vida a tu contenido con una voz expresiva y profesional.',
  },
  {
    name: 'Camila',
    language: 'Spanish',
    accent: 'Mexican Spanish accent',
    gender: 'Female',
    sample: 'Hola, soy Camila. Tu próxima historia puede sonar fresca, auténtica y fácil de recordar.',
  },
  {
    name: 'Sophie',
    language: 'English',
    accent: 'American English accent',
    gender: 'Female',
    sample: 'Hi, I am Sophie. I can give your content a warm, confident, and polished voice.',
  },
];

type VoiceHandoffInput = {
  name?: unknown;
  language?: unknown;
  accent?: unknown;
  gender?: unknown;
};

export function resolveVoiceHandoff(input: VoiceHandoffInput): VoiceHandoffPreset | null {
  if (
    typeof input.name !== 'string' ||
    typeof input.language !== 'string' ||
    typeof input.accent !== 'string' ||
    typeof input.gender !== 'string'
  ) {
    return null;
  }

  if (
    input.name.length > 40 ||
    input.language.length > 20 ||
    input.accent.length > 80 ||
    input.gender.length > 20
  ) {
    return null;
  }

  // 跳转参数属于外部输入，只返回白名单中的规范数据，避免伪造声音配置进入生成链路。
  return VOICE_HANDOFF_PRESETS.find(
    (voice) =>
      voice.name === input.name &&
      voice.language === input.language &&
      voice.accent === input.accent &&
      voice.gender === input.gender
  ) ?? null;
}

export function buildVoiceHandoffUrl(voice: VoiceHandoffPreset): string {
  const searchParams = new URLSearchParams({
    source: VOICE_HANDOFF_SOURCE,
    voice_name: voice.name,
    voice_language: voice.language,
    voice_accent: voice.accent,
    voice_gender: voice.gender,
  });

  return `/ugc-video-generator?${searchParams.toString()}`;
}

export function parseVoiceHandoff(searchParams: Pick<URLSearchParams, 'get'>): VoiceHandoffPreset | null {
  if (searchParams.get('source') !== VOICE_HANDOFF_SOURCE) return null;

  return resolveVoiceHandoff({
    name: searchParams.get('voice_name'),
    language: searchParams.get('voice_language'),
    accent: searchParams.get('voice_accent'),
    gender: searchParams.get('voice_gender'),
  });
}
