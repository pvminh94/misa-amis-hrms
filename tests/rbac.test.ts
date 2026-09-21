import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../server/app';
import { db } from '../server/db';
import { PermissionMatrix } from '../server/types';

describe('Admin RBAC & Role Management Module', () => {
  describe('Database RBAC & Role Operations', () => {
    it('should retrieve seeded system roles', async () => {
      const roles = db.getRoles();
      expect(Array.isArray(roles)).toBe(true);
      expect(roles.length).toBeGreaterThanOrEqual(5);

      const superAdmin = roles.find((r) => r.code === 'ROLE_SUPER_ADMIN');
      expect(superAdmin).toBeDefined();
      expect(superAdmin?.isSystem).toBe(true);
      expect(superAdmin?.dataScope).toBe('all');
      expect(superAdmin?.permissions.admin_rbac.approve).toBe(true);
    });

    it('should create a custom role with granular permissions', async () => {
      const customPermissions: PermissionMatrix = {
        dashboard: { view: true, create: false, edit: false, delete: false, approve: false, export: true },
        employees: { view: true, create: true, edit: false, delete: false, approve: false, export: false },
        attendance: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
        leaves: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
        payroll: { view: false, create: false, edit: false, delete: false, approve: false, export: false },
        organization: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
        admin_rbac: { view: false, create: false, edit: false, delete: false, approve: false, export: false },
        settings: { view: false, create: false, edit: false, delete: false, approve: false, export: false }
      };

      const newRole = db.createRole({
        name: 'Thực tập sinh HR (Intern)',
        code: 'ROLE_HR_INTERN',
        description: 'Chỉ xem hồ sơ nhân sự và dashboard, không có quyền tiền lương',
        color: '#6366F1',
        dataScope: 'department',
        permissions: customPermissions
      });

      expect(newRole).toBeDefined();
      expect(newRole.id).toMatch(/^role-/);
      expect(newRole.code).toBe('ROLE_HR_INTERN');
      expect(newRole.isSystem).toBe(false);
      expect(newRole.permissions.employees.create).toBe(true);
      expect(newRole.permissions.payroll.view).toBe(false);
    });

    it('should update role permissions dynamically', async () => {
      const roles = db.getRoles();
      const targetRole = roles.find((r) => !r.isSystem) || roles[roles.length - 1];

      const updated = db.updateRole(targetRole.id, {
        description: 'Mô tả đã được cập nhật kiểm thử tự động',
        permissions: {
          ...targetRole.permissions,
          payroll: { view: true, create: false, edit: false, delete: false, approve: false, export: false }
        }
      });

      expect(updated).not.toBeNull();
      expect(updated?.description).toBe('Mô tả đã được cập nhật kiểm thử tự động');
      expect(updated?.permissions.payroll.view).toBe(true);
    });

    it('should prevent deletion of system-defined roles', async () => {
      const roles = db.getRoles();
      const superAdmin = roles.find((r) => r.code === 'ROLE_SUPER_ADMIN');
      expect(superAdmin).toBeDefined();

      if (superAdmin) {
        expect(db.deleteRole(superAdmin.id)).toBe(false);
      }
    });
  });

  describe('User Account & Role Allocation', () => {
    it('should fetch user accounts with mapped role information', async () => {
      const users = db.getUserAccounts();
      expect(users.length).toBeGreaterThanOrEqual(5);

      const cuong = users.find((u) => u.employeeCode === 'AMIS-0001');
      expect(cuong).toBeDefined();
      expect(cuong?.roleCode).toBe('ROLE_SUPER_ADMIN');
      expect(cuong?.status).toBe('active');
    });

    it('should lock and unlock user accounts', async () => {
      const users = db.getUserAccounts();
      const testUser = users[users.length - 1];

      // Lock
      const locked = db.updateUserStatus(testUser.id, 'locked');
      expect(locked?.status).toBe('locked');

      // Unlock
      const unlocked = db.updateUserStatus(testUser.id, 'active');
      expect(unlocked?.status).toBe('active');
    });

    it('should assign a new role to an existing user and update role metrics', async () => {
      const roles = db.getRoles();
      const users = db.getUserAccounts();

      const user = users.find((u) => u.employeeCode === 'AMIS-0007'); // Pham Thi Huong Ly
      const cbRole = roles.find((r) => r.code === 'ROLE_CB_SPECIALIST');

      expect(user).toBeDefined();
      expect(cbRole).toBeDefined();

      if (user && cbRole) {
        const updatedUser = db.assignUserRole(user.id, cbRole.id);
        expect(updatedUser?.roleId).toBe(cbRole.id);
        expect(updatedUser?.roleName).toBe(cbRole.name);
      }
    });

    it('should generate a secure temporary password when resetting', async () => {
      const users = db.getUserAccounts();
      const result = db.resetUserPassword(users[0].id);

      expect(result).toBeDefined();
      expect(result.tempPassword).toMatch(/^Amis@[0-9]{6}$/i);
    });
  });

  describe('Security Policies & Audit Trail Logging', () => {
    it('should get and update security policy settings', async () => {
      const settings = db.getSecuritySettings();
      expect(settings).toBeDefined();
      expect(settings.passwordMinLength).toBeGreaterThanOrEqual(8);

      const updated = db.updateSecuritySettings({
        passwordMinLength: 10,
        sessionTimeoutMinutes: 60
      });

      expect(updated.passwordMinLength).toBe(10);
      expect(updated.sessionTimeoutMinutes).toBe(60);
    });

    it('should record immutable audit logs for administrative actions', async () => {
      const initialLogs = db.getAuditLogs();
      const initialCount = initialLogs.length;

      // Perform an action: create audit log
      db.addAuditLog({
        userId: 'emp-01',
        userName: 'Trịnh Văn Cường',
        roleName: 'Quản trị viên Toàn quyền',
        action: 'PERM_CHANGE',
        module: 'admin_rbac',
        description: 'Kiểm thử ghi nhận log audit bảo mật',
        ipAddress: '192.168.1.100',
        status: 'SUCCESS'
      });

      const updatedLogs = db.getAuditLogs();
      expect(updatedLogs.length).toBe(initialCount + 1);
      expect(updatedLogs[0].action).toBe('PERM_CHANGE');
      expect(updatedLogs[0].description).toBe('Kiểm thử ghi nhận log audit bảo mật');
    });
  });

  describe('REST API Endpoints for Admin RBAC', () => {
    it('GET /api/admin/roles should return 200 with role list', async () => {
      const res = await request(app).get('/api/admin/roles');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('POST /api/admin/roles should create role via API', async () => {
      const rolePayload = {
        name: 'Giám Sát Ca Làm Việc',
        code: 'ROLE_SHIFT_SUPERVISOR',
        description: 'Phụ trách duyệt công và ca kíp nhân sự phân xưởng',
        color: '#0D9488',
        dataScope: 'department',
        permissions: {
          dashboard: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
          employees: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
          attendance: { view: true, create: true, edit: true, delete: false, approve: true, export: true },
          leaves: { view: true, create: true, edit: false, delete: false, approve: true, export: false },
          payroll: { view: false, create: false, edit: false, delete: false, approve: false, export: false },
          organization: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
          admin_rbac: { view: false, create: false, edit: false, delete: false, approve: false, export: false },
          settings: { view: false, create: false, edit: false, delete: false, approve: false, export: false }
        }
      };

      const res = await request(app).post('/api/admin/roles').send(rolePayload);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.code).toBe('ROLE_SHIFT_SUPERVISOR');
    });

    it('GET /api/admin/users should return 200 with user account list', async () => {
      const res = await request(app).get('/api/admin/users');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('PATCH /api/admin/users/:id/status should update user status', async () => {
      const usersRes = await request(app).get('/api/admin/users');
      const targetUser = usersRes.body.data[0];

      const res = await request(app)
        .patch(`/api/admin/users/${targetUser.id}/status`)
        .send({ status: 'locked' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('locked');

      // Revert back to active
      await request(app)
        .patch(`/api/admin/users/${targetUser.id}/status`)
        .send({ status: 'active' });
    });

    it('GET /api/admin/audit-logs should return audit trails', async () => {
      const res = await request(app).get('/api/admin/audit-logs');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('GET & PUT /api/admin/security should manage security configurations', async () => {
      const getRes = await request(app).get('/api/admin/security');
      expect(getRes.status).toBe(200);
      expect(getRes.body.success).toBe(true);
      expect(getRes.body.data).toHaveProperty('passwordMinLength');

      const putRes = await request(app)
        .put('/api/admin/security')
        .send({ passwordMinLength: 8, enforce2FA: true });

      expect(putRes.status).toBe(200);
      expect(putRes.body.success).toBe(true);
      expect(putRes.body.data.enforce2FA).toBe(true);
    });
  });
});
