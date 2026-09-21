import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { HRDashboard } from './components/modules/dashboard/HRDashboard';
import { EmployeeList } from './components/modules/employees/EmployeeList';
import { EmployeeDetailModal } from './components/modules/employees/EmployeeDetailModal';
import { EmployeeFormModal } from './components/modules/employees/EmployeeFormModal';
import { AttendanceView } from './components/modules/attendance/AttendanceView';
import { LeaveManagementView } from './components/modules/leaves/LeaveManagementView';
import { LeaveModal } from './components/modules/leaves/LeaveModal';
import { PayrollView } from './components/modules/payroll/PayrollView';
import { PayslipModal } from './components/modules/payroll/PayslipModal';
import { OrganizationView } from './components/modules/organization/OrganizationView';
import { SettingsView } from './components/modules/settings/SettingsView';
import { AdminRbacView } from './components/modules/admin/AdminRbacView';
import { ToastProvider, useToast } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { api } from './services/api';
import {
  Employee,
  Department,
  Position,
  AttendanceRecord,
  LeaveRequest,
  PayrollRecord,
  CompanySetting,
  DashboardStats
} from './types';

function MainApp() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Core Data
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [payrollState, setPayrollState] = useState<{
    data: PayrollRecord[];
    summary: { totalGross: number; totalInsurance: number; totalTax: number; totalNet: number; count: number };
  }>({
    data: [],
    summary: { totalGross: 0, totalInsurance: 0, totalTax: 0, totalNet: 0, count: 0 }
  });
  const [settings, setSettings] = useState<CompanySetting | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  // Loadings
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  // Modals state
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isEmployeeFormOpen, setIsEmployeeFormOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [selectedPayrollRecord, setSelectedPayrollRecord] = useState<PayrollRecord | null>(null);

  const { showToast } = useToast();
  const retryTimerRef = useRef<any>(null);

  const loadData = useCallback(async (silent = false) => {
    try {
      const [statsRes, empsRes, orgRes, attRes, leavesRes, payRes, setRes] = await Promise.all([
        api.getDashboardStats(),
        api.getEmployees(),
        api.getOrganization(),
        api.getAttendance(),
        api.getLeaves(),
        api.getPayroll(),
        api.getSettings()
      ]);

      setStats(statsRes);
      setEmployees(empsRes);
      setDepartments(orgRes.departments);
      setPositions(orgRes.positions);
      setAttendanceList(attRes);
      setLeaves(leavesRes);
      setPayrollState(payRes);
      setSettings(setRes);
      setConnectionError(false);
    } catch (err: any) {
      console.warn('Lỗi nạp dữ liệu từ máy chủ API:', err.message || err);
      setConnectionError(true);
      if (!silent) {
        showToast('Máy chủ API đang khởi động hoặc chưa phản hồi. Vui lòng kiểm tra cổng 5000.', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    let isMounted = true;
    
    // Initial fetch
    loadData(true).catch(() => {});

    // If connection failed on first pass, retry once after 2 seconds
    retryTimerRef.current = setTimeout(() => {
      if (isMounted) {
        loadData(true).catch(() => {});
      }
    }, 2000);

    return () => {
      isMounted = false;
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, []); // Run strictly once on mount

  // Employee actions
  const handleSaveEmployee = async (formData: Partial<Employee>) => {
    try {
      if (editingEmployee) {
        const updated = await api.updateEmployee(editingEmployee.id, formData);
        showToast(`Đã cập nhật hồ sơ của ${updated.fullName}`, 'success');
      } else {
        const created = await api.createEmployee(formData);
        showToast(`Đã thêm mới nhân sự ${created.fullName}`, 'success');
      }
      setIsEmployeeFormOpen(false);
      setEditingEmployee(null);
      loadData(true);
    } catch (err: any) {
      showToast(err.message || 'Không thể lưu nhân sự', 'error');
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    try {
      await api.deleteEmployee(id);
      showToast('Đã xóa nhân sự', 'success');
      loadData(true);
    } catch (err: any) {
      showToast(err.message || 'Không thể xóa nhân sự', 'error');
    }
  };

  // Leave actions
  const handleCreateLeave = async (data: Partial<LeaveRequest>) => {
    try {
      await api.createLeave(data);
      showToast('Đã gửi đơn phê duyệt thành công', 'success');
      loadData(true);
    } catch (err: any) {
      showToast(err.message || 'Không thể gửi đơn nghỉ phép', 'error');
    }
  };

  const handleUpdateLeaveStatus = async (id: string, status: 'approved' | 'rejected', notes?: string) => {
    try {
      await api.updateLeaveStatus(id, status, notes);
      showToast(status === 'approved' ? 'Đã duyệt đơn' : 'Đã từ chối đơn', 'info');
      loadData(true);
    } catch (err: any) {
      showToast(err.message || 'Không thể xử lý đơn nghỉ phép', 'error');
    }
  };

  // Payroll actions
  const handleUpdatePayrollStatus = async (status: 'draft' | 'approved' | 'paid') => {
    try {
      await api.updatePayrollStatus('2026-09', status);
      showToast(`Đã cập nhật bảng lương sang trạng thái: ${status}`, 'success');
      loadData(true);
    } catch (err: any) {
      showToast(err.message || 'Không thể cập nhật trạng thái bảng lương', 'error');
    }
  };

  // Organization actions
  const handleAddDepartment = async (deptData: { code: string; name: string; managerName?: string; description?: string }) => {
    try {
      await api.createDepartment(deptData);
      showToast('Đã thêm mới phòng ban', 'success');
      loadData(true);
    } catch (err: any) {
      showToast(err.message || 'Không thể thêm phòng ban', 'error');
    }
  };

  // Settings actions
  const handleSaveSettings = async (newSettings: Partial<CompanySetting>) => {
    try {
      const updated = await api.updateSettings(newSettings);
      setSettings(updated);
      showToast('Đã lưu cấu hình doanh nghiệp', 'success');
      loadData(true);
    } catch (err: any) {
      showToast(err.message || 'Không thể lưu cài đặt', 'error');
    }
  };

  const pendingLeavesCount = leaves.filter((l) => l.status === 'pending').length;

  return (
    <div className="flex h-screen bg-[#F4F6F9] overflow-hidden text-slate-900 font-sans">
      {/* Collapsible Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        pendingLeavesCount={pendingLeavesCount}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          pendingLeavesCount={pendingLeavesCount}
          expiringContractsCount={stats?.expiringContracts.length || 0}
          birthdaysCount={stats?.upcomingBirthdays.length || 0}
          onNavigateTab={(tab) => setCurrentTab(tab as NavTab)}
        />

        {/* Connection warning banner if server is down */}
        {connectionError && (
          <div className="bg-amber-500/10 border-b border-amber-300 px-4 py-2 flex items-center justify-between text-xs text-amber-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              <span>Đang đồng bộ với API máy chủ (cổng 5000)... Bạn hãy đảm bảo lệnh <code>npm run dev</code> hoặc <code>npm run server</code> đang chạy.</span>
            </div>
            <button
              onClick={() => loadData(false)}
              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium transition cursor-pointer"
            >
              Thử kết nối lại
            </button>
          </div>
        )}

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {currentTab === 'dashboard' && (
            <HRDashboard
              stats={stats}
              loading={loading}
              onNavigate={(tab) => setCurrentTab(tab)}
              onOpenAddEmployee={() => {
                setEditingEmployee(null);
                setIsEmployeeFormOpen(true);
              }}
              onOpenCreateLeave={() => setIsLeaveModalOpen(true)}
            />
          )}

          {currentTab === 'employees' && (
            <EmployeeList
              employees={employees}
              departments={departments}
              positions={positions}
              loading={loading}
              onRefresh={() => loadData(false)}
              onOpenAdd={() => {
                setEditingEmployee(null);
                setIsEmployeeFormOpen(true);
              }}
              onSelectEmployee={(emp) => setSelectedEmployee(emp)}
              onEditEmployee={(emp) => {
                setEditingEmployee(emp);
                setIsEmployeeFormOpen(true);
              }}
              onDeleteEmployee={handleDeleteEmployee}
            />
          )}

          {currentTab === 'attendance' && (
            <AttendanceView
              attendanceList={attendanceList}
              departments={departments}
              employees={employees}
              loading={loading}
              onRefresh={() => loadData(false)}
            />
          )}

          {currentTab === 'leaves' && (
            <LeaveManagementView
              leaves={leaves}
              loading={loading}
              onRefresh={() => loadData(false)}
              onOpenCreate={() => setIsLeaveModalOpen(true)}
              onUpdateStatus={handleUpdateLeaveStatus}
            />
          )}

          {currentTab === 'payroll' && (
            <PayrollView
              payrollList={payrollState.data}
              summary={payrollState.summary}
              departments={departments}
              loading={loading}
              onRefresh={() => loadData(false)}
              onSelectRecord={(rec) => setSelectedPayrollRecord(rec)}
              onUpdatePayrollStatus={handleUpdatePayrollStatus}
            />
          )}

          {currentTab === 'organization' && (
            <OrganizationView
              departments={departments}
              positions={positions}
              loading={loading}
              onAddDepartment={handleAddDepartment}
              onRefresh={() => loadData(false)}
            />
          )}

          {currentTab === 'admin_rbac' && (
            <AdminRbacView />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              settings={settings}
              loading={loading}
              onSave={handleSaveSettings}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      {selectedEmployee && (
        <EmployeeDetailModal
          employee={employees.find((e) => e.id === selectedEmployee.id) || selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          onReload={() => loadData(true)}
          onEdit={(emp) => {
            setSelectedEmployee(null);
            setEditingEmployee(emp);
            setIsEmployeeFormOpen(true);
          }}
        />
      )}

      {isEmployeeFormOpen && (
        <EmployeeFormModal
          isOpen={isEmployeeFormOpen}
          onClose={() => {
            setIsEmployeeFormOpen(false);
            setEditingEmployee(null);
          }}
          onSave={handleSaveEmployee}
          initialData={editingEmployee}
          departments={departments}
          positions={positions}
        />
      )}

      {isLeaveModalOpen && (
        <LeaveModal
          isOpen={isLeaveModalOpen}
          onClose={() => setIsLeaveModalOpen(false)}
          onSubmit={handleCreateLeave}
          employees={employees}
        />
      )}

      {selectedPayrollRecord && (
        <PayslipModal
          isOpen={!!selectedPayrollRecord}
          onClose={() => setSelectedPayrollRecord(null)}
          record={selectedPayrollRecord}
          employee={employees.find((e) => e.id === selectedPayrollRecord.employeeId)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ToastProvider>
  );
}
