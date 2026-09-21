import React, { useState } from 'react';
import { X, UserCheck, Shield, Sparkles, Building, Briefcase, DollarSign, Calendar, Check } from 'lucide-react';
import { CrmCandidate, Department, Position } from '../../../types';

interface CandidateIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: CrmCandidate | null;
  departments: Department[];
  positions: Position[];
  onConvert: (candidateId: string, overrides: any) => Promise<void>;
}

export const CandidateIntakeModal: React.FC<CandidateIntakeModalProps> = ({
  isOpen,
  onClose,
  candidate,
  departments,
  positions,
  onConvert
}) => {
  if (!isOpen || !candidate) return null;

  const [contractType, setContractType] = useState('Hợp đồng thử việc 02 tháng');
  const [onboardingDate, setOnboardingDate] = useState(candidate.onboardingDate || '2026-10-01');
  const [salary, setSalary] = useState(candidate.offerSalary || 18000000);
  const [createUserAccount, setCreateUserAccount] = useState(true);
  const [autoRoster, setAutoRoster] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await onConvert(candidate.id, {
        contractType,
        onboardingDate,
        salary: {
          baseSalary: salary,
          allowanceResponsibility: 1000000,
          allowanceLunch: 730000,
          allowanceGas: 500000,
          dependents: 0,
          taxCode: '',
          insuranceBookNumber: ''
        },
        createUserAccount,
        autoRoster
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/30 flex items-center justify-center font-bold text-white shadow-sm border border-emerald-400/30">
              <Sparkles className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Tiếp Nhận Ứng Viên Từ Tuyển Dụng / CRM</h3>
              <p className="text-[11px] text-emerald-200/80">
                Chuyển đổi hồ sơ ứng viên thành Nhân viên chính thức & khởi tạo dữ liệu A-Z
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-emerald-700/50 hover:bg-emerald-700 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Candidate Card Summary */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] text-slate-400 font-bold">{candidate.candidateCode}</span>
                <h4 className="font-bold text-slate-900 text-sm">{candidate.fullName}</h4>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Đã nhận Offer ({candidate.source})
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1 border-t border-slate-200/60">
              <div>Email: <strong className="text-slate-800">{candidate.email}</strong></div>
              <div>SĐT: <strong className="text-slate-800">{candidate.phone}</strong></div>
              <div>Khối/Ban: <strong className="text-slate-800">{candidate.departmentName}</strong></div>
              <div>Vị trí: <strong className="text-[#0072BC]">{candidate.positionTitle}</strong></div>
            </div>

            {candidate.notes && (
              <div className="text-[10px] text-slate-500 italic bg-white p-2 rounded border border-slate-200/50">
                "{candidate.notes}"
              </div>
            )}
          </div>

          {/* Onboarding Overrides */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 text-xs">Thiết Lập Hợp Đồng & Chế Độ Đãi Ngộ:</h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-700 font-semibold">Loại hợp đồng tiếp nhận:</label>
                <select
                  value={contractType}
                  onChange={(e) => setContractType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none"
                >
                  <option value="Hợp đồng thử việc 02 tháng">Hợp đồng thử việc 02 tháng (85% lương)</option>
                  <option value="Hợp đồng xác định thời hạn 12 tháng">Hợp đồng chính thức 12 tháng</option>
                  <option value="Hợp đồng xác định thời hạn 36 tháng">Hợp đồng chính thức 36 tháng</option>
                  <option value="Hợp đồng không xác định thời hạn">Không xác định thời hạn</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-semibold">Ngày nhận việc chính thức:</label>
                <input
                  type="date"
                  value={onboardingDate}
                  onChange={(e) => setOnboardingDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 font-semibold">Mức lương cơ bản thỏa thuận (VNĐ):</label>
              <input
                type="number"
                step={500000}
                value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 focus:outline-none"
              />
              <div className="text-[10px] text-slate-400">
                Bao gồm phụ cấp ăn trưa 730k (miễn thuế) và phụ cấp xăng xe 500k theo quy chế AMIS.
              </div>
            </div>
          </div>

          {/* Automatic System Provisioning Checkboxes */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="font-bold text-slate-800 text-xs">Tự Động Kích Hoạt Hệ Thống:</h4>

            <label className="flex items-center gap-2 cursor-pointer bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
              <input
                type="checkbox"
                checked={createUserAccount}
                onChange={(e) => setCreateUserAccount(e.target.checked)}
                className="w-4 h-4 text-[#0072BC] rounded border-slate-300"
              />
              <div>
                <span className="font-bold text-slate-800 block">Tự động tạo tài khoản đăng nhập AMIS HRM</span>
                <span className="text-[10px] text-slate-500">
                  Username: <strong className="font-mono">{candidate.email.split('@')[0]}</strong> • Mật khẩu mặc định: <strong className="font-mono">Amis@123456</strong>
                </span>
              </div>
            </label>

            <label className="flex items-center gap-2 cursor-pointer bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
              <input
                type="checkbox"
                checked={autoRoster}
                onChange={(e) => setAutoRoster(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300"
              />
              <div>
                <span className="font-bold text-slate-800 block">Tự động xếp lịch phân ca & thêm vào bảng lương tháng</span>
                <span className="text-[10px] text-slate-500">
                  Gắn ca Hành chính chuẩn (8h/ngày) và sinh dòng lương lũy tiến tương ứng.
                </span>
              </div>
            </label>
          </div>

          {/* Action buttons */}
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
              disabled={loading}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition cursor-pointer flex items-center gap-1.5 disabled:opacity-60"
            >
              <UserCheck className="w-4 h-4" />
              <span>{loading ? 'Đang tiếp nhận...' : 'Xác Nhận Tiếp Nhận & Tạo Hồ Sơ'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
