import { Wand2, Smile, BookOpen } from "lucide-react";
import type { MagicContentType } from "../types";

interface FunPageProps {
  onGenerate: (type: MagicContentType) => void;
}

export function FunPage({ onGenerate }: FunPageProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-purple-500 mb-4 px-2">
        קסם בינה מלאכותית ✨
      </h2>

      <div className="bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-[30px] p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-white/10 to-transparent opacity-30" />
        <Wand2 className="w-12 h-12 mb-4 text-yellow-300 animate-pulse" />
        <h3 className="text-2xl font-black mb-2">פסנתר הקסם</h3>
        <p className="mb-6 opacity-90 text-sm">
          בחרי קסם למטה והפסנתר ימציא לך משהו מיוחד!
        </p>

        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => onGenerate("challenge")}
            className="bg-white/20 backdrop-blur-md border border-white/40 hover:bg-white/30 transition-all rounded-xl p-4 flex items-center space-x-4 rtl:space-x-reverse"
          >
            <div className="bg-yellow-400 rounded-full p-2">
              <Smile className="text-white" size={20} />
            </div>
            <div className="text-right">
              <div className="font-bold">אתגר מצחיק</div>
              <div className="text-xs opacity-80">לנגן בדרך משוגעת</div>
            </div>
          </button>

          <button
            onClick={() => onGenerate("story")}
            className="bg-white/20 backdrop-blur-md border border-white/40 hover:bg-white/30 transition-all rounded-xl p-4 flex items-center space-x-4 rtl:space-x-reverse"
          >
            <div className="bg-pink-400 rounded-full p-2">
              <BookOpen className="text-white" size={20} />
            </div>
            <div className="text-right">
              <div className="font-bold">סיפור קסום</div>
              <div className="text-xs opacity-80">אגדה מוזיקלית קצרה</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
