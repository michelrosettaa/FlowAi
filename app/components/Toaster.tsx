"use client";

import { Toaster as SonnerToaster } from "sonner";

export default function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      toastOptions={{
        style: {
          background: "white",
          color: "#0f172a",
          border: "1px solid #e2e8f0",
          boxShadow:
            "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        },
        className: "font-sans",
        duration: 3000,
      }}
      richColors
      closeButton
      expand
    />
  );
}
