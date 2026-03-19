import type { Metadata } from "next";
import { LayoutClient } from "./layout-client"; // Import our client layout

export const metadata: Metadata = {
  title: "Illustrator Portfolio",
  description: "A portfolio for an illustrator and designer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}