import React, { useState } from 'react';
import {
  X,
  User,
  Briefcase,
  BadgeDollarSign,
  Landmark,
  FileText,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Building,
  GraduationCap,
  ShieldCheck,
  Printer
} from 'lucide-react';
import { Employee } from '../../../types';

interface EmployeeDetailModalProps {
  employee: Employee | null;
  onClose: () => void;
  onEdit: (employee: Employee) => void;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  employee,
  onClose,
  onEdit
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'job' | 'salary' | 'bank'>('profile');

  if (!employee) return null;

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 relative flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0072BC] to-sky-400 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg ring-4 ring-white/10">
              {employee.fullName.split(' ').slice(-1)[0][0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{employee.fullName}</h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-500/20 text-sky-200 border border-sky-400/30">
                  {employee.code}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                    employee.status === 'active'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : employee.status === 'probation'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-rose-500/20 text-rose-300'
                  }`}
                >
                  {employee.status === 'active'
                    ? 'Chính thức'
                    : employee.status === 'probation'
                    ? 'Thử việc'
                    : 'Nghỉ việc'}
                </span>
              </div>
              <p className="text-slate-300 text-xs mt-1 flex items-center gap-2">
                <span>{employee.positionTitle}</span>
                <span>•</span>
                <span>{employee.departmentName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-700/60 rounded-lg transition"
              title="In sơ yếu lý lịch"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#0072BC] text-[#0072BC]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Sơ yếu lý lịch</span>
          </button>
          <button
            onClick={() => setActiveTab('job')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'job'
                ? 'border-[#0072BC] text-[#0072BC]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Công việc & Hợp đồng</span>
          </button>
          <button
            onClick={() => setActiveTab('salary')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'salary'
                ? 'border-[#0072BC] text-[#0072BC]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BadgeDollarSign className="w-4 h-4" />
            <span>Lương, Thuế & BHXH</span>
          </button>
          <button
            onClick={() => setActiveTab('bank')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'bank'
                ? 'border-[#0072BC] text-[#0072BC]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>Tài khoản ngân hàng</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 text-xs">
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-sm border-b pb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#0072BC]" />
                  <span>Thông tin cá nhân</span>
                </h3>
                <div className="grid grid-cols-2 gap-3 text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Họ và tên:</span>
                    <span className="font-semibold text-slate-800">{employee.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Giới tính:</span>
                    <span className="font-semibold text-slate-800">{employee.gender}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Ngày sinh:</span>
                    <span className="font-semibold text-slate-800">{employee.dob}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Trình độ học vấn:</span>
                    <span className="font-semibold text-slate-800">{employee.education}</span>
                  </div>
                </div>

                <div className="pt-2 border-t space-y-2">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Số CCCD / Hộ chiếu:</span>
                    <span className="font-semibold text-slate-800">{employee.idCard}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Ngày cấp:</span>
                      <span className="font-semibold text-slate-800">{employee.idCardDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Nơi cấp:</span>
                      <span className="font-semibold text-slate-800">{employee.idCardPlace}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-sm border-b pb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#0072BC]" />
                  <span>Thông tin liên lạc</span>
                </h3>
                <div className="space-y-3 text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Số điện thoại di động:</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {employee.phone}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Email công ty:</span>
                    <span className="font-semibold text-[#0072BC] flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {employee.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Địa chỉ thường trú / Nơi ở hiện tại:</span>
                    <span className="font-semibold text-slate-800 flex items-start gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                      {employee.address}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Quê quán:</span>
                    <span className="font-semibold text-slate-800">{employee.hometown}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'job' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider text-[#0072BC]">
                    Vị trí hiện tại
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Mã nhân viên:</span>
                    <span className="font-bold text-slate-800">{employee.code}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Đơn vị công tác / Phòng ban:</span>
                    <span className="font-semibold text-slate-800">{employee.departmentName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Chức danh chuyên môn:</span>
                    <span className="font-semibold text-slate-800">{employee.positionTitle}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Ngày chính thức gia nhập:</span>
                    <span className="font-semibold text-slate-800">{employee.joinDate}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider text-[#0072BC]">
                    Hợp đồng lao động
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Loại hợp đồng:</span>
                    <span className="font-semibold text-slate-800">{employee.contractType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Ngày bắt đầu hiệu lực:</span>
                    <span className="font-semibold text-slate-800">{employee.contractStartDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Ngày hết hạn hợp đồng:</span>
                    <span className="font-semibold text-slate-800">
                      {employee.contractEndDate || 'Không thời hạn (Vĩnh viễn)'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Trạng thái hồ sơ:</span>
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                      Đầy đủ chứng từ pháp lý
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'salary' && (
            <div className="space-y-6">
              <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-500">Mức lương cơ bản (đóng BHXH)</div>
                    <div className="text-2xl font-bold text-[#0072BC] mt-1">
                      {formatVND(employee.salary.baseSalary)}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-500">Mã số thuế cá nhân</span>
                    <div className="text-sm font-bold text-slate-800">{employee.salary.taxCode || 'Chưa cập nhật'}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-500 text-[11px]">Phụ cấp trách nhiệm</div>
                  <div className="text-base font-bold text-slate-800 mt-1">
                    {formatVND(employee.salary.allowanceResponsibility)}
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-500 text-[11px]">Phụ cấp ăn trưa</div>
                  <div className="text-base font-bold text-slate-800 mt-1">
                    {formatVND(employee.salary.allowanceLunch)}
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-500 text-[11px]">Phụ cấp xăng xe & điện thoại</div>
                  <div className="text-base font-bold text-slate-800 mt-1">
                    {formatVND(employee.salary.allowanceGas)}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block text-[11px]">Số sổ Bảo hiểm xã hội:</span>
                  <span className="font-semibold text-slate-800">{employee.salary.insuranceBookNumber || 'Đang cấp'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Số người phụ thuộc giảm trừ gia cảnh:</span>
                  <span className="font-bold text-slate-800">{employee.salary.dependents} người</span>
                  <span className="text-slate-500 text-[10px] block mt-0.5">
                    (-{formatVND(employee.salary.dependents * 4400000)} / tháng)
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bank' && (
            <div className="max-w-md mx-auto p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-3 border-b pb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0072BC] flex items-center justify-center font-bold">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Tài khoản chi trả lương</div>
                  <div className="text-sm font-bold text-slate-800">{employee.bankAccount.bankName}</div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-slate-400 block text-[11px]">Số tài khoản nhận lương:</span>
                  <span className="font-mono text-base font-bold text-slate-800">
                    {employee.bankAccount.accountNumber || 'Chưa cung cấp'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Chủ tài khoản:</span>
                  <span className="font-semibold text-slate-800 uppercase">{employee.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Chi nhánh ngân hàng:</span>
                  <span className="font-semibold text-slate-800">{employee.bankAccount.branch || 'Hà Nội'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">Hệ sinh thái Quản trị Nguồn nhân lực MISA AMIS</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onEdit(employee);
                onClose();
              }}
              className="px-4 py-2 bg-[#0072BC] hover:bg-[#005A96] text-white text-xs font-semibold rounded-lg shadow-sm transition cursor-pointer"
            >
              Chỉnh sửa hồ sơ
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold rounded-lg transition cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
