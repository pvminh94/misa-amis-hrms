import { Router } from 'express';
import { db } from '../db';

const router = Router();

router.get('/', (req, res) => {
  try {
    const departments = db.getDepartments();
    const positions = db.getPositions();
    res.json({ success: true, data: { departments, positions } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi tải cơ cấu tổ chức' });
  }
});

router.post('/', (req, res) => {
  try {
    const { code, name, managerName, description } = req.body;
    if (!code || !name) {
      return res.status(400).json({ success: false, message: 'Mã và tên phòng ban là bắt buộc' });
    }
    const newDept = db.createDepartment({
      code,
      name,
      managerId: '',
      managerName: managerName || 'Chưa bổ nhiệm',
      description: description || ''
    });
    res.status(201).json({ success: true, data: newDept, message: 'Thêm phòng ban thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi tạo phòng ban' });
  }
});

export default router;
