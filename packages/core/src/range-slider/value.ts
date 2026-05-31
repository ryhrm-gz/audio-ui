import {
  getRangePercent,
  getRangeValueFromPercent,
  normalizeRangeValue,
  type RangeValueOptions,
} from "../shared/range.ts";
import { resolveRangeSliderOptions } from "./options.ts";
import type {
  RangeSliderOptions,
  RangeSliderRange,
  RangeSliderThumbIndex,
  RangeSliderValue,
} from "./types.ts";

export interface RangeSliderValueOptions extends RangeValueOptions {
  activeThumb?: RangeSliderThumbIndex;
}

export function normalizeRangeSliderValue(
  value: readonly [number, number],
  options: RangeSliderRange & RangeSliderValueOptions = {},
): RangeSliderValue {
  const resolvedOptions = resolveRangeSliderOptions(options);
  const { min, max, step, minDistance } = resolvedOptions;
  const valueOptions = { min, max, step, valueStep: options.valueStep };
  const lower = normalizeFiniteValue(value[0], min, valueOptions);
  const upper = normalizeFiniteValue(value[1], max, valueOptions);

  if (options.activeThumb === 0) {
    const stableUpper = Math.max(upper, normalizeRangeValue(min + minDistance, valueOptions));
    return [
      normalizeRangeValue(lower, {
        min,
        max: Math.max(min, stableUpper - minDistance),
        step,
        valueStep: options.valueStep,
      }),
      stableUpper,
    ];
  }

  if (options.activeThumb === 1) {
    const stableLower = Math.min(lower, normalizeRangeValue(max - minDistance, valueOptions));
    return [
      stableLower,
      normalizeRangeValue(upper, {
        min: Math.min(max, stableLower + minDistance),
        max,
        step,
        valueStep: options.valueStep,
      }),
    ];
  }

  const sorted: RangeSliderValue = lower <= upper ? [lower, upper] : [upper, lower];

  if (sorted[1] - sorted[0] >= minDistance) {
    return sorted;
  }

  const expandedUpper = normalizeRangeValue(sorted[0] + minDistance, valueOptions);

  if (expandedUpper <= max) {
    return [sorted[0], expandedUpper];
  }

  return [normalizeRangeValue(sorted[1] - minDistance, valueOptions), sorted[1]];
}

export function getRangeSliderPercent(
  value: readonly [number, number],
  options: RangeSliderRange = {},
): RangeSliderValue {
  const resolvedValue = normalizeRangeSliderValue(value, options);
  return [getRangePercent(resolvedValue[0], options), getRangePercent(resolvedValue[1], options)];
}

export function getRangeSliderRangePercents(percent: readonly [number, number]) {
  const startPercent = Math.min(percent[0], percent[1]);
  const endPercent = Math.max(percent[0], percent[1]);

  return {
    startPercent,
    endPercent,
    sizePercent: roundPercent(endPercent - startPercent),
  };
}

export function getRangeSliderThumbBounds(
  value: readonly [number, number],
  options: RangeSliderRange = {},
) {
  const { min, max, minDistance } = resolveRangeSliderOptions(options);
  const normalizedValue = normalizeRangeSliderValue(value, options);

  return [
    {
      min,
      max: Math.max(min, normalizedValue[1] - minDistance),
    },
    {
      min: Math.min(max, normalizedValue[0] + minDistance),
      max,
    },
  ] as const;
}

export function getRangeSliderValueFromPercent(
  percent: number,
  value: readonly [number, number],
  activeThumb: RangeSliderThumbIndex,
  options: RangeSliderOptions & RangeValueOptions = {},
): RangeSliderValue {
  const nextThumbValue = getRangeValueFromPercent(percent, options);
  const nextValue: RangeSliderValue = [...value] as RangeSliderValue;
  nextValue[activeThumb] = nextThumbValue;

  return normalizeRangeSliderValue(nextValue, {
    ...options,
    activeThumb,
  });
}

export function getClosestRangeSliderThumbIndex(
  value: readonly [number, number],
  percent: number,
  options: RangeSliderRange = {},
): RangeSliderThumbIndex {
  const [lowerPercent, upperPercent] = getRangeSliderPercent(value, options);
  const lowerDistance = Math.abs(percent - lowerPercent);
  const upperDistance = Math.abs(percent - upperPercent);

  if (lowerDistance === upperDistance) {
    return percent <= (lowerPercent + upperPercent) / 2 ? 0 : 1;
  }

  return lowerDistance < upperDistance ? 0 : 1;
}

function normalizeFiniteValue(
  value: number,
  fallback: number,
  options: RangeSliderRange & RangeValueOptions,
) {
  return normalizeRangeValue(Number.isFinite(value) ? value : fallback, options);
}

function roundPercent(value: number) {
  return Number(value.toFixed(12));
}
