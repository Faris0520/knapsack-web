import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const googleSans = localFont({
  src: [
    { path: "../../public/fonts/GoogleSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/GoogleSans-Italic.woff2", weight: "400", style: "italic" },
    { path: "../../public/fonts/GoogleSans-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/GoogleSans-MediumItalic.woff2", weight: "500", style: "italic" },
    { path: "../../public/fonts/GoogleSans-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-google-sans",
});

export const metadata: Metadata = {
  title: "Knapsack Optimizer",
  description: "Dashboard interaktif untuk visualisasi algoritma Knapsack 0/1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${googleSans.variable} h-full antialiased`}>
      <body className="h-full">{children}</body>
    </html>
  );
}
