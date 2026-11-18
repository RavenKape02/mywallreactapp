import { describe, expect, it } from "vitest";
import { initials, mergePosts, relativeTime, validateDraft, validatePhoto, type Post } from "./posts";

const post = (id: string, created_at: string): Post => ({ id, author_name: "A", message: "hi", photo_url: null, created_at });

describe("validateDraft", () => {
  it("needs a name", () => {
    expect(validateDraft({ name: "  ", message: "hi", hasPhoto: false })).toMatch(/name/);
  });
  it("needs a message or a photo", () => {
    expect(validateDraft({ name: "Ana", message: "   ", hasPhoto: false })).toMatch(/Write something/);
    expect(validateDraft({ name: "Ana", message: "", hasPhoto: true })).toBeNull();
  });
  it("enforces the 280 and 40 character limits", () => {
    expect(validateDraft({ name: "Ana", message: "x".repeat(280), hasPhoto: false })).toBeNull();
    expect(validateDraft({ name: "Ana", message: "x".repeat(281), hasPhoto: false })).toMatch(/280/);
    expect(validateDraft({ name: "x".repeat(41), message: "hi", hasPhoto: false })).toMatch(/40/);
  });
});

describe("validatePhoto", () => {
  it("accepts images up to 5 MB", () => {
    expect(validatePhoto({ type: "image/png", size: 1000 })).toBeNull();
    expect(validatePhoto({ type: "image/png", size: 6 * 1024 * 1024 })).toMatch(/5 MB/);
    expect(validatePhoto({ type: "application/pdf", size: 1000 })).toMatch(/JPG/);
  });
});

describe("mergePosts", () => {
  it("orders newest first and drops duplicates", () => {
    const a = post("a", "2026-11-18T01:00:00Z");
    const b = post("b", "2026-11-18T02:00:00Z");
    const merged = mergePosts([a, b], [b, post("c", "2026-11-18T03:00:00Z")]);
    expect(merged.map((p) => p.id)).toEqual(["c", "b", "a"]);
  });
  it("caps the feed", () => {
    const many = Array.from({ length: 60 }, (_, i) => post(String(i), new Date(Date.UTC(2026, 0, 1, 0, i)).toISOString()));
    expect(mergePosts([], many)).toHaveLength(50);
    expect(mergePosts([], many)[0].id).toBe("59");
  });
});

describe("relativeTime", () => {
  const now = Date.parse("2026-11-18T12:00:00Z");
  it("reads like a feed", () => {
    expect(relativeTime("2026-11-18T11:59:50Z", now)).toBe("Just now");
    expect(relativeTime("2026-11-18T11:55:00Z", now)).toBe("5m");
    expect(relativeTime("2026-11-18T09:00:00Z", now)).toBe("3h");
    expect(relativeTime("2026-11-16T12:00:00Z", now)).toBe("2d");
    expect(relativeTime("2026-10-01T12:00:00Z", now)).toMatch(/Oct 1, 2026/);
  });
});

describe("initials", () => {
  it("takes first and last initials", () => {
    expect(initials("Ada Lovelace")).toBe("AL");
    expect(initials("cher")).toBe("CH");
    expect(initials("  ")).toBe("?");
  });
});
