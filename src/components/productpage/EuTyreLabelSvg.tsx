import type { EuGradeAE, EuLabelData, EuNoiseClass } from '@/utils/euTyreLabel'

const FUEL_COLORS: Record<EuGradeAE, string> = {
  A: '#009640',
  B: '#52B153',
  C: '#C8D400',
  D: '#FFCC00',
  E: '#E30613',
}

const WET_COLORS: Record<EuGradeAE, string> = {
  A: '#0054A6',
  B: '#0077C8',
  C: '#4DA6D8',
  D: '#8FCBE8',
  E: '#C5E4F5',
}

const GRADES: EuGradeAE[] = ['A', 'B', 'C', 'D', 'E']

function FuelPumpIcon({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} fill="none" stroke="#111" strokeWidth="1.6">
      <rect x="1" y="8" width="14" height="16" rx="1.2" />
      <path d="M4 8 V5 h8 v3" />
      <circle cx="8" cy="16" r="3.2" />
      <path d="M15 12 h3.5 a2 2 0 0 1 2 2 v7" />
      <circle cx="20.5" cy="21.5" r="1.3" fill="#111" stroke="none" />
    </g>
  )
}

function WetCloudIcon({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} fill="none" stroke="#111" strokeWidth="1.6">
      <circle cx="10" cy="18" r="7" />
      <path d="M18 14.5 a5 5 0 0 0-9.2-2.4" />
      <path d="M7 28 l1.4 3.2 M12 28 l1.4 3.2 M17 28 l1.4 3.2" strokeLinecap="round" />
    </g>
  )
}

function NoiseIcon({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} fill="none" stroke="#111" strokeWidth="1.5">
      <circle cx="12" cy="16" r="8" />
      <path d="M24 10 l10 5 v10 l-10 5 z" />
      <path d="M37 12 c4 4 4 12 0 16 M41 9 c7 6 7 18 0 24" />
    </g>
  )
}

function ScaleArrows({
  x,
  y,
  colors,
  selected,
  pointerSide,
}: {
  x: number
  y: number
  colors: Record<EuGradeAE, string>
  selected: EuGradeAE | null
  pointerSide: 'left' | 'right'
}) {
  const rowH = 22
  const baseW = 40
  return (
    <g transform={`translate(${x} ${y})`}>
      {GRADES.map((grade, i) => {
        const w = baseW + i * 6
        const yy = i * rowH
        const active = selected === grade
        const pointerW = 38
        return (
          <g key={grade}>
              <polygon
                points={`0,${yy + 2} ${w - 8},${yy + 2} ${w},${yy + 11} ${w - 8},${yy + 20} 0,${yy + 20}`}
                fill={colors[grade]}
              />
              <text
                x="7"
                y={yy + 15}
                fill="#fff"
                fontSize="11"
                fontWeight="700"
                fontFamily="Arial, Helvetica, sans-serif"
              >
                {grade}
              </text>
              {active && (
                <g>
                  <polygon
                    points={
                      pointerSide === 'right'
                        ? `${w + 6},${yy + 2} ${w + pointerW},${yy + 2} ${w + pointerW + 9},${yy + 11} ${w + pointerW},${yy + 20} ${w + 6},${yy + 20}`
                        : `${w + pointerW + 9},${yy + 2} ${w + 16},${yy + 2} ${w + 6},${yy + 11} ${w + 16},${yy + 20} ${w + pointerW + 9},${yy + 20}`
                    }
                    fill="#111"
                  />
                  <text
                    x={w + 24}
                    y={yy + 15.5}
                    fill="#fff"
                    fontSize="12"
                    fontWeight="800"
                    textAnchor="middle"
                    fontFamily="Arial, Helvetica, sans-serif"
                  >
                    {grade}
                  </text>
                </g>
              )}
            </g>
          )
      })}
    </g>
  )
}

export default function EuTyreLabelSvg({
  data,
}: {
  data: EuLabelData
}) {
  const qrSrc = data.qrUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=88x88&margin=0&data=${encodeURIComponent(data.qrUrl)}`
    : ''
  const noiseLetters: EuNoiseClass[] = ['A', 'B', 'C']

  return (
    <svg
      viewBox="0 0 240 430"
      role="img"
      aria-label={`EU-Reifenlabel ${data.brand} ${data.size}, Kraftstoff ${data.fuel || 'k. A.'}, Nasshaftung ${data.wet || 'k. A.'}, Geräusch ${data.noiseDb ? `${data.noiseDb} dB` : 'k. A.'}`}
      className="w-full max-w-[240px] h-auto bg-white"
    >
      <rect x="0.75" y="0.75" width="238.5" height="428.5" rx="2" fill="#fff" stroke="#111" strokeWidth="1.5" />

      {/* EU flag */}
      <rect x="10" y="10" width="36" height="24" fill="#003399" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2
        const cx = 28 + Math.cos(a) * 7.2
        const cy = 22 + Math.sin(a) * 7.2
        return <circle key={i} cx={cx} cy={cy} r="1.15" fill="#FFCC00" />
      })}

      <text
        x="54"
        y="29"
        fill="#003399"
        fontSize="20"
        fontWeight="800"
        letterSpacing="0.5"
        fontFamily="Arial, Helvetica, sans-serif"
      >
        ENERG
      </text>
      <path d="M132 12 l8 10 h-6 l5 10 -10 -11 h6 z" fill="#003399" />

      {qrSrc ? (
        <image href={qrSrc} xlinkHref={qrSrc} x="176" y="8" width="54" height="54" />
      ) : (
        <rect x="176" y="8" width="54" height="54" fill="#f2f2f2" stroke="#ccc" />
      )}

      <text
        x="12"
        y="78"
        fontSize="13"
        fontWeight="800"
        fill="#111"
        fontFamily="Arial, Helvetica, sans-serif"
      >
        {data.brand.slice(0, 18)}
      </text>
      <text
        x="228"
        y="78"
        fontSize="12"
        fontWeight="600"
        fill="#111"
        textAnchor="end"
        fontFamily="Arial, Helvetica, sans-serif"
      >
        {data.identifier.slice(0, 16)}
      </text>
      <text
        x="12"
        y="96"
        fontSize="11"
        fill="#111"
        fontFamily="Arial, Helvetica, sans-serif"
      >
        {data.size.slice(0, 26)}
      </text>
      <text
        x="228"
        y="96"
        fontSize="12"
        fontWeight="700"
        fill="#111"
        textAnchor="end"
        fontFamily="Arial, Helvetica, sans-serif"
      >
        {data.tyreClass}
      </text>

      <line x1="10" y1="106" x2="230" y2="106" stroke="#d0d0d0" />

      <FuelPumpIcon x={18} y={118} />
      <ScaleArrows
        x={14}
        y={158}
        colors={FUEL_COLORS}
        selected={data.fuel}
        pointerSide="left"
      />

      <line x1="120" y1="118" x2="120" y2="288" stroke="#d0d0d0" />

      <WetCloudIcon x={138} y={118} />
      <ScaleArrows
        x={128}
        y={158}
        colors={WET_COLORS}
        selected={data.wet}
        pointerSide="right"
      />

      <line x1="10" y1="298" x2="230" y2="298" stroke="#d0d0d0" />

      <NoiseIcon x={16} y={312} />
      <rect x="78" y="328" width="72" height="28" rx="2" fill="#fff" stroke="#111" />
      <text
        x="114"
        y="347"
        textAnchor="middle"
        fontSize="16"
        fontWeight="800"
        fill="#111"
        fontFamily="Arial, Helvetica, sans-serif"
      >
        {data.noiseDb ? `${data.noiseDb} dB` : '— dB'}
      </text>
      <text
        x="78"
        y="378"
        fontSize="18"
        fontFamily="Arial, Helvetica, sans-serif"
      >
        {noiseLetters.map((letter, i) => (
          <tspan
            key={letter}
            x={78 + i * 18}
            fontWeight={data.noiseClass === letter ? 800 : 400}
            fill={data.noiseClass === letter ? '#111' : '#9aa0a6'}
          >
            {letter}
          </tspan>
        ))}
      </text>

      {data.snow && (
        <text x="170" y="348" fontSize="18">
          ❄
        </text>
      )}

      <text
        x="228"
        y="418"
        textAnchor="end"
        fontSize="9"
        fill="#555"
        transform="rotate(-90 228 418)"
        fontFamily="Arial, Helvetica, sans-serif"
      >
        2020/740
      </text>
    </svg>
  )
}
