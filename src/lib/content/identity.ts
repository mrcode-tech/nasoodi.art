export function hasSharedContentIdentity<T extends { id: string }>(
  source: readonly T[],
  target: readonly T[],
): boolean {
  const targetIds = new Set(target.map((item) => item.id));
  return source.some((item) => targetIds.has(item.id));
}

/**
 * Archive pages are hreflang equivalents only when both locales expose the same
 * canonical content identities. A partial overlap is not enough to claim that
 * the two archive pages are equivalent search destinations.
 */
export function hasEquivalentContentSet<T extends { id: string }>(
  source: readonly T[],
  target: readonly T[],
): boolean {
  if (source.length === 0 || source.length !== target.length) return false;
  const sourceIds = new Set(source.map((item) => item.id));
  const targetIds = new Set(target.map((item) => item.id));
  return sourceIds.size === source.length &&
    targetIds.size === target.length &&
    sourceIds.size === targetIds.size &&
    [...sourceIds].every((id) => targetIds.has(id));
}
