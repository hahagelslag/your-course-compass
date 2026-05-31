import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PhoneShell } from "@/components/PhoneShell";
import { useCompass } from "@/lib/compass-store";
import { MINORS } from "@/lib/minors";
import { useEffect, useState, useMemo } from "react";

export const Route = createFileRoute("/reality-check")({
  component: RealityCheck,
});

type ReflectionCategory = "interesses" | "skills" | "leerdoelen" | "motivatie";

function RealityCheck() {
  const navigate = useNavigate();
  const { state, resetRealityCheckCounter } = useCompass();
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ReflectionCategory>(
    "interesses"
  );

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
          <p className="mt-4 text-sm text-ink/70">
            Je hebt {likedMinors.length} minoren bewaard. Tijd voor een korte check.
          </p>
        </div>

        {/* Insight Card */}
        {insight && (
          <div
            className="rounded-3xl p-6 mb-8 text-white relative z-10"
            style={{ background: "#FFC107" }}
          >
            <p className="text-xs font-bold uppercase tracking-wider text-amber-950 mb-3">
              Inzicht
            </p>
            <p className="text-base font-semibold leading-relaxed text-amber-950">
              {insight}
            </p>
          </div>
        )}

        {/* Actual choices from swiping */}
        <div className="surface p-6 rounded-3xl mb-8 relative z-10">
          <p className="text-xs font-bold uppercase tracking-wider text-ink/70 mb-4">
            Thema's die je koos
          </p>
          <div className="flex flex-wrap gap-2">
            {themes.length > 0 ? (
              themes.map((theme) => (
                <span
                  key={theme}
                  className="inline-flex items-center rounded-pill bg-primary text-white px-4 py-2 text-sm font-semibold"
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

        {/* Reflection Categories - Tab Layout */}
        <div className="surface p-6 rounded-3xl mb-8 relative z-10">
          <p className="text-xs font-bold uppercase tracking-wider text-ink/70 mb-4">
            Jouw reflectie
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            <CategoryBadge
              label="INTERESSES"
              isActive={selectedCategory === "interesses"}
              onClick={() => setSelectedCategory("interesses")}
              color="mint"
            />
            <CategoryBadge
              label="SKILLS"
              isActive={selectedCategory === "skills"}
              onClick={() => setSelectedCategory("skills")}
              color="indigo"
            />
            <CategoryBadge
              label="DOELEN"
              isActive={selectedCategory === "leerdoelen"}
              onClick={() => setSelectedCategory("leerdoelen")}
              color="orange"
            />
            <CategoryBadge
              label="MOTIVATIE"
              isActive={selectedCategory === "motivatie"}
              onClick={() => setSelectedCategory("motivatie")}
              color="sun"
            />
          </div>

          {/* Selected Category Content */}
          <div className="pt-4 border-t border-ink/10">
            {selectedCategory === "interesses" && (
              <CategoryContent title="JE INTERESSES" tags={state.interesses} color="mint" />
            )}
            {selectedCategory === "skills" && (
              <CategoryContent title="JE STERKE PUNTEN" tags={state.skills} color="indigo" />
            )}
            {selectedCategory === "leerdoelen" && (
              <CategoryContent title="JE LEERDOELEN" tags={state.leerdoelen} color="orange" />
            )}
            {selectedCategory === "motivatie" && (
              <CategoryContent title="JE MOTIVATIE" tags={state.motivatie} color="sun" />
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 relative z-10">
          <p className="text-xs font-bold uppercase tracking-wider text-ink/70 mb-4 text-left">
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

function CategoryBadge({
  label,
  isActive,
  onClick,
  color,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
  color: "mint" | "indigo" | "orange" | "sun";
}) {
  const colorMap = {
    mint: "bg-mint text-white",
    indigo: "bg-indigo text-white",
    orange: "bg-orange text-white",
    sun: "bg-sun text-white",
  };

  const darkColorMap = {
    mint: "bg-mint text-white brightness-90",
    indigo: "bg-indigo text-white brightness-90",
    orange: "bg-orange text-white brightness-90",
    sun: "bg-sun text-white brightness-90",
  };

  const baseClasses =
    "px-3 py-1.5 rounded-full font-semibold text-xs cursor-pointer transition-colors";
  const activeClasses = isActive ? darkColorMap[color] : colorMap[color];

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${activeClasses}`}
    >
      {label}
    </button>
  );
}

function CategoryContent({
  title,
  tags,
  color,
}: {
  title: string;
  tags: string[];
  color: "mint" | "indigo" | "orange" | "sun";
}) {
  const colorMap = {
    mint: "bg-mint text-white",
    indigo: "bg-indigo text-white",
    orange: "bg-orange text-white",
    sun: "bg-sun text-white",
  };

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-ink/70 mb-4">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <span
              key={tag}
              className={`inline-flex items-center rounded-pill ${colorMap[color]} px-4 py-2 text-sm font-semibold`}
            >
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
