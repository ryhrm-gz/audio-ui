import { getEQCurveFrequencyFromPercent, getEQCurveFrequencyPercent } from "./frequency.ts";
import { getEQCurveGainPercent } from "./gain.ts";
import { resolveEQCurveOptions } from "./options.ts";
import type { EQCurveBand, EQCurveOptions, EQCurvePoint } from "./types.ts";

export function getEQCurvePoints(
  bands: EQCurveBand[],
  options: EQCurveOptions = {},
): EQCurvePoint[] {
  const resolvedOptions = resolveEQCurveOptions(options);
  const points: EQCurvePoint[] = [];

  for (let index = 0; index < resolvedOptions.curveResolution; index += 1) {
    const x =
      resolvedOptions.curveResolution === 1 ? 0 : index / (resolvedOptions.curveResolution - 1);
    const frequency = getEQCurveFrequencyFromPercent(x, {
      ...resolvedOptions,
      stepFrequency: 0.000001,
    });
    const gain = clampGain(
      bands.reduce((totalGain, band) => {
        if (band.enabled === false) {
          return totalGain;
        }

        return totalGain + getBandGainAtFrequency(band, frequency, resolvedOptions);
      }, 0),
      resolvedOptions,
    );

    points.push({
      frequency,
      gain,
      x: getEQCurveFrequencyPercent(frequency, resolvedOptions),
      y: getEQCurveGainPercent(gain, resolvedOptions),
    });
  }

  return points;
}

export function getEQCurvePath(points: EQCurvePoint[]) {
  return points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${roundPath(point.x)} ${roundPath(1 - point.y)}`,
    )
    .join(" ");
}

export function getBandGainAtFrequency(
  band: EQCurveBand,
  frequency: number,
  options: EQCurveOptions = {},
) {
  const resolvedOptions = resolveEQCurveOptions(options);
  const octaveDistance = Math.log2(frequency / band.frequency);
  const q = Math.max(band.q, resolvedOptions.minQ);

  switch (band.type) {
    case "bell":
      return band.gain * Math.exp(-0.5 * (octaveDistance * q * 1.5) ** 2);
    case "low-shelf":
      return band.gain / (1 + Math.exp(octaveDistance * Math.max(1, q)));
    case "high-shelf":
      return band.gain / (1 + Math.exp(-octaveDistance * Math.max(1, q)));
    case "low-pass":
      return getPassFilterGain(octaveDistance, q, resolvedOptions.maxGain);
    case "high-pass":
      return getPassFilterGain(-octaveDistance, q, resolvedOptions.maxGain);
  }
}

function getPassFilterGain(octaveDistance: number, q: number, maxGain: number) {
  const rolloff = 1 / (1 + Math.exp(-octaveDistance * Math.max(2, q)));
  const resonance = Math.max(0, q - 0.7) * 0.25 * Math.exp(-0.5 * (octaveDistance * 4) ** 2);
  return -maxGain * rolloff + Math.min(6, resonance);
}

function clampGain(gain: number, options: Required<EQCurveOptions>) {
  return Math.min(Math.max(gain, options.minGain), options.maxGain);
}

function roundPath(value: number) {
  return Number(value.toFixed(6));
}
