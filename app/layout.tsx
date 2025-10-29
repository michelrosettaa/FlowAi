// app/layout.tsx
import "./globals.css";
import React from "react";

export const metadata = {
  title: "FlowAI",
  description: "AI-powered productivity and planning",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0f1c] text-slate-100">{children}</body>
    </html>
  );
}
