export interface RangeOptions {
  min?: number;
  max?: number;
  step?: number;
}

export interface RangeValueOptions {
  valueStep?: number;
}

export interface ResolvedRange {
  min: number;
  max: number;
  step: number;
}

export const defaultRangeOptions = {
  min: 0,
  max: 100,
  step: 1,
} satisfies Required<RangeOptions>;

export const defaultFineControlFactor = 0.1;

export function resolveRangeOptions(
  options: RangeOptions = {},
  defaults: Required<RangeOptions> = defaultRangeOptions,
): ResolvedRange {
  const min = options.min ?? defaults.min;
  const max = options.max ?? defaults.max;
  const step = options.step ?? defaults.step;

  return {
    min: Math.min(min, max),
    max: Math.max(min, max),
    step: Number.isFinite(step) && step > 0 ? step : defaults.step,
  };
}

export function clampValue(value: number, options: RangeOptions = {}) {
  const { min, max } = resolveRangeOptions(options);
  return Math.min(Math.max(value, min), max);
}

export function snapValueToStep(value: number, options: RangeOptions & RangeValueOptions = {}) {
  const { min, max, step } = resolveRangeOptions(options);
  const valueStep = resolveValueStep(options.valueStep, step);
  const steppedValue = Math.round((value - min) / valueStep) * valueStep + min;
  const precision = getDecimalPrecision(valueStep);
  return clampValue(Number(steppedValue.toFixed(precision)), { min, max, step });
}

export function normalizeRangeValue(value: number, options: RangeOptions & RangeValueOptions = {}) {
  const { min, max, step } = resolveRangeOptions(options);
  return snapValueToStep(value, { min, max, step, valueStep: options.valueStep });
}

export function getRangePercent(value: number, options: RangeOptions = {}) {
  const { min, max } = resolveRangeOptions(options);
  const span = max - min;

  if (span === 0) {
    return 0;
  }

  return (clampValue(value, { min, max }) - min) / span;
}

export function getRangeValueFromPercent(
  percent: number,
  options: RangeOptions & RangeValueOptions = {},
) {
  const { min, max, step } = resolveRangeOptions(options);
  const clampedPercent = Math.min(Math.max(percent, 0), 1);
  return normalizeRangeValue(min + (max - min) * clampedPercent, {
    min,
    max,
    step,
    valueStep: options.valueStep,
  });
}

export function resolveFineControlFactor(fineControlFactor?: number) {
  return typeof fineControlFactor === "number" &&
    Number.isFinite(fineControlFactor) &&
    fineControlFactor > 0
    ? fineControlFactor
    : defaultFineControlFactor;
}

function resolveValueStep(valueStep: number | undefined, fallbackStep: number) {
  return typeof valueStep === "number" && Number.isFinite(valueStep) && valueStep > 0
    ? valueStep
    : fallbackStep;
}

function getDecimalPrecision(value: number): number {
  const valueText = value.toString();
  const [coefficient, exponent] = valueText.split("e-");

  if (exponent !== undefined) {
    const coefficientPrecision = getDecimalPrecision(Number(coefficient));
    return coefficientPrecision + Number(exponent);
  }

  const decimalIndex = valueText.indexOf(".");

  if (decimalIndex === -1) {
    return 0;
  }

  return valueText.length - decimalIndex - 1;
}
