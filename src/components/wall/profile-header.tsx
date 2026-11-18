import Image from "next/image";

const TABS = ["Posts", "About", "Photos"];

export function ProfileHeader() {
  return (
    <section className="bg-card shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
      <div className="mx-auto max-w-[940px]">
        {/* Cover: a screenshot of Raven's Tic-Tac-Toe app from Test 1. */}
        <div className="relative aspect-[2.7/1] max-h-[350px] w-full overflow-hidden bg-[#4a2c1a] sm:rounded-b-lg">
          <Image
            src="/cover.jpg"
            alt="Cover photo: Raven's 3D Tic-Tac-Toe game on a wooden board"
            fill
            sizes="(max-width: 940px) 100vw, 940px"
            className="object-cover object-[50%_60%]"
            priority
          />
        </div>

        <div className="flex flex-col items-center gap-3 px-4 pb-4 sm:flex-row sm:items-end sm:gap-4 sm:px-8">
          {/* Its own layer, so the positioned cover above doesn't paint over the overlap. */}
          <div className="relative z-10 -mt-[84px] shrink-0 rounded-full bg-card p-1 sm:-mt-[64px]">
            <Image
              src="/raven.jpg"
              alt="Raven Caduyac"
              width={168}
              height={168}
              className="size-[168px] rounded-full object-cover"
              priority
            />
          </div>
          <div className="pb-1 text-center sm:text-left">
            <h1 className="text-[32px] font-bold leading-tight tracking-[-0.01em]">Raven Caduyac</h1>
            <p className="text-[15px] font-semibold text-muted">AI Engineer · Full-stack developer</p>
          </div>
        </div>

        <nav aria-label="Profile sections" className="mx-4 flex gap-1 border-t border-line sm:mx-8">
          {TABS.map((tab, i) => (
            <span
              key={tab}
              aria-current={i === 0 ? "page" : undefined}
              className={
                i === 0
                  ? "border-b-[3px] border-blue px-4 py-4 text-[15px] font-semibold text-blue"
                  : "px-4 py-4 text-[15px] font-semibold text-muted"
              }
            >
              {tab}
            </span>
          ))}
        </nav>
      </div>
    </section>
  );
}
