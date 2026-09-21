import React, { useState } from 'react';
import {
  Network,
  Building,
  Users,
  Plus,
  Briefcase,
  ShieldCheck,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { Department, Position } from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';

interface OrganizationViewProps {
  departments: Department[];
  positions: Position[];
  loading: boolean;
  onAddDepartment: (data: { code: string; name: string; managerName?: string; description?: string }) => Promise<void>;
  onRefresh: () => void;
}

export const OrganizationView: React.FC<OrganizationViewProps> = ({
  departments,
  positions,
  loading,
  onAddDepartment,
  onRefresh
}) => {
  const { role } = useAuth();
  const { showToast } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [managerName, setManagerName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name) return;
    try {
      setSaving(true);
      await onAddDepartment({ code, name, managerName, description });
      showToast(`Đã thêm phòng ban ${name} vào sơ đồ tổ chức`, 'success');
      setShowAddModal(false);
      setCode('');
      setName('');
      setManagerName('');
      setDescription('');
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Lỗi thêm phòng ban', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Network className="w-5 h-5 text-[#0072BC]" />
            <span>Cơ Cấu Tổ Chức & Sơ Đồ Phòng Ban (AMIS Organization)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản trị cây cơ cấu phân cấp, phòng ban chức năng và hệ thống chức danh nghề nghiệp
          </p>
        </div>

        {role === 'admin' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-[#0072BC] hover:bg-[#005A96] text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm phòng ban mới</span>
          </button>
        )}
      </div>

      {/* Department Cards Grid */}
      <div>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Danh sách Đơn vị / Khối phòng ban ({departments.length})
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-[#0072BC] hover:shadow-md transition space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0072BC] flex items-center justify-center font-bold">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{dept.name}</h3>
                    <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      Mã: {dept.code}
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#0072BC]">
                  {dept.employeeCount} nhân sự
                </span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">{dept.description}</p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>Trưởng bộ phận:</span>
                </div>
                <span className="font-semibold text-slate-800">{dept.managerName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Positions Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#0072BC]" />
              <span>Khung Vị trí & Chức danh Công việc</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Tiêu chuẩn định biên và cấp bậc chuyên môn</p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
            {positions.length} vị trí tiêu chuẩn
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Mã chức danh</th>
                <th className="py-3 px-4">Tên chức danh công việc</th>
                <th className="py-3 px-4">Cấp bậc chuyên môn</th>
                <th className="py-3 px-4">Đơn vị quản lý</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {positions.map((pos) => {
                const dept = departments.find((d) => d.id === pos.departmentId);
                return (
                  <tr key={pos.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-[#0072BC]">{pos.code}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{pos.title}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                        {pos.level}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{dept?.name || 'Toàn công ty'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Department Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="bg-[#0072BC] text-white px-6 py-4 flex items-center justify-between">
              <h2 className="font-bold text-base">Thêm Phòng Ban Mới</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Mã phòng ban (Viết tắt)</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: RND, MKT..."
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Tên phòng ban</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Phòng Nghiên Cứu & Phát Triển"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Trưởng phòng phụ trách</label>
                <input
                  type="text"
                  placeholder="Họ tên người quản lý"
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Mô tả chức năng nhiệm vụ</label>
                <textarea
                  rows={2}
                  placeholder="Mô tả chức năng chính..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                ></textarea>
              </div>

              <div className="pt-2 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-[#0072BC] hover:bg-[#005A96] text-white font-semibold rounded-lg shadow-sm"
                >
                  {saving ? 'Đang lưu...' : 'Tạo phòng ban'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
