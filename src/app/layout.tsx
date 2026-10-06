import type { Metadata } from "next";
import type { CSSProperties } from "react";
import "@fontsource-variable/outfit";
import "@fontsource-variable/noto-sans-jp";
import "./globals.css";
import { brand } from "@/config/brand";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || process.env.CF_PAGES_URL || "http://127.0.0.1:3000"),
  title: `${brand.name} | ${brand.productName}`,
  description: `${brand.tagline} 香ばしいバターサブレとほろ苦い焦がしキャラメル。架空ブランドKIROのコンセプトサイト。`,
  robots: { index: false, follow: false },
  openGraph: {
    title: `${brand.name} | ${brand.tagline}`,
    description: "香ばしさと、ほろ苦さ。焦がしキャラメルサブレのブランド体験。架空ブランドのデモサイト。",
    images: [{ url: "/images/kiro/og.webp", width: 1200, height: 630 }],
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const tokens = Object.fromEntries(Object.entries(brand.colors).map(([k, v]) => [`--${k}`, v])) as CSSProperties;
  return <html lang="ja"><body style={tokens}>{children}</body></html>;
}
