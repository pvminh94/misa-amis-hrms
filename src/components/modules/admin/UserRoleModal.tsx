import React, { useState } from 'react';
import { X, Shield, UserCheck, Check } from 'lucide-react';
import { UserAccount, SystemRole } from '../../../types';

interface UserRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount | null;
  roles: SystemRole[];
  onAssign: (userId: string, roleId: string) => void;
}

export const UserRoleModal: React.FC<UserRoleModalProps> = ({
  isOpen,
  onClose,
  user,
  roles,
  onAssign
}) => {
  const [selectedRoleId, setSelectedRoleId] = useState(user?.roleId || roles[0]?.id || '');

  if (!isOpen || !user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAssign(user.id, selectedRoleId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#0072BC]" />
            <div>
              <h3 className="font-bold text-xs">Phân Bổ Vai Trò Người Dùng</h3>
              <p className="text-[10px] text-slate-400">
                {user.fullName} ({user.employeeCode})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="text-[11px] text-slate-500">Phòng ban: <strong className="text-slate-800">{user.departmentName}</strong></div>
            <div className="text-[11px] text-slate-500">Email: <strong className="text-slate-800 font-mono">{user.email}</strong></div>
            <div className="text-[11px] text-slate-500">Vai trò hiện tại: <span className="font-bold text-[#0072BC]">{user.roleName}</span></div>
          </div>

          <div className="space-y-2">
            <label className="text-slate-700 font-bold block">Chọn vai trò phân quyền mới:</label>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {roles.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setSelectedRoleId(r.id)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    selectedRoleId === r.id
                      ? 'border-[#0072BC] bg-blue-50/50 ring-2 ring-[#0072BC]/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }}></span>
                      <span className="font-bold text-slate-900">{r.name}</span>
                    </div>
                    <div className="text-[10px] text-slate-500">{r.description}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Phạm vi: {r.dataScope === 'all' ? 'Toàn công ty' : r.dataScope === 'department' ? 'Phòng ban' : 'Cá nhân'}
                    </div>
                  </div>
                  {selectedRoleId === r.id && <Check className="w-4 h-4 text-[#0072BC]" />}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-slate-200 text-slate-600 font-semibold rounded-lg hover:bg-slate-50 transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#0072BC] hover:bg-[#005A96] text-white font-bold rounded-lg shadow-sm transition cursor-pointer flex items-center gap-1.5"
            >
              <UserCheck className="w-4 h-4" />
              <span>Gán Vai Trò</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
