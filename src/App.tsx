import React, { useState, useEffect, useCallback } from 'react';
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
import { ToastProvider, useToast } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
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

  // Modals state
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isEmployeeFormOpen, setIsEmployeeFormOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [selectedPayrollRecord, setSelectedPayrollRecord] = useState<PayrollRecord | null>(null);

  const { showToast } = useToast();

  const loadData = useCallback(async () => {
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
    } catch (err: any) {
      console.error('Error loading data:', err);
      showToast('Đang kết nối hệ thống...', 'info');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Employee actions
  const handleSaveEmployee = async (formData: Partial<Employee>) => {
    if (editingEmployee) {
      const updated = await api.updateEmployee(editingEmployee.id, formData);
      showToast(`Đã cập nhật hồ sơ của ${updated.fullName}`, 'success');
    } else {
      const created = await api.createEmployee(formData);
      showToast(`Đã thêm mới nhân sự ${created.fullName}`, 'success');
    }
    setIsEmployeeFormOpen(false);
    setEditingEmployee(null);
    loadData();
  };

  const handleDeleteEmployee = async (id: string) => {
    await api.deleteEmployee(id);
    loadData();
  };

  // Leave actions
  const handleCreateLeave = async (data: Partial<LeaveRequest>) => {
    await api.createLeave(data);
    showToast('Đã gửi đơn phê duyệt thành công', 'success');
    loadData();
  };

  const handleUpdateLeaveStatus = async (id: string, status: 'approved' | 'rejected', notes?: string) => {
    await api.updateLeaveStatus(id, status, notes);
    loadData();
  };

  // Payroll actions
  const handleUpdatePayrollStatus = async (status: 'draft' | 'approved' | 'paid') => {
    await api.updatePayrollStatus('2026-09', status);
    loadData();
  };

  // Organization actions
  const handleAddDepartment = async (deptData: { code: string; name: string; managerName?: string; description?: string }) => {
    await api.createDepartment(deptData);
    loadData();
  };

  // Settings actions
  const handleSaveSettings = async (newSettings: Partial<CompanySetting>) => {
    const updated = await api.updateSettings(newSettings);
    setSettings(updated);
    loadData();
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
              onRefresh={loadData}
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
              onRefresh={loadData}
            />
          )}

          {currentTab === 'leaves' && (
            <LeaveManagementView
              leaves={leaves}
              loading={loading}
              onRefresh={loadData}
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
              onRefresh={loadData}
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
              onRefresh={loadData}
            />
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
          onReload={loadData}
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
