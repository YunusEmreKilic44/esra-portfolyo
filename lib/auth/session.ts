import "server-only";

import { prisma } from "@/lib/prisma";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

const SESSION_COOKIE = "admin_session";
const SESSION_DURATION_SECONDS = 8 * 60 * 60;

const getSessionKey = () => {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET en az 32 karakter olmalıdır.");
  }
  return new TextEncoder().encode(secret);
};

export const createAdminSession = async (admin: { id: string; email: string }) => {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_SECONDS * 1000);
  const token = await new SignJWT({ email: admin.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(admin.id)
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(getSessionKey());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
};

export const deleteAdminSession = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
};

export const getAdminSession = cache(async () => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSessionKey(), {
      algorithms: ["HS256"],
    });
    if (!payload.sub) return null;

    return prisma.admin.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true },
    });
  } catch {
    return null;
  }
});

export const requireAdmin = async () => {
  const admin = await getAdminSession();
  if (!admin) redirect("/admin/login");
  return admin;
};
