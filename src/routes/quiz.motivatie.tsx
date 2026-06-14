import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { PhoneShell, TopBar, StepHeader, StickyFooter } from "@/components/PhoneShell";
import { TagInput } from "@/components/TagInput";
import { HelpButton } from "@/components/HelpButton";
import { useCompass } from "@/lib/compass-store";
import { SUGGESTIONS } from "@/lib/minors";

export const Route = createFileRoute("/quiz/motivatie")({
  component: Page,
});

function Page() {
  const { state, toggle } = useCompass();
  const search = useSearch({ from: "/quiz/motivatie" }) as { from?: string };
  const backLink = search.from === "profiel" ? "/quiz/leerdoelen?from=profiel" : "/quiz/leerdoelen";
  return (
    <PhoneShell>
      <TopBar
        back={backLink}
        progress={4 / 4}
        right={
          <HelpButton
            title="HULP NODIG?"
            description="Denk aan wat jou energie geeft tijdens projecten, samenwerken of leren."
          />
        }
      />
      <StepHeader step={4} total={4} title="Motivatie" subtitle="Wat vind jij belangrijk in een minor?" />
      <div className="px-5 mt-6 pb-6">
        <TagInput
          value={state.motivatie}
          onToggle={(v) => toggle("motivatie", v)}
          suggestions={SUGGESTIONS.motivatie}
          color="sun"
          tagBgColor="#FAC049"
          heroBgColor="#575FCC"
          compassImage="/images/Kompasmintgroen.png"
          compassOpacity={0.5}
        />
      </div>
      <StickyFooter>
        <Link to="/quiz/overview" className={`btn-pill btn-primary w-full ${state.motivatie.length === 0 ? "opacity-50 pointer-events-none" : ""}`}>
          Verder
        </Link>
      </StickyFooter>
    </PhoneShell>
  );
}
