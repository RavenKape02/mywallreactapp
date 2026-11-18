"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { mergePosts, type Post } from "@/lib/posts";
import { Composer } from "./composer";
import { PostCard } from "./post-card";

type LiveState = "connecting" | "live" | "offline";

export function Wall({ initialPosts, loadError }: { initialPosts: Post[]; loadError: string | null }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [fresh, setFresh] = useState<ReadonlySet<string>>(new Set());
  const [live, setLive] = useState<LiveState>("connecting");

  const addPosts = useCallback((incoming: Post[]) => {
    setPosts((current) => mergePosts(current, incoming));
    setFresh((ids) => new Set([...ids, ...incoming.map((p) => p.id)]));
  }, []);

  // New posts from any visitor arrive over Supabase Realtime, without a refresh.
  useEffect(() => {
    const supabase = getSupabase();
    const channel = supabase
      .channel("wall-posts")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "posts" }, (payload) => {
        addPosts([payload.new as Post]);
      })
      .subscribe((status) => {
        setLive(status === "SUBSCRIBED" ? "live" : status === "CLOSED" || status === "CHANNEL_ERROR" || status === "TIMED_OUT" ? "offline" : "connecting");
      });
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [addPosts]);

  return (
    <div className="space-y-4">
      <Composer onPosted={(post) => addPosts([post])} />

      <section aria-labelledby="posts-heading" className="space-y-4">
        <div className="flex items-center justify-between rounded-none bg-card px-4 py-3 shadow-card sm:rounded-lg">
          <h2 id="posts-heading" className="text-xl font-bold">
            Posts
          </h2>
          <LiveBadge state={live} />
        </div>

        {loadError ? (
          <p role="alert" className="rounded-none bg-card p-6 text-center text-[15px] text-muted shadow-card sm:rounded-lg">
            Couldn&apos;t load posts right now. Refresh the page to try again.
          </p>
        ) : posts.length === 0 ? (
          <p className="rounded-none bg-card p-8 text-center text-[15px] text-muted shadow-card sm:rounded-lg">
            No posts yet. Be the first to write on Raven&apos;s wall.
          </p>
        ) : (
          <ol className="space-y-4" aria-label="Wall posts, newest first">
            {posts.map((post) => (
              <li key={post.id}>
                <PostCard post={post} fresh={fresh.has(post.id)} />
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}

function LiveBadge({ state }: { state: LiveState }) {
  const label = state === "live" ? "Live" : state === "connecting" ? "Connecting…" : "Offline: refresh for new posts";
  return (
    <span className="flex items-center gap-1.5 text-[13px] font-semibold text-muted" aria-live="polite">
      <span
        aria-hidden
        className={`size-2 rounded-full ${state === "live" ? "bg-[#31a24c]" : state === "connecting" ? "bg-line" : "bg-danger"}`}
      />
      {label}
    </span>
  );
}
