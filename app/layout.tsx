import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Video Subtitle MVP",
  description: "Automatic video subtitling with AI",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 dark:bg-slate-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
