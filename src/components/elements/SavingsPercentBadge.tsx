'use client';

import { SAVINGS_TOOLTIP } from '@/libs/savings';

export default function SavingsPercentBadge({
  label,
  tooltipPlacement = 'left',
}: {
  label: string;
  tooltipPlacement?: 'left' | 'right' | 'top' | 'bottom';
}) {
  return (
    <p className="px-2 py-[3px] border text-[14px] border-[#CC0C39] gap-1 flex items-center justify-center text-[#E66605] h-[26px] w-auto min-w-[52px] rounded-[6px] whitespace-nowrap">
      {label}
      <span
        className={`tooltip tooltip-${tooltipPlacement} cursor-pointer flex items-center`}
        data-tip={SAVINGS_TOOLTIP}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          className="inline-block"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="12" fill="#E66605" />
          <text
            x="12"
            y="16"
            textAnchor="middle"
            fontSize="14"
            fill="#fff"
            fontFamily="Arial"
            fontWeight="bold"
          >
            i
          </text>
        </svg>
      </span>
    </p>
  );
}
