import Link from "next/link";
import { FortuneAIMark } from "@/components/fortune-ai-mark";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-yozora-washi min-h-screen text-(--color-text-primary)">
      <header className="border-b border-(--color-border-subtle)">
        <div className="mx-auto max-w-3xl px-6 py-(--spacing-ma-md) flex items-center gap-3">
          <Link href="/" aria-label="Fortune AI ホーム">
            <FortuneAIMark size="sm" />
          </Link>
          <span className="font-mincho text-(length:--text-body) tracking-(--tracking-jp-wide)">
            <Link href="/">Fortune AI</Link>
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-(--spacing-ma-xl)">{children}</main>
    </div>
  );
}
