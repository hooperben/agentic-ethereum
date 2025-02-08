import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agent Ethereum Hackathon",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col">{children}</body>
    </html>
  );
}
