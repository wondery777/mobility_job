import React, { useState, useMemo } from 'react';
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
  GraduationCap,
  Bell,
  BellRing,
  BellOff,
  Clock,
  Sparkles,
  Filter,
  Volume2,
  VolumeX,
  Zap,
  CheckSquare,
  Square,
} from 'lucide-react';
import {
  Job,
  INITIAL_SKILLS,
  INITIAL_CERTIFICATES,
  INITIAL_MAJORS,
  SAMPLE_NOTICES,
  ColumnNotice,
  NotificationSettings,
  DEFAULT_NOTIFICATION_SETTINGS,
} from '../data';
import { JobCard } from '../components/JobCard';

const ALL_MOBILITY_FIELDS: ('자율주행' | '전기차·배터리' | 'UAM·드론' | '모빌리티 서비스' | '차량용 SW·반도체' | '자동차 부품')[] = [
  '자율주행',
  '전기차·배터리',
  'UAM·드론',
  '모빌리티 서비스',
  '차량용 SW·반도체',
  '자동차 부품',
];

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
  myMajors: string[];
  onUpdateMyMajors: (majors: string[]) => void;
  customMajors: string[];
  onUpdateCustomMajors: (majors: string[]) => void;
  viewMode?: 'mobile' | 'web';
  notificationSettings?: NotificationSettings;
  onUpdateNotificationSettings?: (settings: NotificationSettings) => void;
  onTriggerTestNotification?: () => void;
  notificationPermission?: NotificationPermission | 'unsupported';
  onRequestNotificationPermission?: () => void;
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
  myMajors,
  onUpdateMyMajors,
  customMajors,
  onUpdateCustomMajors,
  viewMode = 'mobile',
  notificationSettings = DEFAULT_NOTIFICATION_SETTINGS,
  onUpdateNotificationSettings = () => {},
  onTriggerTestNotification,
  notificationPermission = 'default',
  onRequestNotificationPermission,
}) => {
  const [newSkillInput, setNewSkillInput] = useState('');
  const [newCertInput, setNewCertInput] = useState('');
  const [newMajorInput, setNewMajorInput] = useState('');
  const [newNotifySkillInput, setNewNotifySkillInput] = useState('');
  const [selectedNotice, setSelectedNotice] = useState<ColumnNotice | null>(null);
  const [testSentFeedback, setTestSentFeedback] = useState(false);

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

  // --- Major Handlers ---
  const handleToggleMajor = (major: string) => {
    const isSelected = myMajors.includes(major);
    const isCustom = customMajors.includes(major);

    if (isSelected) {
      // Unselecting
      onUpdateMyMajors(myMajors.filter((m) => m !== major));
      // 직접 추가한 항목은 해제하면 목록에서 삭제
      if (isCustom) {
        onUpdateCustomMajors(customMajors.filter((m) => m !== major));
      }
    } else {
      // Selecting
      onUpdateMyMajors([...myMajors, major]);
    }
  };

  const handleAddCustomMajor = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = newMajorInput.trim();
    if (!val) return;

    if (!INITIAL_MAJORS.includes(val) && !customMajors.includes(val)) {
      onUpdateCustomMajors([...customMajors, val]);
    }
    if (!myMajors.includes(val)) {
      onUpdateMyMajors([...myMajors, val]);
    }
    setNewMajorInput('');
  };

  // Notification handlers
  const handleToggleMasterNotification = () => {
    onUpdateNotificationSettings({
      ...notificationSettings,
      enabled: !notificationSettings.enabled,
    });
  };

  const handleToggleDeadlineAlert = () => {
    onUpdateNotificationSettings({
      ...notificationSettings,
      deadlineAlertEnabled: !notificationSettings.deadlineAlertEnabled,
    });
  };

  const handleToggleDeadlineDay = (day: number) => {
    const current = notificationSettings.deadlineDays;
    const next = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day].sort((a, b) => b - a);
    onUpdateNotificationSettings({
      ...notificationSettings,
      deadlineDays: next,
    });
  };

  const handleToggleDeadlineBookmarkedOnly = () => {
    onUpdateNotificationSettings({
      ...notificationSettings,
      deadlineBookmarkedOnly: !notificationSettings.deadlineBookmarkedOnly,
    });
  };

  const handleToggleNewJobAlert = () => {
    onUpdateNotificationSettings({
      ...notificationSettings,
      newJobAlertEnabled: !notificationSettings.newJobAlertEnabled,
    });
  };

  const handleToggleAlertField = (field: string) => {
    const current = notificationSettings.alertFields;
    const next = current.includes(field)
      ? current.filter((f) => f !== field)
      : [...current, field];
    onUpdateNotificationSettings({
      ...notificationSettings,
      alertFields: next,
    });
  };

  const handleSelectAllFields = () => {
    onUpdateNotificationSettings({
      ...notificationSettings,
      alertFields: [...ALL_MOBILITY_FIELDS],
    });
  };

  const handleClearAlertFields = () => {
    onUpdateNotificationSettings({
      ...notificationSettings,
      alertFields: [],
    });
  };

  const handleToggleAlertSkill = (skill: string) => {
    const current = notificationSettings.alertSkills;
    const next = current.includes(skill)
      ? current.filter((s) => s !== skill)
      : [...current, skill];
    onUpdateNotificationSettings({
      ...notificationSettings,
      alertSkills: next,
    });
  };

  const handleSyncMySkillsToAlerts = () => {
    const merged = Array.from(new Set([...notificationSettings.alertSkills, ...mySkills]));
    onUpdateNotificationSettings({
      ...notificationSettings,
      alertSkills: merged,
    });
  };

  const handleAddCustomAlertSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = newNotifySkillInput.trim();
    if (!val) return;
    if (!notificationSettings.alertSkills.includes(val)) {
      onUpdateNotificationSettings({
        ...notificationSettings,
        alertSkills: [...notificationSettings.alertSkills, val],
      });
    }
    setNewNotifySkillInput('');
  };

  const handleRemoveAlertSkill = (skill: string) => {
    onUpdateNotificationSettings({
      ...notificationSettings,
      alertSkills: notificationSettings.alertSkills.filter((s) => s !== skill),
    });
  };

  const handleToggleSound = () => {
    onUpdateNotificationSettings({
      ...notificationSettings,
      soundEnabled: !notificationSettings.soundEnabled,
    });
  };

  const handleChangeAlertTime = (time: string) => {
    onUpdateNotificationSettings({
      ...notificationSettings,
      alertTime: time,
    });
  };

  const handleTriggerTest = () => {
    setTestSentFeedback(true);
    if (onTriggerTestNotification) {
      onTriggerTestNotification();
    }
    setTimeout(() => {
      setTestSentFeedback(false);
    }, 3000);
  };

  // Matching jobs count for deadline alert
  const deadlineClosingJobs = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return jobs.filter((job) => {
      if (notificationSettings.deadlineBookmarkedOnly && !bookmarkedJobIds.includes(job.id)) {
        return false;
      }
      const dDate = new Date(job.deadline);
      dDate.setHours(0, 0, 0, 0);
      const diffDays = Math.ceil((dDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return notificationSettings.deadlineDays.includes(diffDays) || diffDays <= 3;
    });
  }, [jobs, notificationSettings.deadlineBookmarkedOnly, notificationSettings.deadlineDays, bookmarkedJobIds]);

  // Matching jobs count for new job alert
  const techFieldMatchedJobs = useMemo(() => {
    return jobs.filter((job) => {
      const fieldMatch =
        notificationSettings.alertFields.length === 0 ||
        notificationSettings.alertFields.includes(job.field);
      if (!fieldMatch) return false;

      if (notificationSettings.alertSkills.length === 0) return true;
      return job.skills.some((sk) =>
        notificationSettings.alertSkills.some(
          (ask) => ask.toLowerCase() === sk.toLowerCase()
        )
      );
    });
  }, [jobs, notificationSettings.alertFields, notificationSettings.alertSkills]);

  // All display chips
  const allSkillChips = Array.from(new Set([...INITIAL_SKILLS, ...customSkills]));
  const allCertChips = Array.from(
    new Set([...INITIAL_CERTIFICATES, ...customCertificates])
  );
  const allMajorChips = Array.from(
    new Set([...INITIAL_MAJORS, ...customMajors])
  );

  return (
    <div className="space-y-4 px-3 py-3 pb-8">
      {/* Profile Header */}
      <div className="p-4 rounded-[14px] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white shadow-md flex items-center justify-between">
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
              보유 전공 {myMajors.length}개 · 기술 {mySkills.length}개 · 자격증 {myCertificates.length}개 등록됨
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

          {/* 🔔 맞춤 채용 푸시 알림 설정 (Push Notification Preferences) */}
          <div className="p-4 rounded-[14px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3.5">
            {/* Header & Master Toggle */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${notificationSettings.enabled ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                  {notificationSettings.enabled ? (
                    <BellRing className="w-4 h-4 animate-bounce-subtle" />
                  ) : (
                    <BellOff className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    맞춤 채용 푸시 알림 설정
                    <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full ${notificationSettings.enabled ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                      {notificationSettings.enabled ? '수신 중' : '꺼짐'}
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    마감 임박 및 관심 분야·기술 매칭 공고 알림
                  </p>
                </div>
              </div>

              {/* Master Toggle Switch */}
              <button
                type="button"
                onClick={handleToggleMasterNotification}
                role="switch"
                aria-checked={notificationSettings.enabled}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                  notificationSettings.enabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                    notificationSettings.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Quick Actions & Permission Status */}
            <div className="flex items-center justify-between flex-wrap gap-2 pt-0.5">
              <div className="text-[11px] flex items-center gap-1">
                <span className="text-slate-400">브라우저 알림:</span>
                {notificationPermission === 'granted' ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                    <Check className="w-3 h-3 stroke-[2.5]" /> 허용됨
                  </span>
                ) : notificationPermission === 'denied' ? (
                  <span className="text-amber-600 dark:text-amber-400 font-medium">
                    차단됨(설정 변경 필요)
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={onRequestNotificationPermission}
                    className="text-blue-600 dark:text-blue-400 font-bold underline hover:text-blue-700"
                  >
                    권한 허용하기
                  </button>
                )}
              </div>

              {/* Test Notification Trigger Button */}
              <button
                type="button"
                onClick={handleTriggerTest}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold transition-colors active:scale-95"
              >
                <Zap className="w-3 h-3 text-amber-500 fill-amber-400" />
                <span>{testSentFeedback ? '🔔 알림 발송됨!' : '알림 테스트 발송'}</span>
              </button>
            </div>

            {notificationSettings.enabled ? (
              <div className="space-y-4 pt-1">
                {/* 1. 마감 임박 공고 알림 (Deadline Closing Alert) */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-rose-500" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        마감 임박 공고 알림
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleToggleDeadlineAlert}
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md transition-colors ${
                        notificationSettings.deadlineAlertEnabled
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                      }`}
                    >
                      {notificationSettings.deadlineAlertEnabled ? '켜짐' : '꺼짐'}
                    </button>
                  </div>

                  {notificationSettings.deadlineAlertEnabled && (
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          알림 시점:
                        </span>
                        {[
                          { day: 3, label: 'D-3 (3일 전)' },
                          { day: 1, label: 'D-1 (하루 전)' },
                          { day: 0, label: 'D-Day (당일 마감)' },
                        ].map((item) => {
                          const isChecked = notificationSettings.deadlineDays.includes(item.day);
                          return (
                            <button
                              key={item.day}
                              type="button"
                              onClick={() => handleToggleDeadlineDay(item.day)}
                              className={`px-2 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                                isChecked
                                  ? 'bg-rose-600 text-white border-rose-600 font-bold shadow-2xs'
                                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              {isChecked && '✓ '}
                              {item.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Filter Bookmarked Only */}
                      <button
                        type="button"
                        onClick={handleToggleDeadlineBookmarkedOnly}
                        className="flex items-center gap-1.5 text-[11px] text-slate-700 dark:text-slate-300 hover:text-slate-900 cursor-pointer pt-0.5"
                      >
                        {notificationSettings.deadlineBookmarkedOnly ? (
                          <CheckSquare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 fill-blue-50 dark:fill-blue-950" />
                        ) : (
                          <Square className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        <span>내가 저장(북마크)한 공고만 마감 알림 받기</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. 신규 공고 알림 (New Job Alerts based on fields & technologies) */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        신규 맞춤 공고 등록 알림
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleToggleNewJobAlert}
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md transition-colors ${
                        notificationSettings.newJobAlertEnabled
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                      }`}
                    >
                      {notificationSettings.newJobAlertEnabled ? '켜짐' : '꺼짐'}
                    </button>
                  </div>

                  {notificationSettings.newJobAlertEnabled && (
                    <div className="space-y-3 pt-1">
                      {/* (A) 관심 분야 선택 */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            알림 받을 모빌리티 분야 ({notificationSettings.alertFields.length === 0 ? '전체' : `${notificationSettings.alertFields.length}개 선택`})
                          </span>
                          <div className="flex items-center gap-1.5 text-[10px]">
                            <button
                              type="button"
                              onClick={handleSelectAllFields}
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              전체선택
                            </button>
                            <span className="text-slate-300 dark:text-slate-600">|</span>
                            <button
                              type="button"
                              onClick={handleClearAlertFields}
                              className="text-slate-400 hover:underline"
                            >
                              선택해제
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {ALL_MOBILITY_FIELDS.map((fieldName) => {
                            const isSelected = notificationSettings.alertFields.includes(fieldName);
                            return (
                              <button
                                key={fieldName}
                                type="button"
                                onClick={() => handleToggleAlertField(fieldName)}
                                className={`px-2 py-0.5 rounded-lg text-[11px] font-medium border transition-all ${
                                  isSelected
                                    ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-2xs'
                                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                }`}
                              >
                                {isSelected && '✓ '}
                                {fieldName}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* (B) 관심 기술/역량 선택 */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            알림 받을 기술 키워드 ({notificationSettings.alertSkills.length}개 등록)
                          </span>
                          {mySkills.length > 0 && (
                            <button
                              type="button"
                              onClick={handleSyncMySkillsToAlerts}
                              className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                            >
                              내 보유기술 동기화
                            </button>
                          )}
                        </div>

                        {/* Selected skills chips */}
                        <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto pr-0.5">
                          {notificationSettings.alertSkills.map((sk) => (
                            <span
                              key={sk}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800 text-[11px] font-medium"
                            >
                              <span>{sk}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveAlertSkill(sk)}
                                className="text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-200"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                          {notificationSettings.alertSkills.length === 0 && (
                            <span className="text-[11px] text-slate-400">
                              * 등록된 키워드가 없으면 선택한 분야의 모든 신규 공고가 알림됩니다.
                            </span>
                          )}
                        </div>

                        {/* Add custom skill keyword form */}
                        <form onSubmit={handleAddCustomAlertSkill} className="flex items-center gap-1.5 pt-1">
                          <input
                            type="text"
                            value={newNotifySkillInput}
                            onChange={(e) => setNewNotifySkillInput(e.target.value)}
                            placeholder="기술 키워드 추가 (예: PyTorch, CANoe, QNX, AUTOSAR)"
                            className="flex-1 px-2.5 py-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <button
                            type="submit"
                            className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg shrink-0 transition-colors"
                          >
                            추가
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. 알림 수신 시간 및 효과음 */}
                <div className="flex items-center justify-between pt-1 text-[11px] flex-wrap gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">알림 발송:</span>
                    <select
                      value={notificationSettings.alertTime}
                      onChange={(e) => handleChangeAlertTime(e.target.value)}
                      className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-medium focus:outline-none"
                    >
                      <option value="08:00">오전 08:00</option>
                      <option value="09:00">오전 09:00 (추천)</option>
                      <option value="12:00">점심 12:00</option>
                      <option value="18:00">퇴근 18:00</option>
                      <option value="21:00">저녁 21:00</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleSound}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                      notificationSettings.soundEnabled
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {notificationSettings.soundEnabled ? (
                      <Volume2 className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <VolumeX className="w-3 h-3 text-slate-400" />
                    )}
                    <span>차임벨 효과음 {notificationSettings.soundEnabled ? '켜짐' : '꺼짐'}</span>
                  </button>
                </div>

                {/* 4. Live Match Status Indicator */}
                <div className="p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 text-[11px] text-blue-900 dark:text-blue-200 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>
                      설정 기준 매칭 공고: 마감 임박 <strong className="text-rose-600 dark:text-rose-400">{deadlineClosingJobs.length}건</strong> · 분야/기술 맞춤 <strong className="text-blue-600 dark:text-blue-400">{techFieldMatchedJobs.length}건</strong>
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 py-1">
                현재 푸시 알림이 꺼져 있습니다. 우측 상단 토글을 켜시면 마감 임박 공고와 맞춤 분야·기술 공고 알림을 실시간으로 수신할 수 있습니다.
              </p>
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

        {/* Right Column on Web: Majors, Skills & Certificates */}
        <div className="space-y-4">
          {/* 🎓 내 보유 전공 */}
          <div className="p-4 rounded-[14px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  내 보유 전공 ({myMajors.length}개 선택됨)
                </h3>
              </div>
              <span className="text-[10px] text-slate-400">
                우대 전공 매칭에 반영
              </span>
            </div>

            {/* Chips */}
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
              {allMajorChips.map((major) => {
                const isSelected = myMajors.includes(major);
                const isCustom = customMajors.includes(major);

                return (
                  <button
                    key={major}
                    type="button"
                    onClick={() => handleToggleMajor(major)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg font-medium border transition-all ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-600 font-bold shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
                    <span>{major}</span>
                    {isCustom && (
                      <span
                        className={`text-[9px] px-1 py-0.2 rounded-full ${
                          isSelected
                            ? 'bg-purple-700 text-purple-100'
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
            <form onSubmit={handleAddCustomMajor} className="flex items-center gap-1.5 pt-1">
              <input
                type="text"
                value={newMajorInput}
                onChange={(e) => setNewMajorInput(e.target.value)}
                placeholder="전공 직접 추가 (예: 스마트모빌리티공학, 제어계측)"
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 shrink-0 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>추가</span>
              </button>
            </form>
            <p className="text-[10px] text-slate-400">
              * 직접 추가한 전공은 칩을 눌러 해제 시 목록에서 자동 삭제됩니다.
            </p>
          </div>

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
