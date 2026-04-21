/**
 * Local preset-list autocomplete: match query against the start of any word
 * (e.g. "bl" → "Black", "Metallic Blue").
 */
export function filterPresetOptions(query: string, options: readonly string[]): string[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return options.filter((opt) =>
    opt
      .toLowerCase()
      .split(/\s+/)
      .some((word) => word.startsWith(q))
  );
}
