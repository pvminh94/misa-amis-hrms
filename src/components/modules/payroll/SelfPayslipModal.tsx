import React from 'react';
import { X, Printer, CheckCircle2, DollarSign, Shield, Building, CreditCard, Award, Calendar } from 'lucide-react';
import { PayrollRecord, Employee } from '../../../types';

interface SelfPayslipModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: PayrollRecord | null;
  employee: Employee | null;
}

export const SelfPayslipModal: React.FC<SelfPayslipModalProps> = ({
  isOpen,
  onClose,
  record,
  employee
}) => {
  if (!isOpen || !record || !employee) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in select-none">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden print:m-0 print:p-0 print:border-none print:shadow-none">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#005A96] to-[#003860] text-white flex items-center justify-between print:bg-none print:text-black">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-[#0072BC] flex items-center justify-center font-black text-xl shadow-md">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-tight">AMIS HRM</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/20 font-bold uppercase">
                  Phiếu Lương Điện Tử
                </span>
              </div>
              <p className="text-xs text-sky-200 mt-0.5">
                Kỳ chi trả lương Tháng 09/2026 (Từ 01/09/2026 đến 30/09/2026)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer print:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Employee Info Header */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <span className="text-slate-400 text-[10px] block">Mã nhân sự:</span>
              <strong className="font-mono text-slate-800">{employee.code}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Họ và tên:</span>
              <strong className="text-slate-900">{employee.fullName}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Phòng ban:</span>
              <span className="text-slate-800 font-medium">{employee.departmentName}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Chức danh:</span>
              <span className="text-slate-800 font-medium">{employee.positionTitle}</span>
            </div>
          </div>

          {/* Breakdown Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Left: Gross Earnings */}
            <div className="border border-slate-200 rounded-2xl p-4 space-y-2.5">
              <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5 border-b border-slate-100 pb-2 text-[#0072BC]">
                <DollarSign className="w-4 h-4" />
                <span>I. CÁC KHOẢN THU NHẬP (GROSS)</span>
              </div>

              <div className="space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span>Lương cơ bản theo hợp đồng:</span>
                  <strong className="font-mono text-slate-900">{record.baseSalary.toLocaleString()} đ</strong>
                </div>
                <div className="flex justify-between">
                  <span>Ngày công thực tế / tiêu chuẩn:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {record.actualWorkDays} / {record.standardWorkDays || 22} ngày
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Lương ngày công thực tế:</span>
                  <span className="font-mono text-slate-900">
                    {Math.round((record.baseSalary / (record.standardWorkDays || 22)) * record.actualWorkDays).toLocaleString()} đ
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Tổng phụ cấp chế độ:</span>
                  <span className="font-mono font-semibold text-slate-700">
                    +{record.allowanceTotal.toLocaleString()} đ
                  </span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px] pl-3">
                  <span>• Ăn trưa, điện thoại, xăng xe:</span>
                  <span className="font-mono">Đã gộp chi trả</span>
                </div>
                {record.otPay > 0 && (
                  <div className="flex justify-between text-purple-700 font-semibold">
                    <span>Lương tăng ca (OT 150%):</span>
                    <span className="font-mono">+{record.otPay.toLocaleString()} đ</span>
                  </div>
                )}
                {record.bonus > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Thưởng thành tích & KPIs:</span>
                    <span className="font-mono">+{record.bonus.toLocaleString()} đ</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-slate-100 text-slate-900 font-bold">
                  <span>TỔNG THU NHẬP (GROSS):</span>
                  <span className="font-mono text-[#0072BC]">{record.grossSalary.toLocaleString()} đ</span>
                </div>
              </div>
            </div>

            {/* Right: Deductions (BHXH & Tax) */}
            <div className="border border-slate-200 rounded-2xl p-4 space-y-2.5">
              <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5 border-b border-slate-100 pb-2 text-rose-600">
                <Shield className="w-4 h-4" />
                <span>II. CÁC KHOẢN TRÍCH NỘP (DEDUCTIONS)</span>
              </div>

              <div className="space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span>Bảo hiểm xã hội (8%):</span>
                  <span className="font-mono text-rose-700">-{record.bhxh.toLocaleString()} đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Bảo hiểm y tế (1.5%):</span>
                  <span className="font-mono text-rose-700">-{record.bhyt.toLocaleString()} đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Bảo hiểm thất nghiệp (1%):</span>
                  <span className="font-mono text-rose-700">-{record.bhtn.toLocaleString()} đ</span>
                </div>
                <div className="flex justify-between font-semibold text-rose-800 pt-1 border-t border-slate-100">
                  <span>Tổng trích nộp BHXH (10.5%):</span>
                  <span className="font-mono">-{record.totalInsurance.toLocaleString()} đ</span>
                </div>

                <div className="pt-1.5 space-y-1 text-slate-500 text-[11px]">
                  <div className="flex justify-between">
                    <span>Giảm trừ gia cảnh bản thân:</span>
                    <span className="font-mono">-{record.personalDeduction.toLocaleString()} đ</span>
                  </div>
                  {record.dependentDeduction > 0 && (
                    <div className="flex justify-between">
                      <span>Giảm trừ người phụ thuộc ({record.dependents || 0}):</span>
                      <span className="font-mono">-{record.dependentDeduction.toLocaleString()} đ</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-700">
                    <span>Thu nhập tính thuế:</span>
                    <span className="font-mono font-medium">{record.taxableIncome.toLocaleString()} đ</span>
                  </div>
                  <div className="flex justify-between text-amber-700 font-bold">
                    <span>Thuế TNCN lũy tiến 7 bậc:</span>
                    <span className="font-mono">-{record.personalIncomeTax.toLocaleString()} đ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* NET TAKE HOME PAY BOX */}
          <div className="p-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-emerald-100 text-[11px] font-bold uppercase tracking-wider block">
                THỰC LĨNH NHẬN VỀ (NET PAY)
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono mt-0.5">
                {record.netSalary.toLocaleString()} VNĐ
              </div>
              <span className="text-emerald-100 text-[10px]">
                Đã trừ đầy đủ 10.5% BHXH và Thuế TNCN lũy tiến theo quy định
              </span>
            </div>

            <div className="text-right text-[11px] bg-white/10 p-3 rounded-xl border border-white/20 backdrop-blur-xs">
              <div className="font-bold text-white flex items-center gap-1.5 justify-end">
                <CreditCard className="w-3.5 h-3.5 text-emerald-200" />
                <span>{employee.bankAccount?.bankName || 'Vietcombank'}</span>
              </div>
              <div className="font-mono font-bold text-emerald-100 mt-0.5">
                STK: {employee.bankAccount?.accountNumber || '001100xxxxxxx'}
              </div>
              <div className="text-[10px] text-emerald-200">
                Chi nhánh: {employee.bankAccount?.branch || 'Sở Giao Dịch'}
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 print:hidden">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Phiếu lương đã được Phòng Kế Toán phê duyệt</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span>In Phiếu Lương</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-[#0072BC] hover:bg-[#005A96] text-white font-bold rounded-lg shadow-sm transition cursor-pointer"
              >
                Xác Nhận Đã Xem
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
