export function parseAllowedOrigins(corsOrigin?: string): string[] | undefined {
  if (!corsOrigin) return [];

  return corsOrigin
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
}

export function getSessionTtl(sessionTtl?: string): number {
  const DEFAULT_TTL_MINUTES = 30;
  const parsed = Number(sessionTtl);

  if (parsed > 0) {
    return parsed * 60 * 1000;
  }

  return DEFAULT_TTL_MINUTES * 60 * 1000;
}
