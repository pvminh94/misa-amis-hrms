import React, { useState } from 'react';
import { X, Calendar, Building, Sparkles, ShieldCheck, Check } from 'lucide-react';
import { Department, ShiftDefinition } from '../../../types';

interface BulkRosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments: Department[];
  shifts: ShiftDefinition[];
  defaultDepartment?: string;
  onApply: (data: {
    departmentName: string;
    shiftCode: string;
    shiftName: string;
    shiftId: string;
    startDay: number;
    endDay: number;
    includeWeekends: boolean;
  }) => void;
}

export const BulkRosterModal: React.FC<BulkRosterModalProps> = ({
  isOpen,
  onClose,
  departments,
  shifts,
  defaultDepartment = 'all',
  onApply
}) => {
  const [selectedDept, setSelectedDept] = useState(defaultDepartment !== 'all' ? defaultDepartment : 'all');
  const [selectedShiftCode, setSelectedShiftCode] = useState('CA-HC');
  const [startDay, setStartDay] = useState(1);
  const [endDay, setEndDay] = useState(30);
  const [includeWeekends, setIncludeWeekends] = useState(false);

  if (!isOpen) return null;

  const currentShift = shifts.find((s) => s.code === selectedShiftCode) || shifts[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply({
      departmentName: selectedDept,
      shiftCode: currentShift ? currentShift.code : 'CA-HC',
      shiftName: currentShift ? currentShift.name : 'Ca Hành Chính',
      shiftId: currentShift ? currentShift.id : 'shift-hc',
      startDay: Number(startDay),
      endDay: Number(endDay),
      includeWeekends
    });
  };

  const handleApplyPreset = (type: 'weekday_full' | 'week_current' | 'all_days') => {
    if (type === 'weekday_full') {
      setStartDay(1);
      setEndDay(30);
      setIncludeWeekends(false);
    } else if (type === 'week_current') {
      setStartDay(21);
      setEndDay(25);
      setIncludeWeekends(false);
    } else if (type === 'all_days') {
      setStartDay(1);
      setEndDay(30);
      setIncludeWeekends(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#0072BC] to-[#005A96] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Phân Ca Hàng Loạt (Bulk Shift Scheduling)</h3>
              <p className="text-[11px] text-blue-100">Áp dụng lịch phân ca nhanh theo phòng ban hoặc toàn công ty</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Preset Buttons */}
          <div className="space-y-1.5">
            <span className="text-slate-500 font-semibold block">Mẫu phân ca nhanh:</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleApplyPreset('weekday_full')}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-[#0072BC] text-slate-700 rounded-lg font-medium transition cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-[#0072BC]" />
                T2 - T6 Cả tháng 09
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('week_current')}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-[#0072BC] text-slate-700 rounded-lg font-medium transition cursor-pointer"
              >
                Tuần hiện tại (21 - 25/09)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('all_days')}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-[#0072BC] text-slate-700 rounded-lg font-medium transition cursor-pointer"
              >
                Toàn bộ 30 ngày (Bao gồm T7/CN)
              </button>
            </div>
          </div>

          {/* Department Selection */}
          <div className="space-y-1">
            <label className="text-slate-700 font-bold flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-[#0072BC]" />
              <span>Đối tượng áp dụng (Phòng ban)</span>
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#0072BC]/20"
            >
              <option value="all">Toàn bộ công ty (Tất cả nhân viên)</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name} ({d.employeeCount} nhân sự)
                </option>
              ))}
            </select>
          </div>

          {/* Shift Selection */}
          <div className="space-y-1">
            <label className="text-slate-700 font-bold">Chọn ca làm việc muốn phân bổ:</label>
            <div className="grid grid-cols-2 gap-2">
              {shifts.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedShiftCode(s.code)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                    selectedShiftCode === s.code
                      ? 'border-[#0072BC] bg-blue-50/50 ring-2 ring-[#0072BC]/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{s.name}</span>
                    {selectedShiftCode === s.code && <Check className="w-3.5 h-3.5 text-[#0072BC]" />}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 font-mono">
                    {s.startTime} - {s.endTime} ({s.workHours}h)
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Date Range Selection */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="space-y-1">
              <label className="text-slate-700 font-medium">Từ ngày (Tháng 09/2026):</label>
              <input
                type="number"
                min={1}
                max={30}
                value={startDay}
                onChange={(e) => setStartDay(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-700 font-medium">Đến ngày (Tháng 09/2026):</label>
              <input
                type="number"
                min={1}
                max={30}
                value={endDay}
                onChange={(e) => setEndDay(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
              />
            </div>
          </div>

          {/* Include Weekends checkbox */}
          <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={includeWeekends}
              onChange={(e) => setIncludeWeekends(e.target.checked)}
              className="w-4 h-4 text-[#0072BC] rounded border-slate-300 focus:ring-[#0072BC]"
            />
            <span className="text-slate-700 font-medium">
              Phân ca cả Thứ Bảy & Chủ Nhật (Bỏ chọn nếu nghỉ tuần tiêu chuẩn)
            </span>
          </label>

          {/* Labor Code Compliance Notice */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2 text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>Tuân thủ Bộ luật Lao động 2019 (Điều 110):</strong> Hệ thống tự động đảm bảo khoảng cách nghỉ ngơi giữa 2 ca làm việc liên tiếp tối thiểu 12 giờ.
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 font-semibold rounded-lg hover:bg-slate-50 transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#0072BC] hover:bg-[#005A96] text-white font-bold rounded-lg shadow-sm transition cursor-pointer active:scale-95"
            >
              Áp Dụng Phân Ca
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
