import { expect, test } from "vite-plus/test";
import {
  createXYPadState,
  getNextXYPadKeyboardValue,
  getXYPadPercent,
  getXYPadValueFromLinearDrag,
  getXYPadValueFromPercent,
  getXYPadValueFromPoint,
  normalizeXYPadValue,
} from "./index.ts";

test("normalizes XYPad values to the configured ranges and steps", () => {
  expect(
    normalizeXYPadValue(
      { x: 12.26, y: -2 },
      { minX: 0, maxX: 20, stepX: 0.5, minY: -10, maxY: 10, stepY: 2 },
    ),
  ).toEqual({ x: 12.5, y: -2 });
  expect(normalizeXYPadValue({ x: -1, y: 120 })).toEqual({ x: 0, y: 100 });
});

test("quantizes XYPad axes independently", () => {
  expect(
    normalizeXYPadValue(
      { x: 3.24, y: 3.24 },
      { minX: 0, maxX: 10, stepX: 0.5, minY: 0, maxY: 10, stepY: 2 },
    ),
  ).toEqual({ x: 3, y: 4 });
});

test("calculates XYPad percents and values from percents", () => {
  expect(getXYPadPercent({ x: 0, y: 50 }, { minX: -100, maxX: 100 })).toEqual({
    x: 0.5,
    y: 0.5,
  });
  expect(
    getXYPadValueFromPercent(
      { x: 0.25, y: 0.75 },
      { minX: -100, maxX: 100, stepX: 1, minY: -60, maxY: 12, stepY: 0.5 },
    ),
  ).toEqual({ x: -50, y: -6 });
});

test("maps XYPad pointer positions to values", () => {
  expect(
    getXYPadValueFromPoint(
      {
        areaX: 100,
        areaY: 20,
        areaWidth: 200,
        areaHeight: 100,
        pointX: 200,
        pointY: 70,
      },
      { maxX: 50, minX: 0, maxY: 20, minY: -20 },
    ),
  ).toEqual({ x: 25, y: 0 });
});

test("maps fine XYPad drag movement from the drag start", () => {
  expect(
    getXYPadValueFromLinearDrag(
      {
        areaX: 100,
        areaY: 20,
        areaWidth: 200,
        areaHeight: 100,
        startValue: { x: 25, y: 50 },
        startPointX: 150,
        startPointY: 70,
        pointX: 250,
        pointY: 20,
      },
      { maxX: 50, minX: 0, stepX: 1, maxY: 100, minY: 0, stepY: 1 },
      { fine: true },
    ),
  ).toEqual({ x: 27.5, y: 55 });
});

test("handles XYPad keyboard movement", () => {
  expect(getNextXYPadKeyboardValue({ x: 10, y: 20 }, "ArrowRight", { stepX: 2 })).toEqual({
    x: 12,
    y: 20,
  });
  expect(
    getNextXYPadKeyboardValue({ x: 10, y: 20 }, "ArrowUp", { stepY: 2 }, { fine: true }),
  ).toEqual({ x: 10, y: 20.2 });
  expect(getNextXYPadKeyboardValue({ x: 10, y: 20 }, "PageDown", { stepY: 2 })).toEqual({
    x: 10,
    y: 0,
  });
  expect(
    getNextXYPadKeyboardValue({ x: 10, y: 20 }, "Home", {
      minX: -12,
      minY: -24,
      maxX: 24,
      maxY: 48,
    }),
  ).toEqual({ x: -12, y: -24 });
  expect(
    getNextXYPadKeyboardValue({ x: 10, y: 20 }, "End", {
      minX: -12,
      minY: -24,
      maxX: 24,
      maxY: 48,
    }),
  ).toEqual({ x: 24, y: 48 });
  expect(getNextXYPadKeyboardValue({ x: 10, y: 20 }, "Escape")).toBeUndefined();
});

test("creates a complete serializable XYPad state object with default options", () => {
  expect(createXYPadState({ x: 25, y: 75 })).toEqual({
    value: { x: 25, y: 75 },
    minX: 0,
    maxX: 100,
    stepX: 1,
    minY: 0,
    maxY: 100,
    stepY: 1,
    xPercent: 0.25,
    yPercent: 0.75,
  });
});
