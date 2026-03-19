"use client";
// import type { Metadata } from "next"; // No longer needed here
import { Geist } from "next/font/google";
import { Pacifico, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes"; // Import ThemeProvider
import { CartProvider } from "./context/CartContext"; // Import CartProvider

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const pacifico = Pacifico({
  weight: ["400"],
  variable: "--font-pacifico",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
});

// export const metadata: Metadata = { // No longer needed here
//   title: "Illustrator Portfolio",
//   description: "A portfolio for an illustrator and designer.",
// };

export function LayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <CartProvider> {/* Wrap children with CartProvider */}
        <div className={`${geistSans.variable} ${pacifico.variable} ${poppins.variable} font-geist-sans antialiased`}>
          {children}
        </div>
      </CartProvider>
    </ThemeProvider>
  );
}
