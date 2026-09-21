import { describe, it, expect } from 'vitest';
import { initialShifts, initialGeofenceLocations, initialShiftRosters, initialRawPunchLogs, initialAttendancePolicy } from '../server/data/seedData';
import { db } from '../server/db';

describe('AMIS HRMS - Phân hệ Chấm công & Ca kíp (Time & Attendance Engine)', () => {
  it('1. Đảm bảo cấu hình danh mục ca làm việc chuẩn mực', () => {
    expect(initialShifts.length).toBeGreaterThanOrEqual(4);
    
    const caHC = initialShifts.find((s) => s.code === 'CA-HC');
    expect(caHC).toBeDefined();
    expect(caHC?.workHours).toBe(8.0);
    expect(caHC?.coefficient).toBe(1.0);

    const caDem = initialShifts.find((s) => s.code === 'CA-DEM');
    expect(caDem).toBeDefined();
    // Ca đêm có hệ số phụ cấp 1.3 theo luật lao động
    expect(caDem?.coefficient).toBe(1.3);
  });

  it('2. Kiểm tra phân loại chấm công: Đúng giờ vs Đi muộn', () => {
    // Quy chuẩn: Check-in trước 08:30 là Đúng giờ (present), sau 08:30 là Đi muộn (late)
    const checkTime = (timeStr: string): 'present' | 'late' => {
      const [h, m] = timeStr.split(':').map(Number);
      const minutes = h * 60 + m;
      return minutes > 8 * 60 + 30 ? 'late' : 'present';
    };

    expect(checkTime('07:55')).toBe('present');
    expect(checkTime('08:15')).toBe('present');
    expect(checkTime('08:30')).toBe('present');
    expect(checkTime('08:31')).toBe('late');
    expect(checkTime('09:00')).toBe('late');
  });

  it('3. Kiểm tra tính thời gian làm việc thực tế giữa Check-in và Check-out', () => {
    const calculateWorkHours = (inTime: string, outTime: string, breakMinutes = 90): number => {
      const [inH, inM] = inTime.split(':').map(Number);
      const [outH, outM] = outTime.split(':').map(Number);
      const totalMinutes = (outH * 60 + outM) - (inH * 60 + inM) - breakMinutes;
      return Math.max(0, Math.round((totalMinutes / 60) * 10) / 10);
    };

    // Vào 08:00, Ra 17:30, nghỉ trưa 90 phút (12:00 - 13:30) = 8.0 giờ
    expect(calculateWorkHours('08:00', '17:30', 90)).toBe(8.0);

    // Đi muộn vào 09:00, Ra 17:30, nghỉ 90 phút = 7.0 giờ
    expect(calculateWorkHours('09:00', '17:30', 90)).toBe(7.0);
  });

  it('4. Kiểm tra Geofence Location và mạng WiFi BSSID hợp lệ', () => {
    expect(initialGeofenceLocations.length).toBeGreaterThanOrEqual(3);
    const hanoiSite = initialGeofenceLocations.find((loc) => loc.id === 'geo-01');
    expect(hanoiSite).toBeDefined();
    expect(hanoiSite?.radiusMeters).toBeGreaterThanOrEqual(100);
    expect(hanoiSite?.allowedWifiBSSID).toContain('AMIS_CORP_5G');
  });

  it('5. Kiểm tra Kế hoạch phân ca (Shift Rostering 30 ngày) và phân ca hàng loạt', () => {
    const rosters = db.getShiftRosters('2026-09');
    expect(rosters.length).toBeGreaterThanOrEqual(16);

    const firstRoster = rosters[0];
    expect(firstRoster.schedules[1]).toBeDefined();
    expect(firstRoster.schedules[6]?.shiftCode).toBe('OFF'); // Thứ 7 / CN là ngày nghỉ tuần

    // Phân ca hàng loạt theo bộ phận
    db.bulkAssignShiftRoster({
      departmentName: 'Khối Công Nghệ & Kỹ Thuật',
      shiftCode: 'CA-HC',
      shiftName: 'Ca Hành Chính',
      shiftId: 'shift-hc',
      startDay: 1,
      endDay: 10,
      includeWeekends: false
    });

    const techRosters = db.getShiftRosters('2026-09', 'Khối Công Nghệ & Kỹ Thuật');
    techRosters.forEach((r) => {
      expect(r.schedules[1].shiftCode).toBe('CA-HC');
      expect(r.schedules[2].shiftCode).toBe('CA-HC');
    });
  });

  it('6. Kiểm tra Dữ liệu thô máy chấm công & Đồng bộ sinh trắc học (Raw Biometric Punches)', () => {
    const punches = db.getRawPunchLogs({ date: '2026-09-21' });
    expect(punches.length).toBeGreaterThan(0);

    // Kiểm tra cấu trúc bản ghi quẹt thẻ
    const punch = punches[0];
    expect(punch.id).toBeDefined();
    expect(punch.timestamp).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    expect(['fingerprint', 'face_id', 'mobile_gps', 'web']).toContain(punch.source);
    expect(punch.pairingStatus).toBe('paired');

    // Kiểm tra tính năng đồng bộ máy chấm công
    const syncRes = db.syncBiometricLogs();
    expect(syncRes.syncedAt).toBeDefined();
    expect(syncRes.totalLogs).toBeGreaterThanOrEqual(punches.length);
  });

  it('7. Kiểm tra Báo cáo chuyên cần & Bảng xếp hạng đi muộn (Late Leaderboard)', () => {
    const analytics = db.getAttendanceAnalytics('2026-09');
    expect(analytics.overallAttendanceRate).toBeGreaterThan(60);
    expect(analytics.totalWorkHours).toBeGreaterThan(0);
    expect(analytics.departmentRates.length).toBeGreaterThan(0);

    // Kiểm tra bảng xếp hạng đi muộn được sắp xếp giảm dần theo số phút trễ
    expect(Array.isArray(analytics.lateLeaderboard)).toBe(true);
    for (let i = 0; i < analytics.lateLeaderboard.length - 1; i++) {
      expect(analytics.lateLeaderboard[i].totalLateMinutes).toBeGreaterThanOrEqual(
        analytics.lateLeaderboard[i + 1].totalLateMinutes
      );
    }
  });

  it('8. Kiểm tra Cấu hình quy tắc chấm công & thời gian linh hoạt (Grace Period)', () => {
    const policy = db.getAttendancePolicy();
    expect(policy.gracePeriodMinutes).toBe(15); // 15 phút linh hoạt
    expect(policy.minRestHoursBetweenShifts).toBe(12); // Điều 110 BLLĐ 2019

    // Cập nhật policy
    const updated = db.updateAttendancePolicy({ gracePeriodMinutes: 20 });
    expect(updated.gracePeriodMinutes).toBe(20);

    // Reset lại 15
    db.updateAttendancePolicy({ gracePeriodMinutes: 15 });
  });
});
