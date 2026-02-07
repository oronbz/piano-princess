export interface Task {
  id: number;
  text: string;
  icon: string;
  xp: number;
  completed: boolean;
}

export interface TaskTemplate {
  id: number;
  text: string;
  icon: string;
  xp: number;
}

export interface Stats {
  level: number;
  xp: number;
  streak: number;
  gems: number;
  lastPlayed: string | null;
}

export interface Sticker {
  level: number;
  icon: string;
  name: string;
}

export type TabId = "tasks" | "stickers" | "fun" | "piano" | "settings";

export type MagicContentType = "challenge" | "story";

export interface MagicContent {
  type: MagicContentType;
  text: string;
}
