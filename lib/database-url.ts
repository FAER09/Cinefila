type ResolveDatabaseUrlPurpose = "runtime" | "prisma";

const COMMON_PREFIX_PRIORITY = ["DATABASE", "POSTGRES", "STORAGE"];
const REQUIRED_PG_PARTS = ["PGHOST", "PGUSER", "PGPASSWORD", "PGDATABASE"] as const;

function readEnv(name: string) {
  const value = process.env[name];
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function unique<T>(values: T[]) {
  return [...new Set(values)];
}

function findByExactOrSuffix(names: string[]) {
  for (const name of names) {
    const exact = readEnv(name);
    if (exact) {
      return exact;
    }
  }

  const envKeys = Object.keys(process.env);
  for (const name of names) {
    const suffix = `_${name}`;
    const match = envKeys
      .filter((key) => key.endsWith(suffix))
      .sort((left, right) => left.localeCompare(right))[0];

    if (match) {
      const value = readEnv(match);
      if (value) {
        return value;
      }
    }
  }

  return undefined;
}

function listPgPrefixes() {
  const discovered = Object.keys(process.env)
    .flatMap((key) => {
      if (!key.endsWith("_PGHOST")) {
        return [];
      }

      return [key.slice(0, -"_PGHOST".length)];
    })
    .filter(Boolean);

  const remaining = discovered
    .filter((prefix) => !COMMON_PREFIX_PRIORITY.includes(prefix))
    .sort((left, right) => left.localeCompare(right));

  return unique(["", ...COMMON_PREFIX_PRIORITY, ...remaining]);
}

function buildConnectionStringFromPgParts() {
  for (const prefix of listPgPrefixes()) {
    const qualify = (name: string) => (prefix ? `${prefix}_${name}` : name);

    const requiredValues = REQUIRED_PG_PARTS.map((name) => readEnv(qualify(name)));
    if (requiredValues.some((value) => !value)) {
      continue;
    }

    const [host, user, password, database] = requiredValues as [string, string, string, string];
    const port = readEnv(qualify("PGPORT"));
    const sslMode = readEnv(qualify("PGSSLMODE"));
    const url = new URL("postgresql://localhost");

    url.hostname = host;
    url.username = user;
    url.password = password;
    url.pathname = `/${database}`;

    if (port) {
      url.port = port;
    }

    if (sslMode) {
      url.searchParams.set("sslmode", sslMode);
    }

    return url.toString();
  }

  return undefined;
}

function getCandidateNames(purpose: ResolveDatabaseUrlPurpose) {
  if (purpose === "prisma") {
    return ["DATABASE_URL", "POSTGRES_PRISMA_URL", "POSTGRES_URL_NON_POOLING", "POSTGRES_URL"];
  }

  return ["DATABASE_URL", "POSTGRES_URL", "POSTGRES_PRISMA_URL", "POSTGRES_URL_NON_POOLING"];
}

export function resolveDatabaseUrl(purpose: ResolveDatabaseUrlPurpose = "runtime") {
  return findByExactOrSuffix(getCandidateNames(purpose)) ?? buildConnectionStringFromPgParts();
}

export function ensureDatabaseUrl(purpose: ResolveDatabaseUrlPurpose = "runtime") {
  const connectionString = resolveDatabaseUrl(purpose);

  if (connectionString && !readEnv("DATABASE_URL")) {
    process.env.DATABASE_URL = connectionString;
  }

  return connectionString;
}
