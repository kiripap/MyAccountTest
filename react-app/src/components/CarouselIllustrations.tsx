/* ─── Animated SVG illustrations for the loading carousel ─── */

/* ═══ MAP — location dots pulse, shadow drifts ═══ */
export function MapIllustration() {
  return (
    <svg viewBox="0 0 520 380" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <style>{`
        @keyframes dotPulse { 0%,100% { r: 7; opacity: 0.8; } 50% { r: 10; opacity: 1; } }
        @keyframes mapFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes shadowDrift { 0%,100% { transform: scaleX(1); opacity: 0.15; } 50% { transform: scaleX(0.92); opacity: 0.1; } }
        .map-body { animation: mapFloat 3.6s ease-in-out infinite; }
        .map-shadow { animation: shadowDrift 3.6s ease-in-out infinite; transform-origin: center; }
        .map-dot { animation: dotPulse 2.4s ease-in-out infinite; }
        .map-dot:nth-child(2) { animation-delay: 0.3s; }
        .map-dot:nth-child(3) { animation-delay: 0.6s; }
        .map-dot:nth-child(4) { animation-delay: 0.9s; }
        .map-dot:nth-child(5) { animation-delay: 1.2s; }
        .map-dot:nth-child(6) { animation-delay: 0.15s; }
        .map-dot:nth-child(7) { animation-delay: 0.45s; }
        .map-dot:nth-child(8) { animation-delay: 0.75s; }
        .map-dot:nth-child(9) { animation-delay: 1.05s; }
        .map-dot:nth-child(10) { animation-delay: 0.5s; }
        .map-dot:nth-child(11) { animation-delay: 0.8s; }
        @media (prefers-reduced-motion: reduce) { .map-body, .map-shadow, .map-dot { animation: none; } }
      `}</style>

      {/* Shadow */}
      <ellipse className="map-shadow" cx="260" cy="340" rx="200" ry="18" fill="#C8C8C8"/>

      <g className="map-body">
        {/* Main map outline */}
        <path d="M60 250 C70 200 110 170 150 150 C190 130 210 160 250 140 S310 90 350 100 C390 110 420 90 450 110 C470 125 470 170 460 200 C450 230 430 250 400 265 C370 280 340 260 300 280 S240 320 200 310 C160 300 140 330 110 320 C80 310 55 290 60 250Z" stroke="#5514B4" strokeWidth="2.5" fill="none" strokeLinejoin="round"/>

        {/* Inner region boundaries */}
        <path d="M150 155 C180 160 200 140 230 145" stroke="#5514B4" strokeWidth="1.8" fill="none"/>
        <path d="M175 200 C210 190 240 210 270 195" stroke="#5514B4" strokeWidth="1.8" fill="none"/>
        <path d="M110 260 C140 250 160 270 190 258" stroke="#5514B4" strokeWidth="1.8" fill="none"/>

        {/* Location dots */}
        <circle className="map-dot" cx="155" cy="138" r="7" fill="#5514B4"/>
        <circle className="map-dot" cx="230" cy="125" r="7" fill="#5514B4"/>
        <circle className="map-dot" cx="310" cy="115" r="7" fill="#5514B4"/>
        <circle className="map-dot" cx="430" cy="108" r="7" fill="#5514B4"/>
        <circle className="map-dot" cx="200" cy="195" r="7" fill="#5514B4"/>
        <circle className="map-dot" cx="310" cy="200" r="7" fill="#5514B4"/>
        <circle className="map-dot" cx="380" cy="215" r="7" fill="#5514B4"/>
        <circle className="map-dot" cx="140" cy="270" r="7" fill="#5514B4"/>
        <circle className="map-dot" cx="100" cy="300" r="7" fill="#5514B4"/>
        <circle className="map-dot" cx="250" cy="280" r="7" fill="#5514B4"/>
        <circle className="map-dot" cx="350" cy="260" r="7" fill="#5514B4"/>
      </g>
    </svg>
  );
}

/* ═══ BUILDING — floats gently, windows shimmer ═══ */
export function BuildingIllustration() {
  return (
    <svg viewBox="0 0 540 440" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <style>{`
        @keyframes bldFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes bldShadow { 0%,100% { transform: scaleX(1); opacity: 0.15; } 50% { transform: scaleX(0.9); opacity: 0.1; } }
        @keyframes winShimmer { 0%,100% { opacity: 0.5; } 50% { opacity: 0.85; } }
        .bld-body { animation: bldFloat 4s ease-in-out infinite; }
        .bld-shadow { animation: bldShadow 4s ease-in-out infinite; transform-origin: center; }
        .bld-win { animation: winShimmer 3s ease-in-out infinite; }
        .bld-win:nth-of-type(2) { animation-delay: 0.5s; }
        .bld-win:nth-of-type(3) { animation-delay: 1s; }
        .bld-win:nth-of-type(4) { animation-delay: 1.5s; }
        @media (prefers-reduced-motion: reduce) { .bld-body, .bld-shadow, .bld-win { animation: none; } }
      `}</style>

      {/* Shadow */}
      <ellipse className="bld-shadow" cx="280" cy="410" rx="210" ry="16" fill="#C8C8C8"/>

      <g className="bld-body">
        {/* Roof / top section */}
        <path d="M205 50 L335 50 L345 70 L195 70 Z" stroke="#5514B4" strokeWidth="2.5" strokeLinejoin="round" fill="none"/>

        {/* Upper floor */}
        <path d="M180 70 L360 70 L370 110 L170 110 Z" stroke="#5514B4" strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
        <rect x="180" y="110" width="180" height="90" stroke="#5514B4" strokeWidth="2.5" fill="none"/>

        {/* Upper windows */}
        <rect className="bld-win" x="210" y="125" width="45" height="35" rx="4" fill="#E8E0F0" stroke="#5514B4" strokeWidth="1.5"/>
        <rect className="bld-win" x="285" y="125" width="45" height="35" rx="4" fill="#E8E0F0" stroke="#5514B4" strokeWidth="1.5"/>

        {/* Right side extension */}
        <path d="M360 110 L420 140 L420 200 L360 200 Z" stroke="#5514B4" strokeWidth="2.5" fill="none"/>
        <rect x="370" y="148" width="35" height="15" rx="2" fill="#E8E0F0" stroke="#5514B4" strokeWidth="1"/>

        {/* Left wing */}
        <path d="M50 195 L175 195 L180 215 L45 215 Z" stroke="#5514B4" strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
        <rect x="50" y="215" width="125" height="185" stroke="#5514B4" strokeWidth="2.5" fill="none"/>

        {/* Left window */}
        <rect className="bld-win" x="80" y="255" width="55" height="45" rx="5" fill="#E8E0F0" stroke="#5514B4" strokeWidth="1.5"/>

        {/* Main floor */}
        <rect x="170" y="200" width="195" height="200" stroke="#5514B4" strokeWidth="2.5" fill="none"/>

        {/* Door */}
        <rect x="240" y="320" width="50" height="80" rx="3" stroke="#5514B4" strokeWidth="2" fill="none"/>
        <circle cx="280" cy="365" r="4" fill="#5514B4"/>

        {/* Right wing */}
        <path d="M385 260 L500 260 L505 280 L380 280 Z" stroke="#5514B4" strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
        <rect x="385" y="280" width="115" height="120" stroke="#5514B4" strokeWidth="2.5" fill="none"/>

        {/* Right window */}
        <rect className="bld-win" x="410" y="310" width="55" height="45" rx="5" fill="#E8E0F0" stroke="#5514B4" strokeWidth="1.5"/>

        {/* Antenna on left */}
        <line x1="30" y1="230" x2="55" y2="195" stroke="#5514B4" strokeWidth="2"/>
        <line x1="30" y1="230" x2="10" y2="240" stroke="#5514B4" strokeWidth="2"/>
      </g>
    </svg>
  );
}

/* ═══ ROUTER — floats, signal rings radiate ═══ */
export function RouterIllustration() {
  return (
    <svg viewBox="0 0 400 330" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <style>{`
        @keyframes rtrFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
        @keyframes rtrShadow { 0%,100% { transform: scaleX(1); opacity: 0.15; } 50% { transform: scaleX(0.9); opacity: 0.1; } }
        @keyframes rtrGlow { 0%,100% { opacity: 0.3; } 50% { opacity: 0.7; } }
        .rtr-body { animation: rtrFloat 3.2s ease-in-out infinite; }
        .rtr-shadow { animation: rtrShadow 3.2s ease-in-out infinite; transform-origin: center; }
        .rtr-glow { animation: rtrGlow 2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .rtr-body, .rtr-shadow, .rtr-glow { animation: none; } }
      `}</style>

      {/* Shadow */}
      <ellipse className="rtr-shadow" cx="200" cy="295" rx="150" ry="14" fill="#C8C8C8"/>

      <g className="rtr-body">
        {/* Top edge / lid with perspective */}
        <path d="M55 80 Q55 50 100 40 L320 30 Q360 40 355 70" stroke="#5514B4" strokeWidth="2.5" fill="none" className="rtr-glow"/>

        {/* Router body — rounded rectangle with slight perspective */}
        <path d="M40 100 Q35 75 70 65 L340 55 Q375 65 370 100 L370 220 Q370 250 340 255 L70 265 Q40 260 40 230 Z" stroke="#5514B4" strokeWidth="2.5" fill="none"/>

        {/* Power button — concentric circles */}
        <circle cx="200" cy="160" r="55" stroke="#5514B4" strokeWidth="2.5" fill="none"/>
        <circle cx="200" cy="160" r="20" stroke="#5514B4" strokeWidth="2" fill="none"/>

        {/* Feet */}
        <ellipse cx="90" cy="268" rx="18" ry="7" fill="#C8C8C8" opacity="0.4"/>
        <ellipse cx="210" cy="274" rx="18" ry="7" fill="#C8C8C8" opacity="0.4"/>
        <ellipse cx="320" cy="268" rx="18" ry="7" fill="#C8C8C8" opacity="0.4"/>
      </g>
    </svg>
  );
}
