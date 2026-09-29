/**
 * Best-effort in-memory rate limit for public write endpoints.
 *
 * Each serverless isolate (a warm Vercel function instance) keeps its own map.
 * A burst can still be spread across cold starts, so this is not a global
 * quota. It is still useful: most scripted abuse hits one warm instance, and
 * it keeps working when Supabase is down — which is exactly when a
 * database-backed limiter would also be down and the forms would still be
 * accepting traffic.
 *
 * Limits: 8 requests per 10 minutes per IP per path.
 */

type Bucket = { timestamps: number[] };

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 8;
const MAX_KEYS = 5000;

export function rateLimit(
  key: string,
  limit: number = MAX_REQUESTS,
  windowMs: number = WINDOW_MS,
): { ok: boolean } {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((stamp) => now - stamp < windowMs);

  if (bucket.timestamps.length >= limit) {
    buckets.set(key, bucket);
    return { ok: false };
  }

  bucket.timestamps.push(now);
  buckets.set(key, bucket);

  if (buckets.size > MAX_KEYS) {
    const stale: string[] = [];
    buckets.forEach((entry, entryKey) => {
      entry.timestamps = entry.timestamps.filter((stamp) => now - stamp < windowMs);
      if (entry.timestamps.length === 0) stale.push(entryKey);
    });
    stale.forEach((entryKey) => buckets.delete(entryKey));
  }

  return { ok: true };
}

/** Test helper so suites do not share buckets. */
export function resetRateLimits(): void {
  buckets.clear();
}
