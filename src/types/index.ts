export interface Department {
  id: string;
  code: string;
  name: string;
  managerId: string;
  managerName: string;
  employeeCount: number;
  description: string;
}

export interface Position {
  id: string;
  code: string;
  title: string;
  departmentId: string;
  level: string;
}

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  branch: string;
}

export interface EmployeeSalary {
  baseSalary: number;
  allowanceResponsibility: number;
  allowanceLunch: number;
  allowanceGas: number;
  dependents: number;
  taxCode: string;
  insuranceBookNumber: string;
}

export interface Employee {
  id: string;
  code: string;
  fullName: string;
  avatar?: string;
  gender: 'Nam' | 'Nữ';
  dob: string;
  idCard: string;
  idCardDate: string;
  idCardPlace: string;
  phone: string;
  email: string;
  address: string;
  hometown: string;
  education: string;
  departmentId: string;
  departmentName: string;
  positionId: string;
  positionTitle: string;
  joinDate: string;
  contractType: string;
  contractStartDate: string;
  contractEndDate?: string;
  status: 'active' | 'probation' | 'leave' | 'resigned';
  managerId?: string;
  bankAccount: BankAccount;
  salary: EmployeeSalary;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  departmentName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  workHours: number;
  status: 'present' | 'late' | 'early' | 'leave' | 'unpaid' | 'holiday';
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  code: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  departmentName: string;
  positionTitle: string;
  type: 'annual' | 'sick' | 'maternity' | 'unpaid' | 'overtime' | 'late_early';
  startDate: string;
  endDate: string;
  duration: number;
  unit: 'ngày' | 'giờ';
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approverId: string;
  approverName: string;
  createdAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

export interface PayrollRecord {
  id: string;
  period: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  departmentName: string;
  positionTitle: string;
  standardWorkDays: number;
  actualWorkDays: number;
  paidLeaveDays: number;
  baseSalary: number;
  allowanceTotal: number;
  otPay: number;
  grossSalary: number;
  bhxh: number;
  bhyt: number;
  bhtn: number;
  totalInsurance: number;
  dependents: number;
  dependentDeduction: number;
  personalDeduction: number;
  taxableIncome: number;
  personalIncomeTax: number;
  bonus: number;
  deductionsOther: number;
  netSalary: number;
  status: 'draft' | 'approved' | 'paid';
  paidDate?: string;
}

export interface CompanySetting {
  companyName: string;
  taxCode: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  workingDaysPerMonth: number;
  workStartTime: string;
  workEndTime: string;
  lunchBreakStart: string;
  lunchBreakEnd: string;
  bhxhRate: number;
  bhytRate: number;
  bhtnRate: number;
  personalDeduction: number;
  dependentDeduction: number;
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  probationEmployees: number;
  attendanceToday: {
    total: number;
    present: number;
    late: number;
    onLeave: number;
    attendanceRate: number;
  };
  pendingLeaves: number;
  totalPayroll: number;
  upcomingBirthdays: Array<{
    id: string;
    fullName: string;
    dob: string;
    departmentName: string;
    positionTitle: string;
  }>;
  expiringContracts: Array<{
    id: string;
    fullName: string;
    contractType: string;
    contractEndDate?: string;
    departmentName: string;
  }>;
  departmentDistribution: Array<{
    id: string;
    name: string;
    code: string;
    count: number;
  }>;
}

export type UserRole = 'admin' | 'manager' | 'employee';
