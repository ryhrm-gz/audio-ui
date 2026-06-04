import { expect, test } from "vite-plus/test";
import {
  createSliderState,
  getNextSliderKeyboardValue,
  getSliderPercent,
  getSliderValueFromLinearDrag,
  getSliderValueFromPercent,
  getSliderValueFromPoint,
  normalizeSliderValue,
} from "../index.ts";

test("normalizes slider values with shared range behavior", () => {
  expect(normalizeSliderValue([12.26], { min: 0, max: 20, step: 0.5 })).toEqual([12.5]);
  expect(getSliderValueFromPercent(0.25, [-60], 0, { min: -60, max: 12, step: 0.5 })).toEqual([
    -42,
  ]);
});

test("normalizes slider range values with clamping, steps, ordering, and thumb distance", () => {
  expect(normalizeSliderValue([90, 10])).toEqual([10, 90]);
  expect(normalizeSliderValue([9.2, 83.8], { min: 0, max: 80, step: 5 })).toEqual([10, 80]);
  expect(
    normalizeSliderValue([20, 24], {
      step: 5,
      minStepsBetweenThumbs: 2,
    }),
  ).toEqual([20, 30]);
  expect(normalizeSliderValue([20, 24], { minDistance: 8 })).toEqual([20, 28]);
  expect(
    normalizeSliderValue([90, 80], {
      step: 5,
      minStepsBetweenThumbs: 2,
      activeThumb: 0,
    }),
  ).toEqual([70, 80]);
});

test("normalizes more than two thumbs and applies per-thumb bounds", () => {
  expect(normalizeSliderValue([90, 10, 50])).toEqual([10, 50, 90]);
  expect(
    normalizeSliderValue([10, 50, 90], {
      thumbs: [{ max: 20 }, { min: 40, max: 60 }, { min: 80 }],
    }),
  ).toEqual([10, 50, 90]);
  expect(
    normalizeSliderValue([30, 20, 70], {
      minDistance: 10,
      thumbs: [{ max: 40 }, { min: 20, max: 50 }, { min: 60 }],
    }),
  ).toEqual([20, 30, 70]);
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
      [0],
      0,
      { max: 50, min: 0 },
    ),
  ).toEqual([25]);

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
      [0],
      0,
      { orientation: "vertical" },
    ),
  ).toEqual([75]);

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
      [0],
      0,
      { inverted: true },
    ),
  ).toEqual([75]);
});

test("handles slider keyboard step commands", () => {
  expect(getNextSliderKeyboardValue([10], 0, "ArrowRight", { step: 2 })).toEqual([12]);
  expect(getNextSliderKeyboardValue([10], 0, "ArrowRight", { step: 2 }, { fine: true })).toEqual([
    12,
  ]);
  expect(getNextSliderKeyboardValue([10], 0, "PageUp", { step: 2 })).toEqual([30]);
  expect(getNextSliderKeyboardValue([10], 0, "Home", { min: -12 })).toEqual([-12]);
});

test("handles slider range keyboard movement without crossing thumbs", () => {
  expect(
    getNextSliderKeyboardValue([20, 50], 0, "ArrowRight", {
      step: 10,
      minStepsBetweenThumbs: 2,
    }),
  ).toEqual([30, 50]);
  expect(
    getNextSliderKeyboardValue([30, 50], 0, "ArrowRight", {
      step: 10,
      minStepsBetweenThumbs: 2,
    }),
  ).toEqual([30, 50]);
  expect(
    getNextSliderKeyboardValue([20, 50], 1, "Home", {
      step: 10,
      minStepsBetweenThumbs: 2,
    }),
  ).toEqual([20, 40]);
  expect(getNextSliderKeyboardValue([20, 50], 1, "Escape")).toBeUndefined();
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
      [25],
      0,
      { max: 50, min: 0, step: 1 },
      { fine: true },
    ),
  ).toEqual([28]);
});

test("maps slider range pointer positions by orientation and inversion", () => {
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
      [10, 80],
      0,
    ),
  ).toEqual([50, 80]);

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
      [10, 80],
      1,
      { orientation: "vertical" },
    ),
  ).toEqual([10, 75]);

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
      [10, 80],
      0,
      { inverted: true },
    ),
  ).toEqual([75, 80]);
});

test("maps slider range linear drag with fine control", () => {
  const drag = {
    trackX: 100,
    trackY: 20,
    trackWidth: 200,
    trackHeight: 20,
    startValue: 50,
    startPointX: 200,
    startPointY: 30,
    pointX: 150,
    pointY: 30,
  };

  expect(getSliderValueFromLinearDrag(drag, [10, 80], 0)).toEqual([25, 80]);
  expect(getSliderValueFromLinearDrag(drag, [10, 80], 0, {}, { fine: true })).toEqual([48, 80]);

  const verticalDrag = {
    trackX: 100,
    trackY: 20,
    trackWidth: 20,
    trackHeight: 200,
    startValue: 50,
    startPointX: 110,
    startPointY: 120,
    pointX: 110,
    pointY: 70,
  };

  expect(
    getSliderValueFromLinearDrag(verticalDrag, [10, 80], 1, { orientation: "vertical" }),
  ).toEqual([10, 75]);
});

test("creates a complete serializable slider state object", () => {
  expect(createSliderState([25], { orientation: "vertical", inverted: true })).toEqual({
    value: [25],
    min: 0,
    max: 100,
    step: 1,
    minStepsBetweenThumbs: 0,
    minDistance: 0,
    percent: [0.25],
    origin: "left",
    originPercent: 0,
    rangeStartPercent: 0,
    rangeEndPercent: 0.25,
    rangeSizePercent: 0.25,
    orientation: "vertical",
    inverted: true,
    thumbs: [
      {
        index: 0,
        value: 25,
        percent: 0.25,
        min: 0,
        max: 100,
      },
    ],
  });
});

test("derives slider range percents and serializable state", () => {
  expect(getSliderPercent([20, 80])).toEqual([0.2, 0.8]);
  expect(createSliderState([20, 80], { minStepsBetweenThumbs: 2 })).toMatchObject({
    value: [20, 80],
    min: 0,
    max: 100,
    step: 1,
    minStepsBetweenThumbs: 2,
    minDistance: 2,
    percent: [0.2, 0.8],
    rangeStartPercent: 0.2,
    rangeEndPercent: 0.8,
    rangeSizePercent: 0.6,
    orientation: "horizontal",
    inverted: false,
    thumbs: [
      {
        index: 0,
        value: 20,
        percent: 0.2,
        min: 0,
        max: 78,
      },
      {
        index: 1,
        value: 80,
        percent: 0.8,
        min: 22,
        max: 100,
      },
    ],
  });
});

test("creates slider range state from left, center, and right origins", () => {
  expect(createSliderState([25])).toMatchObject({
    origin: "left",
    originPercent: 0,
    rangeStartPercent: 0,
    rangeEndPercent: 0.25,
    rangeSizePercent: 0.25,
  });
  expect(createSliderState([25], { origin: "center" })).toMatchObject({
    origin: "center",
    originPercent: 0.5,
    rangeStartPercent: 0.25,
    rangeEndPercent: 0.5,
    rangeSizePercent: 0.25,
  });
  expect(createSliderState([75], { origin: "center" })).toMatchObject({
    rangeStartPercent: 0.5,
    rangeEndPercent: 0.75,
    rangeSizePercent: 0.25,
  });
  expect(createSliderState([25], { origin: "right" })).toMatchObject({
    origin: "right",
    originPercent: 1,
    rangeStartPercent: 0.25,
    rangeEndPercent: 1,
    rangeSizePercent: 0.75,
  });
});
