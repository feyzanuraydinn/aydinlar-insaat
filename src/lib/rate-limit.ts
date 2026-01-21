interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

setInterval(() => {
  const now = Date.now()
  Array.from(rateLimitStore.entries()).forEach(([key, entry]) => {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key)
    }
  })
}, 60000)

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
  retryAfter?: number
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now()
  const key = identifier

  let entry = rateLimitStore.get(key)

  if (!entry || entry.resetTime < now) {
    entry = {
      count: 1,
      resetTime: now + config.windowMs,
    }
    rateLimitStore.set(key, entry)

    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetTime: entry.resetTime,
    }
  }

  entry.count++

  if (entry.count > config.maxRequests) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000)
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter,
    }
  }

  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  }
}

export function getClientIP(request: Request): string {
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  if (cfConnectingIP) return cfConnectingIP

  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    const ips = forwardedFor.split(',')
    return ips[0].trim()
  }

  const realIP = request.headers.get('x-real-ip')
  if (realIP) return realIP

  return 'unknown'
}

export const RATE_LIMITS = {
  LOGIN: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
  },
  UPLOAD: {
    maxRequests: 100,
    windowMs: 60 * 60 * 1000,
  },
  API: {
    maxRequests: 100,
    windowMs: 60 * 1000,
  },
  STRICT: {
    maxRequests: 3,
    windowMs: 5 * 60 * 1000,
  },
}
