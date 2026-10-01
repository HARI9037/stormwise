import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Stormwise | Weather damage simulation",
  description: "An explainable, rule-based weather damage and repair cost simulation tool.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <footer className="border-t border-[#dbe5eb] bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-[#6b7b8c] sm:flex-row sm:items-center sm:justify-between lg:px-8">
            <p>Stormwise is an academic decision-support simulation.</p>
            <p className="font-medium text-ink">Rule-based • Explainable • Manual-first</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
