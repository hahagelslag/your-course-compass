import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { useCompass } from "@/lib/compass-store";
import { MINORS } from "@/lib/minors";
import { useEffect, useState, useMemo } from "react";

export const Route = createFileRoute("/reality-check")({
  component: RealityCheck,
});

function RealityCheck() {
  const navigate = useNavigate();
  const { state, resetRealityCheckCounter } = useCompass();
  const [mounted, setMounted] = useState(false);

  // Reset counter when component mounts so user can continue swiping
  useEffect(() => {
    resetRealityCheckCounter();
    setMounted(true);
  }, [resetRealityCheckCounter]);

  // Get liked minors - memoized to prevent unnecessary recalculations
  const likedMinors = useMemo(
    () => MINORS.filter((m) => state.liked.includes(m.id)),
    [state.liked]
  );

  // Extract themes - memoized to stay stable
  const themes = useMemo(() => extractThemes(likedMinors), [likedMinors]);

  // Generate insight ONCE and keep it stable - memoized
  const insight = useMemo(
    () => generateInsight(likedMinors, state, themes),
    [likedMinors, state, themes]
  );

  const handleContinueExploring = () => {
    navigate({ to: "/verken" });
  };

  const handleEditReflection = () => {
    navigate({ to: "/profiel" });
  };

  return (
    <PhoneShell bg="bg-background">
      <div className="px-5 pt-5 pb-12 relative">
        {/* Header */}
        <div className="relative z-10 mb-8 text-center">
          <h1 className="text-3xl font-extrabold">Wat valt op?</h1>
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-ink/70">
            Wat zei dat je belangrijk vond
          </p>
        </div>

        {/* Profile Summary Cards */}
        <div className="space-y-4 mb-8 relative z-10">
          <ProfileCard
            title="Je interesses"
            tags={state.interesses}
            color="mint"
          />
          <ProfileCard
            title="Je sterke punten"
            tags={state.skills}
            color="indigo"
          />
          <ProfileCard
            title="Je leerdoelen"
            tags={state.leerdoelen}
            color="orange"
          />
          <ProfileCard
            title="Je motivatie"
            tags={state.motivatie}
            color="sun"
          />
        </div>

        {/* Actual choices from swiping */}
        <div className="surface p-6 rounded-3xl mb-8 relative z-10">
          <p className="text-xs font-bold uppercase tracking-wider text-ink/70 mb-4">
            Welke thema's je daadwerkelijk koos
          </p>
          <div className="flex flex-wrap gap-2">
            {themes.length > 0 ? (
              themes.map((theme) => (
                <span
                  key={theme}
                  className="inline-flex items-center rounded-pill bg-ink text-white px-4 py-2 text-sm font-semibold"
                >
                  {theme}
                </span>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">
                Begin met swipen om je themes te ontdekken
              </span>
            )}
          </div>
        </div>

        {/* Insight Card */}
        {insight && (
          <div
            className="rounded-3xl p-6 mb-8 text-white relative z-10"
            style={{ background: "#FF6C3C" }}
          >
            <p className="text-base font-semibold leading-relaxed">
              {insight}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 relative z-10">
          <p className="text-xs font-bold uppercase tracking-wider text-ink/70 mb-4 text-center">
            Hoe wil je verder?
          </p>

          <button
            onClick={handleContinueExploring}
            className="btn-pill btn-primary w-full"
          >
            Ga verder met deze matches
          </button>

          <button className="btn-pill w-full font-semibold text-ink bg-gray-200 hover:bg-gray-300 transition-colors">
            Toon opties dichter bij interesses
          </button>

          <button
            onClick={handleEditReflection}
            className="btn-pill w-full font-semibold text-ink bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            Pas mijn reflectie aan
          </button>
        </div>
      </div>
    </PhoneShell>
  );
}

function ProfileCard({
  title,
  tags,
  color,
}: {
  title: string;
  tags: string[];
  color: "mint" | "indigo" | "orange" | "sun";
}) {
  const colorMap = {
    mint: "chip-mint",
    indigo: "chip-indigo",
    orange: "chip-orange",
    sun: "chip-sun",
  };

  return (
    <div className="surface p-6 rounded-3xl">
      <p className="text-xs font-bold uppercase tracking-wider text-ink/70 mb-4">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <span key={tag} className={`chip ${colorMap[color]} text-sm font-semibold`}>
              {tag}
            </span>
          ))
        ) : (
          <span className="text-sm text-muted-foreground italic">
            Nog niet ingevuld
          </span>
        )}
      </div>
    </div>
  );
}

function extractThemes(minors: typeof MINORS): string[] {
  const themeMap: Record<string, number> = {};

  minors.forEach((minor) => {
    const theme = minor.thema;
    themeMap[theme] = (themeMap[theme] || 0) + 1;
  });

  // Return top themes
  return Object.entries(themeMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([theme]) => theme);
}

function generateInsight(
  likedMinors: typeof MINORS,
  state: any,
  themes: string[]
): string | null {
  if (likedMinors.length === 0) return null;

  const insights = [
    `Je koos opvallend vaak ${themes[0]?.toLowerCase() || "creatieve"} vakken — precies waar je goed in bent.`,
    `Interessant: je interesse in "${state.interesses[0]}" weerspiegelt zich duidelijk in je keuzes.`,
    `Je sterke punten in "${state.skills[0]}" helpen je bij de minoren die je selecteerde.`,
    `De thema's die je koos (${themes.slice(0, 2).join(", ")}) passen perfect bij jouw motivatie.`,
    `Je leerdoel "${state.leerdoelen[0]}" zie je terug in bijna alles wat je koos.`,
    `Opvallend: je hebt vaak minoren gekozen met "${themes[0]}" ondanks verschillende achtergronden.`,
  ];

  // Use liked minors length as deterministic index to always get same insight
  const index = likedMinors.length % insights.length;
  return insights[index];
}
