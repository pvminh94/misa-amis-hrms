import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole, PermissionAction, PermissionMatrix, SystemRole } from '../types';

export interface AuthUser {
  id: string;
  name: string;
  code: string;
  title: string;
  department: string;
  role: UserRole;
  roleId: string;
  roleName: string;
  roleCode: string;
  avatar: string;
  email: string;
  permissions?: PermissionMatrix;
}

interface AuthContextType {
  currentUser: AuthUser;
  role: UserRole;
  setRole: (role: UserRole) => void;
  switchUser: (role: UserRole) => void;
  hasPermission: (module: string, action: PermissionAction) => boolean;
}

const defaultPermissions: PermissionMatrix = {
  dashboard: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
  employees: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
  attendance: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
  leaves: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
  payroll: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
  organization: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
  admin_rbac: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
  settings: { view: true, create: true, edit: true, delete: true, approve: true, export: true }
};

const defaultUsers: Record<string, AuthUser> = {
  admin: {
    id: 'emp-01',
    name: 'Trịnh Văn Cường',
    code: 'AMIS-0001',
    title: 'Tổng Giám Đốc / Admin',
    department: 'Ban Giám Đốc',
    role: 'admin',
    roleId: 'role-super-admin',
    roleName: 'Quản trị viên Toàn quyền',
    roleCode: 'ROLE_SUPER_ADMIN',
    email: 'cuongtv@amis.vn',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    permissions: defaultPermissions
  },
  manager: {
    id: 'emp-02',
    name: 'Vũ Quốc Thái',
    code: 'AMIS-0002',
    title: 'Phó TGĐ / Trưởng Khối Tech',
    department: 'Khối Công Nghệ & Kỹ Thuật',
    role: 'manager',
    roleId: 'role-dept-head',
    roleName: 'Trưởng bộ phận / Quản lý Khối',
    roleCode: 'ROLE_DEPT_HEAD',
    email: 'thaivq@amis.vn',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
      employees: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
      attendance: { view: true, create: true, edit: true, delete: false, approve: true, export: true },
      leaves: { view: true, create: true, edit: false, delete: false, approve: true, export: false },
      payroll: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
      organization: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
      admin_rbac: { view: false, create: false, edit: false, delete: false, approve: false, export: false },
      settings: { view: false, create: false, edit: false, delete: false, approve: false, export: false }
    }
  },
  employee: {
    id: 'emp-07',
    name: 'Phạm Thị Hương Ly',
    code: 'AMIS-0007',
    title: 'Lập trình viên Frontend',
    department: 'Khối Công Nghệ & Kỹ Thuật',
    role: 'employee',
    roleId: 'role-employee',
    roleName: 'Nhân viên Tiêu chuẩn',
    roleCode: 'ROLE_EMPLOYEE',
    email: 'lypth@amis.vn',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
      employees: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
      attendance: { view: true, create: true, edit: false, delete: false, approve: false, export: false },
      leaves: { view: true, create: true, edit: false, delete: false, approve: false, export: false },
      payroll: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
      organization: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
      admin_rbac: { view: false, create: false, edit: false, delete: false, approve: false, export: false },
      settings: { view: false, create: false, edit: false, delete: false, approve: false, export: false }
    }
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('admin');
  const [currentUser, setCurrentUser] = useState<AuthUser>(defaultUsers.admin);

  const switchUser = (newRole: UserRole) => {
    setRoleState(newRole);
    if (defaultUsers[newRole]) {
      setCurrentUser(defaultUsers[newRole]);
    }
  };

  const hasPermission = (module: string, action: PermissionAction): boolean => {
    if (role === 'admin' || currentUser.roleCode === 'ROLE_SUPER_ADMIN') {
      return true;
    }
    if (!currentUser.permissions) return false;
    const modPerm = (currentUser.permissions as any)[module];
    if (!modPerm) return false;
    return Boolean(modPerm[action]);
  };

  return (
    <AuthContext.Provider value={{ currentUser, role, setRole: setRoleState, switchUser, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
