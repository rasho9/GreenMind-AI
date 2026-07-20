const buckets = new Map();

export function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.end(JSON.stringify(body));
}

export function methodNotAllowed(res, allowed) {
  res.setHeader('Allow', allowed.join(', '));
  return sendJson(res, 405, { error: { message: 'Method not allowed.' } });
}

export function getClientId(req) {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = Array.isArray(forwarded)
    ? forwarded[0]
    : forwarded?.split(',')[0]?.trim();
  return ip || req.socket?.remoteAddress || 'anonymous';
}

/** In-memory fallback only. Replace with Redis/Upstash for shared production limits. */
export function enforceRateLimit(req, res, scope, maxRequests, windowMs) {
  const key = `${scope}:${getClientId(req)}`;
  const now = Date.now();
  const current = buckets.get(key);
  const bucket =
    !current || now - current.startedAt >= windowMs
      ? { startedAt: now, count: 0 }
      : current;
  if (bucket.count >= maxRequests) {
    const retryAfter = Math.max(
      1,
      Math.ceil((windowMs - (now - bucket.startedAt)) / 1000),
    );
    res.setHeader('Retry-After', String(retryAfter));
    sendJson(res, 429, {
      error: {
        message: `Too many requests. Please try again in ${retryAfter} seconds.`,
      },
    });
    return false;
  }
  bucket.count += 1;
  buckets.set(key, bucket);
  return true;
}

export async function readJson(req, maxBytes = 32_000) {
  if (req.body && typeof req.body === 'object') return req.body;
  let body = '';
  for await (const chunk of req) {
    body += chunk;
    if (Buffer.byteLength(body) > maxBytes)
      throw new Error('Request body is too large.');
  }
  try {
    return JSON.parse(body || '{}');
  } catch {
    throw new Error('Request body must be valid JSON.');
  }
}

export function cleanText(value, maxLength = 1_500) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .trim()
    .slice(0, maxLength);
}

export function readCoordinate(value, name, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) {
    throw new Error(`${name} must be between ${min} and ${max}.`);
  }
  return number;
}

export async function fetchWithTimeout(url, options = {}, timeoutMs = 12_000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}
