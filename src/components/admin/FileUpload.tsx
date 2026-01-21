"use client"

import React, { useState, useRef, useEffect, useId } from "react"
import { PhotoIcon, TrashIcon } from "@heroicons/react/24/outline"
import ConfirmDialog from "./ConfirmModal"

interface FileUploadProps {
  label?: string
  value?: string // Current image URL
  onChange?: (file: File) => void
  onMultipleChange?: (files: FileList | null) => void
  onRemove?: () => void // Callback when image is removed
  accept?: string
  required?: boolean
  disabled?: boolean
  helperText?: string
  preview?: boolean
  multiple?: boolean
  confirmDelete?: boolean // Show confirmation modal before delete
}

export default function FileUpload({
  label,
  value,
  onChange,
  onMultipleChange,
  onRemove,
  accept = "image/*",
  required = false,
  disabled = false,
  helperText,
  preview = true,
  multiple = false,
  confirmDelete = false
}: FileUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(value || "")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const reactId = useId()
  const inputId = label ? `file-upload-${label.replace(/\s/g, "-")}` : `file-upload-${reactId}`

  useEffect(() => {
    setPreviewUrl(value || "")
  }, [value])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (multiple && onMultipleChange) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']
      const validFiles = Array.from(files).filter(file => {
        if (!allowedTypes.includes(file.type)) {
          return false
        }
        return true
      })

      if (validFiles.length !== files.length) {
        alert('Sadece PNG, JPG ve JPEG formatlarına izin verilmektedir.')
      }

      if (validFiles.length > 0) {
        const dataTransfer = new DataTransfer()
        validFiles.forEach(file => dataTransfer.items.add(file))
        onMultipleChange(dataTransfer.files)
      }
      return
    }

    const file = files[0]
    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']
      if (!allowedTypes.includes(file.type)) {
        alert('Sadece PNG, JPG ve JPEG formatlarına izin verilmektedir.')
        e.target.value = '' // Clear the input
        return
      }

      if (preview) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string)
        }
        reader.readAsDataURL(file)
      }

      if (onChange) {
        onChange(file)
      }
    }
  }

  const handleDeleteClick = () => {
    if (confirmDelete) {
      setShowDeleteModal(true)
    } else {
      handleRemove()
    }
  }

  const handleRemove = () => {
    setPreviewUrl("")
    if (inputRef.current) {
      inputRef.current.value = ""
    }
    if (onRemove) {
      onRemove()
    }
    setShowDeleteModal(false)
  }

  const handleButtonClick = () => {
    inputRef.current?.click()
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-2">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}

      {preview && previewUrl && !multiple && (
        <div className="relative mb-3 inline-block">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-input-border"
          />
          <button
            type="button"
            onClick={handleDeleteClick}
            className="absolute top-2 right-2 p-1.5 bg-danger rounded-lg hover:bg-danger-hover transition-colors cursor-pointer"
            title="Görseli Sil"
          >
            <TrashIcon className="w-5 h-5 text-[#fefefe]" />
          </button>
        </div>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          type="file"
          accept=".png,.jpg,.jpeg,image/png,image/jpeg"
          onChange={handleFileChange}
          className="hidden"
          id={inputId}
          required={required && !previewUrl}
          disabled={disabled}
          multiple={multiple}
        />
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={disabled}
          className={`flex items-center justify-center gap-2 px-4 py-3 w-full border-2 border-dashed border-input-border rounded-lg cursor-pointer hover:border-primary hover:bg-primary-bg transition-all ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <PhotoIcon className="w-6 h-6 text-text-muted" />
          <span className="text-sm text-text-secondary">
            {multiple
              ? "Görselleri Seç"
              : previewUrl
                ? "Görseli Değiştir"
                : "Görsel Seç"
            }
          </span>
        </button>
      </div>

      {helperText && (
        <p className="text-xs text-text-tertiary mt-1.5">{helperText}</p>
      )}

      <ConfirmDialog
        isOpen={showDeleteModal}
        title="Görseli Sil"
        message="Bu görseli silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        confirmText="Sil"
        onConfirm={handleRemove}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  )
}
