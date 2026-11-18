import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/client";
import { getEnv } from "../env";

export function createPrismaClient(connectionString: string): PrismaClient {
  // node-pg n'a aucun délai de connexion par défaut : une base injoignable bloquerait la requête.
  const adapter = new PrismaPg({ connectionString, connectionTimeoutMillis: 5_000 });
  return new PrismaClient({ adapter });
}

// Client unique, conservé entre les rechargements à chaud en développement.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrismaClient(getEnv().DATABASE_URL);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
