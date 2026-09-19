import LoginForm from "@/components/Admin/LoginForm";
import { getAdminSession } from "@/lib/auth/session";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const AdminLoginPage = async () => {
  if (await getAdminSession()) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0f0e0c] px-4 py-12 text-[#f2ede4]">
      <section className="w-full max-w-md rounded-[12px] border border-[#f2ede424] bg-[#131210] p-6 sm:p-8">
        <Link href="/" className="mb-10 flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-main" />
          <span className="text-sm font-medium uppercase tracking-[0.16em]">Esra Kılıç</span>
        </Link>
        <div className="text-xs uppercase tracking-[0.16em] text-main">Yönetim Paneli</div>
        <h1 className="mb-0 mt-2 font-heading text-[clamp(38px,10vw,52px)] font-normal leading-none">Giriş yap</h1>
        <LoginForm />
      </section>
    </main>
  );
};

export default AdminLoginPage;
