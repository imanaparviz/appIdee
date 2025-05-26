import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Developer Assistant",
  description: "Professional Fullstack Development Assistant with Dark Theme",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="dark bg-gray-900 text-white">{children}</body>
    </html>
  );
}
