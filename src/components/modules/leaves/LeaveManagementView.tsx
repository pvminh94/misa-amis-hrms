import React, { useState } from 'react';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Filter,
  User,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { LeaveRequest } from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';

interface LeaveManagementViewProps {
  leaves: LeaveRequest[];
  loading: boolean;
  onRefresh: () => void;
  onOpenCreate: () => void;
  onUpdateStatus: (id: string, status: 'approved' | 'rejected', reviewNotes?: string) => Promise<void>;
}

export const LeaveManagementView: React.FC<LeaveManagementViewProps> = ({
  leaves,
  loading,
  onRefresh,
  onOpenCreate,
  onUpdateStatus
}) => {
  const { role, currentUser } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const filteredLeaves = leaves.filter((leave) => {
    if (activeTab === 'all') return true;
    return leave.status === activeTab;
  });

  const handleAction = async (id: string, status: 'approved' | 'rejected', notes?: string) => {
    try {
      setProcessingId(id);
      await onUpdateStatus(id, status, notes || (status === 'approved' ? 'Đã duyệt bởi quản lý' : 'Từ chối đơn'));
      showToast(status === 'approved' ? 'Đã phê duyệt đơn thành công' : 'Đã từ chối đơn', 'success');
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Lỗi thao tác đơn', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const getTypeName = (type: LeaveRequest['type']) => {
    switch (type) {
      case 'annual':
        return 'Nghỉ phép năm';
      case 'overtime':
        return 'Làm thêm (OT)';
      case 'late_early':
        return 'Đi muộn / Về sớm';
      case 'sick':
        return 'Nghỉ ốm (BHXH)';
      case 'unpaid':
        return 'Nghỉ không lương';
      default:
        return 'Khác';
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#0072BC]" />
            <span>Quy Trình Duyệt Đơn Từ Trực Tuyến (AMIS Phê duyệt)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý và phê duyệt tự động đơn xin nghỉ phép, đăng ký làm thêm OT, giải trình công
          </p>
        </div>

        <button
          onClick={onOpenCreate}
          className="px-3.5 py-2 bg-[#0072BC] hover:bg-[#005A96] text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo đơn trình duyệt mới</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-4 rounded-xl border shadow-xs text-xs font-semibold">
        <button
          onClick={() => setActiveTab('all')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 cursor-pointer transition ${
            activeTab === 'all'
              ? 'border-[#0072BC] text-[#0072BC]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Tất cả</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600">
            {leaves.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('pending')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 cursor-pointer transition ${
            activeTab === 'pending'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Chờ phê duyệt</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-700 font-bold">
            {leaves.filter((l) => l.status === 'pending').length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('approved')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 cursor-pointer transition ${
            activeTab === 'approved'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Đã phê duyệt</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-700">
            {leaves.filter((l) => l.status === 'approved').length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('rejected')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 cursor-pointer transition ${
            activeTab === 'rejected'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Từ chối</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-100 text-rose-700">
            {leaves.filter((l) => l.status === 'rejected').length}
          </span>
        </button>
      </div>

      {/* Leaves Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Mã đơn & Loại đơn</th>
                <th className="py-3 px-4">Nhân sự tạo đơn</th>
                <th className="py-3 px-4">Thời gian áp dụng</th>
                <th className="py-3 px-4">Thời lượng</th>
                <th className="py-3 px-4">Lý do</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác duyệt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Đang tải danh sách đơn từ...
                  </td>
                </tr>
              ) : filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Không có đơn từ nào trong mục này
                  </td>
                </tr>
              ) : (
                filteredLeaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-[#0072BC]">{leave.code}</div>
                      <div className="text-[11px] font-semibold text-slate-700 mt-0.5">
                        {getTypeName(leave.type)}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{leave.employeeName}</div>
                      <div className="text-[11px] text-slate-500">
                        {leave.employeeCode} • {leave.departmentName}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">
                        Từ: {leave.startDate}
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        Đến: {leave.endDate}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-800">
                        {leave.duration} {leave.unit}
                      </span>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="text-slate-700 truncate" title={leave.reason}>
                        {leave.reason}
                      </div>
                      {leave.reviewNotes && (
                        <div className="text-[10px] text-slate-400 italic mt-0.5">
                          Ghi chú duyệt: {leave.reviewNotes}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          leave.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : leave.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {leave.status === 'pending'
                          ? 'Chờ duyệt'
                          : leave.status === 'approved'
                          ? 'Đã duyệt'
                          : 'Từ chối'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      {leave.status === 'pending' ? (
                        role === 'admin' || role === 'manager' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleAction(leave.id, 'approved')}
                              disabled={processingId === leave.id}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center gap-1 cursor-pointer"
                              title="Phê duyệt đơn"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Duyệt</span>
                            </button>
                            <button
                              onClick={() => handleAction(leave.id, 'rejected')}
                              disabled={processingId === leave.id}
                              className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center gap-1 cursor-pointer"
                              title="Từ chối đơn"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Từ chối</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">Đang chờ quản lý duyệt</span>
                        )
                      ) : (
                        <span className="text-slate-400 text-[11px]">Đã kết thúc</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
