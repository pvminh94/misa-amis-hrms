import React, { useState, useEffect } from 'react';
import {
  Settings,
  Building,
  Clock,
  ShieldAlert,
  Save,
  CheckCircle2,
  Users,
  ShieldCheck
} from 'lucide-react';
import { CompanySetting } from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';

interface SettingsViewProps {
  settings: CompanySetting | null;
  loading: boolean;
  onSave: (settings: Partial<CompanySetting>) => Promise<void>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  loading,
  onSave
}) => {
  const { role } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState<Partial<CompanySetting>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await onSave(formData);
      showToast('Cập nhật thiết lập hệ thống thành công', 'success');
    } catch (err: any) {
      showToast(err.message || 'Lỗi cập nhật thiết lập', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0072BC]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in pb-12">
      {/* Top Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#0072BC]" />
            <span>Thiết Lập Hệ Thống & Quy Định Doanh Nghiệp (AMIS Settings)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cấu hình tham số công ty, chính sách ca kíp, quy chế trích nộp bảo hiểm và thuế
          </p>
        </div>

        {role === 'admin' && (
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 bg-[#0072BC] hover:bg-[#005A96] text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Đang lưu...' : 'Lưu toàn bộ thay đổi'}</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Thông tin doanh nghiệp */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-[#0072BC] font-bold text-sm">
            <Building className="w-4 h-4" />
            <span>1. Thông tin pháp nhân doanh nghiệp</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Tên đầy đủ của doanh nghiệp
              </label>
              <input
                type="text"
                disabled={role !== 'admin'}
                value={formData.companyName || ''}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg disabled:bg-slate-50 font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mã số thuế doanh nghiệp (MST)</label>
              <input
                type="text"
                disabled={role !== 'admin'}
                value={formData.taxCode || ''}
                onChange={(e) => setFormData({ ...formData, taxCode: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg disabled:bg-slate-50 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Số điện thoại liên hệ</label>
              <input
                type="text"
                disabled={role !== 'admin'}
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg disabled:bg-slate-50"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Địa chỉ trụ sở đăng ký kinh doanh</label>
              <input
                type="text"
                disabled={role !== 'admin'}
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg disabled:bg-slate-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email nhận thông báo HR</label>
              <input
                type="email"
                disabled={role !== 'admin'}
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg disabled:bg-slate-50"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Website doanh nghiệp</label>
              <input
                type="text"
                disabled={role !== 'admin'}
                value={formData.website || ''}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg disabled:bg-slate-50"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Chế độ giờ làm việc & chấm công */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-[#0072BC] font-bold text-sm">
            <Clock className="w-4 h-4" />
            <span>2. Thời gian làm việc tiêu chuẩn & Ca kíp</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Giờ bắt đầu làm việc</label>
              <input
                type="time"
                disabled={role !== 'admin'}
                value={formData.workStartTime || '08:00'}
                onChange={(e) => setFormData({ ...formData, workStartTime: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Giờ kết thúc ca</label>
              <input
                type="time"
                disabled={role !== 'admin'}
                value={formData.workEndTime || '17:30'}
                onChange={(e) => setFormData({ ...formData, workEndTime: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bắt đầu nghỉ trưa</label>
              <input
                type="time"
                disabled={role !== 'admin'}
                value={formData.lunchBreakStart || '12:00'}
                onChange={(e) => setFormData({ ...formData, lunchBreakStart: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kết thúc nghỉ trưa</label>
              <input
                type="time"
                disabled={role !== 'admin'}
                value={formData.lunchBreakEnd || '13:30'}
                onChange={(e) => setFormData({ ...formData, lunchBreakEnd: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Số ngày công chuẩn trong tháng</label>
              <input
                type="number"
                disabled={role !== 'admin'}
                value={formData.workingDaysPerMonth || 22}
                onChange={(e) => setFormData({ ...formData, workingDaysPerMonth: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Mặc định 22 ngày công (Nghỉ trọn Thứ Bảy và Chủ Nhật)
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Quy định Bảo hiểm Xã hội & Thuế TNCN */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-[#0072BC] font-bold text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>3. Tỷ lệ trích nộp Bảo hiểm & Giảm trừ gia cảnh theo Luật VN</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bảo hiểm xã hội (BHXH %)</label>
              <input
                type="number"
                step="0.1"
                disabled={role !== 'admin'}
                value={formData.bhxhRate || 8.0}
                onChange={(e) => setFormData({ ...formData, bhxhRate: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">NLĐ đóng 8.0%</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bảo hiểm Y tế (BHYT %)</label>
              <input
                type="number"
                step="0.1"
                disabled={role !== 'admin'}
                value={formData.bhytRate || 1.5}
                onChange={(e) => setFormData({ ...formData, bhytRate: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">NLĐ đóng 1.5%</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bảo hiểm Thất nghiệp (BHTN %)</label>
              <input
                type="number"
                step="0.1"
                disabled={role !== 'admin'}
                value={formData.bhtnRate || 1.0}
                onChange={(e) => setFormData({ ...formData, bhtnRate: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">NLĐ đóng 1.0%</span>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Mức giảm trừ gia cảnh bản thân (VNĐ/tháng)
              </label>
              <input
                type="number"
                step="1000000"
                disabled={role !== 'admin'}
                value={formData.personalDeduction || 11000000}
                onChange={(e) => setFormData({ ...formData, personalDeduction: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-slate-800 font-mono"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Nghị quyết Quốc hội: 11.000.000 VNĐ / tháng
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Giảm trừ người phụ thuộc (VNĐ/người/tháng)
              </label>
              <input
                type="number"
                step="100000"
                disabled={role !== 'admin'}
                value={formData.dependentDeduction || 4400000}
                onChange={(e) => setFormData({ ...formData, dependentDeduction: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-slate-800 font-mono"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                4.400.000 VNĐ / người / tháng
              </span>
            </div>
          </div>
        </div>

        {/* Section 4: Role matrix overview */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-[#0072BC] font-bold text-sm">
            <Users className="w-4 h-4" />
            <span>4. Ma trận phân quyền vai trò (Role-Based Access Control)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-800 text-sm flex items-center justify-between">
                <span>Quản trị viên (Admin)</span>
                <span className="px-2 py-0.5 bg-blue-100 text-[#0072BC] rounded text-[10px]">Toàn quyền</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Có quyền truy cập toàn bộ dữ liệu nhân sự, thêm/sửa/xóa hồ sơ, duyệt đơn, chốt và chi trả bảng lương, cài đặt hệ thống.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-800 text-sm flex items-center justify-between">
                <span>Trưởng bộ phận (Manager)</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px]">Phê duyệt</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Xem danh bạ nhân sự thuộc phòng ban quản lý, duyệt/từ chối đơn xin nghỉ phép, OT, theo dõi chấm công cấp dưới.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-800 text-sm flex items-center justify-between">
                <span>Nhân viên cá nhân (Staff)</span>
                <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px]">Cá nhân</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Chấm công GPS/Wifi hàng ngày, xem hồ sơ cá nhân, nộp đơn xin nghỉ/OT, theo dõi trạng thái duyệt và tra cứu phiếu lương.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
