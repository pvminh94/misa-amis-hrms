import React, { useState, useEffect } from 'react';
import { X, Save, User, Briefcase, DollarSign, Building, CreditCard, KeyRound, ShieldCheck, Sparkles } from 'lucide-react';
import { Employee, Department, Position } from '../../../types';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employeeData: Partial<Employee>) => Promise<void>;
  initialData?: Employee | null;
  departments: Department[];
  positions: Position[];
}

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  departments,
  positions
}) => {
  const [formData, setFormData] = useState<Partial<Employee>>({
    fullName: '',
    gender: 'Nam',
    dob: '1995-01-01',
    idCard: '',
    idCardDate: '2022-01-01',
    idCardPlace: 'Cục Cảnh sát QLHC về TTXH',
    phone: '',
    email: '',
    address: '',
    hometown: '',
    education: 'Đại học',
    departmentId: departments[0]?.id || '',
    positionId: positions[0]?.id || '',
    joinDate: '2026-09-01',
    contractType: 'Hợp đồng xác định thời hạn 12 tháng',
    status: 'active',
    bankAccount: {
      bankName: 'Vietcombank',
      accountNumber: '',
      branch: 'Hà Nội'
    },
    salary: {
      baseSalary: 18000000,
      allowanceResponsibility: 2000000,
      allowanceLunch: 1500000,
      allowanceGas: 800000,
      dependents: 0,
      taxCode: '',
      insuranceBookNumber: ''
    }
  });

  const [createUserAccount, setCreateUserAccount] = useState(true);
  const [userRole, setUserRole] = useState('role-employee');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('Amis@123456');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        fullName: '',
        gender: 'Nam',
        dob: '1995-01-01',
        idCard: '',
        idCardDate: '2022-01-01',
        idCardPlace: 'Cục Cảnh sát QLHC về TTXH',
        phone: '',
        email: '',
        address: '',
        hometown: '',
        education: 'Đại học',
        departmentId: departments[0]?.id || '',
        positionId: positions[0]?.id || '',
        joinDate: '2026-09-01',
        contractType: 'Hợp đồng xác định thời hạn 12 tháng',
        status: 'active',
        bankAccount: {
          bankName: 'Vietcombank',
          accountNumber: '',
          branch: 'Hà Nội'
        },
        salary: {
          baseSalary: 18000000,
          allowanceResponsibility: 2000000,
          allowanceLunch: 1500000,
          allowanceGas: 800000,
          dependents: 0,
          taxCode: '',
          insuranceBookNumber: ''
        }
      });
    }
    setError('');
  }, [initialData, departments, positions, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName?.trim()) {
      setError('Vui lòng nhập họ và tên nhân viên');
      return;
    }
    if (!formData.departmentId) {
      setError('Vui lòng chọn phòng ban trực thuộc');
      return;
    }

    try {
      setSaving(true);
      await onSave({
        ...formData,
        ...(initialData
          ? {}
          : {
              createUserAccount,
              roleId: userRole,
              username: username || (formData.email ? formData.email.split('@')[0] : undefined),
              password: password || 'Amis@123456'
            })
      } as any);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Lỗi lưu thông tin');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-[#0072BC] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <h2 className="font-bold text-base">
              {initialData ? `Chỉnh sửa hồ sơ: ${initialData.fullName}` : 'Thêm mới nhân viên vào hệ thống'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10 text-white/80 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg font-medium">
              {error}
            </div>
          )}

          {/* Section 1: Thông tin cơ bản */}
          <div className="space-y-3">
            <div className="font-bold text-slate-800 text-xs uppercase tracking-wider text-[#0072BC] flex items-center gap-2 border-b pb-1">
              <User className="w-4 h-4" />
              <span>1. Thông tin cá nhân & Liên hệ</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">
                  Họ và tên nhân viên <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName || ''}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0072BC]/20 focus:border-[#0072BC]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Giới tính</label>
                <select
                  value={formData.gender || 'Nam'}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Nam' | 'Nữ' })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0072BC]/20 focus:border-[#0072BC]"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Ngày sinh</label>
                <input
                  type="date"
                  value={formData.dob || '1995-01-01'}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0912xxxxxx"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Email công ty</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ten@amis.vn"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Số CCCD (12 số)</label>
                <input
                  type="text"
                  value={formData.idCard || ''}
                  onChange={(e) => setFormData({ ...formData, idCard: e.target.value })}
                  placeholder="001095000000"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">Địa chỉ thường trú</label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Số nhà, đường, quận/huyện, tỉnh/thành"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Công việc & Vị trí */}
          <div className="space-y-3">
            <div className="font-bold text-slate-800 text-xs uppercase tracking-wider text-[#0072BC] flex items-center gap-2 border-b pb-1">
              <Briefcase className="w-4 h-4" />
              <span>2. Vị trí & Hợp đồng lao động</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Phòng ban <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.departmentId || ''}
                  onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Chức danh <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.positionId || ''}
                  onChange={(e) => setFormData({ ...formData, positionId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  {positions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Trạng thái công tác</label>
                <select
                  value={formData.status || 'active'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="active">Đang làm việc (Chính thức)</option>
                  <option value="probation">Thử việc</option>
                  <option value="leave">Nghỉ chế độ / thai sản</option>
                  <option value="resigned">Đã nghỉ việc</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Ngày vào làm</label>
                <input
                  type="date"
                  value={formData.joinDate || '2026-09-01'}
                  onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">Loại hợp đồng</label>
                <select
                  value={formData.contractType || 'Hợp đồng xác định thời hạn 12 tháng'}
                  onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="Không xác định thời hạn">Hợp đồng không xác định thời hạn</option>
                  <option value="Hợp đồng xác định thời hạn 36 tháng">Hợp đồng xác định thời hạn 36 tháng</option>
                  <option value="Hợp đồng xác định thời hạn 12 tháng">Hợp đồng xác định thời hạn 12 tháng</option>
                  <option value="Hợp đồng thử việc">Hợp đồng thử việc</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Tiền lương & BHXH */}
          <div className="space-y-3">
            <div className="font-bold text-slate-800 text-xs uppercase tracking-wider text-[#0072BC] flex items-center gap-2 border-b pb-1">
              <DollarSign className="w-4 h-4" />
              <span>3. Mức lương cơ bản & Phúc lợi (VND)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Lương cơ bản (BHXH)</label>
                <input
                  type="number"
                  step="500000"
                  value={formData.salary?.baseSalary || 15000000}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      salary: { ...formData.salary!, baseSalary: Number(e.target.value) }
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Phụ cấp trách nhiệm</label>
                <input
                  type="number"
                  step="500000"
                  value={formData.salary?.allowanceResponsibility || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      salary: { ...formData.salary!, allowanceResponsibility: Number(e.target.value) }
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Phụ cấp ăn trưa</label>
                <input
                  type="number"
                  step="100000"
                  value={formData.salary?.allowanceLunch || 1500000}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      salary: { ...formData.salary!, allowanceLunch: Number(e.target.value) }
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Số người phụ thuộc</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.salary?.dependents || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      salary: { ...formData.salary!, dependents: Number(e.target.value) }
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Mã số thuế cá nhân</label>
                <input
                  type="text"
                  value={formData.salary?.taxCode || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      salary: { ...formData.salary!, taxCode: e.target.value }
                    })
                  }
                  placeholder="8091xxxxxx"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Số sổ BHXH</label>
                <input
                  type="text"
                  value={formData.salary?.insuranceBookNumber || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      salary: { ...formData.salary!, insuranceBookNumber: e.target.value }
                    })
                  }
                  placeholder="7912xxxxxx"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Tài khoản ngân hàng nhận lương */}
          <div className="space-y-3">
            <div className="font-bold text-slate-800 text-xs uppercase tracking-wider text-[#0072BC] flex items-center gap-2 border-b pb-1">
              <CreditCard className="w-4 h-4" />
              <span>4. Tài khoản ngân hàng chi trả lương</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Ngân hàng</label>
                <select
                  value={formData.bankAccount?.bankName || 'Vietcombank'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bankAccount: { ...formData.bankAccount!, bankName: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="Vietcombank">Vietcombank</option>
                  <option value="Techcombank">Techcombank</option>
                  <option value="MBBank">MBBank (Quân Đội)</option>
                  <option value="BIDV">BIDV</option>
                  <option value="VietinBank">VietinBank</option>
                  <option value="ACB">ACB</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Số tài khoản</label>
                <input
                  type="text"
                  value={formData.bankAccount?.accountNumber || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bankAccount: { ...formData.bankAccount!, accountNumber: e.target.value }
                    })
                  }
                  placeholder="001100xxxxxxx"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Chi nhánh mở thẻ</label>
                <input
                  type="text"
                  value={formData.bankAccount?.branch || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bankAccount: { ...formData.bankAccount!, branch: e.target.value }
                    })
                  }
                  placeholder="Sở Giao Dịch Hà Nội"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Khởi tạo tài khoản đăng nhập & Thiết lập hệ thống */}
          {!initialData && (
            <div className="space-y-3 p-4 bg-blue-50/50 rounded-xl border border-blue-200">
              <div className="font-bold text-slate-800 text-xs uppercase tracking-wider text-[#0072BC] flex items-center justify-between border-b border-blue-200 pb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0072BC]" />
                  <span>5. Khởi tạo tài khoản & Cấp quyền hệ thống (Tự động Onboarding)</span>
                </div>
                <span className="text-[10px] bg-blue-100 text-[#0072BC] px-2 py-0.5 rounded-full font-bold">
                  AMIS RBAC Provisioning
                </span>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={createUserAccount}
                  onChange={(e) => setCreateUserAccount(e.target.checked)}
                  className="w-4 h-4 text-[#0072BC] rounded border-slate-300"
                />
                <span className="font-bold text-slate-900 text-xs">
                  Tự động khởi tạo tài khoản người dùng đăng nhập hệ thống AMIS HRM cho nhân sự này
                </span>
              </label>

              {createUserAccount && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Tên đăng nhập (Username)</label>
                    <input
                      type="text"
                      placeholder={formData.email ? formData.email.split('@')[0] : 'Tự động theo email'}
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Mật khẩu khởi tạo</label>
                    <input
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono font-bold text-[#0072BC]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Vai trò phân quyền (Role)</label>
                    <select
                      value={userRole}
                      onChange={(e) => setUserRole(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-semibold"
                    >
                      <option value="role-employee">Nhân viên Tiêu chuẩn (Self-Service)</option>
                      <option value="role-dept-head">Trưởng bộ phận (Manager Scope)</option>
                      <option value="role-cb-specialist">Chuyên viên C&B (HR & Payroll)</option>
                      <option value="role-super-admin">Quản trị viên Toàn quyền (Super Admin)</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>
                  Hệ thống sẽ tự động tạo Hợp đồng lao động đầu tiên, phân ca chuẩn 22 ngày công trong tháng và tạo dòng trên Bảng lương hiện tại.
                </span>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-lg text-xs transition cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-2 bg-[#0072BC] hover:bg-[#005A96] text-white font-semibold rounded-lg text-xs shadow-sm flex items-center gap-1.5 transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Đang lưu...' : 'Lưu hồ sơ'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
