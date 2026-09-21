import React, { useState } from 'react';
import {
  CreditCard,
  DollarSign,
  FileSpreadsheet,
  CheckCircle,
  Eye,
  Search,
  Lock,
  Send,
  Building,
  TrendingDown,
  ShieldAlert,
  Percent
} from 'lucide-react';
import { PayrollRecord, Department } from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';

interface PayrollViewProps {
  payrollList: PayrollRecord[];
  summary: { totalGross: number; totalInsurance: number; totalTax: number; totalNet: number; count: number };
  departments: Department[];
  loading: boolean;
  onRefresh: () => void;
  onSelectRecord: (record: PayrollRecord) => void;
  onUpdatePayrollStatus: (status: 'draft' | 'approved' | 'paid') => Promise<void>;
}

export const PayrollView: React.FC<PayrollViewProps> = ({
  payrollList,
  summary,
  departments,
  loading,
  onRefresh,
  onSelectRecord,
  onUpdatePayrollStatus
}) => {
  const { role } = useAuth();
  const { showToast } = useToast();
  const [selectedDept, setSelectedDept] = useState('all');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const filteredList = payrollList.filter((item) => {
    const matchesDept = selectedDept === 'all' || item.departmentName === selectedDept;
    const matchesSearch =
      item.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      item.employeeCode.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleBatchStatus = async (status: 'approved' | 'paid') => {
    try {
      setActionLoading(true);
      await onUpdatePayrollStatus(status);
      showToast(
        status === 'paid'
          ? 'Đã xác nhận chi trả toàn bộ bảng lương tháng 09/2026'
          : 'Đã phê duyệt & chốt bảng lương kỳ 09/2026',
        'success'
      );
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Lỗi thao tác bảng lương', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Mã NV',
      'Họ tên',
      'Phòng ban',
      'Chức vụ',
      'Ngày công',
      'Lương cơ bản',
      'Phụ cấp',
      'Lương Gross',
      'BHXH (8%)',
      'BHYT (1.5%)',
      'BHTN (1%)',
      'Tổng BH',
      'Thuế TNCN',
      'Thực lĩnh Net'
    ];
    const rows = filteredList.map((p) => [
      p.employeeCode,
      `"${p.employeeName}"`,
      `"${p.departmentName}"`,
      `"${p.positionTitle}"`,
      p.actualWorkDays,
      p.baseSalary,
      p.allowanceTotal,
      p.grossSalary,
      p.bhxh,
      p.bhyt,
      p.bhtn,
      p.totalInsurance,
      p.personalIncomeTax,
      p.netSalary
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Bang_luong_MISA_09_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Đã xuất file bảng lương thành công', 'success');
  };

  return (
    <div className="space-y-4 animate-in fade-in">
      {/* Top Banner & Control Actions */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0072BC] uppercase tracking-wider">
            <CreditCard className="w-4 h-4" />
            <span>AMIS Tiền Lương & Thuế TNCN & BHXH</span>
          </div>
          <h1 className="text-lg font-bold text-slate-800 mt-1">
            Bảng Tính Lương Tự Động Kỳ Tháng 09/2026
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Áp dụng chuẩn quy định Thuế TNCN (Giảm trừ 11tr/tháng + 4.4tr/người) và BHXH (10.5%)
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Xuất Excel</span>
          </button>

          {role === 'admin' && (
            <>
              <button
                onClick={() => handleBatchStatus('approved')}
                disabled={actionLoading}
                className="px-3 py-2 bg-blue-50 text-[#0072BC] hover:bg-blue-100 text-xs font-semibold rounded-lg border border-blue-200 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Chốt bảng lương</span>
              </button>
              <button
                onClick={() => handleBatchStatus('paid')}
                disabled={actionLoading}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Chi trả lương</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* KPI Summaries */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Tổng quỹ lương thực lĩnh (NET)</div>
          <div className="text-xl font-black text-[#0072BC] mt-1">{formatVND(summary.totalNet)}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Cho {summary.count} cán bộ nhân viên</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Tổng thu nhập danh nghĩa (GROSS)</div>
          <div className="text-xl font-bold text-slate-800 mt-1">{formatVND(summary.totalGross)}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Bao gồm lương cơ bản & phụ cấp</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Trích nộp BHXH bắt buộc (10.5%)</div>
          <div className="text-xl font-bold text-amber-600 mt-1">{formatVND(summary.totalInsurance)}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">BHXH 8%, BHYT 1.5%, BHTN 1%</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Tổng Thuế TNCN khấu trừ</div>
          <div className="text-xl font-bold text-rose-600 mt-1">{formatVND(summary.totalTax)}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Nộp NSNN theo biểu lũy tiến</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc mã nhân viên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0072BC]/20"
          />
        </div>

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 w-full sm:w-auto"
        >
          <option value="all">Tất cả phòng ban</option>
          {departments.map((d) => (
            <option key={d.id} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Nhân sự</th>
                <th className="py-3 px-4">Đơn vị & Vị trí</th>
                <th className="py-3 px-4 text-center">Công thực tế</th>
                <th className="py-3 px-4 text-right">Lương cơ bản</th>
                <th className="py-3 px-4 text-right">Tổng phụ cấp</th>
                <th className="py-3 px-4 text-right">Lương Gross</th>
                <th className="py-3 px-4 text-right">Trừ BHXH (10.5%)</th>
                <th className="py-3 px-4 text-right">Thuế TNCN</th>
                <th className="py-3 px-4 text-right font-black text-[#0072BC]">Thực lĩnh (NET)</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    Đang tính toán dữ liệu bảng lương...
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    Không có bản ghi lương nào phù hợp
                  </td>
                </tr>
              ) : (
                filteredList.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-blue-50/30 transition group cursor-pointer"
                    onClick={() => onSelectRecord(row)}
                  >
                    <td className="py-3 px-4 font-bold text-slate-900 group-hover:text-[#0072BC]">
                      <div>{row.employeeName}</div>
                      <div className="text-[10px] text-slate-400 font-mono font-normal">
                        {row.employeeCode}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">{row.positionTitle}</div>
                      <div className="text-[10px] text-slate-400">{row.departmentName}</div>
                    </td>

                    <td className="py-3 px-4 text-center font-bold text-slate-700">
                      {row.actualWorkDays} / {row.standardWorkDays}
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-slate-700">
                      {formatVND(row.baseSalary)}
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-slate-600">
                      {formatVND(row.allowanceTotal)}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">
                      {formatVND(row.grossSalary)}
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-amber-600">
                      -{formatVND(row.totalInsurance)}
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-rose-600">
                      {row.personalIncomeTax > 0 ? `-${formatVND(row.personalIncomeTax)}` : '0 ₫'}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-black text-[#0072BC] text-sm bg-blue-50/20">
                      {formatVND(row.netSalary)}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          row.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-[#0072BC]'
                        }`}
                      >
                        {row.status === 'paid' ? 'Đã chi trả' : 'Đã chốt'}
                      </span>
                    </td>

                    <td
                      className="py-3 px-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => onSelectRecord(row)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-[#0072BC] hover:text-white rounded-lg text-slate-700 text-xs font-medium transition flex items-center gap-1 cursor-pointer"
                        title="Xem phiếu lương điện tử"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Phiếu lương</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
