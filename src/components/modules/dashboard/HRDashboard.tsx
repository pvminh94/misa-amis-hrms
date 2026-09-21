import React from 'react';
import {
  Users,
  UserCheck,
  CalendarCheck2,
  Clock,
  AlertCircle,
  Cake,
  TrendingUp,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Building,
  UserPlus,
  FileCheck2,
  Receipt
} from 'lucide-react';
import { DashboardStats } from '../../../types';
import { NavTab } from '../../layout/Sidebar';

interface HRDashboardProps {
  stats: DashboardStats | null;
  loading: boolean;
  onNavigate: (tab: NavTab) => void;
  onOpenAddEmployee: () => void;
  onOpenCreateLeave: () => void;
}

export const HRDashboard: React.FC<HRDashboardProps> = ({
  stats,
  loading,
  onNavigate,
  onOpenAddEmployee,
  onOpenCreateLeave
}) => {
  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0072BC]"></div>
      </div>
    );
  }

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-[#005A96] via-[#0072BC] to-sky-600 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 transform skew-x-12 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-200 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Phân hệ Báo cáo Tổng quan AMIS HRM</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold mt-1">
              Trung tâm Quản trị Nguồn Nhân lực Doanh nghiệp
            </h1>
            <p className="text-sky-100 text-xs mt-1 max-w-xl">
              Hôm nay là Thứ Hai, 21/09/2026. Tỷ lệ chuyên cần đạt{' '}
              <strong className="text-white underline">{stats.attendanceToday.attendanceRate}%</strong>. Có{' '}
              <strong className="text-amber-200">{stats.pendingLeaves}</strong> đơn phê duyệt đang chờ xử lý.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={onOpenAddEmployee}
              className="px-3.5 py-2 bg-white text-[#0072BC] hover:bg-sky-50 text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Thêm nhân sự mới</span>
            </button>
            <button
              onClick={onOpenCreateLeave}
              className="px-3.5 py-2 bg-sky-800/80 hover:bg-sky-800 text-white text-xs font-semibold rounded-lg border border-sky-400/30 transition flex items-center gap-1.5 cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Tạo đơn phép / OT</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Employees */}
        <div
          onClick={() => onNavigate('employees')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-[#0072BC] hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng nhân sự</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0072BC] flex items-center justify-center group-hover:bg-[#0072BC] group-hover:text-white transition">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">{stats.totalEmployees}</div>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
              <span className="text-emerald-600 font-semibold">{stats.activeEmployees} chính thức</span>
              <span>•</span>
              <span className="text-amber-600 font-semibold">{stats.probationEmployees} thử việc</span>
            </div>
          </div>
        </div>

        {/* Attendance Today */}
        <div
          onClick={() => onNavigate('attendance')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-[#0072BC] hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Đi làm hôm nay</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
              <CalendarCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-600">
              {stats.attendanceToday.present + stats.attendanceToday.late}
              <span className="text-xs font-normal text-slate-500"> / {stats.totalEmployees} nhân sự</span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
              <span className="text-emerald-700 font-medium">{stats.attendanceToday.present} đúng giờ</span>
              <span>•</span>
              <span className="text-amber-600 font-medium">{stats.attendanceToday.late} đi trễ</span>
            </div>
          </div>
        </div>

        {/* Pending Approvals */}
        <div
          onClick={() => onNavigate('leaves')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-[#0072BC] hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Đơn từ chờ duyệt</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-amber-600">{stats.pendingLeaves}</div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span>Đơn nghỉ phép & làm thêm OT</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>

        {/* Total Monthly Payroll */}
        <div
          onClick={() => onNavigate('payroll')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-[#0072BC] hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quỹ lương T09/2026</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-slate-900 truncate">{formatVND(stats.totalPayroll)}</div>
            <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Đã chuẩn bị kỳ chi trả</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Distribution (Left 2 columns) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Cơ cấu nhân sự theo Phòng ban & Khối</h2>
              <p className="text-xs text-slate-500 mt-0.5">Phân bổ nguồn lực giữa các đơn vị nghiệp vụ</p>
            </div>
            <button
              onClick={() => onNavigate('organization')}
              className="text-xs text-[#0072BC] font-semibold hover:underline flex items-center gap-1"
            >
              <span>Xem sơ đồ</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {stats.departmentDistribution.map((dept) => {
              const percentage = stats.totalEmployees
                ? Math.round((dept.count / stats.totalEmployees) * 100)
                : 0;

              return (
                <div key={dept.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-2">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {dept.name}
                    </span>
                    <span className="text-slate-600 font-medium">
                      <strong>{dept.count}</strong> nhân sự ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#0072BC] to-sky-500 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 5)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Attendance Breakdown Mini-Stats */}
          <div className="mt-8 pt-5 border-t border-slate-100 grid grid-cols-3 gap-3">
            <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-lg text-center">
              <div className="text-lg font-bold text-emerald-700">{stats.attendanceToday.present}</div>
              <div className="text-[11px] font-medium text-emerald-800">Có mặt đúng giờ</div>
            </div>
            <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-lg text-center">
              <div className="text-lg font-bold text-amber-700">{stats.attendanceToday.late}</div>
              <div className="text-[11px] font-medium text-amber-800">Đi muộn / Về sớm</div>
            </div>
            <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-lg text-center">
              <div className="text-lg font-bold text-rose-700">{stats.attendanceToday.onLeave}</div>
              <div className="text-[11px] font-medium text-rose-800">Nghỉ phép / Vắng</div>
            </div>
          </div>
        </div>

        {/* Right column: Actionable Alerts & Birthdays */}
        <div className="space-y-6">
          {/* Contract Expiry Warnings */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" />
                <span>Hợp đồng & Thử việc sắp hết hạn</span>
              </div>
              <span className="text-xs bg-rose-50 text-rose-600 font-bold px-2 py-0.5 rounded-full">
                {stats.expiringContracts.length}
              </span>
            </div>

            <div className="mt-3 divide-y divide-slate-100">
              {stats.expiringContracts.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-400">Không có hợp đồng nào sắp hết hạn</div>
              ) : (
                stats.expiringContracts.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-800">{item.fullName}</div>
                      <div className="text-[11px] text-slate-500">{item.departmentName}</div>
                      <div className="text-[10px] text-rose-600 font-medium mt-0.5">
                        {item.contractType} - Hết hạn: {item.contractEndDate || 'Tháng 10/2026'}
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigate('employees')}
                      className="px-2 py-1 bg-slate-100 hover:bg-[#0072BC] hover:text-white rounded text-[11px] font-medium text-slate-700 transition cursor-pointer"
                    >
                      Tái ký
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Birthdays this month */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
                <Cake className="w-4 h-4" />
                <span>Sinh nhật nhân sự (T9 - T10)</span>
              </div>
              <span className="text-xs bg-purple-50 text-purple-600 font-bold px-2 py-0.5 rounded-full">
                {stats.upcomingBirthdays.length}
              </span>
            </div>

            <div className="mt-3 divide-y divide-slate-100">
              {stats.upcomingBirthdays.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-400">Không có sinh nhật sắp tới</div>
              ) : (
                stats.upcomingBirthdays.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-800">{item.fullName}</div>
                      <div className="text-[11px] text-slate-500">{item.positionTitle}</div>
                    </div>
                    <span className="px-2 py-1 bg-purple-50 text-purple-700 font-semibold rounded-md text-[11px]">
                      {item.dob.slice(5)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
