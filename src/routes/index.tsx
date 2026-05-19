import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background relative">
      <div className="mx-auto w-full max-w-[440px] min-h-screen flex flex-col relative pb-80">
        {/* Hero compass illustration */}
        <div className="relative flex-1 flex items-center justify-center pt-0 pb-8 px-0">
          <CompassArt />
        </div>
      </div>

      {/* Welcome card - fixed at bottom */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-[440px] bg-white rounded-t-3xl p-10 text-center shadow-[0_-20px_50px_-20px_rgba(30,36,56,0.25)] py-12"
      >
        <h1 className="text-3xl font-extrabold">Welkom</h1>
        <p className="mt-2 text-base text-muted-foreground leading-snug">
          Deze tool helpt je om <span className="font-semibold text-ink">jouw minor</span> te ontdekken op basis van wat jij interessant vindt.
        </p>
        <Link to="/onboarding" className="btn-pill btn-primary w-full mt-6">
          Laten we beginnen
        </Link>
      </motion.div>
    </div>
  );
}

function CompassArt() {
  return (
    <div className="relative w-full h-full flex items-center justify-center -mx-32">
      <img 
        src="/images/testenofwerktlol.png" 
        alt="Keuzekompas Logo" 
        className="w-[100vw] h-auto"
      />
    </div>
  );
}

function Arrow({ className, color, rotate }: { className?: string; color: string; rotate: number }) {
  return (
    <svg
      width="60"
      height="100"
      viewBox="0 0 60 100"
      className={className}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <path d="M30 0 L60 40 L42 40 L42 100 L18 100 L18 40 L0 40 Z" fill={color} />
    </svg>
  );
}

function Star() {
  return (
    <svg width="160" height="160" viewBox="0 0 160 160">
      <path
        d="M80 0 L96 56 L160 64 L104 88 L120 160 L80 116 L40 160 L56 88 L0 64 L64 56 Z"
        fill="var(--ink)"
      />
      <circle cx="80" cy="80" r="9" fill="var(--cream)" />
    </svg>
  );
}
