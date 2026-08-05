"use client";

type Position = "top-right" | "top-left" | "bottom-left" | "bottom-right" | "both";
type Size = "sm" | "md" | "lg";

interface FloralDecorationProps {
  /** Position the florals at which corners */
  position?: Position;
  /** Relative size of the decoration */
  size?: Size;
  /** Custom z-index class if needed */
  zIndex?: string;
}

const SIZE_CLASSES: Record<Size, string> = {
  sm: "w-[80px] h-[80px] sm:w-[130px] sm:h-[130px] md:w-[170px] md:h-[170px]",
  md: "w-[110px] h-[110px] sm:w-[180px] sm:h-[180px] md:w-[220px] md:h-[220px]",
  lg: "w-[130px] h-[130px] sm:w-[210px] sm:h-[210px] md:w-[280px] md:h-[280px]",
};

/* ── SVG Sub-Components ── */

/** Gradients matching convite watercolor lilies */
function Defs() {
  return (
    <defs>
      <linearGradient id="petalGradConvite" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F8C2CD" />
        <stop offset="40%" stopColor="#E06D83" />
        <stop offset="100%" stopColor="#BA415B" />
      </linearGradient>
      <linearGradient id="petalInnerGradConvite" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#E06D83" />
        <stop offset="100%" stopColor="#942E44" />
      </linearGradient>
      <linearGradient id="leafGradConvite" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7B946D" />
        <stop offset="100%" stopColor="#4A6043" />
      </linearGradient>
    </defs>
  );
}

/** A watercolor style lily flower matching convite.webp */
function LilyFlower({
  cx,
  cy,
  scale = 1,
  rotation = 0,
}: {
  cx: number;
  cy: number;
  scale?: number;
  rotation?: number;
}) {
  return (
    <g transform={`translate(${cx}, ${cy}) rotate(${rotation}) scale(${scale})`}>
      {/* Outer Petals */}
      {[0, 120, 240].map((angle) => (
        <g key={`outer-${angle}`} transform={`rotate(${angle})`}>
          <path
            d="M 0,0 C -14,-22 -18,-54 0,-68 C 18,-54 14,-22 0,0 Z"
            fill="url(#petalGradConvite)"
            opacity={0.88}
          />
        </g>
      ))}
      {/* Inner Petals */}
      {[60, 180, 300].map((angle) => (
        <g key={`inner-${angle}`} transform={`rotate(${angle})`}>
          <path
            d="M 0,0 C -16,-26 -20,-62 0,-76 C 20,-62 16,-26 0,0 Z"
            fill="url(#petalInnerGradConvite)"
            opacity={0.92}
          />
          {/* Petal Center Stripe */}
          <path
            d="M 0,-12 C -4,-24 -6,-44 0,-56 C 6,-44 4,-24 0,-12 Z"
            fill="#661C2C"
            opacity={0.5}
          />
          {/* Delicate Speckles */}
          <circle cx={-3} cy={-28} r={1} fill="#521422" opacity={0.7} />
          <circle cx={3} cy={-32} r={0.9} fill="#521422" opacity={0.7} />
          <circle cx={-1} cy={-38} r={1.1} fill="#521422" opacity={0.7} />
        </g>
      ))}
      {/* Pistil & Stamens */}
      <line x1={0} y1={0} x2={-10} y2={-38} stroke="#4A6043" strokeWidth={1.4} opacity={0.8} />
      <circle cx={-10} cy={-38} r={2.5} fill="#521422" />
      <line x1={0} y1={0} x2={10} y2={-35} stroke="#4A6043" strokeWidth={1.4} opacity={0.8} />
      <circle cx={10} cy={-35} r={2.5} fill="#521422" />
      <line x1={0} y1={0} x2={-2} y2={-44} stroke="#4A6043" strokeWidth={1.4} opacity={0.8} />
      <circle cx={-2} cy={-44} r={2.2} fill="#521422" />
    </g>
  );
}

/** Full floral corner composition */
function FloralCornerSVG() {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full drop-shadow-md"
    >
      <Defs />

      {/* Main Botanical Stems */}
      <path
        d="M 235,5 C 205,25 215,80 185,125 C 150,170 120,185 85,230"
        stroke="#4A6043"
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
        opacity={0.75}
      />
      <path
        d="M 205,50 C 185,45 170,32 155,20"
        stroke="#4A6043"
        strokeWidth={2.2}
        strokeLinecap="round"
        fill="none"
        opacity={0.65}
      />
      <path
        d="M 150,150 C 135,160 120,160 100,150"
        stroke="#4A6043"
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
        opacity={0.65}
      />

      {/* Leaves */}
      <g transform="translate(180, 32) rotate(-35)">
        <path
          d="M 0,0 C 12,-15 34,-18 42,-5 C 30,8 12,8 0,0 Z"
          fill="url(#leafGradConvite)"
          opacity={0.8}
        />
        <path d="M 0,0 C 15,-5 30,-5 42,-5" stroke="#2D3B28" strokeWidth={0.8} opacity={0.5} fill="none" />
      </g>
      <g transform="translate(165, 105) rotate(-65)">
        <path
          d="M 0,0 C 12,-14 32,-15 40,-3 C 28,10 12,8 0,0 Z"
          fill="url(#leafGradConvite)"
          opacity={0.8}
        />
      </g>
      <g transform="translate(130, 160) rotate(-55)">
        <path
          d="M 0,0 C 10,-12 28,-14 34,-3 C 24,8 10,6 0,0 Z"
          fill="url(#leafGradConvite)"
          opacity={0.75}
        />
      </g>

      {/* Lily flowers */}
      <LilyFlower cx={195} cy={90} scale={0.9} rotation={-15} />
      <LilyFlower cx={140} cy={175} scale={0.7} rotation={-40} />
    </svg>
  );
}

/* ── Public Component ── */

export default function FloralDecoration({
  position = "top-right",
  size = "md",
  zIndex = "z-0",
}: FloralDecorationProps) {
  const sizeClass = SIZE_CLASSES[size];
  const showTopRight = position === "top-right" || position === "both";
  const showTopLeft = position === "top-left";
  const showBottomLeft = position === "bottom-left" || position === "both";
  const showBottomRight = position === "bottom-right";

  return (
    <>
      {showTopRight && (
        <div
          className={`absolute top-0 right-0 ${zIndex} pointer-events-none select-none ${sizeClass}`}
          aria-hidden="true"
        >
          <FloralCornerSVG />
        </div>
      )}
      {showTopLeft && (
        <div
          className={`absolute top-0 left-0 ${zIndex} pointer-events-none select-none ${sizeClass}`}
          style={{ transform: "scaleX(-1)" }}
          aria-hidden="true"
        >
          <FloralCornerSVG />
        </div>
      )}
      {showBottomLeft && (
        <div
          className={`absolute bottom-0 left-0 ${zIndex} pointer-events-none select-none ${sizeClass}`}
          style={{ transform: "rotate(180deg)" }}
          aria-hidden="true"
        >
          <FloralCornerSVG />
        </div>
      )}
      {showBottomRight && (
        <div
          className={`absolute bottom-0 right-0 ${zIndex} pointer-events-none select-none ${sizeClass}`}
          style={{ transform: "rotate(180deg) scaleX(-1)" }}
          aria-hidden="true"
        >
          <FloralCornerSVG />
        </div>
      )}
    </>
  );
}

