import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { useCompass } from "@/lib/compass-store";

export const Route = createFileRoute("/quiz/overview")({
  component: QuizOverview,
});

function QuizOverview() {
  const { state } = useCompass();

  return (
    <PhoneShell bg="bg-background">
      <div className="px-5 pt-5 pb-32">
        <div className="surface p-6 text-center">
          <h1 className="text-3xl font-extrabold">Jouw profiel</h1>
          <p className="mt-2 text-muted-foreground">
            Hier is een samenvatting van wat je hebt ingesteld.
          </p>
        </div>

        <p className="mt-7 text-xs font-bold uppercase tracking-wider text-ink/80 text-center">
          Dit vind je belangrijk
        </p>

        <div className="mt-4 space-y-4">
          <Group title="Je interesses" tags={state.interesses} color="mint" />
          <Group title="Je sterke punten" tags={state.skills} color="indigo" />
          <Group title="Je leerdoelen" tags={state.leerdoelen} color="orange" />
          <Group title="Je motivatie" tags={state.motivatie} color="sun" />
        </div>

        <div className="mt-8">
          <Link to="/verken-intro" className="btn-pill btn-primary w-full">
            Ga naar verkennen
          </Link>
        </div>
      </div>
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
