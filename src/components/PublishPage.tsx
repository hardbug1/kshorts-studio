import React, { useState } from 'react';
import {
  Share2,
  ExternalLink,
  Check,
  Save,
  Video,
  MessageSquare,
  Sparkles,
  AlertCircle,
  Send,
  RefreshCw,
  FolderSync,
  Info,
  Link as LinkIcon,
  Tag,
  Plus,
  Trash2,
  ShoppingBag,
  UploadCloud,
} from 'lucide-react';
import type { AppSettings, AffiliateLinkItem } from '../types';
import { PORTAL_KO } from '../constants/portal';

const InstagramIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

interface PublishPageProps {
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
}

type PlatformTab = 'youtube' | 'monetization' | 'instagram' | 'tiktok' | 'naver' | 'telegram' | 'multi';

export const PublishPage: React.FC<PublishPageProps> = ({ settings, onSaveSettings }) => {
  const [activeTab, setActiveTab] = useState<PlatformTab>('youtube');

  // Monetization & Affiliate Links Settings
  const [enableAffiliateLinks, setEnableAffiliateLinks] = useState<boolean>(settings.enableAffiliateLinks ?? true);
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLinkItem[]>(settings.affiliateLinks || []);
  const [affiliateDisclaimer, setAffiliateDisclaimer] = useState<string>(
    settings.affiliateDisclaimer || '※ 이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.'
  );

  // New Affiliate Link Input Form
  const [newKeyword, setNewKeyword] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newIsDefault, setNewIsDefault] = useState(false);

  // YouTube Settings
  const [youtubeClientId, setYoutubeClientId] = useState(settings.youtubeClientId || '');
  const [youtubeClientSecret, setYoutubeClientSecret] = useState(settings.youtubeClientSecret || '');
  const [youtubeRefreshToken, setYoutubeRefreshToken] = useState(settings.youtubeRefreshToken || '');
  const [youtubeAutoUpload, setYoutubeAutoUpload] = useState<boolean>(settings.youtubeAutoUpload || false);
  const [youtubeAutoComment, setYoutubeAutoComment] = useState<boolean>(settings.youtubeAutoComment ?? true);
  const [youtubeCommentMode, setYoutubeCommentMode] = useState<'custom' | 'ai_smart'>(settings.youtubeCommentMode || 'custom');
  const [youtubeCommentText, setYoutubeCommentText] = useState<string>(
    settings.youtubeCommentText || '📌 영상 속 상세 정보 및 추천 링크 👉 https://...\n구독과 좋아요는 다음 영상 제작에 큰 힘이 됩니다! 궁금한 점은 댓글로 남겨주세요 ✨'
  );

  // Instagram Settings
  const [instagramAccessToken, setInstagramAccessToken] = useState(settings.instagramAccessToken || '');
  const [instagramAccountId, setInstagramAccountId] = useState(settings.instagramAccountId || '');
  const [instagramAutoUpload, setInstagramAutoUpload] = useState<boolean>(settings.instagramAutoUpload || false);
  const [instagramDefaultTags, setInstagramDefaultTags] = useState(
    settings.instagramDefaultTags || '#릴스 #추천 #일상 #꿀팁 #쇼츠 #foryou #reels'
  );
  const [instagramAutoComment, setInstagramAutoComment] = useState<boolean>(settings.instagramAutoComment || false);
  const [instagramCommentText, setInstagramCommentText] = useState(
    settings.instagramCommentText || '💡 더 많은 꿀팁과 정보는 프로필 링크에서 확인하세요! 팔로우 & 저장은 필수 ❤️'
  );

  // TikTok Settings
  const [tiktokClientKey, setTiktokClientKey] = useState(settings.tiktokClientKey || '');
  const [tiktokClientSecret, setTiktokClientSecret] = useState(settings.tiktokClientSecret || '');
  const [tiktokAccessToken, setTiktokAccessToken] = useState(settings.tiktokAccessToken || '');
  const [tiktokAutoUpload, setTiktokAutoUpload] = useState<boolean>(settings.tiktokAutoUpload || false);
  const [tiktokDefaultTags, setTiktokDefaultTags] = useState(
    settings.tiktokDefaultTags || '#fyp #추천 #쇼츠 #viral #tiktokkorea #꿀팁'
  );

  // Naver Clip Settings
  const [naverClientId, setNaverClientId] = useState(settings.naverClientId || '');
  const [naverClientSecret, setNaverClientSecret] = useState(settings.naverClientSecret || '');
  const [naverClipChannelId, setNaverClipChannelId] = useState(settings.naverClipChannelId || '');
  const [naverAutoUpload, setNaverAutoUpload] = useState<boolean>(settings.naverAutoUpload ?? true);
  const [naverDefaultTags, setNaverDefaultTags] = useState(
    settings.naverDefaultTags || ('#클립 #' + PORTAL_KO + '클립 #정보 #꿀팁 #일상')
  );
  const [naverBlogLink, setNaverBlogLink] = useState(
    settings.naverBlogLink || ''
  );

  // Telegram Settings
  const [telegramBotToken, setTelegramBotToken] = useState(settings.telegramBotToken || '');
  const [telegramChatId, setTelegramChatId] = useState(settings.telegramChatId || '');
  const [enableTelegramNotify, setEnableTelegramNotify] = useState<boolean>(settings.enableTelegramNotify ?? true);

  // Test states
  const [isTestingYoutube, setIsTestingYoutube] = useState(false);
  const [youtubeTestResult, setYoutubeTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const [isTestingInstagram, setIsTestingInstagram] = useState(false);
  const [instagramTestResult, setInstagramTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const [isTestingTiktok, setIsTestingTiktok] = useState(false);
  const [tiktokTestResult, setTiktokTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const [isTestingNaver, setIsTestingNaver] = useState(false);
  const [naverTestResult, setNaverTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const [isTestingTelegram, setIsTestingTelegram] = useState(false);
  const [telegramTestResult, setTelegramTestResult] = useState<{ success: boolean; message: string } | null>(null);



  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSaveSettings({
      ...settings,
      // YouTube
      youtubeClientId: youtubeClientId.trim() || undefined,
      youtubeClientSecret: youtubeClientSecret.trim() || undefined,
      youtubeRefreshToken: youtubeRefreshToken.trim() || undefined,
      youtubeAutoUpload,
      youtubeAutoComment,
      youtubeCommentMode,
      youtubeCommentText: youtubeCommentText.trim() || undefined,
      // Instagram
      instagramAccessToken: instagramAccessToken.trim() || undefined,
      instagramAccountId: instagramAccountId.trim() || undefined,
      instagramAutoUpload,
      instagramDefaultTags: instagramDefaultTags.trim() || undefined,
      instagramAutoComment,
      instagramCommentText: instagramCommentText.trim() || undefined,
      // TikTok
      tiktokClientKey: tiktokClientKey.trim() || undefined,
      tiktokClientSecret: tiktokClientSecret.trim() || undefined,
      tiktokAccessToken: tiktokAccessToken.trim() || undefined,
      tiktokAutoUpload,
      tiktokDefaultTags: tiktokDefaultTags.trim() || undefined,
      // Naver Clip
      naverClientId: naverClientId.trim() || undefined,
      naverClientSecret: naverClientSecret.trim() || undefined,
      naverClipChannelId: naverClipChannelId.trim() || undefined,
      naverAutoUpload,
      naverDefaultTags: naverDefaultTags.trim() || undefined,
      naverBlogLink: naverBlogLink.trim() || undefined,
      // Telegram
      telegramBotToken: telegramBotToken.trim() || undefined,
      telegramChatId: telegramChatId.trim() || undefined,
      enableTelegramNotify,
      // Monetization
      enableAffiliateLinks,
      affiliateLinks,
      affiliateDisclaimer: affiliateDisclaimer.trim() || undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddAffiliateLink = () => {
    if (!newLabel.trim() || !newUrl.trim()) {
      alert('상품/링크 명칭과 URL을 모두 입력해주세요.');
      return;
    }
    if (!/^https?:\/\/\S+$/.test(newUrl.trim())) {
      alert('링크는 http:// 또는 https:// 로 시작하는 주소여야 합니다.');
      return;
    }
    const newItem: AffiliateLinkItem = {
      id: `aff_${Date.now()}`,
      keyword: newKeyword.trim() || '기본',
      label: newLabel.trim(),
      url: newUrl.trim(),
      isDefault: newIsDefault,
    };
    setAffiliateLinks((prev) => [...prev, newItem]);
    setNewKeyword('');
    setNewLabel('');
    setNewUrl('');
    setNewIsDefault(false);
  };

  const handleDeleteAffiliateLink = (id: string) => {
    setAffiliateLinks((prev) => prev.filter((item) => item.id !== id));
  };

  // Test YouTube
  const handleTestYoutube = async () => {
    if (!youtubeClientId || !youtubeClientSecret || !youtubeRefreshToken) {
      setYoutubeTestResult({
        success: false,
        message: 'YouTube Client ID, Client Secret, Refresh Token을 모두 입력한 후 테스트해주세요.',
      });
      return;
    }
    if (!navigator.onLine) {
      setYoutubeTestResult({
        success: false,
        message: '⚠️ 인터넷 연결이 끊겨 있습니다. Wi-Fi 또는 랜선 연결을 확인하신 후 다시 시도해주세요.',
      });
      return;
    }
    setIsTestingYoutube(true);
    setYoutubeTestResult(null);
    try {
      if (window.electronAPI?.testYoutubeConnection) {
        const res = await window.electronAPI.testYoutubeConnection({
          clientId: youtubeClientId.trim(),
          clientSecret: youtubeClientSecret.trim(),
          refreshToken: youtubeRefreshToken.trim(),
        });
        setYoutubeTestResult({
          success: res.success,
          message: res.message || res.error || (res.success ? '유튜브 채널 연동에 성공했습니다.' : '연동 실패'),
        });
      } else {
        setYoutubeTestResult({ success: false, message: '현재 환경에서 YouTube API 테스트를 호출할 수 없습니다.' });
      }
    } catch (err: any) {
      setYoutubeTestResult({ success: false, message: `테스트 오류: ${err?.message || err}` });
    } finally {
      setIsTestingYoutube(false);
    }
  };

  // Test Instagram
  const handleTestInstagram = async () => {
    if (!instagramAccountId || !instagramAccessToken) {
      setInstagramTestResult({
        success: false,
        message: 'Instagram Account ID와 Access Token을 입력해주세요.',
      });
      return;
    }
    setIsTestingInstagram(true);
    setInstagramTestResult(null);
    try {
      if (window.electronAPI?.testInstagramConnection) {
        const res = await window.electronAPI.testInstagramConnection({
          accountId: instagramAccountId.trim(),
          accessToken: instagramAccessToken.trim(),
        });
        setInstagramTestResult({
          success: res.success,
          message: res.message || res.error || (res.success ? '인스타그램 연동 성공' : '연동 실패'),
        });
      }
    } catch (err: any) {
      setInstagramTestResult({ success: false, message: `테스트 오류: ${err?.message || err}` });
    } finally {
      setIsTestingInstagram(false);
    }
  };

  // Test TikTok
  const handleTestTiktok = async () => {
    if (!tiktokAccessToken) {
      setTiktokTestResult({
        success: false,
        message: 'TikTok Access Token을 입력해주세요.',
      });
      return;
    }
    setIsTestingTiktok(true);
    setTiktokTestResult(null);
    try {
      if (window.electronAPI?.testTikTokConnection) {
        const res = await window.electronAPI.testTikTokConnection({
          clientKey: tiktokClientKey.trim() || undefined,
          accessToken: tiktokAccessToken.trim(),
        });
        setTiktokTestResult({
          success: res.success,
          message: res.message || res.error || (res.success ? '틱톡 연동 확인 완료' : '연동 실패'),
        });
      }
    } catch (err: any) {
      setTiktokTestResult({ success: false, message: `테스트 오류: ${err?.message || err}` });
    } finally {
      setIsTestingTiktok(false);
    }
  };

  // Test Naver Clip
  const handleTestNaver = async () => {
    setIsTestingNaver(true);
    setNaverTestResult(null);
    try {
      if (window.electronAPI?.testNaverClipConnection) {
        const res = await window.electronAPI.testNaverClipConnection({
          clientId: naverClientId.trim() || undefined,
          clientSecret: naverClientSecret.trim() || undefined,
          channelId: naverClipChannelId.trim() || undefined,
        });
        setNaverTestResult({
          success: res.success,
          message: res.message || (PORTAL_KO + ' 클립 창작자 연동 규격 확인 완료'),
        });
      }
    } catch (err: any) {
      setNaverTestResult({ success: false, message: `오류: ${err?.message || err}` });
    } finally {
      setIsTestingNaver(false);
    }
  };

  // Test Telegram
  const handleTestTelegram = async () => {
    if (!telegramBotToken || !telegramChatId) {
      setTelegramTestResult({ success: false, message: '텔레그램 봇 토큰과 채팅 ID를 모두 입력해주세요.' });
      return;
    }
    setIsTestingTelegram(true);
    setTelegramTestResult(null);
    try {
      if (window.electronAPI?.testTelegramNotification) {
        const res = await window.electronAPI.testTelegramNotification({
          botToken: telegramBotToken.trim(),
          chatId: telegramChatId.trim(),
        });
        if (res.success) {
          setTelegramTestResult({ success: true, message: '✅ 텔레그램으로 테스트 알림 메시지가 성공적으로 발송되었습니다! 스마트폰을 확인해보세요.' });
        } else {
          setTelegramTestResult({ success: false, message: `❌ 텔레그램 전송 실패: ${res.error || '봇 토큰이나 채팅 ID를 다시 확인해주세요.'}` });
        }
      }
    } catch (err: any) {
      setTelegramTestResult({ success: false, message: `전송 에러: ${err?.message || err}` });
    } finally {
      setIsTestingTelegram(false);
    }
  };

  // Preset insertion for YouTube comments
  const applyCommentPreset = (text: string) => {
    setYoutubeCommentText(text);
    setYoutubeCommentMode('custom');
    setYoutubeAutoComment(true);
  };

  // Status flags
  const isYoutubeConnected = Boolean(youtubeRefreshToken && youtubeClientId);
  const isInstagramConnected = Boolean(instagramAccessToken && instagramAccountId);
  const isTiktokConnected = Boolean(tiktokAccessToken);
  const isNaverConnected = Boolean(naverClipChannelId || naverClientId);
  const isTelegramConnected = Boolean(telegramBotToken && telegramChatId);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-500 via-pink-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-red-500/20">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span>유튜브 쇼츠 & 발행 연동 세팅</span>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-red-50 text-red-700 font-bold border border-red-200">
                쇼츠 전용 모드
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              유튜브 쇼츠 & 첫 댓글 자동화 API 연동에 집중 설정합니다. (인스타그램, 틱톡, {PORTAL_KO}클립, 제휴링크는 추후 지원 예정)
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95 shrink-0"
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{saved ? '전체 설정 저장 완료' : '설정 저장'}</span>
        </button>
      </div>

      {/* Platform Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
        {/* 1. YouTube */}
        <button
          onClick={() => setActiveTab('youtube')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'youtube'
              ? 'bg-red-600 text-white shadow-md shadow-red-600/30 font-extrabold'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>YouTube (쇼츠 & 첫 댓글)</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
            isYoutubeConnected
              ? activeTab === 'youtube' ? 'bg-white/30 text-white' : 'bg-emerald-100 text-emerald-700'
              : activeTab === 'youtube' ? 'bg-black/20 text-white' : 'bg-slate-100 text-slate-400'
          }`}>
            {isYoutubeConnected ? '연결됨' : '미연결'}
          </span>
        </button>

        {/* 2. Telegram (렌더링 완료 알림) */}
        <button
          onClick={() => setActiveTab('telegram')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'telegram'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30 font-extrabold'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>텔레그램 알림봇</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
            isTelegramConnected
              ? activeTab === 'telegram' ? 'bg-white/30 text-white' : 'bg-emerald-100 text-emerald-700'
              : activeTab === 'telegram' ? 'bg-black/20 text-white' : 'bg-slate-100 text-slate-400'
          }`}>
            {isTelegramConnected ? '연결됨' : '미연결'}
          </span>
        </button>

        {/* 수익화 제휴링크 */}
        <button
          onClick={() => setActiveTab('monetization')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
            activeTab === 'monetization' ? 'bg-amber-500 text-white border-amber-500 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-amber-300'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>수익화 제휴링크</span>
        </button>

        {/* [추후 활성화 예정] 인스타그램 릴스
        <button
          onClick={() => setActiveTab('instagram')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-400 border border-slate-200"
        >
          <InstagramIcon className="w-4 h-4" />
          <span>인스타그램 릴스 (예정)</span>
        </button>
        */}

        {/* [추후 활성화 예정] 틱톡 (TikTok)
        <button
          onClick={() => setActiveTab('tiktok')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-400 border border-slate-200"
        >
          <Share2 className="w-4 h-4" />
          <span>틱톡 (예정)</span>
        </button>
        */}

        {/* [추후 활성화 예정] N사 클립 (Clip)
        <button
          onClick={() => setActiveTab('naver')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-400 border border-slate-200"
        >
          <FolderSync className="w-4 h-4" />
          <span>N사 클립 (예정)</span>
        </button>
        */}

        {/* [추후 활성화 예정] 4대 플랫폼 원소스 패키지
        <button
          onClick={() => setActiveTab('multi')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-400 border border-slate-200"
        >
          <Layers className="w-4 h-4" />
          <span>4대 플랫폼 패키지 (예정)</span>
        </button>
        */}
      </div>

      {/* ========================================================================= */}
      {/* 1. YOUTUBE TAB */}
      {/* ========================================================================= */}
      {activeTab === 'youtube' && (
        <div className="space-y-6">
          {/* Connection Status Banner & Test Action */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-3.5 h-3.5 rounded-full shrink-0 ${isYoutubeConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
              <div>
                <p className="text-xs font-extrabold text-slate-900">
                  {isYoutubeConnected ? '유튜브(YouTube Data API v3) 연동 토큰이 등록되어 있습니다.' : '유튜브 API 토큰이 등록되지 않았습니다.'}
                </p>
                <span className="text-[11px] text-slate-500 font-medium">
                  {isYoutubeConnected
                    ? '쇼츠 제작 완료 시 원클릭 또는 전자동으로 채널 업로드 및 첫 댓글 자동 게시가 가능합니다.'
                    : '아래 4단계 간편 가이드에 따라 OAuth 2.0 토큰을 등록해주세요.'}
                </span>
              </div>
            </div>

            <button
              onClick={handleTestYoutube}
              disabled={isTestingYoutube || !youtubeRefreshToken || !youtubeClientId}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold shadow-xs transition-all active:scale-95 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTestingYoutube ? 'animate-spin' : ''}`} />
              <span>{isTestingYoutube ? '연동 점검 중...' : '유튜브 채널 & 댓글 권한 테스트'}</span>
            </button>
          </div>

          {/* YouTube Test Result Message */}
          {youtubeTestResult && (
            <div className={`p-4 rounded-2xl text-xs font-bold border whitespace-pre-line leading-relaxed ${
              youtubeTestResult.success
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200 shadow-xs'
                : 'bg-rose-50 text-rose-900 border-rose-200 shadow-xs'
            }`}>
              {youtubeTestResult.message}
            </div>
          )}

          {/* 1-1. YouTube OAuth Token & Credentials */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Video className="w-4 h-4 text-red-600" />
                <span>Google Cloud OAuth 2.0 인증 토큰 세팅</span>
              </h2>
              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-red-600 hover:text-red-700 font-bold hover:underline flex items-center gap-1"
              >
                <span>Google Cloud 콘솔</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Quick 1-Min Token Guide */}
            <div className="p-4 rounded-xl bg-blue-50/90 border border-blue-200 text-xs text-slate-700 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="font-extrabold text-blue-900 flex items-center gap-1.5 text-sm">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>1분 간편 토큰 발급 (OAuth Playground 가이드)</span>
                </div>
                <a
                  href="https://developers.google.com/oauthplayground"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center gap-1 transition-all shadow-xs"
                >
                  <span>OAuth Playground 열기</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                유튜브 쇼츠 업로드와 <strong>첫 댓글 자동 등록</strong>이 모두 정상 작동하려면 구글 토큰 발급 시 다음 2가지 Scope가 반드시 포함되어야 합니다:<br />
                • <code className="bg-white px-1.5 py-0.5 rounded border text-red-600 font-mono text-[10px]">https://www.googleapis.com/auth/youtube.upload</code> (비디오 업로드 필수)<br />
                • <code className="bg-white px-1.5 py-0.5 rounded border text-blue-600 font-mono text-[10px]">https://www.googleapis.com/auth/youtube.force-ssl</code> (첫 댓글/고정 댓글 작성 필수)
              </p>

              <div className="pt-2 border-t border-blue-200/80 text-[11px] text-slate-600 space-y-1">
                <div className="font-bold text-blue-900">💡 4단계 발급 순서:</div>
                <div className="space-y-1 pl-2 text-[11px] text-slate-600">
                  <p>1. <a href="https://developers.google.com/oauthplayground" target="_blank" rel="noreferrer" className="text-blue-600 font-bold underline">OAuth Playground</a> 우측 상단 ⚙️(설정) ➔ <b>Use your own OAuth credentials</b> 체크 ➔ Client ID, Secret 입력</p>
                  <p>2. 좌측 <b>Step 1</b>의 <b>YouTube Data API v3</b>에서 <span className="text-red-600 font-mono font-bold">youtube.upload</span>와 <span className="text-blue-600 font-mono font-bold">youtube.force-ssl</span> 2개 체크 ➔ <b>Authorize APIs</b> 클릭</p>
                  <p>3. 본인 유튜브 구글 계정으로 로그인 및 권한 허용 완료 ➔ 중앙 <b>Step 2</b>로 자동 이동</p>
                  <p>4. <b>Exchange authorization code for tokens</b> 파란 버튼 클릭 ➔ 화면에 나온 <b>Refresh token</b>을 복사하여 아래에 입력 후 [설정 저장]!</p>
                </div>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-3.5 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 flex items-center justify-between">
                  <span>YouTube OAuth Client ID</span>
                  <span className="text-[10px] text-slate-400 font-normal">Google Cloud의 OAuth 클라이언트 ID</span>
                </label>
                <input
                  type="text"
                  value={youtubeClientId}
                  onChange={(e) => setYoutubeClientId(e.target.value)}
                  placeholder="예: xxxxx.apps.googleusercontent.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-100 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">YouTube OAuth Client Secret</label>
                <input
                  type="password"
                  value={youtubeClientSecret}
                  onChange={(e) => setYoutubeClientSecret(e.target.value)}
                  placeholder="예: GOCSPX-xxxx..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-100 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 flex items-center justify-between">
                  <span>YouTube OAuth Refresh Token</span>
                  <span className="text-[10px] text-amber-600 font-bold">⚠️ 테스트 앱인 경우 7일 후 만료 가능</span>
                </label>
                <input
                  type="password"
                  value={youtubeRefreshToken}
                  onChange={(e) => setYoutubeRefreshToken(e.target.value)}
                  placeholder="예: 1//04xxxx..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-100 font-mono"
                />
              </div>

              {/* 7-day expiry note */}
              <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-200 text-[11px] text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>갑자기 자동 업로드가 멈췄다면? (구글 7일 만료 정책 해결법)</span>
                </div>
                <p className="text-slate-600 leading-relaxed pl-5">
                  Google Cloud Console의 [OAuth 동의 화면]이 <b>테스트(Testing)</b> 모드일 경우, 구글 보안 정책상 토큰 수명이 <b>정확히 7일</b>로 제한되어 만료됩니다.<br />
                  • <b>간편 해결:</b> 위 OAuth Playground에서 Refresh Token을 1분 만에 재발급받아 교체하세요.<br />
                  • <b>영구 해결:</b> <a href="https://console.cloud.google.com/apis/credentials/consent" target="_blank" rel="noreferrer" className="text-amber-800 font-bold underline">Google Cloud OAuth 동의 화면</a>에서 <b>[앱 게시 (Publish App)]</b>를 눌러 '프로덕션'으로 전환하면 토큰이 만료되지 않고 계속 유지됩니다.
                </p>
              </div>
            </div>

            {/* Auto Upload Switch */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="space-y-0.5">
                  <div className="text-xs font-extrabold text-slate-900">쇼츠 렌더링 완료 즉시 전자동 업로드</div>
                  <p className="text-[11px] text-slate-500 font-medium">비디오 제작이 끝나면 별도의 승인 클릭 없이 유튜브 쇼츠로 즉각 업로드합니다.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={youtubeAutoUpload}
                    onChange={(e) => setYoutubeAutoUpload(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* 1-2. 🌟 YouTube Comments Master Settings Card */}
          <div className="bg-white border-2 border-blue-400/70 rounded-2xl p-6 space-y-5 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-600 to-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl shadow-xs">
              알고리즘 참여율 폭발 핵심 설정
            </div>

            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span>유튜브 쇼츠 첫 댓글 & 고정 댓글 자동화 세팅</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  쇼츠가 유튜브에 업로드되자마자 내 채널 명의로 첫 댓글을 자동 등록하여 시청자의 댓글 참여를 유도하고 제휴 링크나 공지사항을 노출합니다.
                </p>
              </div>

              {/* Master Auto-Comment Toggle */}
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={youtubeAutoComment}
                  onChange={(e) => setYoutubeAutoComment(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 shadow-xs"></div>
              </label>
            </div>

            {youtubeAutoComment ? (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                {/* Comment Generation Mode Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">댓글 작성 모드 선택</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setYoutubeCommentMode('custom')}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        youtubeCommentMode === 'custom'
                          ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-100 text-blue-950 shadow-xs'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <div className="font-extrabold text-xs flex items-center gap-1.5">
                        <span>✍️ 사용자 지정 고정 댓글 (추천)</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        내가 등록한 멘트, 구매/상세 페이지 링크, 제휴 링크를 매 영상마다 첫 댓글로 고정 등록합니다.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setYoutubeCommentMode('ai_smart')}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        youtubeCommentMode === 'ai_smart'
                          ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-100 text-indigo-950 shadow-xs'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <div className="font-extrabold text-xs flex items-center gap-1.5">
                        <span>🤖 AI 스마트 소통 댓글 (자동 생성)</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        영상 내용과 대본을 분석하여 시청자가 댓글을 달고 싶게 만드는 후킹 질문을 AI가 매번 자동으로 작성합니다.
                      </p>
                    </button>
                  </div>
                </div>

                {/* Quick Presets for Custom Comment */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>원클릭 댓글 프리셋 템플릿</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium">클릭 시 아래 문구로 자동 입력됩니다</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        applyCommentPreset(
                          '📌 영상 속 제품 및 상세 정보 링크 👉 https://...\n구독과 좋아요는 큰 힘이 됩니다! 궁금한 점은 댓글로 남겨주세요 ✨'
                        )
                      }
                      className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 hover:border-blue-300 border border-slate-200 text-left text-[11px] font-bold text-slate-700 transition-all"
                    >
                      📌 링크/프로필 안내
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        applyCommentPreset(
                          '💬 여러분은 이 내용에 대해 어떻게 생각하시나요? 여러분만의 꿀팁이나 경험을 댓글로 자유롭게 공유해주세요! 👇'
                        )
                      }
                      className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 hover:border-blue-300 border border-slate-200 text-left text-[11px] font-bold text-slate-700 transition-all"
                    >
                      💬 질문 & 소통 유도
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        applyCommentPreset(
                          '🔥 [기간 한정] 본 영상 시청자 특별 혜택 링크는 프로필 및 댓글 링크를 확인하세요! 놓치지 마세요 🎁'
                        )
                      }
                      className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 hover:border-blue-300 border border-slate-200 text-left text-[11px] font-bold text-slate-700 transition-all"
                    >
                      🔥 이벤트/제휴 안내
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        applyCommentPreset(
                          '✨ 오늘도 시청해주셔서 진심으로 감사드립니다! 유익하셨다면 [구독 & 알림설정] 부탁드립니다 🙏'
                        )
                      }
                      className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 hover:border-blue-300 border border-slate-200 text-left text-[11px] font-bold text-slate-700 transition-all"
                    >
                      ✨ 감사 & 구독 유도
                    </button>
                  </div>
                </div>

                {/* Comment Text Area */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      {youtubeCommentMode === 'custom' ? '자동 등록할 댓글 본문' : 'AI 자동 댓글 생성 실패 시 기본 대체 문구'}
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {youtubeCommentText.length} 자
                    </span>
                  </div>

                  <textarea
                    value={youtubeCommentText}
                    onChange={(e) => setYoutubeCommentText(e.target.value)}
                    rows={4}
                    placeholder="예:\n📌 영상 속 제품 및 상세 정보 링크 👉 https://...\n구독과 좋아요는 큰 힘이 됩니다! 궁금한 점은 댓글로 남겨주세요."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-100 font-medium leading-relaxed resize-y"
                  />

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                    <span>💡 팁: 줄바꿈, 이모지, 링크가 모두 온전히 지원됩니다.</span>
                    <span className="text-blue-600 font-bold">
                      변수 지원: {'{title}'} (제목)
                    </span>
                  </div>
                </div>

                {/* Pin Comment Notice */}
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 space-y-1">
                  <div className="font-extrabold flex items-center gap-1.5">
                    <span>📌 유튜브 첫 댓글 상단 고정(Pin) 가이드</span>
                  </div>
                  <p className="leading-relaxed">
                    유튜브 API 정책 상 자동 업로드 직후 첫 댓글이 등록되면, 유튜브 모바일 앱 또는 유튜브 스튜디오에서 해당 댓글 우측의 <strong>점 3개(⋮) ➔ [고정(Pin)]</strong>을 1초 만에 눌러주시면 모든 시청자에게 최상단으로 항상 노출됩니다.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
                첫 댓글 자동 등록이 비활성화되어 있습니다. 우측 상단 토글을 켜면 쇼츠 영상 게시 직후 원하는 고정 댓글을 전자동으로 게시할 수 있습니다.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* [다음에 순차 활성화 예정] 1.5. 수익화 제휴링크 & 챕터 (쇼츠 집중 모드) */}
      {/* ========================================================================= */}
      {activeTab === 'monetization' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top Overview & Master Switches */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border border-amber-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <span>쇼츠 무인 수익화 & 쿠팡 파트너스 자동 연동</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold">
                      매출 극대화
                    </span>
                  </h2>
                  <p className="text-xs text-slate-600 font-medium">
                    영상 주제 키워드에 따라 맞춤형 상품 제휴 링크와 공정위 문구를 설명란 및 첫 댓글에 자동 기재합니다.
                  </p>
                </div>
              </div>

            </div>

            {/* Master Switch */}
            <div className="grid grid-cols-1 gap-3 pt-2">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-amber-200/80 shadow-xs">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-900">수익화 제휴 링크 자동 삽입</span>
                  <p className="text-[11px] text-slate-500">
                    영상 설명란 및 첫 고정 댓글에 주제 맞춤 추천 상품 링크와 안내를 자동 부착합니다.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-3">
                  <input
                    type="checkbox"
                    checked={enableAffiliateLinks}
                    onChange={(e) => setEnableAffiliateLinks(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Registered Affiliate Links List */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  <span>등록된 제휴 마케팅 링크 목록</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {affiliateLinks.length}개
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  영상 제목이나 대본에 해당 키워드가 포함되면 일치하는 링크가 우선 삽입되며, 일치하는 키워드가 없으면 [기본 링크]가 삽입됩니다.
                </p>
              </div>
            </div>

            {affiliateLinks.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
                아직 등록된 수익화 링크가 없습니다. 아래에서 쿠팡 파트너스 등 내 제휴 링크를 추가해보세요.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {affiliateLinks.map((link) => (
                  <div key={link.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {link.isDefault && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                            기본 링크 (상시 노출)
                          </span>
                        )}
                        <span className="text-xs font-extrabold text-slate-900">{link.label}</span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                          키워드: {link.keyword}
                        </span>
                      </div>
                      <p className="text-[11px] text-blue-600 font-mono truncate hover:underline">
                        {link.url}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteAffiliateLink(link.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0 self-end sm:self-center"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Affiliate Link Input Box */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-blue-600" />
                <span>새 수익화 제휴 링크 등록</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">매칭 키워드 (쉼표 구분)</label>
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="예: 주방, 냄비, 청소, 세제"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">상품/링크 명칭 (라벨)</label>
                  <input
                    type="text"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="예: 영상 속 만능 얼룩제거제 최저가"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">제휴 링크 URL</label>
                  <input
                    type="url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://link.coupang.com/..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 font-medium">
                  <input
                    type="checkbox"
                    checked={newIsDefault}
                    onChange={(e) => setNewIsDefault(e.target.checked)}
                    className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span>키워드가 일치하지 않을 때도 상시 기본으로 노출할 링크로 지정</span>
                </label>

                <button
                  type="button"
                  onClick={handleAddAffiliateLink}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>제휴 링크 추가하기</span>
                </button>
              </div>
            </div>
          </div>

          {/* Blog / Store Link */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2.5">
            <h3 className="text-xs font-extrabold text-slate-900">연계 블로그 / 스마트스토어 링크 (선택)</h3>
            <p className="text-[11px] text-slate-500">입력하면 제휴 링크 목록 아래에 함께 기재됩니다. 비워두면 넣지 않습니다.</p>
            <input
              type="url"
              value={naverBlogLink}
              onChange={(e) => setNaverBlogLink(e.target.value)}
              placeholder="예: https://blog.naver.com/my_id"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          {/* Legal Disclaimer Box */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2.5">
            <h3 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
              <span>공정위 필수 문구 (제휴 마케팅 법적 고지)</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-red-50 text-red-600 font-bold">필수 표기</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              쿠팡 파트너스 및 제휴 링크를 노출할 때 공정거래위원회 지침에 따라 설명란 하단에 자동 포함되는 문구입니다.
            </p>
            <textarea
              value={affiliateDisclaimer}
              onChange={(e) => setAffiliateDisclaimer(e.target.value)}
              rows={2}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* [다음에 순차 활성화 예정] 2. 인스타그램 릴스 (쇼츠 집중 모드) */}
      {/* ========================================================================= */}
      {/* @ts-ignore - 추후 순차 활성화 예정 */}
      {false && activeTab === 'instagram' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-3.5 h-3.5 rounded-full shrink-0 ${isInstagramConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
              <div>
                <p className="text-xs font-extrabold text-slate-900">
                  {isInstagramConnected ? '인스타그램 프로페셔널 계정이 연결되어 있습니다.' : '인스타그램 Meta Graph API가 등록되지 않았습니다.'}
                </p>
                <span className="text-[11px] text-slate-500 font-medium">
                  {isInstagramConnected
                    ? '인스타그램 릴스 9:16 모바일 최적화 및 첫 댓글 태그 자동화가 활성화되었습니다.'
                    : 'Meta for Developers에서 발급한 Instagram Graph API 토큰을 등록해주세요.'}
                </span>
              </div>
            </div>

            <button
              onClick={handleTestInstagram}
              disabled={isTestingInstagram || !instagramAccessToken || !instagramAccountId}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 disabled:opacity-40 text-white text-xs font-bold shadow-xs transition-all active:scale-95 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTestingInstagram ? 'animate-spin' : ''}`} />
              <span>{isTestingInstagram ? '연결 확인 중...' : '인스타그램 연동 상태 테스트'}</span>
            </button>
          </div>

          {instagramTestResult && (
            <div className={`p-4 rounded-2xl text-xs font-bold border whitespace-pre-line leading-relaxed ${
              instagramTestResult?.success
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200 shadow-xs'
                : 'bg-rose-50 text-rose-900 border-rose-200 shadow-xs'
            }`}>
              {instagramTestResult?.message}
            </div>
          )}

          {/* Instagram Settings Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <InstagramIcon className="w-4 h-4 text-pink-600" />
                <span>Meta Graph API (Instagram Professional) 설정</span>
              </h2>
              <a
                href="https://developers.facebook.com/apps"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-pink-600 hover:text-pink-700 font-bold hover:underline flex items-center gap-1"
              >
                <span>Meta for Developers 콘솔</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Guide */}
            <div className="p-4 rounded-xl bg-pink-50/70 border border-pink-200 text-xs text-slate-700 space-y-1.5">
              <div className="font-extrabold text-pink-900 flex items-center gap-1">
                <Info className="w-4 h-4 text-pink-600" />
                <span>인스타그램 릴스 연동 가이드 (3단계):</span>
              </div>
              <div className="space-y-1 text-[11px] text-slate-600 pl-2">
                <p>1. 내 인스타그램 계정을 <b>[프로페셔널(비즈니스 또는 크리에이터)]</b> 계정으로 무료 전환 후 페이스북 페이지와 연동</p>
                <p>2. <a href="https://developers.facebook.com/" target="_blank" rel="noreferrer" className="text-pink-600 underline font-bold">Meta for Developers</a>에서 앱을 생성하고 <b>Instagram Graph API</b>를 추가</p>
                <p>3. 그래프 API 탐색기에서 <code className="bg-white px-1 py-0.5 rounded text-pink-700 font-mono">instagram_basic, instagram_content_publish</code> 권한을 부여받아 생성된 토큰을 입력하세요.</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 flex items-center justify-between">
                  <span>Instagram Business Account ID</span>
                  <span className="text-[10px] text-slate-400">숫자 형태의 인스타그램 비즈니스 ID</span>
                </label>
                <input
                  type="text"
                  value={instagramAccountId}
                  onChange={(e) => setInstagramAccountId(e.target.value)}
                  placeholder="예: 17841400000000000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:bg-white focus:ring-1 focus:ring-pink-100 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 flex items-center justify-between">
                  <span>Instagram User Access Token (장기 토큰 권장)</span>
                  <span className="text-[10px] text-pink-600 font-bold">EAAG... 형태의 액세스 토큰</span>
                </label>
                <input
                  type="password"
                  value={instagramAccessToken}
                  onChange={(e) => setInstagramAccessToken(e.target.value)}
                  placeholder="예: EAAG..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:bg-white focus:ring-1 focus:ring-pink-100 font-mono"
                />
              </div>

              {/* Default Reels Tags */}
              <div className="space-y-1.5 pt-2">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-pink-600" />
                  <span>인스타그램 릴스 고정 해시태그 템플릿</span>
                </label>
                <input
                  type="text"
                  value={instagramDefaultTags}
                  onChange={(e) => setInstagramDefaultTags(e.target.value)}
                  placeholder="예: #릴스 #추천 #일상 #꿀팁 #쇼츠 #reels #foryou"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:bg-white font-medium"
                />
                <p className="text-[10px] text-slate-400">인스타그램 알고리즘 추천 탭(#릴스, #추천 등) 노출에 자동 반영됩니다.</p>
              </div>

              {/* Instagram Auto-Comment */}
              <div className="p-4 rounded-xl bg-pink-50/50 border border-pink-200 space-y-3 mt-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-extrabold text-pink-900 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-pink-600" />
                      <span>인스타그램 릴스 첫 댓글 자동 작성</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      릴스 본문을 깔끔하게 유지하고, 프로필 링크 유도 및 추가 해시태그를 첫 댓글에 자동으로 남깁니다.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={instagramAutoComment}
                      onChange={(e) => setInstagramAutoComment(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                  </label>
                </div>

                {instagramAutoComment && (
                  <textarea
                    value={instagramCommentText}
                    onChange={(e) => setInstagramCommentText(e.target.value)}
                    rows={2}
                    className="w-full bg-white border border-pink-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-pink-500 font-medium resize-y"
                    placeholder="예: 💡 더 많은 꿀팁과 정보는 프로필 링크에서 확인하세요! 팔로우 & 저장은 필수 ❤️"
                  />
                )}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* [다음에 순차 활성화 예정] 3. 틱톡 (쇼츠 집중 모드) */}
      {/* ========================================================================= */}
      {/* @ts-ignore - 추후 순차 활성화 예정 */}
      {false && activeTab === 'tiktok' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-3.5 h-3.5 rounded-full shrink-0 ${isTiktokConnected ? 'bg-cyan-500 animate-pulse' : 'bg-slate-300'}`} />
              <div>
                <p className="text-xs font-extrabold text-slate-900">
                  {isTiktokConnected ? '틱톡 (TikTok Content Posting API) 토큰이 설정되어 있습니다.' : '틱톡 API 토큰이 등록되지 않았습니다.'}
                </p>
                <span className="text-[11px] text-slate-500 font-medium">
                  {isTiktokConnected
                    ? '틱톡 #fyp 바이럴 해시태그 패키징 및 다이렉트 포스팅이 준비되었습니다.'
                    : 'TikTok for Developers에서 발급받은 API 키를 입력해주세요.'}
                </span>
              </div>
            </div>

            <button
              onClick={handleTestTiktok}
              disabled={isTestingTiktok || !tiktokAccessToken}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-cyan-300 border border-cyan-500/40 text-xs font-bold shadow-xs transition-all active:scale-95 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTestingTiktok ? 'animate-spin' : ''}`} />
              <span>{isTestingTiktok ? '연결 확인 중...' : '틱톡 연동 상태 테스트'}</span>
            </button>
          </div>

          {tiktokTestResult && (
            <div className={`p-4 rounded-2xl text-xs font-bold border whitespace-pre-line leading-relaxed ${
              tiktokTestResult?.success
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200 shadow-xs'
                : 'bg-rose-50 text-rose-900 border-rose-200 shadow-xs'
            }`}>
              {tiktokTestResult?.message}
            </div>
          )}

          {/* TikTok Settings Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-slate-900" />
                <span>TikTok for Developers API 설정</span>
              </h2>
              <a
                href="https://developers.tiktok.com/"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-slate-900 hover:text-cyan-600 font-bold hover:underline flex items-center gap-1"
              >
                <span>TikTok 개발자 센터</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-white text-xs space-y-1.5 border border-slate-800">
              <div className="font-extrabold text-cyan-400 flex items-center gap-1">
                <Info className="w-4 h-4 text-cyan-400" />
                <span>틱톡 Content Posting API 안내:</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                틱톡 개발자 센터에서 <b>Content Posting API</b> 권한을 활성화하면 생성된 쇼츠를 내 틱톡 계정의 [임시보관함(Inbox)] 또는 직접 비디오로 1초 만에 전송할 수 있습니다.
              </p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">TikTok Client Key (App ID)</label>
                <input
                  type="text"
                  value={tiktokClientKey}
                  onChange={(e) => setTiktokClientKey(e.target.value)}
                  placeholder="예: awxxxxxxxx..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800 focus:bg-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">TikTok Client Secret</label>
                <input
                  type="password"
                  value={tiktokClientSecret}
                  onChange={(e) => setTiktokClientSecret(e.target.value)}
                  placeholder="예: xxxxxxxx..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800 focus:bg-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">TikTok Access Token (User Access Token)</label>
                <input
                  type="password"
                  value={tiktokAccessToken}
                  onChange={(e) => setTiktokAccessToken(e.target.value)}
                  placeholder="예: act.xxxxxxxx..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800 focus:bg-white font-mono"
                />
              </div>

              {/* TikTok Viral Tags */}
              <div className="space-y-1.5 pt-2">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-cyan-600" />
                  <span>틱톡 기본 바이럴 태그 & 키워드</span>
                </label>
                <input
                  type="text"
                  value={tiktokDefaultTags}
                  onChange={(e) => setTiktokDefaultTags(e.target.value)}
                  placeholder="예: #fyp #추천 #쇼츠 #viral #tiktokkorea #꿀팁"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800 focus:bg-white font-medium"
                />
                <p className="text-[10px] text-slate-400">틱톡의 알고리즘 피드(#fyp, #foryoupage) 노출 최적화에 사용됩니다.</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* [다음에 순차 활성화 예정] 4. N사 클립 (쇼츠 집중 모드) */}
      {/* ========================================================================= */}
      {/* @ts-ignore - 추후 순차 활성화 예정 */}
      {false && activeTab === 'naver' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-3.5 h-3.5 rounded-full shrink-0 ${isNaverConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
              <div>
                <p className="text-xs font-extrabold text-slate-900">
                  {isNaverConnected ? (PORTAL_KO + ' 클립(Naver Clip) 창작자 세팅이 완료되었습니다.') : (PORTAL_KO + ' 클립 설정이 비어있습니다.')}
                </p>
                <span className="text-[11px] text-slate-500 font-medium">
                  {isNaverConnected
                    ? (PORTAL_KO + ' 앱 메인 클립 탭 및 블로그 숏폼 동시 노출 규격으로 완벽 패키징됩니다.')
                    : (PORTAL_KO + ' 창작자 센터 계정 정보 및 블로그 연동 링크를 설정해주세요.')}
                </span>
              </div>
            </div>

            <button
              onClick={handleTestNaver}
              disabled={isTestingNaver}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTestingNaver ? 'animate-spin' : ''}`} />
              <span>{isTestingNaver ? '규격 검증 중...' : (PORTAL_KO + ' 클립 설정 확인')}</span>
            </button>
          </div>

          {naverTestResult && (
            <div className="p-4 rounded-2xl text-xs font-bold border whitespace-pre-line leading-relaxed bg-emerald-50 text-emerald-900 border-emerald-200 shadow-xs">
              {naverTestResult?.message}
            </div>
          )}

          {/* Naver Clip Settings Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <FolderSync className="w-4 h-4 text-emerald-600" />
                <span>{PORTAL_KO} 클립(Naver Clip) & 블로그 연동 설정</span>
              </h2>
              <a
                href="https://creator.naver.com/"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-emerald-600 hover:text-emerald-700 font-bold hover:underline flex items-center gap-1"
              >
                <span>{PORTAL_KO} 창작자 센터 바로가기</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-slate-700 space-y-1.5">
              <div className="font-extrabold text-emerald-900 flex items-center gap-1">
                <Info className="w-4 h-4 text-emerald-600" />
                <span>{PORTAL_KO} 클립(Clip) 알고리즘 노출 포인트:</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {PORTAL_KO} 앱 메인의 <b>클립 탭</b>은 국내 트래픽 점유율 1위 {PORTAL_KO} 포털의 신규 창작자 우대 알고리즘을 탑재하고 있습니다. {PORTAL_KO} 블로그 ID 또는 스마트스토어 링크를 연동해두면 영상 하단 스티커 및 텍스트를 통해 강력한 트래픽 전환이 일어납니다.
              </p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 flex items-center justify-between">
                  <span>{PORTAL_KO} 클립 채널 ID 또는 {PORTAL_KO} 아이디(ID)</span>
                  <span className="text-[10px] text-slate-400">{PORTAL_KO} 창작자 센터 등록 계정</span>
                </label>
                <input
                  type="text"
                  value={naverClipChannelId}
                  onChange={(e) => setNaverClipChannelId(e.target.value)}
                  placeholder="예: my_naver_id 또는 clip_channel_01"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>연계 {PORTAL_KO} 블로그 / 스마트스토어 링크 템플릿</span>
                </label>
                <input
                  type="text"
                  value={naverBlogLink}
                  onChange={(e) => setNaverBlogLink(e.target.value)}
                  placeholder="예: https://blog.naver.com/my_id 또는 스마트스토어 URL"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
                />
                <p className="text-[10px] text-slate-400">클립 본문 및 상세 정보에 자동으로 삽입되어 유입을 극대화합니다.</p>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{PORTAL_KO} 클립 기본 카테고리 태그</span>
                </label>
                <input
                  type="text"
                  value={naverDefaultTags}
                  onChange={(e) => setNaverDefaultTags(e.target.value)}
                  placeholder={`예: #클립 #${PORTAL_KO}클립 #정보 #꿀팁 #일상`}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
                />
              </div>

              {/* Naver Developer Client ID & Secret (Optional) */}
              <div className="pt-2 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">{PORTAL_KO} 검색 API Client ID (선택)</label>
                  <input
                    type="text"
                    value={naverClientId}
                    onChange={(e) => setNaverClientId(e.target.value)}
                    placeholder="선택 사항"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">{PORTAL_KO} Client Secret (선택)</label>
                  <input
                    type="password"
                    value={naverClientSecret}
                    onChange={(e) => setNaverClientSecret(e.target.value)}
                    placeholder="선택 사항"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TELEGRAM TAB */}
      {/* ========================================================================= */}
      {activeTab === 'telegram' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <span>스마트폰 텔레그램(Telegram) 실시간 알림 봇</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 border border-sky-200">
                      무인 원격 관제
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    외출 중이거나 자고 있을 때도 오토파일럿이 영상을 유튜브에 올리면 내 폰으로 즉시 영상 링크와 첫 댓글을 전송합니다.
                  </p>
                </div>
              </div>
            </div>

            {/* Telegram Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">텔레그램 봇 토큰 (Bot Token)</label>
                  <input
                    type="password"
                    value={telegramBotToken}
                    onChange={(e) => setTelegramBotToken(e.target.value)}
                    placeholder="예: 1234567890:ABCdefGhIJKlmNoPQRstuVWxyz"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-100 font-mono"
                  />
                  <span className="text-[10px] text-slate-400">@BotFather에서 /newbot으로 1초 만에 무료 발급</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">내 텔레그램 채팅 ID (Chat ID)</label>
                  <input
                    type="text"
                    value={telegramChatId}
                    onChange={(e) => setTelegramChatId(e.target.value)}
                    placeholder="예: 123456789"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-100 font-mono"
                  />
                  <span className="text-[10px] text-slate-400">@userinfobot에 아무 메시지를 보내면 확인 가능</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableTelegramNotify}
                    onChange={(e) => setEnableTelegramNotify(e.target.checked)}
                    className="w-4 h-4 text-sky-600 rounded accent-sky-600 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-700">
                    오토파일럿 영상 발행 완료 시 스마트폰으로 즉시 푸시 알림 수신
                  </span>
                </label>

                <button
                  type="button"
                  onClick={handleTestTelegram}
                  disabled={isTestingTelegram || !telegramBotToken || !telegramChatId}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTestingTelegram ? 'animate-spin' : ''}`} />
                  <span>{isTestingTelegram ? '테스트 전송 중...' : '🔔 텔레그램 테스트 알림 보내기'}</span>
                </button>
              </div>

              {telegramTestResult && (
                <div className={`p-3 rounded-xl text-xs font-bold ${telegramTestResult.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                  {telegramTestResult.message}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* [다음에 순차 활성화 예정] 6. 4대 플랫폼 동시 발행 패키지 (쇼츠 집중 모드) */}
      {/* ========================================================================= */}
      {/* @ts-ignore - 추후 순차 활성화 예정 */}
      {false && activeTab === 'multi' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-sm font-black text-sm">
                4in1
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <span>원소스 멀티유즈: 4대 플랫폼 동시 발행 작동 원리</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  1편의 영상으로 4대 알고리즘(유튜브 쇼츠, 인스타그램 릴스, 틱톡, {PORTAL_KO} 클립)을 동시 공략하는 가장 확실한 방법입니다.
                </p>
              </div>
            </div>

            {/* 4 Platforms Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              <div className="p-4 rounded-xl border border-red-200 bg-red-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-red-700">1. YouTube Shorts</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700">API 자동 업로드</span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                  OAuth 2.0 직접 연동을 통한 무인 전자동 업로드 및 첫 고정 댓글 즉각 등록
                </p>
              </div>

              <div className="p-4 rounded-xl border border-pink-200 bg-pink-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-pink-700">2. Instagram Reels</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-pink-100 text-pink-700">릴스 최적화</span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                  #릴스 #추천 해시태그 패키징 및 프로필 링크 유도 첫 댓글 동시 생성
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900 text-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-white">3. TikTok</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400">#fyp 알고리즘</span>
                </div>
                <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                  틱톡 바이럴 키워드 및 Content Posting API 연동을 통한 피드 직배포
                </p>
              </div>

              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-emerald-700">4. {PORTAL_KO} 클립</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">{PORTAL_KO} 메인</span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                  {PORTAL_KO} 포털 클립 탭 전용 규격 태그 및 블로그·스마트스토어 전환 링크 패키징
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900 space-y-2">
              <p className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>4대 플랫폼 동시 발행 패키지 사용 방법:</span>
              </p>
              <p className="text-[11px] text-slate-600 leading-relaxed pl-2">
                왼쪽 메뉴의 <strong>[작성글/영상 관리]</strong>에 들어가서 생성된 쇼츠 영상 우측의 <strong>[4대 플랫폼 동시 발행 패키지 내보내기]</strong> 버튼을 클릭하세요.<br />
                단 1초 만에 4개 플랫폼에 최적화된 제목, 본문, 해시태그, 첫 댓글 텍스트 파일과 9:16 비디오가 하나의 전용 폴더로 자동 구성되어 손쉽게 원클릭 복사/게시할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

