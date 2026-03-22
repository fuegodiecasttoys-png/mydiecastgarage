// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diecast Vault",
  description: "Your Collection. Organized.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#0F0F10",
          color: "#ffffff",
          fontFamily:
            'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
          display: "flex",
          flexDirection: "column",
        }}
      >
        

        {/* CONTENT (centrado tipo mobile) */}
        <main
          style={{
            width: "100%",
            maxWidth: 420,
            margin: "0 auto",
            padding: "14px 16px 24px",
            flex: 1,
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
