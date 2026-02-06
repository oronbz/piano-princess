import { Lock, Sparkles } from "lucide-react";
import type { Stats } from "../types";
import { STICKERS } from "../data/constants";

interface StickersPageProps {
  stats: Stats;
}

export function StickersPage({ stats }: StickersPageProps) {
  return (
    <div>
      <h2 className="text-xl font-bold text-pink-500 mb-4 px-2">
        המדבקות שלי ✨
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {STICKERS.map((sticker, idx) => {
          const isUnlocked = stats.level >= sticker.level;
          return (
            <div
              key={idx}
              className={`
                aspect-square rounded-3xl flex flex-col items-center justify-center p-4 border-2
                ${
                  isUnlocked
                    ? "bg-white border-pink-100 shadow-md"
                    : "bg-gray-50 border-gray-100 opacity-70"
                }
              `}
            >
              <div className="text-5xl mb-3 relative">
                {isUnlocked ? (
                  sticker.icon
                ) : (
                  <Lock className="text-gray-300" size={40} />
                )}
                {isUnlocked && (
                  <div className="absolute -top-2 -left-2">
                    <Sparkles
                      className="text-yellow-400 animate-spin-slow"
                      size={16}
                    />
                  </div>
                )}
              </div>
              <span
                className={`text-sm font-bold text-center ${
                  isUnlocked ? "text-gray-700" : "text-gray-400"
                }`}
              >
                {sticker.name}
              </span>
              {!isUnlocked && (
                <span className="text-[10px] font-bold text-pink-400 bg-pink-50 px-2 py-0.5 rounded-full mt-2">
                  רמה {sticker.level}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
