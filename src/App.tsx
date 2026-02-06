import { useState } from "react";
import type { TabId } from "./types";
import { useGameState } from "./hooks/useGameState";
import { useMagicContent } from "./hooks/useMagicContent";
import { Celebration } from "./components/Celebration";
import { LevelUpModal } from "./components/LevelUpModal";
import { MagicModal } from "./components/MagicModal";
import { Header } from "./layout/Header";
import { StreakCard } from "./layout/StreakCard";
import { BottomNav } from "./layout/BottomNav";
import { TasksPage } from "./pages/TasksPage";
import { StickersPage } from "./pages/StickersPage";
import { FunPage } from "./pages/FunPage";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("tasks");

  const game = useGameState();
  const magic = useMagicContent();

  return (
    <div className="min-h-screen bg-pink-50 font-['Heebo',sans-serif] selection:bg-pink-200">
      <Celebration active={game.celebrating} />

      {/* Main Content Container */}
      <div className="max-w-md mx-auto min-h-screen relative flex flex-col pb-24">
        <Header
          stats={game.stats}
          xpProgress={game.xpProgress}
          currentLevelThreshold={game.currentLevelThreshold}
        />

        <StreakCard stats={game.stats} />

        {/* Main Content Area */}
        <div className="px-6 mt-8 flex-1">
          {activeTab === "tasks" && (
            <TasksPage
              tasks={game.tasks}
              onTaskComplete={game.handleTaskComplete}
            />
          )}
          {activeTab === "stickers" && <StickersPage stats={game.stats} />}
          {activeTab === "fun" && <FunPage onGenerate={magic.generate} />}
        </div>
      </div>

      {/* Modals */}
      {magic.showModal && (
        <MagicModal
          loading={magic.loading}
          content={magic.content}
          onClose={magic.closeModal}
        />
      )}

      {game.showLevelUp && (
        <LevelUpModal
          stats={game.stats}
          onClose={() => game.setShowLevelUp(false)}
        />
      )}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
