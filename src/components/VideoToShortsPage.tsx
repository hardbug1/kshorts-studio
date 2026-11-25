import React, { useState, useRef } from 'react';
import {
  Film,
  Upload,
  Scissors,
  Volume2,
  VolumeX,
  Music,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Play,
  Pause,
  Share2,
  FileVideo,
  Sliders,
  Check,
} from 'lucide-react';
import type { LongToShortsClip, VideoAnalysisResult, VideoToShortsParams } from '../types';
import type { NavTab } from './Sidebar';

interface VideoToShortsPageProps {
  onNavigate?: (tab: NavTab) => void;
  onProjectCreated?: () => void;
}

export const VideoToShortsPage: React.FC<VideoToShortsPageProps> = ({
  onNavigate,
  onProjectCreated,
}) => {
  // 1. Video Selection & Upload State
  const [videoPath, setVideoPath] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<VideoAnalysisResult | null>(null);

  // 2. Clip Selection State
  const [selectedClipIndex, setSelectedClipIndex] = useState<number>(0);
  const [customStart, setCustomStart] = useState<number>(0);
  const [customEnd, setCustomEnd] = useState<number>(30);
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  // 3. Audio & BGM State (Core User Request)
  const [removeOriginalAudio, setRemoveOriginalAudio] = useState<boolean>(true); // 기본 ON (기존 음성 제거)
  const [selectedBgm, setSelectedBgm] = useState<string>('bgm_upbeat');
  const [bgmVolume, setBgmVolume] = useState<number>(0.35);
  const [enableSfx, setEnableSfx] = useState<boolean>(true);
  const [playingBgm, setPlayingBgm] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 4. Visual & Title State
  const [cropMode, setCropMode] = useState<'smart_crop' | 'blur_padding'>('smart_crop');
  const [shortsTitle, setShortsTitle] = useState('');
  const [titleStyleId, setTitleStyleId] = useState<string>('yellow_tape');

  // 5. Execution State
  const [isRendering, setIsRendering] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [renderResult, setRenderResult] = useState<{
    projectId?: string;
    videoPath?: string;
    videoUrl?: string;
    thumbnailPath?: string;
  } | null>(null);

  const bgmList = [
    { id: 'bgm_upbeat', name: '⚡ Upbeat (경쾌/활기)', mood: 'Upbeat Energetic', icon: '⚡' },
    { id: 'bgm_suspense', name: '🕵️ Suspense (긴장/미스터리)', mood: 'Mystery Thriller', icon: '🕵️' },
    { id: 'bgm_lofi', name: '☕ Lofi (힐링/감성)', mood: 'Relax Chill', icon: '☕' },
    { id: 'bgm_epic', name: '👑 Epic (웅장/성공)', mood: 'Cinematic Glory', icon: '👑' },
    { id: 'bgm_tech', name: '💻 Tech (스마트/지식)', mood: 'Modern Future', icon: '💻' },
    { id: 'none', name: '🚫 BGM 없음 (무음)', mood: 'No Music', icon: '🚫' },
  ];

  const titleStyles = [
    { id: 'yellow_tape', label: '⚡ 옐로우 마커 테이프', color: 'bg-yellow-400 text-slate-950' },
    { id: 'breaking', label: '🚨 속보 레드', color: 'bg-red-600 text-white' },
    { id: 'ssul_badge', label: '🔥 실시간 BEST 오렌지', color: 'bg-orange-500 text-white' },
    { id: 'caution_hazard', label: '⚠️ 충격주의 경고', color: 'bg-amber-400 text-slate-950' },
    { id: 'gold_luxury', label: '👑 골드 VIP', color: 'bg-amber-300 text-slate-900' },
    { id: 'dark_pill', label: '📌 다크 미니멀', color: 'bg-slate-800 text-white' },
    { id: 'none', label: '배너 없음', color: 'bg-slate-200 text-slate-700' },
  ];

  // Handle File Selection via Native Dialog
  const handleSelectFile = async () => {
    try {
      if (window.electronAPI?.selectSourceVideo) {
        const filePath = await window.electronAPI.selectSourceVideo();
        if (filePath) {
          setVideoPath(filePath);
          triggerAnalyze(filePath);
        }
      } else if (window.electronAPI?.selectLocalVideo) {
        const filePath = await window.electronAPI.selectLocalVideo();
        if (filePath) {
          setVideoPath(filePath);
          triggerAnalyze(filePath);
        }
      }
    } catch (err: any) {
      setRenderError('파일 선택 중 오류가 발생했습니다: ' + err?.message);
    }
  };

  // Trigger Video Analysis
  const triggerAnalyze = async (filePathToAnalyze?: string) => {
    const targetPath = filePathToAnalyze || videoPath;
    if (!targetPath.trim()) {
      setRenderError('분석할 동영상 파일의 경로를 입력하거나 선택해주세요.');
      return;
    }

    setRenderError(null);
    setIsAnalyzing(true);
    setAnalysis(null);
    setRenderResult(null);

    try {
      const res = window.electronAPI?.analyzeVideoForShorts
        ? await window.electronAPI.analyzeVideoForShorts({ videoPath: targetPath.trim() })
        : await window.electronAPI.analyzeLongVideo({ videoPath: targetPath.trim() });

      if (res.success && res.clips) {
        setAnalysis(res);
        if (res.clips.length > 0) {
          setSelectedClipIndex(0);
          setShortsTitle(res.clips[0].title);
          setCustomStart(res.clips[0].startTime);
          setCustomEnd(res.clips[0].endTime);
        }
      } else {
        setRenderError(res.error || '영상 분석에 실패했습니다.');
      }
    } catch (err: any) {
      setRenderError(err?.message || '영상 분석 처리 중 오류가 발생했습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Toggle BGM Preview Audio
  const handleToggleBgmAudio = (bgmId: string) => {
    if (bgmId === 'none') {
      if (audioRef.current) audioRef.current.pause();
      setPlayingBgm(null);
      return;
    }

    if (playingBgm === bgmId) {
      if (audioRef.current) audioRef.current.pause();
      setPlayingBgm(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = `./bgm/${bgmId}.mp3`;
        audioRef.current.volume = bgmVolume;
        audioRef.current.play().catch(() => {});
        setPlayingBgm(bgmId);
      }
    }
  };

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const p = window.electronAPI?.getPathForFile(file);
      if (p) {
        setVideoPath(p);
        triggerAnalyze(p);
      }
    }
  };

  // Execute Render to Shorts
  const handleRenderShorts = async () => {
    if (!analysis || !analysis.clips) {
      setRenderError('먼저 영상을 분석해주세요.');
      return;
    }

    let clipToRender: LongToShortsClip;
    if (isCustomMode) {
      const duration = Math.max(3, customEnd - customStart);
      clipToRender = {
        startTime: customStart,
        endTime: customEnd,
        duration,
        title: shortsTitle || '사용자 지정 쇼츠 클립',
        highlightSummary: `${shortsTitle || '사용자 지정 구간'} (${customStart}초 ~ ${customEnd}초)`,
        score: 95,
      };
    } else {
      clipToRender = analysis.clips[selectedClipIndex] || analysis.clips[0];
    }

    setIsRendering(true);
    setRenderError(null);
    setRenderResult(null);

    try {
      const params: VideoToShortsParams = {
        videoPath: videoPath.trim(),
        clip: clipToRender,
        title: shortsTitle || clipToRender.title,
        titleStyleId,
        removeOriginalAudio, // 핵심: 기존 음성 제거 여부
        bgmTrack: selectedBgm,
        bgmVolume,
        enableSfx,
        cropMode,
      };

      const res = window.electronAPI?.renderVideoToShorts
        ? await window.electronAPI.renderVideoToShorts(params)
        : await window.electronAPI.extractLongToShorts(params);

      if (res.success && res.videoPath) {
        setRenderResult({
          projectId: res.projectId,
          videoPath: res.videoPath,
          videoUrl: res.videoUrl,
          thumbnailPath: res.thumbnailPath,
        });
        if (onProjectCreated) {
          onProjectCreated();
        }
      } else {
        setRenderError(res.error || '쇼츠 영상 변환 제작에 실패했습니다.');
      }
    } catch (err: any) {
      setRenderError(err?.message || '쇼츠 렌더링 중 오류가 발생했습니다.');
    } finally {
      setIsRendering(false);
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      <audio ref={audioRef} onEnded={() => setPlayingBgm(null)} className="hidden" />

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 border border-slate-800 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-300 text-xs font-black tracking-wide">
              <Film className="w-3.5 h-3.5" />
              <span>AI Video-to-Shorts Studio</span>
              <span className="px-1.5 py-0.2 rounded-full bg-pink-500 text-white text-[9px] font-black uppercase">NEW</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              사용자 영상 분석 & 9:16 쇼츠 자동 제작
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              보유하신 영상을 올리면 AI가 하이라이트 구간을 정밀 분석하고, <strong className="text-pink-300">기존 음성 제거(음소거)</strong> 및 감각적인 BGM/자막 타이틀과 함께 시선을 사로잡는 9:16 모바일 쇼츠로 즉시 변환합니다.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleSelectFile}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-indigo-500/25 transition-all active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>내 PC 영상 올리기</span>
            </button>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Step 1: Upload & Select Video */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-black">1</span>
            <span>영상 파일 올리기 및 선택</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">MP4, MOV, MKV, WebM 지원</span>
        </div>

        {/* Drag & Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleSelectFile}
          className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/70 scale-[0.99]'
              : videoPath
              ? 'border-emerald-300 bg-emerald-50/20 hover:bg-emerald-50/40'
              : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
          }`}
        >
          <div className="max-w-md mx-auto space-y-3">
            <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center transition-colors ${
              videoPath ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'
            }`}>
              {videoPath ? <CheckCircle2 className="w-7 h-7" /> : <Upload className="w-7 h-7" />}
            </div>
            <div>
              <p className="text-sm font-black text-slate-900">
                {videoPath ? '영상이 선택되었습니다 (클릭하여 파일 변경)' : '동영상 파일을 이곳에 드래그하거나 클릭하여 선택하세요'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {videoPath ? videoPath : '컴퓨터에 저장된 긴 가로 영상이나 촬영본을 자유롭게 올려보세요.'}
              </p>
            </div>
          </div>
        </div>

        {/* Path Input & Manual Analyze Button */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <FileVideo className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={videoPath}
              onChange={(e) => setVideoPath(e.target.value)}
              placeholder="동영상 파일 절대 경로를 입력하거나 위 버튼으로 선택하세요..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-xs font-mono outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800"
            />
          </div>
          <button
            onClick={() => triggerAnalyze()}
            disabled={isAnalyzing || !videoPath.trim()}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-md shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2 shrink-0"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>영상 심층 분석 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>영상 분석 시작</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Step 2: Analysis Result Display */}
      {analysis && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-6 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-black">2</span>
              <span>영상 정밀 분석 및 하이라이트 구간</span>
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                총 {formatSeconds(analysis.totalDuration || 0)}
              </span>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {analysis.width}x{analysis.height} ({analysis.aspectRatio})
              </span>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                analysis.hasAudio
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                {analysis.hasAudio ? '🔊 원본 음성 감지됨' : '🔇 음성 트랙 없음'}
              </span>
            </div>
          </div>

          {/* AI Recommended Clips */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-indigo-600" />
                <span>AI 추천 하이라이트 구간 선택</span>
              </label>
              <button
                onClick={() => setIsCustomMode(!isCustomMode)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 underline"
              >
                {isCustomMode ? 'AI 추천 구간으로 변경' : '직접 시간 조절하기'}
              </button>
            </div>

            {!isCustomMode ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(analysis.clips || []).map((clip, idx) => {
                  const isSelected = selectedClipIndex === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedClipIndex(idx);
                        setShortsTitle(clip.title);
                        setCustomStart(clip.startTime);
                        setCustomEnd(clip.endTime);
                      }}
                      className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/40 shadow-md shadow-indigo-600/5'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                          {formatSeconds(clip.startTime)} ~ {formatSeconds(clip.endTime)} ({clip.duration}초)
                        </span>
                        <span className="text-[10px] font-extrabold text-amber-600">★ {clip.score}점</span>
                      </div>
                      <h4 className="text-xs font-black text-slate-900 truncate">{clip.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {clip.highlightSummary}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between text-xs font-extrabold text-slate-700">
                  <span>사용자 직접 구간 설정</span>
                  <span className="text-indigo-600">
                    선택 구간: {formatSeconds(customStart)} ~ {formatSeconds(customEnd)} (총 {Math.max(0, customEnd - customStart)}초)
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">시작 시점 (초)</label>
                    <input
                      type="number"
                      min={0}
                      max={customEnd - 3}
                      value={customStart}
                      onChange={(e) => setCustomStart(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">종료 시점 (초)</label>
                    <input
                      type="number"
                      min={customStart + 3}
                      max={Math.floor(analysis.totalDuration || 600)}
                      value={customEnd}
                      onChange={(e) => setCustomEnd(Math.max(customStart + 3, parseInt(e.target.value) || (customStart + 15)))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Audio Control & BGM (Core Requirement) */}
          <div className="border-t border-slate-100 pt-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <VolumeX className="w-4 h-4 text-pink-600" />
                  <span>기존 음성 제거 및 오디오 사운드 디자인</span>
                </h3>
                <p className="text-xs text-slate-500">
                  원본 영상의 불필요한 목소리/잡음을 제거하고 쇼츠 전용 BGM을 입힐지 선택하세요.
                </p>
              </div>

              {/* Remove Original Audio Toggle Switch */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-extrabold text-slate-700">
                  {removeOriginalAudio ? (
                    <span className="text-pink-600 flex items-center gap-1">
                      <VolumeX className="w-3.5 h-3.5" />
                      기존 음성 완전 제거 (음소거)
                    </span>
                  ) : (
                    <span className="text-emerald-600 flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5" />
                      기존 음성 유지
                    </span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => setRemoveOriginalAudio(!removeOriginalAudio)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none ${
                    removeOriginalAudio ? 'bg-pink-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                      removeOriginalAudio ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* BGM Selection Cards */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-indigo-600" />
                  <span>새로운 쇼츠 배경음악 (100% 로열티 프리 음원)</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-500">BGM 볼륨:</span>
                  <input
                    type="range"
                    min="0.05"
                    max="0.9"
                    step="0.05"
                    value={bgmVolume}
                    onChange={(e) => setBgmVolume(parseFloat(e.target.value))}
                    className="w-24 accent-indigo-600"
                  />
                  <span className="text-xs font-mono font-bold text-indigo-600 w-8">
                    {Math.round(bgmVolume * 100)}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                {bgmList.map((bgm) => {
                  const isSelected = selectedBgm === bgm.id;
                  const isPlaying = playingBgm === bgm.id;
                  return (
                    <div
                      key={bgm.id}
                      onClick={() => setSelectedBgm(bgm.id)}
                      className={`p-3 rounded-2xl border text-center cursor-pointer transition-all relative ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="text-lg mb-1">{bgm.icon}</div>
                      <h5 className="text-[11px] font-black text-slate-800 truncate">{bgm.name.split(' ')[1] || bgm.name}</h5>
                      <p className="text-[9px] text-slate-400 truncate">{bgm.mood}</p>

                      {bgm.id !== 'none' && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleBgmAudio(bgm.id);
                          }}
                          className={`mt-2 w-full py-1 rounded-xl text-[10px] font-black flex items-center justify-center gap-1 transition-colors ${
                            isPlaying
                              ? 'bg-pink-600 text-white'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                          <span>{isPlaying ? '정지' : '듣기'}</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SFX Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-extrabold text-slate-800">
                  🔔 인트로 3초 후킹 우쉬(Whoosh) & 효과음 자동 삽입
                </span>
              </div>
              <input
                type="checkbox"
                checked={enableSfx}
                onChange={(e) => setEnableSfx(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Step 4: Visual & Title Layout */}
          <div className="border-t border-slate-100 pt-6 space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <span>화면 연출 및 상단 타이틀 배너</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Crop Mode Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700">9:16 모바일 화면 맞춤 모드</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCropMode('smart_crop')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      cropMode === 'smart_crop'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-extrabold shadow-sm'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-black">📱 스마트 센터 크롭</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">화면을 꽉 채우는 세로 9:16 풀스크린</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCropMode('blur_padding')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      cropMode === 'blur_padding'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-extrabold shadow-sm'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-black">🎨 상하 블러 패딩</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">가로 비율 보존 + 위아래 블러 채움</div>
                  </button>
                </div>
              </div>

              {/* Title Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700">쇼츠 영상 제목 (상단 자막 표시)</label>
                <input
                  type="text"
                  value={shortsTitle}
                  onChange={(e) => setShortsTitle(e.target.value)}
                  placeholder="예: 3초 만에 몰입되는 충격 비하인드"
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-900"
                />
              </div>
            </div>

            {/* Title Style Presets */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-700">상단 타이틀 배너 스타일</label>
              <div className="flex flex-wrap gap-2">
                {titleStyles.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setTitleStyleId(style.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
                      titleStyleId === style.id
                        ? 'border-indigo-600 ring-2 ring-indigo-200 scale-105 shadow-sm'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    } ${style.color}`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error Feedback */}
          {renderError && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{renderError}</span>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={handleRenderShorts}
              disabled={isRendering}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-black text-sm shadow-xl shadow-indigo-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isRendering ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>9:16 쇼츠 변환 렌더링 중... (잠시만 기다려주세요)</span>
                </>
              ) : (
                <>
                  <Film className="w-5 h-5" />
                  <span>🎬 9:16 쇼츠로 변환 제작 시작</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Render Result Card */}
      {renderResult && renderResult.videoUrl && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-emerald-200 shadow-xl space-y-5 animate-in zoom-in-95 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">쇼츠 영상 변환 제작 완료! 🎉</h3>
              <p className="text-xs text-slate-500">
                {removeOriginalAudio ? '기존 음성이 제거되고 새로운 쇼츠 음향으로' : '원본 음성이 보존된 상태로'} 9:16 세로 쇼츠가 성공적으로 생성되었습니다.
              </p>
            </div>
          </div>

          {/* Inline Video Player Preview */}
          <div className="flex justify-center bg-slate-950 rounded-2xl p-4 overflow-hidden">
            <video
              src={renderResult.videoUrl}
              controls
              autoPlay
              className="max-h-[480px] rounded-xl shadow-2xl aspect-[9/16]"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <span className="text-xs font-mono text-slate-500 truncate max-w-md">
              저장 위치: {renderResult.videoPath}
            </span>
            <div className="flex items-center gap-2">
              {onNavigate && (
                <button
                  onClick={() => onNavigate('projects')}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black transition-colors"
                >
                  보관함에서 확인
                </button>
              )}
              {onNavigate && (
                <button
                  onClick={() => onNavigate('publish')}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>4대 SNS로 바로 발행하기</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
