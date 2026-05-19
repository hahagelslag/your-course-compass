import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { PhoneShell, TopBar, StepHeader, StickyFooter } from "@/components/PhoneShell";
import { TagInput } from "@/components/TagInput";
import { useCompass } from "@/lib/compass-store";
import { SUGGESTIONS } from "@/lib/minors";

export const Route = createFileRoute("/quiz/leerdoelen")({
  component: Page,
});

function Page() {
  const { state, toggle } = useCompass();
  const search = useSearch({ from: "/quiz/leerdoelen" }) as { from?: string };
  const backLink = search.from === "profiel" ? "/quiz/skills?from=profiel" : "/quiz/skills";
  return (
    <PhoneShell>
      <TopBar back={backLink} progress={3 / 4} />
      <StepHeader step={3} total={4} title="Leerdoelen" subtitle="Wat mis je nog in je huidige curriculum?" />
      <div className="px-5 mt-6 pb-32">
        <TagInput
          value={state.leerdoelen}
          onToggle={(v) => toggle("leerdoelen", v)}
          suggestions={SUGGESTIONS.leerdoelen}
          color="indigo"
          tagBgColor="#FF6C3C"
          heroBgColor="#739EF2"
        />
      </div>
      <StickyFooter>
        <Link to={search.from === "profiel" ? "/quiz/motivatie?from=profiel" : "/quiz/motivatie"} className={`btn-pill btn-primary w-full ${state.leerdoelen.length === 0 ? "opacity-50 pointer-events-none" : ""}`}>
          Verder
        </Link>
      </StickyFooter>
    </PhoneShell>
  );
}
