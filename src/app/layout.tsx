"use client";

import { Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import Navigation from "./components/Navigation";
import MobileRedirect from "./components/MobileRedirect";

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
          <MobileRedirect />
          <Navigation />
          {children}
        </ThirdwebProvider>
      </body>
    </html>
  );
}