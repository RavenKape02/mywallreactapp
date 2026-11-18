import { BriefcaseBusiness, FolderGit2, Globe, GraduationCap, House } from "lucide-react";

const ITEMS = [
  { icon: BriefcaseBusiness, text: "AI Engineer and full-stack developer" },
  { icon: GraduationCap, text: "Studies Computer Science at the University of the Philippines Los Baños" },
  { icon: House, text: "Lives in Los Baños, Laguna, Philippines" },
];

const LINKS = [
  { icon: Globe, href: "https://ravencaduyac.engineer", label: "ravencaduyac.engineer" },
  { icon: FolderGit2, href: "https://github.com/RavenKape02", label: "github.com/RavenKape02" },
];

export function IntroCard() {
  return (
    <section aria-labelledby="intro-heading" className="rounded-none bg-card p-4 shadow-card sm:rounded-lg">
      <h2 id="intro-heading" className="mb-3 text-xl font-bold">
        Intro
      </h2>
      <ul className="space-y-3 text-[15px]">
        {ITEMS.map(({ icon: Icon, text }) => (
          <li key={text} className="flex gap-3">
            <Icon className="mt-0.5 size-5 shrink-0 text-muted" strokeWidth={1.8} aria-hidden />
            <span>{text}</span>
          </li>
        ))}
        {LINKS.map(({ icon: Icon, href, label }) => (
          <li key={href} className="flex gap-3">
            <Icon className="mt-0.5 size-5 shrink-0 text-muted" strokeWidth={1.8} aria-hidden />
            <a href={href} className="break-all font-semibold text-blue hover:underline">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
