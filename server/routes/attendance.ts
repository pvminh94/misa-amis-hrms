import { Router } from 'express';
import { db } from '../db';

const router = Router();

// GET daily attendance list (by date)
router.get('/', (req, res) => {
  try {
    const { date, departmentId } = req.query;
    let list = db.getAttendance(typeof date === 'string' ? date : undefined);
    
    if (departmentId && typeof departmentId === 'string' && departmentId !== 'all') {
      const empsInDept = new Set(db.getEmployees().filter(e => e.departmentId === departmentId).map(e => e.id));
      list = list.filter(item => empsInDept.has(item.employeeId));
    }

    res.json({ success: true, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi tải dữ liệu chấm công' });
  }
});

// POST Check-in
router.post('/check-in', (req, res) => {
  try {
    const { employeeId, time } = req.body;
    if (!employeeId) {
      return res.status(400).json({ success: false, message: 'Mã nhân sự không hợp lệ' });
    }

    const record = db.recordCheckIn(employeeId, time);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy nhân sự' });
    }

    res.json({
      success: true,
      data: record,
      message: `Chấm công vào thành công lúc ${record.checkIn} (${record.status === 'late' ? 'Đi muộn' : 'Đúng giờ'})`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi ghi nhận vào ca' });
  }
});

// POST Check-out
router.post('/check-out', (req, res) => {
  try {
    const { employeeId, time } = req.body;
    if (!employeeId) {
      return res.status(400).json({ success: false, message: 'Mã nhân sự không hợp lệ' });
    }

    const record = db.recordCheckOut(employeeId, time);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Chưa có lượt vào ca để chấm ra' });
    }

    res.json({
      success: true,
      data: record,
      message: `Chấm công ra thành công lúc ${record.checkOut} (Tổng thời gian: ${record.workHours}h)`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi ghi nhận ra ca' });
  }
});

// -------------------------------------------------------------
// ADVANCED MODULE ENDPOINTS
// -------------------------------------------------------------

// SHIFTS
router.get('/shifts', (req, res) => {
  try {
    const shifts = db.getShifts();
    res.json({ success: true, data: shifts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi lấy danh sách ca làm việc' });
  }
});

router.post('/shifts', (req, res) => {
  try {
    const newShift = db.createShift(req.body);
    res.status(201).json({ success: true, data: newShift, message: 'Thêm ca làm việc thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi tạo ca làm việc' });
  }
});

router.put('/shifts/:id', (req, res) => {
  try {
    const updated = db.updateShift(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Không tìm thấy ca làm việc' });
    res.json({ success: true, data: updated, message: 'Cập nhật ca làm việc thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi cập nhật ca làm việc' });
  }
});

// MONTHLY TIMESHEET MATRIX
router.get('/monthly', (req, res) => {
  try {
    const { period = '2026-09', departmentName, search } = req.query;
    let list = db.getMonthlyTimesheets(typeof period === 'string' ? period : '2026-09');

    if (departmentName && typeof departmentName === 'string' && departmentName !== 'all') {
      list = list.filter((m) => m.departmentName === departmentName);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      list = list.filter((m) => m.employeeName.toLowerCase().includes(q) || m.employeeCode.toLowerCase().includes(q));
    }

    res.json({ success: true, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi tải bảng công tháng' });
  }
});

router.patch('/monthly/cell', (req, res) => {
  try {
    const { employeeId, day, cellUpdates } = req.body;
    if (!employeeId || day === undefined) {
      return res.status(400).json({ success: false, message: 'Dữ liệu ô chấm công không hợp lệ' });
    }

    const updatedRow = db.updateTimesheetCell(employeeId, Number(day), cellUpdates);
    if (!updatedRow) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bản ghi chấm công' });
    }

    res.json({
      success: true,
      data: updatedRow,
      message: `Đã cập nhật công ngày ${day}/09 thành công (Tự động liên kết Bảng lương)`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi cập nhật ô chấm công' });
  }
});

// SHIFT SWAPS
router.get('/swaps', (req, res) => {
  try {
    const swaps = db.getShiftSwaps();
    res.json({ success: true, data: swaps });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi tải danh sách đổi ca' });
  }
});

router.post('/swaps', (req, res) => {
  try {
    const newSwap = db.createShiftSwap(req.body);
    res.status(201).json({ success: true, data: newSwap, message: 'Gửi yêu cầu đổi ca thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi gửi yêu cầu đổi ca' });
  }
});

router.patch('/swaps/:id/status', (req, res) => {
  try {
    const { status, approverName } = req.body;
    const updated = db.updateShiftSwapStatus(req.params.id, status, approverName);
    if (!updated) return res.status(404).json({ success: false, message: 'Không tìm thấy yêu cầu' });
    res.json({
      success: true,
      data: updated,
      message: status === 'approved' ? 'Đã phê duyệt đổi ca thành công' : 'Đã từ chối đổi ca'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi duyệt đổi ca' });
  }
});

// ATTENDANCE REGULARIZATIONS
router.get('/regularizations', (req, res) => {
  try {
    const list = db.getRegularizations();
    res.json({ success: true, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi tải danh sách giải trình' });
  }
});

router.post('/regularizations', (req, res) => {
  try {
    const newReg = db.createRegularization(req.body);
    res.status(201).json({ success: true, data: newReg, message: 'Gửi đơn giải trình chấm công thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi gửi đơn giải trình' });
  }
});

router.patch('/regularizations/:id/status', (req, res) => {
  try {
    const { status, approverName } = req.body;
    const updated = db.updateRegularizationStatus(req.params.id, status, approverName);
    if (!updated) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn giải trình' });
    res.json({
      success: true,
      data: updated,
      message: status === 'approved' ? 'Đã duyệt giải trình và bù công thành công' : 'Đã từ chối đơn giải trình'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi duyệt giải trình' });
  }
});

// GEOFENCE LOCATIONS
router.get('/locations', (req, res) => {
  try {
    const list = db.getGeofenceLocations();
    res.json({ success: true, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi tải danh sách địa điểm' });
  }
});

router.put('/locations/:id', (req, res) => {
  try {
    const updated = db.updateGeofenceLocation(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Không tìm thấy địa điểm' });
    res.json({ success: true, data: updated, message: 'Cập nhật địa điểm chấm công thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi cập nhật địa điểm' });
  }
});

export default router;
