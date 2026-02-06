import { Music, Wand2, Trophy, Piano } from "lucide-react";
import type { TabId } from "../types";

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 w-full bg-white/95 backdrop-blur-xl border-t border-pink-100 py-2 safe-bottom flex justify-around text-gray-400 max-w-md left-1/2 transform -translate-x-1/2 z-40 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.05)] px-2">
      <button
        onClick={() => onTabChange("tasks")}
        className={`flex flex-col items-center p-2 rounded-2xl transition-all ${
          activeTab === "tasks"
            ? "text-pink-500 bg-pink-50"
            : "hover:text-pink-400"
        }`}
      >
        <Music
          size={24}
          className={activeTab === "tasks" ? "fill-current" : ""}
        />
        <span className="text-[10px] font-bold mt-1">אימון</span>
      </button>

      <button
        onClick={() => onTabChange("piano")}
        className={`flex flex-col items-center p-2 rounded-2xl transition-all ${
          activeTab === "piano"
            ? "text-pink-500 bg-pink-50"
            : "hover:text-pink-400"
        }`}
      >
        <Piano
          size={24}
          className={activeTab === "piano" ? "fill-current" : ""}
        />
        <span className="text-[10px] font-bold mt-1">פסנתר</span>
      </button>

      <button
        onClick={() => onTabChange("fun")}
        className={`flex flex-col items-center p-2 rounded-2xl transition-all ${
          activeTab === "fun"
            ? "text-purple-500 bg-purple-50"
            : "hover:text-purple-400"
        }`}
      >
        <Wand2
          size={24}
          className={activeTab === "fun" ? "animate-pulse" : ""}
        />
        <span className="text-[10px] font-bold mt-1">כיף ✨</span>
      </button>

      <button
        onClick={() => onTabChange("stickers")}
        className={`flex flex-col items-center p-2 rounded-2xl transition-all ${
          activeTab === "stickers"
            ? "text-blue-500 bg-blue-50"
            : "hover:text-blue-400"
        }`}
      >
        <Trophy
          size={24}
          className={activeTab === "stickers" ? "fill-current" : ""}
        />
        <span className="text-[10px] font-bold mt-1">פרסים</span>
      </button>
    </div>
  );
}
