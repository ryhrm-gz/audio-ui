import { getFineStep, normalizeRangeValue } from "../shared/range.ts";
import { resolveEnvelopeEditorOptions } from "./options.ts";
import type { EnvelopeEditorOptions, EnvelopeEditorPointId, EnvelopeEditorValue } from "./types.ts";
import { normalizeEnvelopeEditorValue } from "./value.ts";

export interface EnvelopeEditorKeyboardOptions {
  fine?: boolean;
}

export function getNextEnvelopeEditorKeyboardValue(
  value: EnvelopeEditorValue,
  pointId: EnvelopeEditorPointId,
  key: string,
  options: EnvelopeEditorOptions = {},
  keyboard: EnvelopeEditorKeyboardOptions = {},
): EnvelopeEditorValue | undefined {
  const resolvedOptions = resolveEnvelopeEditorOptions(options);
  const timeStep = keyboard.fine ? getFineStep(resolvedOptions.stepTime) : resolvedOptions.stepTime;
  const levelStep = keyboard.fine
    ? getFineStep(resolvedOptions.stepLevel)
    : resolvedOptions.stepLevel;
  const largeTimeStep = timeStep * 10;
  const largeLevelStep = levelStep * 10;
  const normalizedValue = normalizeEnvelopeEditorValue(value, {
    ...resolvedOptions,
    valueStepTime: timeStep,
    valueStepLevel: levelStep,
  });

  switch (key) {
    case "ArrowRight":
      return updatePointTime(normalizedValue, pointId, timeStep, resolvedOptions, timeStep);
    case "ArrowLeft":
      return updatePointTime(normalizedValue, pointId, -timeStep, resolvedOptions, timeStep);
    case "ArrowUp":
      if (pointId !== "sustain") {
        return undefined;
      }

      return updateSustainLevel(normalizedValue, levelStep, resolvedOptions, levelStep);
    case "ArrowDown":
      if (pointId !== "sustain") {
        return undefined;
      }

      return updateSustainLevel(normalizedValue, -levelStep, resolvedOptions, levelStep);
    case "PageUp":
      return pointId === "sustain"
        ? updateSustainLevel(normalizedValue, largeLevelStep, resolvedOptions, levelStep)
        : updatePointTime(normalizedValue, pointId, largeTimeStep, resolvedOptions, timeStep);
    case "PageDown":
      return pointId === "sustain"
        ? updateSustainLevel(normalizedValue, -largeLevelStep, resolvedOptions, levelStep)
        : updatePointTime(normalizedValue, pointId, -largeTimeStep, resolvedOptions, timeStep);
    case "Home":
      return setPointPrimaryAxis(normalizedValue, pointId, "min", resolvedOptions, {
        timeStep,
        levelStep,
      });
    case "End":
      return setPointPrimaryAxis(normalizedValue, pointId, "max", resolvedOptions, {
        timeStep,
        levelStep,
      });
    default:
      return undefined;
  }
}

function updatePointTime(
  value: EnvelopeEditorValue,
  pointId: EnvelopeEditorPointId,
  delta: number,
  options: Required<EnvelopeEditorOptions>,
  valueStep: number,
) {
  switch (pointId) {
    case "attack":
      return {
        ...value,
        attack: normalizeTime(value.attack + delta, options, valueStep),
      };
    case "sustain":
      return {
        ...value,
        decay: normalizeTime(value.decay + delta, options, valueStep),
      };
    case "release":
      return {
        ...value,
        release: normalizeTime(value.release + delta, options, valueStep),
      };
  }
}

function updateSustainLevel(
  value: EnvelopeEditorValue,
  delta: number,
  options: Required<EnvelopeEditorOptions>,
  valueStep: number,
) {
  return {
    ...value,
    sustain: normalizeRangeValue(value.sustain + delta, {
      min: options.minLevel,
      max: options.maxLevel,
      step: options.stepLevel,
      valueStep,
    }),
  };
}

function setPointPrimaryAxis(
  value: EnvelopeEditorValue,
  pointId: EnvelopeEditorPointId,
  target: "min" | "max",
  options: Required<EnvelopeEditorOptions>,
  valueStep: { timeStep: number; levelStep: number },
) {
  switch (pointId) {
    case "attack":
      return {
        ...value,
        attack: normalizeTime(
          target === "min" ? options.minTime : options.maxTime,
          options,
          valueStep.timeStep,
        ),
      };
    case "sustain":
      return {
        ...value,
        sustain: normalizeRangeValue(target === "min" ? options.minLevel : options.maxLevel, {
          min: options.minLevel,
          max: options.maxLevel,
          step: options.stepLevel,
          valueStep: valueStep.levelStep,
        }),
      };
    case "release":
      return {
        ...value,
        release: normalizeTime(
          target === "min" ? options.minTime : options.maxTime,
          options,
          valueStep.timeStep,
        ),
      };
  }
}

function normalizeTime(value: number, options: Required<EnvelopeEditorOptions>, valueStep: number) {
  return normalizeRangeValue(value, {
    min: options.minTime,
    max: options.maxTime,
    step: options.stepTime,
    valueStep,
  });
}
