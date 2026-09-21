import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ScanFace,
  Smartphone,
  Fingerprint,
  MapPin,
  Wifi,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ShieldCheck,
  Building,
  RefreshCw,
  QrCode,
  Download,
  Eye,
  Activity,
  Layers,
  Lock,
  Compass,
  Check,
  HelpCircle,
  ExternalLink,
  Cpu,
  CreditCard,
  UserX,
  UserCheck,
  AlertOctagon,
  KeyRound
} from 'lucide-react';
import { Employee, GeofenceLocation, FaceBiometricProfile } from '../../../types';
import { api } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import { FaceEnrollmentModal } from './FaceEnrollmentModal';

interface OmniCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  employees: Employee[];
  locations: GeofenceLocation[];
  onSuccess: () => void;
}

export const OmniCheckInModal: React.FC<OmniCheckInModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  employees,
  locations,
  onSuccess
}) => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'mobile_app' | 'face_terminal' | 'rfid' | 'pwa_guide' | 'anti_spoof_doc'>('mobile_app');
  const [selectedEmpId, setSelectedEmpId] = useState(currentUser?.employeeId || currentUser?.id || employees[0]?.id || '');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<any | null>(null);

  // Face Biometrics state
  const [biometricProfiles, setBiometricProfiles] = useState<FaceBiometricProfile[]>([]);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

  // Mobile App Simulation States
  const [gpsDistance, setGpsDistance] = useState(18); // 18m from Duy Tan HQ
  const [gpsCoords, setGpsCoords] = useState({ lat: 21.0315, lng: 105.7828 });
  const [wifiSsid] = useState('AMIS_CORP_5G');
  const [cameraActive, setCameraActive] = useState(true);
  const [livenessStage, setLivenessStage] = useState<'align' | 'blink' | 'head_turn' | 'verified'>('align');
  const [blinkCompleted, setBlinkCompleted] = useState(false);
  const [headTurnCompleted, setHeadTurnCompleted] = useState(false);
  const [antiSpoofScore, setAntiSpoofScore] = useState(99.8);
  const [spoofAttackSimulated, setSpoofAttackSimulated] = useState(false);

  // Terminal States
  const [bodyTemp] = useState('36.5°C');
  const [terminalScanning, setTerminalScanning] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Load registered biometrics
  const loadBiometrics = async () => {
    try {
      const data = await api.getFaceBiometrics();
      setBiometricProfiles(Array.isArray(data) ? data : []);
    } catch (e) {
      console.warn('Lỗi nạp danh sách sinh trắc:', e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadBiometrics();
    }
  }, [isOpen]);

  // Live ticking clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Web Audio chime for real-world punch sound
  const playChime = (success = true) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';

      if (success) {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
      } else {
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch (e) {
      // AudioContext fallback
    }
  };

  // Camera stream handler
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (cameraActive && (activeTab === 'mobile_app' || activeTab === 'face_terminal')) {
      navigator.mediaDevices?.getUserMedia?.({ video: { facingMode: 'user' } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(() => {
          // Camera permission denied or headless environment -> graceful fallback to AI Canvas simulator
        });
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [cameraActive, activeTab]);

  if (!isOpen) return null;

  const currentEmp = employees.find((e) => e.id === selectedEmpId) || employees[0];
  const enrolledProfile = biometricProfiles.find(
    (p) => p.employeeId === currentEmp?.id || p.employeeCode === currentEmp?.code
  );
  const isEnrolled = !!enrolledProfile;

  const currentLocation = locations[0] || {
    id: 'loc-01',
    name: 'Trụ sở AMIS Hà Nội (Tòa nhà Technosoft)',
    address: 'Phố Duy Tân, Cầu Giấy, Hà Nội',
    radiusMeters: 100
  };

  // Perform Real Check-in / Check-out with Biometric & Liveness Verification
  const handleExecutePunch = async (direction: 'in' | 'out', source: 'mobile_gps' | 'face_id' | 'fingerprint') => {
    // 1. If punch method requires Face / Biometric, check registration
    if ((source === 'mobile_gps' || source === 'face_id') && !isEnrolled) {
      playChime(false);
      showToast(
        `Từ chối chấm công: Nhân viên ${currentEmp.fullName} (${currentEmp.code}) chưa đăng ký mẫu khuôn mặt FaceID! Vui lòng đăng ký trước khi chấm công.`,
        'error'
      );
      return;
    }

    // 2. Check spoof attack
    if (spoofAttackSimulated && (source === 'mobile_gps' || source === 'face_id')) {
      playChime(false);
      showToast(
        '🚨 BÁO ĐỘNG GIAN LẬN: AI phát hiện giả mạo khuôn mặt (Screen Replay / Moiré Attack)! Chấm công bị từ chối và ghi log vi phạm.',
        'error'
      );
      return;
    }

    // 3. Check liveness completion for mobile
    if (source === 'mobile_gps' && livenessStage !== 'verified') {
      showToast('Vui lòng hoàn thành 2 bước kiểm tra người thật (Chớp mắt & Nghiêng đầu)', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      const timeStr = `${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}`;
      
      let res;
      if (direction === 'in') {
        res = await api.checkIn(currentEmp.id, timeStr);
      } else {
        res = await api.checkOut(currentEmp.id, timeStr);
      }

      playChime(true);

      const receiptObj = {
        direction,
        source,
        employeeName: currentEmp.fullName,
        employeeCode: currentEmp.code,
        departmentName: currentEmp.departmentName,
        time: `${timeStr}:${String(currentTime.getSeconds()).padStart(2, '0')}`,
        date: '2026-09-21',
        location: currentLocation.name,
        gpsDistance: `${gpsDistance}m (Hợp lệ)`,
        wifi: wifiSsid,
        livenessScore: `${antiSpoofScore}% (Người thật 3D)`,
        faceMatchScore: isEnrolled ? `${enrolledProfile?.confidenceScore || 99.8}% (Khớp Vector)` : 'N/A',
        featuresHash: enrolledProfile?.featuresHash || 'VEC-AUTH-PASS',
        status: 'Hợp Lệ & Đã Ghi Nhận'
      };

      setReceipt(receiptObj);
      showToast(
        direction === 'in'
          ? `Chấm công vào thành công lúc ${receiptObj.time} cho ${currentEmp.fullName}`
          : `Chấm công ra thành công lúc ${receiptObj.time} cho ${currentEmp.fullName}`,
        'success'
      );

      onSuccess();
    } catch (err: any) {
      playChime(false);
      showToast(err.message || 'Lỗi xử lý chấm công', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Interactive Liveness Challenge Triggers
  const handleTriggerBlink = () => {
    setBlinkCompleted(true);
    setLivenessStage('head_turn');
    showToast('AI phát hiện: Tỷ lệ mở mắt EAR < 0.2 (Chớp mắt tự nhiên ĐẠT)', 'success');
  };

  const handleTriggerHeadTurn = () => {
    setHeadTurnCompleted(true);
    setLivenessStage('verified');
    setAntiSpoofScore(99.9);
    setSpoofAttackSimulated(false);
    showToast('AI phát hiện: Góc quay Yaw +15° (Chuyển động 3D ĐẠT)', 'success');
  };

  const handleSimulateSpoof = () => {
    setSpoofAttackSimulated(true);
    setAntiSpoofScore(14.2);
    setLivenessStage('align');
    setBlinkCompleted(false);
    setHeadTurnCompleted(false);
    showToast('Mô phỏng tấn công: Ảnh 2D từ màn hình điện thoại đưa lên camera! AI phát hiện Moiré pattern và trường sâu phẳng (Flat Depth).', 'error');
  };

  const handleResetLiveness = () => {
    setSpoofAttackSimulated(false);
    setAntiSpoofScore(99.8);
    setLivenessStage('align');
    setBlinkCompleted(false);
    setHeadTurnCompleted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in select-none">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#005A96] to-[#003860] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-[#0072BC] flex items-center justify-center font-black text-xl shadow-md">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-tight">AMIS HRM</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/20 font-bold uppercase">
                  Trung Tâm Chấm Công Đa Phương Thức
                </span>
              </div>
              <p className="text-xs text-sky-200 mt-0.5">
                Tích hợp Mobile App GPS/Selfie AI, Hikvision FaceID Terminal & Máy vân tay Ronald Jack
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Multi-Channel Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-4 pt-2 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => { setActiveTab('mobile_app'); setReceipt(null); }}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'mobile_app'
                ? 'border-[#0072BC] text-[#0072BC]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>1. AMIS HRM Mobile App (GPS + Selfie Liveness)</span>
          </button>

          <button
            onClick={() => { setActiveTab('face_terminal'); setReceipt(null); }}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'face_terminal'
                ? 'border-[#0072BC] text-[#0072BC]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ScanFace className="w-4 h-4" />
            <span>2. Camera FaceID AI Tập Trung (Hikvision)</span>
          </button>

          <button
            onClick={() => { setActiveTab('rfid'); setReceipt(null); }}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'rfid'
                ? 'border-[#0072BC] text-[#0072BC]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Fingerprint className="w-4 h-4" />
            <span>3. Máy Vân Tay & Thẻ Từ (Ronald Jack)</span>
          </button>

          <button
            onClick={() => { setActiveTab('pwa_guide'); setReceipt(null); }}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'pwa_guide'
                ? 'border-[#0072BC] text-[#0072BC]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>4. Tải App / Cài Đặt PWA</span>
          </button>

          <button
            onClick={() => { setActiveTab('anti_spoof_doc'); setReceipt(null); }}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'anti_spoof_doc'
                ? 'border-[#0072BC] text-[#0072BC]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>5. Thuật Toán Chống Giả Mạo AI</span>
          </button>
        </div>

        {/* Employee Switcher Bar (For Demo & Admin Testing) */}
        <div className="px-6 py-2.5 bg-slate-100/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600">Nhân sự thực hiện:</span>
            <select
              value={selectedEmpId}
              onChange={(e) => {
                setSelectedEmpId(e.target.value);
                setReceipt(null);
                setLivenessStage('align');
                setBlinkCompleted(false);
                setHeadTurnCompleted(false);
              }}
              className="px-3 py-1 bg-white border border-slate-300 rounded-lg text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#0072BC]/20 cursor-pointer"
            >
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.fullName} ({e.code}) - {e.departmentName.split(' ')[0]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 text-slate-600 font-mono">
            <span className="flex items-center gap-1 text-emerald-600 font-bold">
              <Clock className="w-3.5 h-3.5" />
              {String(currentTime.getHours()).padStart(2, '0')}:
              {String(currentTime.getMinutes()).padStart(2, '0')}:
              {String(currentTime.getSeconds()).padStart(2, '0')}
            </span>
            <span>• Thứ Hai, 21/09/2026</span>
          </div>
        </div>

        {/* Content Panels */}
        <div className="p-6 text-xs max-h-[72vh] overflow-y-auto">
          {/* ======================================================== */}
          {/* TAB 1: SMARTPHONE MOBILE APP SIMULATOR                    */}
          {/* ======================================================== */}
          {activeTab === 'mobile_app' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Phone Mockup Frame (iPhone 16 Pro styling) */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="w-[340px] sm:w-[360px] bg-slate-900 rounded-[44px] p-3 shadow-2xl border-4 border-slate-700 ring-1 ring-slate-800 relative">
                  {/* Speaker & Dynamic Island */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-20 flex items-center justify-between px-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800"></div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  </div>

                  {/* Phone Screen Container */}
                  <div className="bg-slate-50 rounded-[36px] overflow-hidden flex flex-col min-h-[580px] border border-slate-200">
                    {/* Status Bar */}
                    <div className="pt-2 px-6 pb-1 flex justify-between items-center text-[11px] font-bold text-slate-800 bg-white">
                      <span>09:41</span>
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Wifi className="w-3 h-3" />
                        <span className="text-[10px]">5G</span>
                        <div className="w-4 h-2 rounded-xs border border-slate-700 flex items-center p-0.5">
                          <div className="w-full h-full bg-slate-800 rounded-2xs"></div>
                        </div>
                      </div>
                    </div>

                    {/* App Header */}
                    <div className="px-4 py-3 bg-gradient-to-r from-[#005A96] to-[#0072BC] text-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-xs">
                            {currentEmp.fullName.slice(0, 1)}
                          </div>
                          <div>
                            <div className="font-bold text-xs truncate max-w-[170px]">{currentEmp.fullName}</div>
                            <div className="text-[10px] text-sky-200">{currentEmp.code} • {currentEmp.departmentName}</div>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-slate-900 text-[10px] font-bold">
                          Trực tuyến
                        </span>
                      </div>
                    </div>

                    {/* Mobile App Body */}
                    <div className="p-3.5 space-y-3 flex-1 overflow-y-auto">
                      {/* Live Shift Info Card */}
                      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-slate-400 font-semibold uppercase">Ca làm việc hôm nay</div>
                          <div className="font-bold text-xs text-slate-900 mt-0.5">Ca Hành Chính Tiêu Chuẩn</div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">08:00 - 17:30 (8 giờ)</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                            Đang mở ca
                          </div>
                        </div>
                      </div>

                      {/* GPS & WiFi Verification Card */}
                      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-800 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-rose-500" />
                            <span>GPS Geofence: {currentLocation.name}</span>
                          </span>
                          <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                            {gpsDistance}m (Hợp lệ)
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                          <span className="flex items-center gap-1.5">
                            <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Mạng: {wifiSsid}</span>
                          </span>
                          <span className="text-[10px] text-emerald-600 font-bold">Đã đồng bộ</span>
                        </div>
                      </div>

                      {/* Biometric Enrollment Status Banner */}
                      {!isEnrolled ? (
                        <div className="bg-rose-50 border border-rose-300 rounded-2xl p-3 space-y-2">
                          <div className="flex items-start gap-2">
                            <UserX className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-rose-900 text-xs block">Chưa Đăng Ký Sinh Trắc Khuôn Mặt!</strong>
                              <p className="text-[10px] text-rose-700 leading-tight mt-0.5">
                                Nhân sự chưa có mẫu FaceID trong hệ thống AMIS. Quy định bắt buộc phải đăng ký khuôn mặt trước khi bấm công.
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsEnrollModalOpen(true)}
                            className="w-full py-2 px-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                          >
                            <ScanFace className="w-4 h-4" />
                            <span>Đăng Ký Khuôn Mặt Ngay (3 Góc 3D)</span>
                          </button>
                        </div>
                      ) : (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-2.5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                              <ShieldCheck className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-[11px] text-emerald-950 flex items-center gap-1">
                                <span>Đã Đăng Ký FaceID</span>
                                <span className="px-1.5 py-0.2 bg-emerald-200 text-emerald-800 rounded font-mono text-[9px]">
                                  {enrolledProfile?.featuresHash?.substring(0, 15)}...
                                </span>
                              </div>
                              <div className="text-[10px] text-emerald-700">
                                Độ tin cậy mẫu: {enrolledProfile?.confidenceScore || 99.8}% • Chuẩn 3D Mesh
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsEnrollModalOpen(true)}
                            className="text-[10px] text-[#0072BC] hover:underline font-bold px-2 py-1 bg-white border border-blue-200 rounded-lg cursor-pointer"
                          >
                            Cập nhật
                          </button>
                        </div>
                      )}

                      {/* Camera Viewfinder & Interactive Liveness Face Scanner */}
                      <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-4/3 flex items-center justify-center border-2 border-slate-700 shadow-inner group">
                        {/* Live Video or Simulated Canvas */}
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover transform -scale-x-100"
                        />

                        {/* Facial Bounding Box Overlay */}
                        <div
                          className={`absolute inset-4 border-2 border-dashed rounded-2xl pointer-events-none flex flex-col justify-between p-2 transition-colors duration-300 ${
                            spoofAttackSimulated
                              ? 'border-rose-500 bg-rose-950/40'
                              : isEnrolled
                              ? 'border-emerald-400/80'
                              : 'border-amber-400/80'
                          }`}
                        >
                          <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="bg-black/70 px-2 py-0.5 rounded text-white">
                              {spoofAttackSimulated ? '⚠️ SPOOF ATTACK' : isEnrolled ? 'Face AI: 99.9%' : 'CHƯA ĐĂNG KÝ'}
                            </span>
                            <span className="bg-black/70 px-2 py-0.5 rounded text-sky-300">
                              {isEnrolled ? 'Match: 99.8%' : 'No Biometrics'}
                            </span>
                          </div>

                          {/* Animated Scanline or Warning Cross */}
                          {spoofAttackSimulated ? (
                            <div className="text-center bg-rose-600/90 text-white font-bold p-1 rounded-lg text-xs animate-pulse">
                              TỪ CHỐI GIAN LẬN: ẢNH 2D / MÀN HÌNH PHẲNG
                            </div>
                          ) : (
                            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse shadow-[0_0_8px_#10B981]"></div>
                          )}

                          <div className="flex justify-between items-center text-[10px] font-mono">
                            <span
                              className={`px-2 py-0.5 rounded ${
                                spoofAttackSimulated
                                  ? 'bg-rose-600 text-white'
                                  : livenessStage === 'verified'
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-black/70 text-amber-300'
                              }`}
                            >
                              Liveness: {spoofAttackSimulated ? 'FAILED' : livenessStage === 'verified' ? 'PASS (99.9%)' : 'TESTING'}
                            </span>
                            <span className="bg-black/70 px-2 py-0.5 rounded text-slate-300">Moire Filter ON</span>
                          </div>
                        </div>

                        {/* Anti-Spoofing Badge Overlay */}
                        <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-xs px-2.5 py-1.5 rounded-xl border border-white/10 text-white flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            {spoofAttackSimulated ? (
                              <AlertOctagon className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            ) : (
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            )}
                            <span
                              className={`text-[10px] font-bold ${
                                spoofAttackSimulated ? 'text-rose-400' : 'text-emerald-300'
                              }`}
                            >
                              {spoofAttackSimulated
                                ? 'Phát hiện giả mạo! Score: 14.2%'
                                : livenessStage === 'verified'
                                ? 'Xác thực người thật 99.9%'
                                : 'Đang chạy thuật toán Liveness...'}
                            </span>
                          </div>
                          <span className="text-[9px] font-mono text-slate-300">
                            {isEnrolled ? 'Vector: OK' : 'No Vector'}
                          </span>
                        </div>
                      </div>

                      {/* Liveness Interactive Challenge Prompts */}
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-2.5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[11px] text-blue-900 flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-[#0072BC]" />
                            <span>Thử thách chống giả mạo (Active Liveness):</span>
                          </span>
                          <span className="text-[10px] font-bold text-[#0072BC]">
                            {spoofAttackSimulated ? 'Vi phạm' : livenessStage === 'verified' ? 'Hoàn thành' : 'Đang kiểm tra'}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleTriggerBlink}
                            className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-[10px] transition cursor-pointer flex items-center justify-center gap-1 ${
                              blinkCompleted
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white border border-blue-300 text-blue-800 hover:bg-blue-100'
                            }`}
                          >
                            <Check className="w-3 h-3" />
                            <span>1. Chớp Mắt Tự Nhiên</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleTriggerHeadTurn}
                            className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-[10px] transition cursor-pointer flex items-center justify-center gap-1 ${
                              headTurnCompleted
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white border border-blue-300 text-blue-800 hover:bg-blue-100'
                            }`}
                          >
                            <Activity className="w-3 h-3" />
                            <span>2. Nghiêng Đầu 15°</span>
                          </button>
                        </div>

                        {/* Spoof Simulation Tester Controls */}
                        <div className="pt-1 border-t border-blue-200/60 flex items-center justify-between gap-2">
                          <span className="text-[10px] text-slate-500">Mô phỏng thử nghiệm AI:</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={handleSimulateSpoof}
                              className="px-2 py-1 rounded bg-rose-100 hover:bg-rose-200 text-rose-800 text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
                              title="Thử đưa ảnh chụp 2D hoặc phát video lại"
                            >
                              <AlertTriangle className="w-3 h-3 text-rose-600" />
                              <span>Thử Ảnh Giả 2D</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleResetLiveness}
                              className="px-2 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-semibold transition cursor-pointer"
                            >
                              Reset Liveness
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons inside Phone */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleExecutePunch('in', 'mobile_gps')}
                          disabled={submitting}
                          className={`py-3 px-2 text-white font-black rounded-xl shadow-md transition active:scale-95 cursor-pointer text-center ${
                            !isEnrolled
                              ? 'bg-slate-400 hover:bg-slate-500'
                              : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
                          }`}
                        >
                          <div className="text-xs">BẤM CÔNG VÀO</div>
                          <div className="text-[9px] font-normal opacity-90 font-mono">
                            {!isEnrolled ? 'Cần đăng ký FaceID' : 'GPS + Selfie AI'}
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleExecutePunch('out', 'mobile_gps')}
                          disabled={submitting}
                          className={`py-3 px-2 text-white font-black rounded-xl shadow-md transition active:scale-95 cursor-pointer text-center ${
                            !isEnrolled
                              ? 'bg-slate-400 hover:bg-slate-500'
                              : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700'
                          }`}
                        >
                          <div className="text-xs">BẤM CÔNG RA</div>
                          <div className="text-[9px] font-normal opacity-90 font-mono">
                            {!isEnrolled ? 'Cần đăng ký FaceID' : 'Kết Thúc Ca'}
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Verification Receipt & Real-time Sensors Details */}
              <div className="lg:col-span-6 space-y-4">
                {receipt ? (
                  <div className="p-5 bg-emerald-50 border-2 border-emerald-300 rounded-3xl space-y-3 animate-in zoom-in-95">
                    <div className="flex items-center gap-2.5 text-emerald-800">
                      <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-emerald-900">
                          {receipt.direction === 'in' ? 'CHẤM CÔNG VÀO THÀNH CÔNG!' : 'CHẤM CÔNG RA THÀNH CÔNG!'}
                        </h4>
                        <p className="text-[11px] text-emerald-700">Dữ liệu đã được ghi nhận vào nhật ký quẹt thẻ thô & tính công tự động</p>
                      </div>
                    </div>

                    <div className="p-3.5 bg-white rounded-2xl border border-emerald-200 space-y-2 text-slate-700 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Nhân sự:</span>
                        <strong className="text-slate-900">{receipt.employeeName} ({receipt.employeeCode})</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Thời gian thực tế:</span>
                        <span className="font-mono font-bold text-emerald-700">{receipt.time} • Ngày {receipt.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Phương thức:</span>
                        <span className="font-semibold text-[#0072BC]">Ứng dụng Mobile App GPS & Selfie AI</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Tọa độ kiểm tra:</span>
                        <span className="font-mono text-slate-800">{receipt.gpsDistance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Mạng WiFi văn phòng:</span>
                        <span className="font-mono text-slate-800">{receipt.wifi} (Hợp lệ)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Xác thực người thật:</span>
                        <span className="font-bold text-emerald-600">{receipt.livenessScore}</span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => setReceipt(null)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition cursor-pointer"
                      >
                        Chấm Thêm Bản Ghi Mới
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#0072BC] text-white flex items-center justify-center font-bold">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">Quy Trình Chấm Công Trên Mobile App</h4>
                        <p className="text-[11px] text-slate-500">Bảo mật 3 lớp ngăn chặn gian lận quẹt thẻ hộ</p>
                      </div>
                    </div>

                    <div className="space-y-3 text-xs text-slate-600">
                      <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-[#0072BC] flex items-center justify-center font-bold shrink-0 text-[11px]">
                          1
                        </span>
                        <div>
                          <strong className="text-slate-800 block">GPS Geofencing 100m & WiFi BSSID:</strong>
                          <span className="text-[11px] text-slate-500 leading-relaxed">
                            Ứng dụng tự động đo khoảng cách vệ tinh GPS tới Trụ sở AMIS ({currentLocation.name}). Nhân viên bắt buộc ở trong bán kính 100m.
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-[#0072BC] flex items-center justify-center font-bold shrink-0 text-[11px]">
                          2
                        </span>
                        <div>
                          <strong className="text-slate-800 block">Camera Selfie & Active Liveness Challenge:</strong>
                          <span className="text-[11px] text-slate-500 leading-relaxed">
                            Nhân viên chụp selfie trực tiếp, thuật toán AI yêu cầu chớp mắt hoặc xoay đầu để chứng minh người thật, ngăn cản ảnh chụp in lại hoặc video phát lại.
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-[#0072BC] flex items-center justify-center font-bold shrink-0 text-[11px]">
                          3
                        </span>
                        <div>
                          <strong className="text-slate-800 block">Đồng bộ tức thì vào Bảng Công & Phiếu Lương:</strong>
                          <span className="text-[11px] text-slate-500 leading-relaxed">
                            Bản ghi được mã hoá đẩy ngay về cơ sở dữ liệu AMIS HRM, tính toán ngày công và giờ làm thêm OT lũy tiến trong tháng.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: HIKVISION FACEID AI CAMERA TERMINAL               */}
          {/* ======================================================== */}
          {activeTab === 'face_terminal' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900 text-white rounded-3xl border-4 border-slate-800 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <ScanFace className="w-5 h-5 text-emerald-400" />
                    <div>
                      <span className="font-extrabold text-sm block">HIKVISION DS-K1T671 AI Face Terminal</span>
                      <span className="text-[10px] text-slate-400">Vị trí: Cổng chính Tòa nhà AMIS Duy Tân • IP: 192.168.1.201</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                      Nhiệt độ: {bodyTemp}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] border border-blue-500/30">
                      AI 99.8%
                    </span>
                  </div>
                </div>

                {/* Viewfinder simulation */}
                <div className="relative my-4 rounded-2xl overflow-hidden bg-slate-950 aspect-16/9 flex items-center justify-center border border-slate-800">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100 opacity-80"
                  />

                  {/* Terminal Reticle & HUD Overlay */}
                  <div className="absolute inset-8 border border-emerald-500/40 rounded-3xl pointer-events-none flex flex-col justify-between p-4">
                    <div className="flex justify-between items-center font-mono text-[11px] text-emerald-400">
                      <span className="bg-black/70 px-2 py-0.5 rounded">Target: {currentEmp.fullName}</span>
                      <span className="bg-black/70 px-2 py-0.5 rounded">Confidence: 99.8%</span>
                    </div>

                    <div className="w-48 h-48 mx-auto rounded-full border-2 border-emerald-400 flex items-center justify-center relative shadow-[0_0_20px_#10B981]">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                    </div>

                    <div className="flex justify-between items-center font-mono text-[11px] text-emerald-400">
                      <span className="bg-black/70 px-2 py-0.5 rounded">Anti-Spoof: Real Face</span>
                      <span className="bg-black/70 px-2 py-0.5 rounded">Thermal: 36.5°C Normal</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Trigger Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <div className="text-xs text-slate-400">
                    {!isEnrolled ? (
                      <span className="text-rose-400 font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        Cảnh báo: Nhân viên {currentEmp.fullName} chưa đăng ký FaceID!
                      </span>
                    ) : (
                      <span>Nhân viên đứng trước camera trong khoảng 0.3m - 1.5m để nhận diện tự động.</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {!isEnrolled ? (
                      <button
                        type="button"
                        onClick={() => setIsEnrollModalOpen(true)}
                        className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                      >
                        <ScanFace className="w-4 h-4" />
                        <span>Đăng Ký Khuôn Mặt Ngay</span>
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleExecutePunch('in', 'face_id')}
                          disabled={submitting}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                        >
                          <ScanFace className="w-4 h-4" />
                          <span>Xác Nhận Chấm Vào</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleExecutePunch('out', 'face_id')}
                          disabled={submitting}
                          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                        >
                          <ScanFace className="w-4 h-4" />
                          <span>Xác Nhận Chấm Ra</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: BIOMETRIC FINGERPRINT & RFID                      */}
          {/* ======================================================== */}
          {activeTab === 'rfid' && (
            <div className="space-y-4">
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
                    <Fingerprint className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">Máy Quẹt Vân Tay & Thẻ Từ Ronald Jack RJ-8800</h4>
                    <p className="text-xs text-slate-500">Cảm biến quang học SilkID chống trầy xước, đọc vân tay ướt và thẻ RFID 125kHz</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3 text-center">
                    <div className="w-20 h-20 mx-auto rounded-full bg-indigo-50 border-2 border-indigo-300 flex items-center justify-center text-indigo-600 shadow-inner group hover:scale-105 transition cursor-pointer">
                      <Fingerprint className="w-10 h-10 animate-pulse" />
                    </div>
                    <div>
                      <strong className="text-slate-800 text-xs block">Mô Phỏng Đặt Ngón Tay Lên Cảm Biến</strong>
                      <span className="text-[11px] text-slate-500">Mã đăng ký vân tay: FP-{currentEmp.code}</span>
                    </div>
                    <div className="flex justify-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => handleExecutePunch('in', 'fingerprint')}
                        disabled={submitting}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
                      >
                        Chấm Vào Bằng Vân Tay
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExecutePunch('out', 'fingerprint')}
                        disabled={submitting}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
                      >
                        Chấm Ra
                      </button>
                    </div>
                  </div>

                  <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3 text-center">
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-purple-50 border-2 border-purple-300 flex items-center justify-center text-purple-600 shadow-inner group hover:scale-105 transition cursor-pointer">
                      <CreditCard className="w-10 h-10" />
                    </div>
                    <div>
                      <strong className="text-slate-800 text-xs block">Mô Phỏng Quẹt Thẻ Cảm Ứng RFID</strong>
                      <span className="text-[11px] text-slate-500 font-mono">Mã thẻ: RFID-88992211</span>
                    </div>
                    <div className="flex justify-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => handleExecutePunch('in', 'fingerprint')}
                        disabled={submitting}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
                      >
                        Quẹt Thẻ Vào
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExecutePunch('out', 'fingerprint')}
                        disabled={submitting}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
                      >
                        Quẹt Thẻ Ra
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: PWA / MOBILE APP INSTALL GUIDE                    */}
          {/* ======================================================== */}
          {activeTab === 'pwa_guide' && (
            <div className="space-y-4">
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">Cách Cài Đặt Ứng Dụng AMIS HRM Lên Điện Thoại</h4>
                    <p className="text-xs text-slate-500">Ứng dụng hoạt động theo tiêu chuẩn PWA (Progressive Web App) chạy trực tiếp mượt mà như app gốc</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                    Không cần tải từ App Store
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {/* Step 1: Scan QR */}
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
                    <div className="w-32 h-32 mx-auto bg-slate-100 rounded-xl p-2 border border-slate-200 flex items-center justify-center">
                      {/* Stylized QR Code SVG */}
                      <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
                        <rect x="5" y="5" width="25" height="25" fill="currentColor" rx="2" />
                        <rect x="9" y="9" width="17" height="17" fill="white" rx="1" />
                        <rect x="13" y="13" width="9" height="9" fill="currentColor" />

                        <rect x="70" y="5" width="25" height="25" fill="currentColor" rx="2" />
                        <rect x="74" y="9" width="17" height="17" fill="white" rx="1" />
                        <rect x="78" y="13" width="9" height="9" fill="currentColor" />

                        <rect x="5" y="70" width="25" height="25" fill="currentColor" rx="2" />
                        <rect x="9" y="74" width="17" height="17" fill="white" rx="1" />
                        <rect x="13" y="78" width="9" height="9" fill="currentColor" />

                        <rect x="35" y="10" width="10" height="10" fill="currentColor" />
                        <rect x="50" y="10" width="10" height="10" fill="currentColor" />
                        <rect x="35" y="35" width="30" height="10" fill="currentColor" />
                        <rect x="40" y="50" width="20" height="20" fill="currentColor" />
                        <rect x="70" y="45" width="10" height="20" fill="currentColor" />
                        <rect x="70" y="75" width="20" height="15" fill="currentColor" />
                        <rect x="35" y="75" width="15" height="15" fill="currentColor" />
                      </svg>
                    </div>
                    <div>
                      <strong className="text-slate-800 text-xs block">Bước 1: Quét Mã QR Bằng Camera</strong>
                      <span className="text-[11px] text-slate-500">Mở camera điện thoại quét mã hoặc truy cập đường link hệ thống</span>
                    </div>
                  </div>

                  {/* Step 2: iOS Guide */}
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-[#0072BC] font-bold text-[10px]">
                      Dành Cho iPhone (iOS Safari)
                    </span>
                    <strong className="text-slate-800 text-xs block">Bước 2A: Thêm Vào Màn Hình Chính</strong>
                    <ol className="list-decimal list-inside space-y-1.5 text-slate-600 text-[11px] leading-relaxed">
                      <li>Mở trang web bằng trình duyệt <strong>Safari</strong>.</li>
                      <li>Nhấn nút <strong>Chia sẻ (Share icon)</strong> ở thanh dưới.</li>
                      <li>Cuộn xuống chọn <strong>"Thêm vào MH chính" (Add to Home Screen)</strong>.</li>
                      <li>Icon AMIS HRM xuất hiện ngoài màn hình điện thoại.</li>
                    </ol>
                  </div>

                  {/* Step 3: Android Guide */}
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      Dành Cho Android (Google Chrome)
                    </span>
                    <strong className="text-slate-800 text-xs block">Bước 2B: Cài Đặt Ứng Dụng</strong>
                    <ol className="list-decimal list-inside space-y-1.5 text-slate-600 text-[11px] leading-relaxed">
                      <li>Mở trang web bằng <strong>Google Chrome</strong>.</li>
                      <li>Bấm biểu tượng <strong>3 chấm dọc</strong> ở góc trên bên phải.</li>
                      <li>Chọn <strong>"Cài đặt ứng dụng" (Install App)</strong>.</li>
                      <li>Ứng dụng được cài đặt vào ngăn chứa app như app native.</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: AI ANTI-SPOOFING & LIVENESS ARCHITECTURE          */}
          {/* ======================================================== */}
          {activeTab === 'anti_spoof_doc' && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl border border-slate-800 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-white">Kiến Trúc Thuật Toán Chống Giả Mạo & Xác Thực Người Thật</h4>
                    <p className="text-xs text-indigo-200">Bảo vệ tối đa doanh nghiệp trước mọi thủ thuật gian lận chấm công qua camera điện thoại</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                  {/* Layer 1 */}
                  <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 space-y-1.5">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                      <Eye className="w-4 h-4" />
                      <span>1. Active Liveness Detection (Thử Thách Động)</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Hệ thống yêu cầu ngẫu nhiên trong 2 giây: <em>chớp mắt 2 lần (EAR - Eye Aspect Ratio &lt; 0.2)</em> hoặc <em>nghiêng đầu 15° (Head Pose Yaw angle)</em>. Kẻ gian dùng ảnh in trên giấy hoàn toàn không thể thực hiện hành động theo thời gian thực.
                    </p>
                  </div>

                  {/* Layer 2 */}
                  <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 space-y-1.5">
                    <div className="flex items-center gap-2 text-sky-400 font-bold">
                      <Cpu className="w-4 h-4" />
                      <span>2. Moiré Pattern & Screen Replay Filter</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Khi kẻ gian dùng màn hình điện thoại/iPad phát lại video người khác, sóng giao thoa <strong>Moiré</strong> và viền lưới pixel RGB sẽ xuất hiện ở miền tần số cao (Fast Fourier Transform). Thuật toán CNN nhận diện màn hình phát sáng phẳng và từ chối tức khắc.
                    </p>
                  </div>

                  {/* Layer 3 */}
                  <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 space-y-1.5">
                    <div className="flex items-center gap-2 text-purple-400 font-bold">
                      <Layers className="w-4 h-4" />
                      <span>3. Phân Tích Độ Sâu Quang Học 3D (3D Depth Mesh)</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Khuôn mặt người thật có độ cong sống mũi, hốc mắt tạo nên các vi bóng đổ (Micro-shadows) khi cử động. Ảnh giấy 2D phẳng có trường sâu đồng nhất (Flat Depth Map) sẽ bị hệ thống phát hiện và gắn cờ vi phạm `Spoof_Paper_Attack`.
                    </p>
                  </div>

                  {/* Layer 4 */}
                  <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 space-y-1.5">
                    <div className="flex items-center gap-2 text-amber-400 font-bold">
                      <Compass className="w-4 h-4" />
                      <span>4. Sensor Telemetry & Fake GPS Protection</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Kết hợp dữ liệu vi rung động sinh học từ cảm biến con quay hồi chuyển (Gyroscope) của tay cầm điện thoại với toạ độ GPS vệ tinh và địa chỉ BSSID WiFi công ty. Ngăn chặn triệt để ứng dụng Mock Location hoặc giả lập máy ảo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Face Biometric Enrollment Sub-Modal */}
      {isEnrollModalOpen && (
        <FaceEnrollmentModal
          isOpen={isEnrollModalOpen}
          onClose={() => setIsEnrollModalOpen(false)}
          employees={employees}
          enrolledProfiles={biometricProfiles}
          onSuccess={() => {
            loadBiometrics();
            setIsEnrollModalOpen(false);
            showToast('Hồ sơ FaceID đã được cập nhật thành công vào hệ thống!', 'success');
          }}
        />
      )}
    </div>
  );
};
