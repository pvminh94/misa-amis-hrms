import { Router } from 'express';
import { db } from '../db';

const router = Router();

router.get('/', (req, res) => {
  try {
    const settings = db.getSettings();
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi tải thiết lập hệ thống' });
  }
});

router.put('/', (req, res) => {
  try {
    const updated = db.updateSettings(req.body);
    res.json({ success: true, data: updated, message: 'Cập nhật thiết lập hệ thống thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi cập nhật thiết lập' });
  }
});

export default router;
