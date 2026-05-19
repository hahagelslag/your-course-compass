import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Heart, ChevronDown } from "lucide-react";
import { useState } from "react";
import { PhoneShell, TopBar } from "@/components/PhoneShell";
import { BottomNav } from "@/components/BottomNav";
import { MINORS } from "@/lib/minors";
import { useCompass } from "@/lib/compass-store";

export const Route = createFileRoute("/minor/$id")({
  component: MinorDetail,
  notFoundComponent: () => (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-extrabold">Minor niet gevonden</h1>
      <Link to="/verken" className="btn-pill btn-primary mt-5 inline-flex">Naar verkennen</Link>
    </div>
  ),
});

function MinorDetail() {
  const { id } = Route.useParams();
  const minor = MINORS.find((m) => m.id === id);
  const [expanded, setExpanded] = useState<string | null>(null);
  if (!minor) throw notFound();
  const { state, like, dislike } = useCompass();
  const isLiked = state.liked.includes(minor.id);

  const toggleExpanded = (section: string) => {
    setExpanded(expanded === section ? null : section);
  };

  return (
    <PhoneShell style={{ backgroundColor: "#FFFFFF" }}>
      <TopBar back="/shortlist" />
      
      <div className="px-5 pt-5 pb-8">
        {/* Header Image */}
        <div className="h-48 rounded-2xl mb-4 relative overflow-hidden" style={{ background: minor.image }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <button
            onClick={() => (isLiked ? dislike(minor.id) : like(minor.id))}
            className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center ${isLiked ? "bg-orange text-white" : "bg-white text-ink"}`}
            aria-label="Bewaar"
          >
            <Heart size={20} fill={isLiked ? "white" : "none"} />
          </button>
        </div>

        {/* Title & Tagline */}
        <h1 className="text-3xl font-extrabold">{minor.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{minor.tagline}</p>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {minor.tags.map((t) => (
            <span key={t.label} className={`chip chip-${t.color}`}>
              {t.label}
            </span>
          ))}
        </div>

        {/* Sections */}
        <div className="mt-6 space-y-0">
          {/* Over Section */}
          <div className="pb-3 border-b border-border">
            <p className="text-xs font-bold uppercase tracking-wider text-ink/70 mb-2">Over</p>
            <p className="text-sm text-ink/80 whitespace-pre-line">{minor.about}</p>
          </div>

          {/* Leerdoelen Accordion */}
          {minor.leerdoelen && minor.leerdoelen.length > 0 && (
            <div className="py-3 border-b border-border">
              <button
                onClick={() => toggleExpanded("leerdoelen")}
                className="w-full flex items-center justify-between py-2 px-0 hover:bg-transparent"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-ink/70">Leerdoelen</p>
                <ChevronDown size={20} className={`text-orange transition-transform ${expanded === "leerdoelen" ? "rotate-180" : ""}`} />
              </button>
              {expanded === "leerdoelen" && (
                <ul className="text-sm text-ink/80 list-disc list-inside space-y-1 mt-2">
                  {minor.leerdoelen.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Ingangseisen Accordion */}
          {minor.ingangseisen && (
            <div className="py-3 border-b border-border">
              <button
                onClick={() => toggleExpanded("ingangseisen")}
                className="w-full flex items-center justify-between py-2 px-0 hover:bg-transparent"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-ink/70">Ingangseisen</p>
                <ChevronDown size={20} className={`text-orange transition-transform ${expanded === "ingangseisen" ? "rotate-180" : ""}`} />
              </button>
              {expanded === "ingangseisen" && (
                <p className="text-sm text-ink/80 mt-2">{minor.ingangseisen}</p>
              )}
            </div>
          )}

          {/* Toetsing Accordion */}
          {minor.toetsing && (
            <div className="py-3 border-b border-border">
              <button
                onClick={() => toggleExpanded("toetsing")}
                className="w-full flex items-center justify-between py-2 px-0 hover:bg-transparent"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-ink/70">Toetsing</p>
                <ChevronDown size={20} className={`text-orange transition-transform ${expanded === "toetsing" ? "rotate-180" : ""}`} />
              </button>
              {expanded === "toetsing" && (
                <p className="text-sm text-ink/80 mt-2">{minor.toetsing}</p>
              )}
            </div>
          )}

          {/* Aanvullende Informatie Accordion */}
          {minor.aanvullendeInfo && (
            <div className="py-3 border-b border-border">
              <button
                onClick={() => toggleExpanded("aanvullendeInfo")}
                className="w-full flex items-center justify-between py-2 px-0 hover:bg-transparent"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-ink/70">Aanvullende Informatie</p>
                <ChevronDown size={20} className={`text-orange transition-transform ${expanded === "aanvullendeInfo" ? "rotate-180" : ""}`} />
              </button>
              {expanded === "aanvullendeInfo" && (
                <p className="text-sm text-ink/80 mt-2">{minor.aanvullendeInfo}</p>
              )}
            </div>
          )}

          {/* Details Section - Always Visible */}
          <div className="py-3 border-t border-border space-y-2.5">
            <div className="flex justify-between text-sm">
              <p className="text-ink/70 font-bold">Docent</p>
              <p className="font-normal">{minor.docent}</p>
            </div>
            <div className="flex justify-between text-sm">
              <p className="text-ink/70 font-bold">Opleiding</p>
              <p className="font-normal">{minor.opleiding}</p>
            </div>
            <div className="flex justify-between text-sm">
              <p className="text-ink/70 font-bold">Plaats</p>
              <p className="font-normal">{minor.plaats}</p>
            </div>
            <div className="flex justify-between text-sm">
              <p className="text-ink/70 font-bold">Niveau</p>
              <p className="font-normal">{minor.niveau}</p>
            </div>
            <div className="flex justify-between text-sm">
              <p className="text-ink/70 font-bold">Aantal EC</p>
              <p className="font-normal">{minor.ec},0</p>
            </div>
            <div className="flex justify-between text-sm">
              <p className="text-ink/70 font-bold">Taal</p>
              <p className="font-normal">{minor.taal}</p>
            </div>
            <div className="flex justify-between text-sm">
              <p className="text-ink/70 font-bold">Code</p>
              <p className="font-normal">{minor.code}</p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </PhoneShell>
  );
}
