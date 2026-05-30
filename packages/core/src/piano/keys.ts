import { getPianoKeyFromMidi, getPianoKeyMidi } from "./notes.ts";
import type { PianoKey, PianoOptions } from "./types.ts";

const DEFAULT_START_MIDI = 60;
const DEFAULT_KEY_COUNT = 12;
const BLACK_KEY_SIZE_RATIO = 0.6;

export function createPianoKeys(options: PianoOptions = {}): PianoKey[] {
  const startMidi = getPianoKeyMidi(options.startKey ?? DEFAULT_START_MIDI) ?? DEFAULT_START_MIDI;
  const keyCount = getPianoKeyCount(options.keyCount);
  const baseKeys = Array.from({ length: keyCount }, (_, index) =>
    getPianoKeyFromMidi(startMidi + index),
  );
  const whiteKeyCount = Math.max(1, baseKeys.filter((key) => key.color === "white").length);
  let whiteIndex = -1;
  let blackIndex = -1;

  return baseKeys.map((key, index) => {
    if (key.color === "white") {
      whiteIndex += 1;

      return {
        ...key,
        index,
        whiteIndex,
        startPercent: whiteIndex / whiteKeyCount,
        sizePercent: 1 / whiteKeyCount,
      };
    }

    blackIndex += 1;

    const adjacentWhiteIndex = Math.max(0, whiteIndex);
    const sizePercent = BLACK_KEY_SIZE_RATIO / whiteKeyCount;
    const startPercent = (adjacentWhiteIndex + 1 - BLACK_KEY_SIZE_RATIO / 2) / whiteKeyCount;

    return {
      ...key,
      index,
      whiteIndex: adjacentWhiteIndex,
      blackIndex,
      startPercent: clamp(startPercent, 0, 1 - sizePercent),
      sizePercent,
    };
  });
}

export function getPianoKeyCount(keyCount: number | undefined): number {
  if (keyCount === undefined || !Number.isFinite(keyCount)) {
    return DEFAULT_KEY_COUNT;
  }

  return Math.max(1, Math.floor(keyCount));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
