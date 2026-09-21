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

export interface ContractItem {
  id: string;
  contractNumber: string;
  contractType: string;
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
  decisionNumber: string;
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
  bankAccount: BankAccount;
  salary: EmployeeSalary;
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

export type UserRole = 'admin' | 'manager' | 'employee' | string;

// ADVANCED SHIFT & ATTENDANCE MODULE TYPES
export interface ShiftDefinition {
  id: string;
  code: string;
  name: string;
  startTime: string;
  endTime: string;
  breakStartTime: string;
  breakEndTime: string;
  workHours: number;
  coefficient: number;
  color: string;
  description: string;
}

export interface DayTimesheetCell {
  day: number;
  date: string;
  status: 'X' | 'P' | 'L' | 'KP' | 'OFF' | 'OT' | 'CT';
  workHours: number;
  checkIn?: string;
  checkOut?: string;
  lateMinutes?: number;
  shiftCode: string;
  notes?: string;
}

export interface MonthlyTimesheetEmployee {
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  departmentName: string;
  positionTitle: string;
  period: string;
  days: { [day: number]: DayTimesheetCell };
  totalWorkDays: number;
  totalPaidLeaves: number;
  totalUnpaidLeaves: number;
  totalLateTimes: number;
  totalLateMinutes: number;
  totalOTHours: number;
}

export interface ShiftSwapRequest {
  id: string;
  code: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  targetEmployeeId: string;
  targetEmployeeName: string;
  targetEmployeeCode: string;
  swapDate: string;
  fromShiftCode: string;
  fromShiftName: string;
  toShiftCode: string;
  toShiftName: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approverName?: string;
  createdAt: string;
  reviewedAt?: string;
}

export interface AttendanceRegularization {
  id: string;
  code: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  departmentName: string;
  date: string;
  type: 'forgot_checkin' | 'forgot_checkout' | 'system_error' | 'client_meeting';
  suggestedCheckIn?: string;
  suggestedCheckOut?: string;
  reason: string;
  attachmentName?: string;
  status: 'pending' | 'approved' | 'rejected';
  approverName?: string;
  createdAt: string;
  reviewedAt?: string;
}

export interface GeofenceLocation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  allowedWifiBSSID: string[];
  isActive: boolean;
}

// ENTERPRISE EXTENSIONS: ROSTERING, RAW BIOMETRICS, POLICY & ANALYTICS
export interface DayRosterSchedule {
  shiftId: string;
  shiftCode: string; // 'CA-HC' | 'CA-S' | 'CA-C' | 'CA-DEM' | 'OFF'
  shiftName: string;
  isCustom?: boolean;
  notes?: string;
}

export interface ShiftRosterEntry {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  departmentName: string;
  period: string; // "2026-09"
  schedules: { [day: number]: DayRosterSchedule };
}

export interface RawPunchLog {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  departmentName: string;
  timestamp: string; // "2026-09-21 07:54:12"
  punchDate: string; // "2026-09-21"
  punchTime: string; // "07:54:12"
  source: 'fingerprint' | 'face_id' | 'mobile_gps' | 'web';
  deviceName: string; // "Ronald Jack RJ-8800 (Tầng 9 HQ)" | "Hikvision FaceID DS-K1T671" | "AMIS Mobile App GPS"
  deviceIp?: string;
  accuracyScore?: number; // e.g. 99.2%
  pairingStatus: 'paired' | 'unpaired' | 'ignored';
  pairingType?: 'check_in' | 'check_out';
}

export interface FaceBiometricProfile {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  departmentName: string;
  status: 'enrolled' | 'pending' | 'rejected';
  enrolledAt: string;
  enrolledBy: string;
  featuresHash: string;
  photoThumbnail?: string;
  confidenceScore: number;
  anglesCaptured: {
    frontal: boolean;
    left: boolean;
    right: boolean;
  };
}

export interface AttendancePolicySetting {
  gracePeriodMinutes: number; // e.g. 15 phút đầu giờ được phép đến muộn không phạt
  earlyLeaveMinutes?: number; // e.g. 15 phút về sớm
  maxLatePerMonth?: number; // e.g. 3 lần / tháng
  latePenaltyAmount?: number; // e.g. 50000 đ
  halfDayMinHours: number; // 4.0h
  fullDayMinHours: number; // 7.0h
  overtimeMinMinutes: number; // 30 phút sau ca
  maxContinuousDays: number; // 6 ngày liên tục trước ngày nghỉ tuần
  minRestHoursBetweenShifts: number; // 12 giờ nghỉ ngơi giữa 2 ca theo Điều 110 BLLĐ 2019
  requireGps?: boolean;
  gpsRadiusMeters?: number;
  requireWifi?: boolean;
  livenessLevel?: 'standard' | 'strict' | 'maximum';
  facialRecognitionEnabled?: boolean;
}

export interface LateLeaderboardItem {
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  departmentName: string;
  lateTimes: number;
  totalLateMinutes: number;
  severity: 'normal' | 'warning' | 'penalty'; // penalty: trừ chuyên cần
}

export interface AttendanceAnalytics {
  totalEmployees: number;
  overallAttendanceRate: number;
  totalWorkHours: number;
  totalOTHours: number;
  departmentRates: { departmentName: string; rate: number; count: number }[];
  lateLeaderboard: LateLeaderboardItem[];
}

// ENTERPRISE RBAC & ADMIN SYSTEM MANAGEMENT
export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'export';

export interface ModulePermissions {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  approve: boolean;
  export: boolean;
}

export interface PermissionMatrix {
  dashboard: ModulePermissions;
  employees: ModulePermissions;
  attendance: ModulePermissions;
  leaves: ModulePermissions;
  payroll: ModulePermissions;
  organization: ModulePermissions;
  admin_rbac: ModulePermissions;
  settings: ModulePermissions;
}

export interface SystemRole {
  id: string;
  code: string;
  name: string;
  description: string;
  isSystem: boolean;
  userCount: number;
  color: string;
  dataScope: 'all' | 'department' | 'branch' | 'self';
  permissions: PermissionMatrix;
  createdAt: string;
  updatedAt: string;
}

export interface UserAccount {
  id: string;
  employeeId: string;
  employeeCode: string;
  fullName: string;
  email: string;
  username: string;
  password?: string;
  avatar?: string;
  departmentName: string;
  positionTitle: string;
  roleId: string;
  roleName: string;
  roleCode: string;
  status: 'active' | 'locked' | 'pending_activation';
  lastLogin?: string;
  lastIp?: string;
  twoFactorEnabled: boolean;
  createdAt: string;
}

export interface CrmCandidate {
  id: string;
  candidateCode: string;
  fullName: string;
  email: string;
  phone: string;
  positionId: string;
  positionTitle: string;
  departmentId: string;
  departmentName: string;
  expectedSalary: number;
  offerSalary: number;
  onboardingDate: string;
  status: 'offer_accepted' | 'onboarding_in_progress' | 'converted_to_employee' | 'rejected';
  source: string;
  notes?: string;
  createdAt: string;
}

export interface OnboardingTask {
  id: string;
  employeeId: string;
  title: string;
  category: 'profile' | 'contract' | 'asset' | 'account' | 'training';
  assignedTo: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
  completedAt?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userCode: string;
  userName: string;
  roleName: string;
  module: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT' | 'EXPORT' | 'LOGIN' | 'PERM_CHANGE';
  description: string;
  targetId?: string;
  targetName?: string;
  ipAddress: string;
  status: 'success' | 'failed';
}

export interface SecuritySetting {
  passwordMinLength: number;
  requireSpecialChar: boolean;
  sessionTimeoutMinutes: number;
  maxFailedLoginAttempts: number;
  enforce2FA: boolean;
  allowedIpWhitelist: string[];
}


