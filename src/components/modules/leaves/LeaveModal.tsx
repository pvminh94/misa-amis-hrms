import React, { useState } from 'react';
import { X, Send, Calendar, Clock, FileText } from 'lucide-react';
import { LeaveRequest, Employee } from '../../../types';
import { useAuth } from '../../../context/AuthContext';

interface LeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<LeaveRequest>) => Promise<void>;
  employees: Employee[];
}

export const LeaveModal: React.FC<LeaveModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  employees
}) => {
  const { currentUser } = useAuth();
  const [employeeId, setEmployeeId] = useState(currentUser.id);
  const [type, setType] = useState<'annual' | 'sick' | 'maternity' | 'unpaid' | 'overtime' | 'late_early'>('annual');
  const [startDate, setStartDate] = useState('2026-09-22');
  const [endDate, setEndDate] = useState('2026-09-22');
  const [duration, setDuration] = useState(1);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Vui lòng nhập lý do tạo đơn');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await onSubmit({
        employeeId,
        type,
        startDate,
        endDate,
        duration: Number(duration),
        unit: type === 'overtime' || type === 'late_early' ? 'giờ' : 'ngày',
        reason
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Lỗi gửi đơn');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
        <div className="bg-[#0072BC] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            <h2 className="font-bold text-base">Tạo Đơn Trình Phê Duyệt</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10 text-white/80 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg font-medium">
              {error}
            </div>
          )}

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
            <label className="block text-slate-700 font-semibold mb-1">Loại hình đơn từ</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
            >
              <option value="annual">Nghỉ phép năm (Hưởng nguyên lương)</option>
              <option value="overtime">Đăng ký làm thêm ngoài giờ (OT)</option>
              <option value="late_early">Giải trình Đi muộn / Về sớm</option>
              <option value="sick">Nghỉ ốm đau (Hưởng chế độ BHXH)</option>
              <option value="unpaid">Nghỉ việc riêng không hưởng lương</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Từ thời điểm</label>
              <input
                type={type === 'overtime' || type === 'late_early' ? 'datetime-local' : 'date'}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Đến thời điểm</label>
              <input
                type={type === 'overtime' || type === 'late_early' ? 'datetime-local' : 'date'}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Thời lượng ({type === 'overtime' || type === 'late_early' ? 'Số giờ' : 'Số ngày'})
            </label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Lý do cụ thể</label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ghi rõ lý do xin nghỉ hoặc chi tiết công việc làm thêm OT..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0072BC]/20 focus:border-[#0072BC]"
              required
            ></textarea>
          </div>

          <div className="pt-2 border-t flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-[#0072BC] hover:bg-[#005A96] text-white font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Đang gửi...' : 'Gửi đơn phê duyệt'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
