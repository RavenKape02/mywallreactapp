import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Raven Caduyac · Wall",
  description: "Leave a message on Raven Caduyac's wall. Built with Next.js, React and Supabase.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-canvas text-ink">{children}</body>
    </html>
  );
}
