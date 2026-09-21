import React, { useState } from 'react';
import { X, UserPlus, Shield, KeyRound, Check, RefreshCw, UserCheck } from 'lucide-react';
import { SystemRole, Employee, UserAccount } from '../../../types';

interface UserCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: any) => Promise<void>;
  roles: SystemRole[];
  employees: Employee[];
  existingUsers: UserAccount[];
}

export const UserCreateModal: React.FC<UserCreateModalProps> = ({
  isOpen,
  onClose,
  onSave,
  roles,
  employees,
  existingUsers
}) => {
  const [mode, setMode] = useState<'link_employee' | 'standalone'>('link_employee');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('Amis@123456');
  const [selectedRoleId, setSelectedRoleId] = useState(roles[0]?.id || '');
  const [status, setStatus] = useState<'active' | 'locked'>('active');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  // Filter employees who do not yet have a linked user account
  const existingEmpIds = new Set(existingUsers.map((u) => u.employeeId));
  const unlinkedEmployees = employees.filter((e) => !existingEmpIds.has(e.id));

  const handleSelectEmployee = (empId: string) => {
    setSelectedEmployeeId(empId);
    const emp = employees.find((e) => e.id === empId);
    if (emp) {
      setFullName(emp.fullName);
      setEmail(emp.email);
      const suggestedUser = emp.email ? emp.email.split('@')[0] : `user_${emp.code.toLowerCase().replace('-', '')}`;
      setUsername(suggestedUser);
    }
  };

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    let res = 'Amis@';
    for (let i = 0; i < 6; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(res);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await onSave({
        employeeId: mode === 'link_employee' ? selectedEmployeeId : undefined,
        fullName,
        email,
        username,
        password,
        roleId: selectedRoleId,
        status
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0072BC] flex items-center justify-center font-bold text-white shadow-sm">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Khởi Tạo Tài Khoản Người Dùng Mới</h3>
              <p className="text-[11px] text-slate-400">
                Cấp tài khoản đăng nhập và gán vai trò phân quyền trên hệ thống AMIS HRM
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Mode Tabs */}
          <div className="flex rounded-lg bg-slate-100 p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => setMode('link_employee')}
              className={`flex-1 py-1.5 rounded-md font-semibold text-center transition cursor-pointer ${
                mode === 'link_employee' ? 'bg-white shadow-xs text-[#0072BC]' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Liên kết nhân sự sẵn có
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('standalone');
                setSelectedEmployeeId('');
              }}
              className={`flex-1 py-1.5 rounded-md font-semibold text-center transition cursor-pointer ${
                mode === 'standalone' ? 'bg-white shadow-xs text-[#0072BC]' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tài khoản Quản trị viên độc lập
            </button>
          </div>

          {mode === 'link_employee' && (
            <div className="space-y-1">
              <label className="text-slate-700 font-bold block">
                Chọn nhân sự chưa có tài khoản đăng nhập *
              </label>
              <select
                required
                value={selectedEmployeeId}
                onChange={(e) => handleSelectEmployee(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-[#0072BC]/20 focus:outline-none"
              >
                <option value="">-- Chọn nhân sự ({unlinkedEmployees.length} nhân sự sẵn sàng) --</option>
                {unlinkedEmployees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.fullName} ({emp.code}) - {emp.departmentName}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-700 font-bold block">Họ và tên *</label>
              <input
                type="text"
                required
                placeholder="Nguyễn Văn A"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 font-bold block">Email liên hệ *</label>
              <input
                type="email"
                required
                placeholder="anv@amis.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-700 font-bold block">Tên đăng nhập (Username) *</label>
              <input
                type="text"
                required
                placeholder="anv"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-800 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-slate-700 font-bold block">Mật khẩu khởi tạo *</label>
                <button
                  type="button"
                  onClick={handleGeneratePassword}
                  className="text-[10px] text-[#0072BC] hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  <span>Tạo ngẫu nhiên</span>
                </button>
              </div>
              <input
                type="text"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-[#0072BC] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-700 font-bold block">Vai trò phân quyền hệ thống *</label>
            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold focus:outline-none"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.code}) - Phạm vi: {r.dataScope === 'all' ? 'Toàn công ty' : 'Phòng ban'}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-700 font-bold block">Trạng thái tài khoản ban đầu:</label>
            <div className="flex items-center gap-4 pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={status === 'active'}
                  onChange={() => setStatus('active')}
                  className="text-[#0072BC] focus:ring-[#0072BC]"
                />
                <span className="font-semibold text-emerald-700">Kích hoạt ngay (Active)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="locked"
                  checked={status === 'locked'}
                  onChange={() => setStatus('locked')}
                  className="text-rose-600 focus:ring-rose-500"
                />
                <span className="font-semibold text-rose-700">Tạm khóa (Locked)</span>
              </label>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 font-semibold rounded-lg hover:bg-slate-50 transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-[#0072BC] hover:bg-[#005A96] text-white font-bold rounded-lg shadow-sm transition cursor-pointer flex items-center gap-1.5 disabled:opacity-60"
            >
              <UserCheck className="w-4 h-4" />
              <span>{saving ? 'Đang tạo...' : 'Tạo Tài Khoản Người Dùng'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
