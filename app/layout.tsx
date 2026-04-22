// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import { t } from "./ui/dv-tokens";

const inter = Inter({
  subsets: ["latin"],
  variable: "--dv-font-body",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--dv-font-display",
  display: "swap",
});

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
    <html lang="en" className={`${inter.variable} ${interTight.variable}`}>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "linear-gradient(180deg, #0B0F17 0%, #07090D 50%, #07090D 100%)",
          color: t.textPrimary,
          fontFamily: `var(--dv-font-body), system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"`,
          display: "flex",
          flexDirection: "column",
        }}
      >
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
