import React, { useState, useRef } from 'react';
import {
  Plus,
  Trash2,
  Clock,
  Image as ImageIcon,
  RefreshCw,
  Film,
  Video,
  Search,
  FolderOpen,
  X,
  Wand2,
  Check,
} from 'lucide-react';
import type { ScriptScene, StockVideoItem } from '../types';

interface SceneTimelineEditorProps {
  scenes: ScriptScene[];
  onChangeScenes: (scenes: ScriptScene[]) => void;
  title: string;
  onSyncFromScript: () => void;
}

const STOCK_CATEGORY_CHIPS = [
  { label: '🌊 바다/자연', query: 'ocean waves beach nature' },
  { label: '🏙️ 도심/빌딩', query: 'city skyscrapers architecture' },
  { label: '💼 업무/비즈니스', query: 'business desk computer laptop' },
  { label: '💡 공부/책', query: 'book reading study' },
  { label: '🏃 운동/건강', query: 'running fitness health' },
  { label: '⚡ 네온/야경', query: 'neon night cyberpunk' },
  { label: '🌌 우주/별', query: 'space galaxy stars' },
  { label: '🌲 숲/힐링', query: 'forest trees nature sunlight' },
];

export const SceneTimelineEditor: React.FC<SceneTimelineEditorProps> = ({
  scenes,
  onChangeScenes,
  title,
  onSyncFromScript,
}) => {
  const [activeSceneIdx, setActiveSceneIdx] = useState<number>(0);

  // Stock Video Search State
  const [isStockSearchOpen, setIsStockSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [stockVideos, setStockVideos] = useState<StockVideoItem[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [hoveredVideoId, setHoveredVideoId] = useState<string | null>(null);
  const [isAutoMatchingAll, setIsAutoMatchingAll] = useState<boolean>(false);

  const activeScene = scenes[activeSceneIdx];

  const handleUpdateText = (idx: number, newText: string) => {
    const next = [...scenes];
    if (next[idx]) {
      next[idx] = {
        ...next[idx],
        text: newText,
        estimatedDuration: Math.max(3, Math.round(newText.length / 5.5)),
      };
      onChangeScenes(next);
    }
  };

  const handleUpdateVisual = (idx: number, newVisual: string) => {
    const next = [...scenes];
    if (next[idx]) {
      next[idx] = {
        ...next[idx],
        visualPrompt: newVisual,
      };
      onChangeScenes(next);
    }
  };

  const handleAddScene = () => {
    const newId = scenes.length;
    const newScene: ScriptScene = {
      id: newId,
      text: '새로운 씬 내용을 입력하세요.',
      visualPrompt: `${title} 관련 상세 연출 장면`,
      isThumbnail: false,
      estimatedDuration: 4,
      mediaType: 'image',
    };
    onChangeScenes([...scenes, newScene]);
    setActiveSceneIdx(newId);
  };

  const handleDeleteScene = (idx: number) => {
    if (scenes.length <= 1) return;
    const next = scenes.filter((_, i) => i !== idx).map((s, i) => ({ ...s, id: i }));
    onChangeScenes(next);
    setActiveSceneIdx(Math.max(0, idx - 1));
  };

  // Video Assignment Handlers
  const handleAssignVideoToActiveScene = (video: { url: string; previewUrl?: string; source?: 'pexels' | 'pixabay' | 'preset' | 'local' }) => {
    const next = [...scenes];
    if (next[activeSceneIdx]) {
      next[activeSceneIdx] = {
        ...next[activeSceneIdx],
        mediaType: 'video',
        videoUrl: video.url,
        mediaPreviewUrl: video.previewUrl,
        videoSource: video.source || 'preset',
      };
      onChangeScenes(next);
      setIsStockSearchOpen(false);
    }
  };

  const handleRemoveVideoFromActiveScene = () => {
    const next = [...scenes];
    if (next[activeSceneIdx]) {
      next[activeSceneIdx] = {
        ...next[activeSceneIdx],
        mediaType: 'image',
        videoUrl: undefined,
        mediaPreviewUrl: undefined,
        videoSource: undefined,
      };
      onChangeScenes(next);
    }
  };

  const handleSelectLocalVideo = async () => {
    if (!window.electronAPI?.selectLocalVideo) return;
    try {
      const selectedPath = await window.electronAPI.selectLocalVideo();
      if (selectedPath) {
        handleAssignVideoToActiveScene({
          url: selectedPath,
          previewUrl: undefined,
          source: 'local',
        });
      }
    } catch (err) {
      console.error('Failed to select local video:', err);
    }
  };

  const handleSearchStock = async (queryText?: string) => {
    const q = (queryText !== undefined ? queryText : searchQuery).trim() || activeScene?.text || title;
    setIsSearching(true);
    try {
      if (window.electronAPI?.searchStockVideos) {
        const res = await window.electronAPI.searchStockVideos({ query: q });
        if (res.success && Array.isArray(res.videos)) {
          setStockVideos(res.videos);
        }
      }
    } catch (err) {
      console.error('Stock video search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleOpenStockSearch = () => {
    setIsStockSearchOpen(true);
    const initialQuery = activeScene?.visualPrompt || activeScene?.text?.slice(0, 30) || title;
    setSearchQuery(initialQuery);
    handleSearchStock(initialQuery);
  };

  // 매칭은 장면마다 몇 초씩 걸린다. 그 사이 사용자가 고친 문장·프롬프트를 덮어쓰지 않게 끝날 때 최신 장면에 영상 필드만 합친다.
  const latestScenesRef = useRef(scenes);
  latestScenesRef.current = scenes;

  // Auto-match all scenes with royalty-free videos
  const handleAutoMatchAllVideos = async () => {
    if (!window.electronAPI?.searchStockVideos) return;
    setIsAutoMatchingAll(true);
    try {
      const matched = new Map<number, Partial<ScriptScene>>();
      const snapshot = [...scenes];
      for (let i = 0; i < snapshot.length; i++) {
        const sc = snapshot[i];
        const query = sc.visualPrompt || sc.text || title;
        const res = await window.electronAPI.searchStockVideos({ query });
        if (res.success && res.videos && res.videos.length > 0) {
          // Select an appropriate candidate based on index to avoid repeating the exact same video
          const video = res.videos[i % res.videos.length];
          matched.set(sc.id, {
            mediaType: 'video',
            videoUrl: video.url,
            mediaPreviewUrl: video.previewUrl,
            videoSource: ((video as any).engine as any) || 'preset',
          });
        }
      }
      onChangeScenes(latestScenesRef.current.map((sc) => (matched.has(sc.id) ? { ...sc, ...matched.get(sc.id) } : sc)));
    } catch (err) {
      console.error('Auto-match all videos error:', err);
    } finally {
      setIsAutoMatchingAll(false);
    }
  };

  const totalChars = scenes.reduce((acc, s) => acc + (s.text?.length || 0), 0);
  const totalEstimatedDuration = scenes.reduce((acc, s) => acc + (s.estimatedDuration || 4), 0);
  const videoSceneCount = scenes.filter((s) => s.mediaType === 'video').length;

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 shadow-xs">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5 flex-wrap">
              <span>씬(Scene) 타임라인 & 미디어 에디터</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-extrabold">
                총 {scenes.length}개 씬
              </span>
              {videoSceneCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold flex items-center gap-1">
                  <Video className="w-3 h-3" />
                  비디오 씬 {videoSceneCount}개
                </span>
              )}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              각 씬마다 AI 생성 이미지뿐만 아니라 <strong>고화질 무료 비디오(Pexels/내 영상)</strong>를 자유롭게 등록할 수 있습니다.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleAutoMatchAllVideos}
            disabled={isAutoMatchingAll}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95 disabled:opacity-50"
            title="모든 씬의 대본 문장에 맞추어 무료 실사 비디오를 자동으로 일괄 매칭합니다."
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>{isAutoMatchingAll ? '비디오 매칭 중...' : '전 씬 무료 비디오 자동 매칭'}</span>
          </button>
          <button
            type="button"
            onClick={onSyncFromScript}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all active:scale-95"
            title="현재 대본 텍스트를 분석하여 씬을 자동으로 재분할합니다."
          >
            <RefreshCw className="w-3 h-3 text-slate-500" />
            <span>대본에서 자동 분할</span>
          </button>
          <button
            type="button"
            onClick={handleAddScene}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>씬 추가</span>
          </button>
        </div>
      </div>

      {/* Summary Chips */}
      <div className="flex items-center gap-3 text-xs text-slate-600 font-medium bg-slate-50 p-3 rounded-xl border border-slate-200 flex-wrap">
        <span className="flex items-center gap-1">
          <span className="font-extrabold text-slate-900">{totalChars}</span>자 구성
        </span>
        <span className="text-slate-300">|</span>
        <span className="flex items-center gap-1 text-purple-700 font-bold">
          <Clock className="w-3.5 h-3.5" />
          예상 재생 시간: 약 {totalEstimatedDuration}초
        </span>
        <span className="text-slate-300">|</span>
        <span className="text-[11px] text-slate-500">
          💡 씬별로 [🎨 AI 이미지] 또는 [🎬 무료 비디오]를 선택해 자유롭게 하이브리드로 제작할 수 있습니다.
        </span>
      </div>

      {/* Scenes Timeline Strip / Horizontal Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {scenes.map((scene, idx) => {
          const isSelected = activeSceneIdx === idx;
          const isVideo = scene.mediaType === 'video';
          return (
            <button
              key={scene.id}
              type="button"
              onClick={() => setActiveSceneIdx(idx)}
              className={`flex flex-col items-start min-w-[130px] max-w-[170px] p-2.5 rounded-xl border text-left transition-all shrink-0 relative ${
                isSelected
                  ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-200 shadow-sm'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                  idx === 0
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {idx === 0 ? '👑 썸네일' : `Scene ${idx}`}
                </span>
                <div className="flex items-center gap-1">
                  {isVideo ? (
                    <span className="p-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-200" title="비디오 등록됨">
                      <Video className="w-3 h-3" />
                    </span>
                  ) : (
                    <span className="p-0.5 rounded bg-blue-50 text-blue-500 border border-blue-200" title="AI 이미지">
                      <ImageIcon className="w-3 h-3" />
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 font-semibold">
                    ~{scene.estimatedDuration || 4}s
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 font-medium truncate w-full mt-1.5">
                {scene.text || '(빈 씬)'}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Scene Detail Card */}
      {activeScene && (
        <div className="p-5 rounded-2xl bg-white border border-purple-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                activeSceneIdx === 0
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs'
                  : 'bg-purple-600 text-white'
              }`}>
                {activeSceneIdx === 0 ? 'Scene 0 (썸네일 히어로 컷)' : `Scene ${activeSceneIdx}`}
              </span>
              <span className="text-xs text-slate-500 font-bold">
                예상 시간: 약 {activeScene.estimatedDuration || 4}초
              </span>
            </div>

            {activeSceneIdx > 0 && (
              <button
                type="button"
                onClick={() => handleDeleteScene(activeSceneIdx)}
                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-bold px-2.5 py-1 rounded-lg hover:bg-red-50 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>이 씬 삭제</span>
              </button>
            )}
          </div>

          {/* Scene Narration Text */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-800 flex items-center justify-between">
              <span>🗣️ 나레이션 대본 문장</span>
              <span className="text-[10px] text-slate-400 font-medium">
                {activeScene.text?.length || 0}자
              </span>
            </label>
            <textarea
              rows={2}
              value={activeScene.text}
              onChange={(e) => handleUpdateText(activeSceneIdx, e.target.value)}
              placeholder="이 씬에서 성우가 낭독할 문장을 입력하세요."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-100 font-medium transition-all"
            />
          </div>

          {/* Visual Media Selection: Image vs Video Tabs */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <span>🎬 비주얼 미디어 선택</span>
                <span className="text-[10px] text-purple-600 font-bold">
                  {activeScene.mediaType === 'video' ? '무료 비디오 클립 적용 중' : 'AI 이미지 생성 적용 중'}
                </span>
              </label>

              {/* Mode Toggle Tabs */}
              <div className="flex items-center p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={handleRemoveVideoFromActiveScene}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeScene.mediaType !== 'video'
                      ? 'bg-white text-purple-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>AI 이미지</span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenStockSearch}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeScene.mediaType === 'video'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Video className="w-3 h-3" />
                  <span>무료 비디오</span>
                </button>
              </div>
            </div>

            {/* If Video Mode is active */}
            {activeScene.mediaType === 'video' && activeScene.videoUrl ? (
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-14 h-20 rounded-lg bg-black overflow-hidden relative shrink-0 shadow-xs border border-emerald-300">
                    {activeScene.videoUrl.startsWith('http') ? (
                      <video
                        src={activeScene.videoUrl}
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-white bg-slate-900">
                        <Video className="w-5 h-5 text-emerald-400" />
                        <span className="text-[9px] mt-1 font-bold">로컬 영상</span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-600 text-white">
                        {activeScene.videoSource === 'local' ? '내 PC 영상' : '무료 스톡 비디오'}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-900 truncate">
                        9:16 비디오 클립 등록 완료
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium truncate max-w-md">
                      {activeScene.videoUrl}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      쇼츠 렌더링 시 이 씬의 나레이션 길이에 맞추어 9:16 화면으로 자동 합성됩니다.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={handleOpenStockSearch}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-emerald-300 text-emerald-800 text-xs font-bold transition-all shadow-2xs"
                  >
                    <Search className="w-3 h-3" />
                    <span>비디오 교체</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveVideoFromActiveScene}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-red-50 border border-red-200 text-red-600 text-xs font-bold transition-all"
                  >
                    <X className="w-3 h-3" />
                    <span>비디오 제거</span>
                  </button>
                </div>
              </div>
            ) : (
              /* AI Image Mode inputs */
              <div className="space-y-1.5">
                <input
                  type="text"
                  value={activeScene.visualPrompt || ''}
                  onChange={(e) => handleUpdateVisual(activeSceneIdx, e.target.value)}
                  placeholder="예: 서울 강남 번화가에서 비를 피하며 스마트폰을 보는 20대 남녀, 시네마틱 조명"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-100 font-medium transition-all"
                />
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                  <span>비워두시면 선택하신 화풍 템플릿과 대본 문맥에 맞추어 AI가 최적의 프롬프트로 자동 생성합니다.</span>
                  <button
                    type="button"
                    onClick={handleOpenStockSearch}
                    className="text-purple-600 hover:text-purple-700 font-bold underline flex items-center gap-1"
                  >
                    <Video className="w-3 h-3" />
                    <span>이 씬에 무료 비디오 적용하기 &rarr;</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stock Video Search Modal Drawer */}
      {isStockSearchOpen && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white border border-purple-500/30 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Video className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-black text-white">
                무료 비디오 검색 및 등록 (Scene {activeSceneIdx})
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setIsStockSearchOpen(false)}
              className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Bar + Local Video Button */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchStock()}
                placeholder="검색어 입력 (예: 바다, 도시 야경, 직장, 공부, 운동, 우주 등)..."
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-9 pr-20 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:bg-white/15 transition-all"
              />
              <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
              <button
                type="button"
                onClick={() => handleSearchStock()}
                disabled={isSearching}
                className="absolute right-1.5 top-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all disabled:opacity-50"
              >
                {isSearching ? '검색 중...' : '검색'}
              </button>
            </div>

            <button
              type="button"
              onClick={handleSelectLocalVideo}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shrink-0 transition-all shadow-xs"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>내 PC 무료 영상 선택</span>
            </button>
          </div>

          {/* Popular Tag Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {STOCK_CATEGORY_CHIPS.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => {
                  setSearchQuery(chip.query);
                  handleSearchStock(chip.query);
                }}
                className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/10 hover:bg-white/20 text-white/90 border border-white/10 whitespace-nowrap transition-all"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-72 overflow-y-auto pr-1">
            {stockVideos.map((vid) => {
              const isHovered = hoveredVideoId === vid.id;
              return (
                <div
                  key={vid.id}
                  onMouseEnter={() => setHoveredVideoId(vid.id)}
                  onMouseLeave={() => setHoveredVideoId(null)}
                  onClick={() => handleAssignVideoToActiveScene({
                    url: vid.url,
                    previewUrl: vid.previewUrl,
                    source: (vid.engine as any) || 'preset',
                  })}
                  className="group relative cursor-pointer rounded-xl overflow-hidden aspect-[9/16] bg-black border border-white/20 hover:border-emerald-400 transition-all shadow-md flex flex-col justify-end p-2"
                >
                  {isHovered ? (
                    <video
                      src={vid.url}
                      className="absolute inset-0 w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={vid.previewUrl || 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?w=300'}
                      alt={vid.title || 'Stock video'}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                  <div className="relative z-10 space-y-1">
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-black/60 text-white border border-white/20 inline-block">
                      {vid.duration ? `${vid.duration}s` : '9:16 HD'}
                    </span>
                    <p className="text-[10px] font-bold text-white line-clamp-1">
                      {vid.title || '무료 비디오 클립'}
                    </p>
                    <div className="pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="w-full flex items-center justify-center gap-1 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-black shadow-xs">
                        <Check className="w-3 h-3" />
                        <span>이 영상 적용</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {stockVideos.length === 0 && !isSearching && (
            <div className="text-center py-6 text-xs text-white/50 space-y-1">
              <p>검색 결과가 없습니다. 다른 검색어를 입력하시거나 상단 추천 칩을 눌러보세요.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
