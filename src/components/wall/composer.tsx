"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { ImagePlus, LoaderCircle, X } from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { MAX_MESSAGE, MAX_NAME, PHOTO_BUCKET, validateDraft, validatePhoto, type Post } from "@/lib/posts";

const NAME_KEY = "wall:name";

export function Composer({ onPosted }: { onPosted: (post: Post) => void }) {
  const id = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState<{ file: File; url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Remember the visitor's name between visits (the field stays uncontrolled, so no hydration mismatch).
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(NAME_KEY);
      if (saved && nameRef.current && !nameRef.current.value) nameRef.current.value = saved;
    } catch {
      /* storage blocked: the visitor just types it again */
    }
  }, []);

  useEffect(() => () => {
    if (photo) URL.revokeObjectURL(photo.url);
  }, [photo]);

  const left = MAX_MESSAGE - message.length;

  function pickPhoto(file: File | undefined) {
    if (!file) return;
    const problem = validatePhoto(file);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    setPhoto({ file, url: URL.createObjectURL(file) });
  }

  function clearPhoto() {
    setPhoto(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function share(e?: FormEvent) {
    e?.preventDefault();
    if (busy) return;
    const name = (nameRef.current?.value ?? "").trim();
    const problem = validateDraft({ name, message, hasPhoto: !!photo });
    if (problem) {
      setError(problem);
      return;
    }
    setBusy(true);
    setError(null);
    const supabase = getSupabase();
    try {
      let photo_url: string | null = null;
      if (photo) {
        const ext = photo.file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from(PHOTO_BUCKET)
          .upload(path, photo.file, { contentType: photo.file.type, cacheControl: "31536000" });
        if (uploadError) throw new Error("upload");
        photo_url = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl;
      }
      const { data, error: insertError } = await supabase
        .from("posts")
        .insert({ author_name: name, message: message.trim(), photo_url })
        .select("id, author_name, message, photo_url, created_at")
        .single();
      if (insertError || !data) throw new Error("insert");
      onPosted(data as Post);
      setMessage("");
      clearPhoto();
      try {
        window.localStorage.setItem(NAME_KEY, name);
      } catch {
        /* not fatal */
      }
    } catch (err) {
      setError(
        (err as Error).message === "upload"
          ? "Your photo couldn't be uploaded. Try a smaller image, or share without it."
          : "Your post couldn't be shared. Check your connection and try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) void share();
  }

  return (
    <form onSubmit={share} aria-label="Write on Raven's wall" className="rounded-none bg-card p-4 shadow-card sm:rounded-lg">
      <label htmlFor={`${id}-name`} className="sr-only">
        Your name
      </label>
      <input
        ref={nameRef}
        id={`${id}-name`}
        name="name"
        autoComplete="name"
        maxLength={MAX_NAME}
        placeholder="Your name"
        className="mb-2 w-full rounded-md border border-line px-3 py-2 text-[15px] placeholder:text-muted focus:border-blue focus:outline-none focus-visible:outline-none"
      />

      <label htmlFor={`${id}-message`} className="sr-only">
        Message
      </label>
      <textarea
        id={`${id}-message`}
        name="message"
        rows={3}
        value={message}
        maxLength={MAX_MESSAGE}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Write something to Raven…"
        aria-describedby={`${id}-count`}
        className="block w-full resize-none rounded-2xl bg-field px-4 py-3 text-[17px] leading-snug placeholder:text-muted focus:outline-none focus-visible:outline-2 focus-visible:outline-blue"
      />

      {photo && (
        <div className="relative mt-3 overflow-hidden rounded-lg border border-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo.url} alt="Selected photo preview" className="max-h-72 w-full bg-field object-contain" />
          <button
            type="button"
            onClick={clearPhoto}
            className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-card text-ink shadow-card hover:bg-hover"
            aria-label="Remove photo"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-2 text-[13px] font-semibold text-danger">
          {error}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3">
        <div className="flex items-center gap-3">
          <input
            ref={fileRef}
            id={`${id}-photo`}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="peer sr-only"
            onChange={(e) => pickPhoto(e.target.files?.[0])}
          />
          <label
            htmlFor={`${id}-photo`}
            className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-[15px] font-semibold text-muted hover:bg-hover peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue"
          >
            <ImagePlus className="size-6 text-[#45bd62]" strokeWidth={2} aria-hidden />
            Photo
          </label>
          <span
            id={`${id}-count`}
            className={`text-[13px] tabular-nums ${left < 0 ? "text-danger" : left <= 20 ? "font-semibold text-[#b26b00]" : "text-muted"}`}
            aria-live={left <= 20 ? "polite" : "off"}
          >
            {left} characters left
          </span>
        </div>
        <button
          type="submit"
          disabled={busy}
          className="flex min-w-24 items-center justify-center gap-2 rounded-md bg-blue px-5 py-2 text-[15px] font-semibold text-white hover:bg-blue-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
          {busy ? "Sharing…" : "Share"}
        </button>
      </div>
    </form>
  );
}
