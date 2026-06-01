import { getFineStep } from "../shared/range.ts";
import { updateEQCurveBand } from "./bands.ts";
import { resolveEQCurveOptions } from "./options.ts";
import type { EQCurveOptions, EQCurveValue } from "./types.ts";

export interface EQCurveKeyboardOptions {
  fine?: boolean;
  q?: boolean;
}

export function getNextEQCurveKeyboardValue(
  value: EQCurveValue,
  bandId: string,
  key: string,
  options: EQCurveOptions = {},
  keyboard: EQCurveKeyboardOptions = {},
): EQCurveValue | undefined {
  const resolvedOptions = resolveEQCurveOptions(options);
  const band = value.find((nextBand) => nextBand.id === bandId);

  if (band === undefined) {
    return undefined;
  }

  const frequencyStep = keyboard.fine
    ? getFineStep(resolvedOptions.stepFrequency)
    : resolvedOptions.stepFrequency;
  const gainStep = keyboard.fine ? getFineStep(resolvedOptions.stepGain) : resolvedOptions.stepGain;
  const qStep = keyboard.fine ? getFineStep(resolvedOptions.stepQ) : resolvedOptions.stepQ;
  const valueSteps = {
    valueStepFrequency: frequencyStep,
    valueStepGain: gainStep,
    valueStepQ: qStep,
  };

  if (keyboard.q) {
    switch (key) {
      case "ArrowUp":
      case "ArrowRight":
        return updateEQCurveBand(
          value,
          bandId,
          { q: band.q + qStep },
          { ...resolvedOptions, ...valueSteps },
        );
      case "ArrowDown":
      case "ArrowLeft":
        return updateEQCurveBand(
          value,
          bandId,
          { q: band.q - qStep },
          { ...resolvedOptions, ...valueSteps },
        );
      default:
        return undefined;
    }
  }

  switch (key) {
    case "ArrowRight":
      return updateEQCurveBand(
        value,
        bandId,
        { frequency: band.frequency + frequencyStep },
        { ...resolvedOptions, ...valueSteps },
      );
    case "ArrowLeft":
      return updateEQCurveBand(
        value,
        bandId,
        { frequency: band.frequency - frequencyStep },
        { ...resolvedOptions, ...valueSteps },
      );
    case "ArrowUp":
      return updateEQCurveBand(
        value,
        bandId,
        { gain: band.gain + gainStep },
        { ...resolvedOptions, ...valueSteps },
      );
    case "ArrowDown":
      return updateEQCurveBand(
        value,
        bandId,
        { gain: band.gain - gainStep },
        { ...resolvedOptions, ...valueSteps },
      );
    case "PageUp":
      return updateEQCurveBand(
        value,
        bandId,
        { q: band.q + qStep * 10 },
        { ...resolvedOptions, ...valueSteps },
      );
    case "PageDown":
      return updateEQCurveBand(
        value,
        bandId,
        { q: band.q - qStep * 10 },
        { ...resolvedOptions, ...valueSteps },
      );
    case "Home":
      return updateEQCurveBand(
        value,
        bandId,
        { frequency: resolvedOptions.minFrequency },
        { ...resolvedOptions, ...valueSteps },
      );
    case "End":
      return updateEQCurveBand(
        value,
        bandId,
        { frequency: resolvedOptions.maxFrequency },
        { ...resolvedOptions, ...valueSteps },
      );
    default:
      return undefined;
  }
}
