/**
 * Sound effects for Piano Princess Quest.
 *
 * Uses Web Audio API to synthesize magical, musical sounds.
 * To replace with real audio files, drop them in public/sounds/
 * and update the SOUND_FILES map below.
 */

type SoundKey = "taskComplete" | "allTasksComplete" | "levelUp";

// Set this to a file path (e.g. "/sounds/task-complete.mp3") to use a
// real audio file instead of the synthesized version.
const SOUND_FILES: Record<SoundKey, string | null> = {
  taskComplete: null,
  allTasksComplete: null,
  levelUp: null,
};

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  return audioContext;
}

// --- File-based playback ---

function playFile(path: string): void {
  const audio = new Audio(path);
  audio.play().catch(() => {
    // Silently fail if playback is blocked
  });
}

// --- Synthesized sounds ---

type OscillatorKind = OscillatorType;

function playNote(
  ctx: AudioContext,
  frequency: number,
  startTime: number,
  duration: number,
  gainValue = 0.3,
  type: OscillatorKind = "sine",
): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, startTime);

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(gainValue, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
}

/**
 * Task complete: a cheerful ascending two-note chime (like a "ding-ding!")
 * Musical notes: E5 -> G5 (bright, happy interval)
 */
function synthTaskComplete(): void {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  playNote(ctx, 659.25, now, 0.25, 0.25); // E5
  playNote(ctx, 783.99, now + 0.12, 0.35, 0.3); // G5

  playNote(ctx, 1318.5, now + 0.05, 0.15, 0.08); // E6 (soft shimmer)
  playNote(ctx, 1567.98, now + 0.15, 0.2, 0.06); // G6 (soft shimmer)
}

/**
 * All tasks complete: a triumphant ascending arpeggio with sparkles
 * Musical notes: C5 -> E5 -> G5 -> C6 (C major arpeggio, victorious!)
 */
function synthAllTasksComplete(): void {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  playNote(ctx, 523.25, now, 0.3, 0.25); // C5
  playNote(ctx, 659.25, now + 0.15, 0.3, 0.28); // E5
  playNote(ctx, 783.99, now + 0.3, 0.3, 0.3); // G5
  playNote(ctx, 1046.5, now + 0.45, 0.6, 0.35); // C6 (hold longer)

  playNote(ctx, 2093.0, now + 0.5, 0.4, 0.08); // C7
  playNote(ctx, 2637.0, now + 0.6, 0.35, 0.06); // E7
  playNote(ctx, 3135.96, now + 0.7, 0.3, 0.04); // G7

  playNote(ctx, 261.63, now + 0.1, 1.0, 0.1, "triangle"); // C4 pad
  playNote(ctx, 329.63, now + 0.2, 0.9, 0.08, "triangle"); // E4 pad
}

/**
 * Level up: a grand fanfare with a dramatic ascending scale and shimmer
 * Musical notes: G4 -> B4 -> D5 -> G5 -> B5 -> D6 (G major, heroic!)
 */
function synthLevelUp(): void {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const fanfareNotes = [
    { freq: 392.0, time: 0, dur: 0.2 },
    { freq: 493.88, time: 0.12, dur: 0.2 },
    { freq: 587.33, time: 0.24, dur: 0.2 },
    { freq: 783.99, time: 0.4, dur: 0.25 },
    { freq: 987.77, time: 0.55, dur: 0.25 },
    { freq: 1174.66, time: 0.7, dur: 0.5 },
  ];

  fanfareNotes.forEach((n) => {
    playNote(ctx, n.freq, now + n.time, n.dur, 0.25);
  });

  playNote(ctx, 783.99, now + 0.9, 0.8, 0.2); // G5
  playNote(ctx, 987.77, now + 0.9, 0.8, 0.18); // B5
  playNote(ctx, 1174.66, now + 0.9, 0.8, 0.2); // D6

  const sparkleFreqs = [2349.32, 2793.83, 3135.96, 3520.0, 3951.07];
  sparkleFreqs.forEach((freq, i) => {
    playNote(ctx, freq, now + 1.0 + i * 0.08, 0.25, 0.04);
  });

  playNote(ctx, 196.0, now + 0.3, 1.2, 0.12, "triangle"); // G3
  playNote(ctx, 98.0, now + 0.9, 1.0, 0.08, "triangle"); // G2
}

// --- Public API ---

export function playTaskComplete(): void {
  if (SOUND_FILES.taskComplete) {
    playFile(SOUND_FILES.taskComplete);
  } else {
    synthTaskComplete();
  }
}

export function playAllTasksComplete(): void {
  if (SOUND_FILES.allTasksComplete) {
    playFile(SOUND_FILES.allTasksComplete);
  } else {
    synthAllTasksComplete();
  }
}

export function playLevelUp(): void {
  if (SOUND_FILES.levelUp) {
    playFile(SOUND_FILES.levelUp);
  } else {
    synthLevelUp();
  }
}
