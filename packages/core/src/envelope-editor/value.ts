import { getRangePercent, getRangeValueFromPercent, normalizeRangeValue } from "../shared/range.ts";
import { resolveEnvelopeEditorOptions } from "./options.ts";
import type {
  EnvelopeEditorOptions,
  EnvelopeEditorValue,
  EnvelopeEditorValueOptions,
} from "./types.ts";

export const defaultEnvelopeEditorValue = {
  attack: 0,
  decay: 0.2,
  sustain: 0.7,
  release: 0.3,
} satisfies EnvelopeEditorValue;

export function normalizeEnvelopeEditorValue(
  value: EnvelopeEditorValue,
  options: EnvelopeEditorOptions & EnvelopeEditorValueOptions = {},
): EnvelopeEditorValue {
  const { minTime, maxTime, stepTime, minLevel, maxLevel, stepLevel } =
    resolveEnvelopeEditorOptions(options);

  return {
    attack: normalizeRangeValue(value.attack, {
      min: minTime,
      max: maxTime,
      step: stepTime,
      valueStep: options.valueStepTime,
    }),
    decay: normalizeRangeValue(value.decay, {
      min: minTime,
      max: maxTime,
      step: stepTime,
      valueStep: options.valueStepTime,
    }),
    sustain: normalizeRangeValue(value.sustain, {
      min: minLevel,
      max: maxLevel,
      step: stepLevel,
      valueStep: options.valueStepLevel,
    }),
    release: normalizeRangeValue(value.release, {
      min: minTime,
      max: maxTime,
      step: stepTime,
      valueStep: options.valueStepTime,
    }),
  };
}

export function getEnvelopeEditorTotalDuration(value: EnvelopeEditorValue) {
  return value.attack + value.decay + value.release;
}

export function getEnvelopeEditorLevelPercent(level: number, options: EnvelopeEditorOptions = {}) {
  const { minLevel, maxLevel } = resolveEnvelopeEditorOptions(options);
  return getRangePercent(level, { min: minLevel, max: maxLevel });
}

export function getEnvelopeEditorLevelFromPercent(
  percent: number,
  options: EnvelopeEditorOptions & EnvelopeEditorValueOptions = {},
) {
  const { minLevel, maxLevel, stepLevel } = resolveEnvelopeEditorOptions(options);
  return getRangeValueFromPercent(percent, {
    min: minLevel,
    max: maxLevel,
    step: stepLevel,
    valueStep: options.valueStepLevel,
  });
}

export function getEnvelopeEditorTimeFromPercent(
  percent: number,
  timelineDuration: number,
  options: EnvelopeEditorOptions & EnvelopeEditorValueOptions = {},
) {
  const { stepTime } = resolveEnvelopeEditorOptions(options);
  const clampedPercent = Math.min(Math.max(percent, 0), 1);

  return normalizeRangeValue(clampedPercent * timelineDuration, {
    min: 0,
    max: timelineDuration,
    step: stepTime,
    valueStep: options.valueStepTime,
  });
}

export function envelopeEditorValuesEqual(first: EnvelopeEditorValue, second: EnvelopeEditorValue) {
  return (
    first.attack === second.attack &&
    first.decay === second.decay &&
    first.sustain === second.sustain &&
    first.release === second.release
  );
}
