import { initials } from "@/lib/posts";

// Muted fills for visitors' initials, chosen by name so the same person keeps the same colour.
const FILLS = ["#e4e6eb", "#dbe7ff", "#ffe2d6", "#dff3e4", "#f1e1ff", "#fff1c2"];
const INKS = ["#3a3b3c", "#0a3d91", "#8a3510", "#1d5c33", "#5b2a86", "#6b4e00"];

function hash(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0;
  return Math.abs(h);
}

export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  // Posts carry a typed name only, so nobody gets the owner's photo by typing "Raven".
  const i = hash(name.trim().toLowerCase()) % FILLS.length;
  return (
    <span
      aria-hidden
      className="grid shrink-0 place-items-center rounded-full font-semibold"
      style={{ width: size, height: size, background: FILLS[i], color: INKS[i], fontSize: size * 0.38 }}
    >
      {initials(name)}
    </span>
  );
}
