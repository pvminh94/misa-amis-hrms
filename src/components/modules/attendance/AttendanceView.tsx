import React, { useState } from 'react';
import {
  CalendarCheck,
  Clock,
  MapPin,
  Wifi,
  LogIn,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Search,
  Filter,
  Building,
  Sparkles
} from 'lucide-react';
import { AttendanceRecord, Department } from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { api } from '../../../services/api';

interface AttendanceViewProps {
  attendanceList: AttendanceRecord[];
  departments: Department[];
  loading: boolean;
  onRefresh: () => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  attendanceList,
  departments,
  loading,
  onRefresh
}) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [selectedDept, setSelectedDept] = useState('all');
  const [search, setSearch] = useState('');
  const [simulating, setSimulating] = useState(false);

  // Statistics
  const total = attendanceList.length;
  const present = attendanceList.filter((a) => a.status === 'present').length;
  const late = attendanceList.filter((a) => a.status === 'late').length;
  const leave = attendanceList.filter((a) => a.status === 'leave').length;

  const filtered = attendanceList.filter((item) => {
    const matchesDept = selectedDept === 'all' || item.departmentName.toLowerCase().includes(selectedDept.toLowerCase());
    const matchesSearch =
      item.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      item.departmentName.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleSelfCheckIn = async () => {
    try {
      setSimulating(true);
      const res = await api.checkIn(currentUser.id);
      showToast(`Chấm công vào thành công: ${res.checkIn} (${res.status === 'late' ? 'Đi muộn' : 'Đúng giờ'})`, 'success');
      onRefresh();
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
    } catch (err: any) {
      showToast(err.message || 'Lỗi chấm công', 'error');
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in">
      {/* Top Banner & Quick Check-in Simulator */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0072BC] uppercase tracking-wider">
            <CalendarCheck className="w-4 h-4" />
            <span>AMIS Chấm công & Ca kíp thông minh</span>
          </div>
          <h1 className="text-lg font-bold text-slate-800 mt-1">
            Bảng Chấm Công & Điểm Danh Trực Tuyến Hôm Nay (21/09/2026)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Hỗ trợ ghi nhận GPS, Wifi văn phòng MISA, nhận diện ca làm việc 08:00 - 17:30
          </p>
        </div>

        {/* GPS Simulation Card */}
        <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-3.5 rounded-xl w-full lg:w-auto">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>Văn phòng MISA Cầu Giấy (Hà Nội)</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <Wifi className="w-3 h-3" />
                MISA_CORP_5G
              </span>
              <span>•</span>
              <span className="text-slate-600">Bán kính: 15m (Hợp lệ)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
            <button
              onClick={handleSelfCheckIn}
              disabled={simulating}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Chấm Vào</span>
            </button>
            <button
              onClick={handleSelfCheckOut}
              disabled={simulating}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Chấm Ra</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
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
            <span>Nghỉ phép / Nghỉ chế độ</span>
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-1">{leave}</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên nhân viên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0072BC]/20"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
          >
            <option value="all">Tất cả phòng ban</option>
            {departments.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>

          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-2 rounded-lg whitespace-nowrap">
            Ca hành chính: 08:00 - 17:30
          </span>
        </div>
      </div>

      {/* Attendance Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
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
                <th className="py-3 px-4">Ghi chú giải trình</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Đang đồng bộ dữ liệu máy chấm công...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Không tìm thấy dữ liệu điểm danh
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
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
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {item.checkIn}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {item.checkOut}
                    </td>
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
                    <td className="py-3 px-4 text-slate-500 italic">
                      {item.notes || '--'}
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
