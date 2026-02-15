/**
 * Immagini ricette: in DB è salvato image_url (testo).
 * Può essere un JSON array ["url1","url2"] oppure un singolo URL (legacy).
 */

export function parseImageUrls(imageUrl: string | null | undefined): string[] {
  if (!imageUrl || !String(imageUrl).trim()) return [];
  const t = String(imageUrl).trim();
  if (t.startsWith("[")) {
    try {
      const parsed = JSON.parse(t) as unknown;
      return Array.isArray(parsed) ? parsed.filter((u): u is string => typeof u === "string") : [t];
    } catch {
      return [t];
    }
  }
  return [t];
}

export function stringifyImageUrls(urls: string[]): string | null {
  if (urls.length === 0) return null;
  return JSON.stringify(urls);
}
