import React, { useState } from 'react';
import { X, Send, FileCheck2, Clock, UploadCloud } from 'lucide-react';
import { AttendanceRegularization, Employee } from '../../../types';
import { useAuth } from '../../../context/AuthContext';

interface RegularizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<AttendanceRegularization>) => Promise<void>;
  employees: Employee[];
}

export const RegularizationModal: React.FC<RegularizationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  employees
}) => {
  const { currentUser } = useAuth();
  const [employeeId, setEmployeeId] = useState(currentUser.id);
  const [date, setDate] = useState('2026-09-21');
  const [type, setType] = useState<AttendanceRegularization['type']>('forgot_checkout');
  const [suggestedCheckIn, setSuggestedCheckIn] = useState('08:00');
  const [suggestedCheckOut, setSuggestedCheckOut] = useState('17:30');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    const emp = employees.find((e) => e.id === employeeId);

    try {
      setSubmitting(true);
      await onSubmit({
        employeeId,
        employeeName: emp?.fullName || 'Nhân viên',
        employeeCode: emp?.code || '',
        departmentName: emp?.departmentName || '',
        date,
        type,
        suggestedCheckIn,
        suggestedCheckOut,
        reason,
        attachmentName: 'MinhChungGiaiTrinh.jpg'
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
            <FileCheck2 className="w-5 h-5" />
            <h2 className="font-bold text-base">Giải Trình Chấm Công / Bù Công</h2>
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Ngày cần giải trình</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Lý do giải trình</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              >
                <option value="forgot_checkout">Quên chấm công ra về</option>
                <option value="forgot_checkin">Quên chấm công vào ca</option>
                <option value="client_meeting">Đi gặp khách hàng / đối tác bên ngoài</option>
                <option value="system_error">Máy chấm công / GPS lỗi mạng</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Giờ vào thực tế</label>
              <input
                type="time"
                value={suggestedCheckIn}
                onChange={(e) => setSuggestedCheckIn(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Giờ ra thực tế</label>
              <input
                type="time"
                value={suggestedCheckOut}
                onChange={(e) => setSuggestedCheckOut(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Nội dung chi tiết giải trình</label>
            <textarea
              rows={3}
              required
              placeholder="Giải trình cụ thể địa điểm làm việc hoặc sự cố kỹ thuật..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            ></textarea>
          </div>

          <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-lg flex items-center justify-between text-slate-600">
            <div className="flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-[#0072BC]" />
              <div>
                <span className="font-semibold block">Đính kèm ảnh hiện trường / Biên bản</span>
                <span className="text-[10px] text-slate-400">Đã kèm: MinhChungGiaiTrinh.jpg (1.2MB)</span>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-[#0072BC] bg-blue-50 px-2 py-1 rounded">
              Chọn file khác
            </span>
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
              <span>{submitting ? 'Đang gửi...' : 'Gửi đơn giải trình'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
