import { updateEQCurveBand } from "./bands.ts";
import { resolveEQCurveOptions } from "./options.ts";
import type { EQCurveOptions, EQCurveValue } from "./types.ts";

export interface EQCurveKeyboardOptions {
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

  const frequencyStep = resolvedOptions.stepFrequency;
  const gainStep = resolvedOptions.stepGain;
  const qStep = resolvedOptions.stepQ;

  if (keyboard.q) {
    switch (key) {
      case "ArrowUp":
      case "ArrowRight":
        return updateEQCurveBand(value, bandId, { q: band.q + qStep }, resolvedOptions);
      case "ArrowDown":
      case "ArrowLeft":
        return updateEQCurveBand(value, bandId, { q: band.q - qStep }, resolvedOptions);
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
        resolvedOptions,
      );
    case "ArrowLeft":
      return updateEQCurveBand(
        value,
        bandId,
        { frequency: band.frequency - frequencyStep },
        resolvedOptions,
      );
    case "ArrowUp":
      return updateEQCurveBand(value, bandId, { gain: band.gain + gainStep }, resolvedOptions);
    case "ArrowDown":
      return updateEQCurveBand(value, bandId, { gain: band.gain - gainStep }, resolvedOptions);
    case "PageUp":
      return updateEQCurveBand(value, bandId, { q: band.q + qStep * 10 }, resolvedOptions);
    case "PageDown":
      return updateEQCurveBand(value, bandId, { q: band.q - qStep * 10 }, resolvedOptions);
    case "Home":
      return updateEQCurveBand(
        value,
        bandId,
        { frequency: resolvedOptions.minFrequency },
        resolvedOptions,
      );
    case "End":
      return updateEQCurveBand(
        value,
        bandId,
        { frequency: resolvedOptions.maxFrequency },
        resolvedOptions,
      );
    default:
      return undefined;
  }
}
