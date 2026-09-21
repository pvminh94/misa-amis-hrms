import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole, PermissionAction, PermissionMatrix, SystemRole } from '../types';
import { api } from '../services/api';

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
  username?: string;
  permissions?: PermissionMatrix;
}

interface AuthContextType {
  currentUser: AuthUser;
  role: UserRole;
  isAuthenticated: boolean;
  login: (username: string, password?: string) => Promise<void>;
  quickLoginAs: (userRole: 'admin' | 'manager' | 'employee' | 'cb_specialist') => void;
  logout: () => Promise<void>;
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

export const defaultUsers: Record<string, AuthUser> = {
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
    username: 'cuongtv',
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
    username: 'thaivq',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
      employees: { view: true, create: true, edit: false, delete: false, approve: false, export: false },
      attendance: { view: true, create: true, edit: true, delete: false, approve: true, export: true },
      leaves: { view: true, create: true, edit: false, delete: false, approve: true, export: false },
      payroll: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
      organization: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
      admin_rbac: { view: false, create: false, edit: false, delete: false, approve: false, export: false },
      settings: { view: false, create: false, edit: false, delete: false, approve: false, export: false }
    }
  },
  cb_specialist: {
    id: 'emp-03',
    name: 'Nguyễn Thị Thu Hằng',
    code: 'AMIS-0003',
    title: 'Chuyên viên C&B / Tiền lương',
    department: 'Phòng Hành Chính Nhân Sự',
    role: 'manager',
    roleId: 'role-cb-specialist',
    roleName: 'Chuyên viên Tiền lương & C&B',
    roleCode: 'ROLE_CB_SPECIALIST',
    email: 'hangntt@amis.vn',
    username: 'hangntt',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false, approve: false, export: true },
      employees: { view: true, create: true, edit: true, delete: false, approve: false, export: true },
      attendance: { view: true, create: true, edit: true, delete: false, approve: true, export: true },
      leaves: { view: true, create: true, edit: true, delete: false, approve: true, export: true },
      payroll: { view: true, create: true, edit: true, delete: true, approve: true, export: true },
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
    username: 'lypth',
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
  // Check if session was saved previously
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('amis_auth') === 'true';
  });

  const [currentUser, setCurrentUser] = useState<AuthUser>(() => {
    const saved = localStorage.getItem('amis_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return defaultUsers.admin;
  });

  const [role, setRoleState] = useState<UserRole>(() => {
    return (currentUser.role as UserRole) || 'admin';
  });

  // Login action
  const login = async (username: string, password?: string) => {
    try {
      const res = await api.login(username, password);
      const userAcc = res.user;
      const roleItem = res.role;
      const appUser: AuthUser = {
        id: userAcc.employeeId || userAcc.id,
        name: userAcc.fullName,
        code: userAcc.employeeCode,
        title: userAcc.positionTitle,
        department: userAcc.departmentName,
        role: roleItem.code === 'ROLE_SUPER_ADMIN' ? 'admin' : roleItem.code === 'ROLE_DEPT_HEAD' ? 'manager' : 'employee',
        roleId: roleItem.id,
        roleName: roleItem.name,
        roleCode: roleItem.code,
        email: userAcc.email,
        username: userAcc.username,
        avatar: userAcc.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        permissions: res.permissions || defaultPermissions
      };

      setCurrentUser(appUser);
      setRoleState(appUser.role);
      setIsAuthenticated(true);
      localStorage.setItem('amis_auth', 'true');
      localStorage.setItem('amis_user', JSON.stringify(appUser));
    } catch (err: any) {
      throw err;
    }
  };

  // Quick 1-click Demo Login
  const quickLoginAs = (userRole: 'admin' | 'manager' | 'employee' | 'cb_specialist') => {
    const target = defaultUsers[userRole] || defaultUsers.admin;
    setCurrentUser(target);
    setRoleState(target.role);
    setIsAuthenticated(true);
    localStorage.setItem('amis_auth', 'true');
    localStorage.setItem('amis_user', JSON.stringify(target));
  };

  // Logout action
  const logout = async () => {
    try {
      await api.logout(currentUser.id);
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    localStorage.removeItem('amis_auth');
    localStorage.removeItem('amis_user');
  };

  const switchUser = (newRole: UserRole) => {
    setRoleState(newRole);
    if (defaultUsers[newRole]) {
      setCurrentUser(defaultUsers[newRole]);
      localStorage.setItem('amis_user', JSON.stringify(defaultUsers[newRole]));
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
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        isAuthenticated,
        login,
        quickLoginAs,
        logout,
        setRole: setRoleState,
        switchUser,
        hasPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
