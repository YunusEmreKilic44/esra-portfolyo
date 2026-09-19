"use client";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/actions/auth/logout";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const AdminSidebar = ({ email }: { email: string }) => {
  const pathname = usePathname();

  const getLinkClassName = (href: string) => {
    const isActive =
      href === "/admin"
        ? pathname === href
        : pathname === href || pathname.startsWith(`${href}/`);

    return cn(
      "flex shrink-0 items-center justify-between gap-2.5 rounded-[6px] border-l-2 px-3 py-2.75 text-[13px] cursor-pointer",
      isActive
        ? "bg-[#f2ede414] text-[#f2ede4] border-main"
        : "bg-transparent text-[#f2ede4b3] border-transparent",
    );
  };

  return (
    <aside className="sticky top-0 z-20 flex max-w-full flex-col border-b border-[#f2ede41f] bg-[#131210] md:h-screen md:overflow-y-auto md:border-b-0 md:border-r">
      <div className="flex items-center gap-2.5 border-b border-[#f2ede41f] px-4 py-3.5 md:px-5 md:py-5.5">
        <span className="w-2.25 h-2.25 rounded-full bg-main"></span>
        <div className="min-w-0">
          <div className="text-xs tracking-[0.16em] uppercase font-medium whitespace-nowrap">
            Esra Kılıç
          </div>
          <div className="text-[10px] tracking-[0.14px] uppercase text-[#f2ede473] mt-0.75">
            Yönetim Paneli
          </div>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 py-2 md:flex-col md:gap-0.5 md:overflow-visible md:py-4.5">
        <div className="hidden px-2.5 pb-2.5 pt-2 text-[10px] uppercase tracking-[0.16em] text-[#f2ede466] md:block">
          Sayfa Bölümleri
        </div>

        <Link
          href="/admin"
          className={getLinkClassName("/admin")}
        >
          <span className="flex items-center gap-2.5 min-w-0">
            <span className="text-[11px] text-[#f2ede4] w-4 shrink-0">00</span>
            <span className="whitespace-nowrap overflow-hidden text-ellipsis">
              Genel Bakış
            </span>
          </span>
          <span className="text-[10px] text-[#f2ede459]">—</span>
        </Link>

        <Link
          href="/admin/about"
          className={getLinkClassName("/admin/about")}
        >
          <span className="flex items-center gap-2.5 min-w-0">
            <span className="text-[11px] text-[#f2ede4] w-4 shrink-0">01</span>
            <span className="whitespace-nowrap overflow-hidden text-ellipsis">
              Hakkımda
            </span>
          </span>
          <span className="text-[10px] text-[#f2ede459]">metin</span>
        </Link>

        <Link
          href="/admin/works"
          className={getLinkClassName("/admin/works")}
        >
          <span className="flex items-center gap-2.5 min-w-0">
            <span className="text-[11px] text-[#f2ede4] w-4 shrink-0">02</span>
            <span className="whitespace-nowrap overflow-hidden text-ellipsis">
              Seçilmiş İşler
            </span>
          </span>
          <span className="text-[10px] text-[#f2ede459]">tasarım</span>
        </Link>

        <Link
          href="/admin/lookbook"
          className={getLinkClassName("/admin/lookbook")}
        >
          <span className="flex items-center gap-2.5 min-w-0">
            <span className="text-[11px] text-[#f2ede4] w-4 shrink-0">03</span>
            <span className="whitespace-nowrap overflow-hidden text-ellipsis">
              Lookbook
            </span>
          </span>
          <span className="text-[10px] text-[#f2ede459]">görsel</span>
        </Link>

        <Link
          href="/admin/contact"
          className={getLinkClassName("/admin/contact")}
        >
          <span className="flex items-center gap-2.5 min-w-0">
            <span className="text-[11px] text-[#f2ede4] w-4 shrink-0">04</span>
            <span className="whitespace-nowrap overflow-hidden text-ellipsis">
              İletişim
            </span>
          </span>
          <span className="text-[10px] text-[#f2ede459]">bağlantı</span>
        </Link>
      </nav>
      <div className="border-t border-[#f2ede41f] p-2 md:mt-auto md:p-3">
        <div className="mb-2 hidden truncate px-3 text-[11px] text-[#f2ede466] md:block">{email}</div>
        <form action={logout}>
          <button type="submit" className="w-full cursor-pointer rounded-[6px] border border-[#f2ede42e] px-3 py-2 text-center text-xs uppercase tracking-[0.12em] text-[#f2ede4b3] hover:border-[#f2ede466] md:py-2.5 md:text-left">
            Çıkış yap
          </button>
        </form>
      </div>
    </aside>
  );
};

export default AdminSidebar;
