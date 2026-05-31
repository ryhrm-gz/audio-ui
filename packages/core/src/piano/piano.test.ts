import { expect, test } from "vite-plus/test";
import { createPianoKeys, createPianoState, getPianoKeyId } from "../index.ts";

test("resolves piano note names and generated key ranges", () => {
  expect(getPianoKeyId("Db4")).toBe("C#4");
  expect(getPianoKeyId(60)).toBe("C4");

  const keys = createPianoKeys({ startKey: "A0", keyCount: 88 });

  expect(keys[0]).toMatchObject({
    id: "A0",
    midi: 21,
    color: "white",
  });
  expect(keys[87]).toMatchObject({
    id: "C8",
    midi: 108,
    color: "white",
  });
});

test("positions piano black keys across the visible white key range", () => {
  const keys = createPianoKeys({ startKey: "C4", keyCount: 12 });
  const blackKeyStarts = keys
    .filter((key) => key.color === "black")
    .map((key) => ({ id: key.id, startPercent: key.startPercent }));

  expect(blackKeyStarts.map((key) => key.id)).toEqual(["C#4", "D#4", "F#4", "G#4", "A#4"]);
  expect(blackKeyStarts[0]?.startPercent).toBeCloseTo(0.1);
  expect(blackKeyStarts[1]?.startPercent).toBeCloseTo(0.242857);
  expect(blackKeyStarts[2]?.startPercent).toBeCloseTo(0.528571);
  expect(blackKeyStarts[3]?.startPercent).toBeCloseTo(0.671429);
  expect(blackKeyStarts[4]?.startPercent).toBeCloseTo(0.814286);
});

test("creates piano state from pressed key inputs", () => {
  const state = createPianoState(["C4", 61, "D4", "C4", "F4"], {
    startKey: "C4",
    keyCount: 3,
  });

  expect(state).toMatchObject({
    pressedKeyIds: ["C4", "C#4", "D4"],
    keyCount: 3,
    whiteKeyCount: 2,
  });
  expect(state.pressedKeys.map((key) => key.id)).toEqual(["C4", "C#4", "D4"]);
  expect(state.keys.map((key) => key.pressed)).toEqual([true, true, true]);
});
