'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface SingleSelectBoxProps {
  label: string;
  options: Array<{ name: string }>;
  selected: string | number;
  onChange: (value: string) => void;
}

export default function SingleSelectBox({
  label,
  options,
  selected,
  onChange,
}: SingleSelectBoxProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-1.5 mb-0">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
        {label}
      </label>

      <div className="relative">
        {/* Trigger */}
        <div
          onClick={() => setOpen(o => !o)}
          className="w-full text-sm font-medium border border-gray-200 rounded-lg
                     pl-3 pr-1 bg-white cursor-pointer shadow-sm
                     flex items-center justify-between hover:border-blue-400 transition"
        >
          <span className="text-gray-700 py-2">
            {Array.isArray(selected) && selected.length > 0
              ? selected.join(', ')
              : 'Alle'}
          </span>

          <span className="border-l border-gray-300 h-8 pl-[3px] flex items-center">
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${
                open ? 'rotate-180' : ''
              }`}
            />
          </span>
        </div>

        {/* Dropdown */}
        {open && (
          <div
            className="absolute z-30 mt-2 w-full bg-white rounded-lg
                          border border-gray-200 shadow-lg max-h-56
                          overflow-y-auto py-2"
          >
            {options.map(item => {
              const val = String(item.name);

              return (
                <div
                  key={val}
                  onClick={() => {
                    onChange(val);
                    setOpen(false);
                  }}
                  className={`px-3 py-2 text-sm cursor-pointer border-b border-b-gray-200
                              hover:bg-gray-200
                              ${
                                selected === val
                                  ? 'bg-gray-100 font-semibold'
                                  : ''
                              }`}
                >
                  {val}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
