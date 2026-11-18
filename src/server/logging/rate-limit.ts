// Fenêtre fixe en mémoire, par clé. Par instance : sur un hébergeur à plusieurs instances, la limite
// réelle est multipliée d'autant. Suffisant pour borner le bruit d'un endpoint de logs.
const MAX_KEYS = 10_000;

export type RateLimiter = (
  key: string,
  now?: number,
) => { allowed: boolean; retryAfterSec: number };

export function createRateLimiter(limit: number, windowMs: number): RateLimiter {
  const hits = new Map<string, { count: number; resetAt: number }>();

  return (key, now = Date.now()) => {
    let entry = hits.get(key);
    if (!entry || entry.resetAt <= now) {
      if (hits.size >= MAX_KEYS) {
        for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
        // Toujours plein : on libère les plus anciennes (ordre d'insertion).
        for (const k of hits.keys()) {
          if (hits.size < MAX_KEYS) break;
          hits.delete(k);
        }
      }
      entry = { count: 0, resetAt: now + windowMs };
      hits.set(key, entry);
    }
    entry.count += 1;
    return {
      allowed: entry.count <= limit,
      retryAfterSec: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  };
}
