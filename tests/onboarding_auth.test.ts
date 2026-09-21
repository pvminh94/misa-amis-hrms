import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../server/app';
import { db } from '../server/db';

describe('AMIS HRM - Luồng Xử Lý Nhân Sự A-Z, Đăng Nhập & Tiếp Nhận Tuyển Dụng', () => {
  describe('1. Xác Thực Đăng Nhập & Quản Lý Phiên (Authentication & Session)', () => {
    it('Đăng nhập thành công với tài khoản Quản trị viên (Super Admin)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'cuongtv', password: 'Amis@123456' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.username).toBe('cuongtv');
      expect(res.body.data.role.code).toBe('ROLE_SUPER_ADMIN');
      expect(res.body.data.permissions.admin_rbac.approve).toBe(true);
    });

    it('Từ chối đăng nhập khi sai mật khẩu', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'cuongtv', password: 'WrongPassword123' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('không chính xác');
    });

    it('Trả về danh sách tài khoản Demo để kiểm thử 1-click', async () => {
      const res = await request(app).get('/api/auth/demo-accounts');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('Đăng xuất và ghi nhận nhật ký Audit Trail an toàn', async () => {
      const res = await request(app)
        .post('/api/auth/logout')
        .send({ userId: 'usr-01' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('2. Khởi Tạo Tài Khoản Người Dùng Mới (Admin User Creation)', () => {
    it('Quản trị viên tạo tài khoản người dùng mới thành công qua POST /api/admin/users', async () => {
      const payload = {
        fullName: 'Nguyễn Văn Minh',
        email: `minhnv.${Date.now()}@amis.vn`,
        username: `minhnv_${Date.now().toString().slice(-4)}`,
        password: 'Amis@123456',
        roleId: 'role-cb-specialist',
        status: 'active'
      };

      const res = await request(app).post('/api/admin/users').send(payload);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.username).toBe(payload.username);
      expect(res.body.data.roleCode).toBe('ROLE_CB_SPECIALIST');
    });

    it('Bắt lỗi trùng lặp khi cố tình tạo tài khoản có username đã tồn tại', async () => {
      const payload = {
        fullName: 'Trùng Tên Đăng Nhập',
        email: 'trung.email@amis.vn',
        username: 'cuongtv', // đã tồn tại
        password: 'Amis@123456',
        roleId: 'role-employee'
      };

      const res = await request(app).post('/api/admin/users').send(payload);
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('đã tồn tại');
    });
  });

  describe('3. Luồng Tiếp Nhận Ứng Viên Từ Tuyển Dụng / CRM (CRM Pipeline Intake)', () => {
    it('Đọc danh sách ứng viên đã trúng tuyển từ CRM qua GET /api/employees/candidates', async () => {
      const res = await request(app).get('/api/employees/candidates');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it('Tiếp nhận ứng viên CRM thành nhân viên chính thức với 1 click (POST /api/employees/candidates/:id/convert)', async () => {
      const candidatesRes = await request(app).get('/api/employees/candidates');
      const candidate = candidatesRes.body.data.find((c: any) => c.status === 'offer_accepted') || candidatesRes.body.data[0];

      const res = await request(app)
        .post(`/api/employees/candidates/${candidate.id}/convert`)
        .send({
          contractType: 'Hợp đồng thử việc 02 tháng',
          onboardingDate: '2026-10-01'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.fullName).toBe(candidate.fullName);
      expect(res.body.data.code).toMatch(/^AMIS-\d{4}$/);

      // Verify contract was generated
      expect(res.body.data.contracts).toBeDefined();
      expect(res.body.data.contracts.length).toBeGreaterThan(0);
      expect(res.body.data.contracts[0].contractNumber).toContain(res.body.data.code);
    });
  });

  describe('4. Quy Trình Onboarding A-Z Khi Thêm Mới Nhân Sự (End-to-End Onboarding)', () => {
    it('Tạo nhân sự mới tự động: sinh HĐLĐ, phân ca làm việc, bảng lương và tài khoản đăng nhập', () => {
      const uniqueCode = `AMIS-${Math.floor(2000 + Math.random() * 7000)}`;
      const uniqueEmail = `onboard_${Date.now()}@amis.vn`;

      const newEmp = db.createEmployee(
        {
          code: uniqueCode,
          fullName: 'Trần Thị Thu Thảo',
          gender: 'Nữ',
          dob: '1997-08-20',
          idCard: '001097008899',
          idCardDate: '2021-05-10',
          idCardPlace: 'Cục Cảnh sát QLHC về TTXH',
          phone: '0988 123 789',
          email: uniqueEmail,
          address: 'Cầu Giấy, Hà Nội',
          hometown: 'Bắc Ninh',
          education: 'Đại học Ngoại Thương',
          departmentId: 'dept-02',
          departmentName: 'Khối Công Nghệ & Kỹ Thuật',
          positionId: 'pos-03',
          positionTitle: 'Chuyên viên Kiểm thử QA',
          joinDate: '2026-09-21',
          contractType: 'Hợp đồng thử việc 02 tháng',
          status: 'probation',
          bankAccount: { bankName: 'Vietcombank', accountNumber: '001100998877', branch: 'Sở Giao Dịch' },
          salary: {
            baseSalary: 16000000,
            allowanceResponsibility: 1000000,
            allowanceLunch: 730000,
            allowanceGas: 500000,
            dependents: 0,
            taxCode: '8091887766',
            insuranceBookNumber: '7912887766'
          }
        },
        {
          createUserAccount: true,
          roleId: 'role-employee',
          username: `thao_${Date.now().toString().slice(-4)}`,
          password: 'Amis@123456',
          autoRoster: true
        }
      );

      // 1. Employee record created
      expect(newEmp).toBeDefined();
      expect(newEmp.code).toBe(uniqueCode);

      // 2. Initial Contract automatically created
      expect(newEmp.contracts).toBeDefined();
      expect(newEmp.contracts?.length).toBeGreaterThan(0);
      expect(newEmp.contracts?.[0].contractType).toBe('Hợp đồng thử việc 02 tháng');

      // 3. Payroll row automatically calculated and added
      const payrollList = db.getPayroll();
      const empPayroll = payrollList.find((p) => p.employeeId === newEmp.id);
      expect(empPayroll).toBeDefined();
      expect(empPayroll?.grossSalary).toBeGreaterThan(16000000);
      expect(empPayroll?.netSalary).toBeGreaterThan(0);

      // 4. User account automatically created and active
      const userAccounts = db.getUserAccounts();
      const empUser = userAccounts.find((u) => u.employeeId === newEmp.id);
      expect(empUser).toBeDefined();
      expect(empUser?.status).toBe('active');
      expect(empUser?.roleCode).toBe('ROLE_EMPLOYEE');

      // 5. Shift rosters automatically allocated for 30 days
      const employeeRoster = db.getShiftRosters('2026-09').find((r) => r.employeeId === newEmp.id);
      expect(employeeRoster).toBeDefined();
      expect(Object.keys(employeeRoster!.schedules).length).toBe(30);

      // 6. Audit Trail entry recorded
      const logs = db.getAuditLogs({ module: 'employees' });
      expect(logs[0].description).toContain(newEmp.fullName);
    });
  });
});
