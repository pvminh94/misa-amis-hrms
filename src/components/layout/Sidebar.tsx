import React from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  FileText,
  CreditCard,
  Network,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  X
} from 'lucide-react';

export type NavTab = 'dashboard' | 'employees' | 'attendance' | 'leaves' | 'payroll' | 'organization' | 'admin_rbac' | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  pendingLeavesCount?: number;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  pendingLeavesCount = 0,
  mobileOpen = false,
  onCloseMobile
}) => {
  const menuItems: Array<{
    id: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
    subtext?: string;
  }> = [
    {
      id: 'dashboard',
      label: 'Tổng quan HR',
      icon: LayoutDashboard,
      subtext: 'Báo cáo & Chỉ số'
    },
    {
      id: 'employees',
      label: 'Hồ sơ nhân sự',
      icon: Users,
      subtext: 'Danh bạ & Hợp đồng'
    },
    {
      id: 'attendance',
      label: 'Chấm công',
      icon: CalendarCheck,
      subtext: 'Theo dõi ca & công'
    },
    {
      id: 'leaves',
      label: 'Đơn từ & Phê duyệt',
      icon: FileText,
      badge: pendingLeavesCount > 0 ? pendingLeavesCount : undefined,
      subtext: 'Nghỉ phép, OT, Đi trễ'
    },
    {
      id: 'payroll',
      label: 'Tiền lương & BHXH',
      icon: CreditCard,
      subtext: 'Bảng lương & Phiếu'
    },
    {
      id: 'organization',
      label: 'Cơ cấu tổ chức',
      icon: Network,
      subtext: 'Phòng ban & Chức vụ'
    },
    {
      id: 'admin_rbac',
      label: 'Quản trị & Phân quyền',
      icon: ShieldCheck,
      subtext: 'RBAC, Users & Audit'
    },
    {
      id: 'settings',
      label: 'Thiết lập hệ thống',
      icon: Settings,
      subtext: 'Cấu hình tham số'
    }
  ];

  const handleItemClick = (tab: NavTab) => {
    onSelectTab(tab);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden animate-in fade-in transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`h-screen bg-slate-900 text-white flex flex-col transition-all duration-300 z-50 select-none ${
          /* Desktop responsive width */
          collapsed ? 'md:w-20' : 'md:w-64'
        } ${
          /* Mobile drawer positioning */
          mobileOpen
            ? 'fixed inset-y-0 left-0 w-72 shadow-2xl translate-x-0'
            : 'fixed -translate-x-full md:relative md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center px-4 border-b border-slate-800 justify-between shrink-0">
          <div
            className="flex items-center gap-3 overflow-hidden cursor-pointer"
            onClick={() => handleItemClick('dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0072BC] to-sky-400 flex items-center justify-center font-black text-white text-lg shadow-lg shrink-0">
              A
            </div>
            {(!collapsed || mobileOpen) && (
              <div className="leading-tight">
                <div className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                  AMIS <span className="text-[10px] bg-[#0072BC] px-1.5 py-0.5 rounded text-white font-medium">HRM</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">Quản trị Nhân sự 4.0</div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer md:hidden"
              title="Đóng menu"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Desktop Collapse / Expand Toggle */}
            <button
              onClick={onToggleCollapse}
              className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Nav List */}
        <div className="flex-1 py-4 px-2 space-y-1.5 overflow-y-auto">
          {(!collapsed || mobileOpen) && (
            <div className="px-3 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Phân hệ Quản trị
            </div>
          )}
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative cursor-pointer ${
                  isActive
                    ? 'bg-[#0072BC] text-white shadow-md shadow-blue-900/30 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
                title={collapsed && !mobileOpen ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                  }`}
                />

                {(!collapsed || mobileOpen) && (
                  <div className="flex-1 text-left flex items-center justify-between">
                    <div>
                      <div className="leading-none">{item.label}</div>
                      {item.subtext && (
                        <div
                          className={`text-[10px] mt-1 leading-none ${
                            isActive ? 'text-blue-100' : 'text-slate-400'
                          }`}
                        >
                          {item.subtext}
                        </div>
                      )}
                    </div>
                    {item.badge !== undefined && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-900 animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}

                {collapsed && !mobileOpen && item.badge !== undefined && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-amber-500 rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom info banner */}
        {!collapsed || mobileOpen ? (
          <div className="p-4 border-t border-slate-800 shrink-0">
            <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Tiêu chuẩn AMIS 2026</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Tích hợp Luật Lao động & Quy định Thuế TNCN - BHXH hiện hành.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3 border-t border-slate-800 flex justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-slate-400" />
          </div>
        )}
      </aside>
    </>
  );
};
