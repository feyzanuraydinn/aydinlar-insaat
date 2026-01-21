import { z } from 'zod'

// ==================== AUTH ====================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email gerekli')
    .email('Geçerli bir email adresi girin'),
  password: z
    .string()
    .min(1, 'Şifre gerekli')
    .min(6, 'Şifre en az 6 karakter olmalı'),
})

// ==================== PROJECTS ====================

export const createProjectSchema = z.object({
  title: z
    .string()
    .min(1, 'Başlık gerekli')
    .max(255, 'Başlık en fazla 255 karakter olabilir'),
  slug: z
    .string()
    .min(1, 'Slug gerekli')
    .max(255, 'Slug en fazla 255 karakter olabilir')
    .regex(/^[a-z0-9-]+$/, 'Slug sadece küçük harf, rakam ve tire içerebilir'),
  description: z
    .string()
    .max(5000, 'Açıklama en fazla 5000 karakter olabilir')
    .optional()
    .nullable(),
  type: z.enum(['RESIDENTIAL', 'COMMERCIAL'], {
    message: 'Geçersiz proje tipi',
  }),
  status: z
    .enum(['COMPLETED', 'ONGOING', 'PLANNED'], {
      message: 'Geçersiz durum',
    })
    .optional()
    .nullable(),
  location: z
    .string()
    .max(255, 'Konum en fazla 255 karakter olabilir')
    .optional()
    .nullable(),
  latitude: z
    .number()
    .min(-90, 'Geçersiz enlem')
    .max(90, 'Geçersiz enlem')
    .optional()
    .nullable(),
  longitude: z
    .number()
    .min(-180, 'Geçersiz boylam')
    .max(180, 'Geçersiz boylam')
    .optional()
    .nullable(),
  year: z
    .number()
    .int()
    .min(1900, 'Geçersiz yıl')
    .max(2100, 'Geçersiz yıl')
    .optional()
    .nullable(),
  featured: z.boolean().optional().default(false),
})

export const updateProjectSchema = createProjectSchema.partial()

// ==================== PROPERTIES ====================

export const createPropertySchema = z.object({
  title: z
    .string()
    .min(1, 'Başlık gerekli')
    .max(255, 'Başlık en fazla 255 karakter olabilir'),
  slug: z
    .string()
    .min(1, 'Slug gerekli')
    .max(255, 'Slug en fazla 255 karakter olabilir')
    .regex(/^[a-z0-9-]+$/, 'Slug sadece küçük harf, rakam ve tire içerebilir'),
  description: z
    .string()
    .max(5000, 'Açıklama en fazla 5000 karakter olabilir')
    .optional()
    .nullable(),
  type: z.enum(['RESIDENTIAL', 'COMMERCIAL', 'LAND'], {
    message: 'Geçersiz gayrimenkul tipi',
  }),
  location: z
    .string()
    .max(255, 'Konum en fazla 255 karakter olabilir')
    .optional()
    .nullable(),
  latitude: z
    .number()
    .min(-90, 'Geçersiz enlem')
    .max(90, 'Geçersiz enlem')
    .optional()
    .nullable(),
  longitude: z
    .number()
    .min(-180, 'Geçersiz boylam')
    .max(180, 'Geçersiz boylam')
    .optional()
    .nullable(),
  featured: z.boolean().optional().default(false),
})

export const updatePropertySchema = createPropertySchema.partial()

// ==================== HERO CARDS ====================

export const createHeroCardSchema = z.object({
  image: z
    .string()
    .min(1, 'Görsel URL gerekli')
    .url('Geçerli bir URL girin'),
  title: z
    .string()
    .min(1, 'Başlık gerekli')
    .max(100, 'Başlık en fazla 100 karakter olabilir'),
  description: z
    .string()
    .min(1, 'Açıklama gerekli')
    .max(255, 'Açıklama en fazla 255 karakter olabilir'),
  order: z
    .number()
    .int()
    .min(0, 'Sıra 0 veya daha büyük olmalı'),
})

export const updateHeroCardSchema = createHeroCardSchema.partial()

// ==================== TEAM MEMBERS ====================

export const createTeamMemberSchema = z.object({
  name: z
    .string()
    .min(1, 'İsim gerekli')
    .max(100, 'İsim en fazla 100 karakter olabilir'),
  profession: z
    .string()
    .min(1, 'Meslek gerekli')
    .max(100, 'Meslek en fazla 100 karakter olabilir'),
  phone: z
    .string()
    .max(20, 'Telefon en fazla 20 karakter olabilir')
    .optional()
    .nullable(),
  email: z
    .string()
    .email('Geçerli bir email adresi girin')
    .optional()
    .nullable(),
  websiteUrl: z
    .string()
    .url('Geçerli bir URL girin')
    .optional()
    .nullable(),
  image: z
    .string()
    .url('Geçerli bir görsel URL girin')
    .optional()
    .nullable(),
  order: z
    .number()
    .int()
    .min(0, 'Sıra 0 veya daha büyük olmalı')
    .optional()
    .default(0),
})

export const updateTeamMemberSchema = createTeamMemberSchema.partial()

// ==================== SETTINGS ====================

export const updateSettingsSchema = z.object({
  // Contact Info
  companyName: z.string().max(255).optional().nullable(),
  phone: z.string().max(50).optional().nullable(),
  email: z.string().email().optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  workingHours: z.string().max(255).optional().nullable(),

  // Social Media
  facebook: z.string().url().optional().nullable(),
  twitter: z.string().url().optional().nullable(),
  instagram: z.string().url().optional().nullable(),
  linkedin: z.string().url().optional().nullable(),
  youtube: z.string().url().optional().nullable(),

  // Home Page
  heroTitle: z.string().max(255).optional().nullable(),
  heroSubtitle: z.string().max(255).optional().nullable(),
  heroDefinition: z.string().max(1000).optional().nullable(),
  startYear: z.number().int().min(1900).max(2100).optional().nullable(),
  completedProjects: z.number().int().min(0).optional().nullable(),
  happyCustomers: z.number().int().min(0).optional().nullable(),

  // About Page
  aboutTitle: z.string().max(255).optional().nullable(),
  aboutSubtitle: z.string().max(255).optional().nullable(),
  aboutDefinition: z.string().max(5000).optional().nullable(),
  aboutImage: z.string().url().optional().nullable(),
  vision: z.string().max(2000).optional().nullable(),
  mission: z.string().max(2000).optional().nullable(),
})

// ==================== UTILITY ====================

/**
 * Validate data against a schema
 * Returns { success: true, data } or { success: false, errors }
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError['issues'] } {
  const result = schema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  return { success: false, errors: result.error.issues }
}

/**
 * Format Zod errors for API response
 */
export function formatZodErrors(errors: z.ZodError['issues']): Record<string, string> {
  const formatted: Record<string, string> = {}

  for (const error of errors) {
    const path = error.path.join('.')
    formatted[path] = error.message
  }

  return formatted
}

// Type exports
export type LoginInput = z.infer<typeof loginSchema>
export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
export type CreatePropertyInput = z.infer<typeof createPropertySchema>
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>
export type CreateHeroCardInput = z.infer<typeof createHeroCardSchema>
export type UpdateHeroCardInput = z.infer<typeof updateHeroCardSchema>
export type CreateTeamMemberInput = z.infer<typeof createTeamMemberSchema>
export type UpdateTeamMemberInput = z.infer<typeof updateTeamMemberSchema>
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>
