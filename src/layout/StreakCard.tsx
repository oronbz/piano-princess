import { Flame } from "lucide-react";
import type { Stats } from "../types";

interface StreakCardProps {
  stats: Stats;
}

export function StreakCard({ stats }: StreakCardProps) {
  return (
    <div className="-mt-8 mx-6 bg-white rounded-3xl shadow-xl p-4 flex items-center justify-between relative z-20 border-b-4 border-pink-100">
      <div className="flex flex-col">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          רצף נוכחי
        </span>
        <div className="flex items-baseline space-x-1">
          <span className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-red-500">
            {stats.streak}
          </span>
          <span className="text-sm font-bold text-gray-500">ימים</span>
        </div>
      </div>
      <div className="h-14 w-14 bg-orange-100 rounded-full flex items-center justify-center relative">
        <Flame
          className="text-orange-500 animate-pulse"
          size={32}
          fill="currentColor"
        />
        <div className="absolute -top-1 -left-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm">
          אש
        </div>
      </div>
    </div>
  );
}
