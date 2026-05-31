import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneShell, TopBar, StickyFooter } from "@/components/PhoneShell";
import { HelpButton } from "@/components/HelpButton";
import { useCompass } from "@/lib/compass-store";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

function Onboarding() {
  const { state, set } = useCompass();
  const valid = state.opleiding.trim() && state.jaar.trim();

  return (
    <PhoneShell>
      <TopBar
        back="/"
        right={
          <HelpButton
            title="WAAROM VRAGEN WE DIT?"
            description="We gebruiken deze gegevens om minoren te tonen die relevant zijn voor jouw opleiding en studiejaar."
          />
        }
      />
      <div className="px-5 mt-4">
        <h1 className="text-3xl font-extrabold">Over jou</h1>
        <p className="mt-2 text-muted-foreground">
          Een paar basisgegevens om je profiel op te bouwen.
        </p>

        <div className="mt-7 space-y-5">
          <Field label="Welke opleiding doe je?">
            <input
              className="ti"
              placeholder="Bijvoorbeeld: HBO-ICT"
              value={state.opleiding}
              onChange={(e) => set("opleiding", e.target.value)}
            />
          </Field>
          <Field label="In welk schooljaar zit je?">
            <div className="flex items-center justify-between px-5 py-3 bg-white rounded-full border border-border">
              <span className="text-lg font-semibold text-ink">
                {state.jaar || "1"}
              </span>
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => {
                    const current = parseInt(state.jaar) || 1;
                    if (current < 4) {
                      set("jaar", String(current + 1));
                    }
                  }}
                  className="w-6 h-6 flex items-center justify-center text-primary hover:text-primary/80 transition-colors text-sm"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const current = parseInt(state.jaar) || 1;
                    if (current > 1) {
                      set("jaar", String(current - 1));
                    }
                  }}
                  className="w-6 h-6 flex items-center justify-center text-primary hover:text-primary/80 transition-colors text-sm"
                >
                  ▼
                </button>
              </div>
            </div>
          </Field>
        </div>
      </div>

      <StickyFooter>
        {valid ? (
          <Link to="/start-mode" className="btn-pill btn-primary w-full">
            Verder
          </Link>
        ) : (
          <button disabled className="btn-pill btn-primary w-full" aria-disabled>
            Verder
          </button>
        )}
      </StickyFooter>
    </PhoneShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold uppercase tracking-wider text-ink/80 mb-2">
        {label}
      </span>
      {children}
    </label>
  );
}
