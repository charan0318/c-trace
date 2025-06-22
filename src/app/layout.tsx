
"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import { Navigation } from "./components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThirdwebProvider>
          <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
            <Navigation />
            {children}
          </div>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
