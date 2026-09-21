import { describe, it, expect } from 'vitest';
import { initialShifts, initialGeofenceLocations } from '../server/data/seedData';

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
});
