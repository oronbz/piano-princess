import { Crown, Sparkles } from "lucide-react";
import type { Stats } from "../types";

interface LevelUpModalProps {
  stats: Stats;
  onClose: () => void;
}

export function LevelUpModal({ stats, onClose }: LevelUpModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-[40px] p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-yellow-300 to-transparent opacity-20" />
        <div className="mb-6 flex justify-center">
          <div className="bg-yellow-100 p-6 rounded-full inline-block relative">
            <div className="absolute inset-0 animate-ping bg-yellow-200 rounded-full opacity-75" />
            <Crown
              size={64}
              className="text-yellow-500 relative z-10"
              fill="currentColor"
            />
          </div>
        </div>
        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-pink-500 to-purple-500 mb-2">
          !עלית רמה
        </h2>
        <p className="text-gray-500 font-bold text-lg mb-8">
          !הגעת לרמה {stats.level}
        </p>
        <div className="bg-pink-50 rounded-2xl p-4 mb-8">
          <div className="flex items-center justify-center space-x-2 text-pink-600 font-bold">
            <Sparkles size={20} />
            <span>50 יהלומים במתנה</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-full bg-linear-to-r from-pink-500 to-rose-500 text-white font-bold text-xl py-4 rounded-2xl shadow-lg shadow-pink-300/50 hover:scale-105 transition-transform"
        >
          !יש
        </button>
      </div>
    </div>
  );
}
