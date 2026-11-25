import React, { useState } from 'react';
import { Wand2, Loader2 } from 'lucide-react';
import { TEMPLATES } from './TemplateSelector';
import { VOICES } from './VoiceSelector';
import { SUBTITLE_STYLES, TITLE_STYLES } from './SubtitleStyleSelector';
import { BGM_TRACKS } from '../constants/bgm';
import {
  buildRecommendPrompt,
  parseRecommendation,
  ruleBasedRecommendation,
  type OptionLists,
  type RecommendedOptions,
} from '../lib/optionRecommender';

// ElevenLabs·Gemini 성우는 별도 키가 있어야 해서 추천 후보에서 뺀다 (Edge 성우만)
const OPTION_LISTS: OptionLists = {
  templates: TEMPLATES.map((t) => ({ id: t.id, name: t.name })),
  voices: VOICES.filter((v) => (v.provider || 'edge-tts') === 'edge-tts').map((v) => ({ id: v.id, name: v.name })),
  titleStyles: TITLE_STYLES.map((t) => ({ id: t.id, name: t.name })),
  subtitleStyles: SUBTITLE_STYLES.map((s) => ({ id: s.id, name: s.name })),
  bgmMoods: BGM_TRACKS.map((b) => ({ id: b.id, name: b.name })),
};

const nameOf = (items: { id: string; name: string }[], id: string) => items.find((o) => o.id === id)?.name || id;

interface OptionRecommenderProps {
  title: string;
  script: string;
  hookTitleText: string;
  hookSubtitleText: string;
  onChangeHook: (title: string, subtitle: string) => void;
  onApply: (rec: RecommendedOptions) => void;
}

export const OptionRecommender: React.FC<OptionRecommenderProps> = ({
  title,
  script,
  hookTitleText,
  hookSubtitleText,
  onChangeHook,
  onApply,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RecommendedOptions | null>(null);
  const [notice, setNotice] = useState('');

  const handleRecommend = async () => {
    if (!title.trim() && !script.trim()) {
      setNotice('먼저 주제(제목)나 대본을 입력해 주세요.');
      return;
    }
    setIsLoading(true);
    setNotice('');
    const fallback = ruleBasedRecommendation(title, script, OPTION_LISTS);
    let rec = fallback;
    try {
      const res = await window.electronAPI?.recommendRenderOptions({ prompt: buildRecommendPrompt(title, script, OPTION_LISTS) });
      const parsed = res?.success && res.text ? parseRecommendation(res.text, OPTION_LISTS, fallback) : null;
      if (parsed) rec = parsed;
      else setNotice(res?.error ? `AI 추천 실패(${res.error}) → 키워드 규칙으로 추천했습니다.` : 'AI 응답을 읽지 못해 키워드 규칙으로 추천했습니다.');
    } catch (err: any) {
      setNotice(`AI 추천 실패(${err?.message || err}) → 키워드 규칙으로 추천했습니다.`);
    } finally {
      setIsLoading(false);
    }
    setResult(rec);
    onApply(rec);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-600">
            <Wand2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">AI 영상 옵션 추천</h2>
            <p className="text-xs text-slate-500">제목·대본을 보고 화풍, 성우, 제목·자막 스타일, 배경음, 시작 배너 문구를 골라 아래 설정에 채웁니다.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleRecommend}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 disabled:opacity-60 text-white text-xs font-bold shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
        >
          {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
          <span>{isLoading ? '추천 중...' : result ? '다시 추천' : '옵션 추천받기'}</span>
        </button>
      </div>

      {notice && <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">{notice}</p>}

      {result && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
          {[
            ['화풍', nameOf(OPTION_LISTS.templates, result.templateId)],
            ['성우', nameOf(OPTION_LISTS.voices, result.voiceId)],
            ['제목 스타일', nameOf(OPTION_LISTS.titleStyles, result.titleStyleId)],
            ['자막 스타일', nameOf(OPTION_LISTS.subtitleStyles, result.subtitleStyleId)],
            ['배경음', nameOf(OPTION_LISTS.bgmMoods, result.bgmMood)],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-500">{label}</span>
              <span className="font-bold text-slate-900 truncate">{value}</span>
            </div>
          ))}
          {result.reason && (
            <p className="sm:col-span-2 text-slate-600 leading-relaxed">
              {result.source === 'ai' ? '🤖 ' : '🔑 '}
              {result.reason}
            </p>
          )}
        </div>
      )}

      {/* 시작 배너(첫 2초) 문구: 추천값이 채워지고 직접 고칠 수 있다. 비우면 기본 문구를 쓴다. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
        <label className="space-y-1">
          <span className="text-[11px] font-bold text-slate-600">시작 배너 큰 문구</span>
          <input
            type="text"
            value={hookTitleText}
            onChange={(e) => onChangeHook(e.target.value, hookSubtitleText)}
            placeholder="⚡ 놓치면 손해 3초 꿀팁 ⚡ (기본값)"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-fuchsia-500 focus:bg-white"
          />
        </label>
        <label className="space-y-1">
          <span className="text-[11px] font-bold text-slate-600">시작 배너 작은 문구</span>
          <input
            type="text"
            value={hookSubtitleText}
            onChange={(e) => onChangeHook(hookTitleText, e.target.value)}
            placeholder="끝까지 보면 인생이 바뀝니다 (기본값)"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-fuchsia-500 focus:bg-white"
          />
        </label>
      </div>
    </div>
  );
};
