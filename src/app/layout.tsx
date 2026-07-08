import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Leben in Deutschland Trainer",
  description: "Deutschsprachige Lern-App fuer den Test Leben in Deutschland und den Einbuergerungstest."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
