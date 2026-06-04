import { expect, test } from "vite-plus/test";
import {
  createRangeSliderState,
  getNextRangeSliderKeyboardValue,
  getRangeSliderPercent,
  getRangeSliderValueFromLinearDrag,
  getRangeSliderValueFromPoint,
  normalizeRangeSliderValue,
} from "../index.ts";

test("normalizes range slider values with clamping, steps, ordering, and thumb distance", () => {
  expect(normalizeRangeSliderValue([90, 10])).toEqual([10, 90]);
  expect(normalizeRangeSliderValue([9.2, 83.8], { min: 0, max: 80, step: 5 })).toEqual([10, 80]);
  expect(
    normalizeRangeSliderValue([20, 24], {
      step: 5,
      minStepsBetweenThumbs: 2,
    }),
  ).toEqual([20, 30]);
  expect(normalizeRangeSliderValue([20, 24], { minDistance: 8 })).toEqual([20, 28]);
  expect(
    normalizeRangeSliderValue([90, 80], {
      step: 5,
      minStepsBetweenThumbs: 2,
      activeThumb: 0,
    }),
  ).toEqual([70, 80]);
});

test("derives range slider percents and serializable state", () => {
  expect(getRangeSliderPercent([20, 80])).toEqual([0.2, 0.8]);
  expect(createRangeSliderState([20, 80], { minStepsBetweenThumbs: 2 })).toMatchObject({
    value: [20, 80],
    min: 0,
    max: 100,
    step: 1,
    minStepsBetweenThumbs: 2,
    minDistance: 2,
    percent: [0.2, 0.8],
    startPercent: 0.2,
    endPercent: 0.8,
    sizePercent: 0.6,
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

test("maps range slider pointer positions by orientation and inversion", () => {
  expect(
    getRangeSliderValueFromPoint(
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
    getRangeSliderValueFromPoint(
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
    getRangeSliderValueFromPoint(
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

test("maps range slider linear drag with fine control", () => {
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

  // Normal drag: 50% track moved left -> 25% value
  expect(getRangeSliderValueFromLinearDrag(drag, [10, 80], 0)).toEqual([25, 80]);

  // Fine drag: 50% track moved left at 0.1 factor -> 47.5%, snapped to the normal step.
  expect(getRangeSliderValueFromLinearDrag(drag, [10, 80], 0, {}, { fine: true })).toEqual([
    48, 80,
  ]);

  // Vertical orientation
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

  // Normal drag: 50% track moved up -> 75% value
  expect(
    getRangeSliderValueFromLinearDrag(verticalDrag, [10, 80], 1, { orientation: "vertical" }),
  ).toEqual([10, 75]);
});

test("handles range slider keyboard movement without crossing thumbs", () => {
  expect(
    getNextRangeSliderKeyboardValue([20, 50], 0, "ArrowRight", {
      step: 10,
      minStepsBetweenThumbs: 2,
    }),
  ).toEqual([30, 50]);
  expect(
    getNextRangeSliderKeyboardValue([30, 50], 0, "ArrowRight", {
      step: 10,
      minStepsBetweenThumbs: 2,
    }),
  ).toEqual([30, 50]);
  expect(
    getNextRangeSliderKeyboardValue([20, 50], 1, "Home", {
      step: 10,
      minStepsBetweenThumbs: 2,
    }),
  ).toEqual([20, 40]);
  expect(getNextRangeSliderKeyboardValue([20, 50], 1, "Escape")).toBeUndefined();
});
