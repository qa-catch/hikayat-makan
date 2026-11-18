// Masquage des secrets et des données personnelles avant toute écriture dans les logs (§ 14, § 15).
export const MASK = "[MASQUÉ]";

// Clés dont la valeur n'est jamais journalisée, quel que soit son contenu.
const SENSITIVE_KEY =
  /pass(?:word|wd)?|secret|token|authorization|cookie|api[-_]?key|credential|database[-_]?url|connection[-_]?string|dsn|e-?mail|phone|mobile/i;

// Motifs repérés dans les valeurs texte (messages d'erreur, URL, en-têtes copiés tels quels).
// L'ordre compte : les identifiants d'URL passent avant les adresses e-mail.
const VALUE_PATTERNS: readonly [RegExp, string][] = [
  [/(\b[a-z][a-z0-9+.-]*:\/\/)[^\s/@]*@/gi, `$1${MASK}@`],
  [/\bBearer\s+[\w.~+/=-]+/gi, `Bearer ${MASK}`],
  [/\beyJ[\w-]+\.[\w-]+\.[\w-]+/g, MASK],
  [/[^\s@/:]+@[^\s@/]+\.[^\s@/]+/g, MASK],
];

const MAX_STRING = 4_000;
const MAX_DEPTH = 6;

export function maskString(value: string): string {
  const truncated = value.length > MAX_STRING ? `${value.slice(0, MAX_STRING)}…[tronqué]` : value;
  return VALUE_PATTERNS.reduce((text, [pattern, mask]) => text.replace(pattern, mask), truncated);
}

function serializeError(error: Error): Record<string, unknown> {
  return { name: error.name, message: error.message, stack: error.stack };
}

// Copie profonde et masquée : l'objet reçu n'est jamais modifié.
export function maskValue(value: unknown, depth = 0, seen = new WeakSet<object>()): unknown {
  if (typeof value === "string") return maskString(value);
  if (typeof value === "bigint") return value.toString();
  if (value === null || typeof value !== "object") return value;
  if (seen.has(value)) return "[circulaire]";
  if (depth >= MAX_DEPTH) return "[trop profond]";
  seen.add(value);
  const source = value instanceof Error ? serializeError(value) : value;
  if (Array.isArray(source)) return source.map((item) => maskValue(item, depth + 1, seen));
  return Object.fromEntries(
    Object.entries(source).map(([key, item]) => [
      key,
      SENSITIVE_KEY.test(key) ? MASK : maskValue(item, depth + 1, seen),
    ]),
  );
}
