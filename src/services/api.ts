import {
  Employee,
  Department,
  Position,
  AttendanceRecord,
  LeaveRequest,
  PayrollRecord,
  CompanySetting,
  DashboardStats
} from '../types';

const API_BASE = '/api';

async function fetchJson<T = any>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    let message = `Lỗi máy chủ (HTTP ${res.status})`;
    try {
      const json = JSON.parse(text);
      if (json.message) message = json.message;
    } catch {
      // not json
    }
    throw new Error(message);
  }
  const data = await res.json();
  if (data.success === false) {
    throw new Error(data.message || 'Lỗi xử lý nghiệp vụ');
  }
  return data.data !== undefined ? data.data : data;
}

export const api = {
  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    return fetchJson(`${API_BASE}/dashboard/stats`);
  },

  // Employees
  async getEmployees(params?: { search?: string; departmentId?: string; status?: string }): Promise<Employee[]> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.departmentId) query.append('departmentId', params.departmentId);
    if (params?.status) query.append('status', params.status);

    return fetchJson(`${API_BASE}/employees?${query.toString()}`);
  },

  async getEmployee(id: string): Promise<Employee> {
    return fetchJson(`${API_BASE}/employees/${id}`);
  },

  async createEmployee(payload: Partial<Employee>): Promise<Employee> {
    return fetchJson(`${API_BASE}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },

  async updateEmployee(id: string, payload: Partial<Employee>): Promise<Employee> {
    return fetchJson(`${API_BASE}/employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },

  async deleteEmployee(id: string): Promise<void> {
    await fetchJson(`${API_BASE}/employees/${id}`, {
      method: 'DELETE'
    });
  },

  // Employee Sub-entities API
  async addEmployeeContract(id: string, payload: any): Promise<any> {
    return fetchJson(`${API_BASE}/employees/${id}/contracts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },

  async addEmployeeWorkHistory(id: string, payload: any): Promise<any> {
    return fetchJson(`${API_BASE}/employees/${id}/work-history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },

  async addEmployeeReward(id: string, payload: any): Promise<any> {
    return fetchJson(`${API_BASE}/employees/${id}/rewards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },

  async addEmployeeDependent(id: string, payload: any): Promise<any> {
    return fetchJson(`${API_BASE}/employees/${id}/dependents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },

  async deleteEmployeeDependent(id: string, depId: string): Promise<void> {
    await fetchJson(`${API_BASE}/employees/${id}/dependents/${depId}`, {
      method: 'DELETE'
    });
  },

  async addEmployeeDocument(id: string, payload: any): Promise<any> {
    return fetchJson(`${API_BASE}/employees/${id}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },

  // Attendance
  async getAttendance(date = '2026-09-21', departmentId?: string): Promise<AttendanceRecord[]> {
    const query = new URLSearchParams({ date });
    if (departmentId) query.append('departmentId', departmentId);

    return fetchJson(`${API_BASE}/attendance?${query.toString()}`);
  },

  async checkIn(employeeId: string, time?: string): Promise<AttendanceRecord> {
    return fetchJson(`${API_BASE}/attendance/check-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId, time })
    });
  },

  async checkOut(employeeId: string, time?: string): Promise<AttendanceRecord> {
    return fetchJson(`${API_BASE}/attendance/check-out`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId, time })
    });
  },

  // Advanced Attendance & Shifts API
  async getShifts(): Promise<any[]> {
    return fetchJson(`${API_BASE}/attendance/shifts`);
  },

  async createShift(payload: any): Promise<any> {
    return fetchJson(`${API_BASE}/attendance/shifts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },

  async updateShift(id: string, payload: any): Promise<any> {
    return fetchJson(`${API_BASE}/attendance/shifts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },

  async getMonthlyTimesheets(params?: { period?: string; departmentName?: string; search?: string }): Promise<any[]> {
    const query = new URLSearchParams();
    if (params?.period) query.append('period', params.period);
    if (params?.departmentName) query.append('departmentName', params.departmentName);
    if (params?.search) query.append('search', params.search);

    return fetchJson(`${API_BASE}/attendance/monthly?${query.toString()}`);
  },

  async updateTimesheetCell(employeeId: string, day: number, cellUpdates: any): Promise<any> {
    return fetchJson(`${API_BASE}/attendance/monthly/cell`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId, day, cellUpdates })
    });
  },

  async getShiftSwaps(): Promise<any[]> {
    return fetchJson(`${API_BASE}/attendance/swaps`);
  },

  async createShiftSwap(payload: any): Promise<any> {
    return fetchJson(`${API_BASE}/attendance/swaps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },

  async updateShiftSwapStatus(id: string, status: 'approved' | 'rejected', approverName?: string): Promise<any> {
    return fetchJson(`${API_BASE}/attendance/swaps/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, approverName })
    });
  },

  async getRegularizations(): Promise<any[]> {
    return fetchJson(`${API_BASE}/attendance/regularizations`);
  },

  async createRegularization(payload: any): Promise<any> {
    return fetchJson(`${API_BASE}/attendance/regularizations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },

  async updateRegularizationStatus(id: string, status: 'approved' | 'rejected', approverName?: string): Promise<any> {
    return fetchJson(`${API_BASE}/attendance/regularizations/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, approverName })
    });
  },

  async getGeofenceLocations(): Promise<any[]> {
    return fetchJson(`${API_BASE}/attendance/locations`);
  },

  async updateGeofenceLocation(id: string, payload: any): Promise<any> {
    return fetchJson(`${API_BASE}/attendance/locations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },

  // Enterprise Shift Rostering & Raw Biometrics API
  async getShiftRoster(params?: { period?: string; departmentName?: string; search?: string }): Promise<any[]> {
    const query = new URLSearchParams();
    if (params?.period) query.append('period', params.period);
    if (params?.departmentName) query.append('departmentName', params.departmentName);
    if (params?.search) query.append('search', params.search);

    return fetchJson(`${API_BASE}/attendance/roster?${query.toString()}`);
  },

  async updateShiftRosterCell(employeeId: string, day: number, shiftData: any): Promise<any> {
    return fetchJson(`${API_BASE}/attendance/roster/cell`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId, day, shiftData })
    });
  },

  async bulkAssignShiftRoster(payload: {
    departmentName: string;
    shiftCode: string;
    shiftName: string;
    shiftId: string;
    startDay: number;
    endDay: number;
    includeWeekends?: boolean;
  }): Promise<any> {
    return fetchJson(`${API_BASE}/attendance/roster/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },

  async getRawPunchLogs(params?: { date?: string; employeeId?: string; source?: string; search?: string }): Promise<any[]> {
    const query = new URLSearchParams();
    if (params?.date) query.append('date', params.date);
    if (params?.employeeId) query.append('employeeId', params.employeeId);
    if (params?.source) query.append('source', params.source);
    if (params?.search) query.append('search', params.search);

    return fetchJson(`${API_BASE}/attendance/raw-punches?${query.toString()}`);
  },

  async syncBiometricLogs(): Promise<any> {
    return fetchJson(`${API_BASE}/attendance/raw-punches/sync`, {
      method: 'POST'
    });
  },

  async getAttendanceAnalytics(period = '2026-09'): Promise<any> {
    return fetchJson(`${API_BASE}/attendance/analytics?period=${period}`);
  },

  async getAttendancePolicy(): Promise<any> {
    return fetchJson(`${API_BASE}/attendance/policy`);
  },

  async updateAttendancePolicy(payload: any): Promise<any> {
    return fetchJson(`${API_BASE}/attendance/policy`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },

  // Leaves & Approval
  async getLeaves(params?: { status?: string; type?: string; employeeId?: string }): Promise<LeaveRequest[]> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.type) query.append('type', params.type);
    if (params?.employeeId) query.append('employeeId', params.employeeId);

    return fetchJson(`${API_BASE}/leaves?${query.toString()}`);
  },

  async createLeave(payload: Partial<LeaveRequest>): Promise<LeaveRequest> {
    return fetchJson(`${API_BASE}/leaves`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },

  async updateLeaveStatus(id: string, status: 'approved' | 'rejected', reviewNotes?: string): Promise<LeaveRequest> {
    return fetchJson(`${API_BASE}/leaves/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, reviewNotes })
    });
  },

  // Payroll
  async getPayroll(params?: { period?: string; departmentName?: string; search?: string }): Promise<{
    data: PayrollRecord[];
    summary: { totalGross: number; totalInsurance: number; totalTax: number; totalNet: number; count: number };
  }> {
    const query = new URLSearchParams();
    if (params?.period) query.append('period', params.period);
    if (params?.departmentName) query.append('departmentName', params.departmentName);
    if (params?.search) query.append('search', params.search);

    const res = await fetch(`${API_BASE}/payroll?${query.toString()}`);
    if (!res.ok) throw new Error(`Lỗi máy chủ (HTTP ${res.status})`);
    const json = await res.json();
    return { data: json.data, summary: json.summary };
  },

  async getPayslip(id: string): Promise<{ data: PayrollRecord; employee: Employee }> {
    const res = await fetch(`${API_BASE}/payroll/${id}`);
    if (!res.ok) throw new Error(`Lỗi máy chủ (HTTP ${res.status})`);
    const json = await res.json();
    return { data: json.data, employee: json.employee };
  },

  async updatePayrollStatus(period: string, status: 'draft' | 'approved' | 'paid'): Promise<void> {
    await fetchJson(`${API_BASE}/payroll/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ period, status })
    });
  },

  // Departments & Positions
  async getOrganization(): Promise<{ departments: Department[]; positions: Position[] }> {
    return fetchJson(`${API_BASE}/departments`);
  },

  async createDepartment(payload: { code: string; name: string; managerName?: string; description?: string }): Promise<Department> {
    return fetchJson(`${API_BASE}/departments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },

  // Settings
  async getSettings(): Promise<CompanySetting> {
    return fetchJson(`${API_BASE}/settings`);
  },

  async updateSettings(payload: Partial<CompanySetting>): Promise<CompanySetting> {
    return fetchJson(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },

  // Enterprise Admin RBAC & Security Management API
  async getRoles(): Promise<any[]> {
    return fetchJson(`${API_BASE}/admin/roles`);
  },

  async createRole(payload: any): Promise<any> {
    return fetchJson(`${API_BASE}/admin/roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },

  async updateRole(id: string, payload: any): Promise<any> {
    return fetchJson(`${API_BASE}/admin/roles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },

  async deleteRole(id: string): Promise<any> {
    return fetchJson(`${API_BASE}/admin/roles/${id}`, {
      method: 'DELETE'
    });
  },

  async getUserAccounts(params?: { search?: string; roleId?: string; status?: string }): Promise<any[]> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.roleId) query.append('roleId', params.roleId);
    if (params?.status) query.append('status', params.status);

    return fetchJson(`${API_BASE}/admin/users?${query.toString()}`);
  },

  async updateUserStatus(id: string, status: 'active' | 'locked'): Promise<any> {
    return fetchJson(`${API_BASE}/admin/users/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  },

  async assignUserRole(userId: string, roleId: string): Promise<any> {
    return fetchJson(`${API_BASE}/admin/users/${userId}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roleId })
    });
  },

  async resetUserPassword(userId: string): Promise<{ tempPassword: string; message: string }> {
    return fetchJson(`${API_BASE}/admin/users/${userId}/reset-password`, {
      method: 'POST'
    });
  },

  async getAuditLogs(params?: { module?: string; action?: string; search?: string }): Promise<any[]> {
    const query = new URLSearchParams();
    if (params?.module) query.append('module', params.module);
    if (params?.action) query.append('action', params.action);
    if (params?.search) query.append('search', params.search);

    return fetchJson(`${API_BASE}/admin/audit-logs?${query.toString()}`);
  },

  async getSecuritySettings(): Promise<any> {
    return fetchJson(`${API_BASE}/admin/security`);
  },

  async updateSecuritySettings(payload: any): Promise<any> {
    return fetchJson(`${API_BASE}/admin/security`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }
};
