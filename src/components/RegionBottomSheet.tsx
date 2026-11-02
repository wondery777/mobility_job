import React, { useState } from 'react';
import { X, Check, RotateCcw, MapPin } from 'lucide-react';
import { REGIONS_DATA, RegionDefinition } from '../data';

export interface RegionFilterState {
  selectedProvinces: string[];
  districtMap: Record<string, string[]>; // province -> list of selected districts
}

interface RegionBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filterState: RegionFilterState;
  onApply: (newState: RegionFilterState) => void;
  matchingCount: number;
}

export const getRegionSummaryLabel = (filterState: RegionFilterState): string => {
  const { selectedProvinces, districtMap } = filterState;
  if (!selectedProvinces || selectedProvinces.length === 0) {
    return '지역';
  }

  const firstProvince = selectedProvinces[0];
  const totalSubDistricts = Object.values(districtMap).reduce(
    (acc, list) => acc + (list ? list.length : 0),
    0
  );

  if (selectedProvinces.length === 1) {
    const subs = districtMap[firstProvince] || [];
    if (subs.length === 0) {
      return `${firstProvince}`;
    }
    if (subs.length === 1) {
      return `${firstProvince} ${subs[0]}`;
    }
    return `${firstProvince} 세부 ${subs.length}`;
  }

  // 2 or more provinces: e.g. "서울 외 2 · 세부 1"
  const othersCount = selectedProvinces.length - 1;
  let label = `${firstProvince} 외 ${othersCount}`;
  if (totalSubDistricts > 0) {
    label += ` · 세부 ${totalSubDistricts}`;
  }
  return label;
};

export const matchesRegionFilter = (
  jobRegion: string,
  filterState: RegionFilterState
): boolean => {
  const { selectedProvinces, districtMap } = filterState;
  if (!selectedProvinces || selectedProvinces.length === 0) {
    return true;
  }

  // Find if job matches any selected province
  for (const prov of selectedProvinces) {
    if (jobRegion.includes(prov)) {
      const selectedSubs = districtMap[prov] || [];
      // If no sub-districts were chosen, the entire province matches!
      if (selectedSubs.length === 0) {
        return true;
      }
      // If specific sub-districts were chosen, check if jobRegion contains any of them
      const matchesSub = selectedSubs.some((sub) => jobRegion.includes(sub));
      if (matchesSub) {
        return true;
      }
    }
  }

  return false;
};

export const RegionBottomSheet: React.FC<RegionBottomSheetProps> = ({
  isOpen,
  onClose,
  filterState,
  onApply,
  matchingCount,
}) => {
  const [localProvinces, setLocalProvinces] = useState<string[]>(
    filterState.selectedProvinces
  );
  const [localDistrictMap, setLocalDistrictMap] = useState<Record<string, string[]>>(
    filterState.districtMap
  );
  // Active province tab for viewing sub-districts in the bottom sheet
  const [activeProvinceForDetail, setActiveProvinceForDetail] = useState<string>(
    filterState.selectedProvinces[0] || '서울'
  );

  if (!isOpen) return null;

  const toggleProvince = (prov: string) => {
    if (localProvinces.includes(prov)) {
      setLocalProvinces((prev) => prev.filter((p) => p !== prov));
      setLocalDistrictMap((prev) => {
        const next = { ...prev };
        delete next[prov];
        return next;
      });
    } else {
      setLocalProvinces((prev) => [...prev, prov]);
      setActiveProvinceForDetail(prov);
    }
  };

  const toggleDistrict = (province: string, district: string) => {
    // If province wasn't selected yet, auto-select it
    if (!localProvinces.includes(province)) {
      setLocalProvinces((prev) => [...prev, province]);
    }

    setLocalDistrictMap((prev) => {
      const currentList = prev[province] || [];
      const isExist = currentList.includes(district);
      const nextList = isExist
        ? currentList.filter((d) => d !== district)
        : [...currentList, district];
      return {
        ...prev,
        [province]: nextList,
      };
    });
  };

  const clearProvinceDistricts = (province: string) => {
    setLocalDistrictMap((prev) => ({
      ...prev,
      [province]: [],
    }));
  };

  const handleReset = () => {
    setLocalProvinces([]);
    setLocalDistrictMap({});
    setActiveProvinceForDetail('서울');
  };

  const handleConfirm = () => {
    onApply({
      selectedProvinces: localProvinces,
      districtMap: localDistrictMap,
    });
    onClose();
  };

  const activeRegionDef = REGIONS_DATA.find(
    (r) => r.province === activeProvinceForDetail
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="relative w-full max-w-[440px] bg-white dark:bg-slate-900 rounded-t-[20px] max-h-[85vh] flex flex-col shadow-2xl border-t border-slate-200 dark:border-slate-800 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-2.5 pb-1">
          <div className="w-10 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              근무 지역 선택
            </h3>
            {localProvinces.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[11px] font-semibold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                {localProvinces.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {/* Step 1: 17 Provinces */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                시·도 선택 (복수 선택 가능)
              </span>
              <span className="text-[11px] text-slate-400">
                총 17개 지역
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {REGIONS_DATA.map((r) => {
                const isSelected = localProvinces.includes(r.province);
                const isFocused = activeProvinceForDetail === r.province;
                const subsCount = (localDistrictMap[r.province] || []).length;

                return (
                  <button
                    key={r.province}
                    type="button"
                    onClick={() => {
                      toggleProvince(r.province);
                      setActiveProvinceForDetail(r.province);
                    }}
                    className={`relative px-2 py-2 text-xs font-medium rounded-xl border transition-all text-center flex flex-col items-center justify-center min-h-[44px] ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : isFocused
                        ? 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900'
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>{r.province}</span>
                      {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
                    </div>
                    {isSelected && subsCount > 0 && (
                      <span className="text-[10px] text-blue-200 font-normal">
                        세부 {subsCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Sub-districts for selected / active province */}
          {activeRegionDef && (
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {activeRegionDef.province} 세부 시·군·구
                  </span>
                  <span className="text-[11px] text-slate-400">
                    (미선택 시 {activeRegionDef.province} 전체 포함)
                  </span>
                </div>
                {(localDistrictMap[activeRegionDef.province] || []).length > 0 && (
                  <button
                    type="button"
                    onClick={() => clearProvinceDistricts(activeRegionDef.province)}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    세부 전체 선택 해제
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {activeRegionDef.districts.map((district) => {
                  const isChecked = (
                    localDistrictMap[activeRegionDef.province] || []
                  ).includes(district);

                  return (
                    <button
                      key={district}
                      type="button"
                      onClick={() =>
                        toggleDistrict(activeRegionDef.province, district)
                      }
                      className={`px-2.5 py-1.5 text-xs rounded-lg border transition-all ${
                        isChecked
                          ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {district}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center justify-center gap-1 px-3 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>초기화</span>
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            <span>공고 {matchingCount}건 보기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
