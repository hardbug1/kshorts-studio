// 영상 옵션 추천: AI에게 "허용된 ID 중에서만" 고르게 하고, 응답을 검증한다. AI가 없거나 실패하면 키워드 규칙으로 대신한다.

export interface OptionChoice {
  id: string;
  name: string;
}

export interface OptionLists {
  templates: OptionChoice[];
  voices: OptionChoice[];
  titleStyles: OptionChoice[];
  subtitleStyles: OptionChoice[];
  bgmMoods: OptionChoice[];
}

export interface RecommendedOptions {
  templateId: string;
  voiceId: string;
  titleStyleId: string;
  subtitleStyleId: string;
  bgmMood: string;
  hookTitleText: string;
  hookSubtitleText: string;
  reason: string;
  source: 'ai' | 'rule';
}

const MAX_HOOK_TITLE = 24;
const MAX_HOOK_SUBTITLE = 30;
const MAX_REASON = 200;

export function buildRecommendPrompt(title: string, script: string, lists: OptionLists): string {
  const fmt = (items: OptionChoice[]) => items.map((o) => `${o.id} = ${o.name}`).join('\n');
  return [
    '한국어 유튜브 쇼츠의 제작 옵션을 골라 주세요. 각 항목은 반드시 아래 목록의 id 중 하나만 씁니다.',
    `\n[제목]\n${title}`,
    `\n[대본]\n${script.slice(0, 1500) || '(대본 없음: 제목만 보고 판단)'}`,
    `\n[templateId: 그림 화풍]\n${fmt(lists.templates)}`,
    `\n[voiceId: 성우]\n${fmt(lists.voices)}`,
    `\n[titleStyleId: 상단 제목 스타일]\n${fmt(lists.titleStyles)}`,
    `\n[subtitleStyleId: 자막 스타일]\n${fmt(lists.subtitleStyles)}`,
    `\n[bgmMood: 배경음]\n${fmt(lists.bgmMoods)}`,
    `\n[hookTitleText] 첫 2초 화면 가운데 배너 큰 문구. 이 영상 내용에 맞게 ${MAX_HOOK_TITLE}자 이내.`,
    `[hookSubtitleText] 배너 아래 작은 문구. ${MAX_HOOK_SUBTITLE}자 이내.`,
    `[reason] 고른 이유 한두 문장.`,
    '\n코드블록 없이 JSON 객체 하나만 출력하세요:',
    '{"templateId":"","voiceId":"","titleStyleId":"","subtitleStyleId":"","bgmMood":"","hookTitleText":"","hookSubtitleText":"","reason":""}',
  ].join('\n');
}

/** AI 응답에서 JSON을 꺼내 허용 목록과 맞춰 본다. 목록에 없는 값은 규칙 추천 값으로 채운다. 쓸 수 있는 값이 하나도 없으면 null. */
export function parseRecommendation(text: string, lists: OptionLists, fallback: RecommendedOptions): RecommendedOptions | null {
  const match = String(text || '').match(/\{[\s\S]*\}/);
  if (!match) return null;
  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(match[0]);
  } catch {
    return null;
  }
  let validPicks = 0;
  const pick = (key: string, items: OptionChoice[], fb: string) => {
    const v = String(raw[key] ?? '').trim();
    if (!items.some((o) => o.id === v)) return fb;
    validPicks++;
    return v;
  };
  const text1 = (key: string, max: number, fb: string) => {
    const v = String(raw[key] ?? '').replace(/\s+/g, ' ').trim();
    return v ? v.slice(0, max) : fb;
  };
  const result: RecommendedOptions = {
    templateId: pick('templateId', lists.templates, fallback.templateId),
    voiceId: pick('voiceId', lists.voices, fallback.voiceId),
    titleStyleId: pick('titleStyleId', lists.titleStyles, fallback.titleStyleId),
    subtitleStyleId: pick('subtitleStyleId', lists.subtitleStyles, fallback.subtitleStyleId),
    bgmMood: pick('bgmMood', lists.bgmMoods, fallback.bgmMood),
    hookTitleText: text1('hookTitleText', MAX_HOOK_TITLE, fallback.hookTitleText),
    hookSubtitleText: text1('hookSubtitleText', MAX_HOOK_SUBTITLE, fallback.hookSubtitleText),
    reason: text1('reason', MAX_REASON, ''),
    source: 'ai',
  };
  return validPicks > 0 ? result : null;
}

interface Rule {
  pattern: RegExp;
  label: string;
  options: Omit<RecommendedOptions, 'hookTitleText' | 'hookSubtitleText' | 'reason' | 'source'>;
  hookSubtitleText: string;
}

const RULES: Rule[] = [
  {
    pattern: /공포|괴담|미스터리|소름|사건|범죄|미제|귀신|심령/,
    label: '미스터리·사건',
    options: { templateId: 'mystery_horror', voiceId: 'ko-KR-BongJinNeural', titleStyleId: 'caution_hazard', subtitleStyleId: 'mystery_crime', bgmMood: 'bgm_suspense' },
    hookSubtitleText: '끝까지 보면 소름 돋습니다',
  },
  {
    pattern: /공부|수능|정시|수시|시험|내신|합격|학습|암기|기출|입시/,
    label: '공부·입시',
    options: { templateId: 'k_documentary', voiceId: 'ko-KR-SunHiNeural', titleStyleId: 'quiz_card', subtitleStyleId: 'highlighter', bgmMood: 'bgm_lofi' },
    hookSubtitleText: '지금 바로 써먹는 방법',
  },
  {
    pattern: /돈|부자|재테크|투자|주식|부동산|연봉|월급|절약|경제/,
    label: '돈·재테크',
    options: { templateId: 'luxury_lifestyle', voiceId: 'ko-KR-InJoonNeural', titleStyleId: 'gold_luxury', subtitleStyleId: 'mrbeast', bgmMood: 'bgm_epic' },
    hookSubtitleText: '모르면 손해 보는 이야기',
  },
  {
    pattern: /과학|뇌|심리|우주|기술|ai|인공지능|지식|원리|이유/i,
    label: '지식·과학',
    options: { templateId: 'motion_graphic', voiceId: 'ko-KR-InJoonNeural', titleStyleId: 'dark_pill', subtitleStyleId: 'samul_1min', bgmMood: 'bgm_tech' },
    hookSubtitleText: '1분이면 이해됩니다',
  },
  {
    pattern: /역사|조선|전쟁|왕|위인|명언|동기부여|성공/,
    label: '역사·동기부여',
    options: { templateId: 'k_documentary', voiceId: 'ko-KR-BongJinNeural', titleStyleId: 'dark_pill', subtitleStyleId: 'news', bgmMood: 'bgm_epic' },
    hookSubtitleText: '알고 나면 다르게 보입니다',
  },
  {
    pattern: /썰|사연|연애|커뮤니티|레전드|웃긴|황당/,
    label: '썰·사연',
    options: { templateId: 'k_webtoon', voiceId: 'ko-KR-JiMinNeural', titleStyleId: 'ssul_badge', subtitleStyleId: 'ssul_talk', bgmMood: 'bgm_upbeat' },
    hookSubtitleText: '이거 실화입니다',
  },
  {
    pattern: /요리|레시피|살림|청소|꿀팁|생활|일상|카페|여행/,
    label: '생활·꿀팁',
    options: { templateId: 'cozy_korea', voiceId: 'ko-KR-SeoHyeonNeural', titleStyleId: 'yellow_tape', subtitleStyleId: 'vlog_aesthetic', bgmMood: 'bgm_upbeat' },
    hookSubtitleText: '저장해 두고 따라 하세요',
  },
];

const DEFAULT_RULE: Rule = {
  pattern: /$^/,
  label: '일반',
  options: { templateId: 'basic', voiceId: 'ko-KR-SunHiNeural', titleStyleId: 'yellow_tape', subtitleStyleId: 'mrbeast', bgmMood: 'auto' },
  hookSubtitleText: '끝까지 보면 정리됩니다',
};

/** 키워드 규칙 추천. 목록에 없는 ID(버전 차이 등)는 목록의 첫 값으로 바꾼다. */
export function ruleBasedRecommendation(title: string, script: string, lists: OptionLists): RecommendedOptions {
  const text = `${title} ${script.slice(0, 600)}`;
  const rule = RULES.find((r) => r.pattern.test(text)) || DEFAULT_RULE;
  const ensure = (id: string, items: OptionChoice[]) => (items.some((o) => o.id === id) ? id : items[0]?.id || id);
  return {
    templateId: ensure(rule.options.templateId, lists.templates),
    voiceId: ensure(rule.options.voiceId, lists.voices),
    titleStyleId: ensure(rule.options.titleStyleId, lists.titleStyles),
    subtitleStyleId: ensure(rule.options.subtitleStyleId, lists.subtitleStyles),
    bgmMood: ensure(rule.options.bgmMood, lists.bgmMoods),
    hookTitleText: title.replace(/\s+/g, ' ').trim().slice(0, MAX_HOOK_TITLE),
    hookSubtitleText: rule.hookSubtitleText,
    reason: `'${rule.label}' 주제로 보고 기본 조합을 골랐습니다. (AI 연결 없이 키워드로 추천)`,
    source: 'rule',
  };
}
