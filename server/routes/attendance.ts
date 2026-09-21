import { Router } from 'express';
import { db } from '../db';

const router = Router();

// GET attendance list (by date)
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

export default router;
