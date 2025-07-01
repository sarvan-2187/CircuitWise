import type { Metadata } from "next";
import { Lexend_Deca, Geist_Mono } from "next/font/google";
import "./globals.css";

const LexendSans = Lexend_Deca({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ['400'],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CircuitWise",
  description: "Automated Wire counter & Cost Estimator for Digital Circuits",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`bg-white text-black dark:bg-black dark:text-white transition-colors duration-300 ${LexendSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
