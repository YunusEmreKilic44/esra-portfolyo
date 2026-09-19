"use server";

import { deleteAdminSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export const logout = async () => {
  await deleteAdminSession();
  redirect("/admin/login");
};
