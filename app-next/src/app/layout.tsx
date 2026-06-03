import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chechen Lab",
  description: "MVP web app for learning Chechen from A0 to A1.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
