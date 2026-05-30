import { resolveLevelMeterOptions } from "./options.ts";
import type { LevelMeterOptions, LevelMeterState, LevelMeterValue } from "./types.ts";
import {
  getLevelMeterPercent,
  normalizeLevelMeterValue,
  normalizeLevelMeterValues,
} from "./value.ts";

export function createLevelMeterState(
  value?: LevelMeterValue,
  options: LevelMeterOptions & { peak?: LevelMeterValue } = {},
): LevelMeterState {
  const resolvedOptions = resolveLevelMeterOptions(options);
  const normalizedValues = normalizeLevelMeterValues(value, resolvedOptions);
  const normalizedPeaks = normalizeLevelMeterValues(options.peak ?? value, resolvedOptions);
  const channels = normalizedValues.map((nextValue) =>
    createChannelState(nextValue, resolvedOptions),
  );
  const peak = normalizedPeaks.map((nextValue) => createChannelState(nextValue, resolvedOptions));
  const maxValue = Math.max(...normalizedValues);
  const maxPercent = getLevelMeterPercent(maxValue, resolvedOptions);

  return {
    ...resolvedOptions,
    value: normalizedValues,
    channels,
    peak,
    peakValue: normalizedPeaks,
    maxValue,
    maxPercent,
    clipped: channels.some((channel) => channel.clipped) || peak.some((channel) => channel.clipped),
  };
}

function createChannelState(value: number, options: ReturnType<typeof resolveLevelMeterOptions>) {
  const normalizedValue = normalizeLevelMeterValue(value, options);

  return {
    value: normalizedValue,
    percent: getLevelMeterPercent(normalizedValue, options),
    clipped: normalizedValue >= options.clip,
  };
}
