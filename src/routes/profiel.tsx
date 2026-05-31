import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneShell, TopBar } from "@/components/PhoneShell";
import { BottomNav } from "@/components/BottomNav";
import { HelpButton } from "@/components/HelpButton";
import { useCompass } from "@/lib/compass-store";

export const Route = createFileRoute("/profiel")({
  component: Profiel,
});

function Profiel() {
  const { state, reset } = useCompass();

  return (
    <PhoneShell bg="bg-background">
      <TopBar
        back="/"
        right={
          <HelpButton
            title="JOUW PROFIEL"
            description="Dit is je samenvatting. Je kunt altijd terugkomen om je antwoorden aan te passen."
          />
        }
      />
      <div className="px-5 pt-5 pb-8">
        <div className="surface p-6 text-center">
          <h1 className="text-3xl font-extrabold">Jouw profiel</h1>
          <div className="mt-4 flex justify-center gap-2">
            <Link 
              to="/quiz/interesses" 
              search={{ from: "profiel" }}
              className="px-4 py-2 rounded-pill text-cream font-semibold"
              style={{ backgroundColor: "oklch(0.18 0.04 255)" }}
            >
              Edit profiel
            </Link>
            <button
              onClick={() => {
                reset();
                window.location.href = "/";
              }}
              className="chip"
            >
              Begin opnieuw
            </button>
          </div>
        </div>

        <p className="mt-7 text-xs font-bold uppercase tracking-wider text-ink/80 text-center">
          Dit vind je belangrijk
        </p>

        <div className="mt-4 space-y-4">
          <Group title="Je intresses" tags={state.interesses} color="mint" />
          <Group title="Je sterke punten" tags={state.skills} color="indigo" />
          <Group title="Je leerdoelen" tags={state.leerdoelen} color="orange" />
          <Group title="Je motivatie" tags={state.motivatie} color="sun" />
        </div>

      </div>
      <BottomNav />
    </PhoneShell>
  );
}

function Group({ title, tags, color }: { title: string; tags: string[]; color: "mint" | "indigo" | "orange" | "sun" }) {
  const cls = {
    mint: "chip-mint",
    indigo: "chip-indigo",
    orange: "chip-orange",
    sun: "chip-sun",
  }[color];
  return (
    <div className="surface p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-ink/70 mb-3">{title}</p>
      <div className="flex flex-wrap gap-2">
        {tags.length === 0 ? (
          <span className="text-sm text-muted-foreground">Nog niet ingevuld</span>
        ) : (
          tags.map((t) => (
            <span key={t} className={`chip ${cls}`}>
              {t}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
