/**
 * Small, stable string hash (djb2-style, 31-multiplier).
 *
 * Used to pick deterministic variants from a list — blog images, combo-page
 * heading sets — so the same slug always resolves to the same choice across
 * builds. Not cryptographic; it only needs to spread evenly and never change.
 */
export function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return h;
}

/** Pick a deterministic element of `variants` for the given slug. */
export function pickVariant<T>(slug: string, variants: readonly T[]): T {
  return variants[hashSlug(slug) % variants.length];
}
