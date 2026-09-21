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
  DayTimesheetCell
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
      geofenceLocations: initialGeofenceLocations
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

  createEmployee(employeeData: Omit<Employee, 'id'>) {
    const id = `emp-${Date.now().toString().slice(-6)}`;
    const newEmployee: Employee = {
      ...employeeData,
      id,
      code: employeeData.code || `AMIS-${String(this.data.employees.length + 1).padStart(4, '0')}`
    };
    this.data.employees.unshift(newEmployee);
    
    // Also generate payroll row for current period
    const newPayroll = calculateVietnamesePayroll(newEmployee, 22, 0);
    this.data.payroll.unshift(newPayroll);

    // Update department count
    const dept = this.data.departments.find(d => d.id === newEmployee.departmentId);
    if (dept) {
      dept.employeeCount += 1;
    }

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
