import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "motion/react";
import { ChevronDown } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";
import { BottomNav } from "@/components/BottomNav";
import { MINORS, type Minor } from "@/lib/minors";
import { useCompass } from "@/lib/compass-store";

export const Route = createFileRoute("/verken")({
  component: Verken,
});

function Verken() {
  const navigate = useNavigate();
  const { state, like, dislike } = useCompass();
  
  // Redirect to intro if not seen yet (only once)
  if (!state.seenVerkenIntro && state.interesses.length > 0) {
    navigate({ to: "/verken-intro", replace: true });
    return null;
  }

  // Check if user has liked 5 minors since last reality check
  if (state.likedSinceRealityCheck >= 5) {
    navigate({ to: "/reality-check", replace: true });
    return null;
  }

  const [idx, setIdx] = useState(0);
  const queue = MINORS;
  const card = queue[idx];

  const next = () => setIdx((i) => Math.min(i + 1, queue.length));

  const swipe = (dir: 1 | -1) => {
    if (!card) return;
    if (dir === 1) like(card.id);
    else dislike(card.id);
    next();
  };

  return (
    <PhoneShell bg="bg-background">
      <div className="relative flex-1 min-h-0">
        <AnimatePresence>
          {card ? (
            <SwipeCard key={card.id} minor={card} onSwipe={swipe} />
          ) : (
            <EmptyState liked={state.liked.length} />
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </PhoneShell>
  );
}

function SwipeCard({ minor, onSwipe }: { minor: Minor; onSwipe: (dir: 1 | -1) => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [swipeDir, setSwipeDir] = useState<1 | -1 | null>(null);
  
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 120) {
      setSwipeDir(1);
      onSwipe(1);
    } else if (info.offset.x < -120) {
      setSwipeDir(-1);
      onSwipe(-1);
    }
  };

  const toggleExpanded = (section: string) => {
    setExpanded(expanded === section ? null : section);
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={onDragEnd}
      initial={{ scale: 0.95, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ x: swipeDir === 1 ? 400 : -400, opacity: 0, rotate: swipeDir === 1 ? 18 : -18 }}
      transition={{ type: "spring", stiffness: 240, damping: 26 }}
      className="absolute inset-x-5 top-4 bottom-4 surface overflow-hidden cursor-grab active:cursor-grabbing flex flex-col rounded-3xl"
      style={{ touchAction: "pan-y" }}
    >
      {/* Header Image */}
      <div className="h-48 relative flex-shrink-0" style={{ background: minor.image }}>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-4 left-4 inline-flex items-center gap-2 bg-white rounded-pill px-3 py-1.5">
          <div className="w-5 h-5 rounded-full bg-orange" />
          <span className="text-xs font-bold">Hanze</span>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-custom">
        <h2 className="text-2xl font-extrabold">{minor.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{minor.tagline}</p>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {minor.tags.map((t) => (
            <span key={t.label} className={`chip chip-${t.color}`}>
              {t.label}
            </span>
          ))}
        </div>

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
    </motion.div>
  );
}

function EmptyState({ liked }: { liked: number }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
      <div className="surface p-8 text-center max-w-xs">
        <h3 className="text-xl font-extrabold">Klaar met verkennen!</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Je hebt {liked} minor{liked === 1 ? "" : "en"} bewaard.
        </p>
        <Link to="/shortlist" className="btn-pill btn-orange mt-5 inline-flex">
          Bekijk shortlist
        </Link>
      </div>
    </div>
  );
}
