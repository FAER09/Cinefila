import { cookies } from "next/headers";

const ADMIN_COOKIE = "cinefila_admin";
const ADMIN_VALUE = "1";

export const adminCredentials = {
  username: "Admin",
  password: "Admin",
};

export async function isAdminAuthenticated() {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === ADMIN_VALUE;
}

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }
}

export async function createAdminSession() {
  const store = await cookies();
  store.set(ADMIN_COOKIE, ADMIN_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8,
    path: "/",
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}
