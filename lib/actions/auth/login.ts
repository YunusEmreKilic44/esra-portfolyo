"use server";

import { createAdminSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { redirect } from "next/navigation";

export interface LoginState {
  error: string;
}

const DUMMY_PASSWORD_HASH =
  "$2b$12$A2inksKu3L8qlUum/.LVauScFNOmKHLk/WsWRXn3q2lhkwUvdg6e.";

export const login = async (
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> => {
  const emailValue = formData.get("email");
  const passwordValue = formData.get("password");
  const email = typeof emailValue === "string" ? emailValue.trim().toLowerCase() : "";
  const password = typeof passwordValue === "string" ? passwordValue : "";

  if (!email || !password) {
    return { error: "E-posta ve şifre alanlarını doldurun." };
  }

  const admin = await prisma.admin.findUnique({
    where: { email },
    select: { id: true, email: true, passwordHash: true },
  });
  const passwordMatches = await compare(
    password,
    admin?.passwordHash ?? DUMMY_PASSWORD_HASH,
  );

  if (!admin || !passwordMatches) {
    return { error: "E-posta veya şifre hatalı." };
  }

  await createAdminSession({ id: admin.id, email: admin.email });
  redirect("/admin");
};
