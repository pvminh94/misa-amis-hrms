import { Router } from 'express';
import { db } from '../db';

const router = Router();

// ==========================================
// ROLES & PERMISSION MATRIX
// ==========================================

router.get('/roles', (req, res) => {
  try {
    const roles = db.getRoles();
    res.json({ success: true, data: roles });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi tải danh sách vai trò phân quyền' });
  }
});

router.post('/roles', (req, res) => {
  try {
    const { name, code, description, color, dataScope, permissions } = req.body;
    if (!name || !code) {
      return res.status(400).json({ success: false, message: 'Tên và mã vai trò là bắt buộc' });
    }

    const newRole = db.createRole({
      name,
      code,
      description: description || '',
      isSystem: false,
      color: color || '#3B82F6',
      dataScope: dataScope || 'department',
      permissions: permissions || {
        dashboard: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
        employees: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
        attendance: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
        leaves: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
        payroll: { view: false, create: false, edit: false, delete: false, approve: false, export: false },
        organization: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
        admin_rbac: { view: false, create: false, edit: false, delete: false, approve: false, export: false },
        settings: { view: false, create: false, edit: false, delete: false, approve: false, export: false }
      }
    });

    res.status(201).json({ success: true, data: newRole, message: 'Đã tạo vai trò phân quyền mới thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi tạo mới vai trò phân quyền' });
  }
});

router.put('/roles/:id', (req, res) => {
  try {
    const updated = db.updateRole(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy vai trò phân quyền' });
    }
    res.json({ success: true, data: updated, message: 'Cập nhật phân quyền thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi cập nhật vai trò phân quyền' });
  }
});

router.delete('/roles/:id', (req, res) => {
  try {
    const success = db.deleteRole(req.params.id);
    if (!success) {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa vai trò mặc định của hệ thống hoặc vai trò không tồn tại'
      });
    }
    res.json({ success: true, message: 'Đã xóa vai trò phân quyền thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi xóa vai trò phân quyền' });
  }
});

// ==========================================
// USER ACCOUNTS MANAGEMENT
// ==========================================

router.get('/users', (req, res) => {
  try {
    const { search, roleId, status } = req.query;
    const users = db.getUserAccounts({
      search: typeof search === 'string' ? search : undefined,
      roleId: typeof roleId === 'string' ? roleId : undefined,
      status: typeof status === 'string' ? status : undefined
    });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi tải danh bạ người dùng' });
  }
});

router.patch('/users/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    if (status !== 'active' && status !== 'locked') {
      return res.status(400).json({ success: false, message: 'Trạng thái tài khoản không hợp lệ' });
    }

    const updated = db.updateUserStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản người dùng' });
    }

    res.json({
      success: true,
      data: updated,
      message: status === 'locked' ? 'Đã khóa tài khoản thành công' : 'Đã kích hoạt lại tài khoản thành công'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi cập nhật trạng thái người dùng' });
  }
});

router.patch('/users/:id/role', (req, res) => {
  try {
    const { roleId } = req.body;
    if (!roleId) {
      return res.status(400).json({ success: false, message: 'Mã vai trò không hợp lệ' });
    }

    const updated = db.assignUserRole(req.params.id, roleId);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng hoặc vai trò' });
    }

    res.json({
      success: true,
      data: updated,
      message: `Đã phân bổ vai trò ${updated.roleName} cho người dùng thành công`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi gán vai trò người dùng' });
  }
});

router.post('/users/:id/reset-password', (req, res) => {
  try {
    const result = db.resetUserPassword(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    res.json({
      success: true,
      data: result,
      message: result.message
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi cấp lại mật khẩu' });
  }
});

// ==========================================
// SECURITY AUDIT LOGS
// ==========================================

router.get('/audit-logs', (req, res) => {
  try {
    const { module, action, search } = req.query;
    const logs = db.getAuditLogs({
      module: typeof module === 'string' ? module : undefined,
      action: typeof action === 'string' ? action : undefined,
      search: typeof search === 'string' ? search : undefined
    });
    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi tải nhật ký bảo mật' });
  }
});

// ==========================================
// SECURITY POLICY & SETTINGS
// ==========================================

router.get('/security', (req, res) => {
  try {
    const settings = db.getSecuritySettings();
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi tải chính sách bảo mật' });
  }
});

router.put('/security', (req, res) => {
  try {
    const updated = db.updateSecuritySettings(req.body);
    res.json({
      success: true,
      data: updated,
      message: 'Đã cập nhật chính sách an toàn thông tin & bảo mật'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi lưu chính sách bảo mật' });
  }
});

export default router;
