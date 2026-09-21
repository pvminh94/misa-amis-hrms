import { Department, Position, Employee, AttendanceRecord, LeaveRequest, PayrollRecord, CompanySetting } from '../types';

export const initialDepartments: Department[] = [
  {
    id: 'dept-bgd',
    code: 'BGD',
    name: 'Ban Giám Đốc',
    managerId: 'emp-01',
    managerName: 'Trịnh Văn Cường',
    employeeCount: 2,
    description: 'Điều hành chiến lược toàn công ty'
  },
  {
    id: 'dept-it',
    code: 'TECH',
    name: 'Khối Công Nghệ & Kỹ Thuật',
    managerId: 'emp-02',
    managerName: 'Vũ Quốc Thái',
    employeeCount: 7,
    description: 'Nghiên cứu, phát triển sản phẩm phần mềm SaaS HRM'
  },
  {
    id: 'dept-sales',
    code: 'SALES',
    name: 'Khối Kinh Doanh & Tiếp Thị',
    managerId: 'emp-03',
    managerName: 'Nguyễn Thị Thu Hằng',
    employeeCount: 5,
    description: 'Phát triển thị trường B2B doanh nghiệp và chăm sóc khách hàng'
  },
  {
    id: 'dept-hr',
    code: 'HR-ADMIN',
    name: 'Khối Nhân Sự & Vận Hành',
    managerId: 'emp-04',
    managerName: 'Đặng Mai Lan',
    employeeCount: 3,
    description: 'Quản trị nhân lực, tuyển dụng, đào tạo & C&B'
  },
  {
    id: 'dept-acc',
    code: 'FIN-ACC',
    name: 'Phòng Tài Chính - Kế Toán',
    managerId: 'emp-05',
    managerName: 'Hoàng Minh Đức',
    employeeCount: 3,
    description: 'Quản lý tài chính, hạch toán kế toán và chi trả lương'
  }
];

export const initialPositions: Position[] = [
  { id: 'pos-01', code: 'CEO', title: 'Tổng Giám Đốc', departmentId: 'dept-bgd', level: 'Director' },
  { id: 'pos-02', code: 'CTO', title: 'Phó Tổng Giám Đốc Kỹ Thuật', departmentId: 'dept-bgd', level: 'Director' },
  { id: 'pos-03', code: 'ENG-LEAD', title: 'Trưởng Khối Công Nghệ', departmentId: 'dept-it', level: 'Manager' },
  { id: 'pos-04', code: 'SR-FULLSTACK', title: 'Kỹ sư Fullstack Cao cấp', departmentId: 'dept-it', level: 'Senior' },
  { id: 'pos-05', code: 'FE-DEV', title: 'Lập trình viên Frontend (React)', departmentId: 'dept-it', level: 'Middle' },
  { id: 'pos-06', code: 'BE-DEV', title: 'Lập trình viên Backend (Node/Go)', departmentId: 'dept-it', level: 'Middle' },
  { id: 'pos-07', code: 'QA-LEAD', title: 'Trưởng nhóm Kiểm thử QA/QC', departmentId: 'dept-it', level: 'Leader' },
  { id: 'pos-08', code: 'SALES-DIR', title: 'Giám Đốc Kinh Doanh', departmentId: 'dept-sales', level: 'Director' },
  { id: 'pos-09', code: 'B2B-ACC', title: 'Chuyên viên Kinh doanh B2B', departmentId: 'dept-sales', level: 'Senior' },
  { id: 'pos-10', code: 'MKT-LEAD', title: 'Trưởng nhóm Digital Marketing', departmentId: 'dept-sales', level: 'Leader' },
  { id: 'pos-11', code: 'HR-MGR', title: 'Trưởng phòng Nhân sự', departmentId: 'dept-hr', level: 'Manager' },
  { id: 'pos-12', code: 'CB-SPEC', title: 'Chuyên viên C&B (Lương & Thưởng)', departmentId: 'dept-hr', level: 'Senior' },
  { id: 'pos-13', code: 'REC-SPEC', title: 'Chuyên viên Tuyển dụng & Đào tạo', departmentId: 'dept-hr', level: 'Middle' },
  { id: 'pos-14', code: 'CHIEF-ACC', title: 'Kế toán trưởng', departmentId: 'dept-acc', level: 'Manager' },
  { id: 'pos-15', code: 'GEN-ACC', title: 'Kế toán tổng hợp', departmentId: 'dept-acc', level: 'Senior' }
];

export const initialEmployees: Employee[] = [
  {
    id: 'emp-01',
    code: 'MISA-0001',
    fullName: 'Trịnh Văn Cường',
    gender: 'Nam',
    dob: '1982-08-15',
    idCard: '001082001234',
    idCardDate: '2021-05-12',
    idCardPlace: 'Cục Cảnh sát QLHC về TTXH',
    phone: '0912345678',
    email: 'cuongtv@misa.vn',
    address: 'Số 45, Hoàng Quốc Việt, Cầu Giấy, Hà Nội',
    hometown: 'Hà Nội',
    education: 'Thạc sĩ Quản trị Kinh doanh (MBA) - ĐH Kinh Tế Quốc Dân',
    departmentId: 'dept-bgd',
    departmentName: 'Ban Giám Đốc',
    positionId: 'pos-01',
    positionTitle: 'Tổng Giám Đốc',
    joinDate: '2016-03-01',
    contractType: 'Không xác định thời hạn',
    contractStartDate: '2016-03-01',
    status: 'active',
    bankAccount: {
      bankName: 'MB Bank',
      accountNumber: '999908158888',
      branch: 'Hà Nội'
    },
    salary: {
      baseSalary: 65000000,
      allowanceResponsibility: 15000000,
      allowanceLunch: 1500000,
      allowanceGas: 3000000,
      dependents: 2,
      taxCode: '8091234567',
      insuranceBookNumber: '7912345678'
    }
  },
  {
    id: 'emp-02',
    code: 'MISA-0002',
    fullName: 'Vũ Quốc Thái',
    gender: 'Nam',
    dob: '1988-11-20',
    idCard: '001088005678',
    idCardDate: '2021-08-20',
    idCardPlace: 'Cục Cảnh sát QLHC về TTXH',
    phone: '0988776655',
    email: 'thaivq@misa.vn',
    address: 'KĐT Vinhomes Smart City, Nam Từ Liêm, Hà Nội',
    hometown: 'Nam Định',
    education: 'Kỹ sư CNTT - Đại học Bách Khoa Hà Nội',
    departmentId: 'dept-bgd',
    departmentName: 'Ban Giám Đốc',
    positionId: 'pos-02',
    positionTitle: 'Phó Tổng Giám Đốc Kỹ Thuật',
    joinDate: '2017-06-15',
    contractType: 'Không xác định thời hạn',
    contractStartDate: '2017-06-15',
    status: 'active',
    bankAccount: {
      bankName: 'Techcombank',
      accountNumber: '19033458899012',
      branch: 'Cầu Giấy'
    },
    salary: {
      baseSalary: 55000000,
      allowanceResponsibility: 10000000,
      allowanceLunch: 1500000,
      allowanceGas: 2500000,
      dependents: 1,
      taxCode: '8091234568',
      insuranceBookNumber: '7912345679'
    }
  },
  {
    id: 'emp-03',
    code: 'MISA-0003',
    fullName: 'Nguyễn Thị Thu Hằng',
    gender: 'Nữ',
    dob: '1990-09-28', // Sinh nhật tháng 9!
    idCard: '001190009876',
    idCardDate: '2022-01-10',
    idCardPlace: 'Cục Cảnh sát QLHC về TTXH',
    phone: '0977112233',
    email: 'hangntt@misa.vn',
    address: '22 Duy Tân, Cầu Giấy, Hà Nội',
    hometown: 'Hải Phòng',
    education: 'Cử nhân Thương Mại Quốc Tế - ĐH Ngoại Thương',
    departmentId: 'dept-sales',
    departmentName: 'Khối Kinh Doanh & Tiếp Thị',
    positionId: 'pos-08',
    positionTitle: 'Giám Đốc Kinh Doanh',
    joinDate: '2018-09-01',
    contractType: 'Không xác định thời hạn',
    contractStartDate: '2018-09-01',
    status: 'active',
    bankAccount: {
      bankName: 'Vietcombank',
      accountNumber: '0011004567890',
      branch: 'Thăng Long'
    },
    salary: {
      baseSalary: 40000000,
      allowanceResponsibility: 8000000,
      allowanceLunch: 1500000,
      allowanceGas: 2500000,
      dependents: 1,
      taxCode: '8091234569',
      insuranceBookNumber: '7912345680'
    }
  },
  {
    id: 'emp-04',
    code: 'MISA-0004',
    fullName: 'Đặng Mai Lan',
    gender: 'Nữ',
    dob: '1992-05-14',
    idCard: '001192003344',
    idCardDate: '2021-11-05',
    idCardPlace: 'Cục Cảnh sát QLHC về TTXH',
    phone: '0966443322',
    email: 'landm@misa.vn',
    address: 'Tòa Sky Park, Tôn Thất Thuyết, Cầu Giấy, Hà Nội',
    hometown: 'Hà Nội',
    education: 'Cử nhân Quản trị Nhân lực - ĐH Kinh Tế Quốc Dân',
    departmentId: 'dept-hr',
    departmentName: 'Khối Nhân Sự & Vận Hành',
    positionId: 'pos-11',
    positionTitle: 'Trưởng phòng Nhân sự',
    joinDate: '2019-02-15',
    contractType: 'Không xác định thời hạn',
    contractStartDate: '2019-02-15',
    status: 'active',
    bankAccount: {
      bankName: 'VietinBank',
      accountNumber: '102874659201',
      branch: 'Đống Đa'
    },
    salary: {
      baseSalary: 32000000,
      allowanceResponsibility: 5000000,
      allowanceLunch: 1500000,
      allowanceGas: 1500000,
      dependents: 1,
      taxCode: '8091234570',
      insuranceBookNumber: '7912345681'
    }
  },
  {
    id: 'emp-05',
    code: 'MISA-0005',
    fullName: 'Hoàng Minh Đức',
    gender: 'Nam',
    dob: '1989-12-03',
    idCard: '001089004455',
    idCardDate: '2022-03-15',
    idCardPlace: 'Cục Cảnh sát QLHC về TTXH',
    phone: '0903456789',
    email: 'duchm@misa.vn',
    address: 'Thanh Xuân, Hà Nội',
    hometown: 'Thái Bình',
    education: 'Cử nhân Tài chính Kế toán - Học Viện Tài Chính',
    departmentId: 'dept-acc',
    departmentName: 'Phòng Tài Chính - Kế Toán',
    positionId: 'pos-14',
    positionTitle: 'Kế toán trưởng',
    joinDate: '2018-04-10',
    contractType: 'Không xác định thời hạn',
    contractStartDate: '2018-04-10',
    status: 'active',
    bankAccount: {
      bankName: 'BIDV',
      accountNumber: '21510001239874',
      branch: 'Cầu Giấy'
    },
    salary: {
      baseSalary: 35000000,
      allowanceResponsibility: 6000000,
      allowanceLunch: 1500000,
      allowanceGas: 1500000,
      dependents: 2,
      taxCode: '8091234571',
      insuranceBookNumber: '7912345682'
    }
  },
  {
    id: 'emp-06',
    code: 'MISA-0006',
    fullName: 'Lê Hoàng Long',
    gender: 'Nam',
    dob: '1994-03-22',
    idCard: '001094002211',
    idCardDate: '2022-04-18',
    idCardPlace: 'Cục Cảnh sát QLHC về TTXH',
    phone: '0983124567',
    email: 'longlh@misa.vn',
    address: 'Khu đô thị Trung Hòa Nhân Chính, Cầu Giấy, Hà Nội',
    hometown: 'Bắc Ninh',
    education: 'Kỹ sư Phần mềm - ĐH Bách Khoa Hà Nội',
    departmentId: 'dept-it',
    departmentName: 'Khối Công Nghệ & Kỹ Thuật',
    positionId: 'pos-04',
    positionTitle: 'Kỹ sư Fullstack Cao cấp',
    joinDate: '2020-07-01',
    contractType: 'Không xác định thời hạn',
    contractStartDate: '2020-07-01',
    status: 'active',
    bankAccount: {
      bankName: 'Techcombank',
      accountNumber: '19034567891234',
      branch: 'Trung Hòa'
    },
    salary: {
      baseSalary: 38000000,
      allowanceResponsibility: 4000000,
      allowanceLunch: 1500000,
      allowanceGas: 1000000,
      dependents: 0,
      taxCode: '8091234572',
      insuranceBookNumber: '7912345683'
    }
  },
  {
    id: 'emp-07',
    code: 'MISA-0007',
    fullName: 'Phạm Thị Hương Ly',
    gender: 'Nữ',
    dob: '1996-09-15', // Sinh nhật tháng 9!
    idCard: '001196008899',
    idCardDate: '2023-02-14',
    idCardPlace: 'Cục Cảnh sát QLHC về TTXH',
    phone: '0978998877',
    email: 'lypth@misa.vn',
    address: 'Chung cư Vinhomes Gardenia, Mỹ Đình, Hà Nội',
    hometown: 'Quảng Ninh',
    education: 'Cử nhân CNTT - Đại học Quốc Gia Hà Nội',
    departmentId: 'dept-it',
    departmentName: 'Khối Công Nghệ & Kỹ Thuật',
    positionId: 'pos-05',
    positionTitle: 'Lập trình viên Frontend (React)',
    joinDate: '2021-10-01',
    contractType: 'Hợp đồng xác định thời hạn 36 tháng',
    contractStartDate: '2021-10-01',
    contractEndDate: '2024-10-01', // Sắp hết hạn hợp đồng!
    status: 'active',
    bankAccount: {
      bankName: 'Vietcombank',
      accountNumber: '0451000345678',
      branch: 'Mỹ Đình'
    },
    salary: {
      baseSalary: 25000000,
      allowanceResponsibility: 2000000,
      allowanceLunch: 1500000,
      allowanceGas: 800000,
      dependents: 0,
      taxCode: '8091234573',
      insuranceBookNumber: '7912345684'
    }
  },
  {
    id: 'emp-08',
    code: 'MISA-0008',
    fullName: 'Trần Gia Bảo',
    gender: 'Nam',
    dob: '1995-07-19',
    idCard: '001095007766',
    idCardDate: '2022-09-09',
    idCardPlace: 'Cục Cảnh sát QLHC về TTXH',
    phone: '0967885544',
    email: 'baotg@misa.vn',
    address: 'Mễ Trì Hạ, Nam Từ Liêm, Hà Nội',
    hometown: 'Nghệ An',
    education: 'Kỹ sư Hệ thống Thông tin - ĐH Bách Khoa Hà Nội',
    departmentId: 'dept-it',
    departmentName: 'Khối Công Nghệ & Kỹ Thuật',
    positionId: 'pos-06',
    positionTitle: 'Lập trình viên Backend (Node/Go)',
    joinDate: '2022-01-15',
    contractType: 'Hợp đồng xác định thời hạn 36 tháng',
    contractStartDate: '2022-01-15',
    contractEndDate: '2025-01-15',
    status: 'active',
    bankAccount: {
      bankName: 'MB Bank',
      accountNumber: '0850123456789',
      branch: 'Nam Từ Liêm'
    },
    salary: {
      baseSalary: 26000000,
      allowanceResponsibility: 2000000,
      allowanceLunch: 1500000,
      allowanceGas: 800000,
      dependents: 1,
      taxCode: '8091234574',
      insuranceBookNumber: '7912345685'
    }
  },
  {
    id: 'emp-09',
    code: 'MISA-0009',
    fullName: 'Bùi Thanh Thảo',
    gender: 'Nữ',
    dob: '1997-10-04',
    idCard: '001197006655',
    idCardDate: '2023-04-10',
    idCardPlace: 'Cục Cảnh sát QLHC về TTXH',
    phone: '0981223344',
    email: 'thaobt@misa.vn',
    address: 'Yên Hòa, Cầu Giấy, Hà Nội',
    hometown: 'Hưng Yên',
    education: 'Cử nhân CNTT - Học Viện Bưu Chính Viễn Thông',
    departmentId: 'dept-it',
    departmentName: 'Khối Công Nghệ & Kỹ Thuật',
    positionId: 'pos-07',
    positionTitle: 'Trưởng nhóm Kiểm thử QA/QC',
    joinDate: '2021-04-01',
    contractType: 'Hợp đồng xác định thời hạn 36 tháng',
    contractStartDate: '2021-04-01',
    contractEndDate: '2024-04-01',
    status: 'active',
    bankAccount: {
      bankName: 'Techcombank',
      accountNumber: '19035678901234',
      branch: 'Cầu Giấy'
    },
    salary: {
      baseSalary: 24000000,
      allowanceResponsibility: 2500000,
      allowanceLunch: 1500000,
      allowanceGas: 800000,
      dependents: 0,
      taxCode: '8091234575',
      insuranceBookNumber: '7912345686'
    }
  },
  {
    id: 'emp-10',
    code: 'MISA-0010',
    fullName: 'Đỗ Anh Tuấn',
    gender: 'Nam',
    dob: '1998-04-12',
    idCard: '001098001122',
    idCardDate: '2023-06-20',
    idCardPlace: 'Cục Cảnh sát QLHC về TTXH',
    phone: '0975667788',
    email: 'tuanda@misa.vn',
    address: 'Dịch Vọng Hậu, Cầu Giấy, Hà Nội',
    hometown: 'Vĩnh Phúc',
    education: 'Kỹ sư Phần mềm - ĐH Công Nghệ ĐHQGHN',
    departmentId: 'dept-it',
    departmentName: 'Khối Công Nghệ & Kỹ Thuật',
    positionId: 'pos-05',
    positionTitle: 'Lập trình viên Frontend (React)',
    joinDate: '2023-03-01',
    contractType: 'Hợp đồng xác định thời hạn 12 tháng',
    contractStartDate: '2023-03-01',
    contractEndDate: '2024-03-01',
    status: 'active',
    bankAccount: {
      bankName: 'VPBank',
      accountNumber: '167890123456',
      branch: 'Cầu Giấy'
    },
    salary: {
      baseSalary: 19000000,
      allowanceResponsibility: 1000000,
      allowanceLunch: 1500000,
      allowanceGas: 600000,
      dependents: 0,
      taxCode: '8091234576',
      insuranceBookNumber: '7912345687'
    }
  },
  {
    id: 'emp-11',
    code: 'MISA-0011',
    fullName: 'Ngô Hải Yến',
    gender: 'Nữ',
    dob: '1995-11-08',
    idCard: '001195009988',
    idCardDate: '2022-12-05',
    idCardPlace: 'Cục Cảnh sát QLHC về TTXH',
    phone: '0919223344',
    email: 'yennh@misa.vn',
    address: 'Lê Văn Lương, Nhân Chính, Thanh Xuân, Hà Nội',
    hometown: 'Hải Dương',
    education: 'Cử nhân Kinh tế Quốc dân - Khoa Marketing',
    departmentId: 'dept-sales',
    departmentName: 'Khối Kinh Doanh & Tiếp Thị',
    positionId: 'pos-10',
    positionTitle: 'Trưởng nhóm Digital Marketing',
    joinDate: '2021-08-15',
    contractType: 'Không xác định thời hạn',
    contractStartDate: '2021-08-15',
    status: 'active',
    bankAccount: {
      bankName: 'Vietcombank',
      accountNumber: '0021008765432',
      branch: 'Hà Nội'
    },
    salary: {
      baseSalary: 27000000,
      allowanceResponsibility: 3500000,
      allowanceLunch: 1500000,
      allowanceGas: 1200000,
      dependents: 0,
      taxCode: '8091234577',
      insuranceBookNumber: '7912345688'
    }
  },
  {
    id: 'emp-12',
    code: 'MISA-0012',
    fullName: 'Lương Minh Quang',
    gender: 'Nam',
    dob: '1996-01-25',
    idCard: '001096003322',
    idCardDate: '2022-08-11',
    idCardPlace: 'Cục Cảnh sát QLHC về TTXH',
    phone: '0936112233',
    email: 'quanglm@misa.vn',
    address: 'Nguyễn Trãi, Thanh Xuân, Hà Nội',
    hometown: 'Hà Nam',
    education: 'Cử nhân Quản trị Kinh Doanh - ĐH Thương Mại',
    departmentId: 'dept-sales',
    departmentName: 'Khối Kinh Doanh & Tiếp Thị',
    positionId: 'pos-09',
    positionTitle: 'Chuyên viên Kinh doanh B2B',
    joinDate: '2022-06-01',
    contractType: 'Hợp đồng xác định thời hạn 36 tháng',
    contractStartDate: '2022-06-01',
    contractEndDate: '2025-06-01',
    status: 'active',
    bankAccount: {
      bankName: 'TPBank',
      accountNumber: '03456789101',
      branch: 'Thanh Xuân'
    },
    salary: {
      baseSalary: 18000000,
      allowanceResponsibility: 1500000,
      allowanceLunch: 1500000,
      allowanceGas: 2000000, // Sales allowance
      dependents: 0,
      taxCode: '8091234578',
      insuranceBookNumber: '7912345689'
    }
  },
  {
    id: 'emp-13',
    code: 'MISA-0013',
    fullName: 'Hoàng Kim Chi',
    gender: 'Nữ',
    dob: '1999-08-30',
    idCard: '001199004433',
    idCardDate: '2023-07-01',
    idCardPlace: 'Cục Cảnh sát QLHC về TTXH',
    phone: '0945667788',
    email: 'chihk@misa.vn',
    address: 'Kim Mã, Ba Đình, Hà Nội',
    hometown: 'Hà Nội',
    education: 'Cử nhân Quản trị Nhân lực - ĐH Lao Động Xã Hội',
    departmentId: 'dept-hr',
    departmentName: 'Khối Nhân Sự & Vận Hành',
    positionId: 'pos-12',
    positionTitle: 'Chuyên viên C&B (Lương & Thưởng)',
    joinDate: '2022-11-01',
    contractType: 'Hợp đồng xác định thời hạn 36 tháng',
    contractStartDate: '2022-11-01',
    contractEndDate: '2025-11-01',
    status: 'active',
    bankAccount: {
      bankName: 'Techcombank',
      accountNumber: '19036789012345',
      branch: 'Ba Đình'
    },
    salary: {
      baseSalary: 18000000,
      allowanceResponsibility: 1500000,
      allowanceLunch: 1500000,
      allowanceGas: 800000,
      dependents: 0,
      taxCode: '8091234579',
      insuranceBookNumber: '7912345690'
    }
  },
  {
    id: 'emp-14',
    code: 'MISA-0014',
    fullName: 'Dương Thị Cẩm Tú',
    gender: 'Nữ',
    dob: '2000-06-18',
    idCard: '001200005544',
    idCardDate: '2023-09-15',
    idCardPlace: 'Cục Cảnh sát QLHC về TTXH',
    phone: '0973344556',
    email: 'tudtc@misa.vn',
    address: 'Hồ Tùng Mậu, Cầu Giấy, Hà Nội',
    hometown: 'Phú Thọ',
    education: 'Cử nhân Tâm lý học - ĐH Khoa học Xã hội & Nhân văn',
    departmentId: 'dept-hr',
    departmentName: 'Khối Nhân Sự & Vận Hành',
    positionId: 'pos-13',
    positionTitle: 'Chuyên viên Tuyển dụng & Đào tạo',
    joinDate: '2023-08-01',
    contractType: 'Hợp đồng xác định thời hạn 12 tháng',
    contractStartDate: '2023-08-01',
    contractEndDate: '2024-08-01', // Sắp hết hạn
    status: 'active',
    bankAccount: {
      bankName: 'VietinBank',
      accountNumber: '109887766554',
      branch: 'Cầu Giấy'
    },
    salary: {
      baseSalary: 16000000,
      allowanceResponsibility: 1000000,
      allowanceLunch: 1500000,
      allowanceGas: 600000,
      dependents: 0,
      taxCode: '8091234580',
      insuranceBookNumber: '7912345691'
    }
  },
  {
    id: 'emp-15',
    code: 'MISA-0015',
    fullName: 'Chu Văn Hùng',
    gender: 'Nam',
    dob: '1993-02-17',
    idCard: '001093006677',
    idCardDate: '2022-05-18',
    idCardPlace: 'Cục Cảnh sát QLHC về TTXH',
    phone: '0918776655',
    email: 'hungcv@misa.vn',
    address: 'Trần Phú, Hà Đông, Hà Nội',
    hometown: 'Bắc Giang',
    education: 'Cử nhân Kế toán Doanh nghiệp - ĐH Thương Mại',
    departmentId: 'dept-acc',
    departmentName: 'Phòng Tài Chính - Kế Toán',
    positionId: 'pos-15',
    positionTitle: 'Kế toán tổng hợp',
    joinDate: '2020-03-01',
    contractType: 'Không xác định thời hạn',
    contractStartDate: '2020-03-01',
    status: 'active',
    bankAccount: {
      bankName: 'BIDV',
      accountNumber: '21510004561234',
      branch: 'Hà Đông'
    },
    salary: {
      baseSalary: 21000000,
      allowanceResponsibility: 2000000,
      allowanceLunch: 1500000,
      allowanceGas: 800000,
      dependents: 1,
      taxCode: '8091234581',
      insuranceBookNumber: '7912345692'
    }
  },
  {
    id: 'emp-16',
    code: 'MISA-0016',
    fullName: 'Lê Thùy Dung',
    gender: 'Nữ',
    dob: '2001-09-02', // Sinh nhật tháng 9
    idCard: '001201007788',
    idCardDate: '2024-01-20',
    idCardPlace: 'Cục Cảnh sát QLHC về TTXH',
    phone: '0961234890',
    email: 'dunglt@misa.vn',
    address: 'Láng Hạ, Đống Đa, Hà Nội',
    hometown: 'Hà Nam',
    education: 'Cử nhân Thương Mại Điện Tử - ĐH Kinh Tế Quốc Dân',
    departmentId: 'dept-sales',
    departmentName: 'Khối Kinh Doanh & Tiếp Thị',
    positionId: 'pos-09',
    positionTitle: 'Chuyên viên Kinh doanh B2B',
    joinDate: '2024-08-01',
    contractType: 'Hợp đồng thử việc',
    contractStartDate: '2024-08-01',
    contractEndDate: '2024-10-01',
    status: 'probation',
    bankAccount: {
      bankName: 'Vietcombank',
      accountNumber: '0011009871234',
      branch: 'Đống Đa'
    },
    salary: {
      baseSalary: 12000000,
      allowanceResponsibility: 0,
      allowanceLunch: 1500000,
      allowanceGas: 1000000,
      dependents: 0,
      taxCode: '8091234582',
      insuranceBookNumber: '7912345693'
    }
  }
];

export const initialCompanySettings: CompanySetting = {
  companyName: 'CÔNG TY CỔ PHẦN CÔNG NGHỆ VÀ TRUYỀN THÔNG MISA',
  taxCode: '0101243150',
  address: 'Tầng 9, Tòa nhà Technosoft, Phố Duy Tân, Cầu Giấy, Hà Nội',
  phone: '024 3795 9595',
  email: 'contact@misa.vn',
  website: 'https://www.misa.vn',
  workingDaysPerMonth: 22,
  workStartTime: '08:00',
  workEndTime: '17:30',
  lunchBreakStart: '12:00',
  lunchBreakEnd: '13:30',
  bhxhRate: 8.0, // Người lao động đóng 8%
  bhytRate: 1.5, // 1.5%
  bhtnRate: 1.0, // 1%
  personalDeduction: 11000000, // 11 triệu VND
  dependentDeduction: 4400000 // 4.4 triệu VND / người
};

export const initialLeaveRequests: LeaveRequest[] = [
  {
    id: 'leave-01',
    code: 'NP-2026-001',
    employeeId: 'emp-07',
    employeeName: 'Phạm Thị Hương Ly',
    employeeCode: 'MISA-0007',
    departmentName: 'Khối Công Nghệ & Kỹ Thuật',
    positionTitle: 'Lập trình viên Frontend (React)',
    type: 'annual',
    startDate: '2026-09-24',
    endDate: '2026-09-25',
    duration: 2,
    unit: 'ngày',
    reason: 'Giải quyết việc cá nhân gia đình tại quê nhà',
    status: 'pending',
    approverId: 'emp-02',
    approverName: 'Vũ Quốc Thái',
    createdAt: '2026-09-20 09:30:00'
  },
  {
    id: 'leave-02',
    code: 'OT-2026-008',
    employeeId: 'emp-06',
    employeeName: 'Lê Hoàng Long',
    employeeCode: 'MISA-0006',
    departmentName: 'Khối Công Nghệ & Kỹ Thuật',
    positionTitle: 'Kỹ sư Fullstack Cao cấp',
    type: 'overtime',
    startDate: '2026-09-22 18:00',
    endDate: '2026-09-22 21:30',
    duration: 3.5,
    unit: 'giờ',
    reason: 'Triển khai release phiên bản HRM 4.0 và kiểm thử dữ liệu',
    status: 'approved',
    approverId: 'emp-02',
    approverName: 'Vũ Quốc Thái',
    createdAt: '2026-09-19 14:15:00',
    reviewedAt: '2026-09-19 16:00:00',
    reviewNotes: 'Đồng ý cho OT hỗ trợ đợt release'
  },
  {
    id: 'leave-03',
    code: 'NP-2026-002',
    employeeId: 'emp-12',
    employeeName: 'Lương Minh Quang',
    employeeCode: 'MISA-0012',
    departmentName: 'Khối Kinh Doanh & Tiếp Thị',
    positionTitle: 'Chuyên viên Kinh doanh B2B',
    type: 'late_early',
    startDate: '2026-09-21 08:00',
    endDate: '2026-09-21 09:30',
    duration: 1.5,
    unit: 'giờ',
    reason: 'Gặp khách hàng doanh nghiệp tại Hòa Lạc trước giờ làm',
    status: 'approved',
    approverId: 'emp-03',
    approverName: 'Nguyễn Thị Thu Hằng',
    createdAt: '2026-09-20 17:00:00',
    reviewedAt: '2026-09-20 17:45:00',
    reviewNotes: 'Xác nhận lịch công tác khách hàng'
  },
  {
    id: 'leave-04',
    code: 'NP-2026-003',
    employeeId: 'emp-08',
    employeeName: 'Trần Gia Bảo',
    employeeCode: 'MISA-0008',
    departmentName: 'Khối Công Nghệ & Kỹ Thuật',
    positionTitle: 'Lập trình viên Backend (Node/Go)',
    type: 'sick',
    startDate: '2026-09-18',
    endDate: '2026-09-18',
    duration: 1,
    unit: 'ngày',
    reason: 'Sốt xuất huyết điều trị tại nhà theo chỉ định bác sĩ',
    status: 'approved',
    approverId: 'emp-02',
    approverName: 'Vũ Quốc Thái',
    createdAt: '2026-09-18 07:30:00',
    reviewedAt: '2026-09-18 08:15:00',
    reviewNotes: 'Duyệt nghỉ ốm, gửi giấy khám khi đi làm lại'
  },
  {
    id: 'leave-05',
    code: 'NP-2026-004',
    employeeId: 'emp-10',
    employeeName: 'Đỗ Anh Tuấn',
    employeeCode: 'MISA-0010',
    departmentName: 'Khối Công Nghệ & Kỹ Thuật',
    positionTitle: 'Lập trình viên Frontend (React)',
    type: 'unpaid',
    startDate: '2026-09-28',
    endDate: '2026-09-30',
    duration: 3,
    unit: 'ngày',
    reason: 'Đi du lịch cá nhân (đã hết phép năm)',
    status: 'pending',
    approverId: 'emp-02',
    approverName: 'Vũ Quốc Thái',
    createdAt: '2026-09-21 08:10:00'
  }
];

// Helper to calculate Vietnamese Tax & Insurance
export function calculateVietnamesePayroll(emp: Employee, actualDays = 21, otHours = 0): PayrollRecord {
  const standardDays = 22;
  const baseSalary = emp.salary.baseSalary;
  const allowances = emp.salary.allowanceResponsibility + emp.salary.allowanceLunch + emp.salary.allowanceGas;
  
  // Prorated base for actual work days
  const earnedBase = Math.round((baseSalary / standardDays) * actualDays);
  const otRatePerHour = (baseSalary / standardDays / 8) * 1.5;
  const otPay = Math.round(otHours * otRatePerHour);
  const grossSalary = earnedBase + allowances + otPay;
  
  // Insurance calculation (BHXH 8%, BHYT 1.5%, BHTN 1% = 10.5% max on baseSalary)
  // Max statutory base cap in VN is 20 times base salary (~46.8M)
  const insuranceSalary = Math.min(baseSalary, 46800000);
  const bhxh = Math.round(insuranceSalary * 0.08);
  const bhyt = Math.round(insuranceSalary * 0.015);
  const bhtn = Math.round(insuranceSalary * 0.01);
  const totalInsurance = bhxh + bhyt + bhtn;

  // Personal Income Tax (PIT / Thuế TNCN)
  // Non-taxable allowances: lunch up to 730,000 VND, phone/gas by company policy
  const nonTaxableLunch = Math.min(emp.salary.allowanceLunch, 730000);
  const personalDeduction = 11000000;
  const dependentDeduction = emp.salary.dependents * 4400000;
  
  // Taxable Base = Gross - NonTaxable - Insurance - Personal & Dependent Deductions
  const taxableIncomeRaw = grossSalary - nonTaxableLunch - totalInsurance - personalDeduction - dependentDeduction;
  const taxableIncome = Math.max(0, taxableIncomeRaw);

  // Progressive Tax Brackets (Biểu thuế lũy tiến từng phần Việt Nam):
  // 1: Đến 5tr: 5%
  // 2: 5tr - 10tr: 10% - 0.25tr
  // 3: 10tr - 18tr: 15% - 0.75tr
  // 4: 18tr - 32tr: 20% - 1.65tr
  // 5: 32tr - 52tr: 25% - 3.25tr
  // 6: 52tr - 80tr: 30% - 5.85tr
  // 7: Trên 80tr: 35% - 9.85tr
  let pit = 0;
  if (taxableIncome > 80000000) {
    pit = taxableIncome * 0.35 - 9850000;
  } else if (taxableIncome > 52000000) {
    pit = taxableIncome * 0.30 - 5850000;
  } else if (taxableIncome > 32000000) {
    pit = taxableIncome * 0.25 - 3250000;
  } else if (taxableIncome > 18000000) {
    pit = taxableIncome * 0.20 - 1650000;
  } else if (taxableIncome > 10000000) {
    pit = taxableIncome * 0.15 - 750000;
  } else if (taxableIncome > 5000000) {
    pit = taxableIncome * 0.10 - 250000;
  } else if (taxableIncome > 0) {
    pit = taxableIncome * 0.05;
  }
  const personalIncomeTax = Math.round(pit);

  const bonus = 0;
  const deductionsOther = 0;
  const netSalary = grossSalary - totalInsurance - personalIncomeTax + bonus - deductionsOther;

  return {
    id: `pay-${emp.id}-2026-09`,
    period: '2026-09',
    employeeId: emp.id,
    employeeCode: emp.code,
    employeeName: emp.fullName,
    departmentName: emp.departmentName,
    positionTitle: emp.positionTitle,
    standardWorkDays: standardDays,
    actualWorkDays: actualDays,
    paidLeaveDays: 1,
    baseSalary: emp.salary.baseSalary,
    allowanceTotal: allowances,
    otPay,
    grossSalary,
    bhxh,
    bhyt,
    bhtn,
    totalInsurance,
    dependents: emp.salary.dependents,
    dependentDeduction,
    personalDeduction,
    taxableIncome,
    personalIncomeTax,
    bonus,
    deductionsOther,
    netSalary,
    status: 'approved',
    paidDate: '2026-10-05'
  };
}

export const initialPayrollList: PayrollRecord[] = initialEmployees.map((emp, idx) => {
  const actualDays = idx % 4 === 0 ? 21.5 : (idx % 3 === 0 ? 20 : 22);
  const ot = idx === 5 ? 8 : (idx === 7 ? 4 : 0);
  return calculateVietnamesePayroll(emp, actualDays, ot);
});

// Seed Attendance data for 2026-09-21 (Today)
export const initialAttendanceList: AttendanceRecord[] = initialEmployees.map((emp, index) => {
  const statuses: ('present' | 'late' | 'leave')[] = ['present', 'present', 'present', 'late', 'present'];
  const status = index === 3 ? 'late' : (index === 6 ? 'leave' : 'present');
  const checkIn = status === 'present' ? `07:${50 + (index % 9)}` : (status === 'late' ? '08:35' : '--:--');
  const checkOut = status === 'leave' ? '--:--' : '17:35';
  const workHours = status === 'leave' ? 0 : (status === 'late' ? 7.5 : 8);

  return {
    id: `att-${emp.id}-20260921`,
    employeeId: emp.id,
    employeeName: emp.fullName,
    departmentName: emp.departmentName,
    date: '2026-09-21',
    checkIn,
    checkOut,
    workHours,
    status,
    notes: status === 'late' ? 'Tắc đường Phạm Hùng' : (status === 'leave' ? 'Nghỉ phép năm có phép' : 'Đúng giờ')
  };
});
