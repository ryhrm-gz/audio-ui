import { expect, test } from "vite-plus/test";
import {
  createCompressorCurveState,
  getCompressorCurveInputFromPercent,
  getCompressorCurveInputPercent,
  getCompressorCurveOutput,
  getCompressorCurveOutputFromPercent,
  getCompressorCurveOutputPercent,
  getCompressorCurvePoints,
  normalizeCompressorCurveValue,
} from "../index.ts";

const value = {
  threshold: -24,
  ratio: 4,
  knee: 8,
  makeupGain: 3,
} as const;

test("converts compressor curve input and output positions", () => {
  expect(getCompressorCurveInputPercent(-60)).toBe(0);
  expect(getCompressorCurveInputPercent(12)).toBe(1);
  expect(getCompressorCurveInputPercent(-24)).toBe(0.5);
  expect(getCompressorCurveInputFromPercent(0.5)).toBe(-24);
  expect(getCompressorCurveOutputPercent(-60)).toBe(0);
  expect(getCompressorCurveOutputPercent(12)).toBe(1);
  expect(getCompressorCurveOutputFromPercent(0.5)).toBe(-24);
});

test("calculates hard and soft knee compressor output", () => {
  expect(
    getCompressorCurveOutput(0, {
      threshold: -24,
      ratio: 4,
      knee: 0,
      makeupGain: 0,
    }),
  ).toBe(-18);
  expect(getCompressorCurveOutput(-24, value)).toBe(-21.75);
});

test("clamps and normalizes compressor curve values", () => {
  expect(
    normalizeCompressorCurveValue({
      threshold: -100,
      ratio: 99,
      knee: 99,
      makeupGain: -99,
    }),
  ).toEqual({
    threshold: -60,
    ratio: 20,
    knee: 48,
    makeupGain: -24,
  });
});

test("generates deterministic compressor curve points", () => {
  const first = getCompressorCurvePoints(value, { curveResolution: 5 });
  const second = getCompressorCurvePoints(value, { curveResolution: 5 });

  expect(first).toEqual(second);
  expect(first).toHaveLength(5);
  expect(first[0]).toMatchObject({ x: 0, input: -60, output: -57 });
  expect(first.at(-1)).toMatchObject({ x: 1, input: 12 });
  expect(first.map((point) => Number(point.output.toFixed(3)))).toEqual([
    -57, -39, -21.75, -16.5, -12,
  ]);
});

test("creates a complete serializable compressor curve state", () => {
  expect(createCompressorCurveState(value, { curveResolution: 4 })).toMatchObject({
    value,
    minInput: -60,
    maxInput: 12,
    minOutput: -60,
    maxOutput: 12,
    minThreshold: -60,
    maxThreshold: 12,
    minRatio: 1,
    maxRatio: 20,
    minKnee: 0,
    maxKnee: 48,
    minMakeupGain: -24,
    maxMakeupGain: 24,
    stepThreshold: 0.1,
    stepRatio: 0.1,
    stepKnee: 0.1,
    stepMakeupGain: 0.1,
    curveResolution: 4,
  });
});
