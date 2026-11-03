import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  Compass,
  LayoutDashboard,
  List,
  Flame,
  FileEdit,
  SendHorizontal,
  ChevronDown,
  BarChart2,
  TrendingUp,
  Target,
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
import { JobCard, calculateDday } from '../components/JobCard';

const ALL_MOBILITY_FIELDS: ('자율주행' | '전기차·배터리' | 'UAM·드론' | '모빌리티 서비스' | '차량용 SW·반도체' | '자동차 부품')[] = [
  '자율주행',
  '전기차·배터리',
  'UAM·드론',
  '모빌리티 서비스',
  '차량용 SW·반도체',
  '자동차 부품',
];

const GPA_STORAGE_KEY = 'mobility_job_gpa_v1';
const KANBAN_STORAGE_KEY = 'mobility_job_kanban_status_v1';

export type KanbanStatus = '관심' | '작성중' | '지원완료';

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
  userGpa?: string;
  onUpdateUserGpa?: (gpa: string) => void;
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
  userGpa,
  onUpdateUserGpa,
  viewMode = 'mobile',
  notificationSettings = DEFAULT_NOTIFICATION_SETTINGS,
  onUpdateNotificationSettings = () => {},
  onTriggerTestNotification,
  notificationPermission = 'default',
  onRequestNotificationPermission,
}) => {
  // Inputs
  const [newSkillInput, setNewSkillInput] = useState('');
  const [newCertInput, setNewCertInput] = useState('');
  const [newMajorInput, setNewMajorInput] = useState('');
  const [newNotifySkillInput, setNewNotifySkillInput] = useState('');

  // Dropdown AutoComplete focus states
  const [isMajorDropdownOpen, setIsMajorDropdownOpen] = useState(false);
  const [isSkillDropdownOpen, setIsSkillDropdownOpen] = useState(false);
  const [isCertDropdownOpen, setIsCertDropdownOpen] = useState(false);

  // GPA
  const [gpa, setGpa] = useState<string>(() => {
    try {
      return userGpa || localStorage.getItem(GPA_STORAGE_KEY) || '3.85';
    } catch {
      return '3.85';
    }
  });

  useEffect(() => {
    if (userGpa && userGpa !== gpa) {
      setGpa(userGpa);
    }
  }, [userGpa]);

  // Kanban view mode & statuses
  const [savedViewType, setSavedViewType] = useState<'list' | 'kanban'>('kanban');
  const [kanbanStatuses, setKanbanStatuses] = useState<Record<string, KanbanStatus>>(() => {
    try {
      const saved = localStorage.getItem(KANBAN_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [selectedNotice, setSelectedNotice] = useState<ColumnNotice | null>(null);
  const [testSentFeedback, setTestSentFeedback] = useState(false);

  // Refs for outside click handling
  const majorInputRef = useRef<HTMLDivElement>(null);
  const skillInputRef = useRef<HTMLDivElement>(null);
  const certInputRef = useRef<HTMLDivElement>(null);

  // Save GPA
  const handleGpaChange = (val: string) => {
    setGpa(val);
    try {
      localStorage.setItem(GPA_STORAGE_KEY, val);
    } catch (e) {
      console.error(e);
    }
    onUpdateUserGpa?.(val);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (majorInputRef.current && !majorInputRef.current.contains(e.target as Node)) {
        setIsMajorDropdownOpen(false);
      }
      if (skillInputRef.current && !skillInputRef.current.contains(e.target as Node)) {
        setIsSkillDropdownOpen(false);
      }
      if (certInputRef.current && !certInputRef.current.contains(e.target as Node)) {
        setIsCertDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Saved jobs list
  const savedJobs = jobs.filter((j) => bookmarkedJobIds.includes(j.id));

  // Update Kanban Status
  const handleSetKanbanStatus = (jobId: string, status: KanbanStatus) => {
    const next = { ...kanbanStatuses, [jobId]: status };
    setKanbanStatuses(next);
    try {
      localStorage.setItem(KANBAN_STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error(e);
    }
  };

  // --- AutoComplete Suggestions ---
  const majorSuggestions = useMemo(() => {
    const query = newMajorInput.trim().toLowerCase();
    if (!query) return [];
    return INITIAL_MAJORS.filter(
      (m) => !myMajors.includes(m) && m.toLowerCase().includes(query)
    ).slice(0, 6);
  }, [newMajorInput, myMajors]);

  const skillSuggestions = useMemo(() => {
    const query = newSkillInput.trim().toLowerCase();
    if (!query) return [];
    return INITIAL_SKILLS.filter(
      (s) => !mySkills.includes(s) && s.toLowerCase().includes(query)
    ).slice(0, 6);
  }, [newSkillInput, mySkills]);

  const certSuggestions = useMemo(() => {
    const query = newCertInput.trim().toLowerCase();
    if (!query) return [];
    return INITIAL_CERTIFICATES.filter(
      (c) => !myCertificates.includes(c) && c.toLowerCase().includes(query)
    ).slice(0, 6);
  }, [newCertInput, myCertificates]);

  // --- Skill Handlers ---
  const handleToggleSkill = (skill: string) => {
    const isSelected = mySkills.includes(skill);
    const isCustom = customSkills.includes(skill);

    if (isSelected) {
      onUpdateMySkills(mySkills.filter((s) => s !== skill));
      if (isCustom) {
        onUpdateCustomSkills(customSkills.filter((s) => s !== skill));
      }
    } else {
      onUpdateMySkills([...mySkills, skill]);
    }
  };

  const handleSelectSkill = (skill: string) => {
    if (!mySkills.includes(skill)) {
      onUpdateMySkills([...mySkills, skill]);
    }
    setNewSkillInput('');
    setIsSkillDropdownOpen(false);
  };

  const handleAddCustomSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = newSkillInput.trim();
    if (!val) return;

    if (skillSuggestions.length > 0 && skillSuggestions[0].toLowerCase() === val.toLowerCase()) {
      handleSelectSkill(skillSuggestions[0]);
      return;
    }

    if (!INITIAL_SKILLS.includes(val) && !customSkills.includes(val)) {
      onUpdateCustomSkills([...customSkills, val]);
    }
    if (!mySkills.includes(val)) {
      onUpdateMySkills([...mySkills, val]);
    }
    setNewSkillInput('');
    setIsSkillDropdownOpen(false);
  };

  // --- Certificate Handlers ---
  const handleToggleCert = (cert: string) => {
    const isSelected = myCertificates.includes(cert);
    const isCustom = customCertificates.includes(cert);

    if (isSelected) {
      onUpdateMyCertificates(myCertificates.filter((c) => c !== cert));
      if (isCustom) {
        onUpdateCustomCertificates(customCertificates.filter((c) => c !== cert));
      }
    } else {
      onUpdateMyCertificates([...myCertificates, cert]);
    }
  };

  const handleSelectCert = (cert: string) => {
    if (!myCertificates.includes(cert)) {
      onUpdateMyCertificates([...myCertificates, cert]);
    }
    setNewCertInput('');
    setIsCertDropdownOpen(false);
  };

  const handleAddCustomCert = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = newCertInput.trim();
    if (!val) return;

    if (certSuggestions.length > 0 && certSuggestions[0].toLowerCase() === val.toLowerCase()) {
      handleSelectCert(certSuggestions[0]);
      return;
    }

    if (!INITIAL_CERTIFICATES.includes(val) && !customCertificates.includes(val)) {
      onUpdateCustomCertificates([...customCertificates, val]);
    }
    if (!myCertificates.includes(val)) {
      onUpdateMyCertificates([...myCertificates, val]);
    }
    setNewCertInput('');
    setIsCertDropdownOpen(false);
  };

  // --- Major Handlers ---
  const handleToggleMajor = (major: string) => {
    const isSelected = myMajors.includes(major);
    const isCustom = customMajors.includes(major);

    if (isSelected) {
      onUpdateMyMajors(myMajors.filter((m) => m !== major));
      if (isCustom) {
        onUpdateCustomMajors(customMajors.filter((m) => m !== major));
      }
    } else {
      onUpdateMyMajors([...myMajors, major]);
    }
  };

  const handleSelectMajor = (major: string) => {
    if (!myMajors.includes(major)) {
      onUpdateMyMajors([...myMajors, major]);
    }
    setNewMajorInput('');
    setIsMajorDropdownOpen(false);
  };

  const handleAddCustomMajor = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = newMajorInput.trim();
    if (!val) return;

    if (majorSuggestions.length > 0 && majorSuggestions[0].toLowerCase() === val.toLowerCase()) {
      handleSelectMajor(majorSuggestions[0]);
      return;
    }

    if (!INITIAL_MAJORS.includes(val) && !customMajors.includes(val)) {
      onUpdateCustomMajors([...customMajors, val]);
    }
    if (!myMajors.includes(val)) {
      onUpdateMyMajors([...myMajors, val]);
    }
    setNewMajorInput('');
    setIsMajorDropdownOpen(false);
  };

  // --- Notification Handlers ---
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

  // Notification match calculation
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

  // ==============================================================
  // 🧭 Competence Radar Chart Calculations (방사형 스펙 진단)
  // ==============================================================
  const radarData = useMemo(() => {
    const hasAny = (list: string[], targets: string[]) => {
      return targets.some((t) =>
        list.some((item) => item.toLowerCase().includes(t.toLowerCase()))
      );
    };

    const countMatches = (list: string[], targets: string[]) => {
      return targets.filter((t) =>
        list.some((item) => item.toLowerCase().includes(t.toLowerCase()))
      ).length;
    };

    // 1. 자율주행 SW
    const autoSwSkills = ['c++', 'ros', 'python', 'linux', 'cuda', 'slam', 'point cloud', '칼만'];
    const autoSwMajors = ['컴퓨터공학과', '로봇공학과', '소프트웨어학과', 'ai·데이터공학과'];
    const autoSwScore = Math.min(
      100,
      countMatches(mySkills, autoSwSkills) * 22 +
        (hasAny(myMajors, autoSwMajors) ? 30 : 0) +
        (myCertificates.includes('정보처리기사') ? 15 : 0)
    );

    // 2. SDV & 임베디드 제어
    const sdvSkills = ['autosar', 'can', 'c', 'simulink', 'matlab', 'rtos', 'linux', 'docker'];
    const sdvMajors = ['전자공학과', '제어계측공학과', '전기공학과', '컴퓨터공학과'];
    const sdvScore = Math.min(
      100,
      countMatches(mySkills, sdvSkills) * 24 +
        (hasAny(myMajors, sdvMajors) ? 30 : 0) +
        (hasAny(myCertificates, ['임베디드기사', '정보처리기사']) ? 15 : 0)
    );

    // 3. 전기차 & 배터리
    const evSkills = ['catia', 'ansys', 'bms', '배터리', '열해석', 'solidworks'];
    const evMajors = ['화학공학과', '신소재공학과', '전기공학과', '기계공학과'];
    const evScore = Math.min(
      100,
      countMatches(mySkills, evSkills) * 25 +
        (hasAny(myMajors, evMajors) ? 35 : 0) +
        (hasAny(myCertificates, ['전기기사', '화공기사']) ? 20 : 0)
    );

    // 4. 차체 & 기계설계
    const mechSkills = ['catia', 'ansys', 'autocad', 'solidworks', 'matlab', 'simulink'];
    const mechMajors = ['기계공학과', '자동차공학과', '메카트로닉스공학과', '항공우주공학과'];
    const mechScore = Math.min(
      100,
      countMatches(mySkills, mechSkills) * 25 +
        (hasAny(myMajors, mechMajors) ? 35 : 0) +
        (hasAny(myCertificates, ['일반기계기사', '기계기사']) ? 20 : 0)
    );

    // 5. AI & 대용량 데이터
    const aiSkills = ['python', 'pytorch', 'tensorflow', 'sql', 'docker', 'aws', 'kafka', 'spark'];
    const aiMajors = ['ai·데이터공학과', '컴퓨터공학과', '산업공학과', '소프트웨어학과'];
    const aiScore = Math.min(
      100,
      countMatches(mySkills, aiSkills) * 22 +
        (hasAny(myMajors, aiMajors) ? 30 : 0) +
        (hasAny(myCertificates, ['sqld', '빅데이터분석기사']) ? 18 : 0)
    );

    // 6. 안전규격 & 네트워크
    const safeSkills = ['can', 'iso 26262', 'v2x', '통신', '기능안전', 'git', 'linux'];
    const safeMajors = ['통신공학과', '전자공학과', '산업공학과'];
    const safeScore = Math.min(
      100,
      countMatches(mySkills, safeSkills) * 24 +
        (hasAny(myMajors, safeMajors) ? 25 : 0) +
        (hasAny(myCertificates, ['무선설비기사', '정보처리기사']) ? 25 : 0)
    );

    return [
      { label: '자율주행 SW', score: Math.max(15, autoSwScore) },
      { label: 'SDV & 제어', score: Math.max(15, sdvScore) },
      { label: '전기차 & 배터리', score: Math.max(15, evScore) },
      { label: '차체 & 기계', score: Math.max(15, mechScore) },
      { label: 'AI & 데이터', score: Math.max(15, aiScore) },
      { label: '안전 & 통신', score: Math.max(15, safeScore) },
    ];
  }, [mySkills, myCertificates, myMajors]);

  // Overall competence average score
  const overallCompetence = useMemo(() => {
    const sum = radarData.reduce((acc, cur) => acc + cur.score, 0);
    return Math.round(sum / radarData.length);
  }, [radarData]);

  // All display chips
  const allSkillChips = Array.from(new Set([...INITIAL_SKILLS, ...customSkills]));
  const allCertChips = Array.from(new Set([...INITIAL_CERTIFICATES, ...customCertificates]));
  const allMajorChips = Array.from(new Set([...INITIAL_MAJORS, ...customMajors]));

  // Categorize Saved Jobs by Kanban
  const kanbanColumns = useMemo(() => {
    const interest: Job[] = [];
    const drafting: Job[] = [];
    const applied: Job[] = [];

    savedJobs.forEach((job) => {
      const status = kanbanStatuses[job.id] || '관심';
      if (status === '지원완료') applied.push(job);
      else if (status === '작성중') drafting.push(job);
      else interest.push(job);
    });

    return { interest, drafting, applied };
  }, [savedJobs, kanbanStatuses]);

  // Helper for Radar SVG coordinates
  const radarCenter = { x: 130, y: 125 };
  const radarRadius = 80;

  const getCoordinates = (index: number, scoreRatio: number) => {
    const total = 6;
    const angle = (index * (2 * Math.PI) / total) - Math.PI / 2;
    const r = radarRadius * scoreRatio;
    return {
      x: radarCenter.x + r * Math.cos(angle),
      y: radarCenter.y + r * Math.sin(angle),
    };
  };

  const radarPolygonPoints = radarData
    .map((item, idx) => {
      const pt = getCoordinates(idx, item.score / 100);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');

  return (
    <div className="space-y-4 px-3 py-3 pb-8">
      {/* Profile Header with GPA Integration */}
      <div className="p-4 rounded-[16px] bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white shadow-md border border-blue-900/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/30 backdrop-blur-md flex items-center justify-center text-cyan-300 border border-blue-400/30 shadow-inner">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-extrabold text-white">모빌리티 구직자 프로필</h2>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-400 text-emerald-950">
                  READY
                </span>
              </div>
              <p className="text-xs text-slate-300">
                보유 전공 {myMajors.length}개 · 기술 {mySkills.length}개 · 자격증 {myCertificates.length}개
              </p>
            </div>
          </div>

          {/* Academic GPA Quick Input / Badge */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-2 text-right">
            <div className="text-[10px] font-semibold text-slate-400">학부 학점 (GPA)</div>
            <div className="flex items-center gap-1 mt-0.5 justify-end">
              <input
                type="number"
                step="0.01"
                min="0"
                max="4.5"
                value={gpa}
                onChange={(e) => handleGpaChange(e.target.value)}
                className="w-12 text-right font-extrabold text-sm text-cyan-300 bg-transparent border-b border-cyan-400/50 focus:outline-none"
              />
              <span className="text-xs text-slate-400 font-bold">/ 4.5</span>
            </div>
            <div className="text-[9px] font-bold text-emerald-400 mt-0.5">
              {parseFloat(gpa) >= 4.0
                ? '최우수 🏆'
                : parseFloat(gpa) >= 3.5
                ? '우수 ⭐'
                : '보통 👍'}
            </div>
          </div>
        </div>
      </div>

      {/* 🧭 방사형 스펙 진단 차트 (Competence Radar Chart) */}
      <div className="p-4 rounded-[16px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>모빌리티 역량 방사형 스펙 진단</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
                  종합 {overallCompetence}점
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">
                등록된 전공·보유기술·자격증을 6대 모빌리티 영역으로 분석
              </p>
            </div>
          </div>
        </div>

        {/* Pure SVG Radar Chart */}
        <div className="flex flex-col sm:flex-row items-center justify-around gap-4 pt-1">
          <div className="w-[260px] h-[250px] relative select-none">
            <svg viewBox="0 0 260 250" className="w-full h-full">
              <defs>
                <linearGradient id="radarFillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* Concentric Guide Webs (25%, 50%, 75%, 100%) */}
              {[0.25, 0.5, 0.75, 1.0].map((ratio, i) => {
                const ringPoints = [0, 1, 2, 3, 4, 5]
                  .map((idx) => {
                    const pt = getCoordinates(idx, ratio);
                    return `${pt.x},${pt.y}`;
                  })
                  .join(' ');
                return (
                  <polygon
                    key={i}
                    points={ringPoints}
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth={ratio === 1.0 ? '1' : '0.6'}
                    strokeDasharray={ratio === 1.0 ? 'none' : '2 3'}
                    opacity="0.35"
                  />
                );
              })}

              {/* Axis Spoke Lines */}
              {[0, 1, 2, 3, 4, 5].map((idx) => {
                const pt = getCoordinates(idx, 1.0);
                return (
                  <line
                    key={idx}
                    x1={radarCenter.x}
                    y1={radarCenter.y}
                    x2={pt.x}
                    y2={pt.y}
                    stroke="#94a3b8"
                    strokeWidth="0.8"
                    opacity="0.3"
                  />
                );
              })}

              {/* Data Area Polygon */}
              <polygon
                points={radarPolygonPoints}
                fill="url(#radarFillGrad)"
                stroke="#06b6d4"
                strokeWidth="2"
              />

              {/* Vertex Circles and Numeric Dots */}
              {radarData.map((item, idx) => {
                const pt = getCoordinates(idx, item.score / 100);
                return (
                  <g key={idx}>
                    <circle cx={pt.x} cy={pt.y} r="3.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.2" />
                  </g>
                );
              })}

              {/* Axis Labels */}
              {radarData.map((item, idx) => {
                const labelPt = getCoordinates(idx, 1.25);
                return (
                  <text
                    key={idx}
                    x={labelPt.x}
                    y={labelPt.y + (idx === 0 ? -4 : idx === 3 ? 6 : 2)}
                    textAnchor="middle"
                    className="text-[9.5px] font-bold fill-slate-700 dark:fill-slate-300"
                  >
                    {item.label}
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Quick Score Bars on side */}
          <div className="w-full sm:w-[150px] space-y-1.5 text-xs">
            {radarData.map((item) => (
              <div key={item.label} className="space-y-0.5">
                <div className="flex justify-between text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                  <span className="truncate">{item.label}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{item.score}점</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 👥 모빌리티 합격자 스펙 컷라인 & 내 스펙 위치 (Industry Spec Benchmark) */}
      <div className="p-4 rounded-[16px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>합격자 스펙 컷라인 & 내 위치</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  모빌리티 벤치마크
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">
                주요 완성차·모빌리티 스타트업 최근 최종 합격자 평균 스펙 대비 1:1 비교
              </p>
            </div>
          </div>
        </div>

        {/* 3대 스펙 1:1 비교 바 차트 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
          {/* 1. 학부 학점 (GPA) */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-purple-500" />
                학부 학점 (GPA)
              </span>
              <span className="text-[10px] text-slate-500">
                합격선: 3.78
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="w-10 text-slate-400 font-medium">내 학점</span>
                <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${Math.min(100, (parseFloat(gpa || '3.85') / 4.5) * 100)}%` }}
                  />
                </div>
                <span className="w-8 text-right font-bold text-slate-800 dark:text-slate-200">
                  {parseFloat(gpa || '3.85').toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="w-10 text-slate-400 font-medium">합격평균</span>
                <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(3.78 / 4.5) * 100}%` }} />
                </div>
                <span className="w-8 text-right font-bold text-emerald-600">3.78</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-[10px] pt-0.5">
              <span className="text-slate-500">
                {parseFloat(gpa || '3.85') >= 3.78
                  ? `+${(parseFloat(gpa || '3.85') - 3.78).toFixed(2)}점 상회`
                  : `-${(3.78 - parseFloat(gpa || '3.85')).toFixed(2)}점`}
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {parseFloat(gpa || '3.85') >= 3.78 ? '안정권 🟢' : '보완 권장 🟡'}
              </span>
            </div>
          </div>

          {/* 2. 보유 자격증 */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                보유 자격증
              </span>
              <span className="text-[10px] text-slate-500">
                합격선: 2.1개
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="w-10 text-slate-400 font-medium">내 보유</span>
                <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${Math.min(100, (myCertificates.length / 4) * 100)}%` }}
                  />
                </div>
                <span className="w-8 text-right font-bold text-slate-800 dark:text-slate-200">
                  {myCertificates.length}개
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="w-10 text-slate-400 font-medium">합격평균</span>
                <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(2.1 / 4) * 100}%` }} />
                </div>
                <span className="w-8 text-right font-bold text-emerald-600">2.1개</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-[10px] pt-0.5">
              <span className="text-slate-500">
                {myCertificates.length >= 2 ? '합격선 도달' : '우대자격 보완 추천'}
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {myCertificates.length >= 2 ? '충족 🟢' : '보완 권장 🟡'}
              </span>
            </div>
          </div>

          {/* 3. 모빌리티 직무 기술 스택 */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <Wrench className="w-3.5 h-3.5 text-blue-500" />
                보유 기술 스택
              </span>
              <span className="text-[10px] text-slate-500">
                합격선: 5.5개
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="w-10 text-slate-400 font-medium">내 보유</span>
                <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${Math.min(100, (mySkills.length / 8) * 100)}%` }}
                  />
                </div>
                <span className="w-8 text-right font-bold text-slate-800 dark:text-slate-200">
                  {mySkills.length}개
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="w-10 text-slate-400 font-medium">합격평균</span>
                <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(5.5 / 8) * 100}%` }} />
                </div>
                <span className="w-8 text-right font-bold text-emerald-600">5.5개</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-[10px] pt-0.5">
              <span className="text-slate-500">
                {mySkills.length >= 5 ? '기술 다양성 우수' : '핵심 스택 추가 등록 필요'}
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {mySkills.length >= 5 ? '우수 🚀' : '확장 권장 💡'}
              </span>
            </div>
          </div>
        </div>

        {/* 종합 벤치마크 조언 */}
        <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 text-xs flex items-start gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
            💡 <strong>합격자 데이터 진단:</strong> 모빌리티 SW 및 전동화 분야는 단순 학점보다 <strong>실무 깃허브(GitHub) 프로젝트 코드</strong>와 <strong>직무 맞춤형 기술 스택</strong>이 서류 및 기술면접 합격률의 70% 이상을 좌우합니다.
          </p>
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
        {/* Left Column on Web: Kanban Board & Saved Jobs */}
        <div className="space-y-4">
          {/* ⭐ 저장한 공고 & 지원 현황 칸반 보드 */}
          <div className="p-4 rounded-[16px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  내 채용 지원 현황
                </h3>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  {savedJobs.length}건
                </span>
              </div>

              {/* View mode toggle: List vs Kanban */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setSavedViewType('kanban')}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all ${
                    savedViewType === 'kanban'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-cyan-400 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <LayoutDashboard className="w-3 h-3" />
                  <span>칸반</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSavedViewType('list')}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all ${
                    savedViewType === 'list'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-cyan-400 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <List className="w-3 h-3" />
                  <span>목록</span>
                </button>
              </div>
            </div>

            {savedJobs.length > 0 ? (
              savedViewType === 'kanban' ? (
                /* Kanban Columns View */
                <div className="space-y-3 pt-1">
                  {[
                    {
                      id: 'interest',
                      label: '📌 관심 공고 (스크랩)',
                      items: kanbanColumns.interest,
                      targetStatus: '관심' as KanbanStatus,
                      badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
                    },
                    {
                      id: 'drafting',
                      label: '📝 서류 작성 중',
                      items: kanbanColumns.drafting,
                      targetStatus: '작성중' as KanbanStatus,
                      badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
                    },
                    {
                      id: 'applied',
                      label: '🚀 지원 완료 (결과 대기)',
                      items: kanbanColumns.applied,
                      targetStatus: '지원완료' as KanbanStatus,
                      badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
                    },
                  ].map((column) => (
                    <div
                      key={column.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                        <span>{column.label}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${column.badgeColor}`}>
                          {column.items.length}건
                        </span>
                      </div>

                      {column.items.length > 0 ? (
                        <div className="space-y-2">
                          {column.items.map((job) => {
                            const dDay = calculateDday(job.deadline);
                            const currentStatus = kanbanStatuses[job.id] || '관심';
                            return (
                              <div
                                key={job.id}
                                className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-2"
                              >
                                <div
                                  onClick={() => onSelectJob(job)}
                                  className="cursor-pointer hover:opacity-80 transition-opacity"
                                >
                                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">{job.company}</span>
                                    <span className={dDay.isUrgent ? 'text-rose-500 font-bold' : ''}>
                                      {dDay.label}
                                    </span>
                                  </div>
                                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight mt-0.5 line-clamp-1">
                                    {job.title}
                                  </h4>
                                </div>

                                {/* Status Switcher Buttons */}
                                <div className="flex items-center gap-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                                  {(['관심', '작성중', '지원완료'] as KanbanStatus[]).map((st) => (
                                    <button
                                      key={st}
                                      type="button"
                                      onClick={() => handleSetKanbanStatus(job.id, st)}
                                      className={`flex-1 py-1 text-[10px] font-bold rounded transition-colors ${
                                        currentStatus === st
                                          ? 'bg-blue-600 text-white'
                                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                                      }`}
                                    >
                                      {st}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="py-3 text-center text-[11px] text-slate-400">
                          해당 단계의 공고가 없습니다.
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                /* Traditional List View */
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
              )
            ) : (
              <div className="p-6 rounded-[14px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center space-y-1.5">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  아직 저장한 공고가 없습니다.
                </p>
                <p className="text-[11px] text-slate-400">
                  공고 카드의 별표(★)를 눌러 관심 공고를 저장하고 지원 현황을 관리해보세요.
                </p>
              </div>
            )}
          </div>

          {/* 🔔 맞춤 채용 푸시 알림 설정 */}
          <div className="p-4 rounded-[16px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3.5">
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

            {/* Browser Permission & Test Notification */}
            <div className="flex items-center justify-between flex-wrap gap-2 pt-0.5">
              <div className="text-[11px] flex items-center gap-1">
                <span className="text-slate-400">브라우저 알림:</span>
                {notificationPermission === 'granted' ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                    <Check className="w-3 h-3 stroke-[2.5]" /> 허용됨
                  </span>
                ) : notificationPermission === 'denied' ? (
                  <span className="text-amber-600 dark:text-amber-400 font-medium">
                    차단됨 (브라우저 설정 변경 필요)
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
              <div className="space-y-3.5 pt-1">
                {/* 1. 마감 임박 알림 */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 space-y-2">
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
                          { day: 3, label: 'D-3' },
                          { day: 1, label: 'D-1' },
                          { day: 0, label: 'D-Day' },
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

                {/* 2. 신규 맞춤 공고 알림 */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 space-y-2.5">
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
                    <div className="space-y-2.5 pt-1">
                      {/* Fields */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            알림 모빌리티 분야 ({notificationSettings.alertFields.length === 0 ? '전체' : `${notificationSettings.alertFields.length}개 선택`})
                          </span>
                          <div className="flex items-center gap-1 text-[10px]">
                            <button type="button" onClick={handleSelectAllFields} className="text-blue-600 dark:text-blue-400 hover:underline">
                              전체
                            </button>
                            <span className="text-slate-400">|</span>
                            <button type="button" onClick={handleClearAlertFields} className="text-slate-400 hover:underline">
                              해제
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
                                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                                }`}
                              >
                                {isSelected && '✓ '}
                                {fieldName}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            알림 기술 키워드 ({notificationSettings.alertSkills.length}개)
                          </span>
                          {mySkills.length > 0 && (
                            <button
                              type="button"
                              onClick={handleSyncMySkillsToAlerts}
                              className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                            >
                              내 기술 동기화
                            </button>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                          {notificationSettings.alertSkills.map((sk) => (
                            <span
                              key={sk}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800 text-[11px] font-medium"
                            >
                              <span>{sk}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveAlertSkill(sk)}
                                className="text-indigo-400 hover:text-indigo-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>

                        <form onSubmit={handleAddCustomAlertSkill} className="flex items-center gap-1 pt-1">
                          <input
                            type="text"
                            value={newNotifySkillInput}
                            onChange={(e) => setNewNotifySkillInput(e.target.value)}
                            placeholder="기술 키워드 추가 (예: PyTorch, CANoe)"
                            className="flex-1 px-2.5 py-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                          />
                          <button
                            type="submit"
                            className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg shrink-0"
                          >
                            추가
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. 시간 및 효과음 */}
                <div className="flex items-center justify-between pt-1 text-[11px] flex-wrap gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">알림 시각:</span>
                    <select
                      value={notificationSettings.alertTime}
                      onChange={(e) => handleChangeAlertTime(e.target.value)}
                      className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-[11px]"
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
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border ${
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
                    <span>차임벨 {notificationSettings.soundEnabled ? '켜짐' : '꺼짐'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 py-1">
                현재 푸시 알림이 꺼져 있습니다. 토글을 켜시면 마감 임박 및 맞춤 공고 알림을 수신할 수 있습니다.
              </p>
            )}
          </div>

          {/* 📢 운영자 공지·칼럼 */}
          <div className="p-4 rounded-[16px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2.5">
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

        {/* Right Column on Web: Majors, Skills & Certificates with AutoComplete Dropdowns */}
        <div className="space-y-4">
          {/* 🎓 내 보유 전공 (with Live AutoComplete Dropdown) */}
          <div className="p-4 rounded-[16px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
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
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
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
                      <span className="text-[9px] px-1 rounded-full bg-purple-700 text-purple-100">
                        직접
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Input with Real-time AutoComplete Floating Dropdown */}
            <div ref={majorInputRef} className="relative pt-1">
              <form onSubmit={handleAddCustomMajor} className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={newMajorInput}
                  onChange={(e) => {
                    setNewMajorInput(e.target.value);
                    setIsMajorDropdownOpen(true);
                  }}
                  onFocus={() => setIsMajorDropdownOpen(true)}
                  placeholder="전공 검색 또는 직접 추가 (예: 기계공학, 컴퓨터)"
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

              {/* Floating AutoComplete Dropdown */}
              {isMajorDropdownOpen && majorSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-white dark:bg-slate-800 rounded-xl border border-purple-200 dark:border-purple-900/60 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border-b border-purple-100 dark:border-purple-900/40">
                    추천 전공 목록 (클릭 시 즉시 등록)
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-700/60 max-h-48 overflow-y-auto">
                    {majorSuggestions.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => handleSelectMajor(m)}
                        className="w-full px-3 py-2 text-left text-xs text-slate-800 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/60 flex items-center justify-between transition-colors"
                      >
                        <span className="font-semibold">{m}</span>
                        <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">+ 등록</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 🛠 내 보유 기술 (with Live AutoComplete Dropdown) */}
          <div className="p-4 rounded-[16px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  내 보유 기술 ({mySkills.length}개 선택됨)
                </h3>
              </div>
              <span className="text-[10px] text-slate-400">
                공고 상세 매칭률에 반영
              </span>
            </div>

            {/* Chips */}
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
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
                      <span className="text-[9px] px-1 rounded-full bg-blue-700 text-blue-100">
                        직접
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Input with Real-time AutoComplete Floating Dropdown */}
            <div ref={skillInputRef} className="relative pt-1">
              <form onSubmit={handleAddCustomSkill} className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => {
                    setNewSkillInput(e.target.value);
                    setIsSkillDropdownOpen(true);
                  }}
                  onFocus={() => setIsSkillDropdownOpen(true)}
                  placeholder="기술 검색 또는 직접 추가 (예: C++, ROS, AUTOSAR)"
                  className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 shrink-0 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>추가</span>
                </button>
              </form>

              {/* Floating AutoComplete Dropdown */}
              {isSkillDropdownOpen && skillSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-white dark:bg-slate-800 rounded-xl border border-blue-200 dark:border-blue-900/60 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 border-b border-blue-100 dark:border-blue-900/40">
                    추천 기술 스택 (클릭 시 즉시 등록)
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-700/60 max-h-48 overflow-y-auto">
                    {skillSuggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleSelectSkill(s)}
                        className="w-full px-3 py-2 text-left text-xs text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/60 flex items-center justify-between transition-colors"
                      >
                        <span className="font-semibold">{s}</span>
                        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">+ 등록</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 📜 내 보유 자격증 (with Live AutoComplete Dropdown) */}
          <div className="p-4 rounded-[16px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
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
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
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
                      <span className="text-[9px] px-1 rounded-full bg-emerald-700 text-emerald-100">
                        직접
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Input with Real-time AutoComplete Floating Dropdown */}
            <div ref={certInputRef} className="relative pt-1">
              <form onSubmit={handleAddCustomCert} className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={newCertInput}
                  onChange={(e) => {
                    setNewCertInput(e.target.value);
                    setIsCertDropdownOpen(true);
                  }}
                  onFocus={() => setIsCertDropdownOpen(true)}
                  placeholder="자격증 검색 또는 직접 추가 (예: 정보처리기사, 전기기사)"
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

              {/* Floating AutoComplete Dropdown */}
              {isCertDropdownOpen && certSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-white dark:bg-slate-800 rounded-xl border border-emerald-200 dark:border-emerald-900/60 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-100 dark:border-emerald-900/40">
                    추천 자격증 목록 (클릭 시 즉시 등록)
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-700/60 max-h-48 overflow-y-auto">
                    {certSuggestions.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => handleSelectCert(c)}
                        className="w-full px-3 py-2 text-left text-xs text-slate-800 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 flex items-center justify-between transition-colors"
                      >
                        <span className="font-semibold">{c}</span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">+ 등록</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
