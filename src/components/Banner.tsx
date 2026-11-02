import React from 'react';

export const Banner: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-[14px] bg-slate-900 text-white shadow-md mx-3 mt-3 border border-slate-800">
      {/* Static 2D Illustration: Premium Grey Hyundai-style Electric Vehicle standing proud */}
      <div className="relative w-full h-[158px] select-none pointer-events-none">
        <svg
          viewBox="0 0 440 160"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Architectural Studio & Dawn Sky Gradient */}
            <linearGradient id="bgSkyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0b1120" />
              <stop offset="50%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            {/* Ground / Showroom Floor Gradient */}
            <linearGradient id="floorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="25%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            {/* Hyundai Metallic Grey Car Paint (Cyber Grey / Matte Silver) */}
            <linearGradient id="hyundaiMatteGrey" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="25%" stopColor="#94a3b8" />
              <stop offset="60%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            {/* Roof Arch Highlight */}
            <linearGradient id="roofArchGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="50%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            {/* Parametric Glass Window Gradient */}
            <linearGradient id="glassTint" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#1e293b" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#334155" stopOpacity="0.85" />
            </linearGradient>

            {/* Soft Ground Shadow under parked car */}
            <radialGradient id="carGroundShadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#020617" stopOpacity="0.85" />
              <stop offset="70%" stopColor="#020617" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background backdrop */}
          <rect width="440" height="160" fill="url(#bgSkyGrad)" />

          {/* Minimalist modern architectural geometric lines */}
          <line x1="0" y1="50" x2="440" y2="50" stroke="#334155" strokeWidth="0.8" opacity="0.4" />
          <line x1="280" y1="0" x2="350" y2="110" stroke="#475569" strokeWidth="1" opacity="0.3" />
          <line x1="330" y1="0" x2="400" y2="110" stroke="#475569" strokeWidth="0.8" opacity="0.2" />

          {/* City / Design Pavilion subtle silhouette */}
          <path
            d="M260 110 L280 45 L320 45 L335 110 L350 35 L400 35 L420 110 Z"
            fill="#1e293b"
            opacity="0.35"
          />

          {/* Showroom Platform / Pavement (Stationary) */}
          <rect x="0" y="110" width="440" height="50" fill="url(#floorGrad)" />
          {/* Subtle floor reflection lines */}
          <line x1="0" y1="110" x2="440" y2="110" stroke="#64748b" strokeWidth="1.5" opacity="0.5" />
          <line x1="0" y1="113" x2="440" y2="113" stroke="#475569" strokeWidth="0.8" opacity="0.4" />

          {/* STATIC 2D CAR: Hyundai Electric Crossover / Sedan (Cyber Grey) */}
          {/* Ground shadow under stationary car */}
          <ellipse cx="295" cy="133" rx="115" ry="9" fill="url(#carGroundShadow)" />

          {/* Car main group standing still at x:185, y:72 */}
          <g transform="translate(182, 70)">
            {/* Underbody dark frame */}
            <path
              d="M12 55 L215 55 L218 50 L10 50 Z"
              fill="#0f172a"
            />

            {/* Rear bumper & diffuser */}
            <path
              d="M8 46 L14 55 L35 55 L30 46 Z"
              fill="#1e293b"
            />
            {/* Front lower splitter */}
            <path
              d="M195 46 L218 51 L205 55 L180 55 Z"
              fill="#1e293b"
            />

            {/* Main Body - Hyundai Aerodynamic Fastback Shape (Matte Grey) */}
            <path
              d="M10 44
                 C10 40, 15 36, 26 34
                 L68 30
                 L92 14
                 C105 7, 140 7, 160 15
                 L192 32
                 C206 35, 218 39, 222 43
                 L222 48
                 C222 51, 219 53, 212 53
                 L196 53
                 A16 16 0 0 0 164 53
                 L72 53
                 A16 16 0 0 0 40 53
                 L15 53
                 C11 53, 8 50, 8 47
                 Z"
              fill="url(#hyundaiMatteGrey)"
              stroke="#64748b"
              strokeWidth="1.2"
            />

            {/* Aerodynamic Character Line (Hyundai Z-shape crease / side contour) */}
            <path
              d="M26 36 L105 38 L145 36 L212 43"
              stroke="#cbd5e1"
              strokeWidth="1.2"
              fill="none"
              opacity="0.9"
            />
            <path
              d="M40 48 L95 47 L165 47"
              stroke="#334155"
              strokeWidth="1"
              fill="none"
              opacity="0.8"
            />

            {/* Roof Arc Chrome / Aluminum Trim Line */}
            <path
              d="M68 30 C82 17, 115 10, 160 15 L188 31"
              stroke="url(#roofArchGlow)"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
            />

            {/* Glass Green-house Windows (Flush Tinted Glass) */}
            {/* Rear quarter glass */}
            <path
              d="M72 29 L94 17 L94 34 L66 34 Z"
              fill="url(#glassTint)"
              stroke="#334155"
              strokeWidth="0.8"
            />
            {/* Center B-pillar window */}
            <path
              d="M97 16 L140 16 L140 34 L97 34 Z"
              fill="url(#glassTint)"
              stroke="#334155"
              strokeWidth="0.8"
            />
            {/* Front windshield & side window */}
            <path
              d="M143 16 L158 16 C168 20, 178 25, 185 32 L143 34 Z"
              fill="url(#glassTint)"
              stroke="#334155"
              strokeWidth="0.8"
            />
            {/* Interior Seat Silhouette */}
            <path
              d="M125 22 C125 19, 130 19, 130 22 L132 32 L122 32 Z"
              fill="#0f172a"
              opacity="0.6"
            />

            {/* Parametric Pixel Taillight Bar (Hyundai Signature Red Parametric Pixels) */}
            <g transform="translate(8, 42)">
              <rect x="0" y="0" width="3" height="3" fill="#ef4444" />
              <rect x="4" y="0" width="3" height="3" fill="#ef4444" />
              <rect x="8" y="0.5" width="2.5" height="2" fill="#ef4444" opacity="0.9" />
              <rect x="12" y="0.5" width="2" height="2" fill="#f87171" opacity="0.8" />
            </g>

            {/* Parametric Pixel Headlight Unit (Hyundai Signature Dual-Cube LED) */}
            <g transform="translate(210, 42)">
              <rect x="0" y="0" width="4" height="3" fill="#f8fafc" />
              <rect x="5" y="0.5" width="4" height="2.5" fill="#38bdf8" />
              {/* Subtle daytime running light strip */}
              <line x1="-12" y1="2" x2="8" y2="2" stroke="#e0f2fe" strokeWidth="1" />
            </g>

            {/* Flush Door Handles */}
            <rect x="88" y="38" width="10" height="2" rx="0.5" fill="#475569" stroke="#64748b" strokeWidth="0.5" />
            <rect x="136" y="38" width="10" height="2" rx="0.5" fill="#475569" stroke="#64748b" strokeWidth="0.5" />

            {/* REAR WHEEL - Premium Multi-Spoke Alloy Wheel (Standing Still) */}
            <g transform="translate(56, 53)">
              {/* Tire */}
              <circle cx="0" cy="0" r="14.5" fill="#0f172a" stroke="#1e293b" strokeWidth="1.5" />
              {/* Rim Outer */}
              <circle cx="0" cy="0" r="11" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
              {/* Disc Brake */}
              <circle cx="0" cy="0" r="8.5" fill="#475569" />
              <circle cx="0" cy="0" r="3" fill="#64748b" />
              {/* Turbine Geometric Spokes (Stationary) */}
              <line x1="-8" y1="0" x2="8" y2="0" stroke="#f1f5f9" strokeWidth="1.5" />
              <line x1="0" y1="-8" x2="0" y2="8" stroke="#f1f5f9" strokeWidth="1.5" />
              <line x1="-5.5" y1="-5.5" x2="5.5" y2="5.5" stroke="#94a3b8" strokeWidth="1.2" />
              <line x1="-5.5" y1="5.5" x2="5.5" y2="-5.5" stroke="#94a3b8" strokeWidth="1.2" />
              {/* Center Hub */}
              <circle cx="0" cy="0" r="2.2" fill="#0f172a" />
              <circle cx="0" cy="0" r="1" fill="#f8fafc" />
            </g>

            {/* FRONT WHEEL - Premium Multi-Spoke Alloy Wheel (Standing Still) */}
            <g transform="translate(180, 53)">
              {/* Tire */}
              <circle cx="0" cy="0" r="14.5" fill="#0f172a" stroke="#1e293b" strokeWidth="1.5" />
              {/* Rim Outer */}
              <circle cx="0" cy="0" r="11" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
              {/* Disc Brake */}
              <circle cx="0" cy="0" r="8.5" fill="#475569" />
              <circle cx="0" cy="0" r="3" fill="#64748b" />
              {/* Turbine Geometric Spokes (Stationary) */}
              <line x1="-8" y1="0" x2="8" y2="0" stroke="#f1f5f9" strokeWidth="1.5" />
              <line x1="0" y1="-8" x2="0" y2="8" stroke="#f1f5f9" strokeWidth="1.5" />
              <line x1="-5.5" y1="-5.5" x2="5.5" y2="5.5" stroke="#94a3b8" strokeWidth="1.2" />
              <line x1="-5.5" y1="5.5" x2="5.5" y2="-5.5" stroke="#94a3b8" strokeWidth="1.2" />
              {/* Center Hub */}
              <circle cx="0" cy="0" r="2.2" fill="#0f172a" />
              <circle cx="0" cy="0" r="1" fill="#f8fafc" />
            </g>
          </g>
        </svg>

        {/* Text Overlay: "시동 걸까요? 모빌리티 커리어" */}
        {/* Text Overlay: "미래 모빌리티로 향하는 최단 경로 탐색 중" */}
        <div className="absolute top-3.5 left-4 right-4 pointer-events-auto flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800/80 backdrop-blur-md border border-slate-700 text-[10px] font-semibold text-slate-200 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              <span>스마트 모빌리티 커리어 네비게이션</span>
            </div>
            <h2 className="text-[17px] sm:text-[20px] font-extrabold tracking-tight text-white drop-shadow-md">
              미래 모빌리티로 향하는 최단 경로 탐색 중
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-300 font-medium mt-0.5 max-w-[260px] leading-tight">
              자율주행 · 전기차 · UAM까지<br />내 스펙에 딱 맞는 채용 포지션 매칭
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
