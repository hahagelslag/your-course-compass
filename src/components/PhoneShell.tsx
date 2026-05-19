import { Link } from "@tanstack/react-router";
import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

export function PhoneShell({
  children,
  bg = "bg-background",
}: {
  children: ReactNode;
  bg?: string;
}) {
  return (
    <div className={`min-h-screen ${bg} relative`}>
      <div className="mx-auto w-full max-w-[440px] min-h-screen flex flex-col relative">
        {children}
      </div>
    </div>
  );
}

export function TopBar({
  back,
  progress,
  right,
}: {
  back?: string | (() => void);
  progress?: number; // 0..1
  right?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 px-5 pt-6 pb-2">
      {back !== undefined &&
        (typeof back === "string" ? (
          <Link to={back} className="icon-btn shrink-0" aria-label="Terug">
            <ArrowLeft size={20} />
          </Link>
        ) : (
          <button onClick={back} className="icon-btn shrink-0" aria-label="Terug">
            <ArrowLeft size={20} />
          </button>
        ))}
      {progress !== undefined && (
        <div className="flex-1 h-2 rounded-pill bg-secondary overflow-hidden">
          <div
            className="h-full rounded-pill"
            style={{
              width: `${Math.max(0, Math.min(1, progress)) * 100}%`,
              background: "linear-gradient(90deg, var(--orange), var(--sun))",
            }}
          />
        </div>
      )}
      {right}
    </div>
  );
}

export function StepHeader({ step, total, title, subtitle }: { step: number; total: number; title: string; subtitle?: string }) {
  return (
    <div className="px-5 mt-4">
      <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
        Stap {step} van {total}
      </p>
      <h1 className="text-3xl font-extrabold mt-1">{title}</h1>
      {subtitle && <p className="mt-2 text-base text-muted-foreground leading-snug">{subtitle}</p>}
    </div>
  );
}

export function StickyFooter({ children }: { children: ReactNode }) {
  return (
    <div className="mt-auto sticky bottom-0 px-5 pb-6 pt-4 bg-gradient-to-t from-background via-background to-transparent">
      {children}
    </div>
  );
}
