import React, { useState, useEffect } from 'react';
import { X, Save, Clock, CheckCircle, AlertTriangle, Calendar, FileText } from 'lucide-react';
import { DayTimesheetCell } from '../../../types';
import { useAuth } from '../../../context/AuthContext';

interface TimesheetCellModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeName: string;
  employeeId: string;
  dayData: DayTimesheetCell | null;
  onSave: (employeeId: string, day: number, updates: Partial<DayTimesheetCell>) => Promise<void>;
}

export const TimesheetCellModal: React.FC<TimesheetCellModalProps> = ({
  isOpen,
  onClose,
  employeeName,
  employeeId,
  dayData,
  onSave
}) => {
  const { role } = useAuth();
  const [status, setStatus] = useState<DayTimesheetCell['status']>('X');
  const [workHours, setWorkHours] = useState(8);
  const [checkIn, setCheckIn] = useState('08:00');
  const [checkOut, setCheckOut] = useState('17:30');
  const [lateMinutes, setLateMinutes] = useState(0);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (dayData) {
      setStatus(dayData.status);
      setWorkHours(dayData.workHours);
      setCheckIn(dayData.checkIn || '08:00');
      setCheckOut(dayData.checkOut || '17:30');
      setLateMinutes(dayData.lateMinutes || 0);
      setNotes(dayData.notes || '');
    }
  }, [dayData]);

  if (!isOpen || !dayData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await onSave(employeeId, dayData.day, {
        status,
        workHours: Number(workHours),
        checkIn: status === 'OFF' ? undefined : checkIn,
        checkOut: status === 'OFF' ? undefined : checkOut,
        lateMinutes: status === 'L' ? Number(lateMinutes) : 0,
        notes
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
        <div className="bg-[#0072BC] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <h2 className="font-bold text-base">
              Chi tiết công ngày {dayData.day}/09/2026
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10 text-white/80 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-slate-500 text-[11px]">Nhân viên:</div>
            <div className="font-bold text-slate-900 text-sm">{employeeName}</div>
            <div className="text-slate-400 text-[11px] mt-0.5">Ngày chấm công: {dayData.date}</div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Trạng thái công</label>
            <select
              disabled={role === 'employee'}
              value={status}
              onChange={(e) => {
                const s = e.target.value as any;
                setStatus(s);
                if (s === 'X') {
                  setWorkHours(8);
                  setCheckIn('07:55');
                  setCheckOut('17:35');
                  setLateMinutes(0);
                } else if (s === 'OFF') {
                  setWorkHours(0);
                } else if (s === 'L') {
                  setLateMinutes(20);
                  setCheckIn('08:20');
                  setCheckOut('17:35');
                } else if (s === 'OT') {
                  setWorkHours(11.5);
                  setCheckOut('21:30');
                }
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold"
            >
              <option value="X">X - Đi làm đủ công (8 giờ)</option>
              <option value="L">L - Đi muộn / Về sớm</option>
              <option value="P">P - Nghỉ phép hưởng lương (Phép năm / Nghỉ lễ)</option>
              <option value="KP">KP - Nghỉ không hưởng lương</option>
              <option value="OT">OT - Làm thêm ngoài giờ (Tăng ca)</option>
              <option value="CT">CT - Đi công tác ngoài văn phòng</option>
              <option value="OFF">OFF - Nghỉ cuối tuần (Thứ 7 / CN)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Giờ vào (Check-in)</label>
              <input
                type="time"
                disabled={role === 'employee' || status === 'OFF'}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Giờ ra (Check-out)</label>
              <input
                type="time"
                disabled={role === 'employee' || status === 'OFF'}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Số giờ tính công</label>
              <input
                type="number"
                step="0.5"
                disabled={role === 'employee'}
                value={workHours}
                onChange={(e) => setWorkHours(Number(e.target.value))}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-bold"
              />
            </div>

            {status === 'L' && (
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Số phút đi trễ</label>
                <input
                  type="number"
                  disabled={role === 'employee'}
                  value={lateMinutes}
                  onChange={(e) => setLateMinutes(Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-amber-600 font-bold"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Ghi chú giải trình</label>
            <input
              type="text"
              disabled={role === 'employee'}
              placeholder="Ghi chú lý do đi muộn hoặc bù công..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
            />
          </div>

          <div className="pt-2 border-t flex items-center justify-between">
            <span className="text-[10px] text-slate-400">
              {role === 'employee' ? 'Chỉ quản lý mới có quyền sửa công' : 'Tự động tính lại bảng lương'}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700"
              >
                Đóng
              </button>
              {(role === 'admin' || role === 'manager') && (
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-1.5 bg-[#0072BC] hover:bg-[#005A96] text-white rounded-lg font-semibold flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Đang lưu...' : 'Lưu điều chỉnh'}</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
