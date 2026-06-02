import type { Metadata } from "next";
import { DM_Sans, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/Providers";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "WriteFlow AI — AI-Powered Writing Assistant",
    template: "%s | WriteFlow AI",
  },
  description:
    "WriteFlow AI is a production-ready SaaS writing platform powered by AI. Generate, rewrite, and refine content with premium editor tools and intelligent suggestions.",
  keywords: ["AI writing", "content generation", "SaaS", "copywriting", "WriteFlow"],
  authors: [{ name: "WriteFlow Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    siteName: "WriteFlow AI",
    title: "WriteFlow AI — AI-Powered Writing Assistant",
    description: "Generate, rewrite, and refine content with premium AI tools.",
  },
  twitter: {
    card: "summary_large_image",
    title: "WriteFlow AI",
    description: "AI-powered writing assistant for modern teams.",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
