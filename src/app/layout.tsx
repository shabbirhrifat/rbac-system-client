import type { Metadata } from "next";
import { Inter, Manrope, Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const interFont = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "RBAC Control Center",
  description: "Permission-aware operations dashboard for teams, agents, and customers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${interFont.variable} ${bodyFont.variable} ${displayFont.variable}`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: "12px",
              padding: "12px 16px",
              fontSize: "14px",
              fontFamily: "var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif",
            },
          }}
          richColors
          closeButton
        />
      </body>
    </html>
  );
}
