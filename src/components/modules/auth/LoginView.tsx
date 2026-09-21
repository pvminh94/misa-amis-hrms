import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  LogIn,
  CheckCircle2,
  Sparkles,
  KeyRound,
  Building2,
  HelpCircle,
  ArrowRight,
  Shield,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';

export const LoginView: React.FC = () => {
  const { login, quickLoginAs } = useAuth();
  const { showToast } = useToast();

  const [username, setUsername] = useState('cuongtv');
  const [password, setPassword] = useState('Amis@123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      showToast('Vui lòng nhập tên đăng nhập hoặc email', 'error');
      return;
    }

    try {
      setLoading(true);
      await login(username, password);
      showToast(`Đăng nhập thành công! Chào mừng trở lại AMIS HRM`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Đăng nhập không thành công. Vui lòng kiểm tra lại', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-[#004d80] flex items-center justify-center p-4 sm:p-6 select-none">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        {/* Left Col: Brand & System Features Showcase (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#005A96] to-[#003860] p-8 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-white/5 pointer-events-none blur-2xl"></div>
          <div className="absolute -left-10 -top-10 w-48 h-48 rounded-full bg-sky-400/10 pointer-events-none blur-xl"></div>

          <div className="space-y-6 relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#0072BC] flex items-center justify-center font-black text-xl shadow-md">
                A
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight">AMIS</span>
                <span className="ml-1.5 text-xs uppercase px-2 py-0.5 bg-white/20 rounded font-semibold tracking-wider">
                  HRM Enterprise
                </span>
                <div className="text-[10px] text-sky-200 mt-0.5">Nền tảng Quản trị Nguồn nhân lực Toàn diện</div>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <h2 className="text-xl font-bold leading-snug">
                Số hóa 100% Vòng đời Nhân sự từ Tiếp nhận đến Thôi việc
              </h2>
              <p className="text-xs text-sky-100/90 leading-relaxed">
                Hệ thống chuẩn mực quản trị nhân sự doanh nghiệp Việt Nam, tích hợp đồng bộ dữ liệu Tuyển dụng, Chấm công, Tiền lương và Phân quyền RBAC.
              </p>
            </div>

            {/* Core Feature highlights */}
            <div className="space-y-2.5 pt-2 text-xs">
              <div className="flex items-start gap-2.5 bg-white/10 p-2.5 rounded-xl backdrop-blur-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white">Quy trình Onboarding A-Z</strong>
                  <span className="text-[11px] text-sky-100/80">
                    Chuyển tiếp hồ sơ ứng viên từ CRM sang Nhân viên, tự động tạo HĐLĐ, phân ca & tài khoản.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-white/10 p-2.5 rounded-xl backdrop-blur-xs">
                <ShieldCheck className="w-4 h-4 text-sky-300 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white">Phân Quyền Ma Trận RBAC</strong>
                  <span className="text-[11px] text-sky-100/80">
                    6 tác vụ độc lập trên 8 phân hệ, truy vết bảo mật Audit Trail và quản trị phiên an toàn.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-white/10 p-2.5 rounded-xl backdrop-blur-xs">
                <Briefcase className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white">Thuế TNCN & Tiền Lương Chuẩn</strong>
                  <span className="text-[11px] text-sky-100/80">
                    Biểu thuế lũy tiến 7 bậc, trần BHXH 46.8tr, phụ cấp miễn thuế và phát hành Phiếu lương điện tử.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer compliance badge */}
          <div className="pt-6 border-t border-white/15 text-[10px] text-sky-200/80 flex items-center justify-between relative z-10">
            <span>Tuân thủ Nghị định 13/2023/NĐ-CP</span>
            <span>Bảo mật ISO/IEC 27001</span>
          </div>
        </div>

        {/* Right Col: Login Form & Quick Access (7 cols) */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between bg-white">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-slate-900">Đăng Nhập Hệ Thống</h1>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-[#0072BC] border border-blue-200">
                  Phiên bản 4.5 Enterprise
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Nhập tài khoản được cấp hoặc chọn một vai trò demo bên dưới để bắt đầu trải nghiệm ngay
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold block">
                  Tên đăng nhập hoặc Email công vụ:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: cuongtv hoặc cuongtv@amis.vn"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-[#0072BC]/20 focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-slate-700 font-bold block">Mật khẩu:</label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[#0072BC] hover:underline text-[11px] font-semibold cursor-pointer"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Nhập mật khẩu..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-[#0072BC]/20 focus:outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-[#0072BC] rounded border-slate-300"
                  />
                  <span>Ghi nhớ phiên đăng nhập trên thiết bị này</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#0072BC] hover:bg-[#005A96] text-white font-bold rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2 text-xs active:scale-[0.99] disabled:opacity-60"
              >
                <LogIn className="w-4 h-4" />
                <span>{loading ? 'Đang xác thực thông tin...' : 'Đăng Nhập Vào Hệ Thống'}</span>
              </button>
            </form>

            {/* Quick Demo Login Switcher */}
            <div className="pt-2 border-t border-slate-100 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Trải nghiệm nhanh với 1 Click (Demo Logins):</span>
                </span>
                <span className="text-[10px] text-slate-400">Tự động điền & cấp quyền</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-left">
                {/* 1. Super Admin */}
                <button
                  type="button"
                  onClick={() => quickLoginAs('admin')}
                  className="p-2.5 bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-[#0072BC] rounded-xl transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 group-hover:text-[#0072BC] text-[11px]">
                      👑 Tổng Giám Đốc
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-[#0072BC] transition group-hover:translate-x-0.5" />
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Trịnh Văn Cường • Super Admin</div>
                </button>

                {/* 2. Manager */}
                <button
                  type="button"
                  onClick={() => quickLoginAs('manager')}
                  className="p-2.5 bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-[#0072BC] rounded-xl transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 group-hover:text-[#0072BC] text-[11px]">
                      👔 Trưởng Khối Tech
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-[#0072BC] transition group-hover:translate-x-0.5" />
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Vũ Quốc Thái • Duyệt công & phép</div>
                </button>

                {/* 3. C&B Specialist */}
                <button
                  type="button"
                  onClick={() => quickLoginAs('cb_specialist')}
                  className="p-2.5 bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-[#0072BC] rounded-xl transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 group-hover:text-[#0072BC] text-[11px]">
                      👩‍💼 Chuyên viên C&B
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-[#0072BC] transition group-hover:translate-x-0.5" />
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Nguyễn Thị Thu Hằng • Quản lý lương</div>
                </button>

                {/* 4. Staff Employee */}
                <button
                  type="button"
                  onClick={() => quickLoginAs('employee')}
                  className="p-2.5 bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-[#0072BC] rounded-xl transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 group-hover:text-[#0072BC] text-[11px]">
                      👨‍💻 Nhân viên Tiêu chuẩn
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-[#0072BC] transition group-hover:translate-x-0.5" />
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Phạm Thị Hương Ly • Chấm công, đơn từ</div>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 text-center text-[11px] text-slate-400 border-t border-slate-100">
            Hệ thống Quản trị AMIS HRM © 2026. Hỗ trợ kỹ thuật: 1900 8677 • support@amis.vn
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm p-6 space-y-4 text-xs">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-[#0072BC] flex items-center justify-center mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-sm text-slate-900">Khôi Phục Mật Khẩu Truy Cập</h3>
              <p className="text-slate-500 leading-relaxed">
                Theo chính sách bảo mật nội bộ, mật khẩu nhân sự được quản lý tập trung. Quý vị vui lòng liên hệ trực tiếp Quản trị viên hệ thống (Admin) hoặc Chuyên viên C&B để được cấp mật khẩu tạm thời một lần.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-slate-600">
              <div>• Email hỗ trợ: <strong>admin@amis.vn</strong></div>
              <div>• Hotline nội bộ: <strong>Nhánh 101 (Ban IT)</strong></div>
              <div>• Mật khẩu mặc định tài khoản thử nghiệm: <strong className="font-mono text-[#0072BC]">Amis@123456</strong></div>
            </div>

            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2 bg-[#0072BC] hover:bg-[#005A96] text-white font-bold rounded-lg transition cursor-pointer"
            >
              Đã hiểu & Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
