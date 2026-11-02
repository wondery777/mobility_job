import React, { useState } from 'react';
import {
  User,
  Star,
  Plus,
  Check,
  X,
  ChevronRight,
  Award,
  Wrench,
  BookOpen,
} from 'lucide-react';
import {
  Job,
  INITIAL_SKILLS,
  INITIAL_CERTIFICATES,
  SAMPLE_NOTICES,
  ColumnNotice,
} from '../data';
import { JobCard } from '../components/JobCard';

interface MyTabProps {
  jobs: Job[];
  bookmarkedJobIds: string[];
  onToggleBookmark: (jobId: string) => void;
  onSelectJob: (job: Job) => void;
  mySkills: string[];
  onUpdateMySkills: (skills: string[]) => void;
  customSkills: string[];
  onUpdateCustomSkills: (skills: string[]) => void;
  myCertificates: string[];
  onUpdateMyCertificates: (certs: string[]) => void;
  customCertificates: string[];
  onUpdateCustomCertificates: (certs: string[]) => void;
  viewMode?: 'mobile' | 'web';
}

export const MyTab: React.FC<MyTabProps> = ({
  jobs,
  bookmarkedJobIds,
  onToggleBookmark,
  onSelectJob,
  mySkills,
  onUpdateMySkills,
  customSkills,
  onUpdateCustomSkills,
  myCertificates,
  onUpdateMyCertificates,
  customCertificates,
  onUpdateCustomCertificates,
  viewMode = 'mobile',
}) => {
  const [newSkillInput, setNewSkillInput] = useState('');
  const [newCertInput, setNewCertInput] = useState('');
  const [selectedNotice, setSelectedNotice] = useState<ColumnNotice | null>(null);

  // Saved jobs list
  const savedJobs = jobs.filter((j) => bookmarkedJobIds.includes(j.id));

  // --- Skill Handlers ---
  const handleToggleSkill = (skill: string) => {
    const isSelected = mySkills.includes(skill);
    const isCustom = customSkills.includes(skill);

    if (isSelected) {
      // Unselecting
      onUpdateMySkills(mySkills.filter((s) => s !== skill));
      // 직접 추가한 항목은 해제하면 목록에서 삭제
      if (isCustom) {
        onUpdateCustomSkills(customSkills.filter((s) => s !== skill));
      }
    } else {
      // Selecting
      onUpdateMySkills([...mySkills, skill]);
    }
  };

  const handleAddCustomSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = newSkillInput.trim();
    if (!val) return;

    if (!INITIAL_SKILLS.includes(val) && !customSkills.includes(val)) {
      onUpdateCustomSkills([...customSkills, val]);
    }
    if (!mySkills.includes(val)) {
      onUpdateMySkills([...mySkills, val]);
    }
    setNewSkillInput('');
  };

  // --- Certificate Handlers ---
  const handleToggleCert = (cert: string) => {
    const isSelected = myCertificates.includes(cert);
    const isCustom = customCertificates.includes(cert);

    if (isSelected) {
      // Unselecting
      onUpdateMyCertificates(myCertificates.filter((c) => c !== cert));
      // 직접 추가한 항목은 해제하면 목록에서 삭제
      if (isCustom) {
        onUpdateCustomCertificates(customCertificates.filter((c) => c !== cert));
      }
    } else {
      // Selecting
      onUpdateMyCertificates([...myCertificates, cert]);
    }
  };

  const handleAddCustomCert = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = newCertInput.trim();
    if (!val) return;

    if (!INITIAL_CERTIFICATES.includes(val) && !customCertificates.includes(val)) {
      onUpdateCustomCertificates([...customCertificates, val]);
    }
    if (!myCertificates.includes(val)) {
      onUpdateMyCertificates([...myCertificates, val]);
    }
    setNewCertInput('');
  };

  // All display chips
  const allSkillChips = Array.from(new Set([...INITIAL_SKILLS, ...customSkills]));
  const allCertChips = Array.from(
    new Set([...INITIAL_CERTIFICATES, ...customCertificates])
  );

  return (
    <div className="space-y-4 px-3 py-3 pb-8">
      {/* Profile Header */}
      <div className="p-4 rounded-[14px] bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-inner">
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-extrabold text-white">모빌리티 취준생</h2>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-400 text-emerald-950">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-blue-100">
              보유 기술 {mySkills.length}개 · 자격증 {myCertificates.length}개 등록됨
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: 2-column layout on Web */}
      <div
        className={
          viewMode === 'web'
            ? 'grid grid-cols-1 lg:grid-cols-2 gap-4 items-start'
            : 'space-y-4'
        }
      >
        {/* Left Column on Web: Saved Jobs & Operator Notices */}
        <div className="space-y-4">
          {/* ⭐ 저장한 공고 목록 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  저장한 공고
                </h3>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  {savedJobs.length}건
                </span>
              </div>
              {savedJobs.length > 0 && (
                <span className="text-[11px] text-slate-400">
                  달력에서 마감일 녹색 점 표시
                </span>
              )}
            </div>

            {savedJobs.length > 0 ? (
              <div className="space-y-2">
                {savedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isBookmarked={true}
                    onToggleBookmark={onToggleBookmark}
                    onClick={() => onSelectJob(job)}
                  />
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-[14px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1.5">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  아직 저장한 공고가 없습니다.
                </p>
                <p className="text-[11px] text-slate-400">
                  공고 카드의 별표(★)를 눌러 관심 공고를 보관해 보세요.
                </p>
              </div>
            )}
          </div>

          {/* 📢 운영자 공지·칼럼 (읽기 전용 목록) */}
          <div className="p-4 rounded-[14px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
              <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>📢 운영자 공지 및 모빌리티 취업 칼럼</span>
            </div>

            <div className="space-y-2">
              {SAMPLE_NOTICES.map((notice) => (
                <div
                  key={notice.id}
                  onClick={() => setSelectedNotice(notice)}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800 cursor-pointer flex items-center justify-between gap-2 transition-all active:scale-[0.99]"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          notice.category === '공지'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            : notice.category === '칼럼'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {notice.category}
                      </span>
                      <span className="text-[10px] text-slate-400">{notice.date}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {notice.title}
                    </h4>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column on Web: Skills & Certificates */}
        <div className="space-y-4">
          {/* 🛠 내 보유 기술 */}
          <div className="p-4 rounded-[14px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  내 보유 기술 ({mySkills.length}개 선택됨)
                </h3>
              </div>
              <span className="text-[10px] text-slate-400">
                공고 상세에서 매칭률에 반영
              </span>
            </div>

            {/* Chips */}
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
              {allSkillChips.map((skill) => {
                const isSelected = mySkills.includes(skill);
                const isCustom = customSkills.includes(skill);

                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleToggleSkill(skill)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg font-medium border transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
                    <span>{skill}</span>
                    {isCustom && (
                      <span
                        className={`text-[9px] px-1 py-0.2 rounded-full ${
                          isSelected
                            ? 'bg-blue-700 text-blue-100'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                        }`}
                      >
                        직접추가
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom Input */}
            <form onSubmit={handleAddCustomSkill} className="flex items-center gap-1.5 pt-1">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                placeholder="기술 직접 추가 (예: PyTorch, CANoe, QNX)"
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1 shrink-0 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>추가</span>
              </button>
            </form>
            <p className="text-[10px] text-slate-400">
              * 직접 추가한 기술은 칩을 눌러 해제 시 목록에서 자동 삭제됩니다.
            </p>
          </div>

          {/* 📜 내 보유 자격증 */}
          <div className="p-4 rounded-[14px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  내 보유 자격증 ({myCertificates.length}개 선택됨)
                </h3>
              </div>
              <span className="text-[10px] text-slate-400">
                우대 자격증 매칭에 반영
              </span>
            </div>

            {/* Chips */}
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
              {allCertChips.map((cert) => {
                const isSelected = myCertificates.includes(cert);
                const isCustom = customCertificates.includes(cert);

                return (
                  <button
                    key={cert}
                    type="button"
                    onClick={() => handleToggleCert(cert)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg font-medium border transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
                    <span>{cert}</span>
                    {isCustom && (
                      <span
                        className={`text-[9px] px-1 py-0.2 rounded-full ${
                          isSelected
                            ? 'bg-emerald-700 text-emerald-100'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                        }`}
                      >
                        직접추가
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom Input */}
            <form onSubmit={handleAddCustomCert} className="flex items-center gap-1.5 pt-1">
              <input
                type="text"
                value={newCertInput}
                onChange={(e) => setNewCertInput(e.target.value)}
                placeholder="자격증 직접 추가 (예: 전자기사, PMP)"
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 shrink-0 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>추가</span>
              </button>
            </form>
            <p className="text-[10px] text-slate-400">
              * 직접 추가한 자격증은 칩을 눌러 해제 시 목록에서 자동 삭제됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* Notice Detail Reader Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-[400px] bg-white dark:bg-slate-900 rounded-[20px] p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                {selectedNotice.category}
              </span>
              <button
                onClick={() => setSelectedNotice(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
              {selectedNotice.title}
            </h3>
            <div className="text-[11px] text-slate-400 flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span>작성자: {selectedNotice.author}</span>
              <span>{selectedNotice.date}</span>
            </div>
            <div className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto">
              {selectedNotice.content}
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSelectedNotice(null)}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
