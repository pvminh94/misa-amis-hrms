import React, { useState } from 'react';
import { X, Calendar, Clock, Check } from 'lucide-react';
import { ShiftDefinition, DayRosterSchedule } from '../../../types';

interface RosterCellModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeName: string;
  day: number;
  currentSchedule?: DayRosterSchedule;
  shifts: ShiftDefinition[];
  onSave: (day: number, schedule: DayRosterSchedule) => void;
}

export const RosterCellModal: React.FC<RosterCellModalProps> = ({
  isOpen,
  onClose,
  employeeName,
  day,
  currentSchedule,
  shifts,
  onSave
}) => {
  const [selectedShiftCode, setSelectedShiftCode] = useState(currentSchedule?.shiftCode || 'CA-HC');
  const [notes, setNotes] = useState(currentSchedule?.notes || '');

  if (!isOpen) return null;

  const handleSave = () => {
    let chosenShift: DayRosterSchedule;
    if (selectedShiftCode === 'OFF') {
      chosenShift = {
        shiftId: 'shift-off',
        shiftCode: 'OFF',
        shiftName: 'Nghỉ tuần',
        isCustom: true,
        notes
      };
    } else {
      const match = shifts.find((s) => s.code === selectedShiftCode) || shifts[0];
      chosenShift = {
        shiftId: match.id,
        shiftCode: match.code,
        shiftName: match.name,
        isCustom: true,
        notes
      };
    }
    onSave(day, chosenShift);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#0072BC]" />
            <div>
              <h3 className="font-bold text-xs">Điều Chỉnh Ca Làm Việc Cá Nhân</h3>
              <p className="text-[10px] text-slate-300">
                {employeeName} • Ngày {day}/09/2026
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-700 font-bold block">Chọn ca phân bổ cho ngày {day}/09:</label>
            <div className="space-y-2">
              {shifts.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedShiftCode(s.code)}
                  className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    selectedShiftCode === s.code
                      ? 'border-[#0072BC] bg-blue-50/50 ring-2 ring-[#0072BC]/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <span className="font-bold text-slate-900">{s.name}</span>
                    <span className="text-slate-500 text-[11px] block font-mono">
                      {s.startTime} - {s.endTime} ({s.workHours}h công, {s.coefficient}x)
                    </span>
                  </div>
                  {selectedShiftCode === s.code && <Check className="w-4 h-4 text-[#0072BC]" />}
                </div>
              ))}

              {/* Day Off Option */}
              <div
                onClick={() => setSelectedShiftCode('OFF')}
                className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                  selectedShiftCode === 'OFF'
                    ? 'border-slate-600 bg-slate-100 ring-2 ring-slate-400'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <span className="font-bold text-slate-700">Nghỉ Tuần / Ngày Nghỉ (OFF)</span>
                  <span className="text-slate-400 text-[11px] block">Không tính công, không vi phạm vắng mặt</span>
                </div>
                {selectedShiftCode === 'OFF' && <Check className="w-4 h-4 text-slate-700" />}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-700 font-medium">Ghi chú điều động:</label>
            <input
              type="text"
              placeholder="Ví dụ: Đổi ca trực theo phân công quản lý..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 border border-slate-200 text-slate-600 font-semibold rounded-lg hover:bg-slate-50 transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-[#0072BC] hover:bg-[#005A96] text-white font-bold rounded-lg shadow-sm transition cursor-pointer"
            >
              Lưu Thay Đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
