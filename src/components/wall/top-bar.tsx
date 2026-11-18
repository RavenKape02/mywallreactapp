import Image from "next/image";
import Link from "next/link";

/** A white app bar like a social network's, with our own wordmark (no third-party logo). */
export function TopBar() {
  return (
    <header className="sticky top-0 z-20 h-14 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-4">
        <Link href="/" className="text-[28px] font-bold leading-none tracking-[-0.04em] text-blue" aria-label="wall, home">
          wall
        </Link>
        <div className="flex items-center gap-2">
          <span className="hidden text-[15px] font-semibold text-ink sm:inline">Raven</span>
          <Image src="/raven.jpg" alt="" width={40} height={40} className="size-10 rounded-full object-cover" priority />
        </div>
      </div>
    </header>
  );
}
