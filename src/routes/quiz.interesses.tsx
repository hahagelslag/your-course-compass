import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { PhoneShell, TopBar, StepHeader, StickyFooter } from "@/components/PhoneShell";
import { TagInput } from "@/components/TagInput";
import { HelpButton } from "@/components/HelpButton";
import { useCompass } from "@/lib/compass-store";
import { SUGGESTIONS } from "@/lib/minors";

export const Route = createFileRoute("/quiz/interesses")({
  component: Page,
});

function Page() {
  const { state, toggle } = useCompass();
  const search = useSearch({ from: "/quiz/interesses" }) as { from?: string };
  const backLink = search.from === "profiel" ? "/profiel" : "/start-mode";
  return (
    <PhoneShell>
      <TopBar
        back={backLink}
        progress={1 / 4}
        right={
          <HelpButton
            title="INTERESSES"
            description="Welke onderwerpen binnen je huidige studie spreken je aan? Dit helpt ons minoren te vinden die bij je passen."
          />
        }
      />
      <StepHeader
        step={1}
        total={4}
        title="Intresses"
        subtitle="Welke onderwerpen binnen je huidige studie spreken je aan?"
      />
      <div className="px-5 mt-6 pb-32">
        <TagInput
          value={state.interesses}
          onToggle={(v) => toggle("interesses", v)}
          suggestions={SUGGESTIONS.interesses}
          color="orange"
          tagBgColor="#8CD4A6"
          heroBgColor="#FF6C3C"
        />
      </div>
      <StickyFooter>
        <Link
          to="/quiz/skills"
          search={search.from === "profiel" ? { from: "profiel" } : {}}
          className={`btn-pill btn-primary w-full ${state.interesses.length === 0 ? "opacity-50 pointer-events-none" : ""}`}
        >
          Verder
        </Link>
      </StickyFooter>
    </PhoneShell>
  );
}
