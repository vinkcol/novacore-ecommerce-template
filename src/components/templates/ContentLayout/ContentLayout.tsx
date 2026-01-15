"use client";

import { ReactNode } from "react";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { CartPanel } from "@/components/organisms/CartPanel";
import { Toaster } from "sonner";

interface ContentLayoutProps {
  children: ReactNode;
}

export function ContentLayout({ children }: ContentLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartPanel />
      <Toaster position="top-right" richColors />
    </div>
  );
}
