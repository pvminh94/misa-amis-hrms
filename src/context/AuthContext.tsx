import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from '../types';

interface AuthUser {
  id: string;
  name: string;
  code: string;
  title: string;
  department: string;
  role: UserRole;
  avatar: string;
}

interface AuthContextType {
  currentUser: AuthUser;
  role: UserRole;
  setRole: (role: UserRole) => void;
  switchUser: (role: UserRole) => void;
}

const defaultUsers: Record<UserRole, AuthUser> = {
  admin: {
    id: 'emp-01',
    name: 'Trịnh Văn Cường',
    code: 'MISA-0001',
    title: 'Tổng Giám Đốc / Admin',
    department: 'Ban Giám Đốc',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  manager: {
    id: 'emp-02',
    name: 'Vũ Quốc Thái',
    code: 'MISA-0002',
    title: 'Phó TGĐ / Trưởng Khối Tech',
    department: 'Khối Công Nghệ & Kỹ Thuật',
    role: 'manager',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  employee: {
    id: 'emp-07',
    name: 'Phạm Thị Hương Ly',
    code: 'MISA-0007',
    title: 'Lập trình viên Frontend',
    department: 'Khối Công Nghệ & Kỹ Thuật',
    role: 'employee',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('admin');
  const [currentUser, setCurrentUser] = useState<AuthUser>(defaultUsers.admin);

  const switchUser = (newRole: UserRole) => {
    setRoleState(newRole);
    setCurrentUser(defaultUsers[newRole]);
  };

  return (
    <AuthContext.Provider value={{ currentUser, role, setRole: setRoleState, switchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
