import { z } from "zod";

// Seule source de vérité de la configuration serveur. Les messages d'erreur ne reprennent
// jamais la valeur reçue : elle peut être un secret.
const schema = z.object({
  DATABASE_URL: z.url({
    protocol: /^postgres(ql)?$/,
    error: "obligatoire, au format postgresql://utilisateur:motdepasse@hôte:port/base",
  }),
});

export type Env = z.infer<typeof schema>;

export function parseEnv(source: Record<string, string | undefined>): Env {
  const result = schema.safeParse(source);
  if (!result.success) {
    throw new Error(
      `Configuration invalide (voir .env.example) :\n${z.prettifyError(result.error)}`,
    );
  }
  return result.data;
}

let cached: Env | undefined;

export function getEnv(): Env {
  return (cached ??= parseEnv(process.env));
}
