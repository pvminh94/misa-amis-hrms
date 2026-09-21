import React, { useState } from 'react';
import { X, Send, RefreshCw, Calendar, User } from 'lucide-react';
import { ShiftSwapRequest, Employee, ShiftDefinition } from '../../../types';
import { useAuth } from '../../../context/AuthContext';

interface ShiftSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<ShiftSwapRequest>) => Promise<void>;
  employees: Employee[];
  shifts: ShiftDefinition[];
}

export const ShiftSwapModal: React.FC<ShiftSwapModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  employees,
  shifts
}) => {
  const { currentUser } = useAuth();
  const [employeeId, setEmployeeId] = useState(currentUser.id);
  const [targetEmployeeId, setTargetEmployeeId] = useState(employees[1]?.id || '');
  const [swapDate, setSwapDate] = useState('2026-09-23');
  const [fromShiftCode, setFromShiftCode] = useState(shifts[0]?.code || 'CA-HC');
  const [toShiftCode, setToShiftCode] = useState(shifts[1]?.code || 'CA-DEM');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    const emp = employees.find((e) => e.id === employeeId);
    const targetEmp = employees.find((e) => e.id === targetEmployeeId);
    const fromShift = shifts.find((s) => s.code === fromShiftCode);
    const toShift = shifts.find((s) => s.code === toShiftCode);

    try {
      setSubmitting(true);
      await onSubmit({
        employeeId,
        employeeName: emp?.fullName || 'Nhân viên',
        employeeCode: emp?.code || '',
        targetEmployeeId,
        targetEmployeeName: targetEmp?.fullName || 'Đồng nghiệp',
        targetEmployeeCode: targetEmp?.code || '',
        swapDate,
        fromShiftCode,
        fromShiftName: fromShift?.name || fromShiftCode,
        toShiftCode,
        toShiftName: toShift?.name || toShiftCode,
        reason
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
        <div className="bg-[#0072BC] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            <h2 className="font-bold text-base">Đăng Ký Đổi Ca Làm Việc</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10 text-white/80 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Người làm đơn</label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.fullName} ({emp.code} - {emp.departmentName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Đổi ca với nhân sự nào</label>
            <select
              value={targetEmployeeId}
              onChange={(e) => setTargetEmployeeId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
            >
              {employees
                .filter((emp) => emp.id !== employeeId)
                .map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.fullName} ({emp.code} - {emp.departmentName})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Ngày áp dụng đổi ca</label>
            <input
              type="date"
              value={swapDate}
              onChange={(e) => setSwapDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Từ ca hiện tại</label>
              <select
                value={fromShiftCode}
                onChange={(e) => setFromShiftCode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              >
                {shifts.map((s) => (
                  <option key={s.id} value={s.code}>
                    {s.name} ({s.startTime} - {s.endTime})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Sang ca mong muốn</label>
              <select
                value={toShiftCode}
                onChange={(e) => setToShiftCode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              >
                {shifts.map((s) => (
                  <option key={s.id} value={s.code}>
                    {s.name} ({s.startTime} - {s.endTime})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Lý do xin đổi ca</label>
            <textarea
              rows={3}
              required
              placeholder="Ghi rõ lý do đổi ca và xác nhận đã thỏa thuận với đồng nghiệp..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            ></textarea>
          </div>

          <div className="pt-2 border-t flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 bg-[#0072BC] hover:bg-[#005A96] text-white rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Đang gửi...' : 'Gửi yêu cầu đổi ca'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
