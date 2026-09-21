import { Router } from 'express';
import { db } from '../db';

const router = Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập tên đăng nhập hoặc email' });
    }

    const authResult = db.authenticateUser(username, password);
    if (!authResult) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản hoặc mật khẩu không chính xác hoặc tài khoản đang bị khóa'
      });
    }

    res.json({
      success: true,
      data: authResult,
      message: 'Đăng nhập hệ thống AMIS HRM thành công'
    });
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message || 'Lỗi xử lý xác thực đăng nhập' });
  }
});

// GET /api/auth/demo-accounts
router.get('/demo-accounts', (req, res) => {
  try {
    const users = db.getUserAccounts();
    // Return sample users with active status
    const demoList = users.slice(0, 5).map((u) => ({
      id: u.id,
      employeeId: u.employeeId,
      fullName: u.fullName,
      email: u.email,
      username: u.username,
      roleName: u.roleName,
      roleCode: u.roleCode,
      departmentName: u.departmentName,
      positionTitle: u.positionTitle
    }));
    res.json({ success: true, data: demoList });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi lấy danh sách tài khoản demo' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  try {
    const { userId } = req.body;
    if (userId) {
      const user = db.getUserAccounts().find((u) => u.id === userId);
      if (user) {
        db.addAuditLog({
          userId: user.id,
          userCode: user.employeeCode,
          userName: user.fullName,
          roleName: user.roleName,
          module: 'admin_rbac',
          action: 'LOGIN',
          description: `Đăng xuất khỏi phiên làm việc hệ thống: ${user.fullName}`,
          ipAddress: '118.70.124.9',
          status: 'success'
        });
      }
    }
    res.json({ success: true, message: 'Đăng xuất thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi đăng xuất' });
  }
});

export default router;
