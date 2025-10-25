// app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "FlowAI",
  description: "Plan your day with AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: "#F6F8FC", color: "#181D31" }}>{children}</body>
    </html>
  );
}
