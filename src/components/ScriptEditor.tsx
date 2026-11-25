import React, { useState } from 'react';
import { FileText, Clock, CheckCircle2, Film, Globe, MessageSquare } from 'lucide-react';
import type { ScriptScene } from '../types';
import { SceneTimelineEditor } from './SceneTimelineEditor';
import { MultilingualModal } from './MultilingualModal';
import { PinnedCommentModal } from './PinnedCommentModal';

interface ScriptEditorProps {
  script: string;
  setScript: (v: string) => void;
  title?: string;
  onChangeTitle?: (t: string) => void;
  scenes: ScriptScene[];
  onChangeScenes: (scenes: ScriptScene[]) => void;
  onChangeVoiceId?: (v: string) => void;
}

export const ScriptEditor: React.FC<ScriptEditorProps> = ({
  script,
  setScript,
  title = '',
  onChangeTitle,
  scenes,
  onChangeScenes,
  onChangeVoiceId,
}) => {
  const [editorMode, setEditorMode] = useState<'script' | 'timeline'>('script');
  const [isMultilingualModalOpen, setIsMultilingualModalOpen] = useState(false);
  const [isPinnedCommentModalOpen, setIsPinnedCommentModalOpen] = useState(false);

  const charCount = script.trim().length;
  // Estimated duration: Korean reading speed is approx. 5.5 characters per second
  const estimatedSeconds = Math.max(10, Math.round(charCount / 5.5));

  // Sync script changes into scenes when switching to timeline or upon request
  const handleSyncScenesFromScript = async () => {
    if (!script.trim()) return;
    if (window.electronAPI?.splitScriptScenes) {
      try {
        const generatedScenes = await window.electronAPI.splitScriptScenes({
          script,
          title,
        });
        if (generatedScenes && generatedScenes.length > 0) {
          onChangeScenes(generatedScenes);
        }
      } catch (err) {
        console.warn('Split scenes failed:', err);
      }
    }
  };

  // Sync back to script when scenes are updated in timeline editor
  const handleScenesChange = (updatedScenes: ScriptScene[]) => {
    onChangeScenes(updatedScenes);
    // Reconstruct full script from scene texts
    const newFullScript = updatedScenes.map((s) => s.text).filter(Boolean).join('\n\n');
    if (newFullScript && newFullScript !== script) {
      setScript(newFullScript);
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <FileText className="w-5 h-5" />
          </div>
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">2. 대본 검수 및 씬 타임라인</h2>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Global 3-Language Translation Button */}
          <button
            type="button"
            onClick={() => setIsMultilingualModalOpen(true)}
            disabled={!script.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition-all disabled:opacity-40"
            title="한국어 대본을 영문, 일본어, 스페인어로 동시 번역합니다"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            <span>글로벌 3개국어 번역</span>
          </button>

          {/* AI Pinned Comment Generator Button */}
          <button
            type="button"
            onClick={() => setIsPinnedCommentModalOpen(true)}
            disabled={!script.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-all disabled:opacity-40"
            title="시청자 댓글 참여율을 높이는 고정 댓글을 자동 생성합니다"
          >
            <MessageSquare className="w-3.5 h-3.5 text-rose-600" />
            <span>AI 고정 댓글 & 투표</span>
          </button>

          {/* View Mode Toggle Switch */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold shrink-0">
            <button
              type="button"
              onClick={() => setEditorMode('script')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                editorMode === 'script'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>대본 전문 입력</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (scenes.length === 0 && script.trim()) {
                  handleSyncScenesFromScript();
                }
                setEditorMode('timeline');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                editorMode === 'timeline'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>씬(Scene) 타임라인 {scenes.length > 0 && `(${scenes.length})`}</span>
            </button>
          </div>
        </div>
      </div>

      {editorMode === 'script' ? (
        <div className="space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span className="flex items-center gap-1">
              <span className="font-extrabold text-slate-800">{charCount}</span> 자
            </span>
            <span className="flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-md text-[11px] text-blue-700 border border-blue-200 font-bold">
              <Clock className="w-3 h-3" />
              약 {estimatedSeconds}초 쇼츠
            </span>
          </div>

          <div className="relative">
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="대본이 여기에 표시됩니다. 직접 입력하거나 위에서 AI 대본 생성을 눌러보세요."
              rows={6}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 resize-y leading-relaxed font-sans transition-all font-medium"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
            <span className="font-medium">💡 첫 문장에 시청자의 호기심을 유발하는 질문/파격 선언을 넣으면 알고리즘 노출도가 상승합니다.</span>
            {charCount >= 50 && (
              <span className="flex items-center gap-1 text-emerald-600 font-bold shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> 대본 준비 완료
              </span>
            )}
          </div>
        </div>
      ) : (
        <SceneTimelineEditor
          scenes={scenes}
          onChangeScenes={handleScenesChange}
          title={title}
          onSyncFromScript={handleSyncScenesFromScript}
        />
      )}

      {/* Multilingual Global Localization Modal — 열 때마다 새로 마운트해 이전 대본의 번역이 남지 않게 한다 */}
      {isMultilingualModalOpen && (
        <MultilingualModal
          isOpen
          onClose={() => setIsMultilingualModalOpen(false)}
          koreanTitle={title}
          koreanScript={script}
          onApplyScriptToEditor={(newTitle, newScript, newVoiceId) => {
            setScript(newScript);
            if (onChangeTitle && newTitle) onChangeTitle(newTitle);
            if (onChangeVoiceId && newVoiceId) onChangeVoiceId(newVoiceId);
          }}
        />
      )}

      {/* AI Pinned Comment Suggestions Modal (같은 이유로 열 때만 마운트) */}
      {isPinnedCommentModalOpen && (
        <PinnedCommentModal
          isOpen
          onClose={() => setIsPinnedCommentModalOpen(false)}
          topic={title}
          script={script}
        />
      )}
    </div>
  );
};

