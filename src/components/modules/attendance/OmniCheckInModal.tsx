import React, { useState } from 'react';
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
  RefreshCw
} from 'lucide-react';
import { Employee, GeofenceLocation } from '../../../types';
import { api } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';

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

  const [mode, setMode] = useState<'face_terminal' | 'mobile_app' | 'rfid'>('face_terminal');
  const [selectedEmpId, setSelectedEmpId] = useState(currentUser?.id || employees[0]?.id || '');
  const [selectedLocationId, setSelectedLocationId] = useState(locations[0]?.id || 'loc-01');
  const [direction, setDirection] = useState<'in' | 'out'>('in');
  const [submitting, setSubmitting] = useState(false);
  const [faceScanned, setFaceScanned] = useState(false);
  const [bodyTemp] = useState('36.5°C');

  if (!isOpen) return null;

  const currentEmp = employees.find((e) => e.id === selectedEmpId) || employees[0];
  const currentLocation = locations.find((l) => l.id === selectedLocationId) || locations[0];

  const handleSimulateScan = () => {
    setFaceScanned(false);
    setTimeout(() => {
      setFaceScanned(true);
    }, 600);
  };

  const handleSubmitCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      const deviceName =
        mode === 'face_terminal'
          ? 'Máy quét khuôn mặt Hikvision FaceID AI Terminal (Sảnh T1)'
          : mode === 'mobile_app'
          ? 'Ứng dụng AMIS Mobile GPS & Selfie (Điện thoại nhân viên)'
          : 'Máy chấm công vân tay Ronald Jack X628-C (Cửa ra vào)';

      if (direction === 'in') {
        const res = await api.checkIn(selectedEmpId);
        showToast(
          `[${mode === 'face_terminal' ? 'FaceID AI' : mode === 'mobile_app' ? 'Mobile GPS' : 'Vân tay'}] Chấm công VÀO thành công cho ${currentEmp?.fullName || 'nhân sự'} lúc ${res.checkIn}`,
          'success'
        );
      } else {
        const res = await api.checkOut(selectedEmpId);
        showToast(
          `[${mode === 'face_terminal' ? 'FaceID AI' : mode === 'mobile_app' ? 'Mobile GPS' : 'Vân tay'}] Chấm công RA thành công cho ${currentEmp?.fullName || 'nhân sự'} lúc ${res.checkOut} (${res.workHours}h làm việc)`,
          'success'
        );
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Lỗi xử lý chấm công', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in select-none">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-[#005A96] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0072BC] flex items-center justify-center font-bold text-white shadow-sm">
              <ScanFace className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Bấm Công Đa Phương Thức (Omni-Channel Check-In)</h3>
              <p className="text-[11px] text-sky-200">
                Hỗ trợ Máy quét FaceID tập trung, App điện thoại GPS/Wifi & Máy vân tay
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

        {/* Method Switcher Tabs */}
        <div className="p-4 bg-slate-100 border-b border-slate-200">
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setMode('face_terminal');
                handleSimulateScan();
              }}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                mode === 'face_terminal'
                  ? 'bg-white text-[#0072BC] shadow-xs border border-blue-200'
                  : 'text-slate-600 hover:bg-white/60'
              }`}
            >
              <ScanFace className="w-4 h-4 text-[#0072BC]" />
              <span>Máy FaceID tập trung</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('mobile_app')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                mode === 'mobile_app'
                  ? 'bg-white text-emerald-700 shadow-xs border border-emerald-200'
                  : 'text-slate-600 hover:bg-white/60'
              }`}
            >
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span>Mobile App GPS</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('rfid')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                mode === 'rfid'
                  ? 'bg-white text-purple-700 shadow-xs border border-purple-200'
                  : 'text-slate-600 hover:bg-white/60'
              }`}
            >
              <Fingerprint className="w-4 h-4 text-purple-600" />
              <span>Vân tay / Thẻ từ</span>
            </button>
          </div>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmitCheckIn} className="p-6 space-y-4 text-xs">
          {/* Employee & Direction Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-700 font-bold block">Nhân sự thực hiện chấm công:</label>
              <select
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.fullName} ({emp.code}) - {emp.departmentName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 font-bold block">Chiều chấm công:</label>
              <div className="flex rounded-lg bg-slate-100 p-1 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setDirection('in')}
                  className={`flex-1 py-1 rounded font-bold text-center transition cursor-pointer ${
                    direction === 'in' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Check-in (VÀO CA)
                </button>
                <button
                  type="button"
                  onClick={() => setDirection('out')}
                  className={`flex-1 py-1 rounded font-bold text-center transition cursor-pointer ${
                    direction === 'out' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Check-out (HẾT CA)
                </button>
              </div>
            </div>
          </div>

          {/* MODE 1: FaceID Terminal View */}
          {mode === 'face_terminal' && (
            <div className="p-4 bg-slate-900 rounded-2xl text-white space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
                  <span className="font-mono text-xs font-bold text-emerald-400">
                    Hikvision FaceID Terminal AI-901 • Sảnh Tầng 1
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">Nhiệt độ cảm biến: <strong className="text-emerald-400">{bodyTemp}</strong></span>
              </div>

              {/* Simulated Camera Screen */}
              <div className="h-44 bg-slate-800/80 rounded-xl relative flex items-center justify-center border border-slate-700 overflow-hidden">
                <div className="w-32 h-36 border-2 border-dashed border-sky-400/80 rounded-2xl flex flex-col items-center justify-center p-2 relative animate-pulse">
                  <ScanFace className="w-12 h-12 text-sky-400 mb-1" />
                  <span className="text-[10px] text-sky-300 font-semibold">Khung Nhận Diện</span>
                  <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-sky-400"></div>
                  <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-sky-400"></div>
                  <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-sky-400"></div>
                  <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-sky-400"></div>
                </div>

                <div className="absolute bottom-3 left-4 right-4 bg-slate-900/90 backdrop-blur-xs p-2 rounded-lg border border-slate-700 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="text-slate-400">Nhân sự: </span>
                    <strong className="text-white">{currentEmp?.fullName}</strong>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Độ chính xác: 99.4%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Camera tự động đối chiếu sinh trắc học và thân nhiệt</span>
                <span className="text-emerald-400 font-mono">Trạng thái: Sẵn sàng</span>
              </div>
            </div>
          )}

          {/* MODE 2: Mobile App GPS Geofence */}
          {mode === 'mobile_app' && (
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-700" />
                  <span className="font-bold text-xs text-emerald-900">
                    Ứng dụng AMIS Nhân sự Di động (Mobile App GPS)
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  GPS Tọa độ chính xác
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="p-3 bg-white rounded-xl border border-emerald-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>Vị trí Geofencing:</span>
                  </div>
                  <div className="font-semibold text-slate-900">{currentLocation?.name || 'Trụ sở chính'}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Khoảng cách: <strong className="text-emerald-600">32 mét</strong> (Trong bán kính 100m)
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-emerald-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                    <Wifi className="w-3.5 h-3.5 text-blue-500" />
                    <span>Mạng WiFi Văn Phòng:</span>
                  </div>
                  <div className="font-semibold text-slate-900">AMIS_HQ_Office_5G</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    BSSID: <strong className="text-emerald-600">00:14:22:01:23:45</strong> (Hợp lệ)
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-white/80 rounded-xl border border-emerald-100 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <span className="text-slate-700 font-medium">Chụp ảnh selfie xác thực khuôn mặt nhân viên</span>
                </div>
                <span className="text-emerald-700 font-bold text-[10px] bg-emerald-100 px-2 py-0.5 rounded">
                  Đã xác thực
                </span>
              </div>
            </div>
          )}

          {/* MODE 3: RFID & Fingerprint */}
          {mode === 'rfid' && (
            <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-purple-200 pb-2">
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-purple-700" />
                  <span className="font-bold text-xs text-purple-900">
                    Máy quẹt vân tay & Thẻ từ Ronald Jack X628-C
                  </span>
                </div>
                <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full">
                  Sinh trắc học TCP/IP
                </span>
              </div>

              <div className="p-4 bg-white rounded-xl border border-purple-100 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <Fingerprint className="w-8 h-8 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-xs">{currentEmp?.fullName}</div>
                  <div className="text-[11px] text-slate-500 font-mono">Mã vân tay / ID thẻ: {currentEmp?.code}</div>
                  <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Cảm biến quang học nhận diện thành công</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action button */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 font-semibold rounded-lg hover:bg-slate-50 transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-5 py-2 text-white font-bold rounded-lg shadow-sm transition cursor-pointer flex items-center gap-1.5 active:scale-95 disabled:opacity-60 ${
                direction === 'in' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>
                {submitting
                  ? 'Đang ghi nhận...'
                  : direction === 'in'
                  ? 'Xác Nhận Chấm Công VÀO CA'
                  : 'Xác Nhận Chấm Công HẾT CA'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
