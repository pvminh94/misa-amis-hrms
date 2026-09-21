import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  FileSpreadsheet,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  Building,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  UserCheck,
  Briefcase,
  Calendar,
  CheckSquare,
  Shield,
  Layers,
  FileText,
  UserX
} from 'lucide-react';
import { Employee, Department, Position, CrmCandidate } from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { api } from '../../../services/api';
import { CandidateIntakeModal } from './CandidateIntakeModal';

interface EmployeeListProps {
  employees: Employee[];
  departments: Department[];
  positions: Position[];
  loading: boolean;
  onRefresh: () => void;
  onOpenAdd: () => void;
  onSelectEmployee: (emp: Employee) => void;
  onEditEmployee: (emp: Employee) => void;
  onDeleteEmployee: (id: string) => Promise<void>;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  departments,
  positions,
  loading,
  onRefresh,
  onOpenAdd,
  onSelectEmployee,
  onEditEmployee,
  onDeleteEmployee
}) => {
  const { role } = useAuth();
  const { showToast } = useToast();

  const [activeSubTab, setActiveSubTab] = useState<'employees' | 'crm_pipeline' | 'onboarding' | 'offboarding'>('employees');
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // CRM candidates state
  const [candidates, setCandidates] = useState<CrmCandidate[]>([]);
  const [selectedCandidateForIntake, setSelectedCandidateForIntake] = useState<CrmCandidate | null>(null);
  const [loadingCandidates, setLoadingCandidates] = useState(false);

  // Load CRM candidates
  const loadCandidates = async () => {
    try {
      setLoadingCandidates(true);
      const res = await api.getCrmCandidates();
      setCandidates(res);
    } catch (err) {
      console.error('Error fetching candidates:', err);
    } finally {
      setLoadingCandidates(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  const handleConvertCandidate = async (candidateId: string, overrides: any) => {
    try {
      const res = await api.convertCandidateToEmployee(candidateId, overrides);
      showToast(
        `Đã tiếp nhận thành công nhân sự ${res.fullName} (${res.code}) và tự động khởi tạo tài khoản, HĐLĐ, phân ca & bảng lương!`,
        'success'
      );
      loadCandidates();
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Lỗi tiếp nhận ứng viên', 'error');
    }
  };

  // Filter employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.fullName.toLowerCase().includes(search.toLowerCase()) ||
      emp.code.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.phone.includes(search);

    const matchesDept = selectedDept === 'all' || emp.departmentId === selectedDept;
    const matchesStatus = selectedStatus === 'all' || emp.status === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa nhân sự "${name}" khỏi hệ thống?`)) {
      try {
        setDeletingId(id);
        await onDeleteEmployee(id);
        showToast(`Đã xóa nhân sự ${name}`, 'info');
      } catch (err) {
        showToast('Không thể xóa nhân sự', 'error');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleExportExcel = () => {
    const headers = ['Mã NV', 'Họ và tên', 'Phòng ban', 'Chức vụ', 'Số điện thoại', 'Email', 'Loại HĐ', 'Trạng thái', 'Lương cơ bản'];
    const rows = filteredEmployees.map((e) => [
      e.code,
      `"${e.fullName}"`,
      `"${e.departmentName}"`,
      `"${e.positionTitle}"`,
      e.phone,
      e.email,
      `"${e.contractType}"`,
      e.status === 'active' ? 'Chính thức' : e.status === 'probation' ? 'Thử việc' : 'Nghỉ',
      e.salary.baseSalary
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Danh_sach_nhan_su_AMIS_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Đã xuất file dữ liệu danh sách nhân viên thành công', 'success');
  };

  const pendingCandidatesCount = candidates.filter((c) => c.status === 'offer_accepted').length;

  return (
    <div className="space-y-4 animate-in fade-in">
      {/* Top Header & Action Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0072BC] uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Phân hệ Quản Lý Hồ Sơ & Vòng Đời Nhân Sự (AMIS Employee Lifecycle)</span>
          </div>
          <h1 className="text-lg font-bold text-slate-800 mt-0.5">
            Quản Trị Nhân Sự & Tiếp Nhận Tuyển Dụng A-Z
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quy trình liên kết chặt chẽ từ Tuyển dụng/CRM, Tiếp nhận Onboarding, Ký hợp đồng, Phân ca đến Tiền lương & Thôi việc
          </p>
        </div>

        {/* Action Buttons: Clear, Prominent, Unmissable */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setActiveSubTab('crm_pipeline')}
            className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Tiếp nhận từ CRM ({pendingCandidatesCount} ứng viên)</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Xuất Excel</span>
          </button>

          {/* Prominent Onboarding Add Button */}
          <button
            onClick={onOpenAdd}
            className="px-4 py-2 bg-[#0072BC] hover:bg-[#005A96] text-white text-xs font-bold rounded-lg shadow-md transition flex items-center gap-1.5 cursor-pointer active:scale-95 ring-2 ring-[#0072BC]/20"
          >
            <UserPlus className="w-4 h-4" />
            <span>Thêm Mới Nhân Sự (Onboarding A-Z)</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex border-b border-slate-200 bg-white px-2 rounded-xl border shadow-xs text-xs font-semibold overflow-x-auto select-none">
        <button
          onClick={() => setActiveSubTab('employees')}
          className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
            activeSubTab === 'employees'
              ? 'border-[#0072BC] text-[#0072BC] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Danh sách nhân sự chính thức & thử việc</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-[#0072BC]">
            {employees.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('crm_pipeline')}
          className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
            activeSubTab === 'crm_pipeline'
              ? 'border-[#0072BC] text-[#0072BC] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Tiếp nhận ứng viên Tuyển dụng / CRM</span>
          {pendingCandidatesCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
              {pendingCandidatesCount} mới
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('onboarding')}
          className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
            activeSubTab === 'onboarding'
              ? 'border-[#0072BC] text-[#0072BC] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CheckSquare className="w-4 h-4 text-sky-600" />
          <span>Quy trình Onboarding (Checklist hội nhập)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('offboarding')}
          className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
            activeSubTab === 'offboarding'
              ? 'border-[#0072BC] text-[#0072BC] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserX className="w-4 h-4 text-rose-500" />
          <span>Biến động & Thôi việc (Offboarding)</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* SUB-TAB 1: DANH SÁCH NHÂN SỰ                             */}
      {/* ======================================================== */}
      {activeSubTab === 'employees' && (
        <div className="space-y-4">
          {/* Filter and Search Bar */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm theo tên, mã nhân viên, email, số điện thoại..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0072BC]/20 focus:border-[#0072BC]"
              />
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Filter className="w-3.5 h-3.5" />
                <span>Lọc:</span>
              </div>

              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="all">Tất cả phòng ban</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Chính thức (Active)</option>
                <option value="probation">Thử việc (Probation)</option>
                <option value="resigned">Đã nghỉ việc (Resigned)</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Mã NV</th>
                    <th className="py-3 px-4">Họ và tên</th>
                    <th className="py-3 px-4">Phòng ban</th>
                    <th className="py-3 px-4">Chức danh</th>
                    <th className="py-3 px-4">Thông tin liên hệ</th>
                    <th className="py-3 px-4">Loại hợp đồng</th>
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        Đang đồng bộ dữ liệu nhân sự...
                      </td>
                    </tr>
                  ) : filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        Không tìm thấy nhân sự phù hợp với bộ lọc
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((emp) => (
                      <tr
                        key={emp.id}
                        onClick={() => onSelectEmployee(emp)}
                        className="hover:bg-blue-50/40 cursor-pointer transition"
                      >
                        <td className="py-3 px-4 font-mono font-bold text-slate-700">
                          {emp.code}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
                              {emp.fullName.split(' ').slice(-1)[0][0]}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 hover:text-[#0072BC]">
                                {emp.fullName}
                              </div>
                              <div className="text-[10px] text-slate-400">{emp.education}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-slate-700 font-medium">
                          {emp.departmentName}
                        </td>

                        <td className="py-3 px-4 text-slate-600">
                          {emp.positionTitle}
                        </td>

                        <td className="py-3 px-4">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span>{emp.email}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{emp.phone}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-slate-600">
                          <div className="truncate max-w-[150px]">{emp.contractType}</div>
                          <div className="text-[10px] text-slate-400 font-mono">Từ {emp.joinDate}</div>
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                              emp.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : emp.status === 'probation'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                emp.status === 'active'
                                  ? 'bg-emerald-500'
                                  : emp.status === 'probation'
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                            ></span>
                            {emp.status === 'active'
                              ? 'Chính thức'
                              : emp.status === 'probation'
                              ? 'Thử việc'
                              : 'Nghỉ việc'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td
                          className="py-3 px-4 text-right space-x-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => onSelectEmployee(emp)}
                            className="p-1.5 text-slate-400 hover:text-[#0072BC] hover:bg-blue-50 rounded-lg transition"
                            title="Xem chi tiết hồ sơ A-Z"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onEditEmployee(emp)}
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                            title="Chỉnh sửa thông tin"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {role === 'admin' && (
                            <button
                              onClick={() => handleDelete(emp.id, emp.fullName)}
                              disabled={deletingId === emp.id}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Xóa nhân sự"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table footer with count */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>
                Hiển thị <strong>{filteredEmployees.length}</strong> / {employees.length} nhân sự
              </span>
              <span className="font-medium text-slate-400">AMIS HRM Record Manager</span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 2: TIẾP NHẬN ỨNG VIÊN TỪ CRM / TUYỂN DỤNG       */}
      {/* ======================================================== */}
      {activeSubTab === 'crm_pipeline' && (
        <div className="space-y-4">
          <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 font-bold text-emerald-900 text-xs">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Pipeline Tuyển Dụng & Tiếp Nhận Ứng Viên (CRM Talent Pool Integration)</span>
              </div>
              <p className="text-xs text-emerald-800/80 mt-0.5">
                Các ứng viên đã vượt qua phỏng vấn và đồng ý nhận Offer. Chỉ cần 1 click để tiếp nhận, tự động tạo hồ sơ nhân viên, sinh hợp đồng, phân ca và cấp tài khoản đăng nhập.
              </p>
            </div>

            <button
              onClick={onOpenAdd}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tiếp nhận ngoài CRM</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {candidates.map((cand) => {
              const isConverted = cand.status === 'converted_to_employee';
              return (
                <div
                  key={cand.id}
                  className={`bg-white rounded-xl border p-4 shadow-xs flex flex-col justify-between transition ${
                    isConverted ? 'border-slate-200 bg-slate-50/50 opacity-80' : 'border-emerald-200 hover:border-emerald-400 ring-1 ring-emerald-50'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-[10px] text-slate-400 font-bold">{cand.candidateCode}</span>
                        <h3 className="font-bold text-slate-900 text-sm">{cand.fullName}</h3>
                      </div>

                      {isConverted ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                          Đã là nhân viên
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Chờ Onboarding
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 text-xs text-slate-600">
                      <div>Vị trí: <strong className="text-[#0072BC]">{cand.positionTitle}</strong></div>
                      <div>Khối/Ban: <strong className="text-slate-800">{cand.departmentName}</strong></div>
                      <div>Mức lương đề xuất: <strong className="font-mono text-emerald-700">{cand.offerSalary.toLocaleString()} đ</strong></div>
                      <div>Ngày dự kiến nhận việc: <strong className="font-mono text-slate-700">{cand.onboardingDate}</strong></div>
                      <div>Nguồn tuyển dụng: <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] text-slate-600">{cand.source}</span></div>
                    </div>

                    {cand.notes && (
                      <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                        "{cand.notes}"
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Tạo: {cand.createdAt}</span>

                    {isConverted ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Đã Onboard
                      </span>
                    ) : (
                      <button
                        onClick={() => setSelectedCandidateForIntake(cand)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Tiếp nhận ngay</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 3: QUY TRÌNH ONBOARDING CHECKLIST A-Z            */}
      {/* ======================================================== */}
      {activeSubTab === 'onboarding' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div>
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-[#0072BC]" />
              <span>Ma Trận Quy Trình Hội Nhập Nhân Sự Mới (Standard Onboarding Checklist A-Z)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              5 bước chuẩn hóa tự động được kích hoạt ngay khi nhân sự mới gia nhập công ty
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
            {/* Step 1 */}
            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-[#0072BC] text-white font-bold flex items-center justify-center text-xs">1</span>
                <span className="text-[10px] font-bold text-[#0072BC] uppercase">Hồ sơ cá nhân</span>
              </div>
              <h3 className="font-bold text-slate-900 text-xs">Thu thập giấy tờ pháp lý</h3>
              <ul className="space-y-1 text-slate-600 text-[11px]">
                <li>• CCCD gắn chip xác thực</li>
                <li>• Sơ yếu lý lịch tư pháp</li>
                <li>• Bằng cấp & Chứng chỉ gốc</li>
                <li>• Giấy khám sức khỏe</li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">2</span>
                <span className="text-[10px] font-bold text-emerald-700 uppercase">Hợp đồng</span>
              </div>
              <h3 className="font-bold text-slate-900 text-xs">Ký Hợp Đồng Lao Động</h3>
              <ul className="space-y-1 text-slate-600 text-[11px]">
                <li>• Tự động sinh mã HĐLĐ</li>
                <li>• Thời hạn thử việc 2 tháng</li>
                <li>• Thỏa thuận bảo mật NDA</li>
                <li>• Quy chế lương thưởng</li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-xs">3</span>
                <span className="text-[10px] font-bold text-purple-700 uppercase">Hệ thống IT</span>
              </div>
              <h3 className="font-bold text-slate-900 text-xs">Cấp tài khoản & Quyền</h3>
              <ul className="space-y-1 text-slate-600 text-[11px]">
                <li>• Tài khoản AMIS HRM (User)</li>
                <li>• Gán vai trò theo phòng ban</li>
                <li>• Email công vụ @amis.vn</li>
                <li>• Đăng ký sinh trắc học</li>
              </ul>
            </div>

            {/* Step 4 */}
            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-xs">4</span>
                <span className="text-[10px] font-bold text-amber-700 uppercase">Thiết bị & Thẻ</span>
              </div>
              <h3 className="font-bold text-slate-900 text-xs">Bàn giao tài sản IT</h3>
              <ul className="space-y-1 text-slate-600 text-[11px]">
                <li>• Laptop cấu hình chuẩn</li>
                <li>• Thẻ ra vào văn phòng</li>
                <li>• Văn phòng phẩm & sổ tay</li>
                <li>• Chỗ ngồi & tủ đồ cá nhân</li>
              </ul>
            </div>

            {/* Step 5 */}
            <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-xs">5</span>
                <span className="text-[10px] font-bold text-teal-700 uppercase">Hội nhập</span>
              </div>
              <h3 className="font-bold text-slate-900 text-xs">Đào tạo & Người hướng dẫn</h3>
              <ul className="space-y-1 text-slate-600 text-[11px]">
                <li>• Phân công Mentor / Buddy</li>
                <li>• Đào tạo văn hóa công ty</li>
                <li>• Giao KPI thử việc tháng 1</li>
                <li>• Lịch phân ca & Chấm công</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 4: BIẾN ĐỘNG & THÔI VIỆC (OFFBOARDING)           */}
      {/* ======================================================== */}
      {activeSubTab === 'offboarding' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4 text-xs">
          <div>
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <UserX className="w-4 h-4 text-rose-500" />
              <span>Quy Trình Quản Trị Thôi Việc & Thu Hồi Tài Sản (Offboarding Governance)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Đảm bảo an toàn thông tin, bảo mật tài sản và quyết toán quyền lợi người lao động đầy đủ theo Luật Lao Động
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-rose-500" />
                <span>1. Thu Hồi Tài Khoản & Bảo Mật</span>
              </h3>
              <p className="text-slate-500 text-[11px]">
                Khi phê duyệt đơn thôi việc, Quản trị viên kích hoạt khóa tài khoản 1 chạm trong Admin RBAC, ngắt quyền truy cập email và VPN công ty.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-500" />
                <span>2. Bàn Giao Thiết Bị & Công Việc</span>
              </h3>
              <p className="text-slate-500 text-[11px]">
                Biên bản bàn giao Laptop, thẻ nhân viên và chuyển giao tài liệu dự án cho Trưởng bộ phận phụ trách trước ngày làm việc cuối cùng.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>3. Quyết Toán Tiền Lương & Chốt BHXH</span>
              </h3>
              <p className="text-slate-500 text-[11px]">
                Thanh toán tiền lương những ngày làm việc thực tế, tiền phép năm chưa nghỉ và thủ tục chốt sổ BHXH trả cho người lao động.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Intake Modal */}
      {selectedCandidateForIntake && (
        <CandidateIntakeModal
          isOpen={!!selectedCandidateForIntake}
          onClose={() => setSelectedCandidateForIntake(null)}
          candidate={selectedCandidateForIntake}
          departments={departments}
          positions={positions}
          onConvert={handleConvertCandidate}
        />
      )}
    </div>
  );
};
