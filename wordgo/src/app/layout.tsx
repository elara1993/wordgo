import type { Metadata } from "next";
import { ThemeProvider } from "@/components/layout/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "WordGo - AI英语背单词",
  description: "极简英语单词学习网站 - 听、跟读、默写",
  keywords: ["英语", "单词", "学习", "背单词", "AI学习"],
  authors: [{ name: "WordGo Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="light"
          enableSystem
          storageKey="wordgo-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
