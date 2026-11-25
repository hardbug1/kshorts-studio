import React, { useState } from 'react';
import { useEscapeKey } from '../hooks/useEscapeKey';
import {
  Sparkles,
  BookmarkPlus,
  Trash2,
  Check,
  X,
  Palette,
  Mic,
  Music,
  Type,
} from 'lucide-react';
import {
  type ShortsPreset,
  DEFAULT_PRESETS,
  type SubtitleStyleId,
  type TitleStyleId,
  type SubtitleFontSize,
} from '../types';
import { VOICES } from './VoiceSelector';
import { FONTS } from './FontSelector';
import { SUBTITLE_STYLES } from './SubtitleStyleSelector';

interface PresetBarProps {
  currentVoiceId: string;
  currentTemplateId: string;
  currentFontId: string;
  currentSubtitleStyleId: SubtitleStyleId;
  currentSubtitleFontSize: SubtitleFontSize;
  currentTitleStyleId: TitleStyleId;
  currentBgmMood: string;
  currentBgmVolume: number;
  enableBgm: boolean;
  enableHookIntro: boolean;
  enablePopupSubtitles: boolean;
  onApplyPreset: (preset: ShortsPreset) => void;
}

const STORAGE_KEY = 'kshorts_custom_presets';

export const PresetBar: React.FC<PresetBarProps> = ({
  currentVoiceId,
  currentTemplateId,
  currentFontId,
  currentSubtitleStyleId,
  currentSubtitleFontSize,
  currentTitleStyleId,
  currentBgmMood,
  currentBgmVolume,
  enableBgm,
  enableHookIntro,
  enablePopupSubtitles,
  onApplyPreset,
}) => {
  const [customPresets, setCustomPresets] = useState<ShortsPreset[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEscapeKey(isModalOpen, () => setIsModalOpen(false));
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetDesc, setNewPresetDesc] = useState('');
  const [newPresetIcon, setNewPresetIcon] = useState('✨');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const allPresets = [...DEFAULT_PRESETS, ...customPresets];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectPreset = (preset: ShortsPreset) => {
    setActivePresetId(preset.id);
    onApplyPreset(preset);
    showToast(`'${preset.name}' 프리셋이 적용되었습니다!`);
  };

  const handleSaveCustomPreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPresetName.trim()) return;

    const newPreset: ShortsPreset = {
      id: `custom_${Date.now()}`,
      name: newPresetName.trim(),
      description: newPresetDesc.trim() || '내가 저장한 커스텀 쇼츠 조합',
      icon: newPresetIcon || '⭐',
      voiceId: currentVoiceId,
      templateId: currentTemplateId,
      fontId: currentFontId,
      subtitleStyleId: currentSubtitleStyleId,
      subtitleFontSize: currentSubtitleFontSize,
      titleStyleId: currentTitleStyleId,
      bgmMood: currentBgmMood,
      bgmVolume: currentBgmVolume,
      enableBgm,
      enableHookIntro,
      enablePopupSubtitles,
      isBuiltin: false,
    };

    const updated = [...customPresets, newPreset];
    setCustomPresets(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setActivePresetId(newPreset.id);
    setIsModalOpen(false);
    setNewPresetName('');
    setNewPresetDesc('');
    showToast(`새 프리셋 '${newPreset.name}'이(가) 저장되었습니다.`);
  };

  const handleDeleteCustomPreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('이 커스텀 프리셋을 삭제하시겠습니까?')) return;
    const updated = customPresets.filter((p) => p.id !== id);
    setCustomPresets(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    if (activePresetId === id) setActivePresetId(null);
    showToast('프리셋이 삭제되었습니다.');
  };

  const emojiList = ['⚡', '🔥', '💡', '💬', '🎬', '☕', '😱', '👑', '🚀', '🎯', '✨'];

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm space-y-3">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg animate-in fade-in slide-in-from-top-2 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-900 flex items-center gap-2">
              <span>원클릭 쇼츠 템플릿 프리셋</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-extrabold">
                빠른 세팅
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              화풍, 폰트, 자막 애니메이션, 성우 보이스, BGM을 최적의 공식 조합으로 한 번에 적용합니다.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 text-xs font-bold transition-all shrink-0 self-start sm:self-auto border border-slate-200 hover:border-indigo-200"
        >
          <BookmarkPlus className="w-3.5 h-3.5 text-indigo-500" />
          <span>현재 설정 프리셋으로 저장</span>
        </button>
      </div>

      {/* Horizontal Preset Carousel / Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2.5">
        {allPresets.map((preset) => {
          const isSelected = activePresetId === preset.id;
          const voiceName = VOICES.find((v) => v.id === preset.voiceId)?.name || '선희';
          const matchedFont = FONTS.find(
            (f) =>
              f.id === preset.fontId ||
              f.id.replace(/\s+/g, '').toLowerCase() === (preset.fontId || '').replace(/\s+/g, '').toLowerCase()
          );
          const fontName = matchedFont?.name ? matchedFont.name.split('(')[0].trim() : (preset.fontId || '프리탠다드');
          const matchedSub = SUBTITLE_STYLES.find((s) => s.id === preset.subtitleStyleId);
          const subtitleName = matchedSub?.name ? matchedSub.name.split('&')[0].trim() : (preset.subtitleStyleId || '기본');

          return (
            <div
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`relative text-left p-3 rounded-xl border transition-all cursor-pointer group flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-50/70 border-indigo-500 shadow-xs ring-2 ring-indigo-500/20'
                  : 'bg-slate-50/60 hover:bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-2xs'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xl">{preset.icon}</span>
                  {!preset.isBuiltin ? (
                    <button
                      type="button"
                      onClick={(e) => handleDeleteCustomPreset(preset.id, e)}
                      className="p-1 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="프리셋 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200/60 text-slate-600">
                      추천
                    </span>
                  )}
                </div>

                <div>
                  <h4 className={`text-xs font-black line-clamp-1 ${isSelected ? 'text-indigo-950' : 'text-slate-900'}`}>
                    {preset.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 font-medium">
                    {preset.description}
                  </p>
                </div>
              </div>

              {/* Tag summary */}
              <div className="mt-2.5 pt-2 border-t border-slate-200/50 flex flex-wrap gap-1 text-[9px] font-bold">
                <span className="px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200/60">
                  {voiceName}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-white text-indigo-700 border border-indigo-100">
                  {fontName}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-white text-pink-700 border border-pink-100">
                  {subtitleName}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Save Preset Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <BookmarkPlus className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-black text-slate-900">현재 설정을 새 프리셋으로 저장</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomPreset} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-700 font-bold">프리셋 명칭</label>
                <input
                  type="text"
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  placeholder="예: 내 시그니처 썰 쇼츠 세팅"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold">간단 설명</label>
                <input
                  type="text"
                  value={newPresetDesc}
                  onChange={(e) => setNewPresetDesc(e.target.value)}
                  placeholder="예: 빠른 템포의 유머와 G마켓 폰트 조합"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold">아이콘 (이모지 선택)</label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {emojiList.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewPresetIcon(emoji)}
                      className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center transition-all ${
                        newPresetIcon === emoji
                          ? 'bg-indigo-600 text-white shadow-xs scale-110'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Settings Snapshot Preview */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <span className="text-[11px] font-extrabold text-slate-700 block">저장될 구성 세부정보:</span>
                <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-600">
                  <div className="flex items-center gap-1">
                    <Mic className="w-3 h-3 text-blue-500" />
                    <span>보이스: {VOICES.find((v) => v.id === currentVoiceId)?.name || currentVoiceId}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Type className="w-3 h-3 text-indigo-500" />
                    <span>폰트: {currentFontId}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Palette className="w-3 h-3 text-pink-500" />
                    <span>자막: {currentSubtitleStyleId}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Music className="w-3 h-3 text-emerald-500" />
                    <span>BGM: {currentBgmMood} ({Math.round(currentBgmVolume * 100)}%)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={!newPresetName.trim()}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 disabled:opacity-50"
                >
                  프리셋 저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
