/** Normalize handle input: trim + lowercase (never use display `name` for this). */
export function normalizeUsernameInput(raw: string): string {
  return raw.trim().toLowerCase();
}

/** Same rule as `isValidUsernameFormat` (for UI copy). */
export const USERNAME_PUBLIC_RULES =
  "3–24 characters: lowercase letters, numbers, and underscores only.";

/** Public username: a–z, 0–9, underscore, 3–24 chars. */
export function isValidUsernameFormat(normalized: string): boolean {
  if (!normalized) return false;
  return /^[a-z0-9_]{3,24}$/.test(normalized);
}

/** Stored profile.username is usable as public identity (Friends, /user/[username]). */
export function isPublicUsername(value: string | null | undefined): boolean {
  if (value == null || typeof value !== "string") return false;
  return isValidUsernameFormat(normalizeUsernameInput(value));
}

export type PublicProfileLabel = {
  /** Canonical handle for URLs; null if this profile cannot be addressed by username. */
  handle: string | null;
  /** Main line: @handle or "Username unavailable". */
  primary: string;
  /** Optional display only (e.g. first name); never an identifier. */
  secondary: string | null;
};

export function publicProfileLabel(row: {
  username: string | null | undefined;
  name: string | null | undefined;
}): PublicProfileLabel {
  const secondary = row.name?.trim() || null;
  if (isPublicUsername(row.username)) {
    const handle = normalizeUsernameInput(row.username as string);
    return { handle, primary: `@${handle}`, secondary };
  }
  return { handle: null, primary: "Username unavailable", secondary };
}
