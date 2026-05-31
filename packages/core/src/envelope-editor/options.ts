import type { EnvelopeEditorOptions, ResolvedEnvelopeEditorOptions } from "./types.ts";

export const defaultEnvelopeEditorOptions = {
  minTime: 0,
  maxTime: 1,
  minLevel: 0,
  maxLevel: 1,
  stepTime: 0.01,
  stepLevel: 0.01,
  mode: "adsr",
  disabled: false,
  readOnly: false,
} satisfies ResolvedEnvelopeEditorOptions;

export function resolveEnvelopeEditorOptions(
  options: EnvelopeEditorOptions = {},
): ResolvedEnvelopeEditorOptions {
  const minTime = options.minTime ?? defaultEnvelopeEditorOptions.minTime;
  const maxTime = options.maxTime ?? defaultEnvelopeEditorOptions.maxTime;
  const minLevel = options.minLevel ?? defaultEnvelopeEditorOptions.minLevel;
  const maxLevel = options.maxLevel ?? defaultEnvelopeEditorOptions.maxLevel;
  const stepTime = options.stepTime ?? defaultEnvelopeEditorOptions.stepTime;
  const stepLevel = options.stepLevel ?? defaultEnvelopeEditorOptions.stepLevel;

  return {
    minTime: Math.min(minTime, maxTime),
    maxTime: Math.max(minTime, maxTime),
    minLevel: Math.min(minLevel, maxLevel),
    maxLevel: Math.max(minLevel, maxLevel),
    stepTime:
      Number.isFinite(stepTime) && stepTime > 0 ? stepTime : defaultEnvelopeEditorOptions.stepTime,
    stepLevel:
      Number.isFinite(stepLevel) && stepLevel > 0
        ? stepLevel
        : defaultEnvelopeEditorOptions.stepLevel,
    mode: "adsr",
    disabled: options.disabled ?? defaultEnvelopeEditorOptions.disabled,
    readOnly: options.readOnly ?? defaultEnvelopeEditorOptions.readOnly,
  };
}

export function getEnvelopeEditorTimelineDuration(options: EnvelopeEditorOptions = {}) {
  const resolvedOptions = resolveEnvelopeEditorOptions(options);
  const maxTime = Math.max(resolvedOptions.maxTime, resolvedOptions.minTime);
  return maxTime > 0 ? maxTime : defaultEnvelopeEditorOptions.maxTime;
}
