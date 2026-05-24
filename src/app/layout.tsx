import type { Metadata } from "next";
import {
  Zen_Old_Mincho,
  Zen_Kaku_Gothic_New,
  Shippori_Mincho_B1,
  Yuji_Boku,
} from "next/font/google";
import "./globals.css";

const mincho = Zen_Old_Mincho({
  variable: "--font-mincho",
  weight: ["400", "500", "600", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});

const gothic = Zen_Kaku_Gothic_New({
  variable: "--font-gothic",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const decorative = Shippori_Mincho_B1({
  variable: "--font-decorative",
  weight: ["400", "600", "800"],
  subsets: ["latin"],
  display: "swap",
});

// 筆書ロゴ用 — 篆書体の完全再現フォントは無料では入手困難。
// Yuji Boku は墨と筆の運筆を残した最も古典的な無料 JP フォント。
const seal = Yuji_Boku({
  variable: "--font-seal",
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Fortune AI — 東洋三術 × AI",
    template: "%s | Fortune AI",
  },
  description:
    "東洋の智慧を、現代のAIで多角的に。四柱推命・九星気学・紫微斗数の合致から人生を読み解く、自己理解の補助具。",
  openGraph: {
    title: "Fortune AI — 東洋三術 × AI",
    description:
      "東洋の智慧を、現代のAIで多角的に。三千年の経験知を、AIが統合して読み解きます。",
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`dark ${mincho.variable} ${gothic.variable} ${decorative.variable} ${seal.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-bg-base text-text-primary font-gothic">
        {children}
      </body>
    </html>
  );
}
