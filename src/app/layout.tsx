import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Wrapper from "./Wrapper";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Book Rent",
  description: "Rent Book",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <Wrapper children={children} /> */}
        <Wrapper>{children}</Wrapper>
      </body>
    </html>
  );
}
