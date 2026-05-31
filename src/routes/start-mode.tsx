import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PhoneShell, TopBar } from "@/components/PhoneShell";
import { HelpButton } from "@/components/HelpButton";
import { useCompass } from "@/lib/compass-store";

export const Route = createFileRoute("/start-mode")({
  component: StartMode,
});

function StartMode() {
  const { state, set } = useCompass();
  const nav = useNavigate();

  return (
    <PhoneShell>
      <TopBar
        back="/onboarding"
        right={
          <HelpButton
            title="KAN IK LATER WISSELEN?"
            description="Ja, je kunt later altijd opnieuw beginnen en een andere route kiezen."
          />
        }
      />
      <div className="px-5 mt-4">
        <h1 className="text-3xl font-extrabold leading-tight">Hoe wil je beginnen?</h1>
        <p className="mt-2 text-muted-foreground">
          Selecteer de optie die het best bij jou past.
        </p>

        <div className="mt-7 space-y-4">
          <button
            onClick={() => {
              set("mode", "reflect");
              nav({ to: "/reflecteer-intro" });
            }}
            className="relative flex flex-col justify-start items-start w-full overflow-hidden rounded-3xl text-left p-6 h-80 transition-transform active:scale-[0.98]"
            style={{ background: "linear-gradient(160deg, var(--mint), oklch(0.78 0.1 165))" }}
          >
            <div className="absolute right-4 -bottom-2 w-28 h-44 rounded-t-full" style={{ background: "var(--orange)" }} />
            <h3 className="text-2xl font-extrabold text-white relative z-10">Reflecteer eerst</h3>
            <p className="mt-1 text-white italic relative z-10">"Ik weet al een beetje wat ik zoek"</p>
          </button>

          <button
            disabled
            className="relative flex flex-col justify-start items-start w-full overflow-hidden rounded-3xl text-left p-6 h-80 transition-transform opacity-50 cursor-not-allowed"
            style={{ background: "linear-gradient(160deg, var(--sun), oklch(0.78 0.13 60))" }}
          >
            <div className="absolute right-4 -bottom-2 w-28 h-44 rounded-t-full" style={{ background: "var(--orange)" }} />
            <h3 className="text-2xl font-extrabold text-white relative z-10">Verken eerst</h3>
            <p className="mt-1 text-white italic relative z-10">"Ik wil eerst ontdekken wat er is"</p>
          </button>
        </div>
      </div>
    </PhoneShell>
  );
}
