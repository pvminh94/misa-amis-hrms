import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Clock,
  MapPin,
  Wifi,
  LogIn,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Search,
  Building,
  Plus,
  RefreshCw,
  FileCheck2,
  Calendar,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Fingerprint,
  ScanFace,
  Smartphone,
  Sliders,
  Award,
  AlertOctagon,
  Download,
  DollarSign
} from 'lucide-react';
import {
  AttendanceRecord,
  Department,
  ShiftDefinition,
  MonthlyTimesheetEmployee,
  ShiftSwapRequest,
  AttendanceRegularization,
  GeofenceLocation,
  Employee,
  DayTimesheetCell,
  ShiftRosterEntry,
  RawPunchLog,
  AttendancePolicySetting,
  AttendanceAnalytics,
  DayRosterSchedule
} from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { api } from '../../../services/api';
import { TimesheetCellModal } from './TimesheetCellModal';
import { ShiftModal } from './ShiftModal';
import { ShiftSwapModal } from './ShiftSwapModal';
import { RegularizationModal } from './RegularizationModal';
import { BulkRosterModal } from './BulkRosterModal';
import { RosterCellModal } from './RosterCellModal';
import { OmniCheckInModal } from './OmniCheckInModal';
import { SelfPayslipModal } from '../payroll/SelfPayslipModal';
import { PayrollRecord } from '../../../types';

interface AttendanceViewProps {
  attendanceList: AttendanceRecord[];
  departments: Department[];
  employees: Employee[];
  loading: boolean;
  onRefresh: () => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  attendanceList,
  departments,
  employees,
  loading,
  onRefresh
}) => {
  const { currentUser, role } = useAuth();
  const { showToast } = useToast();

  // Sub-tabs navigation
  const [activeSubTab, setActiveSubTab] = useState<
    'roster' | 'monthly' | 'biometrics' | 'analytics' | 'daily' | 'shifts' | 'swaps' | 'geofence'
  >('roster');

  // Core Data States
  const [rosterData, setRosterData] = useState<ShiftRosterEntry[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyTimesheetEmployee[]>([]);
  const [rawPunches, setRawPunches] = useState<RawPunchLog[]>([]);
  const [analytics, setAnalytics] = useState<AttendanceAnalytics | null>(null);
  const [policy, setPolicy] = useState<AttendancePolicySetting | null>(null);
  const [shifts, setShifts] = useState<ShiftDefinition[]>([]);
  const [swaps, setSwaps] = useState<ShiftSwapRequest[]>([]);
  const [regularizations, setRegularizations] = useState<AttendanceRegularization[]>([]);
  const [locations, setLocations] = useState<GeofenceLocation[]>([]);

  // Filters & Search
  const [selectedDept, setSelectedDept] = useState('all');
  const [search, setSearch] = useState('');
  const [punchSourceFilter, setPunchSourceFilter] = useState('all');
  const [simulating, setSimulating] = useState(false);
  const [syncingBiometrics, setSyncingBiometrics] = useState(false);

  // Modals States
  const [selectedCell, setSelectedCell] = useState<{
    employeeId: string;
    employeeName: string;
    dayData: DayTimesheetCell;
  } | null>(null);

  const [selectedRosterCell, setSelectedRosterCell] = useState<{
    employeeId: string;
    employeeName: string;
    day: number;
    currentSchedule?: DayRosterSchedule;
  } | null>(null);

  const [isBulkRosterOpen, setIsBulkRosterOpen] = useState(false);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<ShiftDefinition | null>(null);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [isOmniCheckInOpen, setIsOmniCheckInOpen] = useState(false);
  const [isSelfPayslipOpen, setIsSelfPayslipOpen] = useState(false);
  const [userPayslip, setUserPayslip] = useState<PayrollRecord | null>(null);

  // Load all enterprise attendance module data
  const loadModuleData = async () => {
    try {
      const [rRes, mRes, pRes, aRes, polRes, sRes, swRes, regRes, lRes, payRes] = await Promise.all([
        api.getShiftRoster().catch(() => []),
        api.getMonthlyTimesheets().catch(() => []),
        api.getRawPunchLogs().catch(() => []),
        api.getAttendanceAnalytics().catch(() => null),
        api.getAttendancePolicy().catch(() => null),
        api.getShifts().catch(() => []),
        api.getShiftSwaps().catch(() => []),
        api.getRegularizations().catch(() => []),
        api.getGeofenceLocations().catch(() => []),
        api.getPayroll().catch(() => [])
      ]);

      setRosterData(Array.isArray(rRes) ? rRes : []);
      setMonthlyData(Array.isArray(mRes) ? mRes : []);
      setRawPunches(Array.isArray(pRes) ? pRes : []);
      setAnalytics(aRes);
      setPolicy(polRes);
      setShifts(Array.isArray(sRes) ? sRes : []);
      setSwaps(Array.isArray(swRes) ? swRes : []);
      setRegularizations(Array.isArray(regRes) ? regRes : []);
      setLocations(Array.isArray(lRes) ? lRes : []);

      if (Array.isArray(payRes) && payRes.length > 0) {
        const found = payRes.find((p: any) => p.employeeId === currentUser.id);
        setUserPayslip(found || payRes[0]);
      }
    } catch (err) {
      console.error('Error loading enterprise attendance data:', err);
    }
  };

  useEffect(() => {
    loadModuleData();
  }, []);

  // Quick Self Check-in / Check-out Simulator
  const handleSelfCheckIn = async () => {
    try {
      setSimulating(true);
      const res = await api.checkIn(currentUser.id);
      showToast(res.notes || `Chấm công vào thành công: ${res.checkIn}`, 'success');
      onRefresh();
      loadModuleData();
    } catch (err: any) {
      showToast(err.message || 'Lỗi chấm công', 'error');
    } finally {
      setSimulating(false);
    }
  };

  const handleSelfCheckOut = async () => {
    try {
      setSimulating(true);
      const res = await api.checkOut(currentUser.id);
      showToast(`Chấm công ra thành công: ${res.checkOut} (${res.workHours}h làm việc)`, 'success');
      onRefresh();
      loadModuleData();
    } catch (err: any) {
      showToast(err.message || 'Lỗi chấm công', 'error');
    } finally {
      setSimulating(false);
    }
  };

  // Sync Biometric Punch Logs
  const handleSyncBiometrics = async () => {
    try {
      setSyncingBiometrics(true);
      const res = await api.syncBiometricLogs();
      showToast(
        `Đồng bộ thành công dữ liệu từ máy Ronald Jack & Hikvision (+${res.recordsAdded} bản ghi mới)`,
        'success'
      );
      loadModuleData();
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Lỗi đồng bộ máy chấm công', 'error');
    } finally {
      setSyncingBiometrics(false);
    }
  };

  // Roster Actions
  const handleSaveRosterCell = async (day: number, schedule: DayRosterSchedule) => {
    if (!selectedRosterCell) return;
    try {
      await api.updateShiftRosterCell(selectedRosterCell.employeeId, day, schedule);
      showToast(`Đã cập nhật ca cho ${selectedRosterCell.employeeName} ngày ${day}/09`, 'success');
      setSelectedRosterCell(null);
      loadModuleData();
    } catch (err: any) {
      showToast(err.message || 'Lỗi cập nhật lịch ca', 'error');
    }
  };

  const handleApplyBulkRoster = async (data: any) => {
    try {
      await api.bulkAssignShiftRoster(data);
      showToast(
        `Đã phân ca hàng loạt cho ${data.departmentName === 'all' ? 'toàn công ty' : data.departmentName}`,
        'success'
      );
      setIsBulkRosterOpen(false);
      loadModuleData();
    } catch (err: any) {
      showToast(err.message || 'Lỗi phân ca hàng loạt', 'error');
    }
  };

  // Monthly Timesheet Cell Update handler
  const handleSaveTimesheetCell = async (
    employeeId: string,
    day: number,
    updates: Partial<DayTimesheetCell>
  ) => {
    try {
      await api.updateTimesheetCell(employeeId, day, updates);
      showToast(`Đã cập nhật công ngày ${day}/09 (Tự động liên kết tính lại bảng lương)`, 'success');
      loadModuleData();
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Lỗi cập nhật ô công', 'error');
    }
  };

  // Shift action handlers
  const handleSaveShift = async (shiftData: Partial<ShiftDefinition>) => {
    try {
      if (editingShift) {
        await api.updateShift(editingShift.id, shiftData);
        showToast(`Đã cập nhật ca làm việc ${shiftData.name}`, 'success');
      } else {
        await api.createShift(shiftData);
        showToast(`Đã thêm mới ca làm việc ${shiftData.name}`, 'success');
      }
      setIsShiftModalOpen(false);
      setEditingShift(null);
      loadModuleData();
    } catch (err: any) {
      showToast(err.message || 'Lỗi lưu ca làm việc', 'error');
    }
  };

  // Policy Save Handler
  const handleSavePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!policy) return;
    try {
      await api.updateAttendancePolicy(policy);
      showToast('Đã lưu quy tắc chấm công & thời gian linh hoạt (Grace Period)', 'success');
      loadModuleData();
    } catch (err: any) {
      showToast(err.message || 'Lỗi lưu quy tắc', 'error');
    }
  };

  // Swap action handlers
  const handleCreateSwap = async (data: Partial<ShiftSwapRequest>) => {
    try {
      await api.createShiftSwap(data);
      showToast('Đã gửi yêu cầu đổi ca làm việc', 'success');
      setIsSwapModalOpen(false);
      loadModuleData();
    } catch (err: any) {
      showToast(err.message || 'Lỗi gửi yêu cầu', 'error');
    }
  };

  const handleApproveSwap = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await api.updateShiftSwapStatus(id, status, currentUser.name);
      showToast(status === 'approved' ? 'Đã phê duyệt đổi ca thành công' : 'Đã từ chối yêu cầu đổi ca', 'success');
      loadModuleData();
    } catch (err: any) {
      showToast(err.message || 'Lỗi duyệt đổi ca', 'error');
    }
  };

  // Regularization handlers
  const handleCreateRegularization = async (data: Partial<AttendanceRegularization>) => {
    try {
      await api.createRegularization(data);
      showToast('Đã gửi đơn giải trình chấm công', 'success');
      setIsRegModalOpen(false);
      loadModuleData();
    } catch (err: any) {
      showToast(err.message || 'Lỗi gửi đơn giải trình', 'error');
    }
  };

  const handleApproveRegularization = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await api.updateRegularizationStatus(id, status, currentUser.name);
      showToast(
        status === 'approved'
          ? 'Đã duyệt giải trình và bù công thành công (Tự động cập nhật bảng lương)'
          : 'Đã từ chối đơn giải trình',
        'success'
      );
      loadModuleData();
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Lỗi duyệt giải trình', 'error');
    }
  };

  // CSV Exporters
  const handleExportMonthlyCSV = () => {
    const daysHeader = Array.from({ length: 30 }, (_, i) => `${i + 1}`).join(',');
    const headers = `Mã NV,Họ tên,Phòng ban,${daysHeader},Tổng công,Nghỉ phép,Đi muộn,Tăng ca OT`;
    const rows = monthlyData.map((emp) => {
      const daysStr = Array.from({ length: 30 }, (_, i) => emp.days[i + 1]?.status || '--').join(',');
      return `${emp.employeeCode},"${emp.employeeName}","${emp.departmentName}",${daysStr},${emp.totalWorkDays || 0},${emp.totalPaidLeaves || 0},${emp.totalLateTimes || 0},${emp.totalOTHours || 0}`;
    });
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Bang_cham_cong_AMIS_Thang_09_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Đã xuất file Bảng chấm công tháng 09/2026', 'success');
  };

  const handleExportRosterCSV = () => {
    const daysHeader = Array.from({ length: 30 }, (_, i) => `${i + 1}`).join(',');
    const headers = `Mã NV,Họ tên,Phòng ban,${daysHeader}`;
    const rows = (rosterData || []).map((emp) => {
      const daysStr = Array.from({ length: 30 }, (_, i) => emp.schedules?.[i + 1]?.shiftCode || 'OFF').join(',');
      return `${emp.employeeCode},"${emp.employeeName}","${emp.departmentName}",${daysStr}`;
    });
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Ke_hoach_phan_ca_AMIS_Thang_09_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Đã xuất file Kế hoạch phân ca tháng 09/2026', 'success');
  };

  // Filtered views with strict null-safety
  const filteredRoster = (rosterData || []).filter((item) => {
    if (!item) return false;
    const matchesDept = selectedDept === 'all' || item.departmentName === selectedDept;
    const matchesSearch =
      (item.employeeName || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.employeeCode || '').toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const filteredMonthly = (monthlyData || []).filter((item) => {
    if (!item) return false;
    const matchesDept = selectedDept === 'all' || item.departmentName === selectedDept;
    const matchesSearch =
      (item.employeeName || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.employeeCode || '').toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const filteredPunches = (rawPunches || []).filter((item) => {
    if (!item) return false;
    const matchesSource = punchSourceFilter === 'all' || item.source === punchSourceFilter;
    const matchesSearch =
      (item.employeeName || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.employeeCode || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.deviceName || '').toLowerCase().includes(search.toLowerCase());
    return matchesSource && matchesSearch;
  });

  // Cell Badge Class Helpers
  const getTimesheetBadgeClass = (status: DayTimesheetCell['status']) => {
    switch (status) {
      case 'X':
        return 'bg-emerald-100 text-emerald-800 font-bold';
      case 'L':
        return 'bg-amber-100 text-amber-800 font-bold';
      case 'P':
        return 'bg-blue-100 text-[#0072BC] font-bold';
      case 'KP':
        return 'bg-rose-100 text-rose-800 font-bold';
      case 'OT':
        return 'bg-purple-100 text-purple-800 font-bold ring-1 ring-purple-300';
      case 'CT':
        return 'bg-indigo-100 text-indigo-800 font-bold';
      case 'OFF':
        return 'bg-slate-100 text-slate-400';
      default:
        return 'bg-slate-50 text-slate-400';
    }
  };

  const getRosterBadgeClass = (shiftCode: string) => {
    switch (shiftCode) {
      case 'CA-HC':
        return 'bg-blue-100 text-[#0072BC] font-bold';
      case 'CA-S':
        return 'bg-amber-100 text-amber-800 font-bold';
      case 'CA-C':
        return 'bg-indigo-100 text-indigo-800 font-bold';
      case 'CA-DEM':
        return 'bg-purple-100 text-purple-800 font-bold';
      case 'OFF':
        return 'bg-slate-100 text-slate-400';
      default:
        return 'bg-slate-50 text-slate-400';
    }
  };

  const total = attendanceList.length;
  const present = attendanceList.filter((a) => a.status === 'present').length;
  const late = attendanceList.filter((a) => a.status === 'late').length;
  const leave = attendanceList.filter((a) => a.status === 'leave').length;

  return (
    <div className="space-y-4 animate-in fade-in">
      {/* Top Banner & Quick Check-in Simulator */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0072BC] uppercase tracking-wider">
            <CalendarCheck className="w-4 h-4" />
            <span>Phân hệ AMIS Chấm Công & Quản Lý Ca Kíp Doanh Nghiệp (Enterprise Pro)</span>
          </div>
          <h1 className="text-lg font-bold text-slate-800 mt-0.5">
            Trung Tâm Xếp Lịch Phân Ca & Quản Trị Chấm Công (Kỳ T09/2026)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tích hợp xếp ca tuần/tháng, nhật ký quẹt thẻ thô Ronald Jack/Hikvision, ma trận công 30 ngày & phân tích chuyên cần
          </p>
        </div>

        {/* Action Buttons & Simulator Widget */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsOmniCheckInOpen(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Mở máy quét FaceID AI, App Mobile GPS Geofence & Selfie, hoặc Vân tay Ronald Jack"
          >
            <ScanFace className="w-4 h-4" />
            <span>Bấm Công Đa Phương Thức</span>
          </button>

          <button
            onClick={() => setIsSelfPayslipOpen(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Nhân viên tự tra cứu chi tiết phiếu lương tháng, BHXH 10.5% và thuế TNCN của mình"
          >
            <DollarSign className="w-4 h-4" />
            <span>Xem Phiếu Lương Của Tôi</span>
          </button>

          {/* GPS Geofence Simulator Widget */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-2 rounded-xl">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-800 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>AMIS Duy Tân</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                <Wifi className="w-3 h-3 text-emerald-600" />
                <span>AMIS_5G • 15m (Hợp lệ)</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 pl-2.5 border-l border-slate-200">
              <button
                onClick={handleSelfCheckIn}
                disabled={simulating}
                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-1 cursor-pointer active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Chấm Vào</span>
              </button>
              <button
                onClick={handleSelfCheckOut}
                disabled={simulating}
                className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-1 cursor-pointer active:scale-95"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Chấm Ra</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enterprise Sub-Tabs Navigation Bar */}
      <div className="flex border-b border-slate-200 bg-white px-2 rounded-xl border shadow-xs text-xs font-semibold overflow-x-auto select-none">
        <button
          onClick={() => setActiveSubTab('roster')}
          className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
            activeSubTab === 'roster'
              ? 'border-[#0072BC] text-[#0072BC] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Xếp lịch & Phân ca (Roster)</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-[#0072BC] font-bold">
            Kế hoạch
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('monthly')}
          className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
            activeSubTab === 'monthly'
              ? 'border-[#0072BC] text-[#0072BC] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Bảng công tổng hợp tháng</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
            30 ngày
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('biometrics')}
          className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
            activeSubTab === 'biometrics'
              ? 'border-[#0072BC] text-[#0072BC] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Fingerprint className="w-4 h-4" />
          <span>Nhật ký quẹt thẻ thô máy vân tay / FaceID</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-100 text-purple-800 font-bold">
            {rawPunches.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
            activeSubTab === 'analytics'
              ? 'border-[#0072BC] text-[#0072BC] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Báo cáo chuyên cần & Top đi muộn</span>
          {analytics?.lateLeaderboard?.some((l) => l.severity === 'penalty') && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('daily')}
          className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
            activeSubTab === 'daily'
              ? 'border-[#0072BC] text-[#0072BC] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Điểm danh hôm nay (21/09)</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700">
            {present + late}/{total}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('shifts')}
          className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
            activeSubTab === 'shifts'
              ? 'border-[#0072BC] text-[#0072BC] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Danh mục ca & Quy tắc đi muộn</span>
        </button>

        <button
          onClick={() => setActiveSubTab('swaps')}
          className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
            activeSubTab === 'swaps'
              ? 'border-[#0072BC] text-[#0072BC] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Đổi ca & Bù công</span>
          {(((swaps || []).filter((s) => s.status === 'pending').length > 0) ||
            ((regularizations || []).filter((r) => r.status === 'pending').length > 0)) && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-bold animate-pulse">
              {((swaps || []).filter((s) => s.status === 'pending').length) +
                ((regularizations || []).filter((r) => r.status === 'pending').length)}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('geofence')}
          className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
            activeSubTab === 'geofence'
              ? 'border-[#0072BC] text-[#0072BC] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>GPS & Wifi</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: XẾP LỊCH & PHÂN CA (SHIFT ROSTERING PLANNER)      */}
      {/* ======================================================== */}
      {activeSubTab === 'roster' && (
        <div className="space-y-4">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm nhân sự xếp ca..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0072BC]/20"
                />
              </div>

              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
              >
                <option value="all">Tất cả phòng ban</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Legend */}
              <div className="hidden xl:flex items-center gap-2 text-[10px] text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                <span className="flex items-center gap-1 font-bold text-[#0072BC]">
                  <span className="w-2 h-2 rounded bg-[#0072BC]"></span> HC: Hành chính
                </span>
                <span className="flex items-center gap-1 font-bold text-amber-700">
                  <span className="w-2 h-2 rounded bg-amber-500"></span> S: Ca Sáng
                </span>
                <span className="flex items-center gap-1 font-bold text-indigo-700">
                  <span className="w-2 h-2 rounded bg-indigo-500"></span> C: Ca Chiều
                </span>
                <span className="flex items-center gap-1 font-bold text-purple-700">
                  <span className="w-2 h-2 rounded bg-purple-500"></span> ĐÊM: Ca Đêm
                </span>
              </div>

              <button
                onClick={() => setIsBulkRosterOpen(true)}
                className="px-3 py-1.5 bg-[#0072BC] hover:bg-[#005A96] text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                title="Cho phép trưởng bộ phận / quản lý tự sắp lịch phân ca cho nhân viên của mình"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Bộ Phận Tự Sắp Lịch Cho Nhân Viên</span>
              </button>

              <button
                onClick={handleExportRosterCSV}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Xuất Lịch Ca</span>
              </button>
            </div>
          </div>

          {/* Roster 30-Day Grid */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto max-h-[580px]">
              <table className="w-full text-left text-[11px] border-collapse select-none">
                <thead className="sticky top-0 z-20 bg-slate-100 shadow-xs text-slate-700 font-bold border-b border-slate-300">
                  <tr>
                    <th className="py-2.5 px-3 sticky left-0 z-30 bg-slate-100 border-r border-slate-300 min-w-[170px]">
                      Họ tên nhân sự
                    </th>
                    {Array.from({ length: 30 }, (_, i) => {
                      const day = i + 1;
                      const isWeekend = [5, 6, 12, 13, 19, 20, 26, 27].includes(day);
                      const isToday = day === 21;
                      return (
                        <th
                          key={day}
                          className={`py-2 px-1 text-center min-w-[34px] border-r border-slate-200 ${
                            isToday
                              ? 'bg-blue-100 text-[#0072BC] font-black ring-2 ring-[#0072BC]/40'
                              : isWeekend
                              ? 'bg-slate-200/70 text-slate-400'
                              : ''
                          }`}
                        >
                          <div className="leading-none">{day}</div>
                          <div className="text-[9px] font-normal mt-0.5">
                            {isWeekend ? (day % 2 === 0 ? 'CN' : 'T7') : 'T'}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredRoster.length === 0 ? (
                    <tr>
                      <td colSpan={32} className="py-12 text-center text-slate-400">
                        Không tìm thấy dữ liệu phân ca tháng 09/2026
                      </td>
                    </tr>
                  ) : (
                    filteredRoster.map((row) => (
                      <tr key={row.employeeId} className="hover:bg-slate-50 transition">
                        <td className="py-2 px-3 sticky left-0 z-10 bg-white border-r border-slate-200 shadow-xs">
                          <div className="font-bold text-slate-900 truncate max-w-[160px]">
                            {row.employeeName}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {row.employeeCode} • {row.departmentName?.split(' ')?.[0] || 'Phòng'}
                          </div>
                        </td>

                        {Array.from({ length: 30 }, (_, i) => {
                          const day = i + 1;
                          const schedule = row.schedules?.[day];
                          const isWeekend = [5, 6, 12, 13, 19, 20, 26, 27].includes(day);

                          return (
                            <td
                              key={day}
                              onClick={() => {
                                setSelectedRosterCell({
                                  employeeId: row.employeeId,
                                  employeeName: row.employeeName,
                                  day,
                                  currentSchedule: schedule
                                });
                              }}
                              className={`p-1 text-center border-r border-slate-100 transition cursor-pointer hover:ring-2 hover:ring-[#0072BC] hover:z-10 ${
                                isWeekend ? 'bg-slate-50/50' : ''
                              }`}
                              title={
                                schedule
                                  ? `Ngày ${day}/09: ${schedule.shiftName} - Nhấp để đổi ca phân bổ`
                                  : 'Chưa phân ca'
                              }
                            >
                              <span
                                className={`inline-block w-6 h-6 leading-6 rounded-md text-[9px] font-mono ${getRosterBadgeClass(
                                  schedule?.shiftCode || 'OFF'
                                )}`}
                              >
                                {schedule?.shiftCode === 'CA-HC'
                                  ? 'HC'
                                  : schedule?.shiftCode === 'CA-S'
                                  ? 'S'
                                  : schedule?.shiftCode === 'CA-C'
                                  ? 'C'
                                  : schedule?.shiftCode === 'CA-DEM'
                                  ? 'ĐÊM'
                                  : 'OFF'}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Lịch phân ca tuân thủ Điều 110 Bộ luật Lao động 2019 (khoảng cách nghỉ giữa 2 ca tối thiểu 12 giờ)
              </span>
              <span>Kỳ phân ca: 01/09/2026 - 30/09/2026</span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: BẢNG CHẤM CÔNG TỔNG HỢP THÁNG (30 DAYS MATRIX)    */}
      {/* ======================================================== */}
      {activeSubTab === 'monthly' && (
        <div className="space-y-4">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm nhân viên..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0072BC]/20"
                />
              </div>

              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
              >
                <option value="all">Tất cả phòng ban</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleExportMonthlyCSV}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Xuất Bảng Công Excel</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto max-h-[580px]">
              <table className="w-full text-left text-[11px] border-collapse select-none">
                <thead className="sticky top-0 z-20 bg-slate-100 shadow-xs text-slate-700 font-bold border-b border-slate-300">
                  <tr>
                    <th className="py-2.5 px-3 sticky left-0 z-30 bg-slate-100 border-r border-slate-300 min-w-[170px]">
                      Họ tên nhân sự
                    </th>
                    {Array.from({ length: 30 }, (_, i) => {
                      const day = i + 1;
                      const isWeekend = [5, 6, 12, 13, 19, 20, 26, 27].includes(day);
                      const isToday = day === 21;
                      return (
                        <th
                          key={day}
                          className={`py-2 px-1 text-center min-w-[34px] border-r border-slate-200 ${
                            isToday
                              ? 'bg-blue-100 text-[#0072BC] font-black ring-2 ring-[#0072BC]/40'
                              : isWeekend
                              ? 'bg-slate-200/70 text-slate-400'
                              : ''
                          }`}
                        >
                          <div className="leading-none">{day}</div>
                          <div className="text-[9px] font-normal mt-0.5">
                            {isWeekend ? (day % 2 === 0 ? 'CN' : 'T7') : 'T'}
                          </div>
                        </th>
                      );
                    })}
                    <th className="py-2 px-2 text-center bg-emerald-50 text-emerald-800 min-w-[55px]">
                      Tổng công
                    </th>
                    <th className="py-2 px-2 text-center bg-blue-50 text-[#0072BC] min-w-[50px]">
                      Nghỉ phép
                    </th>
                    <th className="py-2 px-2 text-center bg-amber-50 text-amber-800 min-w-[50px]">
                      Đi muộn
                    </th>
                    <th className="py-2 px-2 text-center bg-purple-50 text-purple-800 min-w-[50px]">
                      Giờ OT
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredMonthly.map((row) => (
                    <tr key={row.employeeId} className="hover:bg-slate-50 transition">
                      <td className="py-2 px-3 sticky left-0 z-10 bg-white border-r border-slate-200 shadow-xs">
                        <div className="font-bold text-slate-900 truncate max-w-[160px]">
                          {row.employeeName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {row.employeeCode} • {row.departmentName?.split(' ')?.[0] || 'Phòng'}
                        </div>
                      </td>

                      {Array.from({ length: 30 }, (_, i) => {
                        const day = i + 1;
                        const cell = row.days?.[day];
                        const isWeekend = [5, 6, 12, 13, 19, 20, 26, 27].includes(day);

                        return (
                          <td
                            key={day}
                            onClick={() => {
                              if (cell) {
                                setSelectedCell({
                                  employeeId: row.employeeId,
                                  employeeName: row.employeeName,
                                  dayData: cell
                                });
                              }
                            }}
                            className={`p-1 text-center border-r border-slate-100 transition cursor-pointer hover:ring-2 hover:ring-[#0072BC] hover:z-10 ${
                              isWeekend ? 'bg-slate-50/50' : ''
                            }`}
                            title={
                              cell
                                ? `Ngày ${day}/09: ${cell.status} (${cell.workHours}h) ${cell.notes || ''} - Nhấp để xem/sửa`
                                : ''
                            }
                          >
                            {cell ? (
                              <span
                                className={`inline-block w-6 h-6 leading-6 rounded-md text-[10px] ${getTimesheetBadgeClass(
                                  cell.status
                                )}`}
                              >
                                {cell.status}
                              </span>
                            ) : (
                              '--'
                            )}
                          </td>
                        );
                      })}

                      <td className="py-2 px-2 text-center font-bold text-emerald-700 bg-emerald-50/30 font-mono">
                        {row.totalWorkDays || 0}
                      </td>
                      <td className="py-2 px-2 text-center font-bold text-[#0072BC] bg-blue-50/30 font-mono">
                        {row.totalPaidLeaves || 0}
                      </td>
                      <td className="py-2 px-2 text-center font-bold text-amber-700 bg-amber-50/30 font-mono">
                        {(row.totalLateTimes || 0) > 0 ? `${row.totalLateTimes} (${row.totalLateMinutes || 0}p)` : '0'}
                      </td>
                      <td className="py-2 px-2 text-center font-bold text-purple-700 bg-purple-50/30 font-mono">
                        {(row.totalOTHours || 0) > 0 ? `${row.totalOTHours}h` : '0'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0072BC]" />
                Nhấp vào bất kỳ ô công nào để xem chi tiết hoặc điều chỉnh (Hệ thống tự động liên kết Bảng lương)
              </span>
              <span>Chuẩn công tháng: 22 ngày</span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: NHẬT KÝ QUẸT THẺ THÔ (BIOMETRIC RAW PUNCH LOGS)  */}
      {/* ======================================================== */}
      {activeSubTab === 'biometrics' && (
        <div className="space-y-4">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm nhân sự, máy chấm công..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0072BC]/20"
                />
              </div>

              <select
                value={punchSourceFilter}
                onChange={(e) => setPunchSourceFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
              >
                <option value="all">Tất cả phương thức chấm</option>
                <option value="fingerprint">Vân tay (Ronald Jack)</option>
                <option value="face_id">Nhận diện khuôn mặt (Hikvision FaceID AI)</option>
                <option value="mobile_gps">App Di động (GPS Geofence)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSyncBiometrics}
                disabled={syncingBiometrics}
                className="px-3.5 py-1.5 bg-[#0072BC] hover:bg-[#005A96] text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncingBiometrics ? 'animate-spin' : ''}`} />
                <span>{syncingBiometrics ? 'Đang đồng bộ...' : 'Đồng bộ từ máy vân tay / FaceID'}</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Thời gian quẹt (Timestamp)</th>
                    <th className="py-3 px-4">Nhân sự</th>
                    <th className="py-3 px-4">Đơn vị công tác</th>
                    <th className="py-3 px-4">Thiết bị thu nhận</th>
                    <th className="py-3 px-4">Phương thức</th>
                    <th className="py-3 px-4">Độ chính xác</th>
                    <th className="py-3 px-4">Thuật toán ghép cặp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPunches.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {item.timestamp}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{item.employeeName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{item.employeeCode}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{item.departmentName}</td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-800 block">{item.deviceName}</span>
                        {item.deviceIp && (
                          <span className="text-[10px] text-slate-400 font-mono">IP: {item.deviceIp}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                          {item.source === 'face_id' && <ScanFace className="w-3.5 h-3.5 text-purple-600" />}
                          {item.source === 'fingerprint' && <Fingerprint className="w-3.5 h-3.5 text-blue-600" />}
                          {item.source === 'mobile_gps' && <Smartphone className="w-3.5 h-3.5 text-emerald-600" />}
                          {item.source === 'face_id'
                            ? 'FaceID AI'
                            : item.source === 'fingerprint'
                            ? 'Vân tay'
                            : 'Mobile GPS'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {item.accuracyScore ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {item.accuracyScore}% Khớp
                          </span>
                        ) : (
                          '--'
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            item.pairingType === 'check_in'
                              ? 'bg-blue-50 text-[#0072BC] border border-blue-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {item.pairingType === 'check_in' ? 'Vào ca (First-in)' : 'Ra ca (Last-out)'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Hỗ trợ chuẩn kết nối SDK máy Ronald Jack, ZKTeco, Hikvision FaceID</span>
              <span>Tổng số lượt quẹt ghi nhận: {rawPunches.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: BÁO CÁO CHUYÊN CẦN & BẢNG XẾP HẠNG ĐI MUỘN         */}
      {/* ======================================================== */}
      {activeSubTab === 'analytics' && analytics && (
        <div className="space-y-4">
          {/* Analytics Top KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tỷ lệ chuyên cần toàn công ty</span>
              </div>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                {analytics.overallAttendanceRate}%
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Mục tiêu quý: ≥ 95%</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Tổng số giờ làm việc thực tế</span>
              </div>
              <div className="text-2xl font-black text-slate-800 mt-1">
                {analytics.totalWorkHours} <span className="text-xs font-normal text-slate-400">giờ</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Kỳ tháng 09/2026</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
                <span>Tổng quỹ giờ làm thêm (OT)</span>
              </div>
              <div className="text-2xl font-black text-purple-700 mt-1">
                {analytics.totalOTHours} <span className="text-xs font-normal text-slate-400">giờ</span>
              </div>
              <div className="text-[11px] text-purple-600 font-medium mt-0.5">Hệ số 150% ngày thường</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5 text-amber-600" />
                <span>Số nhân sự vi phạm đi muộn</span>
              </div>
              <div className="text-2xl font-black text-amber-600 mt-1">
                {(analytics.lateLeaderboard || []).length} <span className="text-xs font-normal text-slate-400">người</span>
              </div>
              <div className="text-[11px] text-amber-700 font-medium mt-0.5">
                {(analytics.lateLeaderboard || []).filter((l) => l.severity === 'penalty').length} người vượt khung phạt
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left 2 Cols: Late Leaderboard */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xs text-slate-800 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Bảng Xếp Hạng Đi Muộn / Trễ Giờ Trong Tháng (Late Leaderboard)</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Hỗ trợ phòng C&B xét trừ thưởng chuyên cần hoặc thi đua khen thưởng hàng tháng
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">Hạng</th>
                      <th className="py-3 px-4">Nhân sự vi phạm</th>
                      <th className="py-3 px-4">Đơn vị công tác</th>
                      <th className="py-3 px-4 text-center">Số lần trễ</th>
                      <th className="py-3 px-4 text-center">Tổng phút trễ lũy kế</th>
                      <th className="py-3 px-4">Đề xuất chế tài</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(analytics.lateLeaderboard || []).length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          Tuyệt vời! Không có nhân sự nào đi muộn trong tháng
                        </td>
                      </tr>
                    ) : (
                      (analytics.lateLeaderboard || []).map((item, index) => (
                        <tr key={item.employeeId} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-4">
                            <span
                              className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-bold text-xs ${
                                index === 0
                                  ? 'bg-rose-500 text-white'
                                  : index === 1
                                  ? 'bg-amber-500 text-white'
                                  : index === 2
                                  ? 'bg-amber-200 text-amber-900'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {index + 1}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900">
                            <div>{item.employeeName}</div>
                            <div className="text-[10px] text-slate-400 font-mono font-normal">
                              {item.employeeCode}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-600">{item.departmentName}</td>
                          <td className="py-3 px-4 text-center font-bold text-slate-800">
                            {item.lateTimes} lần
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-bold text-rose-600">
                            {item.totalLateMinutes} phút
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                item.severity === 'penalty'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                  : 'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}
                            >
                              {item.severity === 'penalty'
                                ? 'Trừ thưởng chuyên cần'
                                : 'Cảnh báo nhắc nhở'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right 1 Col: Department Attendance Rates */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-4">
              <h3 className="font-bold text-xs text-slate-800">Tỷ lệ Chuyên cần theo Khối / Phòng Ban</h3>

              <div className="space-y-3">
                {(analytics.departmentRates || []).map((d) => (
                  <div key={d.departmentName} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700 truncate max-w-[180px]">
                        {d.departmentName}
                      </span>
                      <span className="font-bold font-mono text-emerald-700">{d.rate}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${d.rate}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: ĐIỂM DANH HÔM NAY (DAILY LIVE TRACKER)            */}
      {/* ======================================================== */}
      {activeSubTab === 'daily' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs font-medium text-slate-500">Tổng nhân sự theo dõi</div>
              <div className="text-2xl font-bold text-slate-800 mt-1">{total}</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Có mặt đúng giờ</span>
              </div>
              <div className="text-2xl font-bold text-emerald-600 mt-1">{present}</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs font-medium text-amber-600 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Đi muộn / Về sớm</span>
              </div>
              <div className="text-2xl font-bold text-amber-600 mt-1">{late}</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs font-medium text-rose-600 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Nghỉ phép / Chế độ</span>
              </div>
              <div className="text-2xl font-bold text-rose-600 mt-1">{leave}</div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
              <div className="font-bold text-xs text-slate-800">
                Nhật ký quẹt thẻ ngày hôm nay (21/09/2026)
              </div>
              <span className="text-xs text-slate-500">Ca hành chính: 08:00 - 17:30</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Nhân sự</th>
                    <th className="py-3 px-4">Đơn vị công tác</th>
                    <th className="py-3 px-4">Giờ vào (Check-in)</th>
                    <th className="py-3 px-4">Giờ ra (Check-out)</th>
                    <th className="py-3 px-4">Thời lượng</th>
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4">Ghi chú</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attendanceList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px]">
                            {item.employeeName.split(' ').slice(-1)[0][0]}
                          </div>
                          <span>{item.employeeName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{item.departmentName}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">{item.checkIn}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{item.checkOut}</td>
                      <td className="py-3 px-4 font-semibold text-slate-700">
                        {item.workHours > 0 ? `${item.workHours} giờ` : '--'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            item.status === 'present'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : item.status === 'late'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {item.status === 'present'
                            ? 'Đúng giờ'
                            : item.status === 'late'
                            ? 'Đi muộn'
                            : 'Nghỉ phép'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 italic">{item.notes || '--'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: QUẢN LÝ CA & QUY TẮC ĐI MUỘN (SHIFTS & POLICY)    */}
      {/* ======================================================== */}
      {activeSubTab === 'shifts' && (
        <div className="space-y-6">
          {/* Shift Definitions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b">
              <div>
                <h2 className="text-sm font-bold text-slate-800">Khung Ca Làm Việc Tiêu Chuẩn Doanh Nghiệp</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Định nghĩa các ca làm việc hành chính, ca sáng, ca chiều và ca trực đêm
                </p>
              </div>

              {role === 'admin' && (
                <button
                  onClick={() => {
                    setEditingShift(null);
                    setIsShiftModalOpen(true);
                  }}
                  className="px-3.5 py-2 bg-[#0072BC] hover:bg-[#005A96] text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm ca làm việc mới</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shifts.map((shift) => (
                <div
                  key={shift.id}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-[#0072BC] transition space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl text-white flex items-center justify-center font-bold shadow-xs"
                        style={{ backgroundColor: shift.color }}
                      >
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{shift.name}</h3>
                        <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                          {shift.code}
                        </span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#0072BC]">
                      Hệ số: {shift.coefficient}x ({shift.workHours}h công)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Giờ vào - ra:</span>
                      <span className="font-bold font-mono text-slate-800">
                        {shift.startTime} → {shift.endTime}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Nghỉ giữa ca:</span>
                      <span className="text-slate-700">
                        {shift.breakStartTime ? `${shift.breakStartTime} - ${shift.breakEndTime}` : 'Không nghỉ giữa ca'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">{shift.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Attendance Policy Setting (Grace Period) */}
          {policy && role === 'admin' && (
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="pb-2 border-b">
                <h3 className="font-bold text-slate-800 text-xs flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#0072BC]" />
                  <span>Cấu Hình Quy Tắc Chấm Công & Thời Gian Linh Hoạt (Grace Period)</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Thiết lập chính sách đi muộn không phạt, ngưỡng tính nửa công và làm thêm giờ theo văn hóa doanh nghiệp
                </p>
              </div>

              <form onSubmit={handleSavePolicy} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold">
                    Thời gian linh hoạt cho phép đi muộn (Grace Period):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={60}
                      value={policy.gracePeriodMinutes}
                      onChange={(e) => setPolicy({ ...policy, gracePeriodMinutes: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                    />
                    <span className="text-slate-500 font-medium">phút</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    Đến muộn dưới {policy.gracePeriodMinutes} phút vẫn tính đúng giờ
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold">Giờ tối thiểu để tính nửa ngày công (0.5):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step={0.5}
                      min={1}
                      max={6}
                      value={policy.halfDayMinHours}
                      onChange={(e) => setPolicy({ ...policy, halfDayMinHours: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                    />
                    <span className="text-slate-500 font-medium">giờ</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold">Thời gian tối thiểu sau ca để tính OT:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={15}
                      max={120}
                      value={policy.overtimeMinMinutes}
                      onChange={(e) => setPolicy({ ...policy, overtimeMinMinutes: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                    />
                    <span className="text-slate-500 font-medium">phút</span>
                  </div>
                </div>

                <div className="md:col-span-3 pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0072BC] hover:bg-[#005A96] text-white font-bold rounded-lg shadow-sm transition cursor-pointer"
                  >
                    Lưu Quy Tắc Chấm Công
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 7: ĐỔI CA & BÙ CÔNG (SWAPS & REGULARIZATIONS)        */}
      {/* ======================================================== */}
      {activeSubTab === 'swaps' && (
        <div className="space-y-6">
          {/* Swaps */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b">
              <div>
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-[#0072BC]" />
                  <span>Yêu cầu Đổi ca làm việc giữa nhân sự</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Nhân viên thỏa thuận đổi ca trực hoặc ca làm việc và gửi quản lý phê duyệt
                </p>
              </div>

              <button
                onClick={() => setIsSwapModalOpen(true)}
                className="px-3 py-1.5 bg-[#0072BC] hover:bg-[#005A96] text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Đăng ký đổi ca</span>
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100">
              {swaps.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">Chưa có yêu cầu đổi ca nào</div>
              ) : (
                swaps.map((item) => (
                  <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{item.employeeName}</span>
                        <span className="text-slate-400">↔</span>
                        <span className="font-bold text-slate-900">{item.targetEmployeeName}</span>
                        <span className="font-mono text-[10px] text-slate-500">({item.code})</span>
                      </div>
                      <div className="text-xs text-slate-600">
                        Ngày đổi ca: <strong>{item.swapDate}</strong> • Từ ca:{' '}
                        <span className="font-semibold text-blue-700">{item.fromShiftName}</span> ➔ Sang ca:{' '}
                        <span className="font-semibold text-purple-700">{item.toShiftName}</span>
                      </div>
                      <div className="text-xs text-slate-500 italic">Lý do: {item.reason}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          item.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : item.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {item.status === 'pending' ? 'Chờ duyệt' : item.status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
                      </span>

                      {item.status === 'pending' && (role === 'admin' || role === 'manager') && (
                        <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                          <button
                            onClick={() => handleApproveSwap(item.id, 'approved')}
                            className="p-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition cursor-pointer"
                            title="Duyệt đổi ca"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleApproveSwap(item.id, 'rejected')}
                            className="p-1.5 bg-rose-600 text-white hover:bg-rose-700 rounded-lg transition cursor-pointer"
                            title="Từ chối đổi ca"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Regularizations */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b">
              <div>
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  <span>Đơn Giải trình Chấm công / Bù công</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Giải trình quên quẹt thẻ, lỗi thiết bị hoặc đi công tác. Khi duyệt sẽ tự động bù đủ công!
                </p>
              </div>

              <button
                onClick={() => setIsRegModalOpen(true)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Gửi đơn giải trình</span>
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100">
              {regularizations.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">Chưa có đơn giải trình nào</div>
              ) : (
                regularizations.map((item) => (
                  <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{item.employeeName}</span>
                        <span className="font-mono text-[10px] text-slate-500">({item.code})</span>
                        <span className="px-2 py-0.2 bg-slate-100 text-slate-600 rounded text-[10px] font-semibold">
                          {item.type === 'client_meeting'
                            ? 'Gặp đối tác bên ngoài'
                            : item.type === 'forgot_checkout'
                            ? 'Quên quẹt thẻ ra'
                            : 'Quên quẹt thẻ vào'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-700">
                        Ngày giải trình: <strong>{item.date}</strong> • Đề xuất điều chỉnh:{' '}
                        <span className="font-mono font-bold text-emerald-700">
                          {item.suggestedCheckIn} → {item.suggestedCheckOut}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 italic">Lý do: {item.reason}</div>
                      {item.attachmentName && (
                        <div className="text-[10px] text-[#0072BC] font-medium">
                          📎 Đính kèm: {item.attachmentName}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          item.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : item.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {item.status === 'pending' ? 'Chờ duyệt' : item.status === 'approved' ? 'Đã duyệt bù công' : 'Từ chối'}
                      </span>

                      {item.status === 'pending' && (role === 'admin' || role === 'manager') && (
                        <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                          <button
                            onClick={() => handleApproveRegularization(item.id, 'approved')}
                            className="p-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition cursor-pointer"
                            title="Duyệt bù công"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleApproveRegularization(item.id, 'rejected')}
                            className="p-1.5 bg-rose-600 text-white hover:bg-rose-700 rounded-lg transition cursor-pointer"
                            title="Từ chối giải trình"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 8: GPS GEOFENCING & WIFI CONFIGURATION               */}
      {/* ======================================================== */}
      {activeSubTab === 'geofence' && (
        <div className="space-y-4">
          <div className="pb-2 border-b">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-600" />
              <span>Thiết Lập Vị Trí Địa Lý (GPS Geofencing) & Mạng Wifi Chấm Công Hợp Lệ</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hệ thống chỉ cho phép nhân viên quẹt thẻ vào ca khi nằm trong bán kính quy định hoặc kết nối Wifi văn phòng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {locations.map((loc) => (
              <div
                key={loc.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-[#0072BC] transition space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{loc.name}</h4>
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Đang hoạt động
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-slate-600 text-xs leading-relaxed">{loc.address}</p>

                <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[11px]">Bán kính GPS hợp lệ:</span>
                    <span className="font-bold text-slate-800">{loc.radiusMeters} mét</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[11px]">Tọa độ:</span>
                    <span className="font-mono text-[11px] text-slate-700">
                      {loc.latitude}, {loc.longitude}
                    </span>
                  </div>
                  <div className="pt-1">
                    <span className="text-slate-400 text-[11px] block mb-1">Wifi nội bộ được phép:</span>
                    <div className="flex flex-wrap gap-1">
                      {loc.allowedWifiBSSID.map((wifi, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-blue-50 text-[#0072BC] rounded text-[10px] font-mono font-semibold"
                        >
                          {wifi}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* POPUP MODALS                                             */}
      {/* ======================================================== */}
      {selectedCell && (
        <TimesheetCellModal
          isOpen={!!selectedCell}
          onClose={() => setSelectedCell(null)}
          employeeId={selectedCell.employeeId}
          employeeName={selectedCell.employeeName}
          dayData={selectedCell.dayData}
          onSave={handleSaveTimesheetCell}
        />
      )}

      {selectedRosterCell && (
        <RosterCellModal
          isOpen={!!selectedRosterCell}
          onClose={() => setSelectedRosterCell(null)}
          employeeName={selectedRosterCell.employeeName}
          day={selectedRosterCell.day}
          currentSchedule={selectedRosterCell.currentSchedule}
          shifts={shifts}
          onSave={handleSaveRosterCell}
        />
      )}

      {isBulkRosterOpen && (
        <BulkRosterModal
          isOpen={isBulkRosterOpen}
          onClose={() => setIsBulkRosterOpen(false)}
          departments={departments}
          shifts={shifts}
          defaultDepartment={selectedDept}
          onApply={handleApplyBulkRoster}
        />
      )}

      {isShiftModalOpen && (
        <ShiftModal
          isOpen={isShiftModalOpen}
          onClose={() => {
            setIsShiftModalOpen(false);
            setEditingShift(null);
          }}
          onSave={handleSaveShift}
          initialData={editingShift}
        />
      )}

      {isSwapModalOpen && (
        <ShiftSwapModal
          isOpen={isSwapModalOpen}
          onClose={() => setIsSwapModalOpen(false)}
          onSubmit={handleCreateSwap}
          employees={employees}
          shifts={shifts}
        />
      )}

      {isRegModalOpen && (
        <RegularizationModal
          isOpen={isRegModalOpen}
          onClose={() => setIsRegModalOpen(false)}
          onSubmit={handleCreateRegularization}
          employees={employees}
        />
      )}

      {isOmniCheckInOpen && (
        <OmniCheckInModal
          isOpen={isOmniCheckInOpen}
          onClose={() => setIsOmniCheckInOpen(false)}
          currentUser={currentUser}
          employees={employees}
          locations={locations}
          onSuccess={() => {
            onRefresh();
            loadModuleData();
          }}
        />
      )}

      {isSelfPayslipOpen && (
        <SelfPayslipModal
          isOpen={isSelfPayslipOpen}
          onClose={() => setIsSelfPayslipOpen(false)}
          record={userPayslip}
          employee={employees.find((e) => e.id === currentUser.id) || employees[0]}
        />
      )}
    </div>
  );
};
