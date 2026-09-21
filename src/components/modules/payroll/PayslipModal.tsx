import React from 'react';
import { X, Printer, Download, Landmark, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { PayrollRecord, Employee } from '../../../types';

interface PayslipModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: PayrollRecord | null;
  employee?: Employee;
}

export const PayslipModal: React.FC<PayslipModalProps> = ({
  isOpen,
  onClose,
  record,
  employee
}) => {
  if (!isOpen || !record) return null;

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-[#0072BC] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            <h2 className="font-bold text-base">Phiếu Lương Điện Tử (MISA AMIS Payslip)</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-1.5 rounded hover:bg-white/10 text-white transition"
              title="In phiếu lương"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-white/10 text-white/80 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Payslip Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs bg-slate-50/50" id="printable-payslip">
          {/* Company branding in slip */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-4">
            <div>
              <div className="font-black text-sm text-[#0072BC] uppercase tracking-wide">
                CÔNG TY CỔ PHẦN CÔNG NGHỆ VÀ TRUYỀN THÔNG MISA
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Tòa nhà Technosoft, Phố Duy Tân, Cầu Giấy, Hà Nội | MST: 0101243150
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                {record.status === 'paid' ? 'ĐÃ CHI TRẢ' : 'ĐÃ PHÊ DUYỆT'}
              </span>
              <div className="text-[11px] text-slate-400 mt-1">Kỳ: Tháng {record.period.replace('-', '/')}</div>
            </div>
          </div>

          {/* Employee Info Header */}
          <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div>
              <div className="text-slate-400 text-[11px]">Họ và tên nhân viên:</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">{record.employeeName}</div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">Mã NV: {record.employeeCode}</div>
            </div>
            <div>
              <div className="text-slate-400 text-[11px]">Đơn vị công tác:</div>
              <div className="font-semibold text-slate-800 mt-0.5">{record.departmentName}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{record.positionTitle}</div>
            </div>
            <div className="col-span-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">
                Ngày công tiêu chuẩn: <strong>{record.standardWorkDays}</strong> ngày | Thực tế đi làm:{' '}
                <strong className="text-emerald-700">{record.actualWorkDays}</strong> ngày
              </span>
              {record.otPay > 0 && (
                <span className="text-blue-700 font-medium">Làm thêm giờ (OT): Đã tính phụ trội</span>
              )}
            </div>
          </div>

          {/* Section 1: Earnings (Thu nhập) */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="font-bold text-slate-800 uppercase text-xs flex items-center justify-between border-b pb-2">
              <span className="text-emerald-700">I. CÁC KHOẢN THU NHẬP (GROSS)</span>
              <span className="text-emerald-700">{formatVND(record.grossSalary)}</span>
            </div>

            <div className="space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span>Lương cơ bản (hợp đồng & đóng BHXH):</span>
                <span className="font-mono font-medium text-slate-800">{formatVND(record.baseSalary)}</span>
              </div>
              <div className="flex justify-between">
                <span>Lương theo ngày công thực tế ({record.actualWorkDays}/{record.standardWorkDays} ngày):</span>
                <span className="font-mono font-medium text-slate-800">
                  {formatVND(Math.round((record.baseSalary / record.standardWorkDays) * record.actualWorkDays))}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tổng các khoản phụ cấp (Ăn trưa, xăng xe, trách nhiệm):</span>
                <span className="font-mono font-medium text-slate-800">{formatVND(record.allowanceTotal)}</span>
              </div>
              {record.otPay > 0 && (
                <div className="flex justify-between text-blue-700 font-medium">
                  <span>Tiền lương làm thêm ngoài giờ (OT 150%):</span>
                  <span className="font-mono">{formatVND(record.otPay)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Deductions (Các khoản giảm trừ) */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="font-bold text-slate-800 uppercase text-xs flex items-center justify-between border-b pb-2">
              <span className="text-rose-700">II. CÁC KHOẢN TRÍCH NỘP & GIẢM TRỪ</span>
              <span className="text-rose-700">-{formatVND(record.totalInsurance + record.personalIncomeTax)}</span>
            </div>

            <div className="space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span>Bảo hiểm Xã hội (BHXH 8%):</span>
                <span className="font-mono text-slate-700">-{formatVND(record.bhxh)}</span>
              </div>
              <div className="flex justify-between">
                <span>Bảo hiểm Y tế (BHYT 1.5%):</span>
                <span className="font-mono text-slate-700">-{formatVND(record.bhyt)}</span>
              </div>
              <div className="flex justify-between">
                <span>Bảo hiểm Thất nghiệp (BHTN 1%):</span>
                <span className="font-mono text-slate-700">-{formatVND(record.bhtn)}</span>
              </div>
              <div className="flex justify-between font-semibold text-slate-800 border-t pt-1">
                <span>Tổng trích nộp bảo hiểm bắt buộc (10.5%):</span>
                <span className="font-mono">-{formatVND(record.totalInsurance)}</span>
              </div>

              <div className="pt-2 border-t space-y-1.5 text-slate-500">
                <div className="flex justify-between text-[11px]">
                  <span>Giảm trừ gia cảnh bản thân (Luật Thuế TNCN):</span>
                  <span>{formatVND(record.personalDeduction)}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>Giảm trừ người phụ thuộc ({record.dependents} người x 4.4tr):</span>
                  <span>{formatVND(record.dependentDeduction)}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>Thu nhập tính thuế:</span>
                  <span className="font-mono font-medium text-slate-700">{formatVND(record.taxableIncome)}</span>
                </div>
                <div className="flex justify-between font-semibold text-rose-700 pt-1">
                  <span>Thuế Thu nhập Cá nhân (TNCN) khấu trừ:</span>
                  <span className="font-mono">-{formatVND(record.personalIncomeTax)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Net Salary (Thực lĩnh) */}
          <div className="bg-gradient-to-r from-blue-700 to-[#0072BC] text-white p-5 rounded-xl shadow-md flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-blue-100 uppercase tracking-wider">
                III. THỰC LĨNH NHẬN VỀ (NET PAY)
              </div>
              <div className="text-2xl font-black mt-1">{formatVND(record.netSalary)}</div>
              <div className="text-[11px] text-blue-200 mt-0.5">
                Hình thức: Chuyển khoản ngân hàng • Ngày dự kiến: 05/10/2026
              </div>
            </div>
            <div className="p-3 bg-white/10 rounded-xl">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Chứng từ xuất từ phân hệ AMIS Tiền lương</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold rounded-lg transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
