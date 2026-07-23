"use client";

type Position = "top-right" | "bottom-left" | "both";
type Size = "sm" | "md" | "lg";

interface FloralDecorationProps {
  /** Position the florals at which corners */
  position?: Position;
  /** Relative size of the decoration */
  size?: Size;
}

const SIZE_MAP: Record<Size, number> = {
  sm: 120,
  md: 160,
  lg: 200,
};

/* ── SVG Sub-Components ── */

/** Gradients used in petals and leaves */
function Defs() {
  return (
    <defs>
      <linearGradient id="petalGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#E8A3B1" />
        <stop offset="100%" stopColor="#D86B81" />
      </linearGradient>
      <linearGradient id="petalInnerGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#D86B81" />
        <stop offset="100%" stopColor="#C75B72" />
      </linearGradient>
      <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#4A6043" />
        <stop offset="100%" stopColor="#5C7A52" />
      </linearGradient>
    </defs>
  );
}

/** A single stylized lily flower with 6 petals and stamens */
function LilyFlower({
  cx,
  cy,
  scale = 1,
}: {
  cx: number;
  cy: number;
  scale?: number;
}) {
  return (
    <g transform={`translate(${cx}, ${cy}) scale(${scale})`}>
      {/* Outer petals (3) — offset at base */}
      {[0, 120, 240].map((angle) => (
        <g key={`outer-${angle}`} transform={`rotate(${angle})`}>
          <path
            d="M 4,2 C -10,-15 -14,-42 0,-52 C 14,-42 10,-15 4,2 Z"
            fill="url(#petalGrad)"
            opacity={0.5}
          />
        </g>
      ))}
      {/* Inner petals (3) — longer, with dark-pink center stripe */}
      {[60, 180, 300].map((angle) => (
        <g key={`inner-${angle}`} transform={`rotate(${angle})`}>
          <path
            d="M 0,0 C -11,-18 -15,-48 0,-58 C 15,-48 11,-18 0,0 Z"
            fill="url(#petalInnerGrad)"
            opacity={0.55}
          />
          <path
            d="M 0,-10 C -5,-18 -7,-32 0,-40 C 7,-32 5,-18 0,-10 Z"
            fill="#8A2E43"
            opacity={0.25}
          />
        </g>
      ))}
      {/* Stamens */}
      <line x1={0} y1={0} x2={-8} y2={-28} stroke="#8A2E43" strokeWidth={0.8} opacity={0.4} />
      <circle cx={-8} cy={-28} r={2} fill="#E8A3B1" opacity={0.5} />
      <line x1={0} y1={0} x2={6} y2={-25} stroke="#8A2E43" strokeWidth={0.8} opacity={0.4} />
      <circle cx={6} cy={-25} r={2} fill="#E8A3B1" opacity={0.5} />
      <line x1={0} y1={0} x2={-2} y2={-32} stroke="#8A2E43" strokeWidth={0.8} opacity={0.4} />
      <circle cx={-2} cy={-32} r={1.8} fill="#E8A3B1" opacity={0.5} />
    </g>
  );
}

/** Full floral corner composition — a branch with leaves and two lily flowers */
function FloralCornerSVG() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <Defs />

      {/* ── Stems ── */}
      <path
        d="M 195,3 C 172,18 185,65 158,100 C 130,136 108,148 75,185"
        stroke="#4A6043"
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
        opacity={0.35}
      />
      <path
        d="M 176,42 C 162,38 150,28 140,18"
        stroke="#4A6043"
        strokeWidth={1.8}
        strokeLinecap="round"
        fill="none"
        opacity={0.3}
      />
      <path
        d="M 130,128 C 118,135 108,135 95,128"
        stroke="#4A6043"
        strokeWidth={1.5}
        strokeLinecap="round"
        fill="none"
        opacity={0.3}
      />

      {/* ── Leaves ── */}
      <g transform="translate(152, 28) rotate(-35)">
        <path
          d="M 0,0 C 10,-12 28,-14 35,-4 C 25,6 10,6 0,0 Z"
          fill="url(#leafGrad)"
          opacity={0.45}
        />
        <path
          d="M 0,0 C 12,-4 25,-4 35,-4"
          stroke="#3A5035"
          strokeWidth={0.6}
          fill="none"
          opacity={0.3}
        />
      </g>
      <g transform="translate(142, 88) rotate(-70)">
        <path
          d="M 0,0 C 10,-10 26,-12 32,-2 C 22,8 10,6 0,0 Z"
          fill="url(#leafGrad)"
          opacity={0.45}
        />
        <path
          d="M 0,0 C 12,-3 22,-3 32,-2"
          stroke="#3A5035"
          strokeWidth={0.6}
          fill="none"
          opacity={0.3}
        />
      </g>
      <g transform="translate(112, 132) rotate(-60)">
        <path
          d="M 0,0 C 8,-10 22,-12 28,-2 C 18,6 8,4 0,0 Z"
          fill="url(#leafGrad)"
          opacity={0.4}
        />
      </g>
      <g transform="translate(90, 163) rotate(-40)">
        <path
          d="M 0,0 C 7,-8 18,-10 23,-2 C 15,5 7,4 0,0 Z"
          fill="url(#leafGrad)"
          opacity={0.35}
        />
      </g>

      {/* ── Lily flowers ── */}
      <LilyFlower cx={160} cy={75} scale={1} />
      <LilyFlower cx={115} cy={145} scale={0.7} />
    </svg>
  );
}

/* ── Public Component ── */

export default function FloralDecoration({
  position = "both",
  size = "md",
}: FloralDecorationProps) {
  const px = SIZE_MAP[size];
  const showTopRight = position === "top-right" || position === "both";
  const showBottomLeft = position === "bottom-left" || position === "both";

  return (
    <>
      {showTopRight && (
        <div
          className="absolute top-0 right-0 z-[-1] pointer-events-none select-none max-sm:hidden"
          style={{ width: px, height: px }}
          aria-hidden="true"
        >
          <FloralCornerSVG />
        </div>
      )}
      {showBottomLeft && (
        <div
          className="absolute bottom-0 left-0 z-[-1] pointer-events-none select-none max-sm:hidden"
          style={{ width: px, height: px, transform: "rotate(180deg)" }}
          aria-hidden="true"
        >
          <FloralCornerSVG />
        </div>
      )}
    </>
  );
}
