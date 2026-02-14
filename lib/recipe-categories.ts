/**
 * Valori dell'enum Categorie in Supabase (tutti in minuscolo).
 * Questa lista deve coincidere con l'enum definito in Supabase.
 */
export const VALID_CATEGORIES = [
  "antipasti",
  "primi",
  "secondi",
  "contorni",
  "dolci",
  "bevande",
  "altro",
] as const;

export type ValidCategory = (typeof VALID_CATEGORIES)[number];

const VALID_SET = new Set<string>(VALID_CATEGORIES);

/**
 * Restituisce true se il valore è uno di quelli ammessi dall'enum (dopo lowercase).
 */
function isValidCategoryValue(s: string): s is ValidCategory {
  return VALID_SET.has(s.toLowerCase());
}

/**
 * Normalizza un valore categoria (da DB o form) al valore enum in minuscolo.
 * Restituisce solo valori esatti dell'enum; altrimenti null.
 * Usare per: stato del form, lettura da DB, e payload verso Supabase.
 */
export function normalizeCategory(
  value: string | string[] | null | undefined
): string | null {
  if (value == null) return null;
  const raw = Array.isArray(value) ? value[0] : value;
  const s = String(raw).trim().toLowerCase();
  if (!s) return null;
  if (VALID_SET.has(s)) return s;
  // Varianti/typo comuni → valore enum
  const aliases: Record<string, ValidCategory> = {
    primii: "primi",
    primo: "primi",
    antipasto: "antipasti",
    secondo: "secondi",
    contorno: "contorni",
    dolce: "dolci",
    bevanda: "bevande",
  };
  const mapped = aliases[s];
  return mapped ?? null;
}

/**
 * Valore da inviare a Supabase (insert/update).
 * Restituisce solo un valore enum valido in minuscolo, oppure null.
 * Non inviare mai stringa vuota.
 */
export function categoryForSupabase(
  value: string | string[] | null | undefined
): string | null {
  const normalized = normalizeCategory(value);
  if (normalized == null) return null;
  return isValidCategoryValue(normalized) ? normalized : null;
}

export const CATEGORY_OPTIONS: { value: ValidCategory; label: string }[] = [
  { value: "antipasti", label: "Antipasti" },
  { value: "primi", label: "Primi" },
  { value: "secondi", label: "Secondi" },
  { value: "contorni", label: "Contorni" },
  { value: "dolci", label: "Dolci" },
  { value: "bevande", label: "Bevande" },
  { value: "altro", label: "Altro" },
];
