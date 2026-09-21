import React, { useState } from 'react';
import { X, Save, Clock, Palette } from 'lucide-react';
import { ShiftDefinition } from '../../../types';

interface ShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (shiftData: Partial<ShiftDefinition>) => Promise<void>;
  initialData?: ShiftDefinition | null;
}

export const ShiftModal: React.FC<ShiftModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [code, setCode] = useState(initialData?.code || '');
  const [name, setName] = useState(initialData?.name || '');
  const [startTime, setStartTime] = useState(initialData?.startTime || '08:00');
  const [endTime, setEndTime] = useState(initialData?.endTime || '17:30');
  const [breakStartTime, setBreakStartTime] = useState(initialData?.breakStartTime || '12:00');
  const [breakEndTime, setBreakEndTime] = useState(initialData?.breakEndTime || '13:30');
  const [workHours, setWorkHours] = useState(initialData?.workHours || 8.0);
  const [coefficient, setCoefficient] = useState(initialData?.coefficient || 1.0);
  const [color, setColor] = useState(initialData?.color || '#0072BC');
  const [description, setDescription] = useState(initialData?.description || '');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name) return;
    try {
      setSaving(true);
      await onSave({
        code: code.toUpperCase(),
        name,
        startTime,
        endTime,
        breakStartTime,
        breakEndTime,
        workHours: Number(workHours),
        coefficient: Number(coefficient),
        color,
        description
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
        <div className="bg-[#0072BC] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <h2 className="font-bold text-base">
              {initialData ? 'Chỉnh sửa Ca làm việc' : 'Thiết lập Ca làm việc mới'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10 text-white/80 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Mã ca <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: CA-HC, CA-DEM..."
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Tên ca làm việc <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Ca Hành Chính"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Giờ bắt đầu vào ca</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Giờ kết thúc ca</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Bắt đầu nghỉ giữa ca</label>
              <input
                type="time"
                value={breakStartTime}
                onChange={(e) => setBreakStartTime(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Kết thúc nghỉ giữa ca</label>
              <input
                type="time"
                value={breakEndTime}
                onChange={(e) => setBreakEndTime(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Số giờ công tiêu chuẩn</label>
              <input
                type="number"
                step="0.5"
                value={workHours}
                onChange={(e) => setWorkHours(Number(e.target.value))}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Hệ số công</label>
              <input
                type="number"
                step="0.1"
                value={coefficient}
                onChange={(e) => setCoefficient(Number(e.target.value))}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Màu nhận diện</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-8 p-1 border border-slate-300 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Mô tả quy định ca</label>
            <textarea
              rows={2}
              placeholder="Quy định đi muộn, phụ cấp ca đêm nếu có..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
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
              disabled={saving}
              className="px-4 py-1.5 bg-[#0072BC] hover:bg-[#005A96] text-white rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Đang lưu...' : 'Lưu ca làm việc'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
