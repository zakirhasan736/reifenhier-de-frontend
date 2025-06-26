'use client';
import React, { useState } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  name: string;
  id: string;
  options: Array<Option | string>; // Allows both objects and strings
  required?: boolean;
  disabled?: boolean;
  status?: 'default' | 'error' | 'success' | 'focus';
  errorMessage?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  value?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  name,
  id,
  options,
  required = false,
  disabled = false,
  status = 'default',
  errorMessage,
  onChange,
  className = '',
  value,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Define border colors based on status and if the field is focused
  const getStatusBorderColor = () => {
    // 1. If the input is focused, return the focus color
    if (isFocused) {
      return '#0B0112'; // Focus color
    }

    // 2. If the input has a value (not just spaces), return the filled color
    if (typeof value === 'string' && value.trim() !== '') {
      return '#0B0112'; // Change border color to black if field is filled
    }

    // 3. Return color based on status
    switch (status) {
      case 'error':
        return '#D10C3B'; // Red for error
      case 'success':
        return '#1FC430'; // Green for success
      default:
        return '#C9C8CA'; // Default gray color
    }
  };

  // Handle focus and blur events
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className={`select-wrapper flex flex-col gap-2 ${className}`}>
      {label && (
        <label
          htmlFor={id || name}
          className="font-secondary text-body-form font-normal leading-[150%] text-mono-100"
        >
          {label}
        </label>
      )}
      <select
        name={name}
        id={id}
        required={required}
        disabled={disabled}
        value={value}
        onChange={onChange}
        className={`select-field h-10 py-[11px] px-[8px] bg-transparent text-body-caption font-normal leading-[150%] font-secondary text-mono-60 focus-visible:!rounded-none focus-within:!rounded-none focus:text-mono-100 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        style={{
          border: `1px solid ${getStatusBorderColor()}`,
          borderRadius: `0px`,
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        {options.map((option, index) => {
          // Check if the option is an object (with value and label keys)
          if (
            typeof option === 'object' &&
            'value' in option &&
            'label' in option
          ) {
            return (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            );
          }
          // If it's a string, just use the string value for both value and label
          return (
            <option key={index} value={option.toLowerCase()}>
              {option}
            </option>
          );
        })}
      </select>
      {status === 'error' && errorMessage && (
        <p className="error-message text-body-caption text-error">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default Select;
