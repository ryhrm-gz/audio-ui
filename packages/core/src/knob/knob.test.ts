import { expect, test } from "vite-plus/test";
import {
  createKnobState,
  getKnobAngle,
  getKnobMarkPoint,
  getKnobTickPoints,
  getKnobValueFromLinearDrag,
  getKnobValueFromPoint,
  getNextKeyboardValue,
  normalizeKnobValue,
  resolveFineControlFactor,
} from "../index.ts";

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

test("resolves value marks to clamped positions", () => {
  const mark = getKnobMarkPoint(25, { min: 0, max: 100, minAngle: -120, maxAngle: 120 });

  expect(mark).toMatchObject({
    value: 25,
    percent: 0.25,
    angle: -60,
  });
  expect(mark.x).toBeCloseTo(-0.866);
  expect(mark.y).toBeCloseTo(-0.5);
  expect(getKnobMarkPoint(120, { min: 0, max: 100 })).toMatchObject({
    value: 100,
    percent: 1,
    angle: 135,
  });
});

test("generates evenly spaced knob ticks", () => {
  const ticks = getKnobTickPoints(3, { min: -10, max: 10, minAngle: -90, maxAngle: 90 });

  expect(ticks).toMatchObject([
    { value: -10, percent: 0, angle: -90 },
    { value: 0, percent: 0.5, angle: 0 },
    { value: 10, percent: 1, angle: 90 },
  ]);
  expect(ticks[0]?.x).toBeCloseTo(-1);
  expect(ticks[1]?.y).toBeCloseTo(-1);
  expect(ticks[2]?.x).toBeCloseTo(1);
  expect(getKnobTickPoints(1, { min: -10, max: 10 })).toMatchObject([
    { value: -10, percent: 0, angle: -135 },
  ]);
  expect(getKnobTickPoints(0)).toEqual([]);
  expect(getKnobTickPoints(Number.NaN)).toEqual([]);
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
  expect(getNextKeyboardValue(10, "ArrowUp", { step: 2 }, { fine: true })).toBe(12);
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

test("resolves fine control factors without changing the configured step", () => {
  expect(resolveFineControlFactor()).toBe(0.1);
  expect(resolveFineControlFactor(0.05)).toBe(0.05);
  expect(createKnobState(10.24, { step: 2, valueStep: 0.2 })).toMatchObject({
    value: 10.2,
    step: 2,
  });
});
