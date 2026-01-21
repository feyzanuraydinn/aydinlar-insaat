import React from "react"

interface FormTextareaProps {
  label: string
  value: string
  onChange: (value: string) => void
  rows?: number
  placeholder?: string
  required?: boolean
  disabled?: boolean
  helperText?: string
}

export default function Textarea({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
  required = false,
  disabled = false,
  helperText
}: FormTextareaProps) {
  const id = `textarea-${label.replace(/\s/g, "-").toLowerCase()}`

  return (
    <div className="w-full">
      <label htmlFor={id} className="block mb-2.5 text-sm font-medium text-text-primary">
        {label}
        {required && <span className="ml-1 text-danger">*</span>}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="bg-surface border border-input-border text-text-primary text-sm rounded-lg hover:border-border-dark focus:border-input-focus outline-none block w-full p-3.5 shadow-xs placeholder:text-text-tertiary disabled:bg-surface-hover disabled:cursor-not-allowed"
        placeholder={placeholder}
        required={required}
        disabled={disabled}
      />
      {helperText && (
        <p className="text-xs text-text-tertiary mt-1.5">{helperText}</p>
      )}
    </div>
  )
}
