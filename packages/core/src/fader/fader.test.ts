import { expect, test } from "vite-plus/test";
import {
  createFaderState,
  getFaderGain,
  getFaderValueFromLinearDrag,
  getFaderValueFromPercent,
  getFaderValueFromPoint,
  getNextFaderKeyboardValue,
  normalizeFaderValue,
} from "../index.ts";

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
