import { expect, test } from "vite-plus/test";
import {
  createFaderState,
  createKnobState,
  createLevelMeterState,
  createPianoKeys,
  createPianoState,
  createSliderState,
  getFaderValueFromLinearDrag,
  getFaderValueFromPercent,
  getFaderValueFromPoint,
  getFaderGain,
  getFineStep,
  getKnobAngle,
  getLevelMeterAmplitudeFromDb,
  getLevelMeterDbFromAmplitude,
  getLevelMeterPercent,
  getKnobValueFromLinearDrag,
  getKnobValueFromPoint,
  getNextFaderKeyboardValue,
  getNextKeyboardValue,
  getNextSliderKeyboardValue,
  getPianoKeyId,
  getSliderValueFromLinearDrag,
  normalizeFaderValue,
  getSliderValueFromPercent,
  getSliderValueFromPoint,
  normalizeKnobValue,
  normalizeSliderValue,
} from "./index.ts";

test("normalizes values to the configured range and step", () => {
  expect(normalizeKnobValue(12.26, { min: 0, max: 20, step: 0.5 })).toBe(12.5);
  expect(normalizeKnobValue(-1, { min: 0, max: 20, step: 0.5 })).toBe(0);
  expect(normalizeKnobValue(22, { min: 0, max: 20, step: 0.5 })).toBe(20);
});

test("maps values to angles", () => {
  expect(getKnobAngle(0)).toBe(-135);
  expect(getKnobAngle(50)).toBe(0);
  expect(getKnobAngle(100)).toBe(135);
});

test("maps pointer positions to values", () => {
  expect(
    getKnobValueFromPoint({
      centerX: 50,
      centerY: 50,
      pointX: 50,
      pointY: 0,
    }),
  ).toBe(50);

  expect(
    getKnobValueFromPoint({
      centerX: 50,
      centerY: 50,
      pointX: 0,
      pointY: 100,
    }),
  ).toBe(0);
});

test("maps vertical drag movement to values", () => {
  expect(
    getKnobValueFromLinearDrag({
      startValue: 50,
      startY: 100,
      pointY: 75,
      trackSize: 100,
    }),
  ).toBe(75);

  expect(
    getKnobValueFromLinearDrag({
      startValue: 50,
      startY: 100,
      pointY: 150,
      trackSize: 100,
    }),
  ).toBe(0);
});

test("handles keyboard step commands", () => {
  expect(getNextKeyboardValue(10, "ArrowUp", { step: 2 })).toBe(12);
  expect(getNextKeyboardValue(10, "ArrowUp", { step: 2 }, { fine: true })).toBe(10.2);
  expect(getNextKeyboardValue(10, "PageDown", { step: 2 })).toBe(0);
  expect(getNextKeyboardValue(10, "End", { max: 24 })).toBe(24);
  expect(getNextKeyboardValue(10, "Escape")).toBeUndefined();
});

test("normalizes reversed ranges and invalid steps", () => {
  expect(normalizeKnobValue(75, { min: 100, max: 0, step: -2 })).toBe(75);
  expect(getNextKeyboardValue(75, "ArrowUp", { min: 100, max: 0, step: -2 })).toBe(76);
});

test("falls back to a sane drag track size", () => {
  expect(
    getKnobValueFromLinearDrag({
      startValue: 50,
      startY: 100,
      pointY: 50,
      trackSize: 0,
    }),
  ).toBe(100);
});

test("creates a complete serializable state object", () => {
  expect(createKnobState(25)).toEqual({
    value: 25,
    min: 0,
    max: 100,
    step: 1,
    minAngle: -135,
    maxAngle: 135,
    percent: 0.25,
    angle: -67.5,
  });
});

test("preserves fine-resolution values without changing the configured step", () => {
  expect(getFineStep(2)).toBe(0.2);
  expect(createKnobState(10.24, { step: 2, valueStep: 0.2 })).toMatchObject({
    value: 10.2,
    step: 2,
  });
});

test("normalizes slider values with shared range behavior", () => {
  expect(normalizeSliderValue(12.26, { min: 0, max: 20, step: 0.5 })).toBe(12.5);
  expect(getSliderValueFromPercent(0.25, { min: -60, max: 12, step: 0.5 })).toBe(-42);
});

test("maps slider pointer positions to values", () => {
  expect(
    getSliderValueFromPoint(
      {
        trackX: 100,
        trackY: 20,
        trackWidth: 200,
        trackHeight: 20,
        pointX: 200,
        pointY: 30,
      },
      { max: 50, min: 0 },
    ),
  ).toBe(25);

  expect(
    getSliderValueFromPoint(
      {
        trackX: 100,
        trackY: 20,
        trackWidth: 20,
        trackHeight: 200,
        pointX: 110,
        pointY: 70,
      },
      { orientation: "vertical" },
    ),
  ).toBe(75);

  expect(
    getSliderValueFromPoint(
      {
        trackX: 100,
        trackY: 20,
        trackWidth: 200,
        trackHeight: 20,
        pointX: 150,
        pointY: 30,
      },
      { inverted: true },
    ),
  ).toBe(75);
});

test("handles slider keyboard step commands", () => {
  expect(getNextSliderKeyboardValue(10, "ArrowRight", { step: 2 })).toBe(12);
  expect(getNextSliderKeyboardValue(10, "ArrowRight", { step: 2 }, { fine: true })).toBe(10.2);
  expect(getNextSliderKeyboardValue(10, "PageUp", { step: 2 })).toBe(30);
  expect(getNextSliderKeyboardValue(10, "Home", { min: -12 })).toBe(-12);
});

test("maps fine slider drag movement from the drag start", () => {
  expect(
    getSliderValueFromLinearDrag(
      {
        trackX: 100,
        trackY: 20,
        trackWidth: 200,
        trackHeight: 20,
        startValue: 25,
        startPointX: 150,
        startPointY: 30,
        pointX: 250,
        pointY: 30,
      },
      { max: 50, min: 0, step: 1 },
      { fine: true },
    ),
  ).toBe(27.5);
});

test("creates a complete serializable slider state object", () => {
  expect(createSliderState(25, { orientation: "vertical", inverted: true })).toEqual({
    value: 25,
    min: 0,
    max: 100,
    step: 1,
    percent: 0.25,
    origin: "left",
    originPercent: 0,
    rangeStartPercent: 0,
    rangeEndPercent: 0.25,
    rangeSizePercent: 0.25,
    orientation: "vertical",
    inverted: true,
  });
});

test("creates slider range state from left, center, and right origins", () => {
  expect(createSliderState(25)).toMatchObject({
    origin: "left",
    originPercent: 0,
    rangeStartPercent: 0,
    rangeEndPercent: 0.25,
    rangeSizePercent: 0.25,
  });
  expect(createSliderState(25, { origin: "center" })).toMatchObject({
    origin: "center",
    originPercent: 0.5,
    rangeStartPercent: 0.25,
    rangeEndPercent: 0.5,
    rangeSizePercent: 0.25,
  });
  expect(createSliderState(75, { origin: "center" })).toMatchObject({
    rangeStartPercent: 0.5,
    rangeEndPercent: 0.75,
    rangeSizePercent: 0.25,
  });
  expect(createSliderState(25, { origin: "right" })).toMatchObject({
    origin: "right",
    originPercent: 1,
    rangeStartPercent: 0.25,
    rangeEndPercent: 1,
    rangeSizePercent: 0.75,
  });
});

test("normalizes fader values with shared range behavior", () => {
  expect(normalizeFaderValue(-5.26, { min: -60, max: 12, step: 0.5 })).toBe(-5.5);
  expect(getFaderValueFromPercent(0.75, { step: 0.5 })).toBe(-1.5);
});

test("maps fader pointer positions through the fader scale", () => {
  expect(
    getFaderValueFromPoint(
      {
        trackX: 100,
        trackY: 20,
        trackWidth: 40,
        trackHeight: 200,
        pointX: 120,
        pointY: 70,
      },
      { step: 0.5 },
    ),
  ).toBe(-1.5);

  expect(
    getFaderValueFromPoint(
      {
        trackX: 100,
        trackY: 20,
        trackWidth: 40,
        trackHeight: 200,
        pointX: 120,
        pointY: 70,
      },
      { inverted: true, step: 0.5 },
    ),
  ).toBe(-31);
});

test("handles fader keyboard step commands", () => {
  expect(getNextFaderKeyboardValue(10, "ArrowUp", { step: 2 })).toBe(12);
  expect(getNextFaderKeyboardValue(10, "ArrowUp", { step: 2 }, { fine: true })).toBe(10.2);
  expect(getNextFaderKeyboardValue(10, "PageDown", { step: 2 })).toBe(0);
  expect(getNextFaderKeyboardValue(10, "End", { max: 24 })).toBe(24);
});

test("maps fine fader drag movement from the drag start", () => {
  expect(
    getFaderValueFromLinearDrag(
      {
        trackX: 100,
        trackY: 20,
        trackWidth: 40,
        trackHeight: 200,
        startValue: 50,
        startPointX: 120,
        startPointY: 120,
        pointX: 120,
        pointY: 20,
      },
      {
        min: 0,
        max: 100,
        step: 1,
        scale: [
          { value: 0, percent: 0 },
          { value: 100, percent: 1 },
        ],
      },
      { fine: true },
    ),
  ).toBe(55);
});

test("creates a complete serializable fader state object", () => {
  const state = createFaderState(-6, { step: 0.5 });

  expect(state).toMatchObject({
    value: -6,
    min: -60,
    max: 12,
    step: 0.5,
    inverted: false,
    unity: 0,
    unityPercent: 0.78,
  });
  expect(state.percent).toBeCloseTo(0.656);
  expect(state.gain).toBeCloseTo(0.501);
  expect(state.scale).toContainEqual({
    value: 0,
    percent: 0.78,
    label: "0",
  });
});

test("maps fader dB values to linear gain", () => {
  expect(getFaderGain(0)).toBe(1);
  expect(getFaderGain(-6)).toBeCloseTo(0.501);
  expect(getFaderGain(-60)).toBe(0);
});

test("maps level meter dB values and amplitudes", () => {
  expect(getLevelMeterPercent(-60)).toBe(0);
  expect(getLevelMeterPercent(6)).toBe(1);
  expect(getLevelMeterDbFromAmplitude(0.5)).toBeCloseTo(-6.021);
  expect(getLevelMeterDbFromAmplitude(0)).toBe(-60);
  expect(getLevelMeterAmplitudeFromDb(-6)).toBeCloseTo(0.501);
});

test("creates a complete serializable level meter state object", () => {
  const state = createLevelMeterState([-12, 2, Number.NaN], {
    channels: 3,
    peak: [-6, 4, -72],
  });

  expect(state).toMatchObject({
    value: [-12, 2, -60],
    min: -60,
    max: 6,
    clip: 0,
    peakValue: [-6, 4, -60],
    maxValue: 2,
    clipped: true,
  });
  expect(state.channels[0]).toMatchObject({
    value: -12,
    clipped: false,
  });
  expect(state.channels[0]?.percent).toBeCloseTo(0.727);
  expect(state.channels[1]).toMatchObject({
    value: 2,
    clipped: true,
  });
  expect(state.peak[1]).toMatchObject({
    value: 4,
    clipped: true,
  });
  expect(state.segments).toContainEqual({
    id: "warning",
    label: "Warning",
    from: -12,
    to: 0,
    startPercent: expect.any(Number),
    endPercent: expect.any(Number),
    sizePercent: expect.any(Number),
  });
});

test("resolves custom level meter segments", () => {
  const state = createLevelMeterState(-12, {
    min: -48,
    max: 12,
    segments: [
      { id: "green", from: -48, to: -9 },
      { id: "amber", from: -9, to: 0 },
      { id: "red", from: 0, to: 12 },
    ],
  });

  expect(state.segments).toMatchObject([
    {
      id: "green",
      from: -48,
      to: -9,
      startPercent: 0,
      endPercent: 0.65,
    },
    {
      id: "amber",
      from: -9,
      to: 0,
      startPercent: 0.65,
      endPercent: 0.8,
    },
    {
      id: "red",
      from: 0,
      to: 12,
      startPercent: 0.8,
      endPercent: 1,
    },
  ]);
});

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
