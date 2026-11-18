"use client";

import { useSyncExternalStore } from "react";
import { relativeTime, type Post } from "@/lib/posts";
import { Avatar } from "./avatar";

// One shared clock that ticks every 30 s, so "5m" ages without re-fetching.
let now = 0;
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;
function subscribe(notify: () => void) {
  listeners.add(notify);
  if (!timer) {
    now = Date.now();
    timer = setInterval(() => {
      now = Date.now();
      listeners.forEach((l) => l());
    }, 30_000);
  }
  return () => {
    listeners.delete(notify);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}
const useNow = () =>
  useSyncExternalStore(
    subscribe,
    () => (now ||= Date.now()), // cached between ticks, as useSyncExternalStore requires
    () => 0,
  );

export function PostCard({ post, fresh }: { post: Post; fresh: boolean }) {
  const current = useNow();
  const full = new Date(post.created_at).toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" });
  return (
    <article className={`rounded-none bg-card shadow-card sm:rounded-lg ${fresh ? "post-arrive" : ""}`}>
      <header className="flex items-center gap-2 px-4 pt-3">
        <Avatar name={post.author_name} />
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold">
            {post.author_name}
            <span className="font-normal text-muted"> wrote on Raven&apos;s wall</span>
          </p>
          <time dateTime={post.created_at} title={current ? full : undefined} className="block h-4 text-[13px] leading-4 text-muted">
            {current ? relativeTime(post.created_at, current) : ""}
            {fresh && <span className="ml-1.5 font-semibold text-blue">· New</span>}
          </time>
        </div>
      </header>
      {post.message && (
        <p className="whitespace-pre-wrap break-words px-4 pb-3 pt-2 text-[15px] leading-[1.34]">{post.message}</p>
      )}
      {post.photo_url && (
        // Visitor photos come from Supabase Storage at any size; show them whole, not cropped.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.photo_url}
          alt={`Photo shared by ${post.author_name}`}
          loading="lazy"
          className={`max-h-[560px] w-full bg-field object-contain ${post.message ? "" : "mt-2"} sm:rounded-b-lg`}
        />
      )}
      {!post.photo_url && <div className="pb-1" />}
    </article>
  );
}
