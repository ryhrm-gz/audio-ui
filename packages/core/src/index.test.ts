import { expect, test } from "vite-plus/test";
import {
  createKnobState,
  createSliderState,
  getKnobAngle,
  getKnobValueFromLinearDrag,
  getKnobValueFromPoint,
  getNextKeyboardValue,
  getNextSliderKeyboardValue,
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
  expect(getNextSliderKeyboardValue(10, "PageUp", { step: 2 })).toBe(30);
  expect(getNextSliderKeyboardValue(10, "Home", { min: -12 })).toBe(-12);
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
