import { expect, test } from "vite-plus/test";
import {
  createEQCurveState,
  getEQCurveFrequencyFromPercent,
  getEQCurveFrequencyPercent,
  getEQCurveGainFromPercent,
  getEQCurveGainPercent,
  getEQCurvePoints,
  getEQCurveValueFromBandPosition,
  getNextEQCurveKeyboardValue,
  normalizeEQCurveBand,
} from "../index.ts";

const bands = [
  { id: "low", type: "low-shelf", frequency: 120, gain: 3, q: 0.7 },
  { id: "mid", type: "bell", frequency: 1000, gain: -4, q: 1.2 },
  { id: "air", type: "high-shelf", frequency: 8000, gain: 5, q: 0.8 },
] as const;

test("converts EQ curve frequency and x positions with a log scale", () => {
  expect(getEQCurveFrequencyPercent(20)).toBe(0);
  expect(getEQCurveFrequencyPercent(20000)).toBe(1);
  expect(getEQCurveFrequencyPercent(632.455532, { stepFrequency: 0.000001 })).toBeCloseTo(0.5, 6);
  expect(getEQCurveFrequencyFromPercent(0.5, { stepFrequency: 0.000001 })).toBeCloseTo(
    632.455532,
    5,
  );
});

test("converts EQ curve gain and y positions", () => {
  expect(getEQCurveGainPercent(-24)).toBe(0);
  expect(getEQCurveGainPercent(24)).toBe(1);
  expect(getEQCurveGainPercent(0)).toBe(0.5);
  expect(getEQCurveGainFromPercent(0.75)).toBe(12);
});

test("clamps and normalizes EQ curve bands", () => {
  expect(
    normalizeEQCurveBand({
      id: "peak",
      type: "bell",
      frequency: 10,
      gain: 31.25,
      q: 42,
      enabled: false,
    }),
  ).toEqual({
    id: "peak",
    type: "bell",
    frequency: 20,
    gain: 24,
    q: 18,
    enabled: false,
  });
});

test("updates band frequency and gain from a dragged position", () => {
  expect(
    getEQCurveValueFromBandPosition(
      [{ id: "mid", type: "bell", frequency: 1000, gain: 0, q: 1 }],
      "mid",
      { x: 0.5, y: 0.75 },
      { stepFrequency: 0.000001 },
    ),
  ).toEqual([
    {
      id: "mid",
      type: "bell",
      frequency: expect.closeTo(632.455532, 5),
      gain: 12,
      q: 1,
      enabled: true,
    },
  ]);
});

test("updates q from keyboard movement", () => {
  expect(
    getNextEQCurveKeyboardValue(
      [{ id: "mid", type: "bell", frequency: 1000, gain: 0, q: 1 }],
      "mid",
      "ArrowUp",
      { stepQ: 0.2 },
      { q: true, fine: true },
    ),
  ).toEqual([
    {
      id: "mid",
      type: "bell",
      frequency: 1000,
      gain: expect.closeTo(0, 10),
      q: expect.closeTo(1.02, 10),
      enabled: true,
    },
  ]);
});

test("generates deterministic UI preview curve points", () => {
  const first = getEQCurvePoints([...bands], { curveResolution: 8, stepFrequency: 0.000001 });
  const second = getEQCurvePoints([...bands], { curveResolution: 8, stepFrequency: 0.000001 });

  expect(first).toEqual(second);
  expect(first).toHaveLength(8);
  expect(first[0]).toMatchObject({ x: 0, frequency: 20 });
  expect(first.at(-1)).toMatchObject({ x: 1, frequency: 20000 });
  expect(first.map((point) => Number(point.gain.toFixed(3)))).toEqual([
    2.791, 2.288, 1.319, 0.342, -3.606, 0.807, 2.381, 3.949,
  ]);
});

test("creates a complete serializable EQ curve state", () => {
  expect(
    createEQCurveState([{ id: "mid", type: "bell", frequency: 1000, gain: -3, q: 2 }], {
      curveResolution: 4,
    }),
  ).toMatchObject({
    value: [{ id: "mid", type: "bell", frequency: 1000, gain: -3, q: 2, enabled: true }],
    minFrequency: 20,
    maxFrequency: 20000,
    minGain: -24,
    maxGain: 24,
    minQ: 0.1,
    maxQ: 18,
    stepFrequency: 1,
    stepGain: 0.1,
    stepQ: 0.1,
    curveResolution: 4,
    activeBand: null,
  });
});
