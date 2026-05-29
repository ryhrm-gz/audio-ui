import { expect, test } from "vite-plus/test";
import {
  createKnobState,
  getKnobAngle,
  getKnobValueFromPoint,
  getNextKeyboardValue,
  normalizeKnobValue,
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

test("handles keyboard step commands", () => {
  expect(getNextKeyboardValue(10, "ArrowUp", { step: 2 })).toBe(12);
  expect(getNextKeyboardValue(10, "PageDown", { step: 2 })).toBe(0);
  expect(getNextKeyboardValue(10, "End", { max: 24 })).toBe(24);
  expect(getNextKeyboardValue(10, "Escape")).toBeUndefined();
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
