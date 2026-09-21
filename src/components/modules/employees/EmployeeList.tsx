import React, { useState } from 'react';
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
  MoreVertical
} from 'lucide-react';
import { Employee, Department, Position } from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';

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
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
    if (!window.confirm(`Bạn có chắc chắn muốn xóa hồ sơ nhân viên ${name}?`)) return;
    try {
      setDeletingId(id);
      await onDeleteEmployee(id);
      showToast(`Đã xóa hồ sơ nhân sự ${name}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi xóa nhân sự', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleExportExcel = () => {
    // Generates simulated Excel CSV
    const headers = ['Mã NV', 'Họ và tên', 'Phòng ban', 'Chức vụ', 'Số điện thoại', 'Email', 'Loại HĐ', 'Trạng thái', 'Lương cơ bản'];
    const rows = filteredEmployees.map(e => [
      e.code,
      `"${e.fullName}"`,
      `"${e.departmentName}"`,
      `"${e.positionTitle}"`,
      e.phone,
      e.email,
      `"${e.contractType}"`,
      e.status === 'active' ? 'Chính thức' : (e.status === 'probation' ? 'Thử việc' : 'Nghỉ'),
      e.salary.baseSalary
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Danh_sach_nhan_su_AMIS_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Đã xuất file dữ liệu danh sách nhân viên thành công', 'success');
  };

  return (
    <div className="space-y-4 animate-in fade-in">
      {/* Top Header & Action Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#0072BC]" />
            <span>Hồ sơ & Danh bạ Nhân sự (AMIS Thông tin nhân sự)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý tập trung toàn diện danh sách nhân sự, hợp đồng lao động và thông tin lương BHXH
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportExcel}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Xuất Excel</span>
          </button>

          {(role === 'admin' || role === 'manager') && (
            <button
              onClick={onOpenAdd}
              className="px-3.5 py-2 bg-[#0072BC] hover:bg-[#005A96] text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Thêm mới nhân sự</span>
            </button>
          )}
        </div>
      </div>

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

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0072BC]/20"
          >
            <option value="all">Tất cả phòng ban</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0072BC]/20"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang làm việc</option>
            <option value="probation">Thử việc</option>
            <option value="leave">Nghỉ chế độ</option>
            <option value="resigned">Đã nghỉ việc</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Nhân sự</th>
                <th className="py-3 px-4">Đơn vị & Chức danh</th>
                <th className="py-3 px-4">Liên hệ</th>
                <th className="py-3 px-4">Loại hợp đồng</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#0072BC]"></div>
                    <div className="mt-2 text-xs">Đang tải danh sách nhân sự...</div>
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    Không tìm thấy nhân viên nào phù hợp bộ lọc
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-blue-50/40 transition group cursor-pointer"
                    onClick={() => onSelectEmployee(emp)}
                  >
                    {/* Employee Profile Cell */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0072BC] to-sky-400 text-white font-bold text-xs flex items-center justify-center shadow-xs flex-shrink-0">
                          {emp.fullName.split(' ').slice(-1)[0][0]}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-[#0072BC] transition flex items-center gap-1.5">
                            <span>{emp.fullName}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                              {emp.code}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {emp.gender} • Sinh năm {emp.dob.slice(0, 4)}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Unit & Position */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{emp.positionTitle}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                        <Building className="w-3 h-3 text-slate-400" />
                        <span>{emp.departmentName}</span>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3 px-4">
                      <div className="text-slate-700 flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{emp.phone}</span>
                      </div>
                      <div className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span className="truncate max-w-[150px]">{emp.email}</span>
                      </div>
                    </td>

                    {/* Contract */}
                    <td className="py-3 px-4">
                      <span className="text-slate-700 font-medium block">{emp.contractType}</span>
                      <span className="text-[10px] text-slate-400">Từ {emp.contractStartDate}</span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
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
                        title="Xem chi tiết hồ sơ"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {(role === 'admin' || role === 'manager') && (
                        <button
                          onClick={() => onEditEmployee(emp)}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                          title="Chỉnh sửa thông tin"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}

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
  );
};
