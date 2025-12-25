const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(id: string, max: number = 10, window: number = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(id);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(id, { count: 1, resetTime: now + window });
    return true;
  }

  if (record.count >= max) return false;
  record.count++;
  return true;
}

export function getRateLimitInfo(id: string) {
  const record = rateLimitMap.get(id);
  return record ? { remaining: 10 - record.count, reset: record.resetTime } : { remaining: 10, reset: Date.now() + 60000 };
}
