import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { X, Heart } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";
import { useCompass } from "@/lib/compass-store";

export const Route = createFileRoute("/verken-intro")({
  component: VerkenIntro,
});

function VerkenIntro() {
  const navigate = useNavigate();
  const { state, set } = useCompass();

  // If no quiz data, redirect back (shouldn't happen, but safety)
  if (state.interesses.length === 0) {
    navigate({ to: "/profiel" });
    return null;
  }

  const startExploring = () => {
    set("seenVerkenIntro", true);
    navigate({ to: "/verken" });
  };

  return (
    <PhoneShell bg="bg-mint/60">
      {/* Avatar Silhouette */}
      <div className="pt-8 pb-6 flex justify-center">
        <div className="w-24 h-24 rounded-full bg-mint/40 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-mint/30 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-mint/60" />
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="px-5 flex-1 flex flex-col justify-center pb-8">
        <div className="surface p-8 rounded-3xl">
          {/* Title */}
          <h1 className="text-3xl font-extrabold text-center">Verken minoren</h1>

          {/* Description */}
          <p className="text-center text-sm text-muted-foreground mt-4 leading-relaxed">
            Swipe door minoren om te ontdekken wat je leuk vind. Scroll elke kaart om er meer over te lezen.
          </p>

          {/* How it Works Section */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-center text-xs font-bold uppercase tracking-wide text-ink/70">
              Hoe werkt het?
            </p>

            <div className="mt-6 flex justify-around items-end">
              {/* Not Interested */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-indigo flex items-center justify-center">
                  <X size={28} className="text-white" />
                </div>
                <p className="text-xs text-center text-muted-foreground font-medium">
                  Swipe links voor <br />
                  <span className="text-ink font-semibold">niet interessant</span>
                </p>
              </div>

              {/* Interested */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-orange flex items-center justify-center">
                  <Heart size={28} className="text-white fill-white" />
                </div>
                <p className="text-xs text-center text-muted-foreground font-medium">
                  Swipe rechts voor <br />
                  <span className="text-ink font-semibold">wel interessant</span>
                </p>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={startExploring}
            className="btn-pill bg-ink text-white w-full mt-8 font-semibold"
          >
            Starten
          </button>
        </div>
      </div>
    </PhoneShell>
  );
}
