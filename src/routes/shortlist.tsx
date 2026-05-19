import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Trash2, GitCompare, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PhoneShell, TopBar } from "@/components/PhoneShell";
import { BottomNav } from "@/components/BottomNav";
import { useCompass } from "@/lib/compass-store";
import { MINORS } from "@/lib/minors";

export const Route = createFileRoute("/shortlist")({
  component: Shortlist,
});

function Shortlist() {
  const { state, dislike, like, setBattleChampion } = useCompass();
  const [showTrash, setShowTrash] = useState(false);
  const liked = MINORS.filter((m) => state.liked.includes(m.id));
  const disliked = MINORS.filter((m) => state.disliked.includes(m.id));
  const isChampion = (id: string) => state.battleChampion === id;

  // Clear champion after showing
  useEffect(() => {
    if (state.battleChampion) {
      const timer = setTimeout(() => setBattleChampion(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [state.battleChampion, setBattleChampion]);

  return (
    <PhoneShell bg="bg-background">
      <TopBar
        right={
          <div className="ml-auto flex gap-2">
            {disliked.length > 0 && (
              <button 
                onClick={() => setShowTrash(true)}
                className="icon-btn !bg-muted-foreground" 
                aria-label="Prullenbak"
              >
                <Trash2 size={18} />
              </button>
            )}
            {liked.length >= 2 && (
              <Link to="/vergelijken" className="icon-btn !bg-orange" aria-label="Vergelijken">
                <GitCompare size={18} />
              </Link>
            )}
          </div>
        }
      />

      <div className="px-5">
        <h1 className="text-3xl font-extrabold">Jouw shortlist</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {liked.length} minor{liked.length === 1 ? "" : "en"} opgeslagen
        </p>

        <div className="mt-6 space-y-4 pb-8">
          {liked.length === 0 ? (
            <div className="surface p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-orange/15 inline-flex items-center justify-center mx-auto">
                <Heart size={28} className="text-orange" />
              </div>
              <h3 className="text-lg font-extrabold mt-4">Nog geen matches</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Zie je een minor die je aanspreekt? Swipe naar rechts om hem te bewaren.
              </p>
              <Link to="/verken" className="btn-pill btn-primary mt-5 inline-flex">
                Begin met verkennen
              </Link>
            </div>
          ) : (
            liked.map((m) => (
              <div 
                key={m.id} 
                className={`surface overflow-hidden transition-all ${isChampion(m.id) ? "ring-2 shadow-lg" : ""}`}
                style={isChampion(m.id) ? { "--tw-ring-color": "oklch(0.52 0.18 270)" } as React.CSSProperties : {}}
              >
                {isChampion(m.id) && (
                  <div className="px-4 py-2 flex items-center gap-2 text-white text-sm font-bold border-b" style={{ backgroundColor: "oklch(0.52 0.18 270)", borderColor: "oklch(0.52 0.18 270)" }}>
                    Jouw #1 keuze
                  </div>
                )}
                <Link to="/minor/$id" params={{ id: m.id }} className="block">
                  <div className="flex gap-4 p-4">
                    <div
                      className="w-20 h-20 rounded-2xl shrink-0"
                      style={{ background: m.image }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-extrabold text-lg leading-tight">{m.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">{m.tagline}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {m.tags.slice(0, 2).map((t) => (
                          <span key={t.label} className={`chip chip-${t.color} !py-1 !px-2.5 !text-xs`}>
                            {t.label}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        dislike(m.id);
                      }}
                      className="self-start text-muted-foreground hover:text-destructive transition-colors p-1"
                      aria-label="Verwijderen"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Trash Modal */}
      <AnimatePresence>
        {showTrash && (
          <div className="fixed inset-0 bg-black/40 flex items-end z-50" onClick={() => setShowTrash(false)}>
            <motion.div
              className="w-full bg-background rounded-t-3xl max-h-[90vh] overflow-y-auto flex flex-col"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 400 }}
              animate={{ y: 0 }}
              exit={{ y: 400 }}
            >
              {/* Header */}
              <div className="sticky top-0 px-6 py-4 border-b border-border">
                <h2 className="text-2xl font-extrabold">Verwijderde items</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {disliked.length} minor{disliked.length === 1 ? "" : "en"} verwijderd
                </p>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                {disliked.length === 0 ? (
                  <div className="py-10 text-center">
                    <p className="text-sm text-muted-foreground">Geen verwijderde items</p>
                  </div>
                ) : (
                  disliked.map((m) => (
                    <div key={m.id} className="surface p-4 flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-extrabold text-sm">{m.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{m.tagline}</p>
                      </div>
                      <button
                        onClick={() => {
                          like(m.id);
                        }}
                        className="ml-3 shrink-0 text-orange hover:text-orange/80 transition-colors p-1"
                        aria-label="Terugzetten"
                      >
                        <RotateCcw size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <BottomNav />
    </PhoneShell>
  );
}
