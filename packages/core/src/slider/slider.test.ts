import { expect, test } from "vite-plus/test";
import {
  createSliderState,
  getNextSliderKeyboardValue,
  getSliderValueFromLinearDrag,
  getSliderValueFromPercent,
  getSliderValueFromPoint,
  normalizeSliderValue,
} from "../index.ts";

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
