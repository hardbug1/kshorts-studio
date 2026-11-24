import React, { useState, useEffect } from 'react';
import { useEscapeKey } from '../hooks/useEscapeKey';
import {
  X,
  Calendar,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Send,
  Trash2,
  CheckCircle2,
  RotateCw,
  Plus,
} from 'lucide-react';
import type { ScheduledShortsItem, ShortsProject, AutoDistributeConfig } from '../types';

interface PublishCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ShortsProject[];
  onScheduleUpdated?: () => void;
}

export const PublishCalendarModal: React.FC<PublishCalendarModalProps> = ({
  isOpen,
  onClose,
  projects,
  onScheduleUpdated,
}) => {
  const [scheduledItems, setScheduledItems] = useState<ScheduledShortsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Calendar View State: Year & Month (0-indexed month)
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  // Auto-Distribute Tool State
  const [isAutoDistributeOpen, setIsAutoDistributeOpen] = useState(false);
  const [distributeStartDate, setDistributeStartDate] = useState(
    new Date(Date.now() + 86400000).toISOString().slice(0, 10)
  );
  const [timeSlotsInput, setTimeSlotsInput] = useState('18:00, 21:00');
  const [intervalDays, setIntervalDays] = useState(1);
  const [distributePlatform, setDistributePlatform] = useState<'youtube' | 'instagram' | 'tiktok' | 'all'>('youtube');

  // Manual Schedule Modal
  const [selectedDateForManual, setSelectedDateForManual] = useState<string | null>(null);
  const [manualProjectId, setManualProjectId] = useState<string>('');
  const [manualTime, setManualTime] = useState<string>('18:00');

  const loadScheduledItems = async () => {
    if (!window.electronAPI) return;
    setLoading(true);
    try {
      const items = await window.electronAPI.getScheduledShorts();
      setScheduledItems(items || []);
    } catch (err) {
      console.warn('[Schedule Load Error]:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadScheduledItems();
    }
  }, [isOpen]);

  useEscapeKey(isOpen, onClose);
  useEscapeKey(isOpen && isAutoDistributeOpen, () => setIsAutoDistributeOpen(false));
  if (!isOpen) return null;

  // Month navigation
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Days in month calculation
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const calendarDays: Array<{ dateStr: string; dayNum: number; isCurrentMonth: boolean }> = [];
  // Leading empty days
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push({ dateStr: '', dayNum: 0, isCurrentMonth: false });
  }
  // Days of current month
  for (let d = 1; d <= daysInMonth; d++) {
    const mm = String(currentMonth + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    const dateStr = `${currentYear}-${mm}-${dd}`;
    calendarDays.push({ dateStr, dayNum: d, isCurrentMonth: true });
  }

  // Filter items by date
  const getItemsForDate = (dateStr: string) => {
    return scheduledItems.filter((item) => {
      if (!item.scheduledTime) return false;
      return item.scheduledTime.startsWith(dateStr) && item.status !== 'cancelled';
    });
  };

  // Completed projects available for scheduling
  const completedProjects = projects.filter((p) => p.status === 'done');

  // Execute Auto-Distribute
  const handleAutoDistribute = async () => {
    if (!window.electronAPI) return;
    const targetProjectIds = completedProjects.map((p) => p.id);
    if (targetProjectIds.length === 0) {
      alert('예약 가능한 완료된 쇼츠 비디오가 없습니다. 먼저 쇼츠를 렌더링하세요.');
      return;
    }

    const slots = timeSlotsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(s));

    if (slots.length === 0) {
      alert('유효한 시간 슬롯을 입력하세요. (예: 18:00, 21:00)');
      return;
    }

    const config: AutoDistributeConfig = {
      projectIds: targetProjectIds,
      startDate: distributeStartDate,
      timeSlots: slots,
      intervalDays,
      platform: distributePlatform,
    };

    setLoading(true);
    try {
      const res = await window.electronAPI.autoDistributeSchedule(config);
      if (res.success) {
        setActionMessage(`총 ${res.count || targetProjectIds.length}편의 쇼츠가 골든타임으로 자동 분산 예약되었습니다!`);
        setIsAutoDistributeOpen(false);
        await loadScheduledItems();
        onScheduleUpdated?.();
        setTimeout(() => setActionMessage(null), 4000);
      } else {
        alert(res.error || '자동 예약 실패');
      }
    } catch (err: any) {
      alert(`오류: ${err?.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  // Manual Schedule
  const handleManualSchedule = async () => {
    if (!window.electronAPI || !selectedDateForManual || !manualProjectId) return;
    const scheduledDateTime = `${selectedDateForManual}T${manualTime}:00.000Z`;

    setLoading(true);
    try {
      const res = await window.electronAPI.scheduleShort({
        projectId: manualProjectId,
        scheduledTime: scheduledDateTime,
        platform: 'youtube',
      });
      if (res.success) {
        setSelectedDateForManual(null);
        setManualProjectId('');
        await loadScheduledItems();
        onScheduleUpdated?.();
      } else {
        alert(res.error || '예약 실패');
      }
    } catch (err: any) {
      alert(`오류: ${err?.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  // Cancel Schedule
  const handleCancelSchedule = async (scheduleId: string) => {
    if (!window.electronAPI) return;
    if (!confirm('해당 쇼츠의 예약 발행을 취소하시겠습니까?')) return;
    try {
      await window.electronAPI.cancelScheduledShort(scheduleId);
      await loadScheduledItems();
      onScheduleUpdated?.();
    } catch (err) {
      console.warn(err);
    }
  };

  // Publish Now
  const handlePublishNow = async (scheduleId: string) => {
    if (!window.electronAPI) return;
    if (!confirm('예약 일시와 관계없이 지금 즉시 업로드하시겠습니까?')) return;
    setLoading(true);
    try {
      const res = await window.electronAPI.publishScheduledNow(scheduleId);
      if (res.success) {
        alert('성공적으로 업로드되었습니다!');
        await loadScheduledItems();
        onScheduleUpdated?.();
      } else {
        alert(res.error || '발행 실패');
        await loadScheduledItems(); // 실패 상태를 목록에 반영
      }
    } catch (err: any) {
      alert(`오류: ${err?.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  // Stats
  const activeSchedulesCount = scheduledItems.filter((i) => i.status === 'scheduled').length;
  const publishedCount = scheduledItems.filter((i) => i.status === 'published').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-inner">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight">쇼츠 발행 캘린더 & 스마트 분산 예약</h2>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  신규 v1.4
                </span>
              </div>
              <p className="text-xs text-slate-300">
                대량 생성된 쇼츠를 알고리즘 최적 골든타임에 맞춰 자동 분산 예약하고 한눈에 관리합니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAutoDistributeOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>⚡ 원클릭 골든타임 자동 분산</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Banner */}
        {actionMessage && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 flex items-center gap-2 text-emerald-800 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Toolbar & Month Navigation */}
        <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-black text-slate-900 min-w-[120px] text-center">
              {currentYear}년 {currentMonth + 1}월
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={loadScheduledItems}
              disabled={loading}
              className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors ml-2"
              title="새로고침"
            >
              <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-1.5 text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200/60">
              <Clock className="w-3.5 h-3.5" />
              <span>대기 예약: {activeSchedulesCount}편</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200/60">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>발행 완료: {publishedCount}편</span>
            </div>
          </div>
        </div>

        {/* Calendar Grid Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100/50">
          {/* Weekday Header */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-black text-slate-500">
            <div className="text-rose-500">일</div>
            <div>월</div>
            <div>화</div>
            <div>수</div>
            <div>목</div>
            <div>금</div>
            <div className="text-blue-500">토</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, idx) => {
              if (!day.isCurrentMonth) {
                return <div key={`empty_${idx}`} className="min-h-[110px] rounded-2xl bg-slate-100/30 border border-transparent" />;
              }

              const items = getItemsForDate(day.dateStr);
              const isToday = day.dateStr === today.toISOString().slice(0, 10);

              return (
                <div
                  key={day.dateStr}
                  className={`min-h-[120px] max-h-[180px] rounded-2xl p-2.5 border transition-all flex flex-col justify-between overflow-hidden ${
                    isToday
                      ? 'bg-blue-50/70 border-blue-400 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-indigo-300 shadow-2xs'
                  }`}
                >
                  {/* Day Header */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-xs font-black px-1.5 py-0.5 rounded-md ${
                        isToday ? 'bg-blue-600 text-white' : 'text-slate-700'
                      }`}
                    >
                      {day.dayNum}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedDateForManual(day.dateStr);
                        if (completedProjects.length > 0) {
                          setManualProjectId(completedProjects[0].id);
                        }
                      }}
                      className="text-slate-400 hover:text-indigo-600 p-0.5 rounded hover:bg-slate-100 transition-colors"
                      title="이 날짜에 쇼츠 수동 예약"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Scheduled Items List in Day */}
                  <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5 custom-scrollbar">
                    {items.map((item) => {
                      const timeStr = item.scheduledTime
                        ? new Date(item.scheduledTime).toLocaleTimeString('ko-KR', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                          })
                        : '';
                      const isPublished = item.status === 'published';

                      return (
                        <div
                          key={item.id}
                          className={`p-1.5 rounded-xl border text-[10px] leading-tight transition-all group ${
                            isPublished
                              ? 'bg-slate-50 border-slate-200 text-slate-500'
                              : 'bg-indigo-50/80 border-indigo-200 text-indigo-950 hover:bg-indigo-100'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="font-black text-[9px] px-1 rounded bg-indigo-200/80 text-indigo-900">
                              {timeStr}
                            </span>
                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              {!isPublished && (
                                <>
                                  <button
                                    onClick={() => handlePublishNow(item.id)}
                                    className="p-0.5 text-emerald-600 hover:text-emerald-800"
                                    title="지금 즉시 발행"
                                  >
                                    <Send className="w-2.5 h-2.5" />
                                  </button>
                                  <button
                                    onClick={() => handleCancelSchedule(item.id)}
                                    className="p-0.5 text-rose-500 hover:text-rose-700"
                                    title="예약 취소"
                                  >
                                    <Trash2 className="w-2.5 h-2.5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="font-bold truncate" title={item.title}>
                            {item.title}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between bg-white shrink-0">
          <span className="text-xs text-slate-400">
            💡 유튜브/인스타그램 API 설정 시 지정된 시각에 완전 무인으로 자동 업로드됩니다.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
          >
            닫기
          </button>
        </div>
      </div>

      {/* Sub-Modal: One-Click Auto-Distribute */}
      {isAutoDistributeOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="font-black text-slate-900 text-sm">원클릭 골든타임 자동 분산 예약</h3>
              </div>
              <button
                onClick={() => setIsAutoDistributeOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              완료된 쇼츠 <strong className="text-indigo-600">{completedProjects.length}편</strong>을
              선택한 시작일로부터 유튜브/SNS 알고리즘 시청률이 가장 높은 시간대에 자동으로 균등 분배합니다.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">시작 일자</label>
                <input
                  type="date"
                  value={distributeStartDate}
                  onChange={(e) => setDistributeStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  일일 발행 골든타임 슬롯 (콤마 구분)
                </label>
                <input
                  type="text"
                  value={timeSlotsInput}
                  onChange={(e) => setTimeSlotsInput(e.target.value)}
                  placeholder="18:00, 21:00"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[10px] text-slate-400">
                  예: 하루 2편 발행 시 18:00 (퇴근길), 21:00 (야간 골든타임) 추천
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">발행 간격</label>
                  <select
                    value={intervalDays}
                    onChange={(e) => setIntervalDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={1}>매일 (추천)</option>
                    <option value={2}>2일마다 1회</option>
                    <option value={3}>3일마다 1회</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">발행 플랫폼</label>
                  <select
                    value={distributePlatform}
                    onChange={(e) => setDistributePlatform(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="youtube">유튜브 쇼츠 (YouTube)</option>
                    {/* 추후 순차 지원 예정
                    <option value="instagram">인스타그램 릴스 (예정)</option>
                    <option value="tiktok">틱톡 (예정)</option>
                    <option value="all">4대 플랫폼 동시 (예정)</option>
                    */}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsAutoDistributeOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleAutoDistribute}
                disabled={loading || completedProjects.length === 0}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? '분산 예약 적용 중...' : `총 ${completedProjects.length}편 자동 예약 실행`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Modal: Manual Date Schedule */}
      {selectedDateForManual && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <h3 className="font-black text-slate-900 text-sm">
                  {selectedDateForManual} 쇼츠 예약 추가
                </h3>
              </div>
              <button
                onClick={() => setSelectedDateForManual(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">예약할 쇼츠 선택</label>
                <select
                  value={manualProjectId}
                  onChange={(e) => setManualProjectId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- 완료된 쇼츠 선택 --</option>
                  {completedProjects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.durationSeconds}초)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">발행 시간</label>
                <input
                  type="time"
                  value={manualTime}
                  onChange={(e) => setManualTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedDateForManual(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleManualSchedule}
                disabled={loading || !manualProjectId}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? '예약 중...' : '예약 등록'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
