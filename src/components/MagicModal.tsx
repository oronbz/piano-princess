import { Smile, BookOpen } from "lucide-react";
import type { MagicContent } from "../types";

interface MagicModalProps {
  loading: boolean;
  content: MagicContent | null;
  onClose: () => void;
}

export function MagicModal({ loading, content, onClose }: MagicModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-[40px] p-8 max-w-sm w-full text-center shadow-2xl relative animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {loading ? (
          <div className="py-12 flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-pink-500 mb-4" />
            <p className="text-pink-500 font-bold animate-pulse">
              הקסם קורה... ✨
            </p>
          </div>
        ) : (
          <div className="py-4">
            <div className="mx-auto bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              {content?.type === "challenge" ? (
                <Smile className="text-purple-500" size={32} />
              ) : (
                <BookOpen className="text-purple-500" size={32} />
              )}
            </div>
            <h3 className="text-2xl font-black text-purple-600 mb-4">
              {content?.type === "challenge" ? "האתגר שלך:" : "הסיפור שלך:"}
            </h3>
            <div className="bg-purple-50 p-6 rounded-2xl text-gray-700 font-medium text-lg leading-relaxed mb-6 border border-purple-100">
              "{content?.text}"
            </div>
            <button
              onClick={onClose}
              className="w-full bg-pink-500 text-white font-bold py-3 rounded-xl hover:bg-pink-600 transition-colors"
            >
              תודה פסנתר קסום!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
