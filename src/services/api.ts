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

export const api = {
  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/dashboard/stats`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // Employees
  async getEmployees(params?: { search?: string; departmentId?: string; status?: string }): Promise<Employee[]> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.departmentId) query.append('departmentId', params.departmentId);
    if (params?.status) query.append('status', params.status);

    const res = await fetch(`${API_BASE}/employees?${query.toString()}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  async getEmployee(id: string): Promise<Employee> {
    const res = await fetch(`${API_BASE}/employees/${id}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  async createEmployee(payload: Partial<Employee>): Promise<Employee> {
    const res = await fetch(`${API_BASE}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  async updateEmployee(id: string, payload: Partial<Employee>): Promise<Employee> {
    const res = await fetch(`${API_BASE}/employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  async deleteEmployee(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/employees/${id}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
  },

  // Employee Sub-entities API
  async addEmployeeContract(id: string, payload: any): Promise<any> {
    const res = await fetch(`${API_BASE}/employees/${id}/contracts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  async addEmployeeWorkHistory(id: string, payload: any): Promise<any> {
    const res = await fetch(`${API_BASE}/employees/${id}/work-history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  async addEmployeeReward(id: string, payload: any): Promise<any> {
    const res = await fetch(`${API_BASE}/employees/${id}/rewards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  async addEmployeeDependent(id: string, payload: any): Promise<any> {
    const res = await fetch(`${API_BASE}/employees/${id}/dependents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  async deleteEmployeeDependent(id: string, depId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/employees/${id}/dependents/${depId}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
  },

  async addEmployeeDocument(id: string, payload: any): Promise<any> {
    const res = await fetch(`${API_BASE}/employees/${id}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // Attendance
  async getAttendance(date = '2026-09-21', departmentId?: string): Promise<AttendanceRecord[]> {
    const query = new URLSearchParams({ date });
    if (departmentId) query.append('departmentId', departmentId);

    const res = await fetch(`${API_BASE}/attendance?${query.toString()}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  async checkIn(employeeId: string, time?: string): Promise<AttendanceRecord> {
    const res = await fetch(`${API_BASE}/attendance/check-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId, time })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  async checkOut(employeeId: string, time?: string): Promise<AttendanceRecord> {
    const res = await fetch(`${API_BASE}/attendance/check-out`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId, time })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // Leaves & Approval
  async getLeaves(params?: { status?: string; type?: string; employeeId?: string }): Promise<LeaveRequest[]> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.type) query.append('type', params.type);
    if (params?.employeeId) query.append('employeeId', params.employeeId);

    const res = await fetch(`${API_BASE}/leaves?${query.toString()}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  async createLeave(payload: Partial<LeaveRequest>): Promise<LeaveRequest> {
    const res = await fetch(`${API_BASE}/leaves`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  async updateLeaveStatus(id: string, status: 'approved' | 'rejected', reviewNotes?: string): Promise<LeaveRequest> {
    const res = await fetch(`${API_BASE}/leaves/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, reviewNotes })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
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
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return { data: data.data, summary: data.summary };
  },

  async getPayslip(id: string): Promise<{ data: PayrollRecord; employee: Employee }> {
    const res = await fetch(`${API_BASE}/payroll/${id}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return { data: data.data, employee: data.employee };
  },

  async updatePayrollStatus(period: string, status: 'draft' | 'approved' | 'paid'): Promise<void> {
    const res = await fetch(`${API_BASE}/payroll/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ period, status })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
  },

  // Departments & Positions
  async getOrganization(): Promise<{ departments: Department[]; positions: Position[] }> {
    const res = await fetch(`${API_BASE}/departments`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  async createDepartment(payload: { code: string; name: string; managerName?: string; description?: string }): Promise<Department> {
    const res = await fetch(`${API_BASE}/departments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  // Settings
  async getSettings(): Promise<CompanySetting> {
    const res = await fetch(`${API_BASE}/settings`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  },

  async updateSettings(payload: Partial<CompanySetting>): Promise<CompanySetting> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data.data;
  }
};
