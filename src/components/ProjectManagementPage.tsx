import React from 'react';
import { FolderOpen, Play, Folder, Trash2, Calendar, Video } from 'lucide-react';
import type { ShortsProject } from '../types';

interface ProjectManagementPageProps {
  projects: ShortsProject[];
  onSelectProject: (p: ShortsProject) => void;
  onDeleteProject: (id: string) => void;
  onShowInFolder: (path: string) => void;
  onOpenVideoFile: (path: string) => void;
  onNavigateToCreate: () => void;
}

export const ProjectManagementPage: React.FC<ProjectManagementPageProps> = ({
  projects,
  onSelectProject,
  onDeleteProject,
  onShowInFolder,
  onOpenVideoFile,
  onNavigateToCreate,
}) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span>작성글 및 쇼츠 영상 보관함</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              로컬 PC에 생성 및 저장된 모든 쇼츠 프로젝트 ({projects.length}개)
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToCreate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95 shrink-0"
        >
          <Video className="w-4 h-4" />
          <span>새 쇼츠 만들기</span>
        </button>
      </div>

      {/* Projects List */}
      {projects.length === 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-16 text-center space-y-3 shadow-sm">
          <FolderOpen className="w-12 h-12 mx-auto stroke-[1.5] text-slate-300" />
          <h3 className="text-sm font-extrabold text-slate-800">저장된 쇼츠 프로젝트가 없습니다.</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
            새 쇼츠 제작 탭에서 아이디어를 입력하고 첫 번째 AI 쇼츠를 제작해보세요!
          </p>
          <button
            onClick={onNavigateToCreate}
            className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 text-xs font-bold transition-all"
          >
            지금 쇼츠 제작하기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p) => {
            const dateStr = new Date(p.createdAt).toLocaleString('ko-KR', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={p.id}
                className="bg-white border border-slate-200 hover:border-blue-500 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all shadow-sm hover:shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-extrabold text-sm text-slate-900 line-clamp-1 flex-1">
                      {p.title}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                        p.status === 'done'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {p.status === 'done' ? '완료' : '진행중'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">
                    {p.script || p.prompt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {dateStr}
                    </span>
                    <span>•</span>
                    <span className="text-slate-700 font-bold">약 {p.durationSeconds || 30}초</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {p.videoPath && (
                      <>
                        <button
                          onClick={() => onSelectProject(p)}
                          className="p-2 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white transition-all shadow-sm"
                          title="미리보기 재생"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </button>
                        <button
                          onClick={() => onShowInFolder(p.videoPath!)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all shadow-sm"
                          title="폴더에서 보기"
                        >
                          <Folder className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => onDeleteProject(p.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                      title="프로젝트 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
