import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../server/app';

describe('AMIS HRMS - Kiểm thử Tích hợp RESTful API Endpoints', () => {
  it('1. API Health Check: Trả về trạng thái hệ thống và phiên bản', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.system).toContain('AMIS HRM');
  });

  it('2. API Dashboard Stats: Trả về 200 OK và cấu trúc KPI đầy đủ', async () => {
    const res = await request(app).get('/api/dashboard/stats');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalEmployees).toBeGreaterThan(0);
    expect(res.body.data.attendanceToday).toBeDefined();
    expect(res.body.data.totalPayroll).toBeGreaterThan(0);
  });

  it('3. API Employees: Trả về danh sách nhân sự tiếng Việt và hỗ trợ tìm kiếm', async () => {
    const res = await request(app).get('/api/employees');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);

    // Tìm kiếm nhân sự
    const searchRes = await request(app).get('/api/employees?search=Trịnh');
    expect(searchRes.status).toBe(200);
    expect(searchRes.body.success).toBe(true);
    expect(searchRes.body.data.some((e: any) => e.fullName.includes('Trịnh'))).toBe(true);
  });

  it('4. API Attendance Shifts & Locations: Trả về ca kíp và điểm Geofencing', async () => {
    const shiftsRes = await request(app).get('/api/attendance/shifts');
    expect(shiftsRes.status).toBe(200);
    expect(shiftsRes.body.success).toBe(true);
    expect(shiftsRes.body.data.length).toBeGreaterThanOrEqual(4);

    const locsRes = await request(app).get('/api/attendance/locations');
    expect(locsRes.status).toBe(200);
    expect(locsRes.body.success).toBe(true);
    expect(locsRes.body.data.length).toBeGreaterThanOrEqual(2);
  });

  it('5. API Leaves: Trả về danh sách đơn từ và duyệt đơn', async () => {
    const res = await request(app).get('/api/leaves');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('6. API Payroll: Trả về bảng lương và tóm tắt tổng quỹ lương', async () => {
    const res = await request(app).get('/api/payroll?period=2026-09');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.summary).toBeDefined();
    expect(res.body.summary.totalGross).toBeGreaterThan(0);
    expect(res.body.summary.totalNet).toBeGreaterThan(0);
  });

  it('7. API Organization & Settings: Cấu hình doanh nghiệp và sơ đồ tổ chức', async () => {
    const orgRes = await request(app).get('/api/departments');
    expect(orgRes.status).toBe(200);
    expect(orgRes.body.success).toBe(true);
    expect(orgRes.body.data.departments.length).toBeGreaterThan(0);

    const setRes = await request(app).get('/api/settings');
    expect(setRes.status).toBe(200);
    expect(setRes.body.success).toBe(true);
    expect(setRes.body.data.companyName).toBeDefined();
  });

  it('8. API Shift Rostering: Lấy ma trận phân ca và phân ca hàng loạt', async () => {
    const rosterRes = await request(app).get('/api/attendance/roster?period=2026-09');
    expect(rosterRes.status).toBe(200);
    expect(rosterRes.body.success).toBe(true);
    expect(rosterRes.body.data.length).toBeGreaterThanOrEqual(16);

    const bulkRes = await request(app)
      .post('/api/attendance/roster/bulk')
      .send({
        departmentName: 'Ban Giám Đốc',
        shiftCode: 'CA-HC',
        shiftName: 'Ca Hành Chính',
        shiftId: 'shift-hc',
        startDay: 1,
        endDay: 15,
        includeWeekends: false
      });
    expect(bulkRes.status).toBe(200);
    expect(bulkRes.body.success).toBe(true);
  });

  it('9. API Biometric Raw Punches: Lấy nhật ký và đồng bộ máy chấm công', async () => {
    const punchesRes = await request(app).get('/api/attendance/raw-punches');
    expect(punchesRes.status).toBe(200);
    expect(punchesRes.body.success).toBe(true);
    expect(punchesRes.body.data.length).toBeGreaterThan(0);

    const syncRes = await request(app).post('/api/attendance/raw-punches/sync');
    expect(syncRes.status).toBe(200);
    expect(syncRes.body.success).toBe(true);
    expect(syncRes.body.data.syncedAt).toBeDefined();
  });

  it('10. API Attendance Analytics & Policy: Thống kê chuyên cần và cấu hình linh hoạt', async () => {
    const analyticsRes = await request(app).get('/api/attendance/analytics?period=2026-09');
    expect(analyticsRes.status).toBe(200);
    expect(analyticsRes.body.success).toBe(true);
    expect(analyticsRes.body.data.overallAttendanceRate).toBeDefined();
    expect(Array.isArray(analyticsRes.body.data.lateLeaderboard)).toBe(true);

    const policyRes = await request(app).get('/api/attendance/policy');
    expect(policyRes.status).toBe(200);
    expect(policyRes.body.success).toBe(true);
    expect(policyRes.body.data.gracePeriodMinutes).toBeDefined();
  });
});
