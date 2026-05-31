import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { PhoneShell, TopBar, StepHeader, StickyFooter } from "@/components/PhoneShell";
import { TagInput } from "@/components/TagInput";
import { HelpButton } from "@/components/HelpButton";
import { useCompass } from "@/lib/compass-store";
import { SUGGESTIONS } from "@/lib/minors";

export const Route = createFileRoute("/quiz/skills")({
  component: Page,
});

function Page() {
  const { state, toggle } = useCompass();
  const search = useSearch({ from: "/quiz/skills" }) as { from?: string };
  const backLink = search.from === "profiel" ? "/quiz/interesses?from=profiel" : "/quiz/interesses";
  return (
    <PhoneShell>
      <TopBar
        back={backLink}
        progress={2 / 4}
        right={
          <HelpButton
            title="SKILLS"
            description="Welke vaardigheden gebruik je graag tijdens projecten? Dit helpt ons minoren te vinden die aansluiten op jouw sterktes."
          />
        }
      />
      <StepHeader step={2} total={4} title="Skills" subtitle="Welke vaardigheden gebruik je graag tijdens projecten?" />
      <div className="px-5 mt-6 pb-32">
        <TagInput
          value={state.skills}
          onToggle={(v) => toggle("skills", v)}
          suggestions={SUGGESTIONS.skills}
          color="mint"
          tagBgColor="#575FCC"
          heroBgColor="#8ED8B4"
        />
      </div>
      <StickyFooter>
        <Link to={search.from === "profiel" ? "/quiz/leerdoelen?from=profiel" : "/quiz/leerdoelen"} className={`btn-pill btn-primary w-full ${state.skills.length === 0 ? "opacity-50 pointer-events-none" : ""}`}>
          Verder
        </Link>
      </StickyFooter>
    </PhoneShell>
  );
}
