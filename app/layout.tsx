import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Olive. - Raise Awareness Through Art",
  description: "Express solidarity through art - Share your doodles to raise awareness",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

