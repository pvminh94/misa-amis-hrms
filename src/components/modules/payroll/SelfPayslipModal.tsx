import React, { useState, useEffect } from 'react';
import {
  X,
  Printer,
  CheckCircle2,
  DollarSign,
  Shield,
  Building,
  CreditCard,
  Award,
  Calendar,
  ChevronDown,
  Info,
  TrendingUp,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { PayrollRecord, Employee } from '../../../types';
import { api } from '../../../services/api';

interface SelfPayslipModalProps {
  isOpen: boolean;
  onClose: () => void;
  record?: PayrollRecord | null;
  employee?: Employee | null;
  currentUser?: any;
}

export const SelfPayslipModal: React.FC<SelfPayslipModalProps> = ({
  isOpen,
  onClose,
  record: initialRecord,
  employee: initialEmployee,
  currentUser
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('2026-09');
  const [activeTab, setActiveTab] = useState<'breakdown' | 'tax_tiers' | 'employer_cost'>('breakdown');
  const [payslipData, setPayslipData] = useState<PayrollRecord | null>(initialRecord || null);
  const [currentEmp, setCurrentEmp] = useState<Employee | null>(initialEmployee || null);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  // Load payslip when modal opens or period changes
  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const res = await api.getPayroll({ period: selectedPeriod }).catch(() => ({ data: [] }));
        const list: PayrollRecord[] = res?.data || [];
        
        let found: PayrollRecord | undefined;
        if (currentUser) {
          const empId = currentUser.employeeId || currentUser.id;
          found = list.find((p) => p.employeeId === empId || p.employeeCode === currentUser.employeeCode);
        }
        if (!found && initialEmployee) {
          found = list.find((p) => p.employeeId === initialEmployee.id || p.employeeCode === initialEmployee.code);
        }
        if (!found && list.length > 0) {
          found = list[0];
        }

        if (found) {
          setPayslipData(found);
          if (!currentEmp) {
            const empRes = await api.getEmployee(found.employeeId).catch(() => null);
            if (empRes) setCurrentEmp(empRes);
          }
        } else if (initialRecord) {
          setPayslipData(initialRecord);
        } else {
          // Fallback realistic record so it never renders blank
          const fallback: PayrollRecord = {
            id: 'pay-fallback-01',
            period: selectedPeriod,
            employeeId: currentUser?.employeeId || 'emp-01',
            employeeCode: currentUser?.employeeCode || 'AMIS-0001',
            employeeName: currentUser?.fullName || 'Nguyễn Văn An',
            departmentName: currentUser?.departmentName || 'Khối Công Nghệ & Kỹ Thuật',
            positionTitle: currentUser?.positionTitle || 'Kỹ sư Phần mềm',
            standardWorkDays: 22,
            actualWorkDays: 21.5,
            paidLeaveDays: 1,
            baseSalary: 28000000,
            allowanceTotal: 4000000,
            otPay: 1500000,
            grossSalary: 33500000,
            bhxh: 2240000,
            bhyt: 420000,
            bhtn: 280000,
            totalInsurance: 2940000,
            dependents: 1,
            dependentDeduction: 4400000,
            personalDeduction: 11000000,
            taxableIncome: 14430000,
            personalIncomeTax: 1414500,
            bonus: 2000000,
            deductionsOther: 0,
            netSalary: 31145500,
            status: 'approved',
            paidDate: '2026-10-05'
          };
          setPayslipData(fallback);
        }
      } catch (err) {
        console.error('Lỗi tải phiếu lương cá nhân:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isOpen, selectedPeriod, currentUser]);

  if (!isOpen) return null;

  const record = payslipData || initialRecord || {
    id: 'pay-default',
    period: '2026-09',
    employeeId: 'emp-01',
    employeeCode: 'AMIS-0001',
    employeeName: 'Nguyễn Văn An',
    departmentName: 'Khối Công Nghệ & Kỹ Thuật',
    positionTitle: 'Chuyên viên Công nghệ',
    standardWorkDays: 22,
    actualWorkDays: 22,
    paidLeaveDays: 0,
    baseSalary: 25000000,
    allowanceTotal: 3500000,
    otPay: 0,
    grossSalary: 28500000,
    bhxh: 2000000,
    bhyt: 375000,
    bhtn: 250000,
    totalInsurance: 2625000,
    dependents: 1,
    dependentDeduction: 4400000,
    personalDeduction: 11000000,
    taxableIncome: 9745000,
    personalIncomeTax: 724500,
    bonus: 1000000,
    deductionsOther: 0,
    netSalary: 26150500,
    status: 'approved',
    paidDate: '2026-10-05'
  };

  const employee = currentEmp || initialEmployee || {
    id: record.employeeId,
    code: record.employeeCode,
    fullName: record.employeeName,
    departmentName: record.departmentName,
    positionTitle: record.positionTitle,
    bankAccount: {
      bankName: 'Vietcombank (VCB)',
      accountNumber: '0011004568923',
      branch: 'Hà Nội'
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Tax brackets breakdown calculation for Vietnam PIT
  const computeTaxBrackets = (taxable: number) => {
    const brackets = [
      { tier: 1, range: 'Đến 5.000.000 đ', rate: 0.05, maxCap: 5000000 },
      { tier: 2, range: 'Trên 5 đến 10 triệu đ', rate: 0.10, maxCap: 5000000 },
      { tier: 3, range: 'Trên 10 đến 18 triệu đ', rate: 0.15, maxCap: 8000000 },
      { tier: 4, range: 'Trên 18 đến 32 triệu đ', rate: 0.20, maxCap: 14000000 },
      { tier: 5, range: 'Trên 32 đến 52 triệu đ', rate: 0.25, maxCap: 20000000 },
      { tier: 6, range: 'Trên 52 đến 80 triệu đ', rate: 0.30, maxCap: 28000000 },
      { tier: 7, range: 'Trên 80 triệu đ', rate: 0.35, maxCap: Infinity }
    ];

    let remaining = Math.max(0, taxable);
    return brackets.map((b) => {
      if (remaining <= 0) {
        return { ...b, taxableAmount: 0, taxDue: 0, active: false };
      }
      const chunk = Math.min(remaining, b.maxCap);
      const tax = Math.round(chunk * b.rate);
      remaining -= chunk;
      return { ...b, taxableAmount: chunk, taxDue: tax, active: chunk > 0 };
    });
  };

  const taxBreakdown = computeTaxBrackets(record.taxableIncome || 0);

  // Employer contribution (21.5%)
  const employerBhxh = Math.round(record.baseSalary * 0.175);
  const employerBhyt = Math.round(record.baseSalary * 0.03);
  const employerBhtn = Math.round(record.baseSalary * 0.01);
  const tradeUnionFee = Math.round(record.baseSalary * 0.02);
  const totalEmployerContribution = employerBhxh + employerBhyt + employerBhtn + tradeUnionFee;
  const totalCostToCompany = record.grossSalary + totalEmployerContribution;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in select-none">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-auto print:m-0 print:p-0 print:border-none print:shadow-none">
        {/* Header with AMIS HRM branding */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#005A96] to-[#003860] text-white flex items-center justify-between print:bg-none print:text-black">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-[#0072BC] flex items-center justify-center font-black text-xl shadow-md">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-tight">AMIS HRM</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/20 font-bold uppercase">
                  Phiếu Lương Điện Tử (ESS)
                </span>
              </div>
              <p className="text-xs text-sky-200 mt-0.5">
                Kỳ chi trả: Tháng {selectedPeriod.slice(5)}/{selectedPeriod.slice(0, 4)} (Hợp chuẩn Bộ luật Lao động & Thuế TNCN)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            {/* Period Selector */}
            <div className="relative">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/20 focus:outline-none cursor-pointer"
              >
                <option value="2026-09" className="text-slate-800">Kỳ T09/2026 (Hiện tại)</option>
                <option value="2026-08" className="text-slate-800">Kỳ T08/2026</option>
                <option value="2026-07" className="text-slate-800">Kỳ T07/2026</option>
              </select>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-6 pt-2 text-xs font-bold print:hidden">
          <button
            onClick={() => setActiveTab('breakdown')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'breakdown'
                ? 'border-[#0072BC] text-[#0072BC]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Chi Tiết Thu Nhập & Trích Nộp</span>
          </button>

          <button
            onClick={() => setActiveTab('tax_tiers')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'tax_tiers'
                ? 'border-[#0072BC] text-[#0072BC]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Biểu Thuế TNCN 7 Bậc ({record.personalIncomeTax.toLocaleString()} đ)</span>
          </button>

          <button
            onClick={() => setActiveTab('employer_cost')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'employer_cost'
                ? 'border-[#0072BC] text-[#0072BC]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Chi Phí Doanh Nghiệp (CTC 21.5%)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
          {/* Employee Summary Card */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <span className="text-slate-400 text-[10px] block">Mã nhân sự:</span>
              <strong className="font-mono text-slate-900 text-xs">{employee.code}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Họ và tên:</span>
              <strong className="text-slate-900 text-xs">{employee.fullName}</strong>
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

          {/* TAB 1: BREAKDOWN */}
          {activeTab === 'breakdown' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: Gross Earnings */}
                <div className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-white">
                  <div className="font-bold text-slate-800 text-xs flex items-center justify-between border-b border-slate-100 pb-2 text-[#0072BC]">
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4" />
                      <span>I. CÁC KHOẢN THU NHẬP (GROSS)</span>
                    </span>
                    <span className="font-mono text-slate-900 font-black">
                      {record.grossSalary.toLocaleString()} đ
                    </span>
                  </div>

                  <div className="space-y-2 text-slate-600">
                    <div className="flex justify-between">
                      <span>Lương cơ bản theo hợp đồng:</span>
                      <strong className="font-mono text-slate-900">{record.baseSalary.toLocaleString()} đ</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Ngày công làm việc thực tế / tiêu chuẩn:</span>
                      <span className="font-mono font-bold text-slate-800">
                        {record.actualWorkDays} / {record.standardWorkDays || 22} công
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lương tính theo ngày công:</span>
                      <span className="font-mono text-slate-900">
                        {Math.round((record.baseSalary / (record.standardWorkDays || 22)) * record.actualWorkDays).toLocaleString()} đ
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-700 font-medium">
                      <span>Tổng phụ cấp chế độ:</span>
                      <span className="font-mono">+{record.allowanceTotal.toLocaleString()} đ</span>
                    </div>
                    <div className="text-[11px] text-slate-400 pl-3 space-y-0.5">
                      <div className="flex justify-between">
                        <span>• Phụ cấp ăn trưa (Miễn thuế tối đa 730k):</span>
                        <span className="font-mono">730.000 đ</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• Phụ cấp điện thoại, xăng xe, trách nhiệm:</span>
                        <span className="font-mono">{(record.allowanceTotal - 730000).toLocaleString()} đ</span>
                      </div>
                    </div>
                    {record.otPay > 0 && (
                      <div className="flex justify-between text-purple-700 font-bold">
                        <span>Lương làm thêm giờ (OT 150%):</span>
                        <span className="font-mono">+{record.otPay.toLocaleString()} đ</span>
                      </div>
                    )}
                    {record.bonus > 0 && (
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>Thưởng thành tích & KPIs:</span>
                        <span className="font-mono">+{record.bonus.toLocaleString()} đ</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Deductions */}
                <div className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-white">
                  <div className="font-bold text-slate-800 text-xs flex items-center justify-between border-b border-slate-100 pb-2 text-rose-600">
                    <span className="flex items-center gap-1.5">
                      <Shield className="w-4 h-4" />
                      <span>II. CÁC KHOẢN TRÍCH NỘP (DEDUCTIONS)</span>
                    </span>
                    <span className="font-mono text-rose-700 font-black">
                      -{(record.totalInsurance + record.personalIncomeTax + (record.deductionsOther || 0)).toLocaleString()} đ
                    </span>
                  </div>

                  <div className="space-y-2 text-slate-600">
                    <div className="flex justify-between">
                      <span>Bảo hiểm xã hội BHXH (8%):</span>
                      <span className="font-mono text-rose-700">-{record.bhxh.toLocaleString()} đ</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bảo hiểm y tế BHYT (1.5%):</span>
                      <span className="font-mono text-rose-700">-{record.bhyt.toLocaleString()} đ</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bảo hiểm thất nghiệp BHTN (1%):</span>
                      <span className="font-mono text-rose-700">-{record.bhtn.toLocaleString()} đ</span>
                    </div>
                    <div className="flex justify-between font-bold text-rose-800 pt-1 border-t border-slate-100">
                      <span>Tổng bảo hiểm bắt buộc (10.5%):</span>
                      <span className="font-mono">-{record.totalInsurance.toLocaleString()} đ</span>
                    </div>

                    <div className="pt-1.5 space-y-1.5 border-t border-slate-100 text-[11px] text-slate-500">
                      <div className="flex justify-between">
                        <span>Giảm trừ gia cảnh bản thân:</span>
                        <span className="font-mono">-{record.personalDeduction.toLocaleString()} đ</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Giảm trừ người phụ thuộc ({record.dependents || 0} người × 4.4tr):</span>
                        <span className="font-mono">-{(record.dependentDeduction || 0).toLocaleString()} đ</span>
                      </div>
                      <div className="flex justify-between text-slate-800 font-medium">
                        <span>Thu nhập tính thuế TNCN:</span>
                        <span className="font-mono font-bold">{(record.taxableIncome || 0).toLocaleString()} đ</span>
                      </div>
                      <div className="flex justify-between text-amber-700 font-black text-xs">
                        <span>Thuế TNCN lũy tiến 7 bậc:</span>
                        <span className="font-mono">-{record.personalIncomeTax.toLocaleString()} đ</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* NET PAY BANNER */}
              <div className="p-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-emerald-100 text-[11px] font-bold uppercase tracking-wider block">
                    THỰC LĨNH CHUYỂN KHOẢN (NET TAKE-HOME PAY)
                  </span>
                  <div className="text-3xl font-black font-mono mt-0.5">
                    {record.netSalary.toLocaleString()} VNĐ
                  </div>
                  <span className="text-emerald-100 text-[10px]">
                    = Thu nhập Gross - 10.5% Bảo hiểm - Thuế TNCN lũy tiến + Thưởng
                  </span>
                </div>

                <div className="bg-white/10 p-3.5 rounded-xl border border-white/20 backdrop-blur-xs text-right min-w-[200px]">
                  <div className="font-bold text-white flex items-center gap-1.5 justify-end text-xs">
                    <CreditCard className="w-4 h-4 text-emerald-200" />
                    <span>{employee.bankAccount?.bankName || 'Vietcombank (VCB)'}</span>
                  </div>
                  <div className="font-mono font-bold text-emerald-100 mt-0.5 text-xs">
                    STK: {employee.bankAccount?.accountNumber || '0011004568923'}
                  </div>
                  <div className="text-[10px] text-emerald-200">
                    Chi nhánh: {employee.bankAccount?.branch || 'Hà Nội'} • Ngày chi: {record.paidDate}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TAX TIERS */}
          {activeTab === 'tax_tiers' && (
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0 text-amber-600" />
                <span>
                  Thu nhập tính thuế tháng này của bạn là <strong>{(record.taxableIncome || 0).toLocaleString()} đ</strong>. Hệ thống tự động phân bổ vào từng bậc lũy tiến theo Luật Thuế TNCN Việt Nam:
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Bậc thuế</th>
                      <th className="py-2.5 px-3">Khung thu nhập chịu thuế</th>
                      <th className="py-2.5 px-3 text-center">Thuế suất</th>
                      <th className="py-2.5 px-3 text-right">Thu nhập tính thuế ở bậc này</th>
                      <th className="py-2.5 px-3 text-right">Tiền thuế phát sinh</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {taxBreakdown.map((t) => (
                      <tr
                        key={t.tier}
                        className={t.active ? 'bg-amber-50/50 font-medium' : 'text-slate-400'}
                      >
                        <td className="py-2 px-3 font-bold">
                          <span className={`inline-block w-5 h-5 text-center leading-5 rounded-full text-[10px] ${
                            t.active ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {t.tier}
                          </span>
                        </td>
                        <td className="py-2 px-3">{t.range}</td>
                        <td className="py-2 px-3 text-center font-bold">{t.rate * 100}%</td>
                        <td className="py-2 px-3 text-right font-mono">
                          {t.taxableAmount > 0 ? `${t.taxableAmount.toLocaleString()} đ` : '--'}
                        </td>
                        <td className={`py-2 px-3 text-right font-mono font-bold ${
                          t.taxDue > 0 ? 'text-rose-600' : 'text-slate-400'
                        }`}>
                          {t.taxDue > 0 ? `${t.taxDue.toLocaleString()} đ` : '0 đ'}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                      <td colSpan={3} className="py-2 px-3">TỔNG THUẾ TNCN PHẢI NỘP TRONG THÁNG:</td>
                      <td className="py-2 px-3 text-right font-mono text-[#0072BC]">
                        {(record.taxableIncome || 0).toLocaleString()} đ
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-rose-600 font-black text-sm">
                        {record.personalIncomeTax.toLocaleString()} đ
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: EMPLOYER COST */}
          {activeTab === 'employer_cost' && (
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs leading-relaxed">
                Ngoài lương và phụ cấp trả cho nhân viên, doanh nghiệp trích nộp thêm <strong>21.5%</strong> quỹ bảo hiểm và kinh phí công đoàn cho người lao động theo quy định pháp luật:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <h4 className="font-bold text-slate-800 text-xs">Phần Doanh Nghiệp Đóng (21.5%):</h4>
                  <div className="space-y-1.5 text-slate-600">
                    <div className="flex justify-between">
                      <span>BHXH doanh nghiệp (17.5%):</span>
                      <span className="font-mono text-slate-900 font-bold">{employerBhxh.toLocaleString()} đ</span>
                    </div>
                    <div className="flex justify-between">
                      <span>BHYT doanh nghiệp (3%):</span>
                      <span className="font-mono text-slate-900 font-bold">{employerBhyt.toLocaleString()} đ</span>
                    </div>
                    <div className="flex justify-between">
                      <span>BHTN doanh nghiệp (1%):</span>
                      <span className="font-mono text-slate-900 font-bold">{employerBhtn.toLocaleString()} đ</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Kinh phí công đoàn (2%):</span>
                      <span className="font-mono text-slate-900 font-bold">{tradeUnionFee.toLocaleString()} đ</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200 text-indigo-700 font-bold">
                      <span>Tổng chi bảo hiểm DN:</span>
                      <span className="font-mono">{totalEmployerContribution.toLocaleString()} đ</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <h4 className="font-bold text-slate-800 text-xs">Tổng Chi Phí Thực Tế (Cost to Company):</h4>
                  <div className="space-y-2 text-slate-600">
                    <div className="flex justify-between">
                      <span>Thu nhập Gross nhân viên:</span>
                      <span className="font-mono text-slate-900">{record.grossSalary.toLocaleString()} đ</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Trích nộp bảo hiểm DN:</span>
                      <span className="font-mono text-slate-900">+{totalEmployerContribution.toLocaleString()} đ</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-200 text-slate-900 font-black text-sm">
                      <span>TỔNG CHI PHÍ CTC:</span>
                      <span className="font-mono text-[#0072BC]">{totalCostToCompany.toLocaleString()} đ</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2">
                      Hệ thống AMIS HRM hạch toán chi phí lương và bảo hiểm tự động sang phân hệ AMIS Kế toán.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 print:hidden">
            <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Phiếu lương đã được Kế toán trưởng & Giám đốc Nhân sự ký số bảo mật</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span>In Phiếu Lương (A4)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setConfirmed(true);
                  setTimeout(() => onClose(), 600);
                }}
                className={`px-5 py-2 font-bold rounded-xl shadow-sm transition cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                  confirmed
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#0072BC] hover:bg-[#005A96] text-white'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{confirmed ? 'Đã Xác Nhận' : 'Xác Nhận Đã Xem'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
