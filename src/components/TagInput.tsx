import { useState, KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";
import type { ChipColor } from "@/lib/compass-store";

type Props = {
  value: string[];
  onToggle: (v: string) => void;
  suggestions: string[];
  color: ChipColor;
  placeholder?: string;
  tagBgColor?: string;
  heroBgColor?: string;
  compassImage?: string;
  compassOpacity?: number;
};

const CHIP_BG: Record<ChipColor, string> = {
  mint: "chip-mint",
  orange: "chip-orange",
  sun: "chip-sun",
  indigo: "chip-indigo",
};

const HERO_BG: Record<ChipColor, string> = {
  mint: "bg-mint",
  orange: "bg-orange",
  sun: "bg-sun",
  indigo: "bg-indigo",
};

export function TagInput({ value, onToggle, suggestions, color, placeholder = "Type en druk op enter…", tagBgColor, heroBgColor, compassImage, compassOpacity = 0.3 }: Props) {
  const [draft, setDraft] = useState("");

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && draft.trim()) {
      e.preventDefault();
      onToggle(draft.trim());
      setDraft("");
    }
  };

  return (
    <div className="space-y-5">
      {/* Hero bubble of selected tags */}
      <div
        className={`relative rounded-3xl p-5 min-h-[120px] overflow-hidden ${!heroBgColor ? HERO_BG[color] : ""}`}
        style={heroBgColor ? { backgroundColor: heroBgColor } : {}}
      >
        {compassImage && (
          <img
            src={compassImage}
            alt=""
            className="absolute right-0 top-1/2 transform -translate-y-1/2 w-48 h-48 object-contain pointer-events-none"
            style={{ opacity: compassOpacity }}
          />
        )}
        <div className="relative flex flex-wrap gap-2 z-10">
          {value.length === 0 && (
            <p className="text-sm/relaxed font-medium text-ink/70">
              Tik hieronder een woord in of kies uit de inspiratie.
            </p>
          )}
          {value.map((v) => (
            <button
              key={v}
              onClick={() => onToggle(v)}
              className="inline-flex items-center gap-1.5 rounded-pill px-3.5 py-1.5 text-sm font-semibold shadow-sm"
              style={{
                backgroundColor: tagBgColor || "#ffffff",
                color: "white"
              }}
            >
              {v}
              <X size={14} />
            </button>
          ))}
        </div>
      </div>

      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKey}
        placeholder={placeholder}
        className="ti"
      />

      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-ink/80 mb-3 inline-flex items-center gap-1.5">
          <Plus size={14} /> Inspiratie
        </p>
        <div className="flex flex-wrap gap-2">
          {suggestions.filter(s => !value.includes(s)).map((s) => (
            <button
              key={s}
              onClick={() => onToggle(s)}
              className="chip"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
