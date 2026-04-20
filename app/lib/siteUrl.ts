/**
 * Public origin for auth redirect URLs (no trailing slash).
 * - In the browser: always `window.location.origin` (tu dominio real, preview, etc.).
 * - On the server: set `NEXT_PUBLIC_SITE_URL` (ej. `https://www.mydiecastgarage.app`) if algún flujo lo necesita sin `window`.
 *
 * Remitente tipo **noreply@tudominio**: Supabase Dashboard → Authentication →
 * SMTP Settings (correo personalizado). No va en variables de esta app salvo que
 * uses un proveedor externo vía API.
 */
export function getPublicSiteOrigin(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  return "https://www.mydiecastgarage.app";
}
