const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(identifier: string, maxRequests = 10, windowMs = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

export function getRateLimitInfo(identifier: string) {
  const record = rateLimitMap.get(identifier);
  if (!record) {
    return { remaining: 10, reset: Date.now() + 60000 };
  }

  return {
    remaining: Math.max(0, 10 - record.count),
    reset: record.resetTime,
  };
}
