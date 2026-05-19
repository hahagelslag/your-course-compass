import { Link, useLocation } from "@tanstack/react-router";
import { Compass, Heart, User } from "lucide-react";

export function BottomNav() {
  const loc = useLocation();
  const items = [
    { to: "/verken", label: "Verken", icon: Compass },
    { to: "/shortlist", label: "Shortlist", icon: Heart },
    { to: "/profiel", label: "Profiel", icon: User },
  ] as const;
  return (
    <nav className="sticky bottom-0 left-0 right-0 mt-auto bg-ink text-cream rounded-t-3xl">
      <ul className="flex items-center justify-around py-3">
        {items.map(({ to, label, icon: Icon }) => {
          const active = loc.pathname === to;
          return (
            <li key={to}>
              <Link
                to={to}
                className={`flex flex-col items-center gap-1 px-5 py-2 rounded-pill transition-colors text-cream ${active ? "text-cream" : "text-cream/70 hover:text-cream"}`}
                style={active ? { backgroundColor: "oklch(0.18 0.04 255)" } : {}}
              >
                <Icon size={22} strokeWidth={2.2} />
                <span className="text-xs font-semibold">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
