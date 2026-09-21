import { Router } from 'express';
import { db } from '../db';

const router = Router();

// GET all leave requests
router.get('/', (req, res) => {
  try {
    const { status, type, employeeId } = req.query;
    let leaves = db.getLeaves();

    if (status && typeof status === 'string' && status !== 'all') {
      leaves = leaves.filter((l) => l.status === status);
    }
    if (type && typeof type === 'string' && type !== 'all') {
      leaves = leaves.filter((l) => l.type === type);
    }
    if (employeeId && typeof employeeId === 'string') {
      leaves = leaves.filter((l) => l.employeeId === employeeId);
    }

    res.json({ success: true, data: leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi lấy danh sách đơn từ' });
  }
});

// CREATE a leave / OT request
router.post('/', (req, res) => {
  try {
    const data = req.body;
    if (!data.employeeId || !data.type || !data.startDate || !data.endDate || !data.reason) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ các thông tin của đơn' });
    }

    const emp = db.getEmployeeById(data.employeeId);
    if (!emp) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy nhân viên' });
    }

    const newLeave = db.createLeave({
      employeeId: emp.id,
      employeeName: emp.fullName,
      employeeCode: emp.code,
      departmentName: emp.departmentName,
      positionTitle: emp.positionTitle,
      type: data.type,
      startDate: data.startDate,
      endDate: data.endDate,
      duration: Number(data.duration) || 1,
      unit: data.unit || (data.type === 'overtime' || data.type === 'late_early' ? 'giờ' : 'ngày'),
      reason: data.reason,
      approverId: data.approverId || 'emp-02',
      approverName: data.approverName || 'Vũ Quốc Thái'
    });

    res.status(201).json({
      success: true,
      data: newLeave,
      message: 'Gửi đơn phê duyệt thành công'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi tạo đơn' });
  }
});

// APPROVE or REJECT leave request
router.patch('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewNotes } = req.body;

    if (status !== 'approved' && status !== 'rejected') {
      return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ' });
    }

    const updated = db.updateLeaveStatus(id, status, reviewNotes);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn' });
    }

    res.json({
      success: true,
      data: updated,
      message: status === 'approved' ? 'Đã phê duyệt đơn thành công' : 'Đã từ chối đơn'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi cập nhật trạng thái đơn' });
  }
});

export default router;
