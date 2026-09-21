import React, { useState } from 'react';
import {
  Bell,
  Search,
  Clock,
  LogIn,
  LogOut,
  Building2,
  ChevronDown,
  UserCheck,
  Calendar,
  AlertTriangle,
  Cake,
  FileSpreadsheet,
  Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';

interface NavbarProps {
  onSearch?: (query: string) => void;
  pendingLeavesCount?: number;
  expiringContractsCount?: number;
  birthdaysCount?: number;
  onNavigateTab?: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  pendingLeavesCount = 2,
  expiringContractsCount = 3,
  birthdaysCount = 2,
  onNavigateTab
}) => {
  const { currentUser, role, switchUser, logout } = useAuth();
  const { showToast } = useToast();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [loadingCheck, setLoadingCheck] = useState(false);

  const handleQuickCheckIn = async () => {
    try {
      setLoadingCheck(true);
      const res = await api.checkIn(currentUser.id);
      setIsCheckedIn(true);
      showToast(res.notes || `Chấm công vào thành công lúc ${res.checkIn}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Lỗi chấm công', 'error');
    } finally {
      setLoadingCheck(false);
    }
  };

  const handleQuickCheckOut = async () => {
    try {
      setLoadingCheck(true);
      const res = await api.checkOut(currentUser.id);
      setIsCheckedIn(false);
      showToast(`Chấm công ra thành công lúc ${res.checkOut} (${res.workHours}h làm việc)`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Lỗi chấm công', 'error');
    } finally {
      setLoadingCheck(false);
    }
  };

  const totalNotifications = pendingLeavesCount + expiringContractsCount + birthdaysCount;

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Organization context & Search */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs font-semibold cursor-pointer hover:bg-slate-100 transition">
          <Building2 className="w-4 h-4 text-[#0072BC]" />
          <span className="hidden md:inline truncate max-w-[260px]">AMIS CORP - TRỤ SỞ HÀ NỘI</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>

        <div className="relative hidden sm:block w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm nhân viên, mã NV, phòng ban..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0072BC]/20 focus:border-[#0072BC] transition"
          />
        </div>
      </div>

      {/* Right: Quick Checkin, Time, Notifications, Role Switcher, User */}
      <div className="flex items-center gap-4">
        {/* Real-time Indicator */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span>21/09/2026</span>
          <span className="text-slate-300">|</span>
          <span className="text-emerald-600 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Hệ thống chuẩn AMIS
          </span>
        </div>

        {/* Quick Check-in/out button */}
        {!isCheckedIn ? (
          <button
            onClick={handleQuickCheckIn}
            disabled={loadingCheck}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg shadow-sm transition active:scale-95 cursor-pointer"
            title="Chấm công GPS / Wifi vào ca"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Vào ca</span>
          </button>
        ) : (
          <button
            onClick={handleQuickCheckOut}
            disabled={loadingCheck}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-lg shadow-sm transition active:scale-95 cursor-pointer"
            title="Chấm công kết thúc ca"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ra ca</span>
          </button>
        )}

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg relative transition cursor-pointer"
            title="Thông báo"
          >
            <Bell className="w-4 h-4" />
            {totalNotifications > 0 && (
              <span className="absolute 1 top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalNotifications}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-800">Thông báo hệ thống HR</span>
                <span className="text-[11px] bg-blue-50 text-[#0072BC] px-2 py-0.5 rounded font-medium">
                  {totalNotifications} mới
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-50 text-xs">
                {pendingLeavesCount > 0 && (
                  <div
                    onClick={() => {
                      onNavigateTab?.('leaves');
                      setShowNotifications(false);
                    }}
                    className="p-3 hover:bg-slate-50 cursor-pointer flex gap-3 transition"
                  >
                    <div className="p-2 bg-amber-50 rounded-lg text-amber-600 h-fit">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">Đơn chờ duyệt</p>
                      <p className="text-slate-500 text-[11px]">Có {pendingLeavesCount} đơn xin nghỉ phép/OT cần xem xét phê duyệt</p>
                    </div>
                  </div>
                )}
                {expiringContractsCount > 0 && (
                  <div
                    onClick={() => {
                      onNavigateTab?.('employees');
                      setShowNotifications(false);
                    }}
                    className="p-3 hover:bg-slate-50 cursor-pointer flex gap-3 transition"
                  >
                    <div className="p-2 bg-rose-50 rounded-lg text-rose-600 h-fit">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">Cảnh báo hợp đồng</p>
                      <p className="text-slate-500 text-[11px]">{expiringContractsCount} nhân viên sắp hết hạn HĐLĐ / thử việc</p>
                    </div>
                  </div>
                )}
                {birthdaysCount > 0 && (
                  <div
                    onClick={() => {
                      onNavigateTab?.('dashboard');
                      setShowNotifications(false);
                    }}
                    className="p-3 hover:bg-slate-50 cursor-pointer flex gap-3 transition"
                  >
                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600 h-fit">
                      <Cake className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">Sinh nhật nhân sự</p>
                      <p className="text-slate-500 text-[11px]">{birthdaysCount} nhân viên có sinh nhật trong tháng 9</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 px-2.5 py-1.5 text-xs bg-blue-50 text-[#0072BC] hover:bg-blue-100 rounded-lg font-medium transition cursor-pointer"
            title="Đổi vai trò để trải nghiệm tính năng phân quyền"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              Vai trò: {role === 'admin' ? 'Admin' : role === 'manager' ? 'Quản lý' : 'Nhân viên'}
            </span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Chuyển đổi góc nhìn
              </div>
              <button
                onClick={() => {
                  switchUser('admin');
                  setShowRoleMenu(false);
                  showToast('Đã chuyển sang vai trò Quản trị viên (Admin - Full quyền)', 'info');
                }}
                className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                  role === 'admin' ? 'text-[#0072BC] font-semibold bg-blue-50/50' : 'text-slate-700'
                }`}
              >
                <span>Quản trị viên (Admin)</span>
                {role === 'admin' && <span className="w-1.5 h-1.5 rounded-full bg-[#0072BC]"></span>}
              </button>
              <button
                onClick={() => {
                  switchUser('manager');
                  setShowRoleMenu(false);
                  showToast('Đã chuyển sang vai trò Trưởng bộ phận (Manager)', 'info');
                }}
                className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                  role === 'manager' ? 'text-[#0072BC] font-semibold bg-blue-50/50' : 'text-slate-700'
                }`}
              >
                <span>Trưởng phòng (Manager)</span>
                {role === 'manager' && <span className="w-1.5 h-1.5 rounded-full bg-[#0072BC]"></span>}
              </button>
              <button
                onClick={() => {
                  switchUser('employee');
                  setShowRoleMenu(false);
                  showToast('Đã chuyển sang vai trò Nhân viên (Employee)', 'info');
                }}
                className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                  role === 'employee' ? 'text-[#0072BC] font-semibold bg-blue-50/50' : 'text-slate-700'
                }`}
              >
                <span>Nhân viên cá nhân (Staff)</span>
                {role === 'employee' && <span className="w-1.5 h-1.5 rounded-full bg-[#0072BC]"></span>}
              </button>

              <div className="border-t border-slate-100 mt-1 pt-1">
                <button
                  onClick={() => {
                    setShowRoleMenu(false);
                    onNavigateTab?.('admin_rbac');
                  }}
                  className="w-full px-3 py-2 text-left text-xs text-[#0072BC] font-semibold hover:bg-blue-50/50 flex items-center gap-1.5 cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Mở Ma Trận RBAC</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Mini & Logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-blue-700 text-white font-bold text-xs flex items-center justify-center ring-2 ring-blue-100">
            {currentUser.name.split(' ').slice(-1)[0][0]}
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-semibold text-slate-800 leading-none">{currentUser.name}</div>
            <div className="text-[10px] text-slate-500 mt-0.5 leading-none">{currentUser.title}</div>
          </div>

          <button
            onClick={async () => {
              await logout();
              showToast('Đã đăng xuất an toàn khỏi hệ thống AMIS HRM', 'info');
            }}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer ml-1"
            title="Đăng xuất"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
