import Link from "next/link";

const Navbar = () => (
  <header className="sticky top-0 z-10 flex flex-col items-start gap-4 border-b border-[#f2ede41f] bg-[#0F0E0C]/95 px-4 py-4 backdrop-blur-[10px] sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5.5 lg:px-12">
    <Link className="flex shrink-0 cursor-pointer items-center gap-3 whitespace-nowrap" href="/">
      <span className="inline-block h-2.5 w-2.5 rounded-full bg-main" />
      <span className="text-[13px] font-medium uppercase tracking-[0.16em]">Esra Kılıç</span>
    </Link>
    <nav className="flex w-full items-center justify-between gap-4 overflow-x-auto whitespace-nowrap text-[11px] uppercase tracking-widest text-[#f2ede4b3] sm:w-auto sm:justify-start sm:gap-5 sm:text-xs sm:tracking-[0.14em] lg:gap-7">
      <Link href="/#about">Hakkımda</Link>
      <Link href="/#works">İşler</Link>
      <Link href="/#lookbook">Lookbook</Link>
      <Link href="/#contact">İletişim</Link>
    </nav>
  </header>
);

export default Navbar;
