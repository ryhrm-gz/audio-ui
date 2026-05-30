import type { PianoKeyColor, PianoKeyInput, PianoNoteName } from "./types.ts";

export const PIANO_NOTE_NAMES: PianoNoteName[] = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

const NOTE_ALIASES: Record<string, PianoNoteName> = {
  C: "C",
  "B#": "C",
  "C#": "C#",
  DB: "C#",
  D: "D",
  "D#": "D#",
  EB: "D#",
  E: "E",
  FB: "E",
  F: "F",
  "E#": "F",
  "F#": "F#",
  GB: "F#",
  G: "G",
  "G#": "G#",
  AB: "G#",
  A: "A",
  "A#": "A#",
  BB: "A#",
  B: "B",
  CB: "B",
};

export function getPianoKeyColor(note: PianoNoteName): PianoKeyColor {
  return note.includes("#") ? "black" : "white";
}

export function getPianoKeyId(input: PianoKeyInput): string | undefined {
  const key = resolvePianoKeyInput(input);

  if (key === undefined) {
    return undefined;
  }

  return `${key.note}${key.octave}`;
}

export function getPianoKeyMidi(input: PianoKeyInput): number | undefined {
  return resolvePianoKeyInput(input)?.midi;
}

export function resolvePianoKeyInput(input: PianoKeyInput) {
  if (typeof input === "number") {
    if (!Number.isFinite(input)) {
      return undefined;
    }

    return getPianoKeyFromMidi(Math.round(input));
  }

  if (typeof input === "string") {
    return parsePianoKey(input);
  }

  return parsePianoKey(`${input.note}${input.octave}`);
}

export function getPianoKeyFromMidi(midi: number) {
  const semitone = modulo(midi, PIANO_NOTE_NAMES.length);
  const octave = Math.floor(midi / PIANO_NOTE_NAMES.length) - 1;
  const note = PIANO_NOTE_NAMES[semitone];

  return {
    id: `${note}${octave}`,
    note,
    octave,
    midi,
    color: getPianoKeyColor(note),
    semitone,
  };
}

function parsePianoKey(input: string) {
  const match = input.trim().match(/^([A-Ga-g])([#bB]?)(-?\d+)$/);

  if (match === null) {
    return undefined;
  }

  const [, letter = "", accidental = "", octaveText = ""] = match;
  const note = NOTE_ALIASES[`${letter.toUpperCase()}${accidental.toUpperCase()}`];
  const octave = Number(octaveText);

  if (note === undefined || !Number.isInteger(octave)) {
    return undefined;
  }

  const semitone = PIANO_NOTE_NAMES.indexOf(note);
  const midi = (octave + 1) * PIANO_NOTE_NAMES.length + semitone;

  return {
    id: `${note}${octave}`,
    note,
    octave,
    midi,
    color: getPianoKeyColor(note),
    semitone,
  };
}

function modulo(value: number, divisor: number) {
  return ((value % divisor) + divisor) % divisor;
}
