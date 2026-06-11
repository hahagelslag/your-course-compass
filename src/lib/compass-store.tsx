import { ReactNode, createContext, useContext, useState } from "react";

export type ChipColor = "mint" | "orange" | "sun" | "indigo";

export type CompassState = {
  name: string;
  opleiding: string;
  jaar: string;
  mode: "reflect" | "explore" | null;
  interesses: string[];
  skills: string[];
  leerdoelen: string[];
  motivatie: string[];
  liked: string[]; // minor ids
  disliked: string[];
  seenVerkenIntro: boolean;
  likedSinceRealityCheck: number;
  battleChampion: string | null; // winner of battle tournament
  currentVerkenIndex: number; // track position in verken card stack
};

const DEFAULT: CompassState = {
  name: "",
  opleiding: "",
  jaar: "",
  mode: null,
  interesses: [],
  skills: [],
  leerdoelen: [],
  motivatie: [],
  liked: [],
  disliked: [],
  seenVerkenIntro: false,
  likedSinceRealityCheck: 0,
  battleChampion: null,
  currentVerkenIndex: 0,
};

const Ctx = createContext<{
  state: CompassState;
  set: <K extends keyof CompassState>(k: K, v: CompassState[K]) => void;
  toggle: (k: "interesses" | "skills" | "leerdoelen" | "motivatie", v: string) => void;
  like: (id: string) => void;
  dislike: (id: string) => void;
  reset: () => void;
  resetRealityCheckCounter: () => void;
  setBattleChampion: (id: string | null) => void;
} | null>(null);

export function CompassProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CompassState>(() => {
    if (typeof window === "undefined") return DEFAULT;
    try {
      const raw = localStorage.getItem("kk:state");
      return raw ? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT;
    } catch {
      return DEFAULT;
    }
  });

  const persist = (next: CompassState) => {
    setState(next);
    try {
      localStorage.setItem("kk:state", JSON.stringify(next));
    } catch {}
  };

  return (
    <Ctx.Provider
      value={{
        state,
        set: (k, v) => persist({ ...state, [k]: v }),
        toggle: (k, v) => {
          const arr = state[k];
          const next = arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
          persist({ ...state, [k]: next });
        },
        like: (id) =>
          persist({
            ...state,
            liked: Array.from(new Set([...state.liked, id])),
            disliked: state.disliked.filter((x) => x !== id),
            likedSinceRealityCheck: state.likedSinceRealityCheck + 1,
            currentVerkenIndex: state.currentVerkenIndex + 1,
          }),
        dislike: (id) =>
          persist({
            ...state,
            disliked: Array.from(new Set([...state.disliked, id])),
            liked: state.liked.filter((x) => x !== id),
            currentVerkenIndex: state.currentVerkenIndex + 1,
          }),
        reset: () => persist(DEFAULT),
        resetRealityCheckCounter: () =>
          persist({
            ...state,
            likedSinceRealityCheck: 0,
          }),
        setBattleChampion: (id) =>
          persist({
            ...state,
            battleChampion: id,
          }),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useCompass() {
  const c = useContext(Ctx);
  if (!c) throw new Error("CompassProvider missing");
  return c;
}

// Color assignment for chips based on category
export const COLOR_BY_CATEGORY: Record<string, ChipColor> = {
  interesses: "mint",
  skills: "indigo",
  leerdoelen: "orange",
  motivatie: "sun",
};
