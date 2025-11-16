// app/layout.tsx
import "./globals.css";
import React from "react";
import Toaster from "./components/Toaster";
import GlobalComponents from "./components/GlobalComponents";
import Providers from "./providers";

export const metadata = {
  title: "Refraim AI",
  description: "Reclaim your time with AI-powered productivity and planning",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0f1c] text-slate-100">
        <Providers>
          {children}
          <Toaster />
          <GlobalComponents />
        </Providers>
      </body>
    </html>
  );
}
