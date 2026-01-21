import React from 'react';

interface ToggleProps {
  enabled: boolean;
  onChange: () => void;
  disabled?: boolean;
  label?: string;
  labelPosition?: 'left' | 'right';
}

export default function Toggle({
  enabled,
  onChange,
  disabled = false,
  label,
  labelPosition = 'right',
}: ToggleProps) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      {labelPosition === 'left' && label && (
        <span className={`select-none me-3 text-sm font-medium ${disabled ? 'text-text-muted' : 'text-text-secondary'}`}>
          {label}
        </span>
      )}

      <input
        type="checkbox"
        checked={enabled}
        onChange={onChange}
        disabled={disabled}
        className="sr-only peer"
      />

      <div
        style={{
          backgroundColor: disabled ? '#d1d5db' : enabled ? '#10b981' : '#ef4444'
        }}
        className={`relative w-9 h-5 rounded-full peer transition-colors ${
          disabled ? 'cursor-not-allowed' : 'cursor-pointer'
        }
        after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-surface after:rounded-full after:h-4 after:w-4 after:transition-all after:shadow-md ${
          enabled ? 'after:translate-x-4' : ''
        }`}
      />

      {labelPosition === 'right' && label && (
        <span className={`select-none ms-3 text-sm font-medium ${disabled ? 'text-text-muted' : 'text-text-secondary'}`}>
          {label}
        </span>
      )}
    </label>
  );
}
