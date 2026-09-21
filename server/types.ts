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

export interface ContractItem {
  id: string;
  contractNumber: string; // e.g. "HĐLĐ-2023/MISA-01"
  contractType: string; // "Hợp đồng thử việc", "Hợp đồng xác định thời hạn 12 tháng", "Hợp đồng xác định thời hạn 36 tháng", "Không xác định thời hạn"
  signDate: string;
  startDate: string;
  endDate?: string;
  signerName: string;
  signerTitle: string;
  salaryInsurance: number;
  status: 'active' | 'expired' | 'renewed';
  notes?: string;
}

export interface WorkHistoryItem {
  id: string;
  decisionNumber: string; // e.g. "QĐ-2022/045"
  effectiveDate: string;
  type: 'appointment' | 'promotion' | 'transfer' | 'salary_raise' | 'probation_pass';
  title: string;
  departmentName: string;
  positionTitle: string;
  salaryBefore?: number;
  salaryAfter?: number;
  signDate: string;
  notes?: string;
}

export interface RewardDisciplineItem {
  id: string;
  decisionNumber: string;
  date: string;
  type: 'reward' | 'discipline';
  title: string;
  reason: string;
  amount?: number;
  signBy: string;
}

export interface DependentItem {
  id: string;
  fullName: string;
  relationship: 'Con cái' | 'Vợ/Chồng' | 'Cha mẹ ruột' | 'Cha mẹ vợ/chồng' | 'Người giám hộ';
  dob: string;
  idCardOrBirthCert: string;
  taxCode?: string;
  deductionStart: string;
  deductionEnd?: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  category: 'CCCD' | 'Bằng cấp' | 'Hợp đồng scan' | 'Chứng chỉ' | 'Khác';
  fileSize: string;
  uploadDate: string;
  fileType: string;
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
  bankAccount: {
    bankName: string;
    accountNumber: string;
    branch: string;
  };
  salary: {
    baseSalary: number;
    allowanceResponsibility: number;
    allowanceLunch: number;
    allowanceGas: number;
    dependents: number;
    taxCode: string;
    insuranceBookNumber: string;
  };
  // Detailed lifecycle collections
  contracts?: ContractItem[];
  workHistory?: WorkHistoryItem[];
  rewardsDisciplines?: RewardDisciplineItem[];
  dependentsList?: DependentItem[];
  documents?: DocumentItem[];
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
  duration: number; // days or hours
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
  period: string; // e.g. "2026-09"
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
  bhxh: number; // 8%
  bhyt: number; // 1.5%
  bhtn: number; // 1%
  totalInsurance: number; // 10.5%
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
