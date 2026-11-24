import React, { useState } from 'react';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { X, Sparkles, Folder, Check, Save, Key, MessageSquare, Share2, Activity } from 'lucide-react';
import type { AppSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  onSelectOutputDirectory: () => Promise<string | null>;
  onNavigateToPublish?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onSelectOutputDirectory,
  onNavigateToPublish,
}) => {
  useEscapeKey(isOpen, onClose);
  if (!isOpen) return null;

  const [geminiApiKey, setGeminiApiKey] = useState(settings.geminiApiKey || '');
  const [openaiApiKey, setOpenaiApiKey] = useState(settings.openaiApiKey || '');
  const [falApiKey, setFalApiKey] = useState(settings.falApiKey || '');
  const [stabilityApiKey, setStabilityApiKey] = useState(settings.stabilityApiKey || '');
  const [pexelsApiKey, setPexelsApiKey] = useState(settings.pexelsApiKey || '');
  const [pixabayApiKey, setPixabayApiKey] = useState(settings.pixabayApiKey || '');
  const [youtubeClientId, setYoutubeClientId] = useState(settings.youtubeClientId || '');
  const [youtubeClientSecret, setYoutubeClientSecret] = useState(settings.youtubeClientSecret || '');
  const [youtubeRefreshToken, setYoutubeRefreshToken] = useState(settings.youtubeRefreshToken || '');
  const [youtubeAutoUpload, setYoutubeAutoUpload] = useState<boolean>(settings.youtubeAutoUpload || false);
  const [youtubeAutoComment, setYoutubeAutoComment] = useState<boolean>(settings.youtubeAutoComment || false);
  const [youtubeCommentText, setYoutubeCommentText] = useState<string>(settings.youtubeCommentText || '');
  const [imageEngine, setImageEngine] = useState<'pollinations' | 'openai' | 'fal' | 'stability' | 'pexels' | 'pixabay' | 'gemini' | 'codex'>(
    settings.imageEngine || 'pollinations'
  );
  const [outputDir, setOutputDir] = useState(settings.outputDirectory || '');
  const [saved, setSaved] = useState(false);

  const [isTestingPexels, setIsTestingPexels] = useState(false);
  const [pexelsTestResult, setPexelsTestResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);

  const [isTestingPixabay, setIsTestingPixabay] = useState(false);
  const [pixabayTestResult, setPixabayTestResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);

  const handleTestPexels = async () => {
    if (!pexelsApiKey.trim()) {
      setPexelsTestResult({ success: false, error: 'Pexels API 키를 입력해주세요.' });
      return;
    }
    setIsTestingPexels(true);
    setPexelsTestResult(null);
    try {
      const res = await window.electronAPI.testPexelsConnection({ apiKey: pexelsApiKey.trim() });
      setPexelsTestResult(res);
    } catch (err: any) {
      setPexelsTestResult({ success: false, error: err?.message || 'Pexels 연결 실패' });
    } finally {
      setIsTestingPexels(false);
    }
  };

  const handleTestPixabay = async () => {
    if (!pixabayApiKey.trim()) {
      setPixabayTestResult({ success: false, error: 'Pixabay API 키를 입력해주세요.' });
      return;
    }
    setIsTestingPixabay(true);
    setPixabayTestResult(null);
    try {
      const res = await window.electronAPI.testPixabayConnection({ apiKey: pixabayApiKey.trim() });
      setPixabayTestResult(res);
    } catch (err: any) {
      setPixabayTestResult({ success: false, error: err?.message || 'Pixabay 연결 실패' });
    } finally {
      setIsTestingPixabay(false);
    }
  };

  const handleSave = () => {
    onSaveSettings({
      ...settings,
      geminiApiKey: geminiApiKey.trim() || undefined,
      openaiApiKey: openaiApiKey.trim() || undefined,
      falApiKey: falApiKey.trim() || undefined,
      stabilityApiKey: stabilityApiKey.trim() || undefined,
      pexelsApiKey: pexelsApiKey.trim() || undefined,
      pixabayApiKey: pixabayApiKey.trim() || undefined,
      youtubeClientId: youtubeClientId.trim() || undefined,
      youtubeClientSecret: youtubeClientSecret.trim() || undefined,
      youtubeRefreshToken: youtubeRefreshToken.trim() || undefined,
      youtubeAutoUpload,
      youtubeAutoComment,
      youtubeCommentText: youtubeCommentText.trim() || undefined,
      imageEngine,
      outputDirectory: outputDir.trim() || undefined,
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  const handleChooseFolder = async () => {
    const chosen = await onSelectOutputDirectory();
    if (chosen) setOutputDir(chosen);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between sticky top-0 bg-gray-900 pb-2 border-b border-gray-800 z-10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-950 text-sky-400 border border-sky-800/60">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-100">AI 및 미디어 API 설정</h3>
              <span className="text-xs text-gray-400">대본 생성(LLM) 및 무료/유료 이미지·영상 API 관리</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* 1. Google Gemini API Key */}
          <div className="space-y-1.5 bg-gray-950/60 p-3.5 rounded-xl border border-sky-900/40">
            <label className="font-semibold text-sky-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>1. Google Gemini API 키 (대본 생성 1순위 / 무료 발급)</span>
              </span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-sky-400 hover:underline"
              >
                무료 키 발급 ↗
              </a>
            </label>
            <input
              type="password"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              placeholder="AIzaSy... (Google AI Studio Gemini 키)"
              className="w-full bg-gray-950 border border-sky-900/60 rounded-xl px-3.5 py-2.5 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Google AI Studio에서 무료 발급받은 키를 넣으면 최신 Gemini 모델로 50~60초 대본 작성 및 고품질 Imagen AI 이미지를 직접 생성할 수 있습니다.
            </p>
          </div>

          {/* 2. Free Stock Video & Image APIs (Pexels / Pixabay) */}
          <div className="space-y-3 bg-gray-950/60 p-3.5 rounded-xl border border-emerald-900/40">
            <div className="font-semibold text-emerald-300 flex items-center justify-between">
              <span>2. 무료 스톡 비디오 & 이미지 API (Pexels / Pixabay)</span>
              <span className="text-[10px] text-emerald-400 font-normal">100% 무료 발급 & 무제한 다운로드</span>
            </div>
            
            {/* Pexels API Key */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-gray-300">
                <label className="font-medium text-emerald-200">Pexels API 키 (고화질 세로 영상 & 사진 무료)</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTestPexels}
                    disabled={isTestingPexels || !pexelsApiKey.trim()}
                    className="text-[10px] text-emerald-400 hover:text-emerald-300 hover:underline disabled:opacity-40 flex items-center gap-1 font-bold"
                  >
                    <Activity className="w-2.5 h-2.5" />
                    <span>{isTestingPexels ? '확인 중...' : '연결 테스트'}</span>
                  </button>
                  <a
                    href="https://www.pexels.com/api/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-emerald-400 hover:underline"
                  >
                    pexels.com/api 발급 ↗
                  </a>
                </div>
              </div>
              <input
                type="password"
                value={pexelsApiKey}
                onChange={(e) => setPexelsApiKey(e.target.value)}
                placeholder="Pexels 무료 API 키..."
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2 text-xs text-gray-100 placeholder-gray-600 focus:outline-none focus:border-emerald-500"
              />
              {pexelsTestResult && (
                <p className={`text-[10px] font-bold ${pexelsTestResult.success ? 'text-emerald-400' : 'text-red-400'}`}>
                  {pexelsTestResult.success ? pexelsTestResult.message : `오류: ${pexelsTestResult.error}`}
                </p>
              )}
            </div>

            {/* Pixabay API Key */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-gray-300">
                <label className="font-medium text-emerald-200">Pixabay API 키 (무료 영상 & 이미지)</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTestPixabay}
                    disabled={isTestingPixabay || !pixabayApiKey.trim()}
                    className="text-[10px] text-emerald-400 hover:text-emerald-300 hover:underline disabled:opacity-40 flex items-center gap-1 font-bold"
                  >
                    <Activity className="w-2.5 h-2.5" />
                    <span>{isTestingPixabay ? '확인 중...' : '연결 테스트'}</span>
                  </button>
                  <a
                    href="https://pixabay.com/api/docs/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-emerald-400 hover:underline"
                  >
                    pixabay.com/api 발급 ↗
                  </a>
                </div>
              </div>
              <input
                type="password"
                value={pixabayApiKey}
                onChange={(e) => setPixabayApiKey(e.target.value)}
                placeholder="Pixabay 무료 API 키..."
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2 text-xs text-gray-100 placeholder-gray-600 focus:outline-none focus:border-emerald-500"
              />
              {pixabayTestResult && (
                <p className={`text-[10px] font-bold ${pixabayTestResult.success ? 'text-emerald-400' : 'text-red-400'}`}>
                  {pixabayTestResult.success ? pixabayTestResult.message : `오류: ${pixabayTestResult.error}`}
                </p>
              )}
            </div>
          </div>

          {/* 3. AI Image & Video Engine Selector */}
          <div className="space-y-1.5 bg-gray-950/60 p-3.5 rounded-xl border border-purple-900/40">
            <label className="font-semibold text-purple-300 flex items-center gap-1.5">
              <span>3. 쇼츠 비주얼/이미지/영상 엔진 선택</span>
            </label>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {[
                { id: 'gemini', name: 'Google Gemini (Imagen 3)', desc: 'Gemini API 키 이용 (최신 AI 이미지)' },
                { id: 'pexels', name: 'Pexels 실사 미디어 (비디오 & 사진)', desc: '9:16 실사 세로 비디오 우선 매칭 (비디오 없을 시 사진 폴백)' },
                { id: 'pixabay', name: 'Pixabay 무료 미디어', desc: '무료 스톡 비디오 & 이미지' },
                { id: 'pollinations', name: 'Pollinations AI (무료)', desc: 'FLUX 기반 고화질 AI 생성 (키 불필요)' },
                { id: 'openai', name: 'OpenAI DALL-E 3', desc: 'OpenAI API 키 필요' },
                { id: 'fal', name: 'Fal.ai (Flux Pro)', desc: 'Fal API 키 필요' },
                { id: 'stability', name: 'Stability AI (SD3)', desc: 'Stability API 키 필요' },
              ].map((eng) => (
                <button
                  key={eng.id}
                  type="button"
                  onClick={() => setImageEngine(eng.id as any)}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    imageEngine === eng.id
                      ? 'bg-purple-950/50 border-purple-500 text-purple-200 ring-1 ring-purple-500'
                      : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-gray-200 hover:border-gray-700'
                  }`}
                >
                  <div className="font-semibold text-xs text-white">{eng.name}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{eng.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 4. YouTube API & Auto-Upload Settings */}
          <div className="space-y-3 bg-gray-950/60 p-3.5 rounded-xl border border-red-900/40">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-red-300 flex items-center gap-1.5">
                <span>4. 유튜브 (YouTube) 자동 업로드 API 설정</span>
              </label>
              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-red-400 hover:underline"
              >
                Google Cloud 콘솔 ↗
              </a>
            </div>
            
            <div className="space-y-2">
              <div>
                <label className="font-medium text-gray-300 text-[11px]">YouTube OAuth Client ID</label>
                <input
                  type="text"
                  value={youtubeClientId}
                  onChange={(e) => setYoutubeClientId(e.target.value)}
                  placeholder="xxxxx.apps.googleusercontent.com"
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-1.5 text-xs text-gray-100 placeholder-gray-600 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="font-medium text-gray-300 text-[11px]">YouTube OAuth Client Secret</label>
                <input
                  type="password"
                  value={youtubeClientSecret}
                  onChange={(e) => setYoutubeClientSecret(e.target.value)}
                  placeholder="GOCSPX-xxxx..."
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-1.5 text-xs text-gray-100 placeholder-gray-600 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="font-medium text-gray-300 text-[11px]">YouTube OAuth Refresh Token</label>
                <input
                  type="password"
                  value={youtubeRefreshToken}
                  onChange={(e) => setYoutubeRefreshToken(e.target.value)}
                  placeholder="1//04xxxx..."
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-1.5 text-xs text-gray-100 placeholder-gray-600 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between bg-red-950/30 p-2.5 rounded-xl border border-red-800/40">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-red-200">쇼츠 영상 렌더링 완료 시 자동 업로드</div>
                <div className="text-[10px] text-gray-400">쇼츠 제작이 끝나면 별도 클릭 없이 즉시 유튜브에 자동 업로드합니다.</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={youtubeAutoUpload}
                  onChange={(e) => setYoutubeAutoUpload(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>

            {/* Auto Comment Option */}
            <div className="space-y-2 bg-blue-950/20 p-2.5 rounded-xl border border-blue-900/30">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-blue-200 flex items-center gap-1.5">
                    <MessageSquare className="w-3 h-3 text-blue-400" />
                    <span>첫 댓글 자동 등록</span>
                  </div>
                  <div className="text-[10px] text-gray-400">업로드 직후 원하는 문구/링크를 첫 댓글로 자동 등록합니다.</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={youtubeAutoComment}
                    onChange={(e) => setYoutubeAutoComment(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div>
                <label className="font-medium text-gray-300 text-[11px]">자동 댓글 문구 (고정/링크용)</label>
                <textarea
                  value={youtubeCommentText}
                  onChange={(e) => setYoutubeCommentText(e.target.value)}
                  rows={2}
                  placeholder="예: 📌 더 많은 꿀팁과 상세 정보는 프로필 링크를 확인하세요!"
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-1.5 text-xs text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500 resize-y"
                />
              </div>
            </div>

            <p className="text-[10px] text-gray-400 leading-relaxed">
              Google Cloud 콘솔에서 YouTube Data API v3를 사용 설정하고 발급받은 OAuth 토큰을 입력하면, 영상 제작 완료 즉시 유튜브 쇼츠로 원클릭 또는 전자동으로 업로드 및 댓글이 등록됩니다.
            </p>
            <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-2.5 text-[10px] text-amber-300 leading-relaxed">
              💡 <strong>첫 댓글 자동 등록 필수 권한 (Scope) 안내:</strong><br />
              구글 OAuth 권한 요청 시 <code className="bg-black/40 px-1 py-0.5 rounded text-amber-200">https://www.googleapis.com/auth/youtube.upload</code> 외에 반드시 <code className="bg-black/40 px-1 py-0.5 rounded text-amber-200">https://www.googleapis.com/auth/youtube.force-ssl</code> 권한(Scope)이 포함되어야 댓글이 정상 게시됩니다.
            </div>

            {/* Link to Dedicated Multi-Platform Publishing Tab */}
            {onNavigateToPublish && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToPublish();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-pink-900/40 border border-blue-500/40 hover:border-blue-400 text-white text-xs font-bold transition-all shadow-md group"
              >
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
                  <span>유튜브 댓글 상세설정 & 4대 SNS(인스타·틱톡·클립) 연동 메뉴로 이동</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-300 group-hover:bg-blue-500 group-hover:text-white font-bold transition-colors">
                  바로가기 ➔
                </span>
              </button>
            )}
          </div>

          {/* Output Directory */}
          <div className="space-y-1.5 bg-gray-950/60 p-3.5 rounded-xl border border-gray-800/80">
            <label className="font-semibold text-gray-300">쇼츠 영상 저장 경로</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={outputDir}
                readOnly
                placeholder="기본 앱 데이터 폴더"
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2 text-xs text-gray-300 font-mono truncate focus:outline-none"
              />
              <button
                onClick={handleChooseFolder}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white border border-gray-700 shrink-0 font-medium"
              >
                <Folder className="w-3.5 h-3.5" />
                <span>폴더 변경</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end gap-2 pt-2 border-t border-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-sky-950/50 transition-all"
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saved ? '저장됨' : '설정 저장'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
