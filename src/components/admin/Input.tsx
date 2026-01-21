import React, { useState } from "react"

interface FormInputProps {
  label: string
  value: string | number
  onChange: (value: string) => void
  type?: "text" | "number" | "email" | "password" | "url" | "tel"
  placeholder?: string
  required?: boolean
  disabled?: boolean
  helperText?: string
  min?: string
  max?: string
  step?: string
  variant?: "default" | "dark"
}

const formatPhoneNumber = (value: string): string => {
  const digits = value.replace(/\D/g, "")
  const limited = digits.slice(0, 10)

  if (limited.length <= 3) {
    return limited
  } else if (limited.length <= 6) {
    return `${limited.slice(0, 3)} ${limited.slice(3)}`
  } else if (limited.length <= 8) {
    return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`
  } else {
    return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6, 8)} ${limited.slice(8)}`
  }
}

export default function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  disabled = false,
  helperText,
  min,
  max,
  step,
  variant = "default"
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const id = `input-${label.replace(/\s/g, "-").toLowerCase()}`

  const isPassword = type === "password"

  const labelClasses = variant === "dark"
    ? "block text-sm font-medium mb-2 text-text-white"
    : "block text-sm font-medium text-text-secondary mb-2"

  const inputClasses = variant === "dark"
    ? `w-full px-4 py-3 border border-white/20 rounded-lg hover:border-white/30 focus:border-admin-primary outline-none disabled:opacity-50 disabled:cursor-not-allowed bg-[#393b57] text-text-white placeholder-text-muted [&:-webkit-autofill]:[-webkit-text-fill-color:#fefefe] [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_#393b57_inset] [&:-webkit-autofill:hover]:[box-shadow:0_0_0_1000px_#393b57_inset] [&:-webkit-autofill:focus]:[box-shadow:0_0_0_1000px_#393b57_inset] [&:-webkit-autofill:active]:[box-shadow:0_0_0_1000px_#393b57_inset] ${isPassword ? 'pr-12' : ''}`
    : `w-full px-4 py-2 border border-input-border rounded-lg hover:border-border-dark focus:border-input-focus outline-none disabled:bg-surface-hover disabled:cursor-not-allowed ${isPassword ? 'pr-12' : ''}`

  const helperClasses = variant === "dark"
    ? "text-xs mt-1.5 text-text-white-secondary"
    : "text-xs text-text-tertiary mt-1.5"

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "tel") {
      const formatted = formatPhoneNumber(e.target.value)
      onChange(formatted)
    } else {
      onChange(e.target.value)
    }
  }

  const getInputType = () => {
    if (type === "tel") return "text"
    if (isPassword) return showPassword ? "text" : "password"
    return type
  }

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className={labelClasses}
      >
        {label}
        {required && <span className="text-danger ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          type={getInputType()}
          id={id}
          value={value}
          onChange={handleChange}
          className={inputClasses}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/10 transition-colors cursor-pointer ${
              variant === "dark" ? "text-text-muted hover:text-text-white" : "text-text-tertiary hover:text-text-secondary"
            }`}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            )}
          </button>
        )}
      </div>
      {helperText && (
        <p className={helperClasses}>
          {helperText}
        </p>
      )}
    </div>
  )
}
