import {
  clampValue as clampRangeValue,
  getRangePercent,
  getRangeValueFromPercent,
  normalizeRangeValue,
  snapValueToStep as snapRangeValueToStep,
} from "../shared/range.ts";
import { resolveXYPadOptions } from "./options.ts";
import type { XYPadOptions, XYPadValue, XYPadValueOptions } from "./types.ts";

export function clampXYPadValue(value: XYPadValue, options: XYPadOptions = {}): XYPadValue {
  const resolvedOptions = resolveXYPadOptions(options);

  return {
    x: clampRangeValue(value.x, {
      min: resolvedOptions.minX,
      max: resolvedOptions.maxX,
      step: resolvedOptions.stepX,
    }),
    y: clampRangeValue(value.y, {
      min: resolvedOptions.minY,
      max: resolvedOptions.maxY,
      step: resolvedOptions.stepY,
    }),
  };
}

export function snapXYPadValueToStep(
  value: XYPadValue,
  options: XYPadOptions & XYPadValueOptions = {},
): XYPadValue {
  const resolvedOptions = resolveXYPadOptions(options);

  return {
    x: snapRangeValueToStep(value.x, {
      min: resolvedOptions.minX,
      max: resolvedOptions.maxX,
      step: resolvedOptions.stepX,
      valueStep: options.valueStepX,
    }),
    y: snapRangeValueToStep(value.y, {
      min: resolvedOptions.minY,
      max: resolvedOptions.maxY,
      step: resolvedOptions.stepY,
      valueStep: options.valueStepY,
    }),
  };
}

export function normalizeXYPadValue(
  value: XYPadValue,
  options: XYPadOptions & XYPadValueOptions = {},
): XYPadValue {
  const resolvedOptions = resolveXYPadOptions(options);

  return {
    x: normalizeRangeValue(value.x, {
      min: resolvedOptions.minX,
      max: resolvedOptions.maxX,
      step: resolvedOptions.stepX,
      valueStep: options.valueStepX,
    }),
    y: normalizeRangeValue(value.y, {
      min: resolvedOptions.minY,
      max: resolvedOptions.maxY,
      step: resolvedOptions.stepY,
      valueStep: options.valueStepY,
    }),
  };
}

export function getXYPadXPercent(value: XYPadValue, options: XYPadOptions = {}) {
  const resolvedOptions = resolveXYPadOptions(options);
  return getRangePercent(value.x, {
    min: resolvedOptions.minX,
    max: resolvedOptions.maxX,
    step: resolvedOptions.stepX,
  });
}

export function getXYPadYPercent(value: XYPadValue, options: XYPadOptions = {}) {
  const resolvedOptions = resolveXYPadOptions(options);
  return getRangePercent(value.y, {
    min: resolvedOptions.minY,
    max: resolvedOptions.maxY,
    step: resolvedOptions.stepY,
  });
}

export function getXYPadPercent(value: XYPadValue, options: XYPadOptions = {}): XYPadValue {
  return {
    x: getXYPadXPercent(value, options),
    y: getXYPadYPercent(value, options),
  };
}

export function getXYPadValueFromPercent(
  percent: XYPadValue,
  options: XYPadOptions & XYPadValueOptions = {},
): XYPadValue {
  const resolvedOptions = resolveXYPadOptions(options);

  return {
    x: getRangeValueFromPercent(percent.x, {
      min: resolvedOptions.minX,
      max: resolvedOptions.maxX,
      step: resolvedOptions.stepX,
      valueStep: options.valueStepX,
    }),
    y: getRangeValueFromPercent(percent.y, {
      min: resolvedOptions.minY,
      max: resolvedOptions.maxY,
      step: resolvedOptions.stepY,
      valueStep: options.valueStepY,
    }),
  };
}
