import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Compass,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Crosshair,
  Wifi,
  ShieldCheck,
  Building,
  Satellite
} from 'lucide-react';
import { GeofenceLocation } from '../../../types';
import { useToast } from '../../../context/ToastContext';

// Haversine formula to compute great-circle distance in meters between two lat/lng points
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

interface GpsGeofenceRadarProps {
  locations: GeofenceLocation[];
  selectedLocationId?: string;
  onLocationChange?: (locId: string) => void;
  currentDistance: number;
  onDistanceChange: (distance: number, coords: { lat: number; lng: number }) => void;
  compact?: boolean; // When rendered in mobile phone preview vs admin dashboard
}

export const GpsGeofenceRadar: React.FC<GpsGeofenceRadarProps> = ({
  locations,
  selectedLocationId,
  onLocationChange,
  currentDistance,
  onDistanceChange,
  compact = false
}) => {
  const { showToast } = useToast();

  const [activeLocId, setActiveLocId] = useState<string>(
    selectedLocationId || locations[0]?.id || 'geo-01'
  );

  const activeLoc = locations.find((l) => l.id === activeLocId) || locations[0] || {
    id: 'geo-01',
    name: 'Trụ sở AMIS Hà Nội (Tòa Technosoft Duy Tân)',
    address: 'Phố Duy Tân, Cầu Giấy, Hà Nội',
    latitude: 21.0315,
    longitude: 105.7832,
    radiusMeters: 100,
    allowedWifiBSSID: ['AMIS_CORP_5G'],
    isActive: true
  };

  const [loadingGps, setLoadingGps] = useState(false);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(6);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number }>({
    lat: activeLoc.latitude + 0.00012,
    lng: activeLoc.longitude + 0.00008
  });
  const [gpsSource, setGpsSource] = useState<'simulated' | 'browser_live'>('simulated');

  // Sync when active location changes
  const handleSelectLocation = (id: string) => {
    setActiveLocId(id);
    onLocationChange?.(id);
    const loc = locations.find((l) => l.id === id);
    if (loc) {
      // Default nearby point inside geofence
      const newCoords = {
        lat: loc.latitude + 0.00012,
        lng: loc.longitude + 0.00008
      };
      setUserCoords(newCoords);
      const dist = Math.round(
        calculateHaversineDistance(newCoords.lat, newCoords.lng, loc.latitude, loc.longitude)
      );
      onDistanceChange(dist, newCoords);
    }
  };

  // Real Browser Geolocation via navigator.geolocation API
  const handleFetchRealGps = () => {
    if (!navigator.geolocation) {
      showToast('Trình duyệt không hỗ trợ Geolocation API', 'error');
      return;
    }

    setLoadingGps(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const coords = { lat: latitude, lng: longitude };
        setUserCoords(coords);
        setGpsAccuracy(Math.round(accuracy));
        setGpsSource('browser_live');

        const dist = Math.round(
          calculateHaversineDistance(latitude, longitude, activeLoc.latitude, activeLoc.longitude)
        );
        onDistanceChange(dist, coords);
        setLoadingGps(false);

        if (dist <= activeLoc.radiusMeters) {
          showToast(
            `Định vị GPS thực tế thành công: Toạ độ (${latitude.toFixed(5)}, ${longitude.toFixed(5)}) - Cách văn phòng ${dist}m (HỢP LỆ)`,
            'success'
          );
        } else {
          showToast(
            `Định vị GPS thực tế thành công: Bạn đang cách văn phòng ${dist}m (Vượt quá bán kính cho phép ${activeLoc.radiusMeters}m)`,
            'warning'
          );
        }
      },
      (err) => {
        setLoadingGps(false);
        showToast(
          `Không thể đọc GPS thiết bị: ${err.message}. Hệ thống chuyển về chế độ mô phỏng kiểm thử.`,
          'warning'
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Quick preset positions for testing inside / outside geofence
  const handleSetPreset = (preset: 'desk' | 'gate' | 'cafe' | 'home') => {
    setGpsSource('simulated');
    let latOffset = 0;
    let lngOffset = 0;

    if (preset === 'desk') {
      // ~18m distance
      latOffset = 0.00011;
      lngOffset = 0.00009;
      setGpsAccuracy(5);
    } else if (preset === 'gate') {
      // ~65m distance
      latOffset = 0.00045;
      lngOffset = 0.00032;
      setGpsAccuracy(8);
    } else if (preset === 'cafe') {
      // ~160m distance (outside 100m)
      latOffset = 0.0011;
      lngOffset = 0.0009;
      setGpsAccuracy(12);
    } else if (preset === 'home') {
      // ~2.5km distance
      latOffset = 0.018;
      lngOffset = 0.015;
      setGpsAccuracy(15);
    }

    const newCoords = {
      lat: activeLoc.latitude + latOffset,
      lng: activeLoc.longitude + lngOffset
    };
    setUserCoords(newCoords);

    const dist = Math.round(
      calculateHaversineDistance(newCoords.lat, newCoords.lng, activeLoc.latitude, activeLoc.longitude)
    );
    onDistanceChange(dist, newCoords);

    if (dist <= activeLoc.radiusMeters) {
      showToast(`Mô phỏng vị trí: Cách văn phòng ${dist}m (NẰM TRONG BÁN KÍNH HỢP LỆ)`, 'success');
    } else {
      showToast(`Mô phỏng vị trí: Cách văn phòng ${dist}m (NGOÀI BÁN KÍNH CHO PHÉP)`, 'warning');
    }
  };

  const isInside = currentDistance <= activeLoc.radiusMeters;

  // Radar graphic calculation:
  // Center of radar is office (0,0) with max visible radius of 200m
  const radarScale = 200; // max meters shown from center
  const ratio = Math.min(currentDistance / radarScale, 1);
  // calculate angle from lat/lng delta
  const dLat = userCoords.lat - activeLoc.latitude;
  const dLng = userCoords.lng - activeLoc.longitude;
  const angle = Math.atan2(dLat, dLng);

  // Position of user pin in 180x180 radar coordinate space (center is 90, 90)
  const userPinX = 90 + Math.cos(angle) * (ratio * 72);
  const userPinY = 90 - Math.sin(angle) * (ratio * 72);

  // Radius circle on radar (e.g., 100m in 200m scale = 36px radius)
  const geofenceCircleRadius = Math.min(80, (activeLoc.radiusMeters / radarScale) * 72);

  return (
    <div
      className={`bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-xl overflow-hidden ${
        compact ? 'p-3' : 'p-5'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
            <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '10s' }} />
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-white flex items-center gap-1.5">
              <span>Định Vị GPS Geofencing Thời Gian Thực</span>
              <span
                className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  isInside ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                {isInside ? 'Hợp lệ' : 'Ngoài vùng'}
              </span>
            </h4>
            <p className="text-[10px] text-slate-400">
              Kiểm tra tọa độ vệ tinh & đo khoảng cách Haversine tới trụ sở
            </p>
          </div>
        </div>

        {/* Office Location Picker */}
        <div className="flex items-center gap-1.5">
          <select
            value={activeLocId}
            onChange={(e) => handleSelectLocation(e.target.value)}
            className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-[11px] font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
          >
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name.split(' (')[0]} ({loc.radiusMeters}m)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Radar & Live Coordinates Display */}
      <div className={`grid grid-cols-1 ${compact ? '' : 'md:grid-cols-12'} gap-4 items-center pt-3`}>
        {/* Radar Graphic Visualizer (Canvas / SVG) */}
        <div className={compact ? 'flex justify-center' : 'md:col-span-6 flex justify-center'}>
          <div className="relative w-44 h-44 rounded-full bg-slate-950 border-2 border-emerald-500/40 p-1 flex items-center justify-center shadow-inner overflow-hidden">
            {/* Rotating Radar Sweep Line */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background:
                  'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(16, 185, 129, 0.25) 360deg)',
                animation: 'spin 4s linear infinite'
              }}
            />

            {/* Concentric Distance Rings */}
            <svg viewBox="0 0 180 180" className="w-full h-full">
              {/* Outer grid circles */}
              <circle cx="90" cy="90" r="75" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />
              <circle cx="90" cy="90" r="50" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />
              <circle cx="90" cy="90" r="25" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />

              {/* Crosshair grid lines */}
              <line x1="90" y1="5" x2="90" y2="175" stroke="#1E293B" strokeWidth="1" />
              <line x1="5" y1="90" x2="175" y2="90" stroke="#1E293B" strokeWidth="1" />

              {/* Geofence Permitted Area Circle */}
              <circle
                cx="90"
                cy="90"
                r={geofenceCircleRadius}
                fill="rgba(16, 185, 129, 0.12)"
                stroke="#10B981"
                strokeWidth="1.5"
                strokeDasharray="4,2"
              />

              {/* Office Center Pin */}
              <circle cx="90" cy="90" r="4" fill="#0284C7" />
              <circle cx="90" cy="90" r="8" fill="none" stroke="#38BDF8" strokeWidth="1" opacity="0.6" />

              {/* Connection vector line between Office and User */}
              <line
                x1="90"
                y1="90"
                x2={userPinX}
                y2={userPinY}
                stroke={isInside ? '#10B981' : '#F43F5E'}
                strokeWidth="1"
                strokeDasharray="2,2"
              />

              {/* User Current Position Pin */}
              <circle
                cx={userPinX}
                cy={userPinY}
                r="6"
                fill={isInside ? '#10B981' : '#F43F5E'}
                className="animate-pulse"
              />
              <circle
                cx={userPinX}
                cy={userPinY}
                r="10"
                fill="none"
                stroke={isInside ? '#34D399' : '#FB7185'}
                strokeWidth="1"
                opacity="0.8"
              />
            </svg>

            {/* In-Radar Badge */}
            <div className="absolute top-2 left-2 text-[9px] font-mono text-slate-400 bg-slate-900/80 px-1.5 py-0.5 rounded">
              Bán kính: {activeLoc.radiusMeters}m
            </div>

            <div className="absolute bottom-2 right-2 text-[9px] font-mono text-emerald-400 bg-slate-900/80 px-1.5 py-0.5 rounded">
              GPS: {isInside ? 'PASS' : 'OUT'}
            </div>
          </div>
        </div>

        {/* Right Info: Live Telemetry & Quick Action Controls */}
        <div className={compact ? 'space-y-2.5' : 'md:col-span-6 space-y-3'}>
          {/* Current Distance Card */}
          <div
            className={`p-3 rounded-2xl border transition-all ${
              isInside
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/30 text-rose-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300">Khoảng Cách Tới Văn Phòng:</span>
              <span
                className={`text-lg font-black font-mono ${
                  isInside ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {currentDistance} mét
              </span>
            </div>
            <div className="text-[10px] mt-1 flex items-center justify-between text-slate-400">
              <span>Bán kính cho phép: {activeLoc.radiusMeters}m</span>
              <span className="font-bold">
                {isInside ? '✅ Đủ điều kiện chấm công' : '❌ Vượt bán kính cho phép'}
              </span>
            </div>
          </div>

          {/* Coordinates Details Grid */}
          <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800 text-[11px] space-y-1.5 font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Vĩ độ (Latitude):</span>
              <strong className="text-white">{userCoords.lat.toFixed(6)}</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Kinh độ (Longitude):</span>
              <strong className="text-white">{userCoords.lng.toFixed(6)}</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Độ chính xác vệ tinh:</span>
              <span className="text-sky-400 font-bold">±{gpsAccuracy || 6}m</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Nguồn toạ độ:</span>
              <span className="text-slate-300">
                {gpsSource === 'browser_live' ? '🛰️ GPS Trình duyệt thật' : '⚙️ Mô phỏng thử nghiệm'}
              </span>
            </div>
          </div>

          {/* Real Browser GPS Trigger Button */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleFetchRealGps}
              disabled={loadingGps}
              className="w-full py-2 px-3 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Satellite className={`w-4 h-4 ${loadingGps ? 'animate-spin' : ''}`} />
              <span>{loadingGps ? 'Đang dò vị trí vệ tinh...' : 'Lấy Toạ Độ GPS Thực Tế Của Tôi'}</span>
            </button>
          </div>

          {/* Simulation Presets (For testing various distance cases) */}
          <div className="space-y-1">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Mô phỏng khoảng cách kiểm thử:
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[10px]">
              <button
                type="button"
                onClick={() => handleSetPreset('desk')}
                className="py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold transition cursor-pointer text-left truncate"
                title="18m - Tại bàn làm việc"
              >
                🏢 Tại bàn (18m)
              </button>

              <button
                type="button"
                onClick={() => handleSetPreset('gate')}
                className="py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold transition cursor-pointer text-left truncate"
                title="65m - Tại cổng tòa nhà"
              >
                🚪 Tại sảnh (65m)
              </button>

              <button
                type="button"
                onClick={() => handleSetPreset('cafe')}
                className="py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-900/40 font-semibold transition cursor-pointer text-left truncate"
                title="160m - Quán cafe ngoài bán kính"
              >
                ☕ Ngoài vùng (160m)
              </button>

              <button
                type="button"
                onClick={() => handleSetPreset('home')}
                className="py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-900/40 font-semibold transition cursor-pointer text-left truncate"
                title="2.5km - Tại nhà riêng"
              >
                🏠 Ở xa (2.5km)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
