import { useState } from "react";
import { HelpCircle } from "lucide-react";

export function HelpButton({ title, description }: { title: string; description: string }) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowHelp(!showHelp)}
        style={{
          color: showHelp ? "#FF6C3C" : "rgb(97, 94, 90)",
        }}
        aria-label="Help"
      >
        <HelpCircle size={24} />
      </button>

      {showHelp && (
        <>
          <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-lg p-4 z-50">
            <h3 className="text-sm font-bold uppercase text-ink tracking-wide mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowHelp(false)}
          />
        </>
      )}
    </div>
  );
}
