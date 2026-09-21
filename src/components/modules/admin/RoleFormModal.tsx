import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Check, Info } from 'lucide-react';
import { SystemRole, PermissionMatrix, ModulePermissions } from '../../../types';

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (roleData: Partial<SystemRole>) => void;
  initialRole?: SystemRole | null;
}

const emptyPermissions: PermissionMatrix = {
  dashboard: { view: true, create: false, edit: false, delete: false, approve: false, export: false },
  employees: { view: false, create: false, edit: false, delete: false, approve: false, export: false },
  attendance: { view: false, create: false, edit: false, delete: false, approve: false, export: false },
  leaves: { view: false, create: false, edit: false, delete: false, approve: false, export: false },
  payroll: { view: false, create: false, edit: false, delete: false, approve: false, export: false },
  organization: { view: false, create: false, edit: false, delete: false, approve: false, export: false },
  admin_rbac: { view: false, create: false, edit: false, delete: false, approve: false, export: false },
  settings: { view: false, create: false, edit: false, delete: false, approve: false, export: false }
};

const moduleLabels: { [key: string]: string } = {
  dashboard: 'Tổng quan HR (Dashboard)',
  employees: 'Hồ sơ nhân sự (Employees)',
  attendance: 'Chấm công & Ca kíp (Attendance)',
  leaves: 'Đơn từ & Phê duyệt (Leaves)',
  payroll: 'Tiền lương & BHXH (Payroll)',
  organization: 'Cơ cấu tổ chức (Organization)',
  admin_rbac: 'Quản trị & Phân quyền (RBAC)',
  settings: 'Thiết lập tham số (Settings)'
};

const actionLabels: { [key in keyof ModulePermissions]: string } = {
  view: 'Xem',
  create: 'Thêm',
  edit: 'Sửa',
  delete: 'Xóa',
  approve: 'Duyệt',
  export: 'Xuất file'
};

export const RoleFormModal: React.FC<RoleFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialRole
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#0072BC');
  const [dataScope, setDataScope] = useState<'all' | 'department' | 'branch' | 'self'>('department');
  const [permissions, setPermissions] = useState<PermissionMatrix>(emptyPermissions);

  useEffect(() => {
    if (initialRole) {
      setName(initialRole.name);
      setCode(initialRole.code);
      setDescription(initialRole.description);
      setColor(initialRole.color || '#0072BC');
      setDataScope(initialRole.dataScope || 'department');
      setPermissions(initialRole.permissions || emptyPermissions);
    } else {
      setName('');
      setCode('ROLE_');
      setDescription('');
      setColor('#0072BC');
      setDataScope('department');
      setPermissions(emptyPermissions);
    }
  }, [initialRole, isOpen]);

  if (!isOpen) return null;

  const handleToggleAction = (moduleKey: keyof PermissionMatrix, action: keyof ModulePermissions) => {
    setPermissions((prev) => ({
      ...prev,
      [moduleKey]: {
        ...prev[moduleKey],
        [action]: !prev[moduleKey][action]
      }
    }));
  };

  const handleToggleRow = (moduleKey: keyof PermissionMatrix) => {
    const row = permissions[moduleKey];
    const allChecked = Object.values(row).every(Boolean);
    const newVal = !allChecked;
    setPermissions((prev) => ({
      ...prev,
      [moduleKey]: {
        view: newVal,
        create: newVal,
        edit: newVal,
        delete: newVal,
        approve: newVal,
        export: newVal
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      code: code.trim().toUpperCase(),
      description,
      color,
      dataScope,
      permissions
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-sm"
              style={{ backgroundColor: color }}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">
                {initialRole ? `Chỉnh sửa Vai trò: ${initialRole.name}` : 'Thêm mới Vai trò Phân quyền (Custom Role)'}
              </h3>
              <p className="text-[11px] text-slate-400">
                Thiết lập quyền truy cập chi tiết theo từng phân hệ và phạm vi dữ liệu
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          {/* Basic Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-slate-700 font-bold">Tên vai trò *</label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Chuyên viên C&B Cao cấp"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-[#0072BC]/20 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 font-bold">Mã vai trò (Role Code) *</label>
              <input
                type="text"
                required
                disabled={Boolean(initialRole?.isSystem)}
                placeholder="ROLE_SENIOR_CB"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-800 focus:ring-2 focus:ring-[#0072BC]/20 focus:outline-none uppercase disabled:bg-slate-100 disabled:text-slate-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 font-bold">Phạm vi dữ liệu (Data Scope) *</label>
              <select
                value={dataScope}
                onChange={(e) => setDataScope(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none"
              >
                <option value="all">Toàn bộ công ty (All Data)</option>
                <option value="department">Phòng ban trực thuộc (Department Scope)</option>
                <option value="branch">Chi nhánh / Khối công tác (Branch Scope)</option>
                <option value="self">Chỉ dữ liệu cá nhân (Self-Service Only)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3 space-y-1">
              <label className="text-slate-700 font-semibold">Mô tả chức trách & phạm vi nghiệp vụ:</label>
              <input
                type="text"
                placeholder="Mô tả tóm tắt quyền hạn và trách nhiệm của vai trò này..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 font-semibold">Màu sắc nhận diện:</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                />
                <span className="font-mono text-slate-600 font-bold uppercase">{color}</span>
              </div>
            </div>
          </div>

          {/* Granular Permission Matrix Table */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-xs">
                  Ma Trận Phân Quyền Chi Tiết (Granular Permission Matrix)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Tích chọn các quyền được phép thao tác cho từng phân hệ trong hệ thống
                </p>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                <Info className="w-3.5 h-3.5 text-[#0072BC]" />
                <span>Nhấp tên phân hệ để Bật/Tắt toàn bộ hàng</span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <th className="py-2.5 px-4 min-w-[200px]">Phân hệ hệ thống</th>
                    {(['view', 'create', 'edit', 'delete', 'approve', 'export'] as Array<keyof ModulePermissions>).map(
                      (act) => (
                        <th key={act} className="py-2.5 px-3 text-center min-w-[65px]">
                          {actionLabels[act]}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(Object.keys(moduleLabels) as Array<keyof PermissionMatrix>).map((modKey) => {
                    const row = permissions[modKey];
                    return (
                      <tr key={modKey} className="hover:bg-slate-50 transition">
                        <td
                          onClick={() => handleToggleRow(modKey)}
                          className="py-2.5 px-4 font-semibold text-slate-800 cursor-pointer hover:text-[#0072BC] select-none"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#0072BC]"></span>
                            <span>{moduleLabels[modKey]}</span>
                          </div>
                        </td>

                        {(['view', 'create', 'edit', 'delete', 'approve', 'export'] as Array<keyof ModulePermissions>).map(
                          (act) => (
                            <td key={act} className="py-2.5 px-3 text-center">
                              <label className="inline-flex items-center justify-center cursor-pointer p-1">
                                <input
                                  type="checkbox"
                                  checked={Boolean(row?.[act])}
                                  onChange={() => handleToggleAction(modKey, act)}
                                  className="w-4 h-4 text-[#0072BC] rounded border-slate-300 focus:ring-[#0072BC] cursor-pointer"
                                />
                              </label>
                            </td>
                          )
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 font-semibold rounded-lg hover:bg-slate-50 transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#0072BC] hover:bg-[#005A96] text-white font-bold rounded-lg shadow-sm transition cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{initialRole ? 'Lưu Cập Nhật Phân Quyền' : 'Tạo Vai Trò Mới'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
