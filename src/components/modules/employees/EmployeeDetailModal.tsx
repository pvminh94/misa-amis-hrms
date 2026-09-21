import React, { useState } from 'react';
import {
  X,
  User,
  Briefcase,
  BadgeDollarSign,
  Landmark,
  FileText,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Building,
  GraduationCap,
  ShieldCheck,
  Printer,
  Plus,
  Award,
  Users2,
  FolderOpen,
  History,
  FileCheck,
  CheckCircle2,
  Clock,
  Trash2,
  TrendingUp,
  AlertTriangle,
  Download
} from 'lucide-react';
import { Employee, ContractItem, WorkHistoryItem, RewardDisciplineItem, DependentItem, DocumentItem } from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { api } from '../../../services/api';

interface EmployeeDetailModalProps {
  employee: Employee | null;
  onClose: () => void;
  onEdit: (employee: Employee) => void;
  onReload: () => void;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  employee,
  onClose,
  onEdit,
  onReload
}) => {
  const { role } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'profile' | 'contracts' | 'history' | 'dependents' | 'rewards' | 'documents' | 'salary'>('profile');

  // Sub-entity Form States
  const [showAddContract, setShowAddContract] = useState(false);
  const [showAddHistory, setShowAddHistory] = useState(false);
  const [showAddDependent, setShowAddDependent] = useState(false);
  const [showAddReward, setShowAddReward] = useState(false);
  const [showAddDocument, setShowAddDocument] = useState(false);

  // New Contract State
  const [newContractNumber, setNewContractNumber] = useState('');
  const [newContractType, setNewContractType] = useState('Hợp đồng xác định thời hạn 36 tháng');
  const [newContractStart, setNewContractStart] = useState('2026-10-01');
  const [newContractEnd, setNewContractEnd] = useState('2029-10-01');
  const [newContractSalary, setNewContractSalary] = useState(employee?.salary?.baseSalary || 20000000);

  // New Work History State
  const [newHistoryDecNumber, setNewHistoryDecNumber] = useState('');
  const [newHistoryTitle, setNewHistoryTitle] = useState('');
  const [newHistoryType, setNewHistoryType] = useState<'appointment' | 'promotion' | 'transfer' | 'salary_raise'>('salary_raise');
  const [newHistorySalaryAfter, setNewHistorySalaryAfter] = useState((employee?.salary?.baseSalary || 20000000) + 3000000);
  const [newHistoryDate, setNewHistoryDate] = useState('2026-09-21');

  // New Dependent State
  const [newDepName, setNewDepName] = useState('');
  const [newDepRelation, setNewDepRelation] = useState<'Con cái' | 'Vợ/Chồng' | 'Cha mẹ ruột'>('Con cái');
  const [newDepDob, setNewDepDob] = useState('2020-01-01');
  const [newDepTaxCode, setNewDepTaxCode] = useState('');

  // New Reward State
  const [newRewardTitle, setNewRewardTitle] = useState('');
  const [newRewardType, setNewRewardType] = useState<'reward' | 'discipline'>('reward');
  const [newRewardReason, setNewRewardReason] = useState('');
  const [newRewardAmount, setNewRewardAmount] = useState(5000000);

  // New Document State
  const [newDocName, setNewDocName] = useState('');
  const [newDocCategory, setNewDocCategory] = useState<'CCCD' | 'Bằng cấp' | 'Hợp đồng scan' | 'Chứng chỉ'>('Bằng cấp');

  const [submitting, setSubmitting] = useState(false);

  if (!employee) return null;

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Handlers for adding sub-entities
  const handleCreateContract = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.addEmployeeContract(employee.id, {
        contractNumber: newContractNumber || `HĐLĐ-2026/${employee.code}-${Math.floor(10 + Math.random() * 90)}`,
        contractType: newContractType,
        signDate: '2026-09-21',
        startDate: newContractStart,
        endDate: newContractType === 'Không xác định thời hạn' ? undefined : newContractEnd,
        signerName: 'Trịnh Văn Cường',
        signerTitle: 'Tổng Giám Đốc',
        salaryInsurance: Number(newContractSalary),
        status: 'active'
      });
      showToast('Đã tạo và ký hợp đồng lao động mới thành công', 'success');
      setShowAddContract(false);
      onReload();
    } catch (err: any) {
      showToast(err.message || 'Lỗi thêm hợp đồng', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateHistory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.addEmployeeWorkHistory(employee.id, {
        decisionNumber: newHistoryDecNumber || `QĐ-BGD/2026/${Math.floor(100 + Math.random() * 900)}`,
        effectiveDate: newHistoryDate,
        type: newHistoryType,
        title: newHistoryTitle || 'Quyết định điều chỉnh nâng lương chuyên môn',
        departmentName: employee.departmentName,
        positionTitle: employee.positionTitle,
        salaryBefore: employee.salary.baseSalary,
        salaryAfter: Number(newHistorySalaryAfter),
        signDate: newHistoryDate,
        notes: 'Đã cập nhật tự động vào hệ thống tiền lương'
      });
      showToast('Đã lưu quyết định công tác và cập nhật mức lương mới', 'success');
      setShowAddHistory(false);
      onReload();
    } catch (err: any) {
      showToast(err.message || 'Lỗi lưu quá trình công tác', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateDependent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDepName.trim()) return;
    try {
      setSubmitting(true);
      await api.addEmployeeDependent(employee.id, {
        fullName: newDepName,
        relationship: newDepRelation,
        dob: newDepDob,
        idCardOrBirthCert: `0012${Math.floor(10000000 + Math.random() * 90000000)}`,
        taxCode: newDepTaxCode || `850${Math.floor(1000000 + Math.random() * 9000000)}`,
        deductionStart: '2026-09-01'
      });
      showToast('Đã thêm người phụ thuộc (Tự động giảm trừ gia cảnh 4.4tr/người trên bảng lương)', 'success');
      setShowAddDependent(false);
      setNewDepName('');
      onReload();
    } catch (err: any) {
      showToast(err.message || 'Lỗi thêm người phụ thuộc', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDependent = async (depId: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa người phụ thuộc này khỏi hồ sơ thuế?')) return;
    try {
      await api.deleteEmployeeDependent(employee.id, depId);
      showToast('Đã xóa người phụ thuộc và tự động cập nhật lại bảng lương', 'success');
      onReload();
    } catch (err: any) {
      showToast(err.message || 'Lỗi xóa người phụ thuộc', 'error');
    }
  };

  const handleCreateReward = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRewardTitle.trim()) return;
    try {
      setSubmitting(true);
      await api.addEmployeeReward(employee.id, {
        decisionNumber: `QĐ-${newRewardType === 'reward' ? 'KT' : 'KL'}/2026/${Math.floor(10 + Math.random() * 90)}`,
        date: '2026-09-21',
        type: newRewardType,
        title: newRewardTitle,
        reason: newRewardReason || 'Đóng góp xuất sắc cho dự án trọng điểm',
        amount: Number(newRewardAmount),
        signBy: 'Tổng Giám Đốc'
      });
      showToast(`Đã thêm quyết định ${newRewardType === 'reward' ? 'khen thưởng' : 'kỷ luật'} thành công`, 'success');
      setShowAddReward(false);
      setNewRewardTitle('');
      setNewRewardReason('');
      onReload();
    } catch (err: any) {
      showToast(err.message || 'Lỗi thêm quyết định', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;
    try {
      setSubmitting(true);
      await api.addEmployeeDocument(employee.id, {
        name: newDocName.endsWith('.pdf') ? newDocName : `${newDocName}.pdf`,
        category: newDocCategory,
        fileSize: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
        fileType: 'application/pdf'
      });
      showToast('Đã lưu trữ tài liệu số vào hồ sơ nhân sự', 'success');
      setShowAddDocument(false);
      setNewDocName('');
      onReload();
    } catch (err: any) {
      showToast(err.message || 'Lỗi tải lên tài liệu', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const contractsList = employee.contracts || [];
  const historyList = employee.workHistory || [];
  const rewardsList = employee.rewardsDisciplines || [];
  const dependentsList = employee.dependentsList || [];
  const documentsList = employee.documents || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-2 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#005A96] text-white p-5 relative flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-[#0072BC] to-sky-400 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg ring-4 ring-white/10 flex-shrink-0">
              {employee.fullName.split(' ').slice(-1)[0][0]}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold">{employee.fullName}</h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-sky-500/20 text-sky-200 border border-sky-400/30">
                  {employee.code}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                    employee.status === 'active'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : employee.status === 'probation'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-rose-500/20 text-rose-300'
                  }`}
                >
                  {employee.status === 'active'
                    ? 'Chính thức'
                    : employee.status === 'probation'
                    ? 'Thử việc'
                    : 'Nghỉ việc'}
                </span>
              </div>
              <p className="text-slate-300 text-xs mt-1 flex items-center gap-2">
                <span className="font-semibold text-white">{employee.positionTitle}</span>
                <span>•</span>
                <span>{employee.departmentName}</span>
                <span>•</span>
                <span>Gia nhập: {employee.joinDate}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-700/60 rounded-lg transition"
              title="In phiếu lý lịch nhân sự"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-lg transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-4 bg-slate-50 text-xs font-semibold overflow-x-auto select-none">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-[#0072BC] text-[#0072BC] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Sơ yếu lý lịch</span>
          </button>

          <button
            onClick={() => setActiveTab('contracts')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'contracts'
                ? 'border-[#0072BC] text-[#0072BC] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Hợp đồng & Phụ lục</span>
            {contractsList.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-[#0072BC]">
                {contractsList.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'history'
                ? 'border-[#0072BC] text-[#0072BC] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Quá trình công tác</span>
            {historyList.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700">
                {historyList.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('dependents')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'dependents'
                ? 'border-[#0072BC] text-[#0072BC] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users2 className="w-4 h-4" />
            <span>Người phụ thuộc thuế</span>
            {dependentsList.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                {dependentsList.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('rewards')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'rewards'
                ? 'border-[#0072BC] text-[#0072BC] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Khen thưởng / Kỷ luật</span>
            {rewardsList.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-100 text-purple-700">
                {rewardsList.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'documents'
                ? 'border-[#0072BC] text-[#0072BC] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>Chứng từ số hóa</span>
            {documentsList.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700">
                {documentsList.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('salary')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'salary'
                ? 'border-[#0072BC] text-[#0072BC] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BadgeDollarSign className="w-4 h-4" />
            <span>Lương & Ngân hàng</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs">
          {/* TAB 1: Sơ yếu lý lịch */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-sm border-b pb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#0072BC]" />
                  <span>Thông tin cá nhân & Giấy tờ tùy thân</span>
                </h3>
                <div className="grid grid-cols-2 gap-3 text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Họ và tên:</span>
                    <span className="font-semibold text-slate-900">{employee.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Giới tính:</span>
                    <span className="font-semibold text-slate-900">{employee.gender}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Ngày sinh:</span>
                    <span className="font-semibold text-slate-900">{employee.dob}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Trình độ chuyên môn:</span>
                    <span className="font-semibold text-slate-900">{employee.education}</span>
                  </div>
                </div>

                <div className="pt-2 border-t space-y-2">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Số Thẻ CCCD gắn chip (12 số):</span>
                    <span className="font-bold font-mono text-slate-900 text-sm">{employee.idCard}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Ngày cấp:</span>
                      <span className="font-semibold text-slate-800">{employee.idCardDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Nơi cấp:</span>
                      <span className="font-semibold text-slate-800">{employee.idCardPlace}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-sm border-b pb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#0072BC]" />
                  <span>Kênh liên lạc & Hộ khẩu</span>
                </h3>
                <div className="space-y-3 text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Số điện thoại cá nhân:</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {employee.phone}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Email công vụ MISA:</span>
                    <span className="font-semibold text-[#0072BC] flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {employee.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Nơi ở thường trú hiện tại:</span>
                    <span className="font-semibold text-slate-800 flex items-start gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                      {employee.address}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Quê quán (Nguyên quán):</span>
                    <span className="font-semibold text-slate-800">{employee.hometown}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Hợp đồng & Phụ lục */}
          {activeTab === 'contracts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-[#0072BC]" />
                    <span>Lịch sử Hợp đồng lao động & Phụ lục hợp đồng</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Theo dõi đầy đủ quá trình ký kết HĐLĐ từ lúc thử việc đến hợp đồng chính thức
                  </p>
                </div>

                {(role === 'admin' || role === 'manager') && (
                  <button
                    onClick={() => setShowAddContract(!showAddContract)}
                    className="px-3 py-1.5 bg-[#0072BC] hover:bg-[#005A96] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ký HĐ / Phụ lục mới</span>
                  </button>
                )}
              </div>

              {/* Add Contract Form Drawer */}
              {showAddContract && (
                <form
                  onSubmit={handleCreateContract}
                  className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 space-y-3 animate-in fade-in"
                >
                  <div className="font-bold text-[#0072BC] text-xs uppercase tracking-wider">
                    Ký kết Hợp đồng lao động / Phụ lục mới
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Số hợp đồng</label>
                      <input
                        type="text"
                        placeholder="HĐLĐ-2026/MISA..."
                        value={newContractNumber}
                        onChange={(e) => setNewContractNumber(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Loại hợp đồng</label>
                      <select
                        value={newContractType}
                        onChange={(e) => setNewContractType(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                      >
                        <option value="Không xác định thời hạn">Hợp đồng không xác định thời hạn</option>
                        <option value="Hợp đồng xác định thời hạn 36 tháng">Hợp đồng xác định thời hạn 36 tháng</option>
                        <option value="Hợp đồng xác định thời hạn 12 tháng">Hợp đồng xác định thời hạn 12 tháng</option>
                        <option value="Phụ lục hợp đồng điều chỉnh lương">Phụ lục hợp đồng điều chỉnh lương</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Mức lương đóng BHXH (VND)</label>
                      <input
                        type="number"
                        step="500000"
                        value={newContractSalary}
                        onChange={(e) => setNewContractSalary(Number(e.target.value))}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Ngày bắt đầu hiệu lực</label>
                      <input
                        type="date"
                        value={newContractStart}
                        onChange={(e) => setNewContractStart(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Ngày hết hạn HĐ</label>
                      <input
                        type="date"
                        value={newContractEnd}
                        onChange={(e) => setNewContractEnd(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-4 py-2 bg-[#0072BC] text-white rounded-lg font-semibold hover:bg-[#005A96] transition cursor-pointer"
                      >
                        {submitting ? 'Đang lưu...' : 'Lưu hợp đồng'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddContract(false)}
                        className="px-3 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition cursor-pointer"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Contracts Timeline Table */}
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                {contractsList.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    Chưa có lịch sử hợp đồng chi tiết. Bạn có thể bấm "Ký HĐ / Phụ lục mới" để thêm.
                  </div>
                ) : (
                  contractsList.map((contract) => (
                    <div key={contract.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 font-mono text-sm">{contract.contractNumber}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              contract.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {contract.status === 'active' ? 'Đang hiệu lực' : 'Đã hết hạn / Chuyển tiếp'}
                          </span>
                        </div>
                        <div className="font-semibold text-slate-800">{contract.contractType}</div>
                        <div className="text-slate-500 text-[11px] flex items-center gap-3">
                          <span>Ký ngày: {contract.signDate}</span>
                          <span>•</span>
                          <span>
                            Thời hạn: {contract.startDate} → {contract.endDate || 'Vô thời hạn'}
                          </span>
                        </div>
                        {contract.notes && (
                          <div className="text-slate-400 text-[10px] italic">Ghi chú: {contract.notes}</div>
                        )}
                      </div>

                      <div className="text-right sm:border-l sm:pl-4 border-slate-200">
                        <span className="text-slate-400 text-[10px] block">Mức lương đóng BHXH</span>
                        <span className="font-bold font-mono text-slate-800 text-sm">
                          {formatVND(contract.salaryInsurance)}
                        </span>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Đại diện ký: {contract.signerName}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Quá trình công tác */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <History className="w-4 h-4 text-[#0072BC]" />
                    <span>Dòng thời gian Quá trình công tác & Thăng tiến</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Ghi nhận các quyết định bổ nhiệm, thăng chức, điều chuyển và tăng lương định kỳ
                  </p>
                </div>

                {(role === 'admin' || role === 'manager') && (
                  <button
                    onClick={() => setShowAddHistory(!showAddHistory)}
                    className="px-3 py-1.5 bg-[#0072BC] hover:bg-[#005A96] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm quyết định công tác</span>
                  </button>
                )}
              </div>

              {/* Add History Form */}
              {showAddHistory && (
                <form
                  onSubmit={handleCreateHistory}
                  className="bg-purple-50/50 p-4 rounded-xl border border-purple-200 space-y-3 animate-in fade-in"
                >
                  <div className="font-bold text-purple-700 text-xs uppercase tracking-wider">
                    Ban hành Quyết định Bổ nhiệm / Tăng lương mới
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Số quyết định</label>
                      <input
                        type="text"
                        placeholder="QĐ-BGD/2026/..."
                        value={newHistoryDecNumber}
                        onChange={(e) => setNewHistoryDecNumber(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Loại quyết định</label>
                      <select
                        value={newHistoryType}
                        onChange={(e) => setNewHistoryType(e.target.value as any)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                      >
                        <option value="salary_raise">Điều chỉnh tăng bậc lương</option>
                        <option value="promotion">Thăng chức / Bổ nhiệm vị trí cao hơn</option>
                        <option value="transfer">Điều chuyển phòng ban công tác</option>
                        <option value="appointment">Bổ nhiệm cán bộ quản lý</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Tiêu đề quyết định</label>
                      <input
                        type="text"
                        placeholder="Ví dụ: Nâng bậc lương định kỳ 2026"
                        value={newHistoryTitle}
                        onChange={(e) => setNewHistoryTitle(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Mức lương mới sau quyết định</label>
                      <input
                        type="number"
                        step="500000"
                        value={newHistorySalaryAfter}
                        onChange={(e) => setNewHistorySalaryAfter(Number(e.target.value))}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Ngày áp dụng</label>
                      <input
                        type="date"
                        value={newHistoryDate}
                        onChange={(e) => setNewHistoryDate(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-4 py-2 bg-purple-700 text-white rounded-lg font-semibold hover:bg-purple-800 transition cursor-pointer"
                      >
                        {submitting ? 'Đang lưu...' : 'Ban hành quyết định'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddHistory(false)}
                        className="px-3 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition cursor-pointer"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Timeline Items */}
              <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {historyList.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    Chưa có lịch sử thăng tiến ghi nhận.
                  </div>
                ) : (
                  historyList.map((item) => (
                    <div key={item.id} className="relative group">
                      <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-[#0072BC] ring-4 ring-white"></div>
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-[#0072BC] transition space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-sm">{item.title}</span>
                          <span className="font-mono text-[11px] font-semibold text-slate-500">
                            Số: {item.decisionNumber}
                          </span>
                        </div>
                        <div className="text-slate-600 text-xs flex items-center gap-2">
                          <span className="font-medium">{item.positionTitle}</span>
                          <span>•</span>
                          <span>{item.departmentName}</span>
                        </div>
                        {item.salaryAfter && (
                          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md w-fit mt-1">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>
                              Mức lương điều chỉnh: {item.salaryBefore ? `${formatVND(item.salaryBefore)} → ` : ''}
                              <strong>{formatVND(item.salaryAfter)}</strong>
                            </span>
                          </div>
                        )}
                        <div className="text-slate-400 text-[10px] pt-1">
                          Hiệu lực từ ngày: {item.effectiveDate}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: Người phụ thuộc thuế */}
          {activeTab === 'dependents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <Users2 className="w-4 h-4 text-emerald-600" />
                    <span>Hồ sơ Người phụ thuộc & Giảm trừ gia cảnh (Thuế TNCN)</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Mỗi người phụ thuộc hợp lệ được giảm trừ <strong>4.400.000 VNĐ / tháng</strong> khi tính thuế TNCN
                  </p>
                </div>

                {(role === 'admin' || role === 'manager') && (
                  <button
                    onClick={() => setShowAddDependent(!showAddDependent)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Đăng ký người phụ thuộc</span>
                  </button>
                )}
              </div>

              {/* Add Dependent Form */}
              {showAddDependent && (
                <form
                  onSubmit={handleCreateDependent}
                  className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 space-y-3 animate-in fade-in"
                >
                  <div className="font-bold text-emerald-800 text-xs uppercase tracking-wider">
                    Khai trình người phụ thuộc giảm trừ gia cảnh
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-semibold mb-1">
                        Họ và tên người phụ thuộc <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ví dụ: Trịnh Bảo Ngọc"
                        value={newDepName}
                        onChange={(e) => setNewDepName(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Quan hệ với nhân viên</label>
                      <select
                        value={newDepRelation}
                        onChange={(e) => setNewDepRelation(e.target.value as any)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                      >
                        <option value="Con cái">Con cái</option>
                        <option value="Vợ/Chồng">Vợ / Chồng không có thu nhập</option>
                        <option value="Cha mẹ ruột">Cha mẹ ruột hết tuổi lao động</option>
                        <option value="Cha mẹ vợ/chồng">Cha mẹ vợ / chồng</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Ngày sinh</label>
                      <input
                        type="date"
                        value={newDepDob}
                        onChange={(e) => setNewDepDob(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-semibold mb-1">Mã số thuế NPT (nếu có)</label>
                      <input
                        type="text"
                        placeholder="Mã số thuế do Cục Thuế cấp..."
                        value={newDepTaxCode}
                        onChange={(e) => setNewDepTaxCode(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2 flex items-end gap-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition cursor-pointer"
                      >
                        {submitting ? 'Đang lưu...' : 'Xác nhận đăng ký'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddDependent(false)}
                        className="px-3 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition cursor-pointer"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Dependents Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dependentsList.length === 0 ? (
                  <div className="col-span-2 p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                    Chưa có người phụ thuộc nào đăng ký. Mức giảm trừ gia cảnh hiện tại là 0 đ.
                  </div>
                ) : (
                  dependentsList.map((dep) => (
                    <div
                      key={dep.id}
                      className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-start justify-between relative group hover:border-emerald-500 transition"
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <span>{dep.fullName}</span>
                          <span className="px-2 py-0.2 bg-emerald-50 text-emerald-700 font-semibold rounded text-[10px]">
                            {dep.relationship}
                          </span>
                        </div>
                        <div className="text-slate-500 text-[11px]">
                          Ngày sinh: {dep.dob} • MST: {dep.taxCode || 'Đang cập nhật'}
                        </div>
                        <div className="text-emerald-700 font-semibold text-[11px] pt-1">
                          Mức giảm trừ: 4.400.000 ₫/tháng
                        </div>
                      </div>

                      {role === 'admin' && (
                        <button
                          onClick={() => handleDeleteDependent(dep.id)}
                          className="text-slate-300 hover:text-rose-600 p-1 rounded transition cursor-pointer"
                          title="Xóa người phụ thuộc"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: Khen thưởng & Kỷ luật */}
          {activeTab === 'rewards' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-600" />
                    <span>Sổ Khen thưởng & Quyết định Kỷ luật</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Lưu vết hồ sơ thi đua khen thưởng và các chế tài kỷ luật lao động
                  </p>
                </div>

                {(role === 'admin' || role === 'manager') && (
                  <button
                    onClick={() => setShowAddReward(!showAddReward)}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm khen thưởng / kỷ luật</span>
                  </button>
                )}
              </div>

              {/* Add Reward Form */}
              {showAddReward && (
                <form
                  onSubmit={handleCreateReward}
                  className="bg-purple-50/50 p-4 rounded-xl border border-purple-200 space-y-3 animate-in fade-in"
                >
                  <div className="font-bold text-purple-800 text-xs uppercase tracking-wider">
                    Ban hành Quyết định Khen thưởng / Kỷ luật
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Hình thức</label>
                      <select
                        value={newRewardType}
                        onChange={(e) => setNewRewardType(e.target.value as any)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                      >
                        <option value="reward">Khen thưởng thành tích</option>
                        <option value="discipline">Kỷ luật vi phạm</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-semibold mb-1">Tiêu đề quyết định</label>
                      <input
                        type="text"
                        required
                        placeholder="Ví dụ: Khen thưởng Nhân viên xuất sắc Quý..."
                        value={newRewardTitle}
                        onChange={(e) => setNewRewardTitle(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-semibold mb-1">Lý do cụ thể</label>
                      <input
                        type="text"
                        placeholder="Mô tả thành tích hoặc hành vi vi phạm..."
                        value={newRewardReason}
                        onChange={(e) => setNewRewardReason(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Số tiền thưởng/phạt (VND)</label>
                      <input
                        type="number"
                        step="500000"
                        value={newRewardAmount}
                        onChange={(e) => setNewRewardAmount(Number(e.target.value))}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-bold"
                      />
                    </div>
                    <div className="sm:col-span-3 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddReward(false)}
                        className="px-3 py-2 bg-slate-200 text-slate-700 rounded-lg"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold"
                      >
                        {submitting ? 'Đang lưu...' : 'Lưu quyết định'}
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Rewards List */}
              <div className="space-y-3">
                {rewardsList.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                    Chưa có quyết định khen thưởng hay kỷ luật nào trong hồ sơ.
                  </div>
                ) : (
                  rewardsList.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl border shadow-xs flex items-center justify-between ${
                        item.type === 'reward'
                          ? 'bg-purple-50/40 border-purple-200'
                          : 'bg-rose-50/40 border-rose-200'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.type === 'reward'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {item.type === 'reward' ? 'KHEN THƯỞNG' : 'KỶ LUẬT'}
                          </span>
                          <span className="font-bold text-slate-900">{item.title}</span>
                          <span className="font-mono text-[10px] text-slate-500">Số: {item.decisionNumber}</span>
                        </div>
                        <div className="text-slate-600 text-xs">{item.reason}</div>
                        <div className="text-slate-400 text-[10px]">
                          Ngày ban hành: {item.date} • Ký bởi: {item.signBy}
                        </div>
                      </div>

                      {item.amount && item.amount > 0 && (
                        <div className="font-mono font-black text-sm text-purple-700">
                          +{formatVND(item.amount)}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 6: Chứng từ số hóa */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-[#0072BC]" />
                    <span>Kho Chứng Từ & Hồ Sơ Đính Kèm Số Hóa</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Lưu trữ bản scan hợp đồng đã ký, CCCD 2 mặt, văn bằng chứng chỉ
                  </p>
                </div>

                <button
                  onClick={() => setShowAddDocument(!showAddDocument)}
                  className="px-3 py-1.5 bg-[#0072BC] hover:bg-[#005A96] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tải lên tài liệu số</span>
                </button>
              </div>

              {/* Upload Document Form */}
              {showAddDocument && (
                <form
                  onSubmit={handleCreateDocument}
                  className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 space-y-3 animate-in fade-in"
                >
                  <div className="font-bold text-[#0072BC] text-xs uppercase tracking-wider">
                    Đính kèm tài liệu số mới vào hồ sơ
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-semibold mb-1">Tên tài liệu / Văn bằng</label>
                      <input
                        type="text"
                        required
                        placeholder="Ví dụ: ChungChi_TiengAnh_IELTS.pdf"
                        value={newDocName}
                        onChange={(e) => setNewDocName(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Danh mục tài liệu</label>
                      <select
                        value={newDocCategory}
                        onChange={(e) => setNewDocCategory(e.target.value as any)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                      >
                        <option value="Bằng cấp">Bằng cấp & Học hàm</option>
                        <option value="Chứng chỉ">Chứng chỉ chuyên môn</option>
                        <option value="CCCD">Căn cước công dân scan</option>
                        <option value="Hợp đồng scan">Hợp đồng lao động có chữ ký</option>
                        <option value="Khác">Giấy khám sức khỏe / Khác</option>
                      </select>
                    </div>
                    <div className="sm:col-span-3 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddDocument(false)}
                        className="px-3 py-2 bg-slate-200 text-slate-700 rounded-lg"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-4 py-2 bg-[#0072BC] text-white rounded-lg font-semibold cursor-pointer"
                      >
                        {submitting ? 'Đang lưu...' : 'Lưu trữ tài liệu'}
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Documents Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {documentsList.length === 0 ? (
                  <div className="col-span-3 p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                    Chưa có tài liệu đính kèm nào được tải lên.
                  </div>
                ) : (
                  documentsList.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-[#0072BC] hover:shadow-md transition space-y-2 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 bg-blue-50 text-[#0072BC] font-semibold rounded text-[10px]">
                            {doc.category}
                          </span>
                          <span className="text-[10px] text-slate-400">{doc.fileSize}</span>
                        </div>
                        <div className="font-bold text-slate-800 text-xs mt-2 line-clamp-1" title={doc.name}>
                          {doc.name}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">Đã tải lên: {doc.uploadDate}</div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Đã xác thực
                        </span>
                        <button
                          onClick={() => showToast(`Đang tải tài liệu ${doc.name}...`, 'info')}
                          className="text-xs text-[#0072BC] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Tải về</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 7: Lương & Ngân hàng */}
          {activeTab === 'salary' && (
            <div className="space-y-6">
              <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-500">Mức lương cơ bản (đóng BHXH)</div>
                    <div className="text-2xl font-bold text-[#0072BC] mt-1">
                      {formatVND(employee.salary.baseSalary)}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-500">Mã số thuế cá nhân</span>
                    <div className="text-sm font-bold text-slate-800 font-mono">
                      {employee.salary.taxCode || 'Chưa cập nhật'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-500 text-[11px]">Phụ cấp trách nhiệm</div>
                  <div className="text-base font-bold text-slate-800 mt-1">
                    {formatVND(employee.salary.allowanceResponsibility)}
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-500 text-[11px]">Phụ cấp ăn trưa</div>
                  <div className="text-base font-bold text-slate-800 mt-1">
                    {formatVND(employee.salary.allowanceLunch)}
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-500 text-[11px]">Phụ cấp xăng xe & điện thoại</div>
                  <div className="text-base font-bold text-slate-800 mt-1">
                    {formatVND(employee.salary.allowanceGas)}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block text-[11px]">Số sổ Bảo hiểm xã hội:</span>
                  <span className="font-semibold text-slate-800 font-mono">{employee.salary.insuranceBookNumber || 'Đang cấp'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Số người phụ thuộc giảm trừ gia cảnh:</span>
                  <span className="font-bold text-slate-800 text-sm">{employee.salary.dependents} người</span>
                  <span className="text-emerald-700 font-semibold text-[11px] block mt-0.5">
                    (-{formatVND(employee.salary.dependents * 4400000)} / tháng)
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <CreditCard className="w-4 h-4 text-[#0072BC]" />
                  <span>Tài khoản ngân hàng nhận lương</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-slate-700 pt-2">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Ngân hàng:</span>
                    <span className="font-semibold">{employee.bankAccount.bankName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Số tài khoản:</span>
                    <span className="font-mono font-bold">{employee.bankAccount.accountNumber || '--'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Chi nhánh:</span>
                    <span>{employee.bankAccount.branch || 'Hà Nội'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Hồ sơ nhân sự điện tử tích hợp chuẩn MISA AMIS HRM Enterprise
          </span>
          <div className="flex items-center gap-2">
            {(role === 'admin' || role === 'manager') && (
              <button
                onClick={() => {
                  onEdit(employee);
                  onClose();
                }}
                className="px-4 py-2 bg-[#0072BC] hover:bg-[#005A96] text-white text-xs font-semibold rounded-lg shadow-sm transition cursor-pointer"
              >
                Chỉnh sửa thông tin chung
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold rounded-lg transition cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
