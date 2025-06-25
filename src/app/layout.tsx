"use client";

import { Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import Navigation from "./components/Navigation";

const outfit = Outfit({ subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-space-grotesk',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${outfit.className} ${spaceGrotesk.variable}`}>
        <ThirdwebProvider>
          <Navigation />
          <div className="pt-20">
            {children}
          </div>
        </ThirdwebProvider>
      </body>
    </html>
  );
}