import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { v2 as cloudinary } from 'cloudinary'
import { checkRateLimit, getClientIP, RATE_LIMITS } from '@/lib/rate-limit'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
]

const MAX_FILE_SIZE = 10 * 1024 * 1024

export async function POST(req: NextRequest) {
  try {
    await requireAuth()

    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET) {
      console.error('Cloudinary environment variables missing:', {
        cloudName: !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        apiKey: !!process.env.CLOUDINARY_API_KEY,
        apiSecret: !!process.env.CLOUDINARY_API_SECRET,
      })
      return NextResponse.json(
        {
          error: 'Cloudinary configuration missing',
          message: 'Server is not properly configured for image uploads'
        },
        { status: 500 }
      )
    }

    const clientIP = getClientIP(req)
    const rateLimitKey = `upload:${clientIP}`
    const rateLimit = checkRateLimit(rateLimitKey, RATE_LIMITS.UPLOAD)

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: 'Too many upload requests',
          message: `Please try again in ${Math.ceil((rateLimit.retryAfter || 0) / 60)} minutes`,
          retryAfter: rateLimit.retryAfter
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfter),
            'X-RateLimit-Limit': String(RATE_LIMITS.UPLOAD.maxRequests),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rateLimit.resetTime),
          }
        }
      )
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'aydinlar-insaat'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: 'Invalid file type',
          message: `Allowed types: ${ALLOWED_FILE_TYPES.map(t => t.split('/')[1]).join(', ')}`,
          allowedTypes: ALLOWED_FILE_TYPES
        },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: 'File too large',
          message: `Maximum file size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
          maxSize: MAX_FILE_SIZE
        },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64}`

    const result = await cloudinary.uploader.upload(dataURI, {
      folder,
      resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      max_bytes: MAX_FILE_SIZE,
    })

    const response = NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    })

    response.headers.set('X-RateLimit-Limit', String(RATE_LIMITS.UPLOAD.maxRequests))
    response.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining))
    response.headers.set('X-RateLimit-Reset', String(rateLimit.resetTime))

    return response
  } catch (error) {
    console.error('Upload error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorDetails = {
      error: 'Failed to upload image',
      message: errorMessage,
      cloudinaryConfigured: !!(
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
      ),
    }

    return NextResponse.json(errorDetails, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAuth()

    const { publicId } = await req.json()

    if (!publicId) {
      return NextResponse.json(
        { error: 'No publicId provided' },
        { status: 400 }
      )
    }

    if (!publicId.startsWith('aydinlar-insaat/')) {
      return NextResponse.json(
        { error: 'Invalid publicId' },
        { status: 400 }
      )
    }

    await cloudinary.uploader.destroy(publicId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete image error:', error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}
