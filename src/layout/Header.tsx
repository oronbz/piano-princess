import { Crown, Sparkles } from "lucide-react";
import type { Stats } from "../types";

interface HeaderProps {
  stats: Stats;
  xpProgress: number;
  currentLevelThreshold: number;
}

export function Header({
  stats,
  xpProgress,
  currentLevelThreshold,
}: HeaderProps) {
  return (
    <div className="pt-[max(2rem,env(safe-area-inset-top))] pb-12 px-6 bg-linear-to-b from-pink-400 to-pink-200 rounded-b-[40px] shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-10 -mt-10 blur-xl" />
      <div className="absolute top-20 left-10 w-16 h-16 bg-white/10 rounded-full blur-lg" />

      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="flex items-center space-x-2 bg-white/90 px-3 py-1.5 rounded-full shadow-sm">
          <div className="bg-yellow-400 p-1 rounded-full">
            <Crown size={14} className="text-white" />
          </div>
          <span className="font-bold text-pink-500 text-sm">
            רמה {stats.level}
          </span>
        </div>
        <div className="flex items-center space-x-2 bg-white/90 px-3 py-1.5 rounded-full shadow-sm">
          <div className="bg-blue-400 p-1 rounded-full">
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="font-bold text-blue-500 text-sm">
            {stats.gems} יהלומים
          </span>
        </div>
      </div>

      <div className="text-center relative z-10">
        <h1 className="text-3xl font-extrabold text-white drop-shadow-md mb-2">
          נסיכת הפסנתר
        </h1>
        <div className="mt-4 bg-black/20 rounded-full h-6 p-1 relative w-full max-w-[80%] mx-auto">
          <div
            className="bg-linear-to-l from-yellow-300 to-yellow-500 h-4 rounded-full transition-all duration-1000 ease-out shadow-sm relative"
            style={{ width: `${Math.min(xpProgress, 100)}%` }}
          >
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-white/40 rounded-full animate-pulse" />
          </div>
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <span className="text-[10px] font-bold text-white tracking-wide uppercase drop-shadow">
              {stats.xp} / {currentLevelThreshold} נקודות
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
