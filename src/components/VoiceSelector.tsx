import React, { useEffect, useRef, useState } from 'react';
import { Mic, Check, Zap, Play, Square, Loader2 } from 'lucide-react';
import type { VoiceOption } from '../types';

export const VOICES: VoiceOption[] = [
  {
    id: 'ko-KR-SunHiNeural',
    name: '선희 (여성)',
    gender: 'female',
    tag: '차분 / 지적 아나운서',
    description: '신뢰감 있는 다큐, 뉴스, 꿀팁 정보 전달에 최적화',
    provider: 'edge-tts',
  },
  {
    id: 'ko-KR-InJoonNeural',
    name: '인준 (남성)',
    gender: 'male',
    tag: '신뢰 / 표준 다큐멘터리',
    description: '차분하고 정갈한 남성 나레이션으로 몰입감 극대화',
    provider: 'edge-tts',
  },
  {
    id: 'ko-KR-BongJinNeural',
    name: '봉진 (남성)',
    gender: 'male',
    tag: '괴담 / 중후한 저음',
    description: '깊고 묵직한 보이스로 미스터리, 공포, 긴장감 유발에 특화',
    provider: 'edge-tts',
  },
  {
    id: 'ko-KR-GookMinNeural',
    name: '국민 (남성)',
    gender: 'male',
    tag: '친근 / 커뮤니티 썰',
    description: '자연스러운 억양과 구어체로 썰 쇼츠 및 일상 공감에 탁월',
    provider: 'edge-tts',
  },
  {
    id: 'ko-KR-JiMinNeural',
    name: '지민 (여성)',
    gender: 'female',
    tag: '상큼 / 밝은 꿀팁',
    description: '생기 있고 에너지 넘치는 톤으로 1분 상식 및 꿀팁 전달',
    provider: 'edge-tts',
  },
  {
    id: 'ko-KR-SeoHyeonNeural',
    name: '서현 (여성)',
    gender: 'female',
    tag: '따뜻 / 감성 에세이',
    description: '편안하고 부드러운 목소리로 힐링, 브이로그, 명언 전달',
    provider: 'edge-tts',
  },
  // ElevenLabs Emotional AI Voices
  {
    id: 'elevenlabs_21m00Tcm4TlvDq8ikWAM',
    name: '레이첼 Rachel (감정형 여성)',
    gender: 'female',
    tag: '👑 ElevenLabs 프리미엄',
    description: '실제 사람 같은 생생한 숨소리와 억양, 극한의 자연스러움',
    provider: 'elevenlabs',
  },
  {
    id: 'elevenlabs_pNInz6obpgDQGcFmaJgB',
    name: '아담 Adam (시네마틱 남성)',
    gender: 'male',
    tag: '👑 ElevenLabs 프리미엄',
    description: '헐리우드 트레일러급 깊은 울림과 드라마틱한 몰입감',
    provider: 'elevenlabs',
  },
];

interface VoiceSelectorProps {
  selectedVoiceId: string;
  onSelectVoice: (id: string) => void;
  voiceSpeed?: number;
  onChangeVoiceSpeed?: (speed: number) => void;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoiceId,
  onSelectVoice,
  voiceSpeed = 1.1,
  onChangeVoiceSpeed,
}) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 다른 화면으로 넘어가면 미리듣기를 멈춘다
  useEffect(() => () => audioRef.current?.pause(), []);

  const stopPreview = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    setPlayingId(null);
  };

  const handlePreview = async (e: React.MouseEvent, voiceId: string) => {
    e.stopPropagation(); // 카드 선택과 별개로 듣기만 한다
    if (playingId === voiceId) {
      stopPreview();
      return;
    }
    stopPreview();
    setPreviewError('');
    setLoadingId(voiceId);
    try {
      const res = await window.electronAPI?.previewVoice({ voiceId, speed: voiceSpeed });
      if (!res?.success || !res.dataUrl) {
        setPreviewError(res?.error || '미리듣기를 만들지 못했습니다.');
        return;
      }
      const audio = new Audio(res.dataUrl);
      audio.onended = () => setPlayingId((cur) => (cur === voiceId ? null : cur));
      audioRef.current = audio;
      setPlayingId(voiceId);
      await audio.play();
    } catch (err: any) {
      setPreviewError(err?.message || String(err));
      setPlayingId(null);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
            <Mic className="w-5 h-5" />
          </div>
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">3. 한국어 AI 목소리 선택</h2>
        </div>
        <span className="text-[11px] text-slate-500 font-medium">무료 고품질 Neural TTS 엔진</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {VOICES.map((voice) => {
          const isSelected = selectedVoiceId === voice.id;
          return (
            <div
              key={voice.id}
              onClick={() => onSelectVoice(voice.id)}
              className={`relative cursor-pointer rounded-2xl p-4 border transition-all ${
                isSelected
                  ? 'bg-purple-50/80 border-purple-500 text-purple-900 shadow-md ring-2 ring-purple-100'
                  : 'bg-slate-50 hover:bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm text-slate-900">{voice.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      voice.provider === 'elevenlabs'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300 shadow-xs'
                        : voice.gender === 'female'
                        ? 'bg-pink-100 text-pink-700 border border-pink-200'
                        : 'bg-blue-100 text-blue-700 border border-blue-200'
                    }`}>
                      {voice.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    {voice.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={(e) => handlePreview(e, voice.id)}
                  disabled={loadingId !== null && loadingId !== voice.id}
                  title={playingId === voice.id ? '정지' : '목소리 미리듣기'}
                  aria-label={`${voice.name} 목소리 ${playingId === voice.id ? '정지' : '미리듣기'}`}
                  className="w-7 h-7 rounded-full flex items-center justify-center border border-purple-200 bg-white text-purple-600 hover:bg-purple-600 hover:text-white transition-all disabled:opacity-40"
                >
                  {loadingId === voice.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : playingId === voice.id ? (
                    <Square className="w-3 h-3 fill-current" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current" />
                  )}
                </button>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all text-xs font-bold ${
                    isSelected
                      ? 'bg-purple-600 border-purple-600 text-white'
                      : 'border-slate-300 bg-white text-transparent'
                  }`}
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {previewError && (
        <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">{previewError}</p>
      )}

      {onChangeVoiceSpeed && (
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <div>
              <span className="text-xs font-bold text-slate-800">성우 발화 배속 (숏폼 텐션 조절)</span>
              <p className="text-[11px] text-slate-500">
                시청 지속률을 극대화하기 위해 나레이션 템포를 조절합니다. (1.1x 추천)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {[
              { val: 1.0, label: '1.0x 표준' },
              { val: 1.1, label: '1.1x 추천' },
              { val: 1.2, label: '1.2x 스피디' },
              { val: 1.3, label: '1.3x 초고속' },
            ].map((s) => (
              <button
                key={s.val}
                type="button"
                onClick={() => onChangeVoiceSpeed(s.val)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  (voiceSpeed ?? 1.1) === s.val
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
