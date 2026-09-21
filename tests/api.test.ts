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
});
