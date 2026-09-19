import type { Metadata } from "next";
import { Space_Grotesk, Bodoni_Moda } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin", "latin-ext"],
});

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Esra Kılıç | Moda Tasarımı",
  description: "Esra Kılıç moda tasarımı portfolyosu.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${spaceGrotesk.variable} ${bodoniModa.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col overflow-x-hidden bg-[#0F0E0C] text-[#f2ede4]">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
