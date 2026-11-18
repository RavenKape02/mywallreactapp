export const MAX_MESSAGE = 280;
export const MAX_NAME = 40;
export const FEED_LIMIT = 50;
export const PHOTO_BUCKET = "wall-photos";
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
export const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;

export type Post = {
  id: string;
  author_name: string;
  message: string;
  photo_url: string | null;
  created_at: string;
};

export type Draft = { name: string; message: string; hasPhoto: boolean };

/** Returns a user-facing problem with the draft, or null when it can be shared. Mirrors the database checks. */
export function validateDraft({ name, message, hasPhoto }: Draft): string | null {
  const n = name.trim();
  if (!n) return "Add your name so Raven knows who wrote this.";
  if (n.length > MAX_NAME) return `Names can be up to ${MAX_NAME} characters.`;
  if (message.length > MAX_MESSAGE) return `Posts can be up to ${MAX_MESSAGE} characters.`;
  if (!message.trim() && !hasPhoto) return "Write something or add a photo first.";
  return null;
}

/** Checks a chosen photo against the storage bucket's limits before uploading. */
export function validatePhoto(file: { type: string; size: number }): string | null {
  if (!(PHOTO_TYPES as readonly string[]).includes(file.type)) return "Photos must be JPG, PNG, WebP or GIF.";
  if (file.size > MAX_PHOTO_BYTES) return "Photos can be up to 5 MB.";
  return null;
}

/** Adds posts to a feed: no duplicates (own insert and realtime echo), newest first, capped. */
export function mergePosts(current: readonly Post[], incoming: readonly Post[], limit = FEED_LIMIT): Post[] {
  const byId = new Map<string, Post>();
  for (const p of [...incoming, ...current]) if (!byId.has(p.id)) byId.set(p.id, p);
  return [...byId.values()]
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
    .slice(0, limit);
}

/** "Just now", "5m", "3h", "2d", then a short date, like a social feed. */
export function relativeTime(iso: string, now: number): string {
  const seconds = Math.max(0, Math.round((now - Date.parse(iso)) / 1000));
  if (seconds < 45) return "Just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** Initials for a fallback avatar: "Ada Lovelace" -> "AL". */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0] ?? "?").slice(0, 2);
  return letters.toUpperCase();
}
