export function parseAllowedOrigins(corsOrigin?: string): string[] | undefined {
  if (!corsOrigin) return undefined;

  return corsOrigin
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
}
