import { describe, it, expect, afterAll } from 'vitest';
import { db } from '../server/db';

describe('AMIS HRMS - Tích hợp DataStore & Nghiệp vụ Liên kết (DataStore Integration)', () => {
  let createdEmpId: string | null = null;

  afterAll(() => {
    if (createdEmpId) {
      db.deleteEmployee(createdEmpId);
    }
  });

  it('1. Đọc danh sách nhân viên và kiểm tra tính toàn vẹn', () => {
    const employees = db.getEmployees();
    expect(employees.length).toBeGreaterThanOrEqual(16);
    
    // Mỗi nhân viên phải có mã số, họ tên, phòng ban và cấu trúc lương
    employees.forEach((emp) => {
      expect(emp.id).toBeDefined();
      expect(emp.code).toMatch(/^AMIS-\d{4}$/);
      expect(emp.fullName).toBeTruthy();
      expect(emp.salary.baseSalary).toBeGreaterThan(0);
    });
  });

  it('2. Thêm nhân viên mới và kiểm tra tự động tạo bảng lương', () => {
    const newEmp = db.createEmployee({
      fullName: 'Vũ Minh Hoàng',
      email: 'hoang.vm@amis.corp',
      departmentId: 'dept-it',
      positionId: 'pos-dev',
      joinDate: '2026-09-01',
      salary: {
        baseSalary: 25000000,
        allowanceResponsibility: 1500000,
        allowanceLunch: 730000,
        allowanceGas: 500000,
        dependents: 1
      }
    } as any);

    createdEmpId = newEmp.id;
    expect(newEmp.id).toBeDefined();
    expect(newEmp.code).toMatch(/^AMIS-\d{4}$/);

    // Kiểm tra nhân sự có trong danh bạ
    const retrieved = db.getEmployeeById(newEmp.id);
    expect(retrieved?.fullName).toBe('Vũ Minh Hoàng');

    // Kiểm tra bảng lương được tự động sinh ra cho nhân sự mới
    const payroll = db.getPayrollRecordByEmployeeId(newEmp.id);
    expect(payroll).toBeDefined();
    expect(payroll?.employeeName).toBe('Vũ Minh Hoàng');
    expect(payroll?.netSalary).toBeGreaterThan(0);
  });

  it('3. Thêm người phụ thuộc và kiểm tra tự động cập nhật giảm trừ gia cảnh trên bảng lương', () => {
    const emp = db.getEmployees()[0];
    const initialPayroll = db.getPayrollRecordByEmployeeId(emp.id);
    const initialTax = initialPayroll ? initialPayroll.personalIncomeTax : 0;

    // Thêm 1 người phụ thuộc mới
    db.addDependent(emp.id, {
      fullName: 'Con gái Nguyễn Ngọc Linh',
      relationship: 'Con ruột',
      dob: '2020-03-12',
      idNumber: 'Đang dùng giấy khai sinh',
      isTaxDependent: true
    });

    // Lấy lại bảng lương sau khi cập nhật
    const updatedPayroll = db.getPayrollRecordByEmployeeId(emp.id);
    expect(updatedPayroll).toBeDefined();
    // Khi thêm người phụ thuộc được giảm trừ, thuế TNCN phải giảm hoặc bằng 0
    expect(updatedPayroll!.personalIncomeTax).toBeLessThanOrEqual(initialTax);
  });

  it('4. Phê duyệt đơn nghỉ phép trực tuyến', () => {
    const leaves = db.getLeaves({ status: 'pending' });
    if (leaves.length > 0) {
      const targetLeave = leaves[0];
      const updated = db.updateLeaveStatus(targetLeave.id, 'approved', 'Đồng ý duyệt theo nguyện vọng');
      expect(updated.status).toBe('approved');
      expect(updated.approverName).toBeDefined();
    }
  });

  it('5. Cập nhật ô công ma trận 30 ngày và kiểm tra tính toán liên kết', () => {
    const monthlyTimesheets = db.getMonthlyTimesheets();
    expect(monthlyTimesheets.length).toBeGreaterThan(0);

    const firstEmp = monthlyTimesheets[0];
    // Sửa ngày 15/09 thành 'X' (Đủ công 8h)
    const result = db.updateTimesheetCell(firstEmp.employeeId, 15, {
      status: 'X',
      workHours: 8.0,
      checkIn: '08:00',
      checkOut: '17:30',
      notes: 'Bổ sung đủ công'
    });

    expect(result).toBeDefined();
    const cell15 = result!.days[15];
    expect(cell15?.status).toBe('X');
    expect(cell15?.workHours).toBe(8.0);
  });
});
