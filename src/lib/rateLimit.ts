import { Ratelimit } from '@upstash/ratelimit';

// For development/demo, we'll use a simple in-memory store
// In production with Vercel, you'd use Upstash Redis
class MemoryStore {
  private store = new Map<string, { count: number; reset: number }>();

  async get(key: string) {
    const item = this.store.get(key);
    if (!item) return null;
    
    if (Date.now() > item.reset) {
      this.store.delete(key);
      return null;
    }
    
    return item.count;
  }

  async set(key: string, count: number, ttl: number) {
    this.store.set(key, {
      count,
      reset: Date.now() + ttl * 1000
    });
    return 'OK';
  }

  async incr(key: string) {
    const current = await this.get(key);
    if (current === null) {
      await this.set(key, 1, 900); // 15 minutes default
      return 1;
    }
    
    const newCount = current + 1;
    const item = this.store.get(key);
    if (item) {
      item.count = newCount;
    }
    return newCount;
  }

  async expire(key: string, ttl: number) {
    const item = this.store.get(key);
    if (item) {
      item.reset = Date.now() + ttl * 1000;
    }
    return 1;
  }
}

// Create rate limiter instance
export const ratelimit = new Ratelimit({
  redis: new MemoryStore() as any,
  limiter: Ratelimit.slidingWindow(5, '15 m'), // 5 requests per 15 minutes
  analytics: false, // Disable analytics for demo
});

// Helper function to get client IP
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

// Rate limit error response
export function rateLimitErrorResponse() {
  return new Response(
    JSON.stringify({
      error: 'Rate limit exceeded',
      message: 'Too many requests. Please wait before trying again.',
      retryAfter: '15 minutes'
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': '900', // 15 minutes in seconds
      },
    }
  );
}