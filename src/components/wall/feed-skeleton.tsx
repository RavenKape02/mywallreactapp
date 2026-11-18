/** Shown for the moment the feed streams in: the same cards, without content. */
export function FeedSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading posts">
      <div className="h-[196px] rounded-none bg-card shadow-card sm:rounded-lg" />
      {[0, 1].map((i) => (
        <div key={i} className="rounded-none bg-card p-4 shadow-card sm:rounded-lg">
          <div className="flex items-center gap-2">
            <div className="size-10 rounded-full bg-field" />
            <div className="space-y-2">
              <div className="h-3 w-32 rounded bg-field" />
              <div className="h-2.5 w-12 rounded bg-field" />
            </div>
          </div>
          <div className="mt-4 h-3 w-4/5 rounded bg-field" />
          <div className="mt-2 h-3 w-3/5 rounded bg-field" />
        </div>
      ))}
    </div>
  );
}
