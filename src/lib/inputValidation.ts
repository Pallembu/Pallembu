import { z } from 'zod';
import validator from 'validator';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Create DOMPurify instance for server-side sanitization
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window as any);

// Input sanitization functions
export function sanitizeString(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  // Remove null bytes and control characters
  let sanitized = input.replace(/[\x00-\x1F\x7F]/g, '');
  
  // HTML sanitization
  sanitized = DOMPurify.sanitize(sanitized, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true 
  });
  
  // Remove any remaining HTML entities
  sanitized = validator.unescape(sanitized);
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  return sanitized;
}

export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return '';
  
  let sanitized = email.toLowerCase().trim();
  
  // Remove dangerous characters but keep email format
  sanitized = sanitized.replace(/[<>"\\']/g, '');
  
  return sanitized;
}

export function sanitizePhone(phone: string): string {
  if (!phone || typeof phone !== 'string') return '';
  
  // Keep only numbers, spaces, parentheses, plus, and hyphens
  return phone.replace(/[^0-9\s\-\(\)\+]/g, '').trim();
}

// Enhanced validation schemas with sanitization
export const contactFormSchema = z.object({
  name: z.string()
    .transform(sanitizeString)
    .pipe(
      z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters')
        .regex(/^[a-zA-Z\s\u00C0-\u017F]+$/, 'Name can only contain letters and spaces')
    ),
    
  email: z.string()
    .transform(sanitizeEmail)
    .pipe(
      z.string()
        .email('Please enter a valid email address')
        .min(5, 'Email must be at least 5 characters')
        .max(100, 'Email must be less than 100 characters')
        .refine(val => validator.isEmail(val), 'Invalid email format')
    ),
    
  phone: z.string()
    .optional()
    .transform((val) => val ? sanitizePhone(val) : val)
    .refine((val) => !val || validator.isMobilePhone(val, 'any', { strictMode: false }), {
      message: 'Please enter a valid phone number'
    }),
    
  subject: z.string()
    .transform(sanitizeString)
    .pipe(
      z.string()
        .min(5, 'Subject must be at least 5 characters')
        .max(100, 'Subject must be less than 100 characters')
        .regex(/^[a-zA-Z0-9\s\u00C0-\u017F\-\.\,\!\?]+$/, 'Subject contains invalid characters')
    ),
    
  message: z.string()
    .transform(sanitizeString)
    .pipe(
      z.string()
        .min(20, 'Message must be at least 20 characters')
        .max(1000, 'Message must be less than 1000 characters')
    ),
    
  tourInterest: z.string()
    .optional()
    .transform((val) => val ? sanitizeString(val) : val)
    .refine((val) => !val || val.length <= 100, 'Tour interest too long'),
    
  travelDate: z.string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      return validator.isISO8601(val) || validator.isDate(val);
    }, 'Invalid date format'),
    
  groupSize: z.string()
    .optional()
    .transform((val) => val ? val.replace(/[^0-9]/g, '') : val)
    .refine((val) => !val || (parseInt(val) >= 1 && parseInt(val) <= 50), {
      message: 'Group size must be between 1 and 50'
    }),
    
  budget: z.string()
    .optional()
    .transform((val) => val ? sanitizeString(val) : val)
    .refine((val) => !val || val.length <= 50, 'Budget description too long')
});

// Honeypot field for bot detection
export const honeypotSchema = z.object({
  website: z.string().max(0, 'Bot detected'), // Should always be empty
  timestamp: z.number().min(Date.now() - 3600000, 'Form expired'), // Max 1 hour old
});

// Rate limiting validation
export function validateSubmissionTiming(clientTimestamp?: number): boolean {
  if (!clientTimestamp) return false;
  
  const now = Date.now();
  const minTime = 3000; // Minimum 3 seconds to fill form
  const maxTime = 3600000; // Maximum 1 hour
  
  const timeDiff = now - clientTimestamp;
  return timeDiff >= minTime && timeDiff <= maxTime;
}

// CSRF token validation (simple implementation)
export function generateCSRFToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function validateCSRFToken(token: string, sessionToken: string): boolean {
  if (!token || !sessionToken || token.length !== 64) return false;
  return token === sessionToken;
}

export type SanitizedContactForm = z.infer<typeof contactFormSchema>;