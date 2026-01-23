'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface SortOption {
  value: string;
  label: string;
}

interface SortDropdownProps {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
  variant?: 'default' | 'admin';
  className?: string;
}

const SortDropdown: React.FC<SortDropdownProps> = ({
  options,
  value,
  onChange,
  variant = 'default',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const baseButtonStyles = variant === 'admin'
    ? 'px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary hover:border-admin-primary focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent'
    : 'px-4 py-2.5 text-sm border border-border rounded-full bg-surface text-text-secondary hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary';

  const baseMenuStyles = variant === 'admin'
    ? 'absolute right-0 mt-1 w-full min-w-[160px] bg-surface border border-border rounded-lg shadow-lg z-50 overflow-hidden'
    : 'absolute right-0 mt-2 w-full min-w-[180px] bg-surface border border-border rounded-xl shadow-xl z-50 overflow-hidden';

  const baseOptionStyles = variant === 'admin'
    ? 'px-3 py-2 text-sm cursor-pointer transition-colors'
    : 'px-4 py-2.5 text-sm cursor-pointer transition-colors';

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${baseButtonStyles} flex items-center gap-2 cursor-pointer transition-all duration-200`}
      >
        <svg
          className={`w-4 h-4 ${variant === 'admin' ? 'text-text-tertiary' : 'text-text-muted'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
        </svg>
        <span className="font-medium">{selectedOption?.label}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${variant === 'admin' ? 'text-text-tertiary' : 'text-text-muted'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className={`${baseMenuStyles} animate-in fade-in slide-in-from-top-2 duration-200`}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`${baseOptionStyles} w-full text-left flex items-center justify-between ${
                option.value === value
                  ? variant === 'admin'
                    ? 'bg-admin-primary/10 text-admin-primary font-medium'
                    : 'bg-primary/10 text-primary font-medium'
                  : 'text-text-secondary hover:bg-surface-hover'
              }`}
            >
              <span>{option.label}</span>
              {option.value === value && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
