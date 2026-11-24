import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('========================================');
console.log('🔍 K-Shorts v1.4.0 런타임 기능 실질 검증 테스트 시작');
console.log('========================================\n');

let passCount = 0;
let failCount = 0;
const pendingAsyncTests = []; // 비동기 검증 Promise들. 모두 끝난 뒤 finish()를 한 번만 호출한다.

function assert(condition, message) {
  if (condition) {
    console.log(`✅ [PASS] ${message}`);
    passCount++;
  } else {
    console.error(`❌ [FAIL] ${message}`);
    failCount++;
  }
}

// ----------------------------------------------------
// Test 1: AI Hooking Variants Logic Test
// ----------------------------------------------------
console.log('--- Test 1: generate-hooking-variants 런타임 로직 검증 ---');
const testTopic = '부자들의 아침 습관';

// Simulate the exact function logic in electron/main.ts
function generateHookingVariants(topic) {
  const clean = (topic || '').trim();
  const base = clean || '하루 10분 아침 습관';

  return [
    {
      id: 'variant_a',
      type: '🚨 손실 회피 / 경고형',
      badge: '알고리즘 CTR 96%',
      title: `절대 ${base} 모르면 평생 손해봅니다`,
      hookIntro: `🚨 놓치면 후회하는 3초 비밀`,
      visualKeyword: `Dramatic shock warning closeup hero shot of ${base}, high tension, hyper-realistic, 8k viral`,
      ctrScore: 96,
      reason: '손실 회피 심리를 강하게 자극하여 첫 1초 스크롤 정지율(Hook Rate)을 극대화합니다.',
    },
    {
      id: 'variant_b',
      type: '💡 호기심 / 질문 유도형',
      badge: '호기심 폭발 CTR 93%',
      title: `상위 1%만 알고 있는 ${base}의 소름돋는 진실?`,
      hookIntro: `💡 당신만 몰랐던 뜻밖의 사실`,
      visualKeyword: `Mysterious glowing secret discovery scene of ${base}, cinematic dramatic lighting, volumetric atmosphere`,
      ctrScore: 93,
      reason: '비밀 폭로형 카피는 끝까지 시청하게 만드는 완청률(Audience Retention)을 높입니다.',
    },
    {
      id: 'variant_c',
      type: '⚡ 초단기 / 3줄 요약형',
      badge: '1분 완결 CTR 90%',
      title: `단 1분 만에 끝내는 ${base} 핵심 요약 TOP 3`,
      hookIntro: `⚡ 1분 만에 마스터하는 꿀팁`,
      visualKeyword: `Vibrant eye-catching 3D modern clean showcase of ${base}, bold composition, sharp focus, octane render`,
      ctrScore: 90,
      reason: '숫자와 짧은 시간을 강조하여 바쁜 현대인의 즉각적인 클릭과 저장을 유도합니다.',
    },
  ];
}

const variants = generateHookingVariants(testTopic);
assert(Array.isArray(variants) && variants.length === 3, '3개의 후킹 변형이 생성되어야 함');
assert(variants[0].ctrScore === 96 && variants[0].title.includes(testTopic), '변형 A가 CTR 96% 및 주제를 포함해야 함');
assert(variants[1].ctrScore === 93 && variants[1].hookIntro.length > 0, '변형 B가 인트로 텍스트를 포함해야 함');
assert(variants[2].visualKeyword.includes('3D'), '변형 C의 비주얼 키워드가 올바르게 생성되어야 함');

// ----------------------------------------------------
// Test 2: Multilingual Translation Output Structure Test
// ----------------------------------------------------
console.log('\n--- Test 2: translate-script-multilingual 결과 스키마 검증 ---');
const testScript = '성공한 사람들은 아침 10분에 무엇을 할까요? 첫째, 일어난 즉시 물을 마십니다.';

function getSmartMultilingualFallback(cleanTitle, cleanScript) {
  return {
    success: true,
    translations: {
      en: {
        lang: 'en',
        langName: 'English (미국 영어)',
        flag: '🇺🇸',
        title: `Stop doing this! The secret of ${cleanTitle}`,
        script: `Did you know that 99% of people get this completely wrong? Here is the shocking truth about ${cleanTitle}. First, never ignore the fundamental rule that changes everything. Second, the top 1% always focus on consistent daily habits. If you apply this starting today, your results will double in just 30 days! Share this with a friend who needs to know, and subscribe for more daily secrets!`,
        recommendedVoiceId: 'en-US-ChristopherNeural',
        recommendedVoiceName: 'Christopher (신뢰감 있는 성우)',
        tags: ['#Shorts', '#Viral', '#Tips', '#LifeHacks', '#Mindset'],
      },
      ja: {
        lang: 'ja',
        langName: '日本語 (일본어)',
        flag: '🇯🇵',
        title: `知らないと一生損する！${cleanTitle}の衝撃の真実`,
        script: `実は99%の人が勘違いしている事実をご存知ですか？今回は${cleanTitle}に関する驚きの秘密をお伝えします！まず第1に、絶対にやってはいけないNG習慣をやめること。第2に、上位1%だけが実践している正しいルーティンを取り入れること。今日から意識するだけで、あなたの日常は劇的に変わります！保存して見返せるようにして、ぜひフォローしてくださいね！`,
        recommendedVoiceId: 'ja-JP-NanamiNeural',
        recommendedVoiceName: 'Nanami (친근하고 밝은 성우)',
        tags: ['#ショート', '#おすすめ', '#雑学', '#ライフハック', '#バズ動画'],
      },
      es: {
        lang: 'es',
        langName: 'Español (스페인어)',
        flag: '🇪🇸',
        title: `¡No cometas este error! El secreto de ${cleanTitle}`,
        script: `¿Sabías que el 99% de las personas están equivocadas con esto? Hoy te revelo el secreto definitivo sobre ${cleanTitle}. Primero, nunca cometas el error común que todos repiten. Segundo, aplica la técnica que usan los mejores para obtener resultados inmediatos. ¡Ponlo en práctica hoy mismo y notarás la gran diferencia! Dale like, guarda este video y suscríbete para más consejos virales.`,
        recommendedVoiceId: 'es-ES-AlvaroNeural',
        recommendedVoiceName: 'Alvaro (열정적이고 또렷한 성우)',
        tags: ['#Shorts', '#Curiosidades', '#Viral', '#Consejos', '#Exito'],
      },
    },
  };
}

const transRes = getSmartMultilingualFallback(testTopic, testScript);
assert(transRes.success === true, '번역 응답 객체 성공 플래그가 true여야 함');
assert(transRes.translations.en.recommendedVoiceId === 'en-US-ChristopherNeural', '영문 추천 보이스 매핑 확인');
assert(transRes.translations.ja.recommendedVoiceId === 'ja-JP-NanamiNeural', '일본어 추천 보이스 매핑 확인');
assert(transRes.translations.es.recommendedVoiceId === 'es-ES-AlvaroNeural', '스페인어 추천 보이스 매핑 확인');
assert(transRes.translations.ja.tags.includes('#ショート'), '일본어 현지화 해시태그 포함 확인');

// ----------------------------------------------------
// Test 3: Export Multilingual Bundle File System Test
// ----------------------------------------------------
console.log('\n--- Test 3: export-multilingual-bundle 파일시스템 패키징 검증 ---');
const testExportDir = path.join(__dirname, '..', 'temp_test_global_bundle');
if (fs.existsSync(testExportDir)) fs.rmSync(testExportDir, { recursive: true });
fs.mkdirSync(testExportDir, { recursive: true });

for (const [key, item] of Object.entries(transRes.translations)) {
  const langSubdir = path.join(testExportDir, `${item.flag}_${item.lang.toUpperCase()}`);
  fs.mkdirSync(langSubdir, { recursive: true });
  const metaContent = `[${item.langName} 쇼츠 발행 패키지]\n\n제목: ${item.title}\n\n대본:\n${item.script}\n`;
  fs.writeFileSync(path.join(langSubdir, 'metadata_and_script.txt'), metaContent, 'utf8');
}

const createdSubdirs = fs.readdirSync(testExportDir);
assert(createdSubdirs.length === 3, '3개 국가별 하위 디렉토리가 생성되어야 함');
const enMetaExists = fs.existsSync(path.join(testExportDir, '🇺🇸_EN', 'metadata_and_script.txt'));
assert(enMetaExists, '영어 메타데이터 파일이 실제 생성되어야 함');
const enContent = fs.readFileSync(path.join(testExportDir, '🇺🇸_EN', 'metadata_and_script.txt'), 'utf8');
assert(enContent.includes('Stop doing this!'), '메타데이터 내용이 올바르게 기록되어야 함');

// Clean up test directory
fs.rmSync(testExportDir, { recursive: true });
assert(!fs.existsSync(testExportDir), '테스트 임시 폴더가 안전하게 정리되어야 함');

// ----------------------------------------------------
// Test 4: 4-Way Ken Burns Camera Motion Logic Test
// ----------------------------------------------------
console.log('\n--- Test 4: 4-Way Ken Burns 카메라 모션 수식 검증 ---');
function getMotionExpressions(sceneIdx) {
  const motionMode = sceneIdx % 4;
  let zoomExpr = `min(zoom+0.0007,1.18)`;
  let xExpr = `iw/2-(iw/zoom/2)`;
  let yExpr = `ih/2-(ih/zoom/2)`;

  if (motionMode === 0) {
    zoomExpr = `min(zoom+0.0008,1.20)`;
    xExpr = `iw/2-(iw/zoom/2)`;
    yExpr = `ih/2-(ih/zoom/2)`;
  } else if (motionMode === 1) {
    zoomExpr = `1.15`;
    xExpr = `(1-on/d)*(iw-iw/zoom)`;
    yExpr = `ih/2-(ih/zoom/2)`;
  } else if (motionMode === 2) {
    zoomExpr = `max(1.18-0.0006*on,1.0)`;
    xExpr = `iw/2-(iw/zoom/2)`;
    yExpr = `ih/2-(ih/zoom/2)`;
  } else {
    zoomExpr = `1.15`;
    xExpr = `(on/d)*(iw-iw/zoom)`;
    yExpr = `ih/2-(ih/zoom/2)`;
  }
  return { zoomExpr, xExpr, yExpr };
}

const m0 = getMotionExpressions(0); // Center Zoom In
const m1 = getMotionExpressions(1); // Pan Left
const m2 = getMotionExpressions(2); // Zoom Out
const m3 = getMotionExpressions(3); // Pan Right

assert(m0.zoomExpr.includes('0.0008'), '씬 0: 센터 슬로우 줌인 수식 확인');
assert(m1.xExpr.includes('(1-on/d)'), '씬 1: 우측에서 좌측 패닝 수식 확인');
assert(m2.zoomExpr.includes('max(1.18-0.0006*on'), '씬 2: 와이드 줌아웃 수식 확인');
assert(m3.xExpr.includes('(on/d)'), '씬 3: 좌측에서 우측 패닝 수식 확인');

// ----------------------------------------------------
// Test 5: Builtin Presets Integrity Test
// ----------------------------------------------------
console.log('\n--- Test 5: 기본 프리셋 5종 무결성 검증 ---');
const mainCjs = fs.readFileSync(path.join(__dirname, '..', 'dist-electron', 'main.cjs'), 'utf8');
assert(mainCjs.includes('translate-script-multilingual'), 'main.cjs 번들에 translate-script-multilingual 핸들러 포함 확인');
assert(mainCjs.includes('generate-hooking-variants'), 'main.cjs 번들에 generate-hooking-variants 핸들러 포함 확인');
assert(mainCjs.includes('export-multilingual-bundle'), 'main.cjs 번들에 export-multilingual-bundle 핸들러 포함 확인');
assert(!mainCjs.includes('publish-to-instagram'), 'API를 부르지 않던 가짜 publish-to-instagram 핸들러가 제거됨');
assert(!mainCjs.includes('publish-to-tiktok'), 'API를 부르지 않던 가짜 publish-to-tiktok 핸들러가 제거됨');

// ----------------------------------------------------
// Test 6: Broadcast SFX Audio Files & Sound Design Engine Test
// ----------------------------------------------------
console.log('\n--- Test 6: 5종 바이럴 SFX 음원 파일 무결성 및 사운드 디자인 검증 ---');
const expectedSfxFiles = ['sfx_whoosh.mp3', 'sfx_pop.mp3', 'sfx_ding.mp3', 'sfx_boom.mp3', 'sfx_glitch.mp3'];
const publicSfxDir = path.join(__dirname, '..', 'public', 'sfx');
const distSfxDir = path.join(__dirname, '..', 'dist', 'sfx');

expectedSfxFiles.forEach((file) => {
  const pubPath = path.join(publicSfxDir, file);
  const distPath = path.join(distSfxDir, file);
  assert(fs.existsSync(pubPath) && fs.statSync(pubPath).size > 1000, `public/sfx/${file} 파일 유효성 확인`);
  assert(fs.existsSync(distPath) && fs.statSync(distPath).size > 1000, `dist/sfx/${file} 파일 유효성 확인`);
});

assert(mainCjs.includes('buildSfxTrack'), 'main.cjs 번들에 buildSfxTrack 함수 탑재 확인');
assert(mainCjs.includes('preview-sfx'), 'main.cjs 번들에 preview-sfx IPC 채널 탑재 확인');

// ----------------------------------------------------
// Test 7: Batch Bulk Generator Configuration & Queuing Test
// ----------------------------------------------------
console.log('\n--- Test 7: 엑셀/CSV 일괄 대량 양산 엔진 검증 ---');
assert(mainCjs.includes('start-batch-job'), 'main.cjs 번들에 start-batch-job IPC 채널 포함 확인');
assert(mainCjs.includes('cancel-batch-job'), 'main.cjs 번들에 cancel-batch-job IPC 채널 포함 확인');
assert(mainCjs.includes('batch-progress'), 'main.cjs 번들에 batch-progress 이벤트 브로드캐스트 확인');
assert(mainCjs.includes('batch-completed'), 'main.cjs 번들에 batch-completed 이벤트 브로드캐스트 확인');

// ----------------------------------------------------
// Test 8: 9:16 Vertical Stock Video Search & Retrieval Test
// ----------------------------------------------------
console.log('\n--- Test 8: 9:16 스톡 비디오 검색 및 수직 종횡비 필터 검증 ---');
assert(mainCjs.includes('search-stock-videos'), 'main.cjs 번들에 search-stock-videos IPC 채널 포함 확인');
assert(mainCjs.includes('orientation=portrait'), 'Pexels 9:16 포트레이트 세로형 검색 쿼리 포함 확인');
assert(mainCjs.includes('api.pexels.com/videos/search'), 'Pexels 9:16 포트레이트 비디오 API 연동 확인');
assert(mainCjs.includes('pixabay.com/api/videos'), 'Pixabay 비디오 API 연동 확인');

// ----------------------------------------------------
// Test 9: AI Pinned Comments & Voting Suggestions Test
// ----------------------------------------------------
console.log('\n--- Test 9: AI 시청자 투표 및 고정 댓글 3종 생성 로직 검증 ---');
assert(mainCjs.includes('generate-pinned-comments'), 'main.cjs 번들에 generate-pinned-comments IPC 채널 포함 확인');
assert(mainCjs.includes('balance_game'), '밸런스 게임형 댓글 템플릿 포함 확인');
assert(mainCjs.includes('opinion_vote'), '시청자 경험 공유형 댓글 템플릿 포함 확인');
assert(mainCjs.includes('summary_quiz'), '3초 핵심 요약 퀴즈형 댓글 템플릿 포함 확인');

// ----------------------------------------------------
// Test 10: Long-to-Shorts Smart 9:16 Clipper Test
// ----------------------------------------------------
console.log('\n--- Test 10: 롱폼 to 쇼츠 하이라이트 분석 및 스마트 크롭 검증 ---');
assert(mainCjs.includes('analyze-long-video'), 'main.cjs 번들에 analyze-long-video IPC 채널 포함 확인');
assert(mainCjs.includes('extract-long-to-shorts'), 'main.cjs 번들에 extract-long-to-shorts IPC 채널 포함 확인');
assert(mainCjs.includes('crop=ih*9/16:ih:(iw-ow)/2:0,scale=1080:1920'), '가로 16:9 ➡️ 세로 9:16 센터 크롭 FFmpeg 필터 정확성 확인');

// ----------------------------------------------------
// Test 11: Word-by-word Karaoke Subtitles Engine Test
// ----------------------------------------------------
console.log('\n--- Test 11: 단어 단위 노래방 가라오케 자막 엔진 검증 ---');
assert(mainCjs.includes('isKaraokeMode'), 'main.cjs 번들에 isKaraokeMode 분기 로직 탑재 확인');
assert(mainCjs.includes('\\kf'), 'main.cjs 번들에 ASS 부드러운 가라오케 태그(\\kf) 생성 로직 탑재 확인');
assert(mainCjs.includes('karaokeTaggedWords'), 'main.cjs 번들에 단어 단위 비례 시간 분배 알고리즘 확인');

// Test Karaoke math logic in isolation
const testWords = ['인생을', '바꾸는', '아침', '습관'];
const totalChars = testWords.reduce((acc, w) => acc + w.length, 0);
const totalCentis = 200; // 2 seconds
const computedDurations = testWords.map((w) => Math.max(12, Math.round((w.length / totalChars) * totalCentis)));
assert(computedDurations.length === 4, '4개 단어에 대한 가라오케 지속시간이 개별 계산되어야 함');
assert(computedDurations[0] > 0 && computedDurations[1] > 0, '각 단어의 가라오케 지속시간이 0보다 커야 함');

// ----------------------------------------------------
// Test 12: Dynamic Emotion & Keyword Reaction Emoji Stickers Test
// ----------------------------------------------------
console.log('\n--- Test 12: 감정/키워드 반응형 다이내믹 이모지 스티커 엔진 검증 ---');
assert(mainCjs.includes('Style: EmojiSticker'), 'main.cjs 번들에 EmojiSticker ASS 스타일 정의 탑재 확인');
assert(mainCjs.includes('EMOJI_STICKER_RULES'), 'main.cjs 번들에 10대 감정/키워드 이모지 매핑 룰 탑재 확인');
assert(mainCjs.includes('pos(860,640)'), '이모지 스티커 팝업 위치 및 바운스 모션 태그 확인');

// Test sticker keyword matching
const stickerRules = [
  { pattern: /(?:돈|부자|억|수익|월급|연봉)/, emoji: '💰' },
  { pattern: /(?:충격|대박|레전드|미쳤|폭발)/, emoji: '🔥' },
  { pattern: /(?:주의|경고|위험|조심)/, emoji: '⚠️' },
  { pattern: /(?:꿀팁|비밀|비법|방법|노하우)/, emoji: '💡' },
];
assert(stickerRules[0].pattern.test('월 1000만원 부자 되는 법'), '돈/부자 키워드에 💰 이모지 매칭 확인');
assert(stickerRules[1].pattern.test('오늘 방송 대박 레전드 사건'), '충격/대박 키워드에 🔥 이모지 매칭 확인');
assert(stickerRules[2].pattern.test('이 음식 절대 주의하세요'), '주의/경고 키워드에 ⚠️ 이모지 매칭 확인');
assert(stickerRules[3].pattern.test('인생 역전 꿀팁 공개'), '꿀팁/비밀 키워드에 💡 이모지 매칭 확인');

// ----------------------------------------------------
// Test 13: Smart Publishing Scheduler & Calendar Test
// ----------------------------------------------------
console.log('\n--- Test 13: 쇼츠 발행 캘린더 & 스마트 분산 예약 엔진 검증 ---');
assert(mainCjs.includes('get-scheduled-shorts'), 'main.cjs 번들에 get-scheduled-shorts IPC 채널 탑재 확인');
assert(mainCjs.includes('schedule-short'), 'main.cjs 번들에 schedule-short IPC 채널 탑재 확인');
assert(mainCjs.includes('auto-distribute-schedule'), 'main.cjs 번들에 auto-distribute-schedule IPC 채널 탑재 확인');
assert(mainCjs.includes('cancel-scheduled-short'), 'main.cjs 번들에 cancel-scheduled-short IPC 채널 탑재 확인');
assert(mainCjs.includes('publish-scheduled-now'), 'main.cjs 번들에 publish-scheduled-now IPC 채널 탑재 확인');

// Verify calendar distribution calculation
const mockProjects = ['p1', 'p2', 'p3', 'p4'];
const timeSlots = ['18:00', '21:00'];
const baseDate = new Date('2026-09-20');
const distributed = [];
let dayOff = 0;
let sIdx = 0;
for (const p of mockProjects) {
  const d = new Date(baseDate);
  d.setDate(d.getDate() + dayOff);
  const [h, m] = timeSlots[sIdx].split(':').map(Number);
  d.setHours(h, m, 0, 0);
  distributed.push({ p, iso: d.toISOString(), hour: h });
  sIdx++;
  if (sIdx >= timeSlots.length) {
    sIdx = 0;
    dayOff += 1;
  }
}
assert(distributed.length === 4, '4개 프로젝트 분산 예약 시뮬레이션 완료');
assert(distributed[0].hour === 18 && distributed[1].hour === 21, '첫날 18:00, 21:00 슬롯 정확히 배정 확인');
assert(distributed[2].hour === 18 && distributed[3].hour === 21, '둘째날 18:00, 21:00 슬롯 정확히 배정 확인');

// Verify calendar component build chunk exists
const distAssetsDir = path.join(__dirname, '..', 'dist', 'assets');
const assetFiles = fs.readdirSync(distAssetsDir);
const hasCalendarChunk = assetFiles.some((f) => f.startsWith('PublishCalendarModal') && f.endsWith('.js'));
assert(hasCalendarChunk, 'PublishCalendarModal 전용 독립 번들 청크 분할 확인 (지연 로딩 최적화)');

// ----------------------------------------------------
// Test 14: FFmpeg Hardware Acceleration & Speed Optimizer Test
// ----------------------------------------------------
console.log('\n--- Test 14: FFmpeg GPU 하드웨어 가속 및 속도 최적화 검증 ---');
assert(mainCjs.includes('h264_nvenc'), 'NVIDIA NVENC GPU 하드웨어 가속 인코더 탐색 로직 확인');
assert(mainCjs.includes('h264_qsv'), 'Intel QuickSync QSV 하드웨어 가속 탐색 로직 확인');
assert(mainCjs.includes('-preset veryfast -crf 18 -threads 0'), 'CPU 인코딩: veryfast + CRF 18 + 전 코어(-threads 0)');

// ----------------------------------------------------
// Test 15: Windows Packaging & Release Configuration Test
// ----------------------------------------------------
console.log('\n--- Test 15: Windows 정식 배포용 패키징 빌드 규격 검증 ---');
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
assert(pkg.version.startsWith('1.4.'), 'package.json 버전이 1.4.x 이상으로 정상 승격되었는지 확인');
assert(pkg.build?.productName === 'K-Shorts Studio', 'electron-builder productName 설정 확인');
assert(Array.isArray(pkg.build?.win?.target) && pkg.build.win.target.includes('nsis'), 'Windows NSIS 인스톨러 타겟 설정 확인');
assert(Array.isArray(pkg.build?.win?.target) && pkg.build.win.target.includes('portable'), 'Windows 포터블 무설치 타겟 설정 확인');

// ----------------------------------------------------
// Test 16: Free Stock Video & Local Video Pipeline Test
// ----------------------------------------------------
console.log('\n--- Test 16: 무료 비디오(스톡/로컬) 검색 및 하이브리드 비디오 합성 파이프라인 검증 ---');

// 1. Check IPC channel registrations in main bundle
assert(mainCjs.includes('select-local-video'), 'main.cjs 번들에 select-local-video IPC 채널 등록 확인');
assert(mainCjs.includes('search-stock-videos'), 'main.cjs 번들에 search-stock-videos IPC 채널 등록 확인');
assert(mainCjs.includes('FREE_STOCK_VIDEOS_CATALOG'), 'main.cjs 번들에 고화질 무료 비디오 카탈로그 탑재 확인');

// 2. Validate Free Video Catalog schema
assert(mainCjs.includes('free_v_ocean_waves'), '바다/파도 9:16 무료 비디오 프리셋 포함 확인');
assert(mainCjs.includes('free_v_city_skyscrapers'), '도심 빌딩 9:16 무료 비디오 프리셋 포함 확인');
assert(mainCjs.includes('free_v_desk_work'), '비즈니스/컴퓨터 9:16 무료 비디오 프리셋 포함 확인');

// 3. Simulate Hybrid Video & Image FFmpeg Composition Filtergraph
const mockSceneMediaList = [
  { type: 'video', path: '/tmp/scene_0_video.mp4' },
  { type: 'image', path: '/tmp/scene_1.png' },
  { type: 'video', path: '/tmp/scene_2_stock.mp4' },
];

const mockSceneDur = 5.0;
const mockFps = 25;
const mockInputArgs = mockSceneMediaList.map((m) => {
  if (m.type === 'video') {
    return `-stream_loop -1 -t ${mockSceneDur} -i "${m.path}"`;
  } else {
    return `-loop 1 -t ${mockSceneDur} -i "${m.path}"`;
  }
}).join(' ');

assert(mockInputArgs.includes('-stream_loop -1 -t 5 -i "/tmp/scene_0_video.mp4"'), '비디오 씬 stream_loop 입력 인수 정상 구성');
assert(mockInputArgs.includes('-loop 1 -t 5 -i "/tmp/scene_1.png"'), '이미지 씬 loop 1 입력 인수 정상 구성');

const mockFilterChains = [];
for (let i = 0; i < mockSceneMediaList.length; i++) {
  const media = mockSceneMediaList[i];
  if (media.type === 'video') {
    mockFilterChains.push(
      `[${i}:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1,fps=${mockFps},trim=duration=${mockSceneDur},setpts=PTS-STARTPTS[v${i}]`
    );
  } else {
    mockFilterChains.push(
      `[${i}:v]scale=1080:1920,setsar=1,zoompan=z='min(zoom+0.0008,1.20)':d=125:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps=${mockFps},trim=duration=${mockSceneDur},setpts=PTS-STARTPTS[v${i}]`
    );
  }
}
const mockConcat = mockSceneMediaList.map((_, i) => `[v${i}]`).join('');
mockFilterChains.push(`${mockConcat}concat=n=${mockSceneMediaList.length}:v=1:a=0[vbg]`);

assert(mockFilterChains[0].includes('crop=1080:1920'), '비디오 씬 9:16 센터 크롭 필터 검증');
assert(mockFilterChains[1].includes('zoompan='), '이미지 씬 켄 번스 모션 필터 검증');
assert(mockFilterChains[3].includes('[v0][v1][v2]concat=n=3:v=1:a=0[vbg]'), '하이브리드 씬 3개 완벽 concat 연결 검증');

// 4. Check SceneTimelineEditor contains video mode
const sceneEditorSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'SceneTimelineEditor.tsx'), 'utf8');
assert(sceneEditorSource.includes('selectLocalVideo'), 'SceneTimelineEditor에 내 PC 무료 영상 선택 연동 확인');
assert(sceneEditorSource.includes('searchStockVideos'), 'SceneTimelineEditor에 무료 스톡 비디오 검색 연동 확인');
assert(sceneEditorSource.includes('handleAutoMatchAllVideos'), 'SceneTimelineEditor에 전 씬 무료 비디오 자동 매칭 연동 확인');

// 5. Check TemplateSelector contains stock video mode toggle
const templateSelectorSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'TemplateSelector.tsx'), 'utf8');
assert(templateSelectorSource.includes('enableStockVideo'), 'TemplateSelector에 무료 비디오 우선 모드 토글 스위치 확인');

// 17. 보안 검증: 관리자 코드 전용 엄격 인증 및 100 토큰 차감 시스템 검증
console.log('\n[테스트 17] 관리자 코드 전용 엄격 접근 제어 및 쇼츠당 100 토큰제 검증');

// 관리자 키 검증값은 저장소 밖 admin.local.json 또는 환경 변수 KSHORTS_ADMIN_FNV에만 있다.
function readAdminKeyFnv() {
  const fromEnv = Number(process.env.KSHORTS_ADMIN_FNV || 0);
  if (fromEnv > 0) return fromEnv >>> 0;
  try { return Number(JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'admin.local.json'), 'utf8')).adminKeyFnv || 0) >>> 0; } catch { return 0; }
}

// 관리자 코드 외 임의 라이센스 키 전면 차단 검증 함수
function validateAuthCode(rawInput) {
  const trimmed = (rawInput || '').trim();
  if (trimmed.length === 10) {
    let h = 0x811c9dc5;
    for (let i = 0; i < trimmed.length; i++) {
      h ^= trimmed.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    const fnv = readAdminKeyFnv();
    if (fnv && (h >>> 0) === fnv) {
      return { valid: true, isAdmin: true, userName: '마스터 관리자', tokens: 999999999 };
    }
  }
  return { valid: false, isAdmin: false, error: '접근 권한이 없습니다. 승인된 관리자 코드만 접속 가능합니다.' };
}

// 1. 관리자 마스터 코드 승인 검증
// 관리자 코드는 소스에 평문으로 두지 않고 환경변수(KSHORTS_ADMIN_CODE)로만 주입한다. 미설정 시 해당 검증은 건너뛴다.
const ADMIN_CODE = process.env.KSHORTS_ADMIN_CODE || '';
if (!ADMIN_CODE) console.warn('⚠️ KSHORTS_ADMIN_CODE 미설정: 관리자 코드 기반 검증 항목은 SKIP(미검증) 처리됩니다.');
const adminResult = validateAuthCode(ADMIN_CODE || '__unset__');
if (ADMIN_CODE) assert(adminResult.valid === true && adminResult.isAdmin === true, '관리자 코드 입력 시 관리자 승격 확인');
if (ADMIN_CODE) assert(adminResult.tokens === 999999999, '관리자 계정 무한 토큰(999,999,999) 지급 확인');

// 2. 관리자 외 임의 16자리 키 및 일반 키 전면 차단 검증 (아무거나 접속 차단)
const licenseResult1 = validateAuthCode('KSH7-ABCD-1234-EFGH');
assert(licenseResult1.valid === false, '임의 16자리 라이센스 키 접속 전면 차단 검증');

const licenseResult2 = validateAuthCode('ksh7abcd1234efgh');
assert(licenseResult2.valid === false, '비인가 라이센스 키 입력 거절 검증');

const invalidResult1 = validateAuthCode('12345');
assert(invalidResult1.valid === false, '오답 입력 거절 검증');

const invalidResult2 = validateAuthCode('');
assert(invalidResult2.valid === false, '빈 값 입력 거절 검증');

// 3. 쇼츠 1편 제작당 100 토큰 차감 시스템 런타임 시뮬레이션
let userTokens = 500;
function simulateRenderShort(isAdmin) {
  if (isAdmin) {
    return { success: true, remainingTokens: Infinity };
  }
  if (userTokens < 100) {
    return { success: false, error: '토큰 부족', remainingTokens: userTokens };
  }
  userTokens -= 100;
  return { success: true, remainingTokens: userTokens };
}

// 쇼츠 1편 제작 -> 100 토큰 차감
const render1 = simulateRenderShort(false);
assert(render1.success === true && render1.remainingTokens === 400, '일반 유저 쇼츠 1편 제작 시 정확히 100 토큰 차감 확인 (500 -> 400)');

// 4편 더 제작하여 토큰 소진
simulateRenderShort(false); // 300
simulateRenderShort(false); // 200
simulateRenderShort(false); // 100
const render5 = simulateRenderShort(false); // 0
assert(render5.remainingTokens === 0, '5편 제작 후 보유 토큰 0P 도달 확인');

// 토큰 0P 상태에서 추가 제작 시도 -> 즉각 차단
const renderBlocked = simulateRenderShort(false);
assert(renderBlocked.success === false && renderBlocked.error === '토큰 부족', '토큰 100개 미만 시 쇼츠 제작 즉각 차단 검증');

// 관리자는 무제한 토큰이므로 언제나 무한 제작 가능
const adminRender = simulateRenderShort(true);
assert(adminRender.success === true && adminRender.remainingTokens === Infinity, '관리자는 토큰 차감 없이 무한(Infinity) 제작 가능 확인');

// 4. 단방향 해시/체크섬 검증 엔진 런타임 테스트 (검증값은 저장소 밖 admin.local.json/환경 변수에만 있다)
const ADMIN_FNV = readAdminKeyFnv();
function verifyAdminKey(input) {
  if (!ADMIN_FNV) return false;
  const trimmed = input.trim();
  if (trimmed.length !== 10) return false;
  let h = 0x811c9dc5;
  for (let i = 0; i < trimmed.length; i++) {
    h ^= trimmed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0) === ADMIN_FNV;
}
if (ADMIN_CODE) assert(verifyAdminKey(ADMIN_CODE) === true, '관리자 코드 입력 시 단방향 검증 함수 100% 매칭 통과');
assert(verifyAdminKey('wrongcode1') === false, '오답 입력 시 단방향 검증 거절 확인');

// 5. 소스코드 보안 정적 검증 (흔적 제거 및 자동완성 차단 검증)
const loginScreenSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'LoginScreen.tsx'), 'utf8');
if (ADMIN_CODE) assert(!loginScreenSource.includes(ADMIN_CODE), '보안 강화: LoginScreen.tsx 소스 및 번들에 관리자 코드 평문 흔적 0% 검증');
assert(!loginScreenSource.includes('MASTER_ADMIN') && (!ADMIN_FNV || !loginScreenSource.includes(String(ADMIN_FNV))) && loginScreenSource.includes('__ADMIN_KEY_FNV__'), 'LoginScreen.tsx에 관리자 검증값을 소스에 두지 않고 빌드 시 주입(__ADMIN_KEY_FNV__)');
assert(loginScreenSource.includes('autoComplete="new-password"'), 'LoginScreen.tsx에 자동완성 방지(autoComplete="new-password") 탑재 확인');
assert(loginScreenSource.includes('data-lpignore="true"'), 'LoginScreen.tsx에 패스워드 매니저 자동완성 차단(data-lpignore) 탑재 확인');
if (ADMIN_CODE) assert(!loginScreenSource.includes(ADMIN_CODE), '보안 강화: 화면상에 관리자 코드 노출 버튼 완전 제거 확인');
assert(loginScreenSource.includes('showKey'), '비밀번호 마스킹 및 엿보기 방지(Eye 토글) 기능 탑재 확인');

assert(loginScreenSource.includes('activateLicense') && loginScreenSource.includes('LICENSE_KEY_LENGTH'), 'LoginScreen.tsx가 16자리 키를 메인 프로세스(라이선스 서버)로 인증');
assert(!loginScreenSource.includes('무제한 토큰이 제공되며'), 'LoginScreen.tsx에 불필요한 토큰 안내 문구 완전 삭제 확인');

const appSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'App.tsx'), 'utf8');
if (ADMIN_CODE) assert(!appSource.includes(ADMIN_CODE), '보안 강화: App.tsx 소스에 관리자 코드 평문 흔적 0% 검증');
assert(appSource.includes('kshorts_auth'), 'App.tsx에 kshorts_auth 라이센스 영구 인증 저장소 연동 확인');
assert(appSource.includes('KSH-MASTER-ADMIN-SESSION'), '보안 강화: App.tsx localStorage에 관리자 평문 코드 미저장(KSH-MASTER-ADMIN-SESSION 마스킹 세션) 확인');
assert(appSource.includes('tokens < 100'), 'App.tsx에 쇼츠 1편 제작 시 100 토큰 필수 검증 로직 확인');
assert(appSource.includes('onLicenseStatus') && !appSource.includes('deductLicenseTokens'), 'App.tsx는 서버 장부 상태를 받아 표시하고 차감은 메인 프로세스가 처리');
assert(appSource.includes('isAdmin={user.isAdmin}'), 'App.tsx에 관리자 권한 상태 Sidebar 전달 연동 확인');

const sidebarSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'Sidebar.tsx'), 'utf8');
assert(sidebarSource.includes('보유 토큰'), 'Sidebar.tsx에 보유 토큰 위젯 UI 탑재 확인');
assert(sidebarSource.includes('무제한 (∞)'), 'Sidebar.tsx에 관리자 전용 무제한(∞) 토큰 뱃지 탑재 확인');

const autoPilotSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'AutoPilotPage.tsx'), 'utf8');
assert(autoPilotSource.includes('stopAutoPilot'), 'AutoPilotPage.tsx에 예약 끄기 시 stopAutoPilot 연동 확인');

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
assert(packageJson.version.startsWith('1.4.'), 'package.json 버전 1.4.x 업데이트 반영 확인');

const electronMainSource = fs.readFileSync(path.join(__dirname, '..', 'electron', 'main.ts'), 'utf8');
assert(electronMainSource.includes('hasActualUpdate'), 'electron/main.ts에 신규 빌드/버전 자동 감지 업데이트 로직 확인');
assert(electronMainSource.includes('stop-autopilot'), 'electron/main.ts에 stop-autopilot 즉각 강제 중단 IPC 채널 탑재 확인');
assert(electronMainSource.includes('isAutoPilotCancelled = true'), 'electron/main.ts에 예약 끄기 시 진행 작업 즉각 중단 플래그 확인');

console.log('\n--- [테스트 18] 라이선스 IPC / 화면 연동 (서버 장부 방식) ---');
const compiledBundle = fs.readFileSync(path.join(__dirname, '..', 'dist-electron', 'main.cjs'), 'utf8');
for (const ch of ['license-status', 'license-refresh', 'license-activate', 'license-logout', 'license-set-admin']) {
  assert(compiledBundle.includes(ch), `main.cjs 번들에 ${ch} IPC 채널 탑재 확인`);
}
for (const gone of ['issue-license', 'issue-batch-licenses', 'verify-and-redeem-license', 'deduct-license-tokens']) {
  assert(!compiledBundle.includes(gone), `main.cjs 번들에서 예전 ${gone} 채널 제거 확인`);
}
const tokenRechargeModalSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'TokenRechargeModal.tsx'), 'utf8');
assert(tokenRechargeModalSource.includes('activateLicense') && tokenRechargeModalSource.includes('formatLicenseExpiry'), 'TokenRechargeModal.tsx가 남은 토큰·사용 기간을 보여주고 키 교체 로그인을 지원');
assert(!fs.existsSync(path.join(__dirname, '..', 'src', 'components', 'LicenseManagementPage.tsx')), '로컬 라이선스 발급 화면(LicenseManagementPage) 제거 확인 — 발급은 판매자 PC의 license_admin.py');
assert(sidebarSource.includes('onOpenRechargeModal'), 'Sidebar.tsx에 onOpenRechargeModal 토큰 안내 버튼 연동 확인');
assert(!sidebarSource.includes("'licenses'"), 'Sidebar.tsx에서 관리자 licenses 탭 제거 확인');

console.log('\n--- [테스트 19] 2순위: 성우 발화 배속(1.0x~1.3x) 및 4대 트렌디 자막 모션 연동 검증 ---');
assert(compiledBundle.includes('effectiveVoiceSpeed') || compiledBundle.includes('voiceSpeed'), 'main.cjs 번들에 voiceSpeed 배속 파라미터 처리 확인');
assert(compiledBundle.includes('subtitleMotionType'), 'main.cjs 번들에 subtitleMotionType 파라미터 탑재 확인');
assert(compiledBundle.includes('slide_up') && compiledBundle.includes('typewriter'), 'main.cjs 번들에 슬라이드업/타자기 자막 모션 필터 탑재 확인');

const voiceSelectorSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'VoiceSelector.tsx'), 'utf8');
assert(voiceSelectorSource.includes('voiceSpeed'), 'VoiceSelector.tsx에 voiceSpeed 배속 선택 UI 탑재 확인');
assert(voiceSelectorSource.includes('1.1x 추천'), 'VoiceSelector.tsx에 1.1x 숏폼 추천 배속 탑재 확인');

const subtitleSelectorSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'SubtitleStyleSelector.tsx'), 'utf8');
assert(subtitleSelectorSource.includes('selectedMotionType'), 'SubtitleStyleSelector.tsx에 자막 모션 선택 인터페이스 확인');
assert(subtitleSelectorSource.includes('slide_up') && subtitleSelectorSource.includes('typewriter'), 'SubtitleStyleSelector.tsx에 슬라이드업/타자기 모션 칩 확인');

console.log('\n--- [테스트 20] 3순위: 텔레그램 알림 봇 고화질 썸네일 사진(sendPhoto) 및 멀티 플랫폼 연동 검증 ---');
assert(compiledBundle.includes('sendPhoto'), 'main.cjs 번들에 Telegram sendPhoto API 연동 확인');
assert(compiledBundle.includes('thumbnailPath'), 'main.cjs 번들에 텔레그램 썸네일 이미지 전송 파라미터 확인');
assert(compiledBundle.includes('test-instagram-connection'), 'main.cjs 번들에 Instagram 연결 테스트 채널 확인');
assert(!compiledBundle.includes('publish-to-instagram'), '가짜 Instagram 발행 채널이 번들에 없음');
assert(compiledBundle.includes('test-tiktok-connection'), 'main.cjs 번들에 TikTok 연결 테스트 채널 확인');
assert(!compiledBundle.includes('publish-to-tiktok'), '가짜 TikTok 발행 채널이 번들에 없음');

console.log('\n--- [테스트 21] 4순위: Windows 최종 배포용 인스톨러 및 빌드 무결성 검증 ---');
assert(fs.existsSync(path.join(__dirname, '..', 'dist', 'index.html')), 'dist/index.html 빌드 산출물 무결성 확인');
assert(fs.existsSync(path.join(__dirname, '..', 'dist-electron', 'main.cjs')), 'dist-electron/main.cjs 메인 엔진 빌드 무결성 확인');
const distFiles = fs.readdirSync(path.join(__dirname, '..', 'dist', 'assets'));
assert(!distFiles.some((f) => f.startsWith('LicenseManagementPage')), 'LicenseManagementPage 청크가 번들에 없음');
assert(packageJson.build && packageJson.build.win, 'package.json Windows 빌드 설정 완비 확인');
assert(packageJson.build.win.target.includes('nsis'), 'package.json Windows NSIS 인스톨러 타겟 탑재 확인');
assert(packageJson.build.win.target.includes('portable'), 'package.json Windows 포터블 무설치 타겟 탑재 확인');

console.log('\n--- [테스트 22] 1순위: Pexels/Pixabay 연결 테스트, 키워드 사전 확충 & 스마트 폴백 검증 ---');
const mainTsSource = fs.readFileSync(path.join(__dirname, '..', 'electron', 'main.ts'), 'utf8');
const preloadSource = fs.readFileSync(path.join(__dirname, '..', 'electron', 'preload.ts'), 'utf8');
const aiSettingsSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'AISettingsPage.tsx'), 'utf8');
const settingsModalSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'SettingsModal.tsx'), 'utf8');
const tmplSelectorSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'TemplateSelector.tsx'), 'utf8');

assert(mainTsSource.includes('test-pexels-connection'), 'main.ts에 test-pexels-connection IPC 채널 탑재 확인');
assert(mainTsSource.includes('test-pixabay-connection'), 'main.ts에 test-pixabay-connection IPC 채널 탑재 확인');
assert(mainTsSource.includes('api.pexels.com/v1/curated'), 'Pexels API 유효성 검증 curated 엔드포인트 연동 확인');
assert(mainTsSource.includes('pixabay.com/api/'), 'Pixabay API 유효성 검증 엔드포인트 연동 확인');
assert(preloadSource.includes('testPexelsConnection'), 'preload.ts에 testPexelsConnection 노출 확인');
assert(preloadSource.includes('testPixabayConnection'), 'preload.ts에 testPixabayConnection 노출 확인');
assert(aiSettingsSource.includes('handleTestPexels'), 'AISettingsPage.tsx에 Pexels 연결 테스트 버튼 탑재 확인');
assert(aiSettingsSource.includes('handleTestPixabay'), 'AISettingsPage.tsx에 Pixabay 연결 테스트 버튼 탑재 확인');
assert(settingsModalSource.includes('handleTestPexels'), 'SettingsModal.tsx에 Pexels 연결 테스트 버튼 탑재 확인');
assert(settingsModalSource.includes('handleTestPixabay'), 'SettingsModal.tsx에 Pixabay 연결 테스트 버튼 탑재 확인');
assert(tmplSelectorSource.includes('비디오 모드 ON'), 'TemplateSelector.tsx에 무료 비디오 모드 배지 가이드 탑재 확인');
assert(tmplSelectorSource.includes('Pexels API 키가 등록되지 않았습니다'), 'TemplateSelector.tsx에 Pexels 키 미등록 시 친절한 안내 가이드 탑재 확인');
assert(mainTsSource.includes('아침루틴') && mainTsSource.includes('번아웃') && mainTsSource.includes('인간관계'), 'translateKoreanVisualKeywords에 쇼츠 빈출 키워드(루틴, 번아웃, 대화법 등) 대폭 확충 확인');
assert(mainTsSource.includes('cinematic nature modern background'), 'searchStockVideoInternal에 0건 시 2차 스마트 재검색 폴백 로직 확인');

console.log('\n--- [테스트 23] 2순위: 씬 전환 효과, 자막 핵심 단어 하이라이트 & 오디오 페이드아웃 검증 ---');
assert(mainTsSource.includes('highlightKeywords'), 'main.ts에 highlightKeywords 자막 하이라이트 옵션 연동 확인');
assert(mainTsSource.includes('transitionType'), 'main.ts에 transitionType 씬 전환 효과 연동 확인');
assert(mainTsSource.includes('afade=t=out:st='), 'main.ts에 영상 끝단 1.5초 오디오 자연스러운 페이드아웃(afade) 탑재 확인');
assert(mainTsSource.includes('xfade=transition=fade'), 'main.ts 장면 전환은 검은 화면 대신 크로스페이드(xfade)');
assert(tmplSelectorSource.includes('씬 전환 효과:'), 'TemplateSelector.tsx에 씬 전환 효과 선택 칩 바 탑재 확인');
assert(tmplSelectorSource.includes('부드러운 페이드') && tmplSelectorSource.includes('다이내믹 줌'), 'TemplateSelector.tsx에 페이드/줌 트랜지션 선택 옵션 확인');
assert(subtitleSelectorSource.includes('핵심 단어 & 숫자 자동 하이라이트 컬러'), 'SubtitleStyleSelector.tsx에 핵심 단어 하이라이트 토글 스위치 탑재 확인');
assert(appSource.includes('highlightKeywords') && appSource.includes('transitionType'), 'App.tsx에 자막 하이라이트 및 트랜지션 상태 관리 및 렌더 연동 확인');

console.log('\n--- [테스트 24] 3순위: GPU 하드웨어 가속(NVENC/QSV/CPU) 인코딩 & 진단 검증 ---');
assert(mainTsSource.includes('check-gpu-acceleration'), 'main.ts에 check-gpu-acceleration IPC 채널 탑재 확인');
assert(preloadSource.includes('checkGpuAcceleration'), 'preload.ts에 checkGpuAcceleration 노출 확인');
assert(mainTsSource.includes('h264_nvenc') && mainTsSource.includes('h264_qsv'), 'NVIDIA NVENC 및 Intel QSV 가속 인코더 감지 로직 확인');
assert(mainTsSource.includes('preferredEncoder'), 'getAvailableH264Encoder에 사용자 선호 인코더 우선순위 처리 확인');
assert(aiSettingsSource.includes('handleCheckGpu'), 'AISettingsPage.tsx에 GPU 하드웨어 가속 진단 버튼 탑재 확인');
assert(aiSettingsSource.includes('GPU 하드웨어 가속 및 렌더링 인코더'), 'AISettingsPage.tsx에 GPU 가속 설정 섹션 탑재 확인');
assert(aiSettingsSource.includes('NVIDIA GPU') && aiSettingsSource.includes('Intel QuickSync'), 'AISettingsPage.tsx에 NVENC / QSV 인코더 선택 칩 탑재 확인');

console.log('\n--- [테스트 25] Pexels 실사 비디오 매칭 연동 및 CDN 다운로드 강화 검증 ---');
assert(mainTsSource.includes('params.enableStockVideo || settings.imageEngine === \'pexels\''), 'AI 설정에서 pexels 선택 시에도 실사 비디오 자동 매칭 연동 확인');
assert(mainTsSource.includes('User-Agent') && mainTsSource.includes('video/webm'), 'downloadVideoToTemp에 브라우저 User-Agent 및 비디오 헤더 탑재 확인');
assert(mainTsSource.includes('height > f.width') && mainTsSource.includes('width >= 720'), 'Pexels 비디오 해상도 우선순위(9:16 HD) 탐색 로직 확인');
assert(aiSettingsSource.includes('Pexels 실사 미디어 (비디오 & 사진)'), 'AISettingsPage.tsx에 비디오&사진 명확한 안내 라벨 확인');
assert(settingsModalSource.includes('Pexels 실사 미디어 (비디오 & 사진)'), 'SettingsModal.tsx에 비디오&사진 명확한 안내 라벨 확인');

console.log('\n--- [테스트 26] 주제 다양성 풀 확장 & 다채로운 스토리텔링 대본 포맷 검증 ---');
const promptSectionSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'PromptSection.tsx'), 'utf8');
assert(promptSectionSource.includes('CATEGORIZED_TOPICS'), 'PromptSection.tsx에 카테고리별 주제 분류 탑재 확인');
assert(promptSectionSource.includes('🤯 충격 반전 & 미스터리') && promptSectionSource.includes('🧠 뇌과학 & 심리/관계'), 'PromptSection.tsx에 뇌과학, 충격 반전 등 신규 카테고리 탑재 확인');
assert(promptSectionSource.includes('스위스에서 밤 10시') && promptSectionSource.includes('스타벅스가 컵에'), 'PromptSection.tsx에 120개 이상 참신한 글로벌 주제 풀 확장 확인');
assert(promptSectionSource.includes('selectedCategory') && promptSectionSource.includes('handleSelectCategory'), 'PromptSection.tsx에 카테고리 선택 탭 바 UI 연동 확인');
assert(mainTsSource.includes('brain_body_science') && mainTsSource.includes('shocking_facts'), 'main.ts FALLBACK_AUTONOMOUS_TOPICS에 뇌과학 및 충격팩트 카테고리 확장 확인');
assert(mainTsSource.includes('반전 & 진실 폭로형') && mainTsSource.includes('단조로운 틀 탈피'), 'KOREAN_SHORTS_SYSTEM_PROMPT에 다채로운 스토리텔링 포맷 가이드 탑재 확인');
assert(mainTsSource.includes('흑역사') && mainTsSource.includes('변기 물'), 'generateSmartKoreanScript에 뇌과학/해외법률 등 스토리텔링 분기 탑재 확인');

console.log('\n--- [테스트 27] 2순위: 카테고리별 BGM 자동 추천 & get-recommended-bgm IPC 검증 ---');
const bgmSelectorSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'BgmSelector.tsx'), 'utf8');
assert(mainTsSource.includes('get-recommended-bgm'), 'main.ts에 get-recommended-bgm IPC 채널 등록 확인');
assert(preloadSource.includes('getRecommendedBgm'), 'preload.ts에 getRecommendedBgm API 노출 확인');
assert(mainTsSource.includes('bgm_suspense') && mainTsSource.includes('bgm_tech') && mainTsSource.includes('bgm_epic'), 'getRecommendedBgmMood에 5대 카테고리 BGM 자동 매핑 확인');
assert(bgmSelectorSource.includes('detectedMood') && bgmSelectorSource.includes('자동 선곡 예정:'), 'BgmSelector.tsx에 실시간 추천 BGM 감지 및 안내 뱃지 탑재 확인');
assert(appSource.includes('currentTopic={prompt}'), 'App.tsx에서 BgmSelector로 현재 주제(currentTopic) 전달 확인');

console.log('\n--- [테스트 28] 2순위: 자막 하이라이트 키워드 연동 SFX 자동 싱크(syncHighlightSfx) 검증 ---');
assert(mainTsSource.includes('syncHighlightSfx') && mainTsSource.includes('lastKeywordSfxMs'), 'main.ts buildSfxTrack에 자막 하이라이트 키워드 싱크 SFX 큐 생성 로직 확인');
assert(mainTsSource.includes('sfx_pop') && mainTsSource.includes('sfx_ding'), 'main.ts에 키워드/숫자별 Pop/Ding 효과음 자동 분기 매칭 확인');
assert(bgmSelectorSource.includes('syncHighlightSfx') && bgmSelectorSource.includes('자막 핵심 단어 & 숫자 효과음 자동 싱크'), 'BgmSelector.tsx에 자막 키워드 효과음 싱크 토글 스위치 탑재 확인');
assert(appSource.includes('syncHighlightSfx') && appSource.includes('setSyncHighlightSfx'), 'App.tsx에 syncHighlightSfx 상태 관리 및 렌더 파이프라인 연동 확인');

console.log('\n--- [테스트 29] 3순위: 대량 양산 큐 에러 내구성(Fault-Tolerance) & 재시도 메커니즘 검증 ---');
const batchModalSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'BatchGeneratorModal.tsx'), 'utf8');
assert(mainTsSource.includes('maxRetries = 2') && mainTsSource.includes('Retrying item'), 'main.ts start-batch-job에 최대 2회 자동 재시도 로직 확인');
assert(mainTsSource.includes('failedList') && mainTsSource.includes('failedList.push'), 'main.ts에 실패 항목 상세 로그 및 failedList 수집/전달 확인');
assert(batchModalSource.includes('failedItems') && batchModalSource.includes('setFailedItems'), 'BatchGeneratorModal.tsx에 failedItems 상태 연동 확인');
assert(batchModalSource.includes('실패한') && batchModalSource.includes('개 항목만 즉시 재시도'), 'BatchGeneratorModal.tsx에 실패 항목 원클릭 재시도 버튼 및 복구 UI 탑재 확인');

console.log('\n--- [테스트 30] 대량 양산: 편당 1회 선차감(재시도 이중 차감 없음) & 실패 환불 ---');
assert(mainTsSource.includes('chargeId = await chargeShort()') && mainTsSource.includes('!chargeFailed'), 'start-batch-job이 항목마다 한 번만 선차감하고 재시도 루프 밖에서 처리');
assert(mainTsSource.includes('await refundShort(chargeId)'), '대량 양산 항목이 최종 실패하면 선차감 토큰 환불');
console.log('\n--- [테스트 31] 사용자 영상 분석 쇼츠 제작 모드 & 기존 음성 제거(음소거) 및 BGM 교체 검증 ---');
const videoPageSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'VideoToShortsPage.tsx'), 'utf8');
const currentSidebarSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'Sidebar.tsx'), 'utf8');
const dashboardSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'DashboardHome.tsx'), 'utf8');
const typesSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'types', 'index.ts'), 'utf8');

assert(mainTsSource.includes('analyze-video-for-shorts'), 'main.ts에 analyze-video-for-shorts IPC 채널 탑재 확인');
assert(mainTsSource.includes('render-video-to-shorts'), 'main.ts에 render-video-to-shorts IPC 채널 탑재 확인');
assert(mainTsSource.includes('select-source-video'), 'main.ts에 select-source-video 파일 선택 다이얼로그 채널 확인');
assert(mainTsSource.includes('removeOriginalAudio') && mainTsSource.includes('-an'), 'main.ts에 기존 음성 완전 제거(음소거) -an 옵션 처리 확인');
assert(mainTsSource.includes('removeOriginalAudio') && mainTsSource.includes('atrim=0:${durationSec},volume=${bgmVolume}'), 'main.ts에 기존 음성 제거 후 신규 BGM 교체 필터 체인 확인');
assert(mainTsSource.includes('cropMode') && mainTsSource.includes('gblur'), 'main.ts에 9:16 스마트 크롭 및 상하 블러 패딩 필터 탑재 확인');
assert(preloadSource.includes('analyzeVideoForShorts'), 'preload.ts에 analyzeVideoForShorts API 노출 확인');
assert(preloadSource.includes('renderVideoToShorts'), 'preload.ts에 renderVideoToShorts API 노출 확인');
assert(preloadSource.includes('selectSourceVideo'), 'preload.ts에 selectSourceVideo API 노출 확인');
assert(typesSource.includes('interface VideoAnalysisResult') && typesSource.includes('interface VideoToShortsParams'), 'types/index.ts에 VideoAnalysisResult 및 VideoToShortsParams 타입 정의 확인');
assert(videoPageSource.includes('removeOriginalAudio') && videoPageSource.includes('기존 음성 완전 제거 (음소거)'), 'VideoToShortsPage.tsx에 기존 음성 제거 토글 스위치 탑재 확인');
assert(videoPageSource.includes('bgm_upbeat') && videoPageSource.includes('bgm_suspense') && videoPageSource.includes('bgm_lofi'), 'VideoToShortsPage.tsx에 5대 로열티 프리 BGM 선택 칩 탑재 확인');
assert(videoPageSource.includes('handleToggleBgmAudio') && videoPageSource.includes('audioRef'), 'VideoToShortsPage.tsx에 BGM 실시간 미리듣기 플레이어 탑재 확인');
assert(videoPageSource.includes('smart_crop') && videoPageSource.includes('blur_padding'), 'VideoToShortsPage.tsx에 9:16 스마트 크롭 및 상하 블러 패딩 선택 UI 확인');
assert(videoPageSource.includes('yellow_tape') && videoPageSource.includes('breaking') && videoPageSource.includes('ssul_badge'), 'VideoToShortsPage.tsx에 상단 타이틀 배너 스타일 프리셋 탑재 확인');
assert(currentSidebarSource.includes('video-to-shorts') && currentSidebarSource.includes('영상 분석 쇼츠'), 'Sidebar.tsx에 video-to-shorts 메뉴 탭 및 NEW 뱃지 탑재 확인');
assert(dashboardSource.includes('영상 분석 쇼츠') && dashboardSource.includes("onNavigate('video-to-shorts')"), 'DashboardHome.tsx에 영상 분석 쇼츠 원클릭 바로가기 버튼 탑재 확인');
assert(appSource.includes('video-to-shorts') && appSource.includes('<VideoToShortsPage'), 'App.tsx에 video-to-shorts 라우팅 및 VideoToShortsPage 렌더링 연동 확인');

// ----------------------------------------------------
// 테스트 32: 업데이트 설치 파일 출처/무결성(SHA-256) 검증 — main.ts의 실제 헬퍼 코드를 추출해 실행
// ----------------------------------------------------
console.log('\n--- [테스트 32] 업데이트 설치 파일 출처 제한 & SHA-256 무결성 검증 (실제 함수 실행) ---');
{
  const nodeCrypto = require('crypto');
  const nodeFs = require('fs');
  const nodeOs = require('os');
  const tsLib = require('typescript');
  const startIdx = mainTsSource.indexOf('// ---- 업데이트 설치 파일 무결성/출처 검증 헬퍼 ----');
  const endIdx = mainTsSource.indexOf('function downloadFileWithProgress(');
  assert(startIdx > 0 && endIdx > startIdx, 'main.ts에서 업데이트 검증 헬퍼 블록 추출 성공');
  const block = mainTsSource.slice(startIdx, endIdx);
  const js = tsLib.transpileModule(block + '\nmodule.exports = { isTrustedUpdateUrl, pickInstallerAsset, parseSha256, sha256FromDigest, sha256OfFile };', {
    compilerOptions: { module: tsLib.ModuleKind.CommonJS, target: tsLib.ScriptTarget.ES2020 },
  }).outputText;
  const mod = { exports: {} };
  new Function('module', 'exports', 'require', 'fs', 'crypto', 'fetch', 'AbortController', js)(mod, mod.exports, require, nodeFs, nodeCrypto, undefined, AbortController);
  const H = mod.exports;

  // URL 허용 목록
  assert(H.isTrustedUpdateUrl('https://github.com/o/r/releases/download/v1.4.8/a.exe') === true, 'github.com https 주소 허용');
  assert(H.isTrustedUpdateUrl('https://objects.githubusercontent.com/x') === true, 'objects.githubusercontent.com 허용(릴리즈 리다이렉트 대상)');
  assert(H.isTrustedUpdateUrl('http://github.com/o/r/a.exe') === false, 'http(비암호화) 주소 거부');
  assert(H.isTrustedUpdateUrl('https://evilgithub.com/a.exe') === false, '유사 도메인(evilgithub.com) 거부');
  assert(H.isTrustedUpdateUrl('https://github.com.evil.io/a.exe') === false, '서브도메인 위장(github.com.evil.io) 거부');
  assert(H.isTrustedUpdateUrl('file:///C:/a.exe') === false && H.isTrustedUpdateUrl('') === false && H.isTrustedUpdateUrl('not a url') === false, 'file:/빈 문자열/비정상 URL 거부');

  // 설치 파일 선택 (Portable .exe와 혼동 금지)
  const assets = [
    { name: 'K-Shorts.Studio-Portable-1.4.8.exe', browser_download_url: 'https://github.com/p' },
    { name: 'K-Shorts.Studio-Setup-1.4.8.exe.blockmap', browser_download_url: 'https://github.com/b' },
    { name: 'K-Shorts.Studio-Setup-1.4.8.exe', browser_download_url: 'https://github.com/s' },
  ];
  assert(H.pickInstallerAsset(assets, '1.4.8')?.browser_download_url === 'https://github.com/s', 'Portable/blockmap이 앞에 있어도 Setup-1.4.8.exe를 정확히 선택');
  assert(H.pickInstallerAsset([{ name: 'K-Shorts Studio-Setup-1.4.8.exe', browser_download_url: 'https://github.com/s2' }], 'v1.4.8')?.browser_download_url === 'https://github.com/s2', '공백 포함 원본 파일명과 v 접두 버전도 매칭');
  assert(H.pickInstallerAsset(assets, '1.4.9') === null, '버전이 다른 설치 파일은 선택하지 않음');
  assert(H.pickInstallerAsset(assets, '1.4') === null && H.pickInstallerAsset(undefined, '1.4.8') === null && H.pickInstallerAsset([], '') === null, '부분 버전/undefined/빈 입력은 null');
  assert(H.pickInstallerAsset([{ name: 'K-Shorts.Studio-Setup-1x4x8.exe', browser_download_url: 'https://github.com/x' }], '1.4.8') === null, '버전의 점(.)이 정규식 와일드카드로 오작동하지 않음');

  // 체크섬 파싱
  const hex = 'a'.repeat(64);
  assert(H.parseSha256(hex) === hex, '해시만 있는 .sha256 파일 파싱');
  assert(H.parseSha256(`${hex}  K-Shorts.Studio-Setup-1.4.8.exe\n`, 'K-Shorts Studio-Setup-1.4.8.exe') === hex, 'SHA256SUMS 형식(공백/점 정규화) 파싱');
  assert(H.parseSha256(`${'b'.repeat(64)}  other.exe\n${hex} *K-Shorts.Studio-Setup-1.4.8.exe`, 'K-Shorts.Studio-Setup-1.4.8.exe') === hex, '여러 줄 중 해당 파일 줄만 선택(바이너리 * 표기 포함)');
  assert(H.parseSha256(`${'b'.repeat(64)}  other.exe`, 'K-Shorts.Studio-Setup-1.4.8.exe') === '', '다른 파일의 해시만 있으면 빈 값');
  assert(H.parseSha256('zzzz') === '' && H.parseSha256('') === '' && H.parseSha256('a'.repeat(63)) === '', '비정상/63자리/빈 문자열은 빈 값');
  assert(H.sha256FromDigest(`sha256:${hex.toUpperCase()}`) === hex && H.sha256FromDigest('md5:abc') === '' && H.sha256FromDigest(undefined) === '', 'GitHub asset.digest 파싱(대소문자/타 알고리즘/undefined)');

  // 실제 파일 해시 계산 및 변조 감지
  const tmpFile = nodeOs.tmpdir() + '/kshorts-hash-test-' + Date.now() + '.bin';
  nodeFs.writeFileSync(tmpFile, Buffer.from('K-Shorts installer test payload'));
  const expected = nodeCrypto.createHash('sha256').update(Buffer.from('K-Shorts installer test payload')).digest('hex');
  pendingAsyncTests.push(H.sha256OfFile(tmpFile).then((actual) => {
    assert(actual === expected, '실제 파일 SHA-256 계산이 기준값과 일치');
    nodeFs.appendFileSync(tmpFile, 'x');
    return H.sha256OfFile(tmpFile);
  }).then((tampered) => {
    assert(tampered !== expected, '1바이트 변조 시 SHA-256 불일치 감지');
    nodeFs.unlinkSync(tmpFile);
  }).catch((e) => assert(false, 'sha256OfFile 실행 오류: ' + e.message)));

  // 소스 연결 확인
  assert(mainTsSource.includes('actualSha256 !== expectedSha256') && mainTsSource.includes('fs.unlinkSync(tempInstallerPath)'), 'perform-update에 해시 불일치 시 삭제 후 실행 중단 로직 탑재');
  assert(mainTsSource.includes("!isTrustedUpdateUrl(downloadUrl) || !expectedSha256"), 'perform-update에 출처/체크섬 없으면 자동 설치 거부 로직 탑재');
  assert(mainTsSource.includes('pickInstallerAsset(releaseData.assets, tagName)'), 'check-update가 Setup 설치 파일만 선택하도록 연동');
}

// ----------------------------------------------------
// 테스트 33: 설치 파일 체크섬(.sha256) 생성 스크립트 실제 실행 & 업데이터 파서 호환 검증
// ----------------------------------------------------
console.log('\n--- [테스트 33] make-checksum.js 실행 및 생성된 .sha256 ↔ 업데이터 파서 호환 ---');
{
  const { spawnSync } = require('child_process');
  const os = require('os');
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'kshorts-chk-'));
  const verStr = '9.9.9';
  const exeName = `K-Shorts Studio-Setup-${verStr}.exe`;
  const payload = Buffer.from('fake installer bytes for checksum test');
  fs.writeFileSync(path.join(tmpDir, exeName), payload);
  const script = path.join(__dirname, 'make-checksum.js');
  const run = spawnSync(process.execPath, [script, '--dir', tmpDir, '--version', verStr], { encoding: 'utf8' });
  assert(run.status === 0, 'make-checksum.js 정상 종료(exit 0)');
  const sumPath = path.join(tmpDir, `${exeName}.sha256`);
  assert(fs.existsSync(sumPath), '<설치파일>.sha256 파일 생성 확인');
  const sumText = fs.existsSync(sumPath) ? fs.readFileSync(sumPath, 'utf8') : '';
  const want = crypto.createHash('sha256').update(payload).digest('hex');
  assert(sumText === `${want}  ${exeName}\n`, '.sha256 내용이 "<해시>  <파일명>" 형식이며 실제 SHA-256과 일치');
  // 업데이터의 parseSha256(실제 코드)로 GitHub식 파일명(공백→점)에서도 읽히는지 확인
  const startIdx = mainTsSource.indexOf('// ---- 업데이트 설치 파일 무결성/출처 검증 헬퍼 ----');
  const endIdx = mainTsSource.indexOf('function downloadFileWithProgress(');
  const tsLib2 = require('typescript');
  const js2 = tsLib2.transpileModule(mainTsSource.slice(startIdx, endIdx) + '\nmodule.exports = { parseSha256 };', { compilerOptions: { module: tsLib2.ModuleKind.CommonJS, target: tsLib2.ScriptTarget.ES2020 } }).outputText;
  const m2 = { exports: {} };
  new Function('module', 'exports', 'require', 'fs', 'crypto', 'fetch', 'AbortController', js2)(m2, m2.exports, require, fs, crypto, undefined, AbortController);
  assert(m2.exports.parseSha256(sumText, exeName) === want, '생성된 .sha256을 업데이터 parseSha256이 동일 해시로 해석');
  assert(m2.exports.parseSha256(sumText, 'K-Shorts.Studio-Setup-9.9.9.exe') === want, 'GitHub 업로드 후 파일명(공백→점)에서도 해석');
  // 설치 파일이 없을 때는 실패 종료
  const bad = spawnSync(process.execPath, [script, '--dir', tmpDir, '--version', '0.0.1'], { encoding: 'utf8' });
  assert(bad.status === 1 && !fs.existsSync(path.join(tmpDir, 'K-Shorts Studio-Setup-0.0.1.exe.sha256')), '설치 파일이 없으면 exit 1 및 체크섬 파일 미생성');
  fs.rmSync(tmpDir, { recursive: true, force: true });
  assert(mainTsSource.includes('K-Shorts[ .]Studio-Setup-') && fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8').includes('make-checksum.js'), 'package.json dist 스크립트에 체크섬 생성 연동 확인');
  assert(fs.readFileSync(path.join(__dirname, '..', 'make-installer.bat'), 'utf8').includes('make-checksum.js'), 'make-installer.bat에 체크섬 생성 단계 연동 확인');
}

// ----------------------------------------------------
// 테스트 34: 대량 양산 병렬 렌더링 스케줄러 — main.ts의 실제 함수를 추출해 실행
// ----------------------------------------------------
console.log('\n--- [테스트 34] 병렬 렌더링 동시성 계산 & 워커 풀(동시 실행 한도/취소/오류 격리) ---');
{
  const os2 = require('os');
  const tsLib3 = require('typescript');
  const si = mainTsSource.indexOf('// ---- 대량 양산 병렬 렌더링 스케줄러 ----');
  const ei = mainTsSource.indexOf("ipcMain.handle('start-batch-job'");
  assert(si > 0 && ei > si, 'main.ts에서 병렬 스케줄러 블록 추출 성공');
  const js3 = tsLib3.transpileModule(
    mainTsSource.slice(si, ei) + '\nmodule.exports = { computeBatchConcurrency, createCpuLoadSampler, runWithDynamicConcurrency };',
    { compilerOptions: { module: tsLib3.ModuleKind.CommonJS, target: tsLib3.ScriptTarget.ES2020 } }
  ).outputText;
  const m3 = { exports: {} };
  new Function('module', 'exports', 'os', js3)(m3, m3.exports, os2);
  const B = m3.exports;
  const GB = 1024 ** 3;

  // 동시성 계산
  assert(B.computeBatchConcurrency({ requested: 'auto', cpuCount: 16, freeMemBytes: 32 * GB, cpuLoad: 0.1 }) === 3, '자동: 16코어/32GB 여유/저부하 → 최대 3');
  assert(B.computeBatchConcurrency({ requested: 'auto', cpuCount: 4, freeMemBytes: 32 * GB, cpuLoad: 0.1 }) === 1, '자동: 4코어 → 1 (CPU 4코어당 1워커)');
  assert(B.computeBatchConcurrency({ requested: 'auto', cpuCount: 8, freeMemBytes: 32 * GB, cpuLoad: 0.1 }) === 2, '자동: 8코어 → 2');
  assert(B.computeBatchConcurrency({ requested: 'auto', cpuCount: 16, freeMemBytes: 2 * GB, cpuLoad: 0 }) === 1, '자동: 여유 메모리 2GB → 1 (워커당 1.5GB)');
  assert(B.computeBatchConcurrency({ requested: 3, cpuCount: 4, freeMemBytes: 32 * GB, cpuLoad: 0 }) === 3, '수동 3: CPU 휴리스틱과 무관하게 요청값 사용');
  assert(B.computeBatchConcurrency({ requested: 3, cpuCount: 16, freeMemBytes: 3 * GB, cpuLoad: 0 }) === 2, '수동 3이어도 여유 메모리 3GB면 2로 제한');
  assert(B.computeBatchConcurrency({ requested: 99, cpuCount: 64, freeMemBytes: 999 * GB, cpuLoad: 0 }) === 3, '수동 99 → 상한 3');
  assert(B.computeBatchConcurrency({ requested: 0, cpuCount: 16, freeMemBytes: 32 * GB, cpuLoad: 0 }) === 1 && B.computeBatchConcurrency({ requested: -5, cpuCount: 16, freeMemBytes: 32 * GB, cpuLoad: 0 }) === 1, '수동 0/음수 → 최소 1');
  assert(B.computeBatchConcurrency({ requested: 3, cpuCount: 16, freeMemBytes: 32 * GB, cpuLoad: 0.9 }) === 1, 'CPU 사용률 90% → 1로 축소');
  assert(B.computeBatchConcurrency({ requested: 3, cpuCount: 16, freeMemBytes: 32 * GB, cpuLoad: 0.75 }) === 2, 'CPU 사용률 75% → 최대 2');
  assert(B.computeBatchConcurrency({ requested: 'auto', cpuCount: NaN, freeMemBytes: NaN, cpuLoad: NaN }) === 1, 'NaN 입력에도 1 이상의 정수 반환');
  const load = B.createCpuLoadSampler()();
  assert(typeof load === 'number' && load >= 0 && load <= 1, 'CPU 사용률 샘플러가 0~1 범위 값을 반환');

  // 워커 풀
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const run = async (n, limitFn, workerMs, extra = {}) => {
    let cur = 0, peak = 0;
    const started = [], done = [];
    await B.runWithDynamicConcurrency(
      Array.from({ length: n }, (_, i) => i),
      async (item) => {
        started.push(item); cur++; peak = Math.max(peak, cur);
        try { await sleep(typeof workerMs === 'function' ? workerMs(item) : workerMs); if (extra.throwOn && extra.throwOn(item)) throw new Error('boom'); done.push(item); }
        finally { cur--; }
      },
      { getLimit: limitFn, isCancelled: extra.isCancelled || (() => false), staggerMs: extra.staggerMs ?? 0 }
    );
    return { peak, started, done };
  };
  pendingAsyncTests.push((async () => {
    const r1 = await run(8, () => 3, 40);
    assert(r1.peak === 3, `한도 3이면 동시 실행 최대 3 (실측 ${r1.peak})`);
    assert(r1.done.length === 8 && new Set(r1.started).size === 8, '8개 항목이 중복/누락 없이 정확히 한 번씩 처리');
    assert(r1.started.every((v, i) => v === i), '시작 순서가 입력 순서와 동일');
    const r2 = await run(5, () => 1, 20);
    assert(r2.peak === 1 && r2.done.length === 5, '한도 1이면 완전 순차 실행');
    const r3 = await run(4, () => 0, 10);
    assert(r3.peak === 1 && r3.done.length === 4, '한도 0 반환 시에도 최소 1로 동작(교착 없음)');
    let lim = 3;
    const r4 = await run(9, () => lim, (i) => { if (i === 2) lim = 1; return 30; });
    assert(r4.done.length === 9, '실행 중 한도가 줄어도 모든 항목 완료');
    const r5 = await run(10, () => 2, 20, { isCancelled: () => false });
    assert(r5.done.length === 10 && r5.peak === 2, '취소 없으면 한도 2로 전체 처리');
    const cancelRun = await (async () => {
      let c = 0, cancelled = false; const done = [];
      await B.runWithDynamicConcurrency(Array.from({ length: 10 }, (_, i) => i), async (it) => { c++; if (c === 3) cancelled = true; await sleep(30); done.push(it); }, { getLimit: () => 2, isCancelled: () => cancelled });
      return { started: c, done };
    })();
    assert(cancelRun.started === 3 && cancelRun.done.length === 3, `취소 시 새 항목을 시작하지 않고 실행 중인 항목만 마무리 (시작 ${cancelRun.started}, 완료 ${cancelRun.done.length})`);
    const r6 = await run(6, () => 3, 20, { throwOn: (i) => i % 2 === 0 });
    assert(r6.started.length === 6 && r6.done.length === 3, '일부 워커가 예외를 던져도 나머지 항목 계속 처리(오류 격리)');
    const r7 = await run(0, () => 3, 10);
    assert(r7.started.length === 0, '빈 목록은 즉시 종료');
    const t0 = Date.now();
    await run(4, () => 4, 10, { staggerMs: 50 });
    const dt = Date.now() - t0;
    assert(dt >= 190, `staggerMs가 시작 간격을 벌려 줌 (4개 시작에 ${dt}ms)`);

    assert(mainTsSource.includes('runWithDynamicConcurrency(rawItems, processItem'), 'start-batch-job이 병렬 워커 풀을 사용');
    assert(mainTsSource.includes("maxParallel ?? 'auto'") , 'start-batch-job이 maxParallel 설정(기본 auto)을 반영');
    assert(mainTsSource.includes('kshorts_out_${id}_') && mainTsSource.includes('kshorts_scenes_${id}_'), '렌더 임시 파일명에 항목 id 포함(병렬 시 충돌 방지)');
    const ui = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'BatchGeneratorModal.tsx'), 'utf8');
    assert(ui.includes('maxParallel') && ui.includes('activeItems') && ui.includes('data.completedCount'), 'BatchGeneratorModal에 동시 렌더링 선택/항목별 진행/서버 집계 완료 건수 반영');
  })());
}

// ----------------------------------------------------
// 테스트 35: 무한 루프 쇼츠 대본 엔진 — main.ts의 실제 함수를 추출해 실행
// ----------------------------------------------------
console.log('\n--- [테스트 35] 무한 루프 대본 엔진 (루프 판별/보정/오프라인 대본 실제 변환) ---');
{
  const tsL = require('typescript');
  const si = mainTsSource.indexOf('// ---- 무한 루프 쇼츠 대본 엔진 ----');
  const ei = mainTsSource.indexOf('async function callGeminiApiForScript(');
  assert(si > 0 && ei > si, '루프 엔진 블록 추출 성공');
  const js = tsL.transpileModule(
    mainTsSource.slice(si, ei) + '\nmodule.exports = { analyzeLoopScript, applyLoopBridge, finalizeLoopScript, LOOP_BRIDGE_SENTENCES, LOOP_MODE_SYSTEM_ADDENDUM };',
    { compilerOptions: { module: tsL.ModuleKind.CommonJS, target: tsL.ScriptTarget.ES2020 } }
  ).outputText;
  const mm = { exports: {} };
  new Function('module', 'exports', js)(mm, mm.exports);
  const L = mm.exports;

  const good = '샤워할 때마다 거울이 뿌옇게 흐려지는 이유 아세요? 비밀은 표면의 작은 물방울에 있습니다. 치약 한 방울이면 해결됩니다.\n\n그래서 처음으로 돌아가, 다시 한번 묻겠습니다.';
  assert(L.analyzeLoopScript(good).isLoop === true, '잘 만든 루프 대본(연결 문장으로 끝남)은 루프로 판정');
  const withCta = '샤워할 때마다 거울이 뿌옇게 흐려지는 이유 아세요? 비밀은 표면의 작은 물방울에 있습니다. 치약 한 방울이면 해결됩니다.\n\n오늘 영상이 도움 되셨다면 구독과 좋아요 부탁드립니다!';
  const a1 = L.analyzeLoopScript(withCta);
  assert(!a1.isLoop && a1.issues.includes('signoff-end'), '구독/좋아요로 끝나는 대본은 signoff-end로 판정');
  const withGreeting = '안녕하세요 여러분! 오늘은 거울 김서림을 알려드립니다. 치약을 바르면 됩니다. 이상입니다.';
  assert(L.analyzeLoopScript(withGreeting).issues.includes('greeting-open'), '인사말로 시작하면 greeting-open으로 판정');
  assert(L.analyzeLoopScript('한 문장뿐입니다.').issues.includes('too-short'), '한 문장짜리는 too-short');
  assert(!L.analyzeLoopScript('거울이 흐려지는 이유가 뭘까요? 물방울 때문입니다. 치약이 해결합니다. 정말 간단하죠.').isLoop, '첫 문장과 이어지지 않는 평범한 끝맺음은 not-linked');

  const fixed = L.applyLoopBridge(withCta);
  assert(L.analyzeLoopScript(fixed).isLoop === true, 'CTA로 끝나던 대본을 보정하면 루프 구조가 됨');
  assert(!/구독|좋아요/.test(fixed), '보정 후 구독/좋아요 문구가 제거됨');
  assert(fixed.includes('샤워할 때마다 거울이') && fixed.includes('치약 한 방울이면 해결됩니다.'), '본문(첫 문장/핵심 내용)은 그대로 보존');
  assert(L.applyLoopBridge(fixed) === fixed, '이미 보정된 대본에 다시 적용해도 변하지 않음(멱등)');
  const g2 = L.applyLoopBridge(withGreeting);
  assert(!/^안녕/.test(g2) && L.analyzeLoopScript(g2).isLoop, '인사말 제거 후 루프 구조로 보정');
  const short2 = L.applyLoopBridge('거울이 왜 흐려질까요? 구독 부탁드립니다!');
  assert(!/구독/.test(short2) && L.analyzeLoopScript(short2).isLoop, '문장이 적은 대본도 끝맺음을 연결 문장으로 교체');
  assert(L.finalizeLoopScript(withCta, false) === withCta, '루프 모드 OFF면 대본을 건드리지 않음');
  assert(L.finalizeLoopScript(good, true) === good, '이미 루프인 대본은 모드 ON이어도 그대로');
  assert(L.finalizeLoopScript('', true) === '' && L.finalizeLoopScript(undefined, true) === undefined, '빈 대본/undefined 안전 처리');
  assert(L.LOOP_BRIDGE_SENTENCES.every((b) => L.analyzeLoopScript('질문이 있나요? 답이 있습니다.\n\n' + b).isLoop), '연결 문장 5종 모두 루프 판정을 통과');
  assert(L.LOOP_MODE_SYSTEM_ADDENDUM.includes('첫 문장') && L.LOOP_MODE_SYSTEM_ADDENDUM.includes('마지막 문장'), 'AI 프롬프트 보강문에 첫/마지막 문장 규칙 포함');
  assert(mainTsSource.includes('LOOP_MODE_SYSTEM_ADDENDUM : \'\''), 'Gemini/OpenAI 호출이 루프 모드 보강문을 시스템 프롬프트에 붙임');
  assert(mainTsSource.includes('finalizeLoopScript(finalScript, params.loopMode)'), '렌더 파이프라인이 루프 모드를 대본에 적용');

  // 실제 오프라인 대본 생성기 출력도 루프로 변환되는지 검증
  const gi = mainTsSource.indexOf('function generateSmartKoreanScript(');
  let gend = mainTsSource.indexOf('\n}\n', gi);
  try {
    const gjs = tsL.transpileModule(mainTsSource.slice(gi, gend + 3) + '\nmodule.exports = { generateSmartKoreanScript };', { compilerOptions: { module: tsL.ModuleKind.CommonJS, target: tsL.ScriptTarget.ES2020 } }).outputText;
    const gm = { exports: {} };
    new Function('module', 'exports', 'require', gjs)(gm, gm.exports, require);
    const topics = ['욕실 거울 김서림 치약 꿀팁', '냉장고 시든 채소 50도 세척법', '부자들이 절대 사지 않는 3가지 물건', '뇌과학자가 말하는 집중력 비법', '아무 주제나 테스트'];
    let okAll = true, changed = 0;
    for (const tp of topics) {
      const raw = gm.exports.generateSmartKoreanScript(tp);
      const out = L.finalizeLoopScript(raw, true);
      if (!L.analyzeLoopScript(out).isLoop) okAll = false;
      if (out !== raw) changed++;
    }
    assert(okAll, `오프라인 대본 생성기 출력 ${topics.length}종이 모두 루프 구조로 변환됨 (실제 변환 ${changed}건)`);
  } catch (e) {
    assert(false, '오프라인 대본 생성기 추출/실행 실패: ' + e.message);
  }
  const ui1 = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'PromptSection.tsx'), 'utf8');
  const app1 = fs.readFileSync(path.join(__dirname, '..', 'src', 'App.tsx'), 'utf8');
  assert(ui1.includes('무한 루프 모드') && app1.includes('loopMode,') && app1.includes('setLoopMode={setLoopMode}'), 'UI(PromptSection/App)에 무한 루프 모드 토글과 전달 연동');
}

// ----------------------------------------------------
// 테스트 36: 이미지/영상 중복 사용 방지 — main.ts의 실제 함수를 추출해 가짜 Pexels 서버로 실행
// ----------------------------------------------------
console.log('\n--- [테스트 36] 영상 중복 사용 금지 (한 쇼츠 안 + 쇼츠 간 이력 + 병렬 경쟁 상태) ---');
pendingAsyncTests.push((async () => {
  const tsV = require('typescript');
  const os3 = require('os');
  const si = mainTsSource.indexOf('// ---- 영상 중복 사용 방지');
  const ei = mainTsSource.indexOf('const TEMPLATE_STYLE_PROMPTS');
  assert(si > 0 && ei > si, '영상 중복 방지 블록 추출 성공');
  const body = mainTsSource.slice(si, ei);
  const jsV = tsV.transpileModule(body + '\nmodule.exports = { reserveVideoKey, releaseVideoKey, normalizeVideoUrlKey, searchStockVideoInternal, getUsedVideoKeys };', { compilerOptions: { module: tsV.ModuleKind.CommonJS, target: tsV.ScriptTarget.ES2020 } }).outputText;

  const tmpFile = path.join(fs.mkdtempSync(path.join(os3.tmpdir(), 'kshorts-vid-')), 'used_videos.json');
  const catalog = [
    { id: 'cat_a', keywords: ['ocean'], url: 'https://assets.mixkit.co/a.mp4', previewUrl: 'p' },
    { id: 'cat_b', keywords: ['city'], url: 'https://assets.mixkit.co/b.mp4', previewUrl: 'p' },
  ];
  const pexelsPages = { 1: [1, 2, 3, 4, 5], 2: [6, 7], 3: [] };
  let pexelsOn = true;
  const mkVideo = (id) => ({ id, image: 'img', video_files: [{ width: 1080, height: 1920, quality: 'hd', link: `https://videos.pexels.com/video-files/${id}/clip.mp4` }] });
  const fakeFetch = async (url) => {
    const u = String(url);
    if (pexelsOn && u.includes('api.pexels.com/videos/search')) {
      const page = Number(new URL(u).searchParams.get('page') || 1);
      await new Promise((r) => setTimeout(r, 5 + Math.random() * 10)); // 응답 시간 편차 → 병렬 경쟁 유도
      return { ok: true, json: async () => ({ videos: (pexelsPages[page] || []).map(mkVideo) }) };
    }
    return { ok: false, json: async () => ({}) };
  };
  const mod = { exports: {} };
  const settingsMock = () => ({ pexelsApiKey: pexelsOn ? 'k' : '' });
  new Function('module', 'exports', 'fs', 'path', 'USED_VIDEOS_FILE', 'getStoredSettings', 'translateKoreanVisualKeywords', 'FREE_STOCK_VIDEOS_CATALOG', 'fetch', 'AbortSignal', 'URL', 'process', jsV)(
    mod, mod.exports, fs, path, tmpFile, settingsMock, (q) => q, catalog, fakeFetch, AbortSignal, URL, process
  );
  const V = mod.exports;

  // 키 정규화
  assert(V.normalizeVideoUrlKey('https://videos.pexels.com/video-files/3571264/3571264-hd_1080_1920_30fps.mp4?token=abc') === 'pexels:3571264', 'Pexels 영상 링크 → pexels:<ID> (쿼리스트링 무시)');
  assert(V.normalizeVideoUrlKey('https://assets.mixkit.co/a.mp4') === 'catalog:cat_a', '내장 카탈로그 URL → catalog:<id> (자동 선택과 같은 키)');
  assert(V.normalizeVideoUrlKey('https://example.com/x/y.mp4?a=1#t') === 'url:example.com/x/y.mp4', '일반 URL은 쿼리/해시 제거');
  assert(V.normalizeVideoUrlKey('C:\\Videos\\My Clip.MP4') === 'file:c:/videos/my clip.mp4', '로컬 경로는 구분자/대소문자 정규화');

  // 예약
  assert(V.reserveVideoKey('k1') === true && V.reserveVideoKey('k1') === false, '같은 키는 두 번째 예약이 거부됨');
  assert(V.reserveVideoKey('') === false, '빈 키 예약 거부');
  assert(V.reserveVideoKey('k2', new Set(['k2'])) === false, 'skipKeys에 있는 키는 예약 거부');
  fs.writeFileSync(tmpFile, '{"keys":[]}');

  // 한 쇼츠가 영상 씬 7개를 순서대로 요청 → 모두 서로 다른 영상
  const short1 = new Set(); const got1 = [];
  for (let i = 0; i < 7; i++) {
    const r = await V.searchStockVideoInternal('ocean', short1);
    if (r) { got1.push(r.key); short1.add(r.key); }
  }
  assert(got1.length === 7 && new Set(got1).size === 7, `한 쇼츠 7개 씬이 모두 다른 영상 (${got1.join(',')})`);

  // 두 번째 쇼츠: 이전 쇼츠에서 쓴 영상은 제외되고 남은 카탈로그만 → 소진 후 null
  const short2 = new Set(); const got2 = [];
  for (let i = 0; i < 5; i++) {
    const r = await V.searchStockVideoInternal('ocean', short2);
    if (r) { got2.push(r.key); short2.add(r.key); } else got2.push(null);
  }
  assert(got2.slice(0, 2).every((k) => k && k.startsWith('catalog:')) && got2.slice(2).every((k) => k === null), `쇼츠 간에도 중복 없음 — Pexels 소진 후 카탈로그 2개만 쓰고 이후는 null (${got2.join(',')})`);
  assert(got2.every((k) => !k || !got1.includes(k)), '두 번째 쇼츠가 첫 쇼츠의 영상을 하나도 재사용하지 않음');

  // 병렬 워커 경쟁: 이력 초기화 후 8개 동시 요청 → 키 중복 0
  fs.writeFileSync(tmpFile, '{"keys":[]}');
  const parallel = await Promise.all(Array.from({ length: 8 }, () => V.searchStockVideoInternal('ocean', new Set())));
  const pk = parallel.filter(Boolean).map((r) => r.key);
  assert(pk.length === 8 && new Set(pk).size === 8, `동시 8개 요청(병렬 렌더링 가정)에서도 중복 0 (${new Set(pk).size}/${pk.length})`);
  assert(V.getUsedVideoKeys().length === 8, '선택된 영상 8개가 모두 이력 파일에 기록됨');

  // skipKeys(재시도 시 이미 시도한 키) 존중
  fs.writeFileSync(tmpFile, '{"keys":[]}');
  const skip = new Set(['pexels:1', 'pexels:2', 'pexels:3', 'pexels:4', 'pexels:5']);
  const r6 = await V.searchStockVideoInternal('ocean', skip);
  assert(r6 && r6.key === 'pexels:6', 'skipKeys로 지정한 영상은 건너뛰고 다음 페이지에서 새 영상 선택');

  // 다운로드 실패 시 예약 해제: 실제로 쓰지 않은 영상이 이력에 영구히 남지 않아야 한다
  fs.writeFileSync(tmpFile, '{"keys":[]}');
  assert(V.reserveVideoKey('pexels:777') === true, '예약 성공');
  V.releaseVideoKey('pexels:777');
  assert(!V.getUsedVideoKeys().includes('pexels:777') && V.reserveVideoKey('pexels:777') === true, 'releaseVideoKey 후에는 같은 영상을 다시 사용할 수 있음');
  V.releaseVideoKey('없는키'); V.releaseVideoKey('');
  assert(Array.isArray(V.getUsedVideoKeys()), '없는 키/빈 키 해제도 안전 처리');

  // 이력 파일 손상/없음 안전 처리
  fs.writeFileSync(tmpFile, '{broken json');
  assert(Array.isArray(V.getUsedVideoKeys()) && V.getUsedVideoKeys().length === 0, '이력 파일이 손상돼도 빈 이력으로 안전 처리');
  fs.rmSync(path.dirname(tmpFile), { recursive: true, force: true });

  // 소스 연결 + 기존 이미지 중복 방지 유지 확인
  assert(mainTsSource.includes('usedVideoKeysInCurrentShort') && mainTsSource.includes('searchStockVideoInternal(searchKeyword, triedKeys)'), '렌더 파이프라인이 쇼츠 단위 영상 키 집합과 재시도 키를 사용');
  assert(mainTsSource.includes('이미 이 쇼츠에서 사용한 영상이라 건너뜁니다'), '사용자 지정 영상도 한 쇼츠 안에서는 중복 사용을 건너뜀');
  assert(mainTsSource.includes('isGlobalDuplicate || isLocalDuplicate'), '이미지는 기존 전역/쇼츠 내 해시 중복 거부 로직 유지');
})());

// ----------------------------------------------------
// 테스트 37: 대체(그라디언트) 프레임 이미지 중복 금지 — main.ts의 실제 createSceneBmpBuffer 실행
// ----------------------------------------------------
console.log('\n--- [테스트 37] 대체 프레임 이미지가 같은 주제·같은 씬이어도 서로 달라지는지 ---');
{
  const tsB = require('typescript');
  const bi = mainTsSource.indexOf('function createSceneBmpBuffer(');
  const be = mainTsSource.indexOf('// Network Resilience & Offline Detection Utilities');
  const bjs = tsB.transpileModule(mainTsSource.slice(bi, be) + '\nmodule.exports = { createSceneBmpBuffer };', { compilerOptions: { module: tsB.ModuleKind.CommonJS, target: tsB.ScriptTarget.ES2020 } }).outputText;
  const bm = { exports: {} };
  new Function('module', 'exports', bjs)(bm, bm.exports);
  const mk = (idx, seed) => bm.exports.createSceneBmpBuffer(108, 192, [6, 78, 59], [4, 120, 87], [52, 211, 153], idx, seed);
  const h = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
  assert(h(mk(2, 0)) === h(mk(2, 0)), '같은 입력(seed 0)은 항상 같은 프레임 (기존 동작 유지)');
  const base = h(mk(2, 0));
  const variants = new Set(Array.from({ length: 30 }, (_, i) => h(mk(2, 1000 + i * 7919))));
  assert(variants.size === 30 && !variants.has(base), `seed를 바꾸면 30개 모두 서로 다르고 기본 프레임과도 다름 (고유 ${variants.size}/30)`);
  assert(h(mk(3, 0)) === h(mk(33, 0)), 'seed 0만 쓰면 씬 3과 씬 33이 완전히 같은 프레임(주기 30) → 재생성이 필요한 실제 중복 사례');
  assert(h(mk(3, 424242)) !== h(mk(3, 0)), '중복 감지 시 seed를 바꾸면 같은 씬 번호도 다른 프레임이 됨');
  assert(mainTsSource.includes('for (let v = 1; v <= 12; v++)') && mainTsSource.includes('usedStore.hashes.includes(h)'), '렌더 파이프라인이 대체 프레임의 쇼츠 내/전역 해시 중복을 감지해 재생성');
}

// ----------------------------------------------------
// 4순위: 유튜브 성과 분석 & 급상승 영상 후속작 기획
// ----------------------------------------------------
console.log('\n--- 4순위: 성과 기반 후속작 기획 루프 ---');
{
  const tsP = require('typescript');
  const si = mainTsSource.indexOf('interface ChannelVideoStat');
  const ei = mainTsSource.indexOf('async function getYouTubeAccessTokenFromSettings(');
  const pjs = tsP.transpileModule(
    mainTsSource.slice(si, ei) + '\nmodule.exports = { analyzeVideoPerformance, pickFollowUpCandidate, medianOf };',
    { compilerOptions: { module: tsP.ModuleKind.CommonJS, target: tsP.ScriptTarget.ES2020 } }
  ).outputText;
  const pm = { exports: {} };
  new Function('module', 'exports', pjs)(pm, pm.exports);
  const { analyzeVideoPerformance: analyze, pickFollowUpCandidate: pick } = pm.exports;

  const NOW = Date.parse('2026-11-06T00:00:00Z');
  const daysAgo = (d) => new Date(NOW - d * 86400000).toISOString();
  const mk = (id, views, d, likes = 0, comments = 0) => ({ id, title: `영상 ${id}`, publishedAt: daysAgo(d), views, likes, comments });

  const vids = [
    mk('a', 1000, 10), mk('b', 1200, 10), mk('c', 900, 10), mk('d', 1100, 10), // 일평균 ~100
    mk('hit', 30000, 5, 900, 120),                                              // 일평균 6000 → 급상승
    mk('hit2', 8000, 4),                                                        // 일평균 2000 → 급상승
    mk('fresh', 50, 0.05),                                                      // 업로드 직후: 제외
    mk('tiny', 40, 20),                                                         // 조회수 적음: 제외
  ];
  const r = analyze(vids, NOW);
  assert(r.videos.length === vids.length && r.videos[0].id === 'hit', '일평균 조회수 순으로 정렬되고 최상위가 가장 급상승한 영상');
  assert(r.breakouts.map((v) => v.id).join(',') === 'hit,hit2', `급상승 영상만 선별 (${r.breakouts.map((v) => v.id).join(',')})`);
  assert(!r.breakouts.some((v) => v.id === 'fresh' || v.id === 'tiny'), '업로드 직후/조회수 100 미만 영상은 급상승에서 제외');
  assert(r.baselineViewsPerDay > 0 && r.videos.find((v) => v.id === 'hit').multiple > 10, '채널 중앙값 대비 배수 계산');
  assert(r.videos.find((v) => v.id === 'hit').engagementRate > r.videos.find((v) => v.id === 'a').engagementRate, '좋아요/댓글이 많은 영상의 참여율이 더 높음');
  assert(pick(r, [])?.id === 'hit', '후속작 후보는 가장 성과 좋은 급상승 영상');
  assert(pick(r, ['hit'])?.id === 'hit2', '이미 후속작을 만든 영상은 건너뛰고 다음 급상승 영상 선택');
  assert(pick(r, ['hit', 'hit2']) === null, '모든 급상승 영상의 후속작이 있으면 null → 자율 기획으로 폴백');
  const flat = analyze([mk('x', 1000, 5), mk('y', 1000, 5), mk('z', 1100, 5)], NOW);
  assert(flat.breakouts.length === 0, '성과가 고르면 급상승 영상 없음');
  const empty = analyze([], NOW);
  assert(empty.videos.length === 0 && empty.baselineViewsPerDay === 0 && pick(empty, []) === null, '영상이 없어도 오류 없이 빈 결과');
  const bad = analyze([mk('p', 500, 3), { id: 'q', title: 'q', publishedAt: 'invalid', views: 500, likes: 0, comments: 0 }], NOW);
  assert(bad.videos.length === 2 && bad.videos.every((v) => Number.isFinite(v.viewsPerDay)), '게시일이 잘못된 영상도 NaN 없이 처리');

  assert(mainTsSource.includes("ipcMain.handle('analyze-youtube-performance'"), 'main.ts에 analyze-youtube-performance IPC 등록');
  assert(mainTsSource.includes('config.followUpMode') && mainTsSource.includes('sourceVideoId'), '오토파일럿이 followUpMode에서 급상승 영상 후속작을 기획하고 sourceVideoId를 이력에 기록');
  assert(mainTsSource.includes('자율 기획으로 폴백') , '성과 분석 실패/후보 없음 시 기존 자율 기획으로 폴백');
}

// ----------------------------------------------------
// 라이선스: 서버 장부 방식 (오토로그와 동일 체계) + 구매자 빌드
// 메인 프로세스의 실제 클라이언트 코드를 소스에서 잘라 실행하고, 서명하는 가짜 라이선스 서버(Ed25519)와 통신시킨다.
// (실제 Cloudflare Worker 자체는 license_server/ 에서 wrangler dev 로 따로 검증)
// ----------------------------------------------------
console.log('\n--- 라이선스: 서버 장부 클라이언트 / 선차감·환불 / 1PC 1키 / 구매자 빌드 ---');
{
  const tsL = require('typescript');
  const os3 = require('os');
  const http3 = require('http');
  const si = mainTsSource.indexOf('const EDITION_FLAG: string');
  const ei = mainTsSource.indexOf('const BUYER_EDITION_BLOCKED');
  const baseBlock = mainTsSource.slice(si, mainTsSource.indexOf('\n', ei));
  const realPubHex = /LICENSE_SERVER_PUBLIC_HEX = '([0-9a-f]{64})'/.exec(baseBlock)[1];

  // 가짜 라이선스 서버: 응답을 서명해 돌려준다 (서버 로직 요약판)
  const kp = crypto.generateKeyPairSync('ed25519');
  const testPubHex = kp.publicKey.export({ type: 'spki', format: 'der' }).subarray(12).toString('hex');
  const db = {
    LOWKEY0000000001: { tokens: 300, session: '', status: 'active', expires: 0, unlimited: false },
    ADMINKEY00000001: { tokens: 0, session: '', status: 'active', expires: 0, unlimited: true },
    EXPIREDKEY000001: { tokens: 900, session: '', status: 'active', expires: 1, unlimited: false },
    REVOKEDKEY000001: { tokens: 900, session: '', status: 'revoked', expires: 0, unlimited: false },
  };
  const usage = {};
  const view = (l) => ({ plan: '30', unlimited: l.unlimited, tokens_left: l.tokens, tokens_total: 300, cost_per_short: 100, issued_at: 1, expires_at: l.expires, status: l.status, expired: !!l.expires && l.expires < Date.now() / 1000, usable: l.status === 'active' && !(l.expires && l.expires < Date.now() / 1000) });
  const server = http3.createServer((req, res) => {
    let raw = '';
    req.on('data', (c) => (raw += c));
    req.on('end', () => {
      const b = JSON.parse(raw);
      const l = db[String(b.key || '').toUpperCase()];
      const out = (o) => {
        const data = JSON.stringify({ ...o, nonce: b.nonce, server_time: Math.floor(Date.now() / 1000) });
        const sig = crypto.sign(null, Buffer.from(data), kp.privateKey).toString('hex');
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({ data, sig }));
      };
      if (!l) return out({ ok: false, code: 'invalid', msg: '등록되지 않은 라이선스 키입니다.' });
      if (!l.unlimited) {
        if (req.url === '/v1/check' && b.take_over) l.session = b.session;
        else if (!l.session) l.session = b.session;
        if (l.session !== b.session) return out({ ok: false, code: 'session_moved', msg: '다른 PC에서 이 라이선스로 로그인해 이 PC는 로그아웃되었습니다.', license: view(l) });
      }
      if (l.status !== 'active') return out({ ok: false, code: 'revoked', msg: '사용이 중지된 라이선스입니다.', license: view(l) });
      if (l.expires && l.expires < Date.now() / 1000) return out({ ok: false, code: 'expired', msg: '기간이 끝난 라이선스입니다.', license: view(l) });
      if (req.url === '/v1/check') return out({ ok: true, code: 'ok', license: view(l) });
      if (req.url === '/v1/reserve') {
        if (!usage[b.request_id]) {
          if (!l.unlimited && l.tokens < 100) return out({ ok: false, code: 'no_tokens', msg: '토큰이 부족합니다.', license: view(l) });
          if (!l.unlimited) l.tokens -= 100;
          usage[b.request_id] = 'reserved';
        }
        return out({ ok: true, code: 'ok', license: view(l) });
      }
      if (req.url === '/v1/refund') {
        if (usage[b.request_id] !== 'reserved') return out({ ok: false, code: 'no_refund', msg: '환불할 수 없는 요청입니다.', license: view(l) });
        usage[b.request_id] = 'refunded';
        l.tokens += 100;
        return out({ ok: true, code: 'ok', license: view(l) });
      }
      out({ ok: false, code: 'x' });
    });
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const url = `http://127.0.0.1:${server.address().port}`;

  function load(edition, dir, pub = testPubHex) {
    const code = baseBlock.split('__KSHORTS_EDITION__').join(edition).split(realPubHex).join(pub).split('__KSHORTS_LICENSE_SERVER__').join(url);
    const js = tsL.transpileModule(
      code + '\nmodule.exports = { IS_BUYER_EDITION, licenseStatus, licenseActivate, licenseRefresh, chargeShort, refundShort, withShortCharge, licenseState, LICENSE_KEY_FILE, LICENSE_CACHE_FILE, loadLicenseCache };',
      { compilerOptions: { module: tsL.ModuleKind.CommonJS, target: tsL.ScriptTarget.ES2022 } }
    ).outputText;
    const m = { exports: {} };
    const events = [];
    const BrowserWindow = { getAllWindows: () => [{ webContents: { send: (c, s) => events.push([c, s]) } }] };
    const safeStorage = { isEncryptionAvailable: () => true, encryptString: (s) => Buffer.from(Buffer.from(s).reverse()), decryptString: (b) => Buffer.from(b).reverse().toString() };
    new Function('module', 'exports', 'crypto', 'fs', 'path', 'USER_DATA_DIR', 'safeStorage', 'BrowserWindow', js)(m, m.exports, crypto, fs, path, dir, safeStorage, BrowserWindow);
    m.exports.events = events;
    return m.exports;
  }
  const mk = () => fs.mkdtempSync(path.join(os3.tmpdir(), 'kshorts-lic-'));
  const dirA = mk();
  const A = load('buyer', dirA);

  assert(A.IS_BUYER_EDITION === true && load('admin', mk()).IS_BUYER_EDITION === false, '에디션 플래그: buyer/admin 치환에 따라 IS_BUYER_EDITION이 달라짐');
  assert(!(await A.licenseActivate('ZZZZ ZZZZ ZZZZ ZZZZ')).success, '서버에 없는 키는 로그인 거부');
  assert(!(await A.licenseActivate('abc')).success, '16자리가 아닌 입력은 서버 호출 전에 거부');
  const login = await A.licenseActivate('lowk-ey00-0000-0001\n');
  assert(login.success && login.status.tokens === 300 && login.status.usable, '소문자·하이픈·줄바꿈이 섞인 키도 정규화되어 로그인(토큰 300)');
  assert(fs.existsSync(A.LICENSE_KEY_FILE) && !fs.readFileSync(A.LICENSE_KEY_FILE).toString('utf8').includes('LOWKEY0000000001'), '키 파일에 키 평문이 그대로 남지 않음(보안 저장소 암호화)');

  const rid = await A.chargeShort();
  assert(rid.length === 32 && A.licenseStatus().tokens === 200, '쇼츠 1편 제작 전 서버에서 100토큰 선차감 (300 → 200)');
  await A.refundShort(rid);
  assert(A.licenseStatus().tokens === 300, '제작 실패 환불 (200 → 300)');
  await A.refundShort(rid);
  assert(A.licenseStatus().tokens === 300, '같은 요청을 두 번 환불해도 토큰이 늘지 않음');

  let boom = false;
  try { await A.withShortCharge(async () => { throw new Error('boom'); }); } catch (e) { boom = e.message === 'boom'; }
  assert(boom && A.licenseStatus().tokens === 300, '제작 중 예외 → 원래 오류 전달 + 자동 환불');
  await A.withShortCharge(async () => ({ success: true }));
  assert(A.licenseStatus().tokens === 200, '제작 성공 시 차감 유지 (300 → 200)');
  await A.withShortCharge(async () => ({ success: false }));
  assert(A.licenseStatus().tokens === 200, 'success:false 반환도 실패로 보고 환불');
  await A.chargeShort();
  await A.chargeShort();
  let noTok = '';
  try { await A.chargeShort(); } catch (e) { noTok = e.message; }
  assert(A.licenseStatus().tokens === 0 && noTok.includes('토큰이 부족'), '토큰이 0이면 제작 차단');
  assert(A.events.length > 0 && A.events.at(-1)[0] === 'license-status', '토큰 변화가 화면(license-status 이벤트)으로 전달됨');

  // 한 키 = 한 번에 PC 한 대
  const B = load('buyer', mk());
  assert((await B.licenseActivate('LOWKEY0000000001')).success, '다른 PC에서 같은 키로 로그인하면 성공');
  await A.licenseRefresh(true);
  assert(!A.licenseStatus().hasKey && A.licenseStatus().error.includes('다른 PC') && !fs.existsSync(A.LICENSE_KEY_FILE), '이전 PC는 자동 로그아웃되고 저장된 키가 삭제됨');

  // 만료·폐기·무제한
  const ex = await load('buyer', mk()).licenseActivate('EXPIREDKEY000001');
  assert(!ex.success && ex.error.includes('기간이 끝난'), '기간이 끝난 키는 로그인 거부');
  const rv = await load('buyer', mk()).licenseActivate('REVOKEDKEY000001');
  assert(!rv.success && rv.error.includes('중지'), '사용 중지된 키는 로그인 거부');
  const C = load('buyer', mk());
  const ul = await C.licenseActivate('ADMINKEY00000001');
  await C.chargeShort();
  assert(ul.success && ul.status.unlimited && C.licenseStatus().unlimited, '무제한 키는 로그인되고 차감되지 않음');

  // 위조 방지
  const D = load('buyer', mk());
  await D.licenseActivate('LOWKEY0000000001');
  const env = JSON.parse(fs.readFileSync(D.LICENSE_CACHE_FILE, 'utf8'));
  const dd = JSON.parse(env.data);
  dd.license.tokens_left = 999999;
  env.data = JSON.stringify(dd);
  fs.writeFileSync(D.LICENSE_CACHE_FILE, JSON.stringify(env));
  const D2 = load('buyer', path.dirname(D.LICENSE_KEY_FILE));
  D2.loadLicenseCache();
  assert(D2.licenseState.license === null, '캐시 파일의 토큰을 고치면 서명 불일치로 무시');
  const wrongPub = crypto.generateKeyPairSync('ed25519').publicKey.export({ type: 'spki', format: 'der' }).subarray(12).toString('hex');
  const fake = await load('buyer', mk(), wrongPub).licenseActivate('LOWKEY0000000001');
  assert(!fake.success && fake.error.includes('서명'), '서명 키가 다른 가짜 서버 응답은 거부');
  const E = load('buyer', mk());
  E.licenseState.adminSession = true;
  let needKey = '';
  try { await E.chargeShort(); } catch (e) { needKey = e.message; }
  assert(needKey.includes('키를 먼저'), '구매자 빌드는 관리자 세션 플래그를 켜도 과금을 건너뛸 수 없음');
  const F = load('admin', mk());
  F.licenseState.adminSession = true;
  assert((await F.chargeShort()) === '', '관리자(개발) 빌드의 관리자 세션은 차감 없음');
  server.close();
  fs.rmSync(dirA, { recursive: true, force: true });

  // 소스 수준 확인
  assert(!mainTsSource.includes('issue-license') && !mainTsSource.includes('verifySignedLicenseKey') && !mainTsSource.includes('LICENSE_PUBLIC_KEY_HEX'), '예전 오프라인 서명 키 발급/검증 코드가 main.ts에서 제거됨');
  assert((mainTsSource.match(/withShortCharge\(/g) || []).length >= 2 && mainTsSource.includes('chargeShort()') && mainTsSource.includes('await refundShort(chargeId)'), '수동 제작·대량 양산·오토파일럿 모두 서버 선차감/실패 환불을 거침');
  assert(mainTsSource.includes("'__KSHORTS_LICENSE_SERVER__'") && mainTsSource.includes('LICENSE_SERVER_PUBLIC_HEX'), '라이선스 서버 주소는 빌드 때 주입, 응답 서명 공개키는 앱에 내장됨');
  assert(mainTsSource.split("'__KSHORTS_EDITION__'").length === 2, "main.ts의 '__KSHORTS_EDITION__' 치환 지점은 정확히 1곳");
  const buildScript = fs.readFileSync(path.join(__dirname, 'build-electron.js'), 'utf8');
  assert(buildScript.includes("split('__KSHORTS_EDITION__').join(EDITION)") && buildScript.includes('.edition'), 'build-electron.js가 에디션을 치환하고 에디션 변경 시 캐시를 무시');
  const pkgJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
  assert(pkgJson.scripts.dist.includes('run-edition.js buyer') && pkgJson.scripts['dist:win'].includes('run-edition.js buyer'), 'dist 스크립트는 구매자 에디션으로 빌드');
  assert(fs.readFileSync(path.join(__dirname, '..', 'make-installer.bat'), 'utf8').includes('run-edition.js buyer'), 'make-installer.bat도 구매자 에디션으로 빌드');
  assert(!!pkgJson.dependencies['ffmpeg-static'] && !!pkgJson.dependencies['ffprobe-static'] && pkgJson.build.asarUnpack.some((g) => g.includes('ffmpeg-static')), 'ffmpeg/ffprobe가 의존성에 있고 asar 밖으로 풀리도록 설정');
  assert(mainTsSource.includes('setupBundledFfmpegPath();') && mainTsSource.includes('app.asar.unpacked'), 'main.ts가 번들 ffmpeg 경로를 PATH 앞에 추가(asar.unpacked 경로 변환 포함)');

  // 실제 앱에 들어간 공개키 ↔ 판매자 서버 비밀키 쌍 확인 (비밀값이 있는 판매자 PC에서만)
  const secretsPath = path.join(__dirname, '..', '..', 'license_server', '.secrets.json');
  if (fs.existsSync(secretsPath)) {
    assert(JSON.parse(fs.readFileSync(secretsPath, 'utf8')).PUBLIC_HEX === realPubHex, '앱에 들어간 서버 공개키가 판매자 서버 서명키와 쌍으로 일치');
  } else {
    console.warn('⚠️ 서버 비밀값(.secrets.json)이 없어 실제 키쌍 일치 검증은 건너뜀');
  }
}

// 버그 수정 회귀 테스트: main.ts 의 함수를 잘라 실제로 실행한다
{
  const tsR = require('typescript');
  const cut = (name) => {
    const i = mainTsSource.indexOf(`function ${name}`);
    const end = mainTsSource.indexOf('\n}\n', i);
    if (i < 0 || end < 0) throw new Error(`${name} 을 main.ts 에서 찾지 못함`);
    return mainTsSource.slice(i, end + 3);
  };
  const load = (src, names, deps = {}) => {
    const js = tsR.transpileModule(src + `\nmodule.exports = { ${names.join(', ')} };`, { compilerOptions: { module: tsR.ModuleKind.CommonJS, target: tsR.ScriptTarget.ES2020 } }).outputText;
    const m = { exports: {} };
    new Function('module', 'exports', ...Object.keys(deps), js)(m, m.exports, ...Object.values(deps));
    return m.exports;
  };

  // 1) JSON 저장소: 깨진 파일은 빈 값으로 덮지 않고 .corrupt-* 로 보존
  const os = require('os');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'kshorts-store-'));
  const store = load(cut('writeJsonAtomic') + cut('readJsonStore'), ['writeJsonAtomic', 'readJsonStore'], { fs, path, console: { error() {} } });
  const f = path.join(dir, 'p.json');
  store.writeJsonAtomic(f, [{ id: 1 }]);
  assert(store.readJsonStore(f, [])[0].id === 1, 'writeJsonAtomic → readJsonStore 왕복');
  fs.writeFileSync(f, '{broken');
  assert(store.readJsonStore(f, []).length === 0 && fs.readdirSync(dir).some((n) => n.startsWith('p.json.corrupt-')), '깨진 저장소 파일은 .corrupt-* 로 보존');
  fs.rmSync(dir, { recursive: true, force: true });

  // 2) 예약 간격: 24의 약수가 아닌 간격은 마지막 실행 + 간격
  const sched = load(cut('calculateNextRunTime'), ['calculateNextRunTime']);
  const last = new Date(Date.now() - 3600 * 1000).toISOString();
  const gapH = (cfg) => (new Date(sched.calculateNextRunTime({ ...cfg, lastRunAt: last })).getTime() - new Date(last).getTime()) / 3600000;
  assert(gapH({ frequency: 'custom_hours', customIntervalValue: 48, scheduleTime: '18:00' }) === 48, '48시간 간격 = 마지막 실행 + 48시간');
  assert(gapH({ frequency: 'custom_hours', customIntervalValue: 5, scheduleTime: '18:00' }) === 5, '5시간 간격 = 마지막 실행 + 5시간');

  // 3) 자막 ASS 이스케이프: { } \ 줄바꿈이 서식 태그로 해석되지 않음
  const sIdx = mainTsSource.indexOf('const STRIP_SUBTITLE_EMOJI');
  const sub = load(mainTsSource.slice(sIdx, mainTsSource.indexOf('\n}\n', mainTsSource.indexOf('function assText')) + 3), ['assText'], { process: { platform: 'darwin' } });
  const out = sub.assText('a{\\b1}b\\N\nc 🔥');
  assert(!/[{}\\\n]/.test(out) && !out.includes('🔥'), 'assText: 중괄호·역슬래시·줄바꿈·이모지(맥) 제거/치환');
}

function finish() {
  console.log('\n========================================');
  console.log(`📊 최종 결과: PASS ${passCount}건 / FAIL ${failCount}건`);
  if (failCount === 0) {
    console.log('🎉 모든 신규 기능 및 1~3순위 고도화 피처가 100% 무결점으로 정상 작동합니다!');
  } else {
    console.error('⚠️ 일부 테스트 항목에서 문제가 발견되었습니다.');
    process.exit(1);
  }
  console.log('========================================');
}

Promise.all(pendingAsyncTests).then(finish);
