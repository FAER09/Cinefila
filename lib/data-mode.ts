export type DataMode = "local" | "database";

export function getDataMode(): DataMode {
  return process.env.NEXT_PUBLIC_DATA_MODE === "local" ? "local" : "database";
}

export function isLocalMode() {
  return getDataMode() === "local";
}
