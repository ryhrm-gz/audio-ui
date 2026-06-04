import {
  getRangePercent,
  getRangeValueFromPercent,
  normalizeRangeValue,
  type RangeValueOptions,
} from "../shared/range.ts";
import { resolveSliderOptions } from "./options.ts";
import type {
  SliderOptions,
  SliderOrigin,
  SliderRange,
  SliderThumbIndex,
  SliderValue,
} from "./types.ts";

export interface SliderValueOptions extends RangeValueOptions {
  activeThumb?: SliderThumbIndex;
}

export function normalizeSliderValue(
  value: readonly number[],
  options: SliderRange & SliderValueOptions = {},
): SliderValue {
  const resolvedOptions = resolveSliderOptions(options);
  const thumbCount = getSliderThumbCount(value, options);
  const initialValue = Array.from({ length: thumbCount }, (_, index) => {
    const fallback = getFallbackThumbValue(index, thumbCount, resolvedOptions);
    const bounds = getBaseThumbBounds(index, resolvedOptions);
    const rawValue = value[index] ?? fallback;
    return normalizeFiniteValue(rawValue, fallback, {
      ...bounds,
      step: resolvedOptions.step,
      valueStep: options.valueStep,
    });
  });

  if (thumbCount === 1) {
    return initialValue;
  }

  if (options.activeThumb !== undefined) {
    const activeThumb = clampThumbIndex(options.activeThumb, thumbCount);
    const nextValue = [...initialValue];
    const bounds = getSliderThumbBoundsForValue(nextValue, activeThumb, resolvedOptions);
    nextValue[activeThumb] = normalizeFiniteValue(
      value[activeThumb] ?? nextValue[activeThumb],
      nextValue[activeThumb],
      {
        ...bounds,
        step: resolvedOptions.step,
        valueStep: options.valueStep,
      },
    );
    return nextValue;
  }

  return normalizeOrderedSliderValue(initialValue, resolvedOptions, options);
}

export function getSliderPercent(value: readonly number[], options: SliderRange = {}): SliderValue {
  const resolvedValue = normalizeSliderValue(value, options);
  return resolvedValue.map((thumbValue) => getRangePercent(thumbValue, options));
}

export function getSliderOriginPercent(origin: SliderOrigin) {
  if (origin === "center") {
    return 0.5;
  }

  if (origin === "right") {
    return 1;
  }

  return 0;
}

export function getSliderValueRangePercents(percent: readonly number[], originPercent: number) {
  const rangePercents = percent.length === 1 ? [originPercent, percent[0]] : percent;
  const rangeStartPercent = Math.min(...rangePercents);
  const rangeEndPercent = Math.max(...rangePercents);

  return {
    rangeStartPercent,
    rangeEndPercent,
    rangeSizePercent: roundPercent(rangeEndPercent - rangeStartPercent),
  };
}

export function getSliderValueFromPercent(
  percent: number,
  value: readonly number[],
  activeThumb: SliderThumbIndex,
  options: SliderOptions & RangeValueOptions = {},
) {
  const thumbCount = getSliderThumbCount(value, options);
  const resolvedThumb = clampThumbIndex(activeThumb, thumbCount);
  const bounds = getSliderThumbBoundsForValue(value, resolvedThumb, resolveSliderOptions(options));
  const nextThumbValue = normalizeRangeValue(getRangeValueFromPercent(percent, options), {
    ...options,
    min: bounds.min,
    max: bounds.max,
  });
  const nextValue = [...value];
  nextValue[resolvedThumb] = nextThumbValue;

  return normalizeSliderValue(nextValue, {
    ...options,
    activeThumb: resolvedThumb,
  });
}

export function getClosestSliderThumbIndex(
  value: readonly number[],
  percent: number,
  options: SliderRange = {},
): SliderThumbIndex {
  const percents = getSliderPercent(value, options);
  return percents.reduce(
    (closestIndex, thumbPercent, index) =>
      Math.abs(percent - thumbPercent) < Math.abs(percent - percents[closestIndex])
        ? index
        : closestIndex,
    0,
  );
}

export function getSliderThumbBounds(value: readonly number[], options: SliderRange = {}) {
  const resolvedOptions = resolveSliderOptions(options);
  const normalizedValue = normalizeSliderValue(value, options);

  return normalizedValue.map((_, index) =>
    getSliderThumbBoundsForValue(normalizedValue, index, resolvedOptions),
  );
}

function normalizeOrderedSliderValue(
  value: SliderValue,
  options: Required<SliderOptions>,
  valueOptions: SliderValueOptions,
): SliderValue {
  const sortedValue = [...value].sort((left, right) => left - right);
  const forwardValue = sortedValue.map((thumbValue, index, values) => {
    const bounds = getBaseThumbBounds(index, options);
    const min =
      index === 0 ? bounds.min : Math.max(bounds.min, values[index - 1] + options.minDistance);
    return normalizeFiniteValue(thumbValue, thumbValue, {
      min,
      max: bounds.max,
      step: options.step,
      valueStep: valueOptions.valueStep,
    });
  });

  for (let index = forwardValue.length - 2; index >= 0; index -= 1) {
    const bounds = getBaseThumbBounds(index, options);
    const max = Math.min(bounds.max, forwardValue[index + 1] - options.minDistance);
    forwardValue[index] = normalizeFiniteValue(forwardValue[index], forwardValue[index], {
      min: bounds.min,
      max,
      step: options.step,
      valueStep: valueOptions.valueStep,
    });
  }

  return forwardValue;
}

function getSliderThumbBoundsForValue(
  value: readonly number[],
  index: SliderThumbIndex,
  options: Required<SliderOptions>,
) {
  const bounds = getBaseThumbBounds(index, options);
  const previousValue = value[index - 1];
  const nextValue = value[index + 1];
  const min =
    previousValue === undefined
      ? bounds.min
      : Math.max(bounds.min, previousValue + options.minDistance);
  const max =
    nextValue === undefined ? bounds.max : Math.min(bounds.max, nextValue - options.minDistance);

  return {
    min: Math.min(min, max),
    max: Math.max(min, max),
  };
}

function getBaseThumbBounds(index: SliderThumbIndex, options: Required<SliderOptions>) {
  const thumb = options.thumbs[index];
  const min = Math.max(options.min, thumb?.min ?? options.min);
  const max = Math.min(options.max, thumb?.max ?? options.max);

  return {
    min: Math.min(min, max),
    max: Math.max(min, max),
  };
}

function getSliderThumbCount(value: readonly number[], options: SliderRange) {
  return Math.max(1, value.length, options.thumbs?.length ?? 0);
}

function getFallbackThumbValue(
  index: SliderThumbIndex,
  thumbCount: number,
  options: Required<SliderOptions>,
) {
  if (thumbCount === 1) {
    return options.min;
  }

  return options.min + ((options.max - options.min) * index) / (thumbCount - 1);
}

function clampThumbIndex(index: SliderThumbIndex, thumbCount: number) {
  return Math.min(Math.max(Math.trunc(index), 0), thumbCount - 1);
}

function normalizeFiniteValue(
  value: number,
  fallback: number,
  options: SliderRange & SliderValueOptions = {},
) {
  return normalizeRangeValue(Number.isFinite(value) ? value : fallback, options);
}

function roundPercent(value: number) {
  return Number(value.toFixed(12));
}
