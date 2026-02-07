import { useState, useEffect, useCallback, useRef } from "react";
import type { Stats, Task, TaskTemplate } from "../types";
import { DAILY_TASKS_DEFAULT, LEVEL_THRESHOLDS } from "../data/constants";
import {
  playTaskComplete,
  playAllTasksComplete,
  playLevelUp,
} from "../lib/sounds";

const STATS_KEY = "piano-princess-stats-he";
const TASKS_KEY = "piano-princess-tasks-he";
const TEMPLATES_KEY = "piano-princess-templates-he";

const DEFAULT_STATS: Stats = {
  level: 1,
  xp: 0,
  streak: 0,
  gems: 0,
  lastPlayed: null,
};

function loadTemplates(): TaskTemplate[] {
  const saved = localStorage.getItem(TEMPLATES_KEY);
  if (saved) {
    const parsed: TaskTemplate[] = JSON.parse(saved);
    if (parsed.length > 0) return parsed;
  }
  return DAILY_TASKS_DEFAULT.map(({ id, text, icon, xp }) => ({
    id,
    text,
    icon,
    xp,
  }));
}

function freshTasks(): Task[] {
  return loadTemplates().map((t) => ({ ...t, completed: false }));
}

function loadInitialStats(): Stats {
  const savedStats = localStorage.getItem(STATS_KEY);
  if (!savedStats) return DEFAULT_STATS;

  const parsedStats: Stats = JSON.parse(savedStats);
  const today = new Date().toDateString();
  const lastPlayed = parsedStats.lastPlayed;
  let newStreak = parsedStats.streak;

  if (lastPlayed !== today && lastPlayed) {
    const d1 = new Date(lastPlayed);
    const d2 = new Date();
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    const diffDays = Math.round(
      (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays > 1) newStreak = 0;
  }

  return { ...parsedStats, streak: newStreak };
}

function loadInitialTasks(): Task[] {
  const savedStats = localStorage.getItem(STATS_KEY);
  const savedTasks = localStorage.getItem(TASKS_KEY);

  if (!savedStats) return freshTasks();

  const parsedStats: Stats = JSON.parse(savedStats);
  const today = new Date().toDateString();

  // If it's a new day, reset tasks
  if (parsedStats.lastPlayed !== today) {
    return freshTasks();
  }

  return savedTasks ? JSON.parse(savedTasks) : freshTasks();
}

export function useGameState() {
  const [tasks, setTasks] = useState<Task[]>(() => loadInitialTasks());
  const [stats, setStats] = useState<Stats>(() => loadInitialStats());
  const [taskTemplates, setTaskTemplates] = useState<TaskTemplate[]>(
    () => loadTemplates(),
  );
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [celebrating, setCelebrating] = useState(false);

  // Refs to hold the latest values so event handlers always see current state
  // without needing them in dependency arrays (avoids stale closures).
  const tasksRef = useRef(tasks);
  const statsRef = useRef(stats);
  tasksRef.current = tasks;
  statsRef.current = stats;

  // Guard against StrictMode double-invocation
  const processingRef = useRef(false);

  // --- Persist to localStorage ---
  useEffect(() => {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }, [stats, tasks]);

  useEffect(() => {
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(taskTemplates));
  }, [taskTemplates]);

  // --- Celebration ---
  const triggerCelebration = useCallback(() => {
    setCelebrating(true);
    setTimeout(() => setCelebrating(false), 3000);
  }, []);

  // --- Complete a single task ---
  const handleTaskComplete = useCallback(
    (taskId: number) => {
      // Prevent double-execution from StrictMode
      if (processingRef.current) return;
      processingRef.current = true;
      queueMicrotask(() => {
        processingRef.current = false;
      });

      // Read current state from refs (always fresh)
      const currentTasks = tasksRef.current;
      const currentStats = statsRef.current;

      const taskIndex = currentTasks.findIndex((t) => t.id === taskId);
      if (taskIndex === -1 || currentTasks[taskIndex].completed) return;

      // --- Compute new tasks ---
      const newTasks = currentTasks.map((t) =>
        t.id === taskId ? { ...t, completed: true } : t,
      );

      // --- Compute new stats ---
      const xpGain = currentTasks[taskIndex].xp;
      let newXp = currentStats.xp + xpGain;
      let newLevel = currentStats.level;
      let newGems = currentStats.gems + xpGain / 5;
      let didLevelUp = false;

      const nextLevelThreshold = LEVEL_THRESHOLDS[newLevel];
      if (nextLevelThreshold !== undefined && newXp >= nextLevelThreshold) {
        newLevel++;
        newGems += 50;
        didLevelUp = true;
      }

      const allDone = newTasks.every((t) => t.completed);
      if (allDone) {
        newGems += 20;
      }

      const newStats: Stats = {
        ...currentStats,
        xp: newXp,
        level: newLevel,
        gems: Math.floor(newGems),
        lastPlayed: new Date().toDateString(),
        // Streak is bumped only when all tasks are done
        streak: allDone ? currentStats.streak + 1 : currentStats.streak,
      };

      // --- Apply state (pure, no side effects) ---
      setTasks(newTasks);
      setStats(newStats);

      // --- Side effects (fire once, outside updaters) ---
      playTaskComplete();
      triggerCelebration();

      if (didLevelUp) {
        setShowLevelUp(true);
        playLevelUp();
      }

      if (allDone) {
        setTimeout(() => {
          playAllTasksComplete();
          triggerCelebration();
        }, 500);
      }
    },
    [triggerCelebration],
  );

  // --- Undo a completed task ---
  const handleTaskUndo = useCallback((taskId: number) => {
    // Prevent double-execution from StrictMode
    if (processingRef.current) return;
    processingRef.current = true;
    queueMicrotask(() => {
      processingRef.current = false;
    });

    const currentTasks = tasksRef.current;
    const currentStats = statsRef.current;

    const taskIndex = currentTasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1 || !currentTasks[taskIndex].completed) return;

    const wereAllDone = currentTasks.every((t) => t.completed);

    // --- Compute new tasks ---
    const newTasks = currentTasks.map((t) =>
      t.id === taskId ? { ...t, completed: false } : t,
    );

    // --- Reverse stats ---
    const xpLoss = currentTasks[taskIndex].xp;
    let newXp = currentStats.xp - xpLoss;
    let newLevel = currentStats.level;
    let newGems = currentStats.gems - xpLoss / 5;

    // Reverse all-done bonus if tasks were all completed before undo
    if (wereAllDone) {
      newGems -= 20;
    }

    // Reverse level-up if XP drops below the threshold for the current level
    const currentLevelMin = LEVEL_THRESHOLDS[newLevel - 1];
    if (currentLevelMin !== undefined && newXp < currentLevelMin) {
      newLevel--;
      newGems -= 50;
    }

    const newStats: Stats = {
      ...currentStats,
      xp: Math.max(0, newXp),
      level: Math.max(1, newLevel),
      gems: Math.max(0, Math.floor(newGems)),
      // Reverse streak bump if tasks were all done before undo
      streak: wereAllDone
        ? Math.max(0, currentStats.streak - 1)
        : currentStats.streak,
    };

    setTasks(newTasks);
    setStats(newStats);
  }, []);

  // --- Derived values ---
  const currentLevelThreshold = LEVEL_THRESHOLDS[stats.level] ?? 10000;
  const prevLevelThreshold = LEVEL_THRESHOLDS[stats.level - 1] ?? 0;
  const xpProgress =
    ((stats.xp - prevLevelThreshold) /
      (currentLevelThreshold - prevLevelThreshold)) *
    100;

  // --- Task template CRUD ---
  const addTaskTemplate = useCallback(
    (template: Omit<TaskTemplate, "id">) => {
      setTaskTemplates((prev) => {
        const maxId = prev.reduce((max, t) => Math.max(max, t.id), 0);
        return [...prev, { ...template, id: maxId + 1 }];
      });
    },
    [],
  );

  const updateTaskTemplate = useCallback(
    (id: number, updates: Partial<Omit<TaskTemplate, "id">>) => {
      setTaskTemplates((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      );
    },
    [],
  );

  const deleteTaskTemplate = useCallback((id: number) => {
    setTaskTemplates((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return {
    tasks,
    stats,
    showLevelUp,
    setShowLevelUp,
    celebrating,
    handleTaskComplete,
    handleTaskUndo,
    xpProgress,
    currentLevelThreshold,
    taskTemplates,
    addTaskTemplate,
    updateTaskTemplate,
    deleteTaskTemplate,
  } as const;
}
