'use client';
import Image from 'next/image';
import React from 'react';

interface CheckboxProps {
  label?: string;
  name?: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  status?: 'default' | 'error' | 'success'; // Border color based on status
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  name,
  checked,
  onChange,
  status = 'default', // Default status
  disabled = false,
}) => {
  // Define border colors based on the status
  const getStatusBorderColor = () => {
    switch (status) {
      case 'error':
        return '#D10C3B'; // Red for error
      case 'success':
        return '#1FC430'; // Green for success
      default:
        return '#611192'; // Gray for default
    }
  };

  return (
    <div className="checkbox-wrapper">
      <label
        htmlFor={name}
        className={`checkbox-label flex relative items-center ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`checkbox-input w-4 h-4 rounded-[4px] !focus:rounded-[4px] !focus-within:rounded-[4px] !focus-visible:rounded-[4px] !outline-none !shadow-none inline-block relative ${disabled ? 'not-allowed' : 'cursor-pointer'} bg-[${checked ? getStatusBorderColor() : 'transparent'}]`}
          style={{
            appearance: 'none',
            border: `1px solid ${getStatusBorderColor()}`,
          }}
        />
        {checked && (
          <div className="absolute !rounded-[4px] top-0 left-0 w-4 h-4 bg-primary-color-100">
            <Image
              src="/images/check-mark.svg"
              alt="checkmark icon"
              width={16}
              height={16}
            />
          </div>
        )}
        {label && (
          <span className="text-body-caption font-normal font-secondary text-left leading-[150%] text-mono-100 ml-2">
            {label}
          </span>
        )}
      </label>
    </div>
  );
};

export default Checkbox;
