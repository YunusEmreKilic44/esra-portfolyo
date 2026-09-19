import Link from "next/link";
import React from "react";

const AdminHeader = ({
  title,
  subTitle,
}: {
  title: string;
  subTitle: string;
}) => {
  return (
    <header className="z-5 flex items-center justify-between gap-3 border-b border-b-[#f2ede41f] bg-[#0f0e0ce6] px-4 py-4 sm:px-6 md:sticky md:top-0 lg:px-8 lg:py-4.5">
      <div className="min-w-0">
        <div className="text-[10px] tracking-[0.16em] uppercase text-main">
          {title}
        </div>
        <h1 className="m-0 mt-1.5 font-heading text-[clamp(24px,5vw,32px)] font-normal tracking-[-0.02em]">
          {subTitle}
        </h1>
      </div>
      <div className="flex gap-2 shrink-0">
        <Link
          href="/"
          className="cursor-pointer whitespace-nowrap rounded-full border border-[#f2ede44d] bg-transparent px-3 py-2.5 text-[11px] text-[#f2ede4] sm:px-3.5 sm:text-xs"
        >
          Siteyi Gör
        </Link>
      </div>
    </header>
  );
};

export default AdminHeader;
