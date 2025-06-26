'use client';
import React, { useState } from 'react';

interface TextareaProps {
  label?: string;
  name: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  cols?: number;
  status?: 'default' | 'error' | 'success'; // Added focus status
  disabled?: boolean;
  maxLength?: number;
  className?: string;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  name,
  value = ' ',
  onChange,
  placeholder = 'Enter text...',
  rows = 4,
  cols = 50,
  status = 'default',
  disabled = false,
  className = '',
  maxLength,
}) => {
  const [isFocused, setIsFocused] = useState(false);

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
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className={`textarea-wrapper  ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block font-secondary  text-body-form font-normal leading-[150%] text-mono-100 mb-2"
        >
          {label}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        cols={cols}
        maxLength={maxLength}
        disabled={disabled}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`textarea-field  ${status} py-[11px] px-[8px] w-full text-body-caption font=normal leading-[150%] font-secondary text-mono-60 focus:text-mono-100 visited:text-mono-100 focus-visible:text-mono-100 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        style={{
          border: `1px solid ${getStatusBorderColor()}`,
          resize: 'vertical',
          backgroundColor: disabled ? '#f5f5f5' : 'white',
          color: disabled ? '#a0a0a0' : '#000',
        }}
      />
    </div>
  );
};

export default Textarea;
