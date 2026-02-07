import { useState, useEffect, useRef } from "react";
import { Star, Trophy, Check } from "lucide-react";
import type { Task } from "../types";

interface TasksPageProps {
  tasks: Task[];
  onTaskComplete: (taskId: number) => void;
}

export function TasksPage({ tasks, onTaskComplete }: TasksPageProps) {
  const allDone = tasks.every((t) => t.completed);
  const prevAllDone = useRef(allDone);
  const [showBounce, setShowBounce] = useState(false);

  useEffect(() => {
    if (allDone && !prevAllDone.current) {
      setShowBounce(true);
      const timer = setTimeout(() => setShowBounce(false), 3000);
      return () => clearTimeout(timer);
    }
    prevAllDone.current = allDone;
  }, [allDone]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-pink-500 mb-4 px-2">
        המשימות להיום 🎵
      </h2>

      {tasks.map((task) => (
        <button
          key={task.id}
          onClick={() => onTaskComplete(task.id)}
          disabled={task.completed}
          className={`w-full group relative overflow-hidden transition-all duration-300 transform 
            ${
              task.completed
                ? "bg-green-50 border-green-100 scale-[0.98] opacity-80"
                : "bg-white hover:scale-[1.02] shadow-lg shadow-pink-100/50 border-2 border-transparent hover:border-pink-200"
            } rounded-3xl p-4 flex items-center text-right`}
        >
          <div
            className={`
              h-12 w-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner ml-4 flex-shrink-0
              ${task.completed ? "bg-green-100 grayscale-0" : "bg-pink-100"}
            `}
          >
            {task.icon}
          </div>
          <div className="flex-1">
            <h3
              className={`font-bold text-lg ${
                task.completed
                  ? "text-green-700 line-through decoration-green-300"
                  : "text-gray-700"
              }`}
            >
              {task.text}
            </h3>
            {!task.completed && (
              <span className="text-xs font-semibold text-pink-400 flex items-center mt-1">
                <Star size={10} className="ml-1 fill-current" /> +{task.xp} נק'
              </span>
            )}
          </div>
          <div
            className={`
              w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors
              ${
                task.completed
                  ? "bg-green-500 border-green-500"
                  : "border-gray-200 group-hover:border-pink-300"
              }
            `}
          >
            {task.completed && (
              <Check size={16} className="text-white" strokeWidth={4} />
            )}
          </div>
        </button>
      ))}

      {allDone && (
        <div className={`mt-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-3xl p-6 text-center text-white shadow-lg shine transform ${showBounce ? "animate-bounce" : ""}`}>
          <div className="flex justify-center mb-2">
            <Trophy
              size={48}
              className="text-yellow-300 drop-shadow-sm"
              fill="currentColor"
            />
          </div>
          <h3 className="text-2xl font-black mb-1">כל הכבוד!</h3>
          <p className="opacity-90 font-medium">את כוכבת פסנתר אמיתית!</p>
        </div>
      )}
    </div>
  );
}
