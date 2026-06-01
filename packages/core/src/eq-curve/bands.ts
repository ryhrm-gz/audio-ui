import { normalizeRangeValue } from "../shared/range.ts";
import { getEQCurveFrequencyFromPercent, getEQCurveFrequencyPercent } from "./frequency.ts";
import { getEQCurveGainFromPercent, getEQCurveGainPercent, normalizeEQCurveGain } from "./gain.ts";
import { resolveEQCurveOptions } from "./options.ts";
import type {
  EQCurveBand,
  EQCurveBandRect,
  EQCurveBandState,
  EQCurveOptions,
  EQCurvePosition,
  EQCurveValue,
  EQCurveValueOptions,
} from "./types.ts";

export function normalizeEQCurveBand(
  band: EQCurveBand,
  options: EQCurveOptions & EQCurveValueOptions = {},
): EQCurveBand {
  const { minQ, maxQ, stepQ } = resolveEQCurveOptions(options);

  return {
    ...band,
    frequency: getEQCurveFrequencyFromPercent(getEQCurveFrequencyPercent(band.frequency, options), {
      ...options,
      valueStepFrequency: options.valueStepFrequency,
    }),
    gain: normalizeEQCurveGain(band.gain, options),
    q: normalizeRangeValue(band.q, {
      min: minQ,
      max: maxQ,
      step: stepQ,
      valueStep: options.valueStepQ,
    }),
    enabled: band.enabled ?? true,
  };
}

export function normalizeEQCurveValue(
  value: EQCurveValue,
  options: EQCurveOptions & EQCurveValueOptions = {},
): EQCurveValue {
  return value.map((band) => normalizeEQCurveBand(band, options));
}

export function getEQCurveBandStates(
  value: EQCurveValue,
  options: EQCurveOptions & EQCurveValueOptions = {},
): EQCurveBandState[] {
  return normalizeEQCurveValue(value, options).map((band) => ({
    ...band,
    enabled: band.enabled ?? true,
    x: getEQCurveFrequencyPercent(band.frequency, options),
    y: getEQCurveGainPercent(band.gain, options),
  }));
}

export function getEQCurveBandPositionFromRect(point: EQCurveBandRect): EQCurvePosition {
  const width = getValidSize(point.graphWidth);
  const height = getValidSize(point.graphHeight);

  return {
    x: clampPercent((point.pointX - point.graphX) / width),
    y: clampPercent(1 - (point.pointY - point.graphY) / height),
  };
}

export function getEQCurveValueFromBandPosition(
  value: EQCurveValue,
  bandId: string,
  position: EQCurvePosition,
  options: EQCurveOptions & EQCurveValueOptions = {},
): EQCurveValue {
  return value.map((band) => {
    if (band.id !== bandId) {
      return normalizeEQCurveBand(band, options);
    }

    return normalizeEQCurveBand(
      {
        ...band,
        frequency: getEQCurveFrequencyFromPercent(position.x, options),
        gain: getEQCurveGainFromPercent(position.y, options),
      },
      options,
    );
  });
}

export function getEQCurveValueFromBandRect(
  value: EQCurveValue,
  bandId: string,
  point: EQCurveBandRect,
  options: EQCurveOptions & EQCurveValueOptions = {},
) {
  return getEQCurveValueFromBandPosition(
    value,
    bandId,
    getEQCurveBandPositionFromRect(point),
    options,
  );
}

export function updateEQCurveBand(
  value: EQCurveValue,
  bandId: string,
  patch: Partial<Omit<EQCurveBand, "id">>,
  options: EQCurveOptions & EQCurveValueOptions = {},
) {
  return value.map((band) =>
    band.id === bandId ? normalizeEQCurveBand({ ...band, ...patch }, options) : band,
  );
}

export function eqCurveValuesEqual(first: EQCurveValue, second: EQCurveValue) {
  if (first.length !== second.length) {
    return false;
  }

  return first.every((band, index) => {
    const other = second[index];

    return (
      other !== undefined &&
      band.id === other.id &&
      band.type === other.type &&
      band.frequency === other.frequency &&
      band.gain === other.gain &&
      band.q === other.q &&
      (band.enabled ?? true) === (other.enabled ?? true)
    );
  });
}

function clampPercent(percent: number) {
  return Math.min(Math.max(percent, 0), 1);
}

function getValidSize(size: number) {
  return Number.isFinite(size) && size > 0 ? size : 1;
}
