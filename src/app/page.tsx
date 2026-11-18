import { Suspense } from "react";
import { connection } from "next/server";
import { fetchLatestPosts } from "@/lib/supabase";
import { TopBar } from "@/components/wall/top-bar";
import { ProfileHeader } from "@/components/wall/profile-header";
import { IntroCard } from "@/components/wall/intro-card";
import { Wall } from "@/components/wall/wall";
import { FeedSkeleton } from "@/components/wall/feed-skeleton";

/** Reads the database at request time, so a refresh always shows every saved post. */
async function LiveWall() {
  await connection();
  const { posts, error } = await fetchLatestPosts();
  return <Wall initialPosts={posts} loadError={error} />;
}

export default function Home() {
  return (
    <>
      <TopBar />
      <ProfileHeader />
      <main className="mx-auto grid max-w-[940px] gap-4 px-0 py-4 sm:px-4 md:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        <div className="order-2 md:order-1">
          <div className="md:sticky md:top-[72px]">
            <IntroCard />
          </div>
        </div>
        <div className="order-1 min-w-0 md:order-2">
          <Suspense fallback={<FeedSkeleton />}>
            <LiveWall />
          </Suspense>
        </div>
      </main>
    </>
  );
}
