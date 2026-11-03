import React from 'react';

export const Banner: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-[16px] bg-slate-950 text-white shadow-lg mx-3 mt-3 border border-slate-800/90">
      {/* Animated SVG Container: Sleek metallic dark-gray futuristic autonomous car with rotating LiDAR */}
      <div className="relative w-full h-[175px] sm:h-[185px] select-none">
        <svg
          viewBox="0 0 440 180"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Dark Cyberpunk Night Sky with subtle horizon */}
            <linearGradient id="nightSkyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#030712" />
              <stop offset="55%" stopColor="#0b1329" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>

            {/* Cyber Highway Asphalt */}
            <linearGradient id="roadSurface" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#111827" />
              <stop offset="30%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>

            {/* Sleek Metallic Dark-Gray Car Paint */}
            <linearGradient id="metallicDarkGrey" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="20%" stopColor="#475569" />
              <stop offset="65%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            {/* Sleek Hood & Roof Highlight */}
            <linearGradient id="chromeHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="50%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>

            {/* Neon Cyan Headlight Beam */}
            <linearGradient id="headlightBeamGrad" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="35%" stopColor="#38bdf8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </linearGradient>

            {/* Rotating LiDAR Radar Waves Glow */}
            <radialGradient id="lidarWaveGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
            </radialGradient>

            {/* Wheel Hub Neon Glow */}
            <radialGradient id="wheelNeon" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#0284c7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </radialGradient>

            {/* Ground Shadow under Car */}
            <radialGradient id="carShadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#000000" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>

            {/* Keyframe Styles for LiDAR and glowing animations */}
            <style>
              {`
                @keyframes lidarRotate {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
                @keyframes lidarPulseRing {
                  0% { r: 6px; opacity: 0.9; stroke-width: 1.5; }
                  50% { r: 24px; opacity: 0.5; stroke-width: 1.2; }
                  100% { r: 42px; opacity: 0; stroke-width: 0.5; }
                }
                @keyframes lidarPulseRing2 {
                  0% { r: 6px; opacity: 0; stroke-width: 1.5; }
                  30% { r: 14px; opacity: 0.8; stroke-width: 1.2; }
                  100% { r: 48px; opacity: 0; stroke-width: 0.5; }
                }
                @keyframes roadStripeDash {
                  0% { stroke-dashoffset: 0; }
                  100% { stroke-dashoffset: -30; }
                }
                @keyframes headlightFlicker {
                  0%, 100% { opacity: 0.9; }
                  50% { opacity: 1; }
                }
                .lidar-sweep {
                  transform-origin: 304px 92px;
                  animation: lidarRotate 2.6s linear infinite;
                }
                .lidar-ring-1 {
                  animation: lidarPulseRing 2.4s ease-out infinite;
                }
                .lidar-ring-2 {
                  animation: lidarPulseRing2 2.4s ease-out infinite;
                  animation-delay: 1.2s;
                }
                .headlight-glow {
                  animation: headlightFlicker 3s ease-in-out infinite;
                }
                .road-stripe {
                  stroke-dasharray: 10 14;
                  animation: roadStripeDash 1.2s linear infinite;
                }
                @media (prefers-reduced-motion: reduce) {
                  .lidar-sweep, .lidar-ring-1, .lidar-ring-2, .road-stripe, .headlight-glow {
                    animation: none !important;
                  }
                }
              `}
            </style>
          </defs>

          {/* Background Night Sky */}
          <rect width="440" height="180" fill="url(#nightSkyGrad)" />

          {/* Distant City Skyline Silhouettes with subtle window lights */}
          <path
            d="M210 125 L210 85 L230 85 L230 125 L245 70 L270 70 L270 125 L290 95 L310 95 L310 125 L330 60 L360 60 L360 125 L380 78 L410 78 L410 125 L430 90 L440 90 L440 125 Z"
            fill="#0f172a"
            opacity="0.6"
          />
          {/* Subtle Cyber Grid Lines on Horizon */}
          <line x1="0" y1="125" x2="440" y2="125" stroke="#1e293b" strokeWidth="1" />
          <line x1="0" y1="95" x2="440" y2="95" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3 6" opacity="0.4" />

          {/* Road Surface */}
          <rect x="0" y="125" width="440" height="55" fill="url(#roadSurface)" />
          {/* Road Perspective Speed Lines */}
          <line x1="0" y1="148" x2="440" y2="148" stroke="#38bdf8" strokeWidth="1.2" opacity="0.3" className="road-stripe" />
          <line x1="0" y1="172" x2="440" y2="172" stroke="#64748b" strokeWidth="0.8" opacity="0.2" />

          {/* Headlight Forward Projection Beam (Cast forward onto the road ahead) */}
          <polygon
            points="385,124 440,105 440,152 385,130"
            fill="url(#headlightBeamGrad)"
            className="headlight-glow"
          />

          {/* Car Ground Ambient Shadow */}
          <ellipse cx="295" cy="143" rx="105" ry="9" fill="url(#carShadow)" />

          {/* ============================================================== */}
          {/* CAR GROUP: Sleek Metallic Dark-Gray Autonomous Sports Sedan   */}
          {/* ============================================================== */}
          <g transform="translate(190, 80)">
            {/* 1. LiDAR Sensor Pulse Signal Waves (from roof top at x:114, y:12) */}
            <circle cx="114" cy="12" r="10" fill="none" stroke="#38bdf8" opacity="0.6" className="lidar-ring-1" />
            <circle cx="114" cy="12" r="10" fill="none" stroke="#06b6d4" opacity="0.6" className="lidar-ring-2" />

            {/* Rotating LiDAR Radar Scan Arc */}
            <g className="lidar-sweep" style={{ transformOrigin: '114px 12px' }}>
              <path
                d="M114 12 L148 4 A36 36 0 0 0 114 -24 Z"
                fill="url(#lidarWaveGlow)"
                opacity="0.5"
              />
              <line x1="114" y1="12" x2="148" y2="4" stroke="#e0f2fe" strokeWidth="1.5" opacity="0.9" />
            </g>

            {/* Roof-mounted Autonomous LiDAR Sensor Housing */}
            <path
              d="M107 14 L121 14 L119 9 L109 9 Z"
              fill="#0f172a"
              stroke="#38bdf8"
              strokeWidth="0.8"
            />
            {/* Spinning Sensor Puck */}
            <ellipse cx="114" cy="9" rx="5" ry="2.2" fill="#0284c7" />
            <circle cx="114" cy="9" r="1.5" fill="#e0f2fe" className="headlight-glow" />

            {/* 2. Main Aerodynamic Chassis / Underbody */}
            <path
              d="M10 52 L205 52 L210 46 L8 46 Z"
              fill="#030712"
            />

            {/* 3. Main Car Body (Metallic Dark-Gray Fastback Silhouette) */}
            <path
              d="M10 42
                 C12 36, 18 32, 28 30
                 L64 27
                 L90 14
                 C102 8, 134 8, 156 16
                 L184 29
                 C198 33, 208 37, 212 41
                 L212 47
                 C212 50, 208 52, 200 52
                 L184 52
                 A16 16 0 0 0 152 52
                 L70 52
                 A16 16 0 0 0 38 52
                 L14 52
                 C10 52, 8 49, 8 45
                 Z"
              fill="url(#metallicDarkGrey)"
              stroke="#475569"
              strokeWidth="1.2"
            />

            {/* Aerodynamic Shoulder Sharp Crease Line */}
            <path
              d="M26 33 L98 35 L144 33 L208 41"
              stroke="url(#chromeHighlight)"
              strokeWidth="1.3"
              fill="none"
              strokeLinecap="round"
            />

            {/* Lower Body Aero Rocker Crease */}
            <path
              d="M38 47 L95 46 L152 46"
              stroke="#0f172a"
              strokeWidth="1.2"
              fill="none"
            />

            {/* Roof Arch Chrome/Cyan Lightbar Trim */}
            <path
              d="M65 27 C80 16, 114 9, 156 15 L182 29"
              stroke="#38bdf8"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
              opacity="0.8"
            />

            {/* Tinted Smart Privacy Glass Windows */}
            {/* Rear Window */}
            <path
              d="M68 26 L91 16 L91 32 L64 32 Z"
              fill="#090d16"
              stroke="#1e293b"
              strokeWidth="0.8"
            />
            {/* B-Pillar Center Window */}
            <path
              d="M94 15 L136 15 L136 32 L94 32 Z"
              fill="#090d16"
              stroke="#1e293b"
              strokeWidth="0.8"
            />
            {/* Front Windshield Quarter */}
            <path
              d="M139 15 L153 15 C164 19, 172 24, 178 30 L139 32 Z"
              fill="#090d16"
              stroke="#1e293b"
              strokeWidth="0.8"
            />

            {/* Flush Retractable Door Handles */}
            <rect x="85" y="35" width="9" height="1.8" rx="0.9" fill="#334155" stroke="#64748b" strokeWidth="0.5" />
            <rect x="132" y="35" width="9" height="1.8" rx="0.9" fill="#334155" stroke="#64748b" strokeWidth="0.5" />

            {/* Rear Futuristic Red Cyber-Bar Taillight */}
            <g transform="translate(8, 38)">
              <rect x="0" y="0" width="3" height="3" fill="#ef4444" />
              <rect x="4" y="0.5" width="5" height="2" fill="#f87171" opacity="0.9" />
              <line x1="0" y1="1.5" x2="9" y2="1.5" stroke="#ef4444" strokeWidth="1" />
            </g>

            {/* Front Dual-Beam Laser Headlight Unit */}
            <g transform="translate(202, 39)">
              {/* Sharp Cyan / White Dual LED Projector */}
              <polygon points="0,0 8,2 7,5 0,3" fill="#38bdf8" />
              <circle cx="6" cy="3" r="1.8" fill="#f8fafc" className="headlight-glow" />
              {/* Daytime Running Light Strip */}
              <line x1="-8" y1="0.5" x2="8" y2="2" stroke="#e0f2fe" strokeWidth="1.2" strokeLinecap="round" />
            </g>

            {/* REAR WHEEL: High-tech Turbine Aero Rim with Glowing Hub */}
            <g transform="translate(54, 52)">
              {/* Tire */}
              <circle cx="0" cy="0" r="14.5" fill="#090d16" stroke="#1e293b" strokeWidth="1.5" />
              {/* Rim Rim Outer */}
              <circle cx="0" cy="0" r="11" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
              {/* Disc Brake & Caliper */}
              <circle cx="0" cy="0" r="8.5" fill="#334155" />
              <path d="M-6 -4 A7 7 0 0 1 -2 -7" stroke="#38bdf8" strokeWidth="2" fill="none" />
              {/* Turbine Blades */}
              <line x1="-8" y1="0" x2="8" y2="0" stroke="#cbd5e1" strokeWidth="1.4" />
              <line x1="0" y1="-8" x2="0" y2="8" stroke="#cbd5e1" strokeWidth="1.4" />
              <line x1="-5.6" y1="-5.6" x2="5.6" y2="5.6" stroke="#94a3b8" strokeWidth="1.2" />
              <line x1="-5.6" y1="5.6" x2="5.6" y2="-5.6" stroke="#94a3b8" strokeWidth="1.2" />
              {/* Glowing Hub */}
              <circle cx="0" cy="0" r="3" fill="url(#wheelNeon)" />
              <circle cx="0" cy="0" r="1.2" fill="#38bdf8" />
            </g>

            {/* FRONT WHEEL: High-tech Turbine Aero Rim with Glowing Hub */}
            <g transform="translate(168, 52)">
              {/* Tire */}
              <circle cx="0" cy="0" r="14.5" fill="#090d16" stroke="#1e293b" strokeWidth="1.5" />
              {/* Rim Outer */}
              <circle cx="0" cy="0" r="11" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
              {/* Disc Brake & Caliper */}
              <circle cx="0" cy="0" r="8.5" fill="#334155" />
              <path d="M6 -4 A7 7 0 0 0 2 -7" stroke="#38bdf8" strokeWidth="2" fill="none" />
              {/* Turbine Blades */}
              <line x1="-8" y1="0" x2="8" y2="0" stroke="#cbd5e1" strokeWidth="1.4" />
              <line x1="0" y1="-8" x2="0" y2="8" stroke="#cbd5e1" strokeWidth="1.4" />
              <line x1="-5.6" y1="-5.6" x2="5.6" y2="5.6" stroke="#94a3b8" strokeWidth="1.2" />
              <line x1="-5.6" y1="5.6" x2="5.6" y2="-5.6" stroke="#94a3b8" strokeWidth="1.2" />
              {/* Glowing Hub */}
              <circle cx="0" cy="0" r="3" fill="url(#wheelNeon)" />
              <circle cx="0" cy="0" r="1.2" fill="#38bdf8" />
            </g>
          </g>
        </svg>

        {/* Text Overlay: Sleek glassmorphism header & tagline */}
        <div className="absolute top-3.5 left-4 right-4 pointer-events-auto flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-cyan-500/30 text-[10px] font-semibold text-cyan-300 mb-1.5 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>스마트 모빌리티 커리어 네비게이션</span>
            </div>
            <h2 className="text-[17px] sm:text-[20px] font-extrabold tracking-tight text-white drop-shadow-md leading-tight">
              미래 모빌리티로 향하는 최단 경로 탐색 중
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-300 font-medium mt-1 max-w-[260px] leading-tight drop-shadow-xs">
              자율주행 · 전기차 · UAM까지<br />내 스펙에 딱 맞는 채용 포지션 매칭
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
