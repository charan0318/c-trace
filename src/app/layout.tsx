"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import Navigation from "./components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThirdwebProvider 
          clientId="662a63dd0ecfac183d250631cc2138f5"
        >
          <Navigation />
          <div className="pt-20">
            {children}
          </div>
        </ThirdwebProvider>
      </body>
    </html>
  );
}