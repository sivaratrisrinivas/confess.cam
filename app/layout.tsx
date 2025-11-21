import type { Metadata } from "next";
import { Geist, Geist_Mono, Kalam } from "next/font/google";
import "./globals.css";
import { ConfessionProvider } from "@/context/ConfessionContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const kalam = Kalam({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-kalam",
});

export const metadata: Metadata = {
  title: "Confess.cam - Anonymous Retro Confession Booth",
  description: "Take a polaroid, write your confession, drop it into the global feed. Pure catharsis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${kalam.variable} antialiased`}
      >
        <ConfessionProvider>
          {children}
        </ConfessionProvider>
      </body>
    </html>
  );
}
