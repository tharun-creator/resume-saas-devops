import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Proofline — Make your next move",
  description: "A clearer, more readable resume built on your real experience.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <body>{children}</body>
    </html>
  );
}
