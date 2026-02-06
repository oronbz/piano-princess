/**
 * Sound effects for Piano Princess Quest.
 *
 * Uses Web Audio API to synthesize magical, musical sounds.
 * To replace with real audio files, drop them in public/sounds/
 * and update the SOUND_FILES map below.
 */

// Set this to a file path (e.g. "/sounds/task-complete.mp3") to use a
// real audio file instead of the synthesized version.
const SOUND_FILES = {
  taskComplete: null, // e.g. "/sounds/task-complete.mp3"
  allTasksComplete: null, // e.g. "/sounds/all-tasks-complete.mp3"
  levelUp: null, // e.g. "/sounds/level-up.mp3"
};

let audioContext = null;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume if suspended (required after user gesture on mobile)
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  return audioContext;
}

// --- File-based playback ---

function playFile(path) {
  const audio = new Audio(path);
  audio.play().catch(() => {
    // Silently fail if playback is blocked
  });
}

// --- Synthesized sounds ---

function playNote(ctx, frequency, startTime, duration, gainValue = 0.3, type = "sine") {
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
function synthTaskComplete() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  // Main chime - E5 then G5 (major third, very cheerful)
  playNote(ctx, 659.25, now, 0.25, 0.25); // E5
  playNote(ctx, 783.99, now + 0.12, 0.35, 0.3); // G5

  // Sparkle overtones
  playNote(ctx, 1318.5, now + 0.05, 0.15, 0.08); // E6 (soft shimmer)
  playNote(ctx, 1567.98, now + 0.15, 0.2, 0.06); // G6 (soft shimmer)
}

/**
 * All tasks complete: a triumphant ascending arpeggio with sparkles
 * Musical notes: C5 -> E5 -> G5 -> C6 (C major arpeggio, victorious!)
 */
function synthAllTasksComplete() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  // C major arpeggio ascending
  playNote(ctx, 523.25, now, 0.3, 0.25); // C5
  playNote(ctx, 659.25, now + 0.15, 0.3, 0.28); // E5
  playNote(ctx, 783.99, now + 0.3, 0.3, 0.3); // G5
  playNote(ctx, 1046.5, now + 0.45, 0.6, 0.35); // C6 (hold longer)

  // High sparkle overtones
  playNote(ctx, 2093.0, now + 0.5, 0.4, 0.08); // C7
  playNote(ctx, 2637.0, now + 0.6, 0.35, 0.06); // E7
  playNote(ctx, 3135.96, now + 0.7, 0.3, 0.04); // G7

  // Warm pad underneath
  playNote(ctx, 261.63, now + 0.1, 1.0, 0.1, "triangle"); // C4 pad
  playNote(ctx, 329.63, now + 0.2, 0.9, 0.08, "triangle"); // E4 pad
}

/**
 * Level up: a grand fanfare with a dramatic ascending scale and shimmer
 * Musical notes: G4 -> B4 -> D5 -> G5 -> B5 -> D6 (G major, heroic!)
 */
function synthLevelUp() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  // Dramatic G major ascending fanfare
  const fanfareNotes = [
    { freq: 392.0, time: 0, dur: 0.2 }, // G4
    { freq: 493.88, time: 0.12, dur: 0.2 }, // B4
    { freq: 587.33, time: 0.24, dur: 0.2 }, // D5
    { freq: 783.99, time: 0.4, dur: 0.25 }, // G5 (slight pause before)
    { freq: 987.77, time: 0.55, dur: 0.25 }, // B5
    { freq: 1174.66, time: 0.7, dur: 0.5 }, // D6 (hold)
  ];

  fanfareNotes.forEach((n) => {
    playNote(ctx, n.freq, now + n.time, n.dur, 0.25);
  });

  // Final triumphant chord: G major (G5 + B5 + D6)
  playNote(ctx, 783.99, now + 0.9, 0.8, 0.2); // G5
  playNote(ctx, 987.77, now + 0.9, 0.8, 0.18); // B5
  playNote(ctx, 1174.66, now + 0.9, 0.8, 0.2); // D6

  // Sparkle cascade
  const sparkleFreqs = [2349.32, 2793.83, 3135.96, 3520.0, 3951.07];
  sparkleFreqs.forEach((freq, i) => {
    playNote(ctx, freq, now + 1.0 + i * 0.08, 0.25, 0.04);
  });

  // Deep bass foundation
  playNote(ctx, 196.0, now + 0.3, 1.2, 0.12, "triangle"); // G3
  playNote(ctx, 98.0, now + 0.9, 1.0, 0.08, "triangle"); // G2
}

// --- Public API ---

export function playTaskComplete() {
  if (SOUND_FILES.taskComplete) {
    playFile(SOUND_FILES.taskComplete);
  } else {
    synthTaskComplete();
  }
}

export function playAllTasksComplete() {
  if (SOUND_FILES.allTasksComplete) {
    playFile(SOUND_FILES.allTasksComplete);
  } else {
    synthAllTasksComplete();
  }
}

export function playLevelUp() {
  if (SOUND_FILES.levelUp) {
    playFile(SOUND_FILES.levelUp);
  } else {
    synthLevelUp();
  }
}
