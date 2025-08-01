import React, { useState, useEffect, useRef } from 'react';
import { ArrowDownIcon } from '@/icons';
type Option = { name: string; count?: number };

type Props = {
  label: string;
  options: Option[];
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

const CustomSelect: React.FC<Props> = ({
  label,
  options,
  value,
  onChange,
  disabled,
  placeholder = 'Select',
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  const selected = options.find(o => o.name === value);

  return (
    <div className="relative max-w-[139px] lg:max-w-[170px] w-full" ref={ref}>
      <label className="text-[#86878A] md:text-[14px] text-[12px] font-normal font-secondary leading-[120%] mb-[7px] block">
        {label}
      </label>
      <button
        type="button"
        className={`input cursor-pointer !rounded-[4px] w-full flex items-center justify-between !bg-mono-0 !border-2 !border-solid !border-border-100 md:px-4 px-2 py-2 md:text-[14px] text-[12px] text-left font-normal font-secondary leading-[120%] !text-[#86878A] ${
          disabled ? 'opacity-60 pointer-events-none' : ''
        }`}
        onClick={() => setOpen(o => !o)}
        disabled={disabled}
      >
        <span>
          {selected
            ? `${selected.name}${selected.count ? ` (${selected.count})` : ''}`
            : placeholder}
        </span>
        <span
          className={`arrow absolute right-0 w-5 flex justify-center items-center h-full bg-mono-0 top-0 ${
            open ? 'open' : 'closed'
          }`}
        >
          <ArrowDownIcon />
        </span>
      </button>
      {open && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/2 focus:outline-none">
          <li
            className="cursor-pointer select-none px-3 py-2 text-[#86878A] hover:bg-primary-100 hover:text-white md:text-[14px] text-[12px] text-left font-normal font-secondary leading-[120%]"
            onClick={() => {
              onChange('');
              setOpen(false);
            }}
          >
            {placeholder}
          </li>
          {options.map((item, idx) => (
            <li
              key={idx}
              className={`cursor-pointer select-none px-3 py-2 hover:bg-primary-100 hover:text-white md:text-[14px] text-[12px] text-left font-normal font-secondary leading-[120%] ${
                value === item.name
                  ? 'bg-primary-100  text-[#86878A font-bold'
                  : ''
              }`}
              onClick={() => {
                onChange(item.name);
                setOpen(false);
              }}
            >
              {item.name}
              {item.count ? ` (${item.count})` : ''}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
