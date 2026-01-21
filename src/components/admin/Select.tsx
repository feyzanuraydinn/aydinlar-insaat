"use client"

import { useState, useRef, useEffect } from "react"

interface FormSelectOption {
  value: string | number
  label: string
}

interface FormSelectProps {
  label?: string
  value: string | number
  onChange: (value: string | number) => void
  options: FormSelectOption[]
  placeholder?: string
  required?: boolean
  disabled?: boolean
  helperText?: string
}

export default function Select({
  label,
  value,
  onChange,
  options,
  placeholder = "Seçiniz",
  required = false,
  disabled = false,
  helperText
}: FormSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(opt => opt.value === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Standalone mode (no label)
  if (!label) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full px-3 py-1.5 text-sm font-medium cursor-pointer rounded border transition-colors flex items-center justify-between ${
            disabled
              ? "bg-surface-hover text-text-muted cursor-not-allowed border-border"
              : "bg-surface text-text-secondary border-input-border hover:border-border-dark cursor-pointer"
          }`}
        >
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 overflow-auto border border-input-border rounded shadow-lg bg-surface max-h-60">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={`w-full px-3 py-2 text-sm text-left hover:bg-primary-bg-hover transition-colors cursor-pointer ${
                  option.value === value ? "bg-primary-bg text-primary font-medium" : "text-text-secondary bg-surface"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Form mode (with label)
  const id = `select-${label.replace(/\s/g, "-").toLowerCase()}`

  return (
    <div className="w-full">
      <label htmlFor={id} className="block mb-2.5 text-sm font-medium text-text-primary">
        {label}
        {required && <span className="ml-1 text-danger">*</span>}
      </label>

      <div className="relative" ref={dropdownRef}>
        <button
          id={id}
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full px-3 py-2.5 text-sm rounded-lg border transition-colors flex items-center justify-between ${
            disabled
              ? "bg-surface-hover text-text-muted cursor-not-allowed border-border"
              : "bg-surface text-text-primary border-input-border hover:border-border-dark focus:ring-primary focus:border-input-focus cursor-pointer"
          }`}
        >
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-10 w-full mt-1 overflow-auto border border-input-border rounded-lg shadow-lg bg-surface max-h-60">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={`w-full px-3 py-2 text-sm text-left hover:bg-primary-bg-hover transition-colors cursor-pointer first:rounded-t-lg last:rounded-b-lg ${
                  option.value === value ? "bg-primary-bg text-primary font-medium" : "text-text-secondary bg-surface"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {helperText && (
        <p className="text-xs text-text-tertiary mt-1.5">{helperText}</p>
      )}
    </div>
  )
}
