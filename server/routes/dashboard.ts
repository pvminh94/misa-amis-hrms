import { Router } from 'express';
import { db } from '../db';

const router = Router();

router.get('/stats', (req, res) => {
  try {
    const stats = db.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi tải dữ liệu dashboard' });
  }
});

export default router;
