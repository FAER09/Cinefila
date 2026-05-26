import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { ensureDatabaseUrl } from "@/lib/database-url";
import { isLocalMode } from "@/lib/data-mode";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function isRemoteDatabase(connectionString: string) {
  return !connectionString.includes("localhost") && !connectionString.includes("127.0.0.1");
}

function createMissingPrismaClient(message: string) {
  return new Proxy({} as PrismaClient, {
    get() {
      throw new Error(message);
    },
  });
}

function createPrismaClient() {
  const connectionString = ensureDatabaseUrl("runtime");
  if (!connectionString) {
    if (isLocalMode()) {
      return createMissingPrismaClient(
        "No se encontro una conexion Postgres. Configura DATABASE_URL o conecta Postgres en Vercel y desactiva NEXT_PUBLIC_DATA_MODE=local.",
      );
    }

    throw new Error(
      "No se encontro una conexion Postgres. Configura DATABASE_URL o conecta una base Postgres desde Vercel Marketplace.",
    );
  }

  const pool = new Pool({
    connectionString,
    ssl: isRemoteDatabase(connectionString) ? { rejectUnauthorized: false } : undefined,
  });

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
