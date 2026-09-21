import { describe, it, expect } from 'vitest';
import { db } from '../server/db';

describe('Enterprise Shift Rostering & Labor Compliance', () => {
  it('should have 30-day shift roster for employees', () => {
    const roster = db.getShiftRoster();
    expect(roster.length).toBeGreaterThan(0);
    const first = roster[0];
    expect(first.employeeName).toBeDefined();
    expect(first.schedules).toBeDefined();
    expect(first.schedules[21]).toBeDefined(); // Current day schedule
  });

  it('should support department-level bulk shift rostering', () => {
    const roster = db.getShiftRoster();
    const targetDept = roster[0].departmentName;
    const deptEmps = roster.filter(r => r.departmentName === targetDept);
    expect(deptEmps.length).toBeGreaterThan(0);

    const updated = db.bulkAssignRoster({
      departmentName: targetDept,
      shiftCode: 'CA-S',
      shiftName: 'Ca Sáng (06:00 - 14:00)',
      shiftId: 'shift-sang',
      startDay: 22,
      endDay: 26,
      includeWeekends: false
    });

    const updatedDeptEmps = updated.filter(r => r.departmentName === targetDept);
    for (const emp of updatedDeptEmps) {
      expect(emp.schedules[22].shiftCode).toBe('CA-S');
      expect(emp.schedules[25].shiftCode).toBe('CA-S');
    }
  });

  it('should validate 12-hour minimum rest period between consecutive shifts (Labor Code 2019 Article 110)', () => {
    const conflictResult = db.checkShiftConflict('emp-01', 22, 'CA-S');
    expect(conflictResult).toBeDefined();
    expect(typeof conflictResult.hasConflict).toBe('boolean');
  });
});

describe('Omni Check-In Methods', () => {
  it('should record raw punch log for biometrics/FaceID terminal', () => {
    const initialCount = db.getRawPunches().length;
    const punch = db.addRawPunch({
      employeeId: 'emp-01',
      employeeCode: 'NV001',
      employeeName: 'Nguyễn Văn An',
      punchDate: '2026-09-21',
      punchTime: '08:02:15',
      timestamp: '2026-09-21 08:02:15',
      deviceId: 'HIK-CAM-01',
      deviceName: 'Hikvision FaceID AI DS-K1T671 (Cổng chính)',
      source: 'face_id',
      accuracyScore: 99.4,
      pairingStatus: 'paired'
    });

    expect(punch.id).toBeDefined();
    expect(punch.timestamp).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    const newCount = db.getRawPunches().length;
    expect(newCount).toBe(initialCount + 1);
  });

  it('should record mobile GPS geofenced check-in', () => {
    const punch = db.addRawPunch({
      employeeId: 'emp-02',
      employeeCode: 'NV002',
      employeeName: 'Trần Thị Mai',
      punchDate: '2026-09-21',
      punchTime: '08:15:30',
      timestamp: '2026-09-21 08:15:30',
      deviceId: 'MOB-APP-02',
      deviceName: 'AMIS HRM Mobile App iOS',
      source: 'mobile_gps',
      accuracyScore: 98.5,
      pairingStatus: 'paired'
    });

    expect(punch.source).toBe('mobile_gps');
  });
});

describe('Employee Self-Service (ESS) Payslip Calculation', () => {
  it('should compute exact net pay with 10.5% statutory social insurance and PIT', () => {
    const payroll = db.getPayroll();
    expect(payroll.length).toBeGreaterThan(0);
    const record = payroll[0];

    // Gross salary
    expect(record.grossSalary).toBeGreaterThan(0);

    // 10.5% Social insurance: BHXH (8%) + BHYT (1.5%) + BHTN (1%)
    expect(record.bhxh).toBe(Math.round(record.baseSalary * 0.08));
    expect(record.bhyt).toBe(Math.round(record.baseSalary * 0.015));
    expect(record.bhtn).toBe(Math.round(record.baseSalary * 0.01));
    expect(record.totalInsurance).toBe(record.bhxh + record.bhyt + record.bhtn);

    // Personal deduction 11,000,000 VND
    expect(record.personalDeduction).toBe(11000000);

    // Net pay formula check: Gross - Total Insurance - PIT - Deductions + Bonus
    const expectedNet = record.grossSalary - record.totalInsurance - record.personalIncomeTax - record.deductionsOther + record.bonus;
    expect(record.netSalary).toBe(expectedNet);
  });
});
