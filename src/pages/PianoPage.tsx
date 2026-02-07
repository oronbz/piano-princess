import { useCallback, useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";

// ── Note definitions (C4 to B5 — 2 octaves) ──────────────────────────

interface PianoKey {
  note: string;
  freq: number;
  isBlack: boolean;
  /** Index within the white-key sequence (only meaningful for white keys) */
  whiteIndex?: number;
}

const NOTES: PianoKey[] = [
  // Octave 4
  { note: "C4", freq: 261.63, isBlack: false },
  { note: "C#4", freq: 277.18, isBlack: true },
  { note: "D4", freq: 293.66, isBlack: false },
  { note: "D#4", freq: 311.13, isBlack: true },
  { note: "E4", freq: 329.63, isBlack: false },
  { note: "F4", freq: 349.23, isBlack: false },
  { note: "F#4", freq: 369.99, isBlack: true },
  { note: "G4", freq: 392.0, isBlack: false },
  { note: "G#4", freq: 415.3, isBlack: true },
  { note: "A4", freq: 440.0, isBlack: false },
  { note: "A#4", freq: 466.16, isBlack: true },
  { note: "B4", freq: 493.88, isBlack: false },
  // Octave 5
  { note: "C5", freq: 523.25, isBlack: false },
  { note: "C#5", freq: 554.37, isBlack: true },
  { note: "D5", freq: 587.33, isBlack: false },
  { note: "D#5", freq: 622.25, isBlack: true },
  { note: "E5", freq: 659.25, isBlack: false },
  { note: "F5", freq: 698.46, isBlack: false },
  { note: "F#5", freq: 739.99, isBlack: true },
  { note: "G5", freq: 783.99, isBlack: false },
  { note: "G#5", freq: 830.61, isBlack: true },
  { note: "A5", freq: 880.0, isBlack: false },
  { note: "A#5", freq: 932.33, isBlack: true },
  { note: "B5", freq: 987.77, isBlack: false },
];

const WHITE_KEYS = NOTES.filter((n) => !n.isBlack);
const BLACK_KEYS = NOTES.filter((n) => n.isBlack);

// Assign a sequential white-key index to every white key
WHITE_KEYS.forEach((k, i) => {
  k.whiteIndex = i;
});

// ── Audio engine ──────────────────────────────────────────────────────

/** Active oscillators keyed by note name so we can stop them on release */
const activeOscillators = new Map<
  string,
  { osc: OscillatorNode; gain: GainNode }
>();

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function startNote(freq: number, note: string) {
  if (activeOscillators.has(note)) return; // already playing

  const ctx = getCtx();

  // Main tone
  const osc = ctx.createOscillator();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(freq, ctx.currentTime);

  // Gentle harmonic for warmth
  const osc2 = ctx.createOscillator();
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(freq * 2, ctx.currentTime);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.32, ctx.currentTime + 0.02);

  const gain2 = ctx.createGain();
  gain2.gain.setValueAtTime(0, ctx.currentTime);
  gain2.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.02);

  osc.connect(gain);
  osc2.connect(gain2);
  gain.connect(ctx.destination);
  gain2.connect(ctx.destination);

  osc.start();
  osc2.start();

  activeOscillators.set(note, { osc, gain });
  // Store the harmonic alongside so we can stop it later
  activeOscillators.set(note + "_h", { osc: osc2, gain: gain2 });
}

function stopNote(note: string) {
  for (const key of [note, note + "_h"]) {
    const entry = activeOscillators.get(key);
    if (entry) {
      const ctx = getCtx();
      entry.gain.gain.cancelScheduledValues(ctx.currentTime);
      entry.gain.gain.setValueAtTime(entry.gain.gain.value, ctx.currentTime);
      entry.gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + 0.3,
      );
      entry.osc.stop(ctx.currentTime + 0.35);
      activeOscillators.delete(key);
    }
  }
}

// ── Sparkle positions ─────────────────────────────────────────────────

interface Sparkle {
  id: number;
  x: number;
  y: number;
}

let sparkleId = 0;

// ── Component ─────────────────────────────────────────────────────────

export function PianoPage() {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const pianoRef = useRef<HTMLDivElement>(null);

  // Track which note each active pointer is currently playing
  const pointerNoteRef = useRef<Map<number, string>>(new Map());
  // Ref mirror of pressedKeys so pointer handlers always see latest state
  const pressedKeysRef = useRef<Set<string>>(new Set());

  // Remove sparkles after animation
  useEffect(() => {
    if (sparkles.length === 0) return;
    const timeout = setTimeout(() => {
      setSparkles((prev) => prev.slice(1));
    }, 600);
    return () => clearTimeout(timeout);
  }, [sparkles]);

  /** Find the piano key element under a screen point */
  const getKeyAtPoint = useCallback((clientX: number, clientY: number) => {
    const elements = document.elementsFromPoint(clientX, clientY);
    for (const el of elements) {
      const btn = el.closest("[data-note]") as HTMLElement | null;
      if (btn) {
        return {
          note: btn.dataset.note!,
          freq: Number(btn.dataset.freq!),
          element: btn,
        };
      }
    }
    return null;
  }, []);

  /** Add a sparkle at a key element's center */
  const addSparkleAtKey = useCallback((element: HTMLElement) => {
    setSparkles((prev) => [
      ...prev,
      {
        id: ++sparkleId,
        x: element.offsetLeft + element.offsetWidth / 2,
        y: element.offsetTop + element.offsetHeight / 2,
      },
    ]);
  }, []);

  /** Activate a note for a pointer (press + sound + sparkle) */
  const activateNote = useCallback(
    (pointerId: number, note: string, freq: number, element: HTMLElement) => {
      pointerNoteRef.current.set(pointerId, note);
      pressedKeysRef.current.add(note);
      setPressedKeys(new Set(pressedKeysRef.current));
      startNote(freq, note);
      addSparkleAtKey(element);
    },
    [addSparkleAtKey],
  );

  /** Deactivate a note for a pointer */
  const deactivateNote = useCallback((pointerId: number) => {
    const note = pointerNoteRef.current.get(pointerId);
    if (note) {
      pointerNoteRef.current.delete(pointerId);
      // Only release the note if no other pointer is playing it
      let stillHeld = false;
      pointerNoteRef.current.forEach((n) => {
        if (n === note) stillHeld = true;
      });
      if (!stillHeld) {
        pressedKeysRef.current.delete(note);
        setPressedKeys(new Set(pressedKeysRef.current));
        stopNote(note);
      }
    }
  }, []);

  // ── Pointer event handlers on the piano container ──────────────────

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      // Capture pointer on the container so we get move/up even outside
      pianoRef.current?.setPointerCapture(e.pointerId);

      const hit = getKeyAtPoint(e.clientX, e.clientY);
      if (hit) {
        activateNote(e.pointerId, hit.note, hit.freq, hit.element);
      }
    },
    [getKeyAtPoint, activateNote],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      // Only process if this pointer is active (button held)
      if (e.buttons === 0) return;

      const hit = getKeyAtPoint(e.clientX, e.clientY);
      const currentNote = pointerNoteRef.current.get(e.pointerId);

      if (hit && hit.note !== currentNote) {
        // Finger slid to a new key — glissando!
        deactivateNote(e.pointerId);
        activateNote(e.pointerId, hit.note, hit.freq, hit.element);
      } else if (!hit && currentNote) {
        // Finger slid off all keys
        deactivateNote(e.pointerId);
      }
    },
    [getKeyAtPoint, activateNote, deactivateNote],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      deactivateNote(e.pointerId);
      pianoRef.current?.releasePointerCapture(e.pointerId);
    },
    [deactivateNote],
  );

  const handlePointerCancel = useCallback(
    (e: React.PointerEvent) => {
      deactivateNote(e.pointerId);
      pianoRef.current?.releasePointerCapture(e.pointerId);
    },
    [deactivateNote],
  );

  // When a context menu opens the pointerUp never fires, so release all notes
  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      pointerNoteRef.current.forEach((_note, pointerId) => {
        deactivateNote(pointerId);
        pianoRef.current?.releasePointerCapture(pointerId);
      });
    },
    [deactivateNote],
  );

  // Stop all notes on unmount
  useEffect(() => {
    return () => {
      activeOscillators.forEach((entry) => {
        try {
          entry.osc.stop();
        } catch {
          /* already stopped */
        }
      });
      activeOscillators.clear();
    };
  }, []);

  const totalWhiteKeys = WHITE_KEYS.length; // 14

  // Black key offsets: map each black note to its position relative to white keys.
  // In a standard piano layout, black keys sit between specific white keys.
  // We express position as the white-key index to the LEFT of each black key.
  function getBlackKeyWhiteIndex(note: string): number {
    const map: Record<string, number> = {
      "C#4": 0,
      "D#4": 1,
      "F#4": 3,
      "G#4": 4,
      "A#4": 5,
      "C#5": 7,
      "D#5": 8,
      "F#5": 10,
      "G#5": 11,
      "A#5": 12,
    };
    return map[note] ?? 0;
  }

  return (
    <div className="fixed inset-0 bottom-[72px] z-30 bg-gradient-to-b from-pink-100 via-pink-50 to-purple-50 flex items-center justify-center overflow-hidden">
      {/* Decorative background sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-4 right-6 text-pink-200/60 animate-pulse">
          <Sparkles size={18} />
        </div>
        <div
          className="absolute top-8 left-8 text-purple-200/60 animate-pulse"
          style={{ animationDelay: "0.5s" }}
        >
          <Sparkles size={14} />
        </div>
        <div
          className="absolute bottom-8 right-10 text-yellow-200/60 animate-pulse"
          style={{ animationDelay: "1s" }}
        >
          <Sparkles size={12} />
        </div>
      </div>

      {/* Rotated piano container — turns portrait into landscape layout */}
      <div
        className="absolute"
        style={{
          transform: "rotate(90deg)",
          transformOrigin: "center center",
          width: "calc(100vh - 72px)",
          height: "100vw",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Piano keyboard */}
        <div
          ref={pianoRef}
          className="relative flex-1 mx-1 my-1 select-none"
          style={{ touchAction: "none", direction: "ltr" }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onContextMenu={handleContextMenu}
        >
          {/* White keys */}
          <div className="flex h-full gap-[2px]">
            {WHITE_KEYS.map((key) => {
              const isPressed = pressedKeys.has(key.note);
              return (
                <button
                  key={key.note}
                  data-note={key.note}
                  data-freq={key.freq}
                  className={`
                    relative flex-1 rounded-b-xl border border-pink-100/80 transition-all duration-75
                    ${
                      isPressed
                        ? "bg-gradient-to-b from-pink-100 to-pink-200 shadow-inner scale-[0.98] border-pink-200"
                        : "bg-gradient-to-b from-white to-pink-50/60 shadow-md hover:from-pink-50 hover:to-pink-100/40"
                    }
                  `}
                  style={{ touchAction: "none" }}
                  aria-label={key.note}
                />
              );
            })}
          </div>

          {/* Black keys — positioned absolutely over the white keys */}
          {BLACK_KEYS.map((key) => {
            const isPressed = pressedKeys.has(key.note);
            const whiteIdx = getBlackKeyWhiteIndex(key.note);
            const leftPercent =
              ((whiteIdx + 1) / totalWhiteKeys) * 100;
            const widthPercent = (1 / totalWhiteKeys) * 70;

            return (
              <button
                key={key.note}
                data-note={key.note}
                data-freq={key.freq}
                className={`
                  absolute top-0 rounded-b-lg transition-all duration-75 z-10
                  ${
                    isPressed
                      ? "bg-gradient-to-b from-purple-400 to-purple-600 shadow-inner scale-[0.97]"
                      : "bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 shadow-lg hover:from-purple-800 hover:to-purple-950"
                  }
                `}
                style={{
                  left: `${leftPercent - widthPercent / 2}%`,
                  width: `${widthPercent}%`,
                  height: "58%",
                  touchAction: "none",
                }}
                aria-label={key.note}
              />
            );
          })}

          {/* Touch sparkle effects */}
          {sparkles.map((s) => (
            <div
              key={s.id}
              className="absolute pointer-events-none animate-piano-sparkle"
              style={{ left: s.x - 10, top: s.y - 10 }}
            >
              <Sparkles className="text-yellow-400" size={20} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
