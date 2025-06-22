import { NextRequest } from 'next/server'

// Simple in-memory rate limiter
// For production, consider using Redis or a similar solution
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

interface RateLimitConfig {
  interval: number // Time window in milliseconds
  uniqueTokenPerInterval: number // Number of requests allowed per interval
}

export function rateLimit(config: RateLimitConfig) {
  return async function rateLimitMiddleware(req: NextRequest): Promise<boolean> {
    const ip = req.headers.get('x-real-ip') ?? 
               req.headers.get('x-forwarded-for')?.split(',')[0] ?? 
               'anonymous'
    const key = `${ip}:${req.nextUrl.pathname}`
    
    const now = Date.now()
    const record = rateLimitMap.get(key)
    
    if (!record || now > record.resetTime) {
      // Create new record or reset existing one
      rateLimitMap.set(key, {
        count: 1,
        resetTime: now + config.interval
      })
      return true
    }
    
    if (record.count >= config.uniqueTokenPerInterval) {
      return false
    }
    
    record.count++
    return true
  }
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}, 60000) // Clean up every minute