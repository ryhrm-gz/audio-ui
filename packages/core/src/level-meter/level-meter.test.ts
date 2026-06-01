import { expect, test } from "vite-plus/test";
import {
  createLevelMeterState,
  getLevelMeterAmplitudeFromDb,
  getLevelMeterDbFromAmplitude,
  getLevelMeterPercent,
} from "../index.ts";

test("maps level meter dB values and amplitudes", () => {
  expect(getLevelMeterPercent(-60)).toBe(0);
  expect(getLevelMeterPercent(6)).toBe(1);
  expect(getLevelMeterDbFromAmplitude(0.5)).toBeCloseTo(-6.021);
  expect(getLevelMeterDbFromAmplitude(0)).toBe(-60);
  expect(getLevelMeterAmplitudeFromDb(-6)).toBeCloseTo(0.501);
});

test("creates a complete serializable level meter state object", () => {
  const state = createLevelMeterState([-12, 2, Number.NaN], {
    channels: 3,
    peak: [-6, 4, -72],
  });

  expect(state).toMatchObject({
    value: [-12, 2, -60],
    min: -60,
    max: 6,
    clip: 0,
    orientation: "vertical",
    peakValue: [-6, 4, -60],
    maxValue: 2,
    clipped: true,
  });
  expect(state.channels[0]).toMatchObject({
    value: -12,
    clipped: false,
  });
  expect(state.channels[0]?.percent).toBeCloseTo(0.727);
  expect(state.channels[1]).toMatchObject({
    value: 2,
    clipped: true,
  });
  expect(state.peak[1]).toMatchObject({
    value: 4,
    clipped: true,
  });
  expect(state.segments).toContainEqual({
    id: "warning",
    label: "Warning",
    from: -12,
    to: 0,
    startPercent: expect.any(Number),
    endPercent: expect.any(Number),
    sizePercent: expect.any(Number),
  });
});

test("supports horizontal level meter orientation", () => {
  const state = createLevelMeterState(-12, { orientation: "horizontal" });

  expect(state.orientation).toBe("horizontal");
});

test("resolves custom level meter segments", () => {
  const state = createLevelMeterState(-12, {
    min: -48,
    max: 12,
    segments: [
      { id: "green", from: -48, to: -9 },
      { id: "amber", from: -9, to: 0 },
      { id: "red", from: 0, to: 12 },
    ],
  });

  expect(state.segments).toMatchObject([
    {
      id: "green",
      from: -48,
      to: -9,
      startPercent: 0,
      endPercent: 0.65,
    },
    {
      id: "amber",
      from: -9,
      to: 0,
      startPercent: 0.65,
      endPercent: 0.8,
    },
    {
      id: "red",
      from: 0,
      to: 12,
      startPercent: 0.8,
      endPercent: 1,
    },
  ]);
});
