import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronDown, Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PhoneShell, TopBar } from "@/components/PhoneShell";
import { BottomNav } from "@/components/BottomNav";
import { HelpButton } from "@/components/HelpButton";
import { useCompass } from "@/lib/compass-store";
import { MINORS, type Minor } from "@/lib/minors";

export const Route = createFileRoute("/vergelijken")({
  component: Vergelijken,
});

function Vergelijken() {
  const navigate = useNavigate();
  const { state, setBattleChampion } = useCompass();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Initialize tournament with all liked minors shuffled
  const allLiked = MINORS.filter((m) => state.liked.includes(m.id));
  
  const [remaining, setRemaining] = useState<string[]>(() => {
    // Shuffle array
    const shuffled = [...allLiked].sort(() => Math.random() - 0.5);
    return shuffled.map((m) => m.id);
  });

  const [eliminationOrder, setEliminationOrder] = useState<string[]>([]);

  // Get current pair
  const currentPair = remaining.slice(0, 2);
  const [left, right] = currentPair.length === 2 
    ? [MINORS.find((m) => m.id === currentPair[0])!, MINORS.find((m) => m.id === currentPair[1])!]
    : [null, null];

  // Tournament finished when only 1 remains
  const isFinished = remaining.length === 1;
  const champion = isFinished ? MINORS.find((m) => m.id === remaining[0]) : null;

  const handleChoose = (winnerId: string, loserId: string) => {
    // Remove loser from tournament and track elimination
    setEliminationOrder((prev) => [...prev, loserId]);
    setRemaining((prev) => prev.filter((id) => id !== loserId));
  };

  // When tournament is finished, navigate back with champion highlighted
  useEffect(() => {
    if (isFinished && champion) {
      // Set champion and navigate back
      setBattleChampion(champion.id);
      navigate({ to: "/shortlist" });
    }
  }, [isFinished]);

  if (!left || !right) {
    return (
      <PhoneShell bg="bg-background">
        <TopBar
          back="/shortlist"
          right={
            <HelpButton
              title="VERGELIJKEN"
              description="Hier kun je je minoren tegen elkaar afzetten om de beste keuze te maken."
            />
          }
        />
        <div className="px-5 pt-5">
          <h1 className="text-3xl font-extrabold">Vergelijken</h1>
          <div className="surface p-8 text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Je hebt minstens 2 minoren nodig om te vergelijken.
            </p>
          </div>
        </div>
        <BottomNav />
      </PhoneShell>
    );
  }

  const selected = selectedId ? MINORS.find((m) => m.id === selectedId) : null;
  const roundsRemaining = Math.max(0, remaining.length - 1);

  return (
    <PhoneShell bg="bg-background">
      <TopBar
        back="/shortlist"
        right={
          <HelpButton
            title="VERGELIJKEN"
            description="Hier kun je je minoren tegen elkaar afzetten om de beste keuze te maken."
          />
        }
      />
      <div className="px-5 pt-5 pb-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold">Vergelijken</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Kies jouw favoriete minor in elke vergelijking.
          </p>
        </div>

        {/* Battle Cards */}
        <div className="mt-8 space-y-4">

          {/* Cards Grid with Animation */}
          <div className="grid grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={`left-${left.id}`}
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 200, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <BattleCard 
                  minor={left} 
                  onSelect={() => setSelectedId(left.id)}
                  isWinner={false}
                />
              </motion.div>

              <motion.div
                key={`right-${right.id}`}
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -200, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <BattleCard 
                  minor={right} 
                  onSelect={() => setSelectedId(right.id)}
                  isWinner={false}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Choice Buttons */}
          <motion.div 
            className="mt-8 grid grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={() => handleChoose(left.id, right.id)}
              className="btn-pill bg-orange text-white font-bold hover:bg-orange/90 active:scale-95 transition-transform"
            >
              {left.title.split(" ")[0]}
            </button>
            <button
              onClick={() => handleChoose(right.id, left.id)}
              className="btn-pill bg-orange text-white font-bold hover:bg-orange/90 active:scale-95 transition-transform"
            >
              {right.title.split(" ")[0]}
            </button>
          </motion.div>

          {/* Progress Bar */}
          <div className="mt-6 space-y-2">
            <div className="h-2 bg-ink/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-orange to-sun"
                initial={{ width: "100%" }}
                animate={{ width: `${(eliminationOrder.length / (allLiked.length - 1)) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {eliminationOrder.length} / {allLiked.length - 1} afgevallen
            </p>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <CompareModal 
          minor={selected} 
          onClose={() => setSelectedId(null)}
          expandedSection={expandedSection}
          setExpandedSection={setExpandedSection}
        />
      )}

      <BottomNav />
    </PhoneShell>
  );
}

function BattleCard({ minor, onSelect }: { minor: Minor; onSelect: () => void; isWinner: boolean }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className="surface p-4 rounded-2xl cursor-pointer hover:shadow-lg transition-shadow"
    >
      {/* Image */}
      <div className="h-32 rounded-xl mb-3 relative overflow-hidden" style={{ background: minor.image }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-2 left-2 text-xs font-bold bg-white/90 px-2 py-1 rounded-full">
          {minor.ec} EC
        </div>
      </div>

      {/* Info */}
      <h3 className="font-bold text-sm line-clamp-2">{minor.title}</h3>
      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{minor.tagline}</p>

      {/* Tags */}
      <div className="mt-2 flex flex-wrap gap-1">
        {minor.tags.slice(0, 2).map((t) => (
          <span key={t.label} className={`chip chip-${t.color} !py-0.5 !px-2 !text-xs`}>
            {t.label}
          </span>
        ))}
      </div>

      {/* Click Indicator */}
      <div className="mt-3 flex justify-center text-ink/40">
        <ChevronDown size={20} />
      </div>
    </motion.div>
  );
}

function CompareModal({
  minor,
  onClose,
  expandedSection,
  setExpandedSection,
}: {
  minor: Minor;
  onClose: () => void;
  expandedSection: string | null;
  setExpandedSection: (section: string | null) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-end z-50" onClick={onClose}>
      <motion.div
        className="w-full rounded-t-3xl max-h-[90vh] overflow-y-auto flex flex-col"
        style={{ backgroundColor: "#FFFFFF" }}
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 400 }}
        animate={{ y: 0 }}
        exit={{ y: 400 }}
      >
        {/* Header Image */}
        <div className="relative h-48 shrink-0" style={{ background: minor.image }}>
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center"
          >
            ✕
          </button>
          <div className="absolute bottom-0 right-0 bg-ink text-white px-3 py-1 rounded-tl-2xl text-sm font-semibold">
            Hanze
          </div>
        </div>

        {/* Details */}
        <div className="px-6 py-6 flex-1 overflow-y-auto scrollbar-custom">
          <h2 className="text-2xl font-extrabold">{minor.title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{minor.tagline}</p>

          {/* Quick Stats Grid */}
          <dl className="mt-4 grid grid-cols-4 gap-3 text-center">
            <div>
              <dt className="text-xs text-muted-foreground">EC</dt>
              <dd className="font-semibold">{minor.ec}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Taal</dt>
              <dd className="font-semibold text-xs">{minor.taal}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Plaats</dt>
              <dd className="font-semibold text-xs">{minor.plaats}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Niveau</dt>
              <dd className="font-semibold text-xs">{minor.niveau}</dd>
            </div>
          </dl>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {minor.tags.map((t) => (
              <span key={t.label} className={`chip chip-${t.color} !py-1 !px-2.5 !text-xs`}>
                {t.label}
              </span>
            ))}
          </div>

          {/* Accordions */}
          <div className="mt-6 space-y-0">
            {/* Over */}
            <div className="py-3 border-b border-border">
              <button
                onClick={() => setExpandedSection(expandedSection === "over" ? null : "over")}
                className="w-full flex items-center justify-between font-semibold text-left text-ink hover:text-ink/80"
              >
                Over
                <ChevronDown
                  size={20}
                  className={`transition-transform ${expandedSection === "over" ? "rotate-180" : ""}`}
                />
              </button>
              {expandedSection === "over" && (
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{minor.about}</p>
              )}
            </div>

            {/* Leerdoelen */}
            <div className="py-3 border-b border-border">
              <button
                onClick={() => setExpandedSection(expandedSection === "leerdoelen" ? null : "leerdoelen")}
                className="w-full flex items-center justify-between font-semibold text-left text-ink hover:text-ink/80"
              >
                Leerdoelen
                <ChevronDown
                  size={20}
                  className={`transition-transform ${expandedSection === "leerdoelen" ? "rotate-180" : ""}`}
                />
              </button>
              {expandedSection === "leerdoelen" && (
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {minor.leerdoelen.map((ld, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="shrink-0">•</span>
                      <span>{ld}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Ingangseisen */}
            <div className="py-3 border-b border-border">
              <button
                onClick={() => setExpandedSection(expandedSection === "ingangseisen" ? null : "ingangseisen")}
                className="w-full flex items-center justify-between font-semibold text-left text-ink hover:text-ink/80"
              >
                Ingangseisen
                <ChevronDown
                  size={20}
                  className={`transition-transform ${expandedSection === "ingangseisen" ? "rotate-180" : ""}`}
                />
              </button>
              {expandedSection === "ingangseisen" && (
                <p className="mt-3 text-sm text-muted-foreground">{minor.ingangseisen || "Geen specifieke eisen."}</p>
              )}
            </div>

            {/* Toetsing */}
            <div className="py-3 border-b border-border">
              <button
                onClick={() => setExpandedSection(expandedSection === "toetsing" ? null : "toetsing")}
                className="w-full flex items-center justify-between font-semibold text-left text-ink hover:text-ink/80"
              >
                Toetsing
                <ChevronDown
                  size={20}
                  className={`transition-transform ${expandedSection === "toetsing" ? "rotate-180" : ""}`}
                />
              </button>
              {expandedSection === "toetsing" && (
                <p className="mt-3 text-sm text-muted-foreground">{minor.toetsing || "Informatie niet beschikbaar."}</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
