import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WordGo - AI英语背单词",
  description: "极简英语单词学习：听、跟读、默写",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
