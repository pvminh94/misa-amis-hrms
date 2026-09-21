import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  Department,
  Position,
  Employee,
  AttendanceRecord,
  LeaveRequest,
  PayrollRecord,
  CompanySetting,
  ShiftDefinition,
  MonthlyTimesheetEmployee,
  ShiftSwapRequest,
  AttendanceRegularization,
  GeofenceLocation,
  DayTimesheetCell,
  ShiftRosterEntry,
  RawPunchLog,
  AttendancePolicySetting,
  AttendanceAnalytics,
  DayRosterSchedule,
  SystemRole,
  UserAccount,
  AuditLog,
  SecuritySetting,
  PermissionMatrix
} from './types';
import {
  initialDepartments,
  initialPositions,
  initialEmployees,
  initialAttendanceList,
  initialLeaveRequests,
  initialPayrollList,
  initialCompanySettings,
  initialShifts,
  initialMonthlyTimesheets,
  initialShiftSwaps,
  initialRegularizations,
  initialGeofenceLocations,
  initialShiftRosters,
  initialRawPunchLogs,
  initialAttendancePolicy,
  initialRoles,
  initialUserAccounts,
  initialAuditLogs,
  initialSecuritySettings,
  initialCrmCandidates,
  calculateVietnamesePayroll
} from './data/seedData';

interface DatabaseSchema {
  departments: Department[];
  positions: Position[];
  employees: Employee[];
  attendance: AttendanceRecord[];
  leaves: LeaveRequest[];
  payroll: PayrollRecord[];
  settings: CompanySetting;
  shifts: ShiftDefinition[];
  monthlyTimesheets: MonthlyTimesheetEmployee[];
  shiftSwaps: ShiftSwapRequest[];
  regularizations: AttendanceRegularization[];
  geofenceLocations: GeofenceLocation[];
  shiftRosters: ShiftRosterEntry[];
  rawPunches: RawPunchLog[];
  attendancePolicy: AttendancePolicySetting;
  roles: SystemRole[];
  userAccounts: UserAccount[];
  auditLogs: AuditLog[];
  securitySettings: SecuritySetting;
  crmCandidates: CrmCandidate[];
  onboardingTasks: OnboardingTask[];
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'data', 'db.json');

class DatabaseStore {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        // Ensure new collections exist even if loaded from older db.json
        if (!parsed.shifts) parsed.shifts = initialShifts;
        if (!parsed.monthlyTimesheets) parsed.monthlyTimesheets = initialMonthlyTimesheets;
        if (!parsed.shiftSwaps) parsed.shiftSwaps = initialShiftSwaps;
        if (!parsed.regularizations) parsed.regularizations = initialRegularizations;
        if (!parsed.geofenceLocations) parsed.geofenceLocations = initialGeofenceLocations;
        if (!parsed.shiftRosters) parsed.shiftRosters = initialShiftRosters;
        if (!parsed.rawPunches) parsed.rawPunches = initialRawPunchLogs;
        if (!parsed.attendancePolicy) parsed.attendancePolicy = initialAttendancePolicy;
        if (!parsed.roles) parsed.roles = initialRoles;
        if (!parsed.userAccounts) parsed.userAccounts = initialUserAccounts;
        if (!parsed.auditLogs) parsed.auditLogs = initialAuditLogs;
        if (!parsed.securitySettings) parsed.securitySettings = initialSecuritySettings;
        if (!parsed.crmCandidates) parsed.crmCandidates = initialCrmCandidates;
        if (!parsed.onboardingTasks) parsed.onboardingTasks = [];
        return parsed;
      }
    } catch (err) {
      console.error('Failed to read db.json, initializing from seed...', err);
    }

    const defaultData: DatabaseSchema = {
      departments: initialDepartments,
      positions: initialPositions,
      employees: initialEmployees,
      attendance: initialAttendanceList,
      leaves: initialLeaveRequests,
      payroll: initialPayrollList,
      settings: initialCompanySettings,
      shifts: initialShifts,
      monthlyTimesheets: initialMonthlyTimesheets,
      shiftSwaps: initialShiftSwaps,
      regularizations: initialRegularizations,
      geofenceLocations: initialGeofenceLocations,
      shiftRosters: initialShiftRosters,
      rawPunches: initialRawPunchLogs,
      attendancePolicy: initialAttendancePolicy,
      roles: initialRoles,
      userAccounts: initialUserAccounts,
      auditLogs: initialAuditLogs,
      securitySettings: initialSecuritySettings,
      crmCandidates: initialCrmCandidates,
      onboardingTasks: []
    };
    this.saveData(defaultData);
    return defaultData;
  }

  private saveData(dataToSave?: DatabaseSchema) {
    try {
      const data = dataToSave || this.data;
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save to db.json:', err);
    }
  }

  // Employees
  getEmployees() {
    return this.data.employees;
  }

  getEmployeeById(id: string) {
    return this.data.employees.find((e) => e.id === id);
  }

  createEmployee(
    employeeData: Omit<Employee, 'id'>,
    options?: {
      createUserAccount?: boolean;
      roleId?: string;
      username?: string;
      password?: string;
      autoRoster?: boolean;
    }
  ) {
    const id = `emp-${Date.now().toString().slice(-6)}`;
    const code = employeeData.code || `AMIS-${String(this.data.employees.length + 1).padStart(4, '0')}`;

    // Auto generate initial contract if not provided
    const contracts = employeeData.contracts && employeeData.contracts.length > 0
      ? employeeData.contracts
      : [
          {
            id: `ctr-${Date.now().toString().slice(-6)}`,
            contractNumber: `HĐLĐ-2026/${code}`,
            contractType: employeeData.contractType || 'Hợp đồng thử việc 02 tháng',
            signDate: employeeData.joinDate || '2026-09-21',
            startDate: employeeData.contractStartDate || employeeData.joinDate || '2026-09-21',
            endDate: employeeData.contractEndDate || '2026-11-21',
            signerName: 'Trịnh Văn Cường',
            signerTitle: 'Tổng Giám Đốc',
            salaryInsurance: employeeData.salary?.baseSalary || 15000000,
            status: 'active' as const
          }
        ];

    const newEmployee: Employee = {
      ...employeeData,
      id,
      code,
      contracts,
      workHistory: employeeData.workHistory || [
        {
          id: `wh-${Date.now().toString().slice(-6)}`,
          fromDate: employeeData.joinDate || '2026-09-21',
          toDate: 'Hiện tại',
          company: 'Công ty Cổ phần AMIS HRM',
          position: employeeData.positionTitle || 'Chuyên viên',
          note: 'Tiếp nhận tuyển dụng mới'
        }
      ],
      rewardsDisciplines: employeeData.rewardsDisciplines || [],
      dependentsList: employeeData.dependentsList || [],
      documents: employeeData.documents || []
    };

    this.data.employees.unshift(newEmployee);
    
    // Also generate payroll row for current period
    const newPayroll = calculateVietnamesePayroll(newEmployee, 22, 0);
    this.data.payroll.unshift(newPayroll);

    // Update department count
    const dept = this.data.departments.find((d) => d.id === newEmployee.departmentId);
    if (dept) {
      dept.employeeCount += 1;
    }

    // Auto-create Shift Roster entries for the current month
    if (options?.autoRoster !== false && this.data.shiftRosters) {
      const defaultSchedules: { [day: number]: any } = {};
      for (let day = 1; day <= 30; day++) {
        const isWeekend = [5, 6, 12, 13, 19, 20, 26, 27].includes(day);
        defaultSchedules[day] = {
          shiftId: isWeekend ? 'shift-off' : 'shift-std',
          shiftCode: isWeekend ? 'OFF' : 'CA-HC',
          shiftName: isWeekend ? 'Nghỉ cuối tuần' : 'Ca Hành chính (8h)'
        };
      }

      this.data.shiftRosters.push({
        id: `roster-${newEmployee.id}`,
        employeeId: newEmployee.id,
        employeeCode: newEmployee.code,
        employeeName: newEmployee.fullName,
        departmentName: newEmployee.departmentName,
        period: '2026-09',
        schedules: defaultSchedules
      });
    }

    // Auto-create User Account if requested (default: true)
    if (options?.createUserAccount !== false) {
      const roleId = options?.roleId || 'role-employee';
      const role = this.data.roles.find((r) => r.id === roleId) || this.data.roles[this.data.roles.length - 1];
      const username = options?.username || (newEmployee.email ? newEmployee.email.split('@')[0] : `user_${newEmployee.code.toLowerCase().replace('-', '')}`);
      
      const userAccount: UserAccount = {
        id: `usr-${Date.now().toString().slice(-6)}`,
        employeeId: newEmployee.id,
        employeeCode: newEmployee.code,
        fullName: newEmployee.fullName,
        email: newEmployee.email || `${username}@amis.vn`,
        username: username.toLowerCase().trim(),
        password: options?.password || 'Amis@123456',
        departmentName: newEmployee.departmentName,
        positionTitle: newEmployee.positionTitle,
        roleId: role.id,
        roleName: role.name,
        roleCode: role.code,
        status: 'active',
        twoFactorEnabled: false,
        createdAt: '2026-09-21'
      };
      this.data.userAccounts.push(userAccount);
      role.userCount = (role.userCount || 0) + 1;
    }

    // Log to Audit Trail
    this.addAuditLog({
      userId: 'usr-01',
      userCode: 'AMIS-0001',
      userName: 'Trịnh Văn Cường',
      roleName: 'Quản trị viên Toàn quyền',
      module: 'employees',
      action: 'CREATE',
      description: `Tiếp nhận nhân sự mới thành công: ${newEmployee.fullName} (${newEmployee.code}) - Tự động thiết lập HĐLĐ, Phân ca, Bảng lương và Tài khoản`,
      targetId: newEmployee.id,
      targetName: newEmployee.fullName,
      ipAddress: '118.70.124.9',
      status: 'success'
    });

    this.saveData();
    return newEmployee;
  }

  updateEmployee(id: string, updates: Partial<Employee>) {
    const index = this.data.employees.findIndex((e) => e.id === id);
    if (index === -1) return null;

    const oldDeptId = this.data.employees[index].departmentId;
    this.data.employees[index] = { ...this.data.employees[index], ...updates };
    const updated = this.data.employees[index];

    // If department changed, update counts
    if (updates.departmentId && updates.departmentId !== oldDeptId) {
      const oldDept = this.data.departments.find(d => d.id === oldDeptId);
      if (oldDept && oldDept.employeeCount > 0) oldDept.employeeCount -= 1;
      const newDept = this.data.departments.find(d => d.id === updates.departmentId);
      if (newDept) newDept.employeeCount += 1;
    }

    // Recalculate payroll if salary or dependents changed
    if (updates.salary) {
      const payIndex = this.data.payroll.findIndex(p => p.employeeId === id && p.period === '2026-09');
      if (payIndex !== -1) {
        this.data.payroll[payIndex] = calculateVietnamesePayroll(updated, this.data.payroll[payIndex].actualWorkDays, 0);
      }
    }

    this.saveData();
    return updated;
  }

  deleteEmployee(id: string) {
    const index = this.data.employees.findIndex((e) => e.id === id);
    if (index === -1) return false;
    const [deleted] = this.data.employees.splice(index, 1);
    
    // Decrement dept count
    const dept = this.data.departments.find(d => d.id === deleted.departmentId);
    if (dept && dept.employeeCount > 0) dept.employeeCount -= 1;

    // Filter payroll and attendance
    this.data.payroll = this.data.payroll.filter(p => p.employeeId !== id);
    this.data.attendance = this.data.attendance.filter(a => a.employeeId !== id);

    this.saveData();
    return true;
  }

  // Employee Sub-entities (Contracts, Work History, Rewards, Dependents, Documents)
  addContract(employeeId: string, contract: any) {
    const emp = this.getEmployeeById(employeeId);
    if (!emp) return null;
    if (!emp.contracts) emp.contracts = [];
    
    const newContract = {
      ...contract,
      id: `c-${Date.now().toString().slice(-6)}`,
      status: contract.status || 'active'
    };
    emp.contracts.unshift(newContract);
    
    // Update employee current contract
    emp.contractType = newContract.contractType;
    emp.contractStartDate = newContract.startDate;
    emp.contractEndDate = newContract.endDate;
    
    this.saveData();
    return newContract;
  }

  addWorkHistory(employeeId: string, history: any) {
    const emp = this.getEmployeeById(employeeId);
    if (!emp) return null;
    if (!emp.workHistory) emp.workHistory = [];

    const newHistory = {
      ...history,
      id: `wh-${Date.now().toString().slice(-6)}`
    };
    emp.workHistory.unshift(newHistory);

    // If salary changed, update employee salary
    if (history.salaryAfter && history.salaryAfter > 0) {
      emp.salary.baseSalary = history.salaryAfter;
      // recalculate payroll
      const payIdx = this.data.payroll.findIndex(p => p.employeeId === employeeId && p.period === '2026-09');
      if (payIdx !== -1) {
        this.data.payroll[payIdx] = calculateVietnamesePayroll(emp, this.data.payroll[payIdx].actualWorkDays, 0);
      }
    }

    this.saveData();
    return newHistory;
  }

  addRewardDiscipline(employeeId: string, item: any) {
    const emp = this.getEmployeeById(employeeId);
    if (!emp) return null;
    if (!emp.rewardsDisciplines) emp.rewardsDisciplines = [];

    const newItem = {
      ...item,
      id: `rd-${Date.now().toString().slice(-6)}`
    };
    emp.rewardsDisciplines.unshift(newItem);
    this.saveData();
    return newItem;
  }

  addDependent(employeeId: string, dependent: any) {
    const emp = this.getEmployeeById(employeeId);
    if (!emp) return null;
    if (!emp.dependentsList) emp.dependentsList = [];

    const newDep = {
      ...dependent,
      id: `dep-${Date.now().toString().slice(-6)}`
    };
    emp.dependentsList.push(newDep);

    // Automatically update dependents count and recalculate payroll!
    emp.salary.dependents = emp.dependentsList.length;
    const payIdx = this.data.payroll.findIndex(p => p.employeeId === employeeId && p.period === '2026-09');
    if (payIdx !== -1) {
      this.data.payroll[payIdx] = calculateVietnamesePayroll(emp, this.data.payroll[payIdx].actualWorkDays, 0);
    }

    this.saveData();
    return newDep;
  }

  deleteDependent(employeeId: string, depId: string) {
    const emp = this.getEmployeeById(employeeId);
    if (!emp || !emp.dependentsList) return false;

    const initialLen = emp.dependentsList.length;
    emp.dependentsList = emp.dependentsList.filter(d => d.id !== depId);
    if (emp.dependentsList.length === initialLen) return false;

    emp.salary.dependents = emp.dependentsList.length;
    const payIdx = this.data.payroll.findIndex(p => p.employeeId === employeeId && p.period === '2026-09');
    if (payIdx !== -1) {
      this.data.payroll[payIdx] = calculateVietnamesePayroll(emp, this.data.payroll[payIdx].actualWorkDays, 0);
    }

    this.saveData();
    return true;
  }

  addDocument(employeeId: string, doc: any) {
    const emp = this.getEmployeeById(employeeId);
    if (!emp) return null;
    if (!emp.documents) emp.documents = [];

    const newDoc = {
      ...doc,
      id: `doc-${Date.now().toString().slice(-6)}`,
      uploadDate: '2026-09-21'
    };
    emp.documents.unshift(newDoc);
    this.saveData();
    return newDoc;
  }

  // Departments
  getDepartments() {
    return this.data.departments;
  }

  getPositions() {
    return this.data.positions;
  }

  createDepartment(dept: Omit<Department, 'id' | 'employeeCount'>) {
    const id = `dept-${Date.now().toString().slice(-4)}`;
    const newDept: Department = {
      ...dept,
      id,
      employeeCount: 0
    };
    this.data.departments.push(newDept);
    this.saveData();
    return newDept;
  }

  // Attendance
  getAttendance(date?: string) {
    if (date) {
      return this.data.attendance.filter((a) => a.date === date);
    }
    return this.data.attendance;
  }

  recordCheckIn(employeeId: string, customTime?: string) {
    const today = '2026-09-21';
    const now = customTime || new Date().toTimeString().slice(0, 5); // HH:MM
    const emp = this.getEmployeeById(employeeId);
    if (!emp) return null;

    let record = this.data.attendance.find((a) => a.employeeId === employeeId && a.date === today);
    const isLate = now > '08:15';

    if (record) {
      record.checkIn = now;
      record.status = isLate ? 'late' : 'present';
    } else {
      record = {
        id: `att-${employeeId}-${today.replace(/-/g, '')}`,
        employeeId,
        employeeName: emp.fullName,
        departmentName: emp.departmentName,
        date: today,
        checkIn: now,
        checkOut: '--:--',
        workHours: 0,
        status: isLate ? 'late' : 'present',
        notes: isLate ? 'Chấm công muộn' : 'Chấm công thành công'
      };
      this.data.attendance.unshift(record);
    }

    this.saveData();
    return record;
  }

  recordCheckOut(employeeId: string, customTime?: string) {
    const today = '2026-09-21';
    const now = customTime || new Date().toTimeString().slice(0, 5);
    const record = this.data.attendance.find((a) => a.employeeId === employeeId && a.date === today);
    if (!record) return null;

    record.checkOut = now;
    // Calculate simple duration
    if (record.checkIn && record.checkIn !== '--:--') {
      const [inH, inM] = record.checkIn.split(':').map(Number);
      const [outH, outM] = now.split(':').map(Number);
      let diff = (outH * 60 + outM) - (inH * 60 + inM);
      if (diff > 90) diff -= 90; // lunch break 1.5h
      record.workHours = Math.max(0, Number((diff / 60).toFixed(1)));
    }
    this.saveData();
    return record;
  }

  // Leaves & Approval
  getLeaves() {
    return this.data.leaves;
  }

  createLeave(leave: Omit<LeaveRequest, 'id' | 'code' | 'status' | 'createdAt'>) {
    const id = `leave-${Date.now().toString().slice(-6)}`;
    const code = `ĐƠN-${Math.floor(1000 + Math.random() * 9000)}`;
    const newLeave: LeaveRequest = {
      ...leave,
      id,
      code,
      status: 'pending',
      createdAt: '2026-09-21 08:30:00'
    };
    this.data.leaves.unshift(newLeave);
    this.saveData();
    return newLeave;
  }

  updateLeaveStatus(id: string, status: 'approved' | 'rejected', reviewNotes?: string) {
    const leave = this.data.leaves.find((l) => l.id === id);
    if (!leave) return null;

    leave.status = status;
    leave.reviewedAt = '2026-09-21 09:15:00';
    if (reviewNotes) leave.reviewNotes = reviewNotes;

    this.saveData();
    return leave;
  }

  // Payroll
  getPayroll(period = '2026-09') {
    return this.data.payroll.filter((p) => p.period === period);
  }

  getPayrollRecordByEmployeeId(employeeId: string, period = '2026-09') {
    return this.data.payroll.find((p) => p.employeeId === employeeId && p.period === period);
  }

  getPayrollById(id: string) {
    return this.data.payroll.find((p) => p.id === id);
  }

  updatePayrollStatus(period: string, status: 'draft' | 'approved' | 'paid') {
    this.data.payroll.forEach((p) => {
      if (p.period === period) {
        p.status = status;
        if (status === 'paid') p.paidDate = '2026-10-05';
      }
    });
    this.saveData();
    return true;
  }

  // Settings
  getSettings() {
    return this.data.settings;
  }

  updateSettings(settings: Partial<CompanySetting>) {
    this.data.settings = { ...this.data.settings, ...settings };
    this.saveData();
    return this.data.settings;
  }

  // ADVANCED ATTENDANCE & SHIFTS
  getShifts() {
    return this.data.shifts;
  }

  createShift(shift: Omit<ShiftDefinition, 'id'>) {
    const newShift: ShiftDefinition = {
      ...shift,
      id: `shift-${Date.now().toString().slice(-4)}`
    };
    this.data.shifts.push(newShift);
    this.saveData();
    return newShift;
  }

  updateShift(id: string, updates: Partial<ShiftDefinition>) {
    const idx = this.data.shifts.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    this.data.shifts[idx] = { ...this.data.shifts[idx], ...updates };
    this.saveData();
    return this.data.shifts[idx];
  }

  getMonthlyTimesheets(period = '2026-09') {
    return this.data.monthlyTimesheets.filter((m) => m.period === period);
  }

  updateTimesheetCell(employeeId: string, day: number, cellUpdates: Partial<DayTimesheetCell>) {
    const row = this.data.monthlyTimesheets.find((m) => m.employeeId === employeeId && m.period === '2026-09');
    if (!row || !row.days[day]) return null;

    row.days[day] = { ...row.days[day], ...cellUpdates };

    // Recalculate totals
    let workDays = 0;
    let paidLeaves = 0;
    let unpaidLeaves = 0;
    let lateTimes = 0;
    let lateMinutes = 0;
    let otHours = 0;

    Object.values(row.days).forEach((cell) => {
      if (cell.status === 'X' || cell.status === 'L' || cell.status === 'CT') {
        workDays += 1;
      } else if (cell.status === 'OT') {
        workDays += 1;
        otHours += Math.max(0, cell.workHours - 8);
      } else if (cell.status === 'P') {
        paidLeaves += 1;
      } else if (cell.status === 'KP') {
        unpaidLeaves += 1;
      }

      if (cell.status === 'L' && cell.lateMinutes) {
        lateTimes += 1;
        lateMinutes += cell.lateMinutes;
      }
    });

    row.totalWorkDays = workDays;
    row.totalPaidLeaves = paidLeaves;
    row.totalUnpaidLeaves = unpaidLeaves;
    row.totalLateTimes = lateTimes;
    row.totalLateMinutes = lateMinutes;
    row.totalOTHours = otHours;

    // Trigger payroll actualWorkDays recalculation!
    const emp = this.getEmployeeById(employeeId);
    if (emp) {
      const payIdx = this.data.payroll.findIndex((p) => p.employeeId === employeeId && p.period === '2026-09');
      if (payIdx !== -1) {
        this.data.payroll[payIdx] = calculateVietnamesePayroll(emp, workDays, otHours);
      }
    }

    this.saveData();
    return row;
  }

  getShiftSwaps() {
    return this.data.shiftSwaps;
  }

  createShiftSwap(data: Omit<ShiftSwapRequest, 'id' | 'code' | 'status' | 'createdAt'>) {
    const id = `swap-${Date.now().toString().slice(-6)}`;
    const code = `ĐCA-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newSwap: ShiftSwapRequest = {
      ...data,
      id,
      code,
      status: 'pending',
      createdAt: '2026-09-21 08:30:00'
    };
    this.data.shiftSwaps.unshift(newSwap);
    this.saveData();
    return newSwap;
  }

  updateShiftSwapStatus(id: string, status: 'approved' | 'rejected', approverName = 'Vũ Quốc Thái') {
    const swap = this.data.shiftSwaps.find((s) => s.id === id);
    if (!swap) return null;

    swap.status = status;
    swap.approverName = approverName;
    swap.reviewedAt = '2026-09-21 09:15:00';

    this.saveData();
    return swap;
  }

  getRegularizations() {
    return this.data.regularizations;
  }

  createRegularization(data: Omit<AttendanceRegularization, 'id' | 'code' | 'status' | 'createdAt'>) {
    const id = `reg-${Date.now().toString().slice(-6)}`;
    const code = `GTC-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newReg: AttendanceRegularization = {
      ...data,
      id,
      code,
      status: 'pending',
      createdAt: '2026-09-21 08:45:00'
    };
    this.data.regularizations.unshift(newReg);
    this.saveData();
    return newReg;
  }

  updateRegularizationStatus(id: string, status: 'approved' | 'rejected', approverName = 'Vũ Quốc Thái') {
    const reg = this.data.regularizations.find((r) => r.id === id);
    if (!reg) return null;

    reg.status = status;
    reg.approverName = approverName;
    reg.reviewedAt = '2026-09-21 09:20:00';

    // If approved, fix the daily record and monthly cell!
    if (status === 'approved') {
      const todayRecord = this.data.attendance.find((a) => a.employeeId === reg.employeeId && a.date === reg.date);
      if (todayRecord) {
        if (reg.suggestedCheckIn) todayRecord.checkIn = reg.suggestedCheckIn;
        if (reg.suggestedCheckOut) todayRecord.checkOut = reg.suggestedCheckOut;
        todayRecord.status = 'present';
        todayRecord.workHours = 8.0;
        todayRecord.notes = `Đã duyệt giải trình: ${reg.reason}`;
      }

      // Also adjust cell in monthly timesheet
      const dayNum = Number(reg.date.split('-')[2]);
      if (dayNum) {
        this.updateTimesheetCell(reg.employeeId, dayNum, {
          status: 'X',
          workHours: 8,
          checkIn: reg.suggestedCheckIn || '08:00',
          checkOut: reg.suggestedCheckOut || '17:30',
          notes: `Đã duyệt giải trình: ${reg.reason}`
        });
      }
    }

    this.saveData();
    return reg;
  }

  getGeofenceLocations() {
    return this.data.geofenceLocations;
  }

  updateGeofenceLocation(id: string, updates: Partial<GeofenceLocation>) {
    const idx = this.data.geofenceLocations.findIndex((g) => g.id === id);
    if (idx === -1) return null;
    this.data.geofenceLocations[idx] = { ...this.data.geofenceLocations[idx], ...updates };
    this.saveData();
    return this.data.geofenceLocations[idx];
  }

  // Shift Rostering Methods
  getShiftRosters(period = '2026-09', departmentName?: string, search?: string) {
    let result = this.data.shiftRosters.filter((r) => r.period === period);
    if (departmentName && departmentName !== 'all') {
      result = result.filter((r) => r.departmentName === departmentName);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((r) => r.employeeName.toLowerCase().includes(q) || r.employeeCode.toLowerCase().includes(q));
    }
    return result;
  }

  updateShiftRosterCell(employeeId: string, day: number, updates: Partial<DayRosterSchedule>) {
    const row = this.data.shiftRosters.find((r) => r.employeeId === employeeId && r.period === '2026-09');
    if (!row) return null;
    row.schedules[day] = { ...row.schedules[day], ...updates };
    this.saveData();
    return row;
  }

  bulkAssignShiftRoster(params: {
    departmentName: string;
    shiftCode: string;
    shiftName: string;
    shiftId: string;
    startDay: number;
    endDay: number;
    includeWeekends?: boolean;
  }) {
    const { departmentName, shiftCode, shiftName, shiftId, startDay, endDay, includeWeekends } = params;
    let targets = this.data.shiftRosters;
    if (departmentName && departmentName !== 'all') {
      targets = targets.filter((r) => r.departmentName === departmentName);
    }

    targets.forEach((roster) => {
      if (!roster.schedules) roster.schedules = {};
      for (let day = startDay; day <= endDay; day++) {
        const isWeekend = [5, 6, 12, 13, 19, 20, 26, 27].includes(day);
        if (isWeekend && !includeWeekends) continue;

        roster.schedules[day] = {
          shiftId,
          shiftCode,
          shiftName,
          isCustom: true,
          notes: `Phân ca hàng loạt (${departmentName})`
        };
      }
    });

    this.saveData();
    return targets;
  }

  // Biometric Raw Punch Logs Methods
  getRawPunchLogs(params?: { date?: string; employeeId?: string; source?: string; search?: string }) {
    let logs = this.data.rawPunches;
    if (params?.date) {
      logs = logs.filter((l) => l.punchDate === params.date);
    }
    if (params?.employeeId) {
      logs = logs.filter((l) => l.employeeId === params.employeeId);
    }
    if (params?.source && params.source !== 'all') {
      logs = logs.filter((l) => l.source === params.source);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      logs = logs.filter((l) => l.employeeName.toLowerCase().includes(q) || l.employeeCode.toLowerCase().includes(q) || l.deviceName.toLowerCase().includes(q));
    }
    return logs;
  }

  syncBiometricLogs() {
    const now = new Date();
    const today = '2026-09-21';
    const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    // Add simulated checkout punches for employees who haven't checked out yet
    let newlySyncedCount = 0;
    this.data.employees.slice(0, 8).forEach((emp, idx) => {
      const punchId = `punch-sync-${emp.id}-${Date.now().toString().slice(-4)}`;
      const punchTime = `17:${30 + (idx % 15)}`;
      const exists = this.data.rawPunches.some((p) => p.employeeId === emp.id && p.pairingType === 'check_out');
      if (!exists) {
        this.data.rawPunches.unshift({
          id: punchId,
          employeeId: emp.id,
          employeeCode: emp.code,
          employeeName: emp.fullName,
          departmentName: emp.departmentName,
          timestamp: `${today} ${punchTime}:18`,
          punchDate: today,
          punchTime: `${punchTime}:18`,
          source: idx % 2 === 0 ? 'face_id' : 'fingerprint',
          deviceName: idx % 2 === 0 ? 'Hikvision FaceID AI DS-K1T671 (Cổng chính)' : 'Ronald Jack RJ-8800 (Tầng 9 HQ)',
          deviceIp: '192.168.1.201',
          accuracyScore: 99.3,
          pairingStatus: 'paired',
          pairingType: 'check_out'
        });
        newlySyncedCount++;

        // Update daily attendance
        const att = this.data.attendance.find((a) => a.employeeId === emp.id && a.date === today);
        if (att) {
          att.checkOut = punchTime;
          att.workHours = 8.0;
        }
      }
    });

    this.saveData();
    return {
      syncedAt: `${today} ${currentTimeStr}`,
      recordsAdded: newlySyncedCount,
      totalLogs: this.data.rawPunches.length
    };
  }

  // Attendance Policy
  getAttendancePolicy(): AttendancePolicySetting {
    return this.data.attendancePolicy;
  }

  updateAttendancePolicy(updates: Partial<AttendancePolicySetting>) {
    this.data.attendancePolicy = { ...this.data.attendancePolicy, ...updates };
    this.saveData();
    return this.data.attendancePolicy;
  }

  // Attendance Analytics & Late Leaderboard
  getAttendanceAnalytics(period = '2026-09'): AttendanceAnalytics {
    const totalEmployees = this.data.employees.length;
    const monthly = this.data.monthlyTimesheets.filter((m) => m.period === period);

    // Calculate overall attendance rate
    const totalPossibleDays = totalEmployees * 22;
    const totalWorkDaysDone = monthly.reduce((sum, m) => sum + m.totalWorkDays, 0);
    const overallAttendanceRate = totalPossibleDays > 0 ? Math.round((totalWorkDaysDone / totalPossibleDays) * 100) : 95;
    const totalWorkHours = monthly.reduce((sum, m) => sum + m.totalWorkDays * 8, 0);
    const totalOTHours = monthly.reduce((sum, m) => sum + m.totalOTHours, 0);

    // Department rates breakdown
    const deptMap: { [key: string]: { workDays: number; possibleDays: number; count: number } } = {};
    monthly.forEach((m) => {
      if (!deptMap[m.departmentName]) {
        deptMap[m.departmentName] = { workDays: 0, possibleDays: 0, count: 0 };
      }
      deptMap[m.departmentName].workDays += m.totalWorkDays;
      deptMap[m.departmentName].possibleDays += 22;
      deptMap[m.departmentName].count += 1;
    });

    const departmentRates = Object.entries(deptMap).map(([departmentName, stat]) => ({
      departmentName,
      count: stat.count,
      rate: stat.possibleDays > 0 ? Math.round((stat.workDays / stat.possibleDays) * 100) : 95
    }));

    // Late Leaderboard sorted descending by late minutes & times
    const lateLeaderboard: LateLeaderboardItem[] = monthly
      .filter((m) => m.totalLateTimes > 0)
      .map((m) => {
        let severity: LateLeaderboardItem['severity'] = 'normal';
        if (m.totalLateTimes >= 3 || m.totalLateMinutes >= 60) {
          severity = 'penalty'; // Đề xuất trừ thưởng chuyên cần
        } else if (m.totalLateTimes >= 1) {
          severity = 'warning';
        }
        return {
          employeeId: m.employeeId,
          employeeCode: m.employeeCode,
          employeeName: m.employeeName,
          departmentName: m.departmentName,
          lateTimes: m.totalLateTimes,
          totalLateMinutes: m.totalLateMinutes,
          severity
        };
      })
      .sort((a, b) => b.totalLateMinutes - a.totalLateMinutes);

    return {
      totalEmployees,
      overallAttendanceRate,
      totalWorkHours,
      totalOTHours,
      departmentRates,
      lateLeaderboard
    };
  }

  // ========================================================
  // ENTERPRISE RBAC & ADMIN SYSTEM MANAGEMENT METHODS
  // ========================================================

  getRoles(): SystemRole[] {
    return this.data.roles;
  }

  getRoleById(id: string): SystemRole | undefined {
    return this.data.roles.find((r) => r.id === id);
  }

  createRole(roleData: Omit<SystemRole, 'id' | 'createdAt' | 'updatedAt' | 'userCount'>): SystemRole {
    const id = `role-${Date.now().toString().slice(-6)}`;
    const today = '2026-09-21';
    const newRole: SystemRole = {
      ...roleData,
      id,
      isSystem: Boolean(roleData.isSystem),
      userCount: 0,
      createdAt: today,
      updatedAt: today
    };
    this.data.roles.push(newRole);

    this.addAuditLog({
      userId: 'usr-01',
      userCode: 'AMIS-0001',
      userName: 'Trịnh Văn Cường',
      roleName: 'Quản trị viên Toàn quyền',
      module: 'admin_rbac',
      action: 'CREATE',
      description: `Tạo mới vai trò phân quyền: ${newRole.name} (${newRole.code})`,
      targetId: newRole.id,
      targetName: newRole.name,
      ipAddress: '118.70.124.9',
      status: 'success'
    });

    this.saveData();
    return newRole;
  }

  updateRole(id: string, updates: Partial<SystemRole>): SystemRole | null {
    const idx = this.data.roles.findIndex((r) => r.id === id);
    if (idx === -1) return null;

    const existing = this.data.roles[idx];
    const updated: SystemRole = {
      ...existing,
      ...updates,
      updatedAt: '2026-09-21'
    };
    this.data.roles[idx] = updated;

    this.addAuditLog({
      userId: 'usr-01',
      userCode: 'AMIS-0001',
      userName: 'Trịnh Văn Cường',
      roleName: 'Quản trị viên Toàn quyền',
      module: 'admin_rbac',
      action: 'PERM_CHANGE',
      description: `Cập nhật cấu hình phân quyền cho vai trò: ${updated.name}`,
      targetId: updated.id,
      targetName: updated.name,
      ipAddress: '118.70.124.9',
      status: 'success'
    });

    this.saveData();
    return updated;
  }

  deleteRole(id: string): boolean {
    const role = this.data.roles.find((r) => r.id === id);
    if (!role || role.isSystem) return false; // Không được xóa vai trò hệ thống

    this.data.roles = this.data.roles.filter((r) => r.id !== id);

    this.addAuditLog({
      userId: 'usr-01',
      userCode: 'AMIS-0001',
      userName: 'Trịnh Văn Cường',
      roleName: 'Quản trị viên Toàn quyền',
      module: 'admin_rbac',
      action: 'DELETE',
      description: `Xóa vai trò phân quyền tùy biến: ${role.name}`,
      targetId: role.id,
      targetName: role.name,
      ipAddress: '118.70.124.9',
      status: 'success'
    });

    this.saveData();
    return true;
  }

  getUserAccounts(params?: { search?: string; roleId?: string; status?: string }): UserAccount[] {
    let users = this.data.userAccounts;
    if (params?.roleId && params.roleId !== 'all') {
      users = users.filter((u) => u.roleId === params.roleId);
    }
    if (params?.status && params.status !== 'all') {
      users = users.filter((u) => u.status === params.status);
    }
    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      users = users.filter(
        (u) =>
          u.fullName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q) ||
          u.employeeCode.toLowerCase().includes(q)
      );
    }
    return users;
  }

  createUserAccount(accountData: {
    fullName: string;
    email: string;
    username: string;
    password?: string;
    roleId: string;
    employeeId?: string;
    departmentName?: string;
    positionTitle?: string;
    status?: 'active' | 'locked';
  }): UserAccount {
    const existing = this.data.userAccounts.find(
      (u) =>
        u.username.toLowerCase() === accountData.username.toLowerCase().trim() ||
        u.email.toLowerCase() === accountData.email.toLowerCase().trim()
    );
    if (existing) {
      throw new Error('Tên đăng nhập hoặc Email này đã tồn tại trong hệ thống');
    }

    const role = this.data.roles.find((r) => r.id === accountData.roleId) || this.data.roles[0];
    const id = `usr-${Date.now().toString().slice(-6)}`;

    let empCode = 'AMIS-EXT';
    let deptName = accountData.departmentName || 'Hệ thống';
    let posTitle = accountData.positionTitle || 'Quản trị viên';

    if (accountData.employeeId) {
      const emp = this.data.employees.find((e) => e.id === accountData.employeeId);
      if (emp) {
        empCode = emp.code;
        deptName = emp.departmentName;
        posTitle = emp.positionTitle;
      }
    }

    const newUser: UserAccount = {
      id,
      employeeId: accountData.employeeId || id,
      employeeCode: empCode,
      fullName: accountData.fullName,
      email: accountData.email,
      username: accountData.username.toLowerCase().trim(),
      password: accountData.password || 'Amis@123456',
      departmentName: deptName,
      positionTitle: posTitle,
      roleId: role.id,
      roleName: role.name,
      roleCode: role.code,
      status: accountData.status || 'active',
      twoFactorEnabled: false,
      createdAt: '2026-09-21'
    };

    this.data.userAccounts.unshift(newUser);
    role.userCount = (role.userCount || 0) + 1;

    this.addAuditLog({
      userId: 'usr-01',
      userCode: 'AMIS-0001',
      userName: 'Trịnh Văn Cường',
      roleName: 'Quản trị viên Toàn quyền',
      module: 'admin_rbac',
      action: 'CREATE',
      description: `Khởi tạo tài khoản người dùng mới: ${newUser.fullName} (${newUser.username}) - Gán vai trò ${role.name}`,
      targetId: newUser.id,
      targetName: newUser.fullName,
      ipAddress: '118.70.124.9',
      status: 'success'
    });

    this.saveData();
    return newUser;
  }

  deleteUserAccount(userId: string): boolean {
    const idx = this.data.userAccounts.findIndex((u) => u.id === userId);
    if (idx === -1) return false;

    const user = this.data.userAccounts[idx];
    if (user.roleCode === 'ROLE_SUPER_ADMIN') {
      throw new Error('Không thể xóa tài khoản Quản trị viên cấp cao nhất');
    }

    this.data.userAccounts.splice(idx, 1);
    const role = this.data.roles.find((r) => r.id === user.roleId);
    if (role && role.userCount > 0) {
      role.userCount -= 1;
    }

    this.addAuditLog({
      userId: 'usr-01',
      userCode: 'AMIS-0001',
      userName: 'Trịnh Văn Cường',
      roleName: 'Quản trị viên Toàn quyền',
      module: 'admin_rbac',
      action: 'DELETE',
      description: `Xóa tài khoản người dùng: ${user.fullName} (${user.username})`,
      targetId: user.id,
      targetName: user.fullName,
      ipAddress: '118.70.124.9',
      status: 'success'
    });

    this.saveData();
    return true;
  }

  updateUserStatus(id: string, status: 'active' | 'locked'): UserAccount | null {
    const user = this.data.userAccounts.find((u) => u.id === id);
    if (!user) return null;

    user.status = status;

    this.addAuditLog({
      userId: 'usr-01',
      userCode: 'AMIS-0001',
      userName: 'Trịnh Văn Cường',
      roleName: 'Quản trị viên Toàn quyền',
      module: 'admin_rbac',
      action: 'UPDATE',
      description: `${status === 'locked' ? 'Khóa' : 'Mở khóa'} tài khoản người dùng: ${user.fullName}`,
      targetId: user.id,
      targetName: user.fullName,
      ipAddress: '118.70.124.9',
      status: 'success'
    });

    this.saveData();
    return user;
  }

  assignUserRole(userId: string, roleId: string): UserAccount | null {
    const user = this.data.userAccounts.find((u) => u.id === userId);
    const role = this.data.roles.find((r) => r.id === roleId);
    if (!user || !role) return null;

    user.roleId = role.id;
    user.roleName = role.name;
    user.roleCode = role.code;

    // Recalculate userCount
    this.data.roles.forEach((r) => {
      r.userCount = this.data.userAccounts.filter((u) => u.roleId === r.id).length;
    });

    this.addAuditLog({
      userId: 'usr-01',
      userCode: 'AMIS-0001',
      userName: 'Trịnh Văn Cường',
      roleName: 'Quản trị viên Toàn quyền',
      module: 'admin_rbac',
      action: 'PERM_CHANGE',
      description: `Điều chỉnh vai trò cho ${user.fullName} sang: ${role.name}`,
      targetId: user.id,
      targetName: user.fullName,
      ipAddress: '118.70.124.9',
      status: 'success'
    });

    this.saveData();
    return user;
  }

  resetUserPassword(userId: string): { tempPassword: string; message: string } | null {
    const user = this.data.userAccounts.find((u) => u.id === userId);
    if (!user) return null;

    const tempPassword = `Amis@${Math.floor(100000 + Math.random() * 900000)}`;

    this.addAuditLog({
      userId: 'usr-01',
      userCode: 'AMIS-0001',
      userName: 'Trịnh Văn Cường',
      roleName: 'Quản trị viên Toàn quyền',
      module: 'admin_rbac',
      action: 'UPDATE',
      description: `Yêu cầu cấp lại mật khẩu tạm thời cho tài khoản ${user.username}`,
      targetId: user.id,
      targetName: user.fullName,
      ipAddress: '118.70.124.9',
      status: 'success'
    });

    return {
      tempPassword,
      message: `Đã cấp mật khẩu tạm thời mới cho ${user.fullName} (${user.email})`
    };
  }

  getAuditLogs(params?: { module?: string; action?: string; search?: string }): AuditLog[] {
    let logs = this.data.auditLogs;
    if (params?.module && params.module !== 'all') {
      logs = logs.filter((l) => l.module === params.module);
    }
    if (params?.action && params.action !== 'all') {
      logs = logs.filter((l) => l.action === params.action);
    }
    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      logs = logs.filter(
        (l) =>
          l.userName.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          (l.targetName && l.targetName.toLowerCase().includes(q))
      );
    }
    return logs;
  }

  addAuditLog(logData: Omit<AuditLog, 'id' | 'timestamp'>): AuditLog {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    const newLog: AuditLog = {
      ...logData,
      id: `log-${Date.now().toString().slice(-6)}`,
      timestamp: `2026-09-21 ${timeStr}`
    };
    this.data.auditLogs.unshift(newLog);
    // Keep max 200 logs
    if (this.data.auditLogs.length > 200) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 200);
    }
    return newLog;
  }

  getSecuritySettings(): SecuritySetting {
    return this.data.securitySettings;
  }

  updateSecuritySettings(updates: Partial<SecuritySetting>): SecuritySetting {
    this.data.securitySettings = { ...this.data.securitySettings, ...updates };

    this.addAuditLog({
      userId: 'usr-01',
      userCode: 'AMIS-0001',
      userName: 'Trịnh Văn Cường',
      roleName: 'Quản trị viên Toàn quyền',
      module: 'admin_rbac',
      action: 'UPDATE',
      description: 'Cập nhật chính sách an toàn thông tin & bảo mật hệ thống',
      ipAddress: '118.70.124.9',
      status: 'success'
    });

    this.saveData();
    return this.data.securitySettings;
  }

  // ========================================================
  // CRM RECRUITMENT & CANDIDATE INTAKE PIPELINE METHODS
  // ========================================================

  getCrmCandidates(): CrmCandidate[] {
    return this.data.crmCandidates || [];
  }

  createCrmCandidate(candData: Partial<CrmCandidate>): CrmCandidate {
    const id = `cand-${Date.now().toString().slice(-6)}`;
    const newCand: CrmCandidate = {
      id,
      candidateCode: candData.candidateCode || `CRM-2026-${Math.floor(100 + Math.random() * 900)}`,
      fullName: candData.fullName || 'Ứng viên mới',
      email: candData.email || '',
      phone: candData.phone || '',
      positionId: candData.positionId || 'pos-03',
      positionTitle: candData.positionTitle || 'Chuyên viên',
      departmentId: candData.departmentId || 'dept-02',
      departmentName: candData.departmentName || 'Khối Công Nghệ',
      expectedSalary: candData.expectedSalary || 15000000,
      offerSalary: candData.offerSalary || 16000000,
      onboardingDate: candData.onboardingDate || '2026-10-01',
      status: candData.status || 'offer_accepted',
      source: candData.source || 'CRM Talent Pool',
      notes: candData.notes || '',
      createdAt: '2026-09-21'
    };

    if (!this.data.crmCandidates) this.data.crmCandidates = [];
    this.data.crmCandidates.unshift(newCand);

    this.addAuditLog({
      userId: 'usr-01',
      userCode: 'AMIS-0001',
      userName: 'Trịnh Văn Cường',
      roleName: 'Quản trị viên Toàn quyền',
      module: 'employees',
      action: 'CREATE',
      description: `Tiếp nhận hồ sơ ứng viên từ CRM Tuyển dụng: ${newCand.fullName} (${newCand.candidateCode})`,
      targetId: newCand.id,
      targetName: newCand.fullName,
      ipAddress: '118.70.124.9',
      status: 'success'
    });

    this.saveData();
    return newCand;
  }

  convertCandidateToEmployee(candidateId: string, overrides?: any) {
    const cand = (this.data.crmCandidates || []).find((c) => c.id === candidateId);
    if (!cand) {
      throw new Error('Không tìm thấy ứng viên trong CRM Pipeline');
    }

    const dept = this.data.departments.find((d) => d.id === cand.departmentId) || this.data.departments[0];
    const pos = this.data.positions.find((p) => p.id === cand.positionId) || this.data.positions[0];

    const employeePayload: Omit<Employee, 'id'> = {
      code: overrides?.code || `AMIS-${String(this.data.employees.length + 1).padStart(4, '0')}`,
      fullName: overrides?.fullName || cand.fullName,
      gender: overrides?.gender || 'Nam',
      dob: overrides?.dob || '1996-05-15',
      idCard: overrides?.idCard || '001096001234',
      idCardDate: overrides?.idCardDate || '2022-01-01',
      idCardPlace: overrides?.idCardPlace || 'Cục Cảnh sát QLHC về TTXH',
      phone: overrides?.phone || cand.phone,
      email: overrides?.email || cand.email,
      address: overrides?.address || 'Hà Nội, Việt Nam',
      hometown: overrides?.hometown || 'Hà Nội',
      education: overrides?.education || 'Đại học',
      departmentId: dept.id,
      departmentName: dept.name,
      positionId: pos.id,
      positionTitle: pos.title,
      joinDate: cand.onboardingDate || '2026-10-01',
      contractType: overrides?.contractType || 'Hợp đồng thử việc 02 tháng',
      contractStartDate: cand.onboardingDate || '2026-10-01',
      contractEndDate: overrides?.contractEndDate || '2026-12-01',
      status: 'probation',
      bankAccount: overrides?.bankAccount || { bankName: 'Vietcombank', accountNumber: '1012345678', branch: 'Sở Giao Dịch' },
      salary: {
        baseSalary: cand.offerSalary || 18000000,
        allowanceResponsibility: 1000000,
        allowanceLunch: 730000,
        allowanceGas: 500000,
        dependents: 0,
        taxCode: '',
        insuranceBookNumber: ''
      }
    };

    const newEmp = this.createEmployee(employeePayload, {
      createUserAccount: true,
      roleId: 'role-employee',
      username: cand.email.split('@')[0],
      password: 'Amis@123456',
      autoRoster: true
    });

    cand.status = 'converted_to_employee';
    this.saveData();

    return newEmp;
  }

  // ========================================================
  // AUTHENTICATION & LOGIN ENGINE
  // ========================================================

  authenticateUser(usernameOrEmail: string, password?: string) {
    const q = usernameOrEmail.trim().toLowerCase();
    const user = this.data.userAccounts.find(
      (u) => u.username.toLowerCase() === q || u.email.toLowerCase() === q
    );

    if (!user) return null;

    if (user.status === 'locked') {
      throw new Error('Tài khoản này đã bị tạm khóa do chính sách bảo mật. Vui lòng liên hệ Quản trị viên để mở khóa.');
    }

    const expectedPassword = user.password || 'Amis@123456';
    if (password && password !== expectedPassword) {
      throw new Error('Mật khẩu không chính xác');
    }

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    user.lastLogin = `2026-09-21 ${timeStr}`;
    user.lastIp = '118.70.124.9';

    const role = this.data.roles.find((r) => r.id === user.roleId) || this.data.roles[0];

    this.addAuditLog({
      userId: user.id,
      userCode: user.employeeCode,
      userName: user.fullName,
      roleName: user.roleName,
      module: 'admin_rbac',
      action: 'LOGIN',
      description: `Đăng nhập thành công vào hệ thống AMIS HRM`,
      ipAddress: '118.70.124.9',
      status: 'success'
    });

    this.saveData();

    return {
      user,
      role,
      permissions: role.permissions
    };
  }

  // Dashboard Stats
  getDashboardStats() {
    const totalEmployees = this.data.employees.length;
    const activeEmployees = this.data.employees.filter((e) => e.status === 'active').length;
    const probationEmployees = this.data.employees.filter((e) => e.status === 'probation').length;
    
    // Attendance stats for today
    const today = '2026-09-21';
    const todayAtt = this.data.attendance.filter((a) => a.date === today);
    const presentCount = todayAtt.filter((a) => a.status === 'present').length;
    const lateCount = todayAtt.filter((a) => a.status === 'late').length;
    const leaveCount = todayAtt.filter((a) => a.status === 'leave').length;

    // Pending requests
    const pendingLeaves = this.data.leaves.filter((l) => l.status === 'pending').length;

    // Total monthly payroll
    const totalPayroll = this.data.payroll.reduce((sum, p) => sum + p.netSalary, 0);

    // Upcoming birthdays in September & October
    const upcomingBirthdays = this.data.employees.filter((e) => {
      const month = e.dob.split('-')[1];
      return month === '09' || month === '10';
    }).map(e => ({
      id: e.id,
      fullName: e.fullName,
      dob: e.dob,
      departmentName: e.departmentName,
      positionTitle: e.positionTitle
    }));

    // Contracts expiring soon (within next 3 months or probation ending)
    const expiringContracts = this.data.employees.filter((e) => {
      return e.contractEndDate && (e.contractEndDate.startsWith('2024') || e.status === 'probation');
    }).map(e => ({
      id: e.id,
      fullName: e.fullName,
      contractType: e.contractType,
      contractEndDate: e.contractEndDate,
      departmentName: e.departmentName
    }));

    // Department distribution
    const departmentDistribution = this.data.departments.map((d) => ({
      id: d.id,
      name: d.name,
      code: d.code,
      count: this.data.employees.filter((e) => e.departmentId === d.id).length
    }));

    return {
      totalEmployees,
      activeEmployees,
      probationEmployees,
      attendanceToday: {
        total: totalEmployees,
        present: presentCount,
        late: lateCount,
        onLeave: leaveCount,
        attendanceRate: totalEmployees ? Math.round(((presentCount + lateCount) / totalEmployees) * 100) : 0
      },
      pendingLeaves,
      totalPayroll,
      upcomingBirthdays,
      expiringContracts,
      departmentDistribution
    };
  }
}

export const db = new DatabaseStore();
