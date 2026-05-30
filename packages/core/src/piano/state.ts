import { createPianoKeys } from "./keys.ts";
import { getPianoKeyId, getPianoKeyMidi } from "./notes.ts";
import type { PianoKey, PianoKeyInput, PianoKeyState, PianoOptions, PianoState } from "./types.ts";

export function createPianoState(
  pressedKeys: readonly PianoKeyInput[] = [],
  options: PianoOptions = {},
): PianoState {
  const keys = createPianoKeys(options);
  const pressedKeyIds = normalizePianoPressedKeyIds(pressedKeys, keys);
  const pressedKeyIdSet = new Set(pressedKeyIds);
  const keyStates = keys.map<PianoKeyState>((key) => ({
    ...key,
    pressed: pressedKeyIdSet.has(key.id),
  }));
  const pressedKeyStateById = new Map(keyStates.map((key) => [key.id, key]));
  const statePressedKeys = pressedKeyIds.flatMap((id) => {
    const key = pressedKeyStateById.get(id);
    return key === undefined ? [] : [key];
  });

  return {
    keys: keyStates,
    pressedKeyIds,
    pressedKeys: statePressedKeys,
    keyCount: keyStates.length,
    whiteKeyCount: keyStates.filter((key) => key.color === "white").length,
    startKey: keyStates[0] as PianoKeyState,
    endKey: keyStates[keyStates.length - 1] as PianoKeyState,
  };
}

export function normalizePianoPressedKeyIds(
  pressedKeys: readonly PianoKeyInput[],
  keys: readonly PianoKey[],
): string[] {
  const validKeyIds = new Set(keys.map((key) => key.id));
  const validMidiIds = new Map(keys.map((key) => [key.midi, key.id]));
  const seen = new Set<string>();
  const normalizedKeyIds: string[] = [];

  for (const pressedKey of pressedKeys) {
    const keyId =
      typeof pressedKey === "number"
        ? validMidiIds.get(Math.round(pressedKey))
        : getPianoKeyId(pressedKey);
    const midi = getPianoKeyMidi(pressedKey);
    const normalizedKeyId =
      keyId !== undefined && validKeyIds.has(keyId) ? keyId : validMidiIds.get(midi ?? NaN);

    if (normalizedKeyId === undefined || seen.has(normalizedKeyId)) {
      continue;
    }

    seen.add(normalizedKeyId);
    normalizedKeyIds.push(normalizedKeyId);
  }

  return normalizedKeyIds;
}
