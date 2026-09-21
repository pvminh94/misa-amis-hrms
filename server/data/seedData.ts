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
    code: 'AMIS-0001',
    fullName: 'Trịnh Văn Cường',
    gender: 'Nam',
    dob: '1982-08-15',
    idCard: '001082001234',
    idCardDate: '2021-05-12',
    idCardPlace: 'Cục Cảnh sát QLHC về TTXH',
    phone: '0912345678',
    email: 'cuongtv@amis.vn',
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
    },
    contracts: [
      {
        id: 'c-01-1',
        contractNumber: 'HĐLĐ-2016/AMIS-001',
        contractType: 'Không xác định thời hạn',
        signDate: '2016-03-01',
        startDate: '2016-03-01',
        signerName: 'Hội đồng Quản trị',
        signerTitle: 'Chủ tịch HĐQT',
        salaryInsurance: 65000000,
        status: 'active',
        notes: 'Hợp đồng bổ nhiệm Tổng Giám Đốc điều hành'
      }
    ],
    workHistory: [
      {
        id: 'wh-01-1',
        decisionNumber: 'QĐ-HĐQT/2016/01',
        effectiveDate: '2016-03-01',
        type: 'appointment',
        title: 'Bổ nhiệm Tổng Giám Đốc điều hành',
        departmentName: 'Ban Giám Đốc',
        positionTitle: 'Tổng Giám Đốc',
        salaryBefore: 45000000,
        salaryAfter: 65000000,
        signDate: '2016-02-28',
        notes: 'Bổ nhiệm theo Nghị quyết Đại hội đồng Cổ đông'
      }
    ],
    rewardsDisciplines: [
      {
        id: 'rd-01-1',
        decisionNumber: 'QĐ-KT/2025/10',
        date: '2025-12-28',
        type: 'reward',
        title: 'Lãnh đạo xuất sắc tiêu biểu ngành Công nghệ Phần mềm',
        reason: 'Đưa doanh thu sản phẩm AMIS SaaS tăng trưởng vượt bậc 140%',
        amount: 20000000,
        signBy: 'Chủ tịch HĐQT'
      }
    ],
    dependentsList: [
      {
        id: 'dep-01-1',
        fullName: 'Trịnh Gia Huy',
        relationship: 'Con cái',
        dob: '2012-04-10',
        idCardOrBirthCert: '001212009876',
        taxCode: '8501234501',
        deductionStart: '2016-03-01'
      },
      {
        id: 'dep-01-2',
        fullName: 'Trịnh Bảo Ngọc',
        relationship: 'Con cái',
        dob: '2015-11-22',
        idCardOrBirthCert: '001215004321',
        taxCode: '8501234502',
        deductionStart: '2016-03-01'
      }
    ],
    documents: [
      { id: 'doc-01-1', name: 'CCCD_TrinhVanCuong.pdf', category: 'CCCD', fileSize: '2.4 MB', uploadDate: '2021-05-15', fileType: 'application/pdf' },
      { id: 'doc-01-2', name: 'BangThacSi_MBA_KTQD.pdf', category: 'Bằng cấp', fileSize: '3.8 MB', uploadDate: '2020-01-10', fileType: 'application/pdf' },
      { id: 'doc-01-3', name: 'NghiQuyet_BoNhiem_CEO.pdf', category: 'Hợp đồng scan', fileSize: '1.9 MB', uploadDate: '2016-03-05', fileType: 'application/pdf' }
    ]
  },
  {
    id: 'emp-02',
    code: 'AMIS-0002',
    fullName: 'Vũ Quốc Thái',
    gender: 'Nam',
    dob: '1988-11-20',
    idCard: '001088005678',
    idCardDate: '2021-08-20',
    idCardPlace: 'Cục Cảnh sát QLHC về TTXH',
    phone: '0988776655',
    email: 'thaivq@amis.vn',
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
    },
    contracts: [
      {
        id: 'c-02-1',
        contractNumber: 'HĐLĐ-2017/AMIS-042',
        contractType: 'Hợp đồng xác định thời hạn 36 tháng',
        signDate: '2017-06-15',
        startDate: '2017-06-15',
        endDate: '2020-06-15',
        signerName: 'Trịnh Văn Cường',
        signerTitle: 'Tổng Giám Đốc',
        salaryInsurance: 35000000,
        status: 'expired',
        notes: 'Hợp đồng tuyển dụng ban đầu Trưởng khối Tech'
      },
      {
        id: 'c-02-2',
        contractNumber: 'HĐLĐ-2020/AMIS-042/KTH',
        contractType: 'Không xác định thời hạn',
        signDate: '2020-06-15',
        startDate: '2020-06-15',
        signerName: 'Trịnh Văn Cường',
        signerTitle: 'Tổng Giám Đốc',
        salaryInsurance: 55000000,
        status: 'active',
        notes: 'Chuyển sang HĐ vô thời hạn kiêm bổ nhiệm Phó TGĐ Kỹ thuật'
      }
    ],
    workHistory: [
      {
        id: 'wh-02-1',
        decisionNumber: 'QĐ-NS/2017/120',
        effectiveDate: '2017-06-15',
        type: 'appointment',
        title: 'Tiếp nhận Trưởng khối Kỹ thuật phần mềm',
        departmentName: 'Khối Công Nghệ & Kỹ Thuật',
        positionTitle: 'Trưởng Khối Công Nghệ',
        salaryAfter: 35000000,
        signDate: '2017-06-10'
      },
      {
        id: 'wh-02-2',
        decisionNumber: 'QĐ-BGD/2020/88',
        effectiveDate: '2020-06-15',
        type: 'promotion',
        title: 'Thăng chức Phó Tổng Giám Đốc Kỹ Thuật (CTO)',
        departmentName: 'Ban Giám Đốc',
        positionTitle: 'Phó Tổng Giám Đốc Kỹ Thuật',
        salaryBefore: 42000000,
        salaryAfter: 55000000,
        signDate: '2020-06-01',
        notes: 'Quyết định bổ nhiệm Phó TGĐ phụ trách toàn bộ R&D'
      }
    ],
    rewardsDisciplines: [
      {
        id: 'rd-02-1',
        decisionNumber: 'QĐ-KT/2024/09',
        date: '2024-12-25',
        type: 'reward',
        title: 'Cúp Sáng tạo Công nghệ AMIS Cloud 2024',
        reason: 'Thiết kế kiến trúc chịu tải 500.000 doanh nghiệp đồng thời',
        amount: 15000000,
        signBy: 'Tổng Giám Đốc'
      }
    ],
    dependentsList: [
      {
        id: 'dep-02-1',
        fullName: 'Vũ Minh Khang',
        relationship: 'Con cái',
        dob: '2018-05-18',
        idCardOrBirthCert: '001218005678',
        taxCode: '8501234509',
        deductionStart: '2018-06-01'
      }
    ],
    documents: [
      { id: 'doc-02-1', name: 'CCCD_VuQuocThai.pdf', category: 'CCCD', fileSize: '1.8 MB', uploadDate: '2021-08-25', fileType: 'application/pdf' },
      { id: 'doc-02-2', name: 'BangKySu_DHBK_HaNoi.pdf', category: 'Bằng cấp', fileSize: '4.1 MB', uploadDate: '2017-06-15', fileType: 'application/pdf' },
      { id: 'doc-02-3', name: 'ChungChi_AWS_Solutions_Architect.pdf', category: 'Chứng chỉ', fileSize: '850 KB', uploadDate: '2023-04-10', fileType: 'application/pdf' }
    ]
  },
  {
    id: 'emp-07',
    code: 'AMIS-0007',
    fullName: 'Phạm Thị Hương Ly',
    gender: 'Nữ',
    dob: '1996-09-15',
    idCard: '001196008899',
    idCardDate: '2023-02-14',
    idCardPlace: 'Cục Cảnh sát QLHC về TTXH',
    phone: '0978998877',
    email: 'lypth@amis.vn',
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
    contractEndDate: '2024-10-01',
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
    },
    contracts: [
      {
        id: 'c-07-1',
        contractNumber: 'HĐTV-2021/AMIS-089',
        contractType: 'Hợp đồng thử việc',
        signDate: '2021-08-01',
        startDate: '2021-08-01',
        endDate: '2021-10-01',
        signerName: 'Đặng Mai Lan',
        signerTitle: 'Trưởng phòng Nhân sự',
        salaryInsurance: 16000000,
        status: 'expired',
        notes: 'Thử việc 2 tháng đạt loại Xuất sắc'
      },
      {
        id: 'c-07-2',
        contractNumber: 'HĐLĐ-2021/AMIS-089/36T',
        contractType: 'Hợp đồng xác định thời hạn 36 tháng',
        signDate: '2021-10-01',
        startDate: '2021-10-01',
        endDate: '2024-10-01',
        signerName: 'Vũ Quốc Thái',
        signerTitle: 'Phó Tổng Giám Đốc Kỹ Thuật',
        salaryInsurance: 25000000,
        status: 'active',
        notes: 'Sắp đến hạn tái ký Hợp đồng vô thời hạn'
      }
    ],
    workHistory: [
      {
        id: 'wh-07-1',
        decisionNumber: 'QĐ-TD/2021/115',
        effectiveDate: '2021-10-01',
        type: 'probation_pass',
        title: 'Tiếp nhận chính thức Lập trình viên Frontend',
        departmentName: 'Khối Công Nghệ & Kỹ Thuật',
        positionTitle: 'Lập trình viên Frontend (React)',
        salaryAfter: 19000000,
        signDate: '2021-09-28'
      },
      {
        id: 'wh-07-2',
        decisionNumber: 'QĐ-TL/2023/45',
        effectiveDate: '2023-07-01',
        type: 'salary_raise',
        title: 'Điều chỉnh nâng bậc lương định kỳ đợt 1/2023',
        departmentName: 'Khối Công Nghệ & Kỹ Thuật',
        positionTitle: 'Lập trình viên Frontend (React)',
        salaryBefore: 19000000,
        salaryAfter: 25000000,
        signDate: '2023-06-25',
        notes: 'Đánh giá hoàn thành xuất sắc dự án AMIS HRM Mobile'
      }
    ],
    rewardsDisciplines: [
      {
        id: 'rd-07-1',
        decisionNumber: 'QĐ-KT/2024/02',
        date: '2024-03-08',
        type: 'reward',
        title: 'Khen thưởng Nhân viên Nữ tiêu biểu AMIS 2024',
        reason: 'Có nhiều đóng góp phát triển UI/UX giao diện hệ thống',
        amount: 3000000,
        signBy: 'Tổng Giám Đốc'
      }
    ],
    dependentsList: [],
    documents: [
      { id: 'doc-07-1', name: 'CCCD_PhamThiHuongLy.pdf', category: 'CCCD', fileSize: '2.1 MB', uploadDate: '2023-02-15', fileType: 'application/pdf' },
      { id: 'doc-07-2', name: 'BangCuNhan_DHQGHN.pdf', category: 'Bằng cấp', fileSize: '3.5 MB', uploadDate: '2021-08-01', fileType: 'application/pdf' },
      { id: 'doc-07-3', name: 'HopDongLaoDong_2021_Signed.pdf', category: 'Hợp đồng scan', fileSize: '4.2 MB', uploadDate: '2021-10-05', fileType: 'application/pdf' }
    ]
  },
  {
    id: 'emp-08',
    code: 'AMIS-0008',
    fullName: 'Trần Gia Bảo',
    gender: 'Nam',
    dob: '1995-07-19',
    idCard: '001095007766',
    idCardDate: '2022-09-09',
    idCardPlace: 'Cục Cảnh sát QLHC về TTXH',
    phone: '0967885544',
    email: 'baotg@amis.vn',
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
    code: 'AMIS-0009',
    fullName: 'Bùi Thanh Thảo',
    gender: 'Nữ',
    dob: '1997-10-04',
    idCard: '001197006655',
    idCardDate: '2023-04-10',
    idCardPlace: 'Cục Cảnh sát QLHC về TTXH',
    phone: '0981223344',
    email: 'thaobt@amis.vn',
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
    code: 'AMIS-0010',
    fullName: 'Đỗ Anh Tuấn',
    gender: 'Nam',
    dob: '1998-04-12',
    idCard: '001098001122',
    idCardDate: '2023-06-20',
    idCardPlace: 'Cục Cảnh sát QLHC về TTXH',
    phone: '0975667788',
    email: 'tuanda@amis.vn',
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
    code: 'AMIS-0011',
    fullName: 'Ngô Hải Yến',
    gender: 'Nữ',
    dob: '1995-11-08',
    idCard: '001195009988',
    idCardDate: '2022-12-05',
    idCardPlace: 'Cục Cảnh sát QLHC về TTXH',
    phone: '0919223344',
    email: 'yennh@amis.vn',
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
    code: 'AMIS-0012',
    fullName: 'Lương Minh Quang',
    gender: 'Nam',
    dob: '1996-01-25',
    idCard: '001096003322',
    idCardDate: '2022-08-11',
    idCardPlace: 'Cục Cảnh sát QLHC về TTXH',
    phone: '0936112233',
    email: 'quanglm@amis.vn',
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
    code: 'AMIS-0013',
    fullName: 'Hoàng Kim Chi',
    gender: 'Nữ',
    dob: '1999-08-30',
    idCard: '001199004433',
    idCardDate: '2023-07-01',
    idCardPlace: 'Cục Cảnh sát QLHC về TTXH',
    phone: '0945667788',
    email: 'chihk@amis.vn',
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
    code: 'AMIS-0014',
    fullName: 'Dương Thị Cẩm Tú',
    gender: 'Nữ',
    dob: '2000-06-18',
    idCard: '001200005544',
    idCardDate: '2023-09-15',
    idCardPlace: 'Cục Cảnh sát QLHC về TTXH',
    phone: '0973344556',
    email: 'tudtc@amis.vn',
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
    code: 'AMIS-0015',
    fullName: 'Chu Văn Hùng',
    gender: 'Nam',
    dob: '1993-02-17',
    idCard: '001093006677',
    idCardDate: '2022-05-18',
    idCardPlace: 'Cục Cảnh sát QLHC về TTXH',
    phone: '0918776655',
    email: 'hungcv@amis.vn',
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
    code: 'AMIS-0016',
    fullName: 'Lê Thùy Dung',
    gender: 'Nữ',
    dob: '2001-09-02', // Sinh nhật tháng 9
    idCard: '001201007788',
    idCardDate: '2024-01-20',
    idCardPlace: 'Cục Cảnh sát QLHC về TTXH',
    phone: '0961234890',
    email: 'dunglt@amis.vn',
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
  companyName: 'CÔNG TY CỔ PHẦN CÔNG NGHỆ AMIS VIỆT NAM',
  taxCode: '0101243150',
  address: 'Tầng 9, Tòa nhà Technosoft, Phố Duy Tân, Cầu Giấy, Hà Nội',
  phone: '024 3795 9595',
  email: 'contact@amis.vn',
  website: 'https://www.amis.vn',
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
    employeeCode: 'AMIS-0007',
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
    employeeCode: 'AMIS-0006',
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
    employeeCode: 'AMIS-0012',
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
    employeeCode: 'AMIS-0008',
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
    employeeCode: 'AMIS-0010',
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

// SEED: Shift Definitions
export const initialShifts: ShiftDefinition[] = [
  {
    id: 'shift-hc',
    code: 'CA-HC',
    name: 'Ca Hành Chính Tiêu Chuẩn',
    startTime: '08:00',
    endTime: '17:30',
    breakStartTime: '12:00',
    breakEndTime: '13:30',
    workHours: 8.0,
    coefficient: 1.0,
    color: '#0072BC',
    description: 'Ca làm việc tiêu chuẩn khối văn phòng từ Thứ Hai đến Thứ Sáu'
  },
  {
    id: 'shift-sang',
    code: 'CA-SANG',
    name: 'Ca Buổi Sáng',
    startTime: '08:00',
    endTime: '12:00',
    breakStartTime: '',
    breakEndTime: '',
    workHours: 4.0,
    coefficient: 0.5,
    color: '#10B981',
    description: 'Ca làm việc 0.5 công buổi sáng'
  },
  {
    id: 'shift-chieu',
    code: 'CA-CHIEU',
    name: 'Ca Buổi Chiều',
    startTime: '13:30',
    endTime: '17:30',
    breakStartTime: '',
    breakEndTime: '',
    workHours: 4.0,
    coefficient: 0.5,
    color: '#8B5CF6',
    description: 'Ca làm việc 0.5 công buổi chiều'
  },
  {
    id: 'shift-dem',
    code: 'CA-DEM',
    name: 'Ca Trực Đêm Hệ Thống (R&D/DevOps)',
    startTime: '22:00',
    endTime: '06:00',
    breakStartTime: '02:00',
    breakEndTime: '03:00',
    workHours: 8.0,
    coefficient: 1.3,
    color: '#F59E0B',
    description: 'Ca trực ca đêm có hưởng phụ cấp làm đêm 30% theo luật'
  }
];

// Helper to generate 30 days of September 2026
export function generateMonthlyTimesheet(employees: Employee[]): MonthlyTimesheetEmployee[] {
  const weekendDays = new Set([5, 6, 12, 13, 19, 20, 26, 27]); // Sat, Sun in Sep 2026
  const holidayDay = 2; // 2/9 Quốc Khánh

  return employees.map((emp, empIdx) => {
    const days: { [day: number]: DayTimesheetCell } = {};
    let totalWorkDays = 0;
    let totalPaidLeaves = 1; // Holiday 2/9 is paid
    let totalUnpaidLeaves = 0;
    let totalLateTimes = 0;
    let totalLateMinutes = 0;
    let totalOTHours = 0;

    for (let day = 1; day <= 30; day++) {
      const dateStr = `2026-09-${day < 10 ? '0' + day : day}`;

      if (weekendDays.has(day)) {
        days[day] = {
          day,
          date: dateStr,
          status: 'OFF',
          workHours: 0,
          shiftCode: 'OFF',
          notes: 'Nghỉ cuối tuần'
        };
      } else if (day === holidayDay) {
        days[day] = {
          day,
          date: dateStr,
          status: 'P',
          workHours: 8,
          shiftCode: 'CA-HC',
          notes: 'Nghỉ Quốc khánh 2/9 (Hưởng nguyên lương)'
        };
      } else if (empIdx === 6 && day === 18) {
        // Emp 7 sick leave
        days[day] = {
          day,
          date: dateStr,
          status: 'P',
          workHours: 8,
          shiftCode: 'CA-HC',
          notes: 'Nghỉ ốm hưởng BHXH'
        };
        totalPaidLeaves += 1;
      } else if (empIdx === 5 && day === 22) {
        // Long LH overtime
        days[day] = {
          day,
          date: dateStr,
          status: 'OT',
          workHours: 11.5,
          checkIn: '07:55',
          checkOut: '21:30',
          shiftCode: 'CA-HC',
          notes: 'Làm thêm OT 3.5h triển khai release'
        };
        totalWorkDays += 1;
        totalOTHours += 3.5;
      } else if (day === 21 && (empIdx === 3 || empIdx === 7)) {
        // Late today for emp 4 and 8
        days[day] = {
          day,
          date: dateStr,
          status: 'L',
          workHours: 7.5,
          checkIn: '08:35',
          checkOut: '17:35',
          lateMinutes: 20,
          shiftCode: 'CA-HC',
          notes: 'Đi muộn 20 phút'
        };
        totalWorkDays += 1;
        totalLateTimes += 1;
        totalLateMinutes += 20;
      } else {
        // Normal work day
        days[day] = {
          day,
          date: dateStr,
          status: 'X',
          workHours: 8,
          checkIn: '07:50',
          checkOut: '17:35',
          shiftCode: 'CA-HC',
          notes: 'Đi làm đủ công'
        };
        totalWorkDays += 1;
      }
    }

    return {
      employeeId: emp.id,
      employeeCode: emp.code,
      employeeName: emp.fullName,
      departmentName: emp.departmentName,
      positionTitle: emp.positionTitle,
      period: '2026-09',
      days,
      totalWorkDays,
      totalPaidLeaves,
      totalUnpaidLeaves,
      totalLateTimes,
      totalLateMinutes,
      totalOTHours
    };
  });
}

export const initialMonthlyTimesheets: MonthlyTimesheetEmployee[] = generateMonthlyTimesheet(initialEmployees);

// SEED: Shift Swaps
export const initialShiftSwaps: ShiftSwapRequest[] = [
  {
    id: 'swap-01',
    code: 'ĐCA-2026-001',
    employeeId: 'emp-05',
    employeeName: 'Lập trình viên Frontend (React)',
    employeeCode: 'AMIS-0007',
    targetEmployeeId: 'emp-10',
    targetEmployeeName: 'Đỗ Anh Tuấn',
    targetEmployeeCode: 'AMIS-0010',
    swapDate: '2026-09-24',
    fromShiftCode: 'CA-HC',
    fromShiftName: 'Ca Hành Chính',
    toShiftCode: 'CA-CHIEU',
    toShiftName: 'Ca Buổi Chiều',
    reason: 'Bận việc gia đình buổi sáng tại quê',
    status: 'pending',
    createdAt: '2026-09-21 08:15:00'
  },
  {
    id: 'swap-02',
    code: 'ĐCA-2026-002',
    employeeId: 'emp-08',
    employeeName: 'Trần Gia Bảo',
    employeeCode: 'AMIS-0008',
    targetEmployeeId: 'emp-06',
    targetEmployeeName: 'Lê Hoàng Long',
    targetEmployeeCode: 'AMIS-0006',
    swapDate: '2026-09-19',
    fromShiftCode: 'CA-DEM',
    fromShiftName: 'Ca Trực Đêm',
    toShiftCode: 'CA-HC',
    toShiftName: 'Ca Hành Chính',
    reason: 'Đổi ca trực đêm hỗ trợ trực cơ sở dữ liệu cloud',
    status: 'approved',
    approverName: 'Vũ Quốc Thái',
    createdAt: '2026-09-18 14:00:00',
    reviewedAt: '2026-09-18 16:30:00'
  }
];

// SEED: Attendance Regularization
export const initialRegularizations: AttendanceRegularization[] = [
  {
    id: 'reg-01',
    code: 'GTC-2026-001',
    employeeId: 'emp-12',
    employeeName: 'Lương Minh Quang',
    employeeCode: 'AMIS-0012',
    departmentName: 'Khối Kinh Doanh & Tiếp Thị',
    date: '2026-09-21',
    type: 'client_meeting',
    suggestedCheckIn: '08:00',
    suggestedCheckOut: '17:30',
    reason: 'Gặp gỡ khách hàng ký hợp đồng phần mềm tại Hòa Lạc từ đầu giờ sáng',
    attachmentName: 'BienBanLamViec_HoaLac.jpg',
    status: 'pending',
    createdAt: '2026-09-21 08:45:00'
  },
  {
    id: 'reg-02',
    code: 'GTC-2026-002',
    employeeId: 'emp-07',
    employeeName: 'Phạm Thị Hương Ly',
    employeeCode: 'AMIS-0007',
    departmentName: 'Khối Công Nghệ & Kỹ Thuật',
    date: '2026-09-16',
    type: 'forgot_checkout',
    suggestedCheckIn: '07:55',
    suggestedCheckOut: '17:40',
    reason: 'Vội về đi khám bệnh nên quên quẹt thẻ chấm công ra lúc tan ca',
    status: 'approved',
    approverName: 'Vũ Quốc Thái',
    createdAt: '2026-09-17 08:00:00',
    reviewedAt: '2026-09-17 09:10:00'
  }
];

// SEED: Geofence Locations
export const initialGeofenceLocations: GeofenceLocation[] = [
  {
    id: 'geo-01',
    name: 'Trụ sở AMIS Hà Nội (Tòa Technosoft Duy Tân)',
    address: 'Tầng 9, Tòa Technosoft, Phố Duy Tân, Cầu Giấy, Hà Nội',
    latitude: 21.0315,
    longitude: 105.7832,
    radiusMeters: 100,
    allowedWifiBSSID: ['AMIS_CORP_5G', 'AMIS_GUEST', 'MISA_TECH_WIFI'],
    isActive: true
  },
  {
    id: 'geo-02',
    name: 'Văn phòng Chi nhánh TP. Hồ Chí Minh',
    address: 'Tòa nhà Bitexco, Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    latitude: 10.7719,
    longitude: 106.7044,
    radiusMeters: 150,
    allowedWifiBSSID: ['AMIS_HCM_CORP', 'AMIS_HCM_5G'],
    isActive: true
  },
  {
    id: 'geo-03',
    name: 'Văn phòng Chi nhánh Đà Nẵng',
    address: 'Đường Nguyễn Văn Linh, Hải Châu, Đà Nẵng',
    latitude: 16.0678,
    longitude: 108.2208,
    radiusMeters: 80,
    allowedWifiBSSID: ['AMIS_DNG_WIFI'],
    isActive: true
  }
];

