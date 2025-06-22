// Input validation utilities

export function validateURL(url: string): { valid: boolean; error?: string } {
  try {
    const urlObj = new URL(url)
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { valid: false, error: 'Only HTTP and HTTPS URLs are allowed' }
    }
    
    // Prevent localhost and internal IPs
    const hostname = urlObj.hostname.toLowerCase()
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('172.')
    ) {
      return { valid: false, error: 'Internal URLs are not allowed' }
    }
    
    return { valid: true }
  } catch {
    return { valid: false, error: 'Invalid URL format' }
  }
}

export function validateTextLength(
  text: string,
  fieldName: string,
  maxLength: number
): { valid: boolean; error?: string } {
  if (!text) {
    return { valid: false, error: `${fieldName} is required` }
  }
  
  if (text.length > maxLength) {
    return { valid: false, error: `${fieldName} must be less than ${maxLength} characters` }
  }
  
  return { valid: true }
}

export function validateEmail(email: string): { valid: boolean; error?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' }
  }
  
  return { valid: true }
}

export function sanitizeInput(input: string): string {
  // Remove any potential script tags or HTML
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim()
}

// Validation limits
export const VALIDATION_LIMITS = {
  TITLE_MAX: 200,
  DESCRIPTION_MAX: 500,
  CONTENT_MAX: 50000,
  BIO_MAX: 1000,
  STEP_DESCRIPTION_MAX: 2000,
  CODE_SNIPPET_MAX: 5000,
  TIPS_MAX: 1000,
} as const