import AdminSidebar from "@/components/Admin/AdminSidebar";
import { requireAdmin } from "@/lib/auth/session";
import React from "react";

export const dynamic = "force-dynamic";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-[#0f0e0c] font-sans text-[#f2ede4] md:grid md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[244px_minmax(0,1fr)]">
      <AdminSidebar email={admin.email} />
      <main className="min-w-0">{children}</main>
    </div>
  );
};

export default AdminLayout;
