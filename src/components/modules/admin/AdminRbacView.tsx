import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Users,
  UserCheck,
  Lock,
  Unlock,
  Key,
  History,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Download,
  Info,
  Check,
  X,
  Sliders,
  Globe,
  Smartphone,
  Eye,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import {
  SystemRole,
  UserAccount,
  AuditLog,
  SecuritySetting,
  PermissionMatrix,
  ModulePermissions
} from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { api } from '../../../services/api';
import { RoleFormModal } from './RoleFormModal';
import { UserRoleModal } from './UserRoleModal';
import { UserCreateModal } from './UserCreateModal';
import { Employee } from '../../../types';

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

export const AdminRbacView: React.FC = () => {
  const { role: userRole } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'roles' | 'users' | 'audit' | 'security'>('roles');

  // Core Data
  const [roles, setRoles] = useState<SystemRole[]>([]);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [securitySettings, setSecuritySettings] = useState<SecuritySetting | null>(null);

  // Selection & Filters
  const [selectedRole, setSelectedRole] = useState<SystemRole | null>(null);
  const [searchUser, setSearchUser] = useState('');
  const [selectedUserRoleFilter, setSelectedUserRoleFilter] = useState('all');
  const [searchAudit, setSearchAudit] = useState('');
  const [selectedAuditModule, setSelectedAuditModule] = useState('all');

  // Modals
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isUserCreateModalOpen, setIsUserCreateModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<SystemRole | null>(null);
  const [selectedUserForRole, setSelectedUserForRole] = useState<UserAccount | null>(null);
  const [tempPasswordModal, setTempPasswordModal] = useState<{
    userName: string;
    tempPass: string;
  } | null>(null);

  // Load all RBAC data
  const loadRbacData = async () => {
    try {
      const [rRes, uRes, aRes, sRes, eRes] = await Promise.all([
        api.getRoles(),
        api.getUserAccounts(),
        api.getAuditLogs(),
        api.getSecuritySettings(),
        api.getEmployees()
      ]);
      setRoles(rRes);
      setUsers(uRes);
      setAuditLogs(aRes);
      setSecuritySettings(sRes);
      setEmployees(eRes);
      if (!selectedRole && rRes.length > 0) {
        setSelectedRole(rRes[0]);
      }
    } catch (err: any) {
      console.error('Error loading RBAC data:', err);
    }
  };

  useEffect(() => {
    loadRbacData();
  }, []);

  // Role Handlers
  const handleSaveRole = async (roleData: Partial<SystemRole>) => {
    try {
      if (editingRole) {
        await api.updateRole(editingRole.id, roleData);
        showToast(`Đã cập nhật cấu hình vai trò ${roleData.name}`, 'success');
      } else {
        await api.createRole(roleData);
        showToast(`Đã thêm mới vai trò phân quyền ${roleData.name}`, 'success');
      }
      setIsRoleModalOpen(false);
      setEditingRole(null);
      loadRbacData();
    } catch (err: any) {
      showToast(err.message || 'Lỗi lưu vai trò', 'error');
    }
  };

  const handleDeleteRole = async (roleItem: SystemRole) => {
    if (roleItem.isSystem) {
      showToast('Không thể xóa vai trò mặc định của hệ thống', 'error');
      return;
    }
    if (confirm(`Bạn có chắc chắn muốn xóa vai trò "${roleItem.name}" không?`)) {
      try {
        await api.deleteRole(roleItem.id);
        showToast('Đã xóa vai trò phân quyền', 'success');
        if (selectedRole?.id === roleItem.id) {
          setSelectedRole(roles[0] || null);
        }
        loadRbacData();
      } catch (err: any) {
        showToast(err.message || 'Lỗi xóa vai trò', 'error');
      }
    }
  };

  // User Handlers
  const handleCreateUser = async (payload: any) => {
    try {
      await api.createUserAccount(payload);
      showToast(`Đã tạo tài khoản cho ${payload.fullName} thành công`, 'success');
      setIsUserCreateModalOpen(false);
      loadRbacData();
    } catch (err: any) {
      showToast(err.message || 'Lỗi tạo tài khoản người dùng', 'error');
    }
  };

  const handleToggleUserStatus = async (user: UserAccount) => {
    const newStatus = user.status === 'active' ? 'locked' : 'active';
    try {
      await api.updateUserStatus(user.id, newStatus);
      showToast(
        newStatus === 'locked'
          ? `Đã khóa tài khoản của ${user.fullName}`
          : `Đã mở khóa tài khoản của ${user.fullName}`,
        'info'
      );
      loadRbacData();
    } catch (err: any) {
      showToast(err.message || 'Lỗi đổi trạng thái tài khoản', 'error');
    }
  };

  const handleAssignRole = async (userId: string, roleId: string) => {
    try {
      await api.assignUserRole(userId, roleId);
      showToast('Đã cập nhật vai trò người dùng thành công', 'success');
      setSelectedUserForRole(null);
      loadRbacData();
    } catch (err: any) {
      showToast(err.message || 'Lỗi phân vai trò', 'error');
    }
  };

  const handleResetPassword = async (user: UserAccount) => {
    try {
      const res = await api.resetUserPassword(user.id);
      setTempPasswordModal({
        userName: user.fullName,
        tempPass: res.tempPassword
      });
      showToast(`Đã cấp mật khẩu tạm thời mới cho ${user.fullName}`, 'success');
      loadRbacData();
    } catch (err: any) {
      showToast(err.message || 'Lỗi cấp mật khẩu', 'error');
    }
  };

  // Security Policy Handler
  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!securitySettings) return;
    try {
      await api.updateSecuritySettings(securitySettings);
      showToast('Đã lưu cấu hình chính sách bảo mật hệ thống', 'success');
      loadRbacData();
    } catch (err: any) {
      showToast(err.message || 'Lỗi lưu bảo mật', 'error');
    }
  };

  // Export Audit Logs to CSV
  const handleExportAuditCSV = () => {
    const headers = 'Thời gian,Người thao tác,Vai trò,Phân hệ,Hành động,Mô tả chi tiết,IP Truy cập,Trạng thái';
    const rows = auditLogs.map(
      (l) =>
        `"${l.timestamp}","${l.userName}","${l.roleName}","${l.module}","${l.action}","${l.description}","${l.ipAddress}","${l.status}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Nhat_ky_truy_vet_AMIS_Audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Đã xuất file Nhật ký truy vết bảo mật', 'success');
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = selectedUserRoleFilter === 'all' || u.roleId === selectedUserRoleFilter;
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.username.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.employeeCode.toLowerCase().includes(searchUser.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const filteredAudits = auditLogs.filter((a) => {
    const matchesMod = selectedAuditModule === 'all' || a.module === selectedAuditModule;
    const matchesSearch =
      a.userName.toLowerCase().includes(searchAudit.toLowerCase()) ||
      a.description.toLowerCase().includes(searchAudit.toLowerCase()) ||
      (a.targetName && a.targetName.toLowerCase().includes(searchAudit.toLowerCase()));
    return matchesMod && matchesSearch;
  });

  return (
    <div className="space-y-4 animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0072BC] uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Phân hệ Quản Trị Hệ Thống & Phân Quyền Vai Trò (AMIS RBAC Engine)</span>
          </div>
          <h1 className="text-lg font-bold text-slate-800 mt-0.5">
            Trung Tâm Kiểm Soát Phân Quyền & Bảo Mật Doanh Nghiệp
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản trị ma trận phân quyền chi tiết (Granular RBAC), danh bạ tài khoản, nhật ký truy vết Audit Trail & chính sách bảo mật
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-slate-600 font-medium">Vai trò kích hoạt: <strong>{roles.length}</strong></span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600 font-medium">Tài khoản: <strong>{users.length}</strong></span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-2 rounded-xl border shadow-xs text-xs font-semibold overflow-x-auto select-none">
        <button
          onClick={() => setActiveTab('roles')}
          className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'roles'
              ? 'border-[#0072BC] text-[#0072BC] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Ma trận Phân quyền & Vai trò</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-[#0072BC]">
            {roles.length} vai trò
          </span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'users'
              ? 'border-[#0072BC] text-[#0072BC] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Quản lý Tài khoản Người dùng</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800">
            {users.length} tài khoản
          </span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'audit'
              ? 'border-[#0072BC] text-[#0072BC] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Nhật ký Truy vết Bảo mật (Audit Trail)</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-100 text-purple-800">
            {auditLogs.length} sự kiện
          </span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'security'
              ? 'border-[#0072BC] text-[#0072BC] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Chính sách An toàn Thông tin & Session</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: MA TRẬN PHÂN QUYỀN & VAI TRÒ                     */}
      {/* ======================================================== */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pb-1">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Danh Mục Vai Trò & Ma Trận Phân Quyền (RBAC)</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Mỗi vai trò được quy định phạm vi dữ liệu và các hành động (Xem, Thêm, Sửa, Xóa, Duyệt, Xuất) trên 8 phân hệ
              </p>
            </div>

            <button
              onClick={() => {
                setEditingRole(null);
                setIsRoleModalOpen(true);
              }}
              className="px-3.5 py-2 bg-[#0072BC] hover:bg-[#005A96] text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm vai trò phân quyền mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left 1 Col: Role List Cards */}
            <div className="space-y-2.5">
              {roles.map((r) => {
                const isSelected = selectedRole?.id === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRole(r)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer bg-white shadow-xs relative ${
                      isSelected
                        ? 'border-[#0072BC] ring-2 ring-[#0072BC]/20 bg-blue-50/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                          style={{ backgroundColor: r.color }}
                        ></span>
                        <h3 className="font-bold text-slate-900 text-xs">{r.name}</h3>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {r.isSystem ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                            Hệ thống
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700">
                            Tùy biến
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-1 font-mono text-[10px] text-slate-400 font-semibold">{r.code}</div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{r.description}</p>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">
                        Phạm vi: <strong className="text-slate-700">{r.dataScope === 'all' ? 'Toàn công ty' : r.dataScope === 'department' ? 'Phòng ban' : 'Cá nhân'}</strong>
                      </span>
                      <span className="font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {r.userCount} người
                      </span>
                    </div>

                    {/* Action buttons on card */}
                    <div className="mt-2 flex items-center justify-end gap-1.5 pt-1.5 border-t border-slate-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingRole(r);
                          setIsRoleModalOpen(true);
                        }}
                        className="p-1 text-slate-500 hover:text-[#0072BC] hover:bg-slate-100 rounded transition cursor-pointer"
                        title="Chỉnh sửa phân quyền"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {!r.isSystem && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRole(r);
                          }}
                          className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                          title="Xóa vai trò"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right 2 Cols: Active Role Permission Matrix Inspector */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
              {selectedRole ? (
                <>
                  <div className="flex items-start justify-between border-b pb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm"
                        style={{ backgroundColor: selectedRole.color }}
                      >
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-slate-900">{selectedRole.name}</h3>
                          <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-bold">
                            {selectedRole.code}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{selectedRole.description}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setEditingRole(selectedRole);
                        setIsRoleModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Sửa phân quyền</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500">Phạm vi truy cập dữ liệu (Data Scope):</span>
                    <span className="font-bold text-slate-800 uppercase tracking-wide">
                      {selectedRole.dataScope === 'all'
                        ? 'Toàn bộ công ty (All Company)'
                        : selectedRole.dataScope === 'department'
                        ? 'Phòng ban trực thuộc (Department Scope)'
                        : 'Dữ liệu cá nhân (Self-Service)'}
                    </span>
                  </div>

                  {/* Matrix Preview Table */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                          <th className="py-2.5 px-4">Phân hệ hệ thống</th>
                          {(['view', 'create', 'edit', 'delete', 'approve', 'export'] as Array<keyof ModulePermissions>).map(
                            (act) => (
                              <th key={act} className="py-2.5 px-3 text-center">
                                {actionLabels[act]}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(Object.keys(moduleLabels) as Array<keyof PermissionMatrix>).map((modKey) => {
                          const row = selectedRole.permissions[modKey];
                          return (
                            <tr key={modKey} className="hover:bg-slate-50 transition">
                              <td className="py-2.5 px-4 font-semibold text-slate-800">
                                {moduleLabels[modKey]}
                              </td>
                              {(['view', 'create', 'edit', 'delete', 'approve', 'export'] as Array<keyof ModulePermissions>).map(
                                (act) => {
                                  const isAllowed = Boolean(row?.[act]);
                                  return (
                                    <td key={act} className="py-2.5 px-3 text-center">
                                      {isAllowed ? (
                                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700">
                                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-400">
                                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                        </span>
                                      )}
                                    </td>
                                  );
                                }
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs">
                  Vui lòng chọn một vai trò bên trái để xem chi tiết ma trận phân quyền
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: QUẢN LÝ TÀI KHOẢN NGƯỜI DÙNG                     */}
      {/* ======================================================== */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm tài khoản, email, tên..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0072BC]/20"
                />
              </div>

              <select
                value={selectedUserRoleFilter}
                onChange={(e) => setSelectedUserRoleFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
              >
                <option value="all">Tất cả vai trò</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-xs text-slate-500 hidden sm:block">
                Tổng số tài khoản: <strong className="text-slate-800">{filteredUsers.length}</strong>
              </div>

              <button
                onClick={() => setIsUserCreateModalOpen(true)}
                className="px-3 py-1.5 bg-[#0072BC] hover:bg-[#005A96] text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tạo tài khoản mới</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Tài khoản & Nhân sự</th>
                    <th className="py-3 px-4">Đơn vị & Chức danh</th>
                    <th className="py-3 px-4">Vai trò phân quyền</th>
                    <th className="py-3 px-4">Bảo mật 2FA</th>
                    <th className="py-3 px-4">Lần đăng nhập cuối</th>
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">
                            {u.fullName.split(' ').slice(-1)[0][0]}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{u.fullName}</div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {u.username} • {u.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-slate-800 font-medium">{u.departmentName}</div>
                        <div className="text-[11px] text-slate-400">{u.positionTitle}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-[#0072BC] border border-blue-200">
                          <Shield className="w-3 h-3" />
                          <span>{u.roleName}</span>
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {u.twoFactorEnabled ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Đã kích hoạt
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            Chưa bật
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-mono text-slate-700 text-[11px]">{u.lastLogin || '--'}</div>
                        {u.lastIp && <div className="text-[10px] text-slate-400 font-mono">IP: {u.lastIp}</div>}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            u.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              u.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          ></span>
                          {u.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedUserForRole(u)}
                            className="p-1.5 text-[#0072BC] hover:bg-blue-50 rounded-lg transition cursor-pointer"
                            title="Gán vai trò khác"
                          >
                            <ShieldCheck className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleResetPassword(u)}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                            title="Cấp lại mật khẩu tạm thời"
                          >
                            <Key className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleToggleUserStatus(u)}
                            className={`p-1.5 rounded-lg transition cursor-pointer ${
                              u.status === 'active'
                                ? 'text-rose-600 hover:bg-rose-50'
                                : 'text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={u.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                          >
                            {u.status === 'active' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: NHẬT KÝ TRUY VẾT BẢO MẬT (AUDIT TRAIL)            */}
      {/* ======================================================== */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm hành vi, người thao tác..."
                  value={searchAudit}
                  onChange={(e) => setSearchAudit(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0072BC]/20"
                />
              </div>

              <select
                value={selectedAuditModule}
                onChange={(e) => setSelectedAuditModule(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
              >
                <option value="all">Tất cả phân hệ</option>
                <option value="employees">Hồ sơ nhân sự</option>
                <option value="attendance">Chấm công</option>
                <option value="leaves">Đơn từ</option>
                <option value="payroll">Tiền lương</option>
                <option value="admin_rbac">Phân quyền RBAC</option>
                <option value="auth">Xác thực hệ thống</option>
              </select>
            </div>

            <button
              onClick={handleExportAuditCSV}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-purple-600" />
              <span>Xuất Nhật Ký Audit (CSV)</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Thời gian</th>
                    <th className="py-3 px-4">Người thao tác</th>
                    <th className="py-3 px-4">Phân hệ</th>
                    <th className="py-3 px-4">Hành động</th>
                    <th className="py-3 px-4">Nội dung chi tiết</th>
                    <th className="py-3 px-4">Địa chỉ IP</th>
                    <th className="py-3 px-4">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAudits.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-800 text-[11px]">
                        {item.timestamp}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{item.userName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{item.roleName}</div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">
                        {moduleLabels[item.module] || item.module}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                            item.action === 'CREATE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.action === 'UPDATE' || item.action === 'PERM_CHANGE'
                              ? 'bg-blue-100 text-[#0072BC]'
                              : item.action === 'DELETE'
                              ? 'bg-rose-100 text-rose-800'
                              : item.action === 'APPROVE'
                              ? 'bg-teal-100 text-teal-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {item.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 leading-relaxed max-w-md">
                        {item.description}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {item.ipAddress}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Thành công
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: CHÍNH SÁCH BẢO MẬT & SESSION                      */}
      {/* ======================================================== */}
      {activeTab === 'security' && securitySettings && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="pb-3 border-b">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#0072BC]" />
              <span>Chính Sách An Toàn Thông Tin & Quản Trị Phiên Làm Việc (Security Policy)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Áp dụng các tiêu chuẩn bảo mật theo quy định bảo vệ dữ liệu cá nhân Nghị định 13/2023/NĐ-CP
            </p>
          </div>

          <form onSubmit={handleSaveSecurity} className="space-y-6 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password Policy */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h3 className="font-bold text-slate-800 text-xs flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-500" />
                  <span>Chính sách Mật khẩu & Xác thực</span>
                </h3>

                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">Độ dài tối thiểu của mật khẩu:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={6}
                      max={32}
                      value={securitySettings.passwordMinLength}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          passwordMinLength: Number(e.target.value)
                        })
                      }
                      className="w-24 px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                    />
                    <span className="text-slate-500 font-medium">ký tự</span>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={securitySettings.requireSpecialChar}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        requireSpecialChar: e.target.checked
                      })
                    }
                    className="w-4 h-4 text-[#0072BC] rounded border-slate-300"
                  />
                  <span className="text-slate-700 font-medium">
                    Bắt buộc chứa chữ hoa, chữ thường, số và ký tự đặc biệt (!@#$%)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={securitySettings.enforce2FA}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        enforce2FA: e.target.checked
                      })
                    }
                    className="w-4 h-4 text-[#0072BC] rounded border-slate-300"
                  />
                  <span className="text-slate-700 font-medium">
                    Bắt buộc xác thực 2 bước 2FA (OTP qua Email/Google Authenticator)
                  </span>
                </label>
              </div>

              {/* Session & Lockout Policy */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h3 className="font-bold text-slate-800 text-xs flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-500" />
                  <span>Quản trị Phiên làm việc & Khóa tài khoản</span>
                </h3>

                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">Thời gian tự động hết hạn phiên đăng nhập (Timeout):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={15}
                      max={480}
                      value={securitySettings.sessionTimeoutMinutes}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          sessionTimeoutMinutes: Number(e.target.value)
                        })
                      }
                      className="w-24 px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                    />
                    <span className="text-slate-500 font-medium">phút (khi không tương tác)</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-medium">Số lần đăng nhập sai tối đa trước khi tự động khóa:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={3}
                      max={10}
                      value={securitySettings.maxFailedLoginAttempts}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          maxFailedLoginAttempts: Number(e.target.value)
                        })
                      }
                      className="w-24 px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                    />
                    <span className="text-slate-500 font-medium">lần thử</span>
                  </div>
                </div>
              </div>
            </div>

            {/* IP Whitelist */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-800 text-xs flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>Danh Sách Dải Địa Chỉ IP Đáng Tin Cậy (IP Whitelisting)</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Chỉ cho phép tài khoản Quản trị viên đăng nhập từ các dải mạng văn phòng hoặc VPN nội bộ
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {securitySettings.allowedIpWhitelist.map((ip, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-mono text-[11px] font-bold text-slate-800 flex items-center gap-1.5"
                  >
                    <span>{ip}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0072BC] hover:bg-[#005A96] text-white font-bold rounded-lg shadow-sm transition cursor-pointer"
              >
                Lưu Chính Sách Bảo Mật
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* POPUP MODALS                                             */}
      {/* ======================================================== */}
      {isRoleModalOpen && (
        <RoleFormModal
          isOpen={isRoleModalOpen}
          onClose={() => {
            setIsRoleModalOpen(false);
            setEditingRole(null);
          }}
          onSave={handleSaveRole}
          initialRole={editingRole}
        />
      )}

      {selectedUserForRole && (
        <UserRoleModal
          isOpen={!!selectedUserForRole}
          onClose={() => setSelectedUserForRole(null)}
          user={selectedUserForRole}
          roles={roles}
          onAssign={handleAssignRole}
        />
      )}

      {isUserCreateModalOpen && (
        <UserCreateModal
          isOpen={isUserCreateModalOpen}
          onClose={() => setIsUserCreateModalOpen(false)}
          onSave={handleCreateUser}
          roles={roles}
          employees={employees}
          existingUsers={users}
        />
      )}

      {/* Temp Password Dialog */}
      {tempPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm p-5 space-y-4 text-xs text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Key className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-bold text-sm text-slate-900">Mật Khẩu Tạm Thời Mới</h3>
              <p className="text-slate-500 mt-1">
                Đã cấp mật khẩu mới cho nhân sự <strong>{tempPasswordModal.userName}</strong>
              </p>
            </div>

            <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 font-mono text-base font-black text-[#0072BC] select-all tracking-wider">
              {tempPasswordModal.tempPass}
            </div>

            <p className="text-[11px] text-slate-400">
              Vui lòng gửi mã này cho nhân sự. Nhân viên sẽ được yêu cầu đổi mật khẩu ngay trong lần đăng nhập đầu tiên.
            </p>

            <button
              onClick={() => setTempPasswordModal(null)}
              className="w-full py-2 bg-[#0072BC] hover:bg-[#005A96] text-white font-bold rounded-lg transition cursor-pointer"
            >
              Đã sao chép & Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
