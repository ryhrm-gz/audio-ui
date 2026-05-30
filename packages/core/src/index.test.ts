import { expect, test } from "vite-plus/test";
import {
  createFaderState,
  createKnobState,
  createSliderState,
  getFaderValueFromLinearDrag,
  getFaderValueFromPercent,
  getFaderValueFromPoint,
  getFaderGain,
  getFineStep,
  getKnobAngle,
  getKnobValueFromLinearDrag,
  getKnobValueFromPoint,
  getNextFaderKeyboardValue,
  getNextKeyboardValue,
  getNextSliderKeyboardValue,
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
    orientation: "vertical",
    inverted: true,
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
