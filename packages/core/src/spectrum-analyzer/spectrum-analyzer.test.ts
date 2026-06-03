import { expect, test } from "vite-plus/test";
import {
  createSpectrumAnalyzerState,
  getSpectrumAnalyzerFrequencyFromPercent,
  getSpectrumAnalyzerFrequencyPercent,
  getSpectrumAnalyzerMagnitudeFromPercent,
  getSpectrumAnalyzerMagnitudePercent,
  getSpectrumAnalyzerPath,
  normalizeSpectrumAnalyzerValue,
} from "../index.ts";

const bins = [
  { id: "sub", frequency: 40, magnitude: -42 },
  { id: "body", frequency: 160, magnitude: -18 },
  { id: "presence", frequency: 3200, magnitude: -9 },
  { id: "air", frequency: 12000, magnitude: -24 },
] as const;

test("converts spectrum analyzer frequency and x positions", () => {
  expect(getSpectrumAnalyzerFrequencyPercent(20)).toBe(0);
  expect(getSpectrumAnalyzerFrequencyPercent(20000)).toBe(1);
  expect(getSpectrumAnalyzerFrequencyPercent(632.455532)).toBeCloseTo(0.5, 6);
  expect(getSpectrumAnalyzerFrequencyFromPercent(0.5)).toBeCloseTo(632.455532, 5);
  expect(getSpectrumAnalyzerFrequencyPercent(1000, { frequencyScale: "linear" })).toBeCloseTo(
    0.049049,
    6,
  );
  expect(getSpectrumAnalyzerFrequencyFromPercent(0.5, { frequencyScale: "linear" })).toBe(10010);
});

test("converts spectrum analyzer magnitude and y positions", () => {
  expect(getSpectrumAnalyzerMagnitudePercent(-90)).toBe(0);
  expect(getSpectrumAnalyzerMagnitudePercent(0)).toBe(1);
  expect(getSpectrumAnalyzerMagnitudePercent(-45)).toBe(0.5);
  expect(getSpectrumAnalyzerMagnitudeFromPercent(0.5)).toBe(-45);
});

test("normalizes empty, numeric, single, and out-of-range values", () => {
  expect(normalizeSpectrumAnalyzerValue(undefined)).toEqual([]);
  expect(normalizeSpectrumAnalyzerValue([-120, -45, 6])).toEqual([
    { frequency: 20, magnitude: -90 },
    { frequency: expect.closeTo(632.455532, 5), magnitude: -45 },
    { frequency: 20000, magnitude: 0 },
  ]);
  expect(normalizeSpectrumAnalyzerValue([-12])).toEqual([
    { frequency: expect.closeTo(632.455532, 5), magnitude: -12 },
  ]);
  expect(
    normalizeSpectrumAnalyzerValue([{ frequency: 0, magnitude: Number.POSITIVE_INFINITY }]),
  ).toEqual([{ frequency: 20, magnitude: -90 }]);
});

test("creates bin geometry and peak state", () => {
  const state = createSpectrumAnalyzerState([...bins]);

  expect(state).toMatchObject({
    minFrequency: 20,
    maxFrequency: 20000,
    minMagnitude: -90,
    maxMagnitude: 0,
    frequencyScale: "log",
    binCount: 4,
    empty: false,
    peak: { id: "presence", frequency: 3200, magnitude: -9 },
  });
  expect(state.bins[0]).toMatchObject({
    id: "sub",
    index: 0,
    x: expect.closeTo(0.100343, 6),
    y: expect.closeTo(0.533333, 6),
  });
  expect(state.bins.every((bin) => bin.barStart >= 0 && bin.barEnd <= 1)).toBe(true);
  expect(createSpectrumAnalyzerState([])).toMatchObject({
    bins: [],
    curve: [],
    peak: null,
    empty: true,
  });
});

test("marks clipped and out-of-range bins", () => {
  const state = createSpectrumAnalyzerState([
    { frequency: 10, magnitude: -120 },
    { frequency: 40000, magnitude: 3 },
  ]);

  expect(state.bins[0]).toMatchObject({
    frequency: 20,
    magnitude: -90,
    clipped: false,
    outOfRange: true,
  });
  expect(state.bins[1]).toMatchObject({
    frequency: 20000,
    magnitude: 0,
    clipped: true,
    outOfRange: true,
  });
});

test("generates a deterministic spectrum curve path", () => {
  const state = createSpectrumAnalyzerState([...bins]);

  expect(getSpectrumAnalyzerPath(state.curve)).toBe(
    "M 0.100343 0.466667 L 0.30103 0.2 L 0.734707 0.1 L 0.92605 0.266667",
  );
});
