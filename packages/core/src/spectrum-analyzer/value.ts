import {
  getSpectrumAnalyzerFrequencyFromPercent,
  getSpectrumAnalyzerFrequencyPercent,
  normalizeSpectrumAnalyzerFrequency,
} from "./frequency.ts";
import {
  getSpectrumAnalyzerMagnitudePercent,
  normalizeSpectrumAnalyzerMagnitude,
} from "./magnitude.ts";
import { resolveSpectrumAnalyzerOptions } from "./options.ts";
import type {
  ResolvedSpectrumAnalyzerOptions,
  SpectrumAnalyzerBin,
  SpectrumAnalyzerBinState,
  SpectrumAnalyzerOptions,
  SpectrumAnalyzerValue,
} from "./types.ts";

export function normalizeSpectrumAnalyzerValue(
  value: SpectrumAnalyzerValue | undefined,
  options: SpectrumAnalyzerOptions = {},
): SpectrumAnalyzerBin[] {
  const resolvedOptions = resolveSpectrumAnalyzerOptions(options);
  const bins = value ?? [];

  return bins.map((bin, index) => {
    const indexPercent = getIndexPercent(index, bins.length);
    const frequency =
      typeof bin === "number"
        ? getSpectrumAnalyzerFrequencyFromPercent(indexPercent, resolvedOptions)
        : normalizeSpectrumAnalyzerFrequency(bin.frequency, resolvedOptions);
    const magnitude =
      typeof bin === "number"
        ? normalizeSpectrumAnalyzerMagnitude(bin, resolvedOptions)
        : normalizeSpectrumAnalyzerMagnitude(bin.magnitude, resolvedOptions);

    return {
      frequency,
      magnitude,
      ...(typeof bin === "number" || bin.id === undefined ? undefined : { id: bin.id }),
      ...(typeof bin === "number" || bin.label === undefined ? undefined : { label: bin.label }),
    };
  });
}

export function getSpectrumAnalyzerBins(
  value: SpectrumAnalyzerValue | undefined,
  options: SpectrumAnalyzerOptions = {},
): SpectrumAnalyzerBinState[] {
  const resolvedOptions = resolveSpectrumAnalyzerOptions(options);
  const rawValue = value ?? [];
  const normalizedValue = normalizeSpectrumAnalyzerValue(rawValue, resolvedOptions);
  const bins = normalizedValue.map((bin, index) => {
    const rawBin = rawValue[index];
    const rawFrequency =
      typeof rawBin === "number"
        ? getSpectrumAnalyzerFrequencyFromPercent(getIndexPercent(index, rawValue.length), options)
        : (rawBin?.frequency ?? resolvedOptions.minFrequency);
    const rawMagnitude = typeof rawBin === "number" ? rawBin : (rawBin?.magnitude ?? 0);
    const frequencyPercent = getSpectrumAnalyzerFrequencyPercent(bin.frequency, resolvedOptions);
    const magnitudePercent = getSpectrumAnalyzerMagnitudePercent(bin.magnitude, resolvedOptions);

    return {
      ...bin,
      id: bin.id ?? String(index),
      index,
      rawFrequency,
      rawMagnitude,
      frequencyPercent,
      magnitudePercent,
      x: frequencyPercent,
      y: magnitudePercent,
      barStart: 0,
      barEnd: 0,
      barWidth: 0,
      clipped: rawMagnitude >= resolvedOptions.maxMagnitude,
      outOfRange:
        rawFrequency < resolvedOptions.minFrequency ||
        rawFrequency > resolvedOptions.maxFrequency ||
        rawMagnitude < resolvedOptions.minMagnitude ||
        rawMagnitude > resolvedOptions.maxMagnitude ||
        !Number.isFinite(rawFrequency) ||
        !Number.isFinite(rawMagnitude),
    } satisfies SpectrumAnalyzerBinState;
  });

  return withBarBounds(bins, resolvedOptions);
}

function withBarBounds(
  bins: SpectrumAnalyzerBinState[],
  options: ResolvedSpectrumAnalyzerOptions,
): SpectrumAnalyzerBinState[] {
  if (bins.length === 0) {
    return [];
  }

  if (bins.length === 1) {
    return [
      {
        ...bins[0],
        barStart: 0,
        barEnd: 1,
        barWidth: 1,
      },
    ];
  }

  const sortedBins = [...bins].sort((a, b) => a.x - b.x || a.index - b.index);
  const bounds = new Map<
    number,
    Pick<SpectrumAnalyzerBinState, "barStart" | "barEnd" | "barWidth">
  >();

  sortedBins.forEach((bin, index) => {
    const previous = sortedBins[index - 1];
    const next = sortedBins[index + 1];
    const previousMidpoint = previous === undefined ? undefined : (previous.x + bin.x) / 2;
    const nextMidpoint = next === undefined ? undefined : (bin.x + next.x) / 2;
    const left = previousMidpoint ?? Math.max(0, bin.x - Math.abs((nextMidpoint ?? bin.x) - bin.x));
    const right =
      nextMidpoint ?? Math.min(1, bin.x + Math.abs(bin.x - (previousMidpoint ?? bin.x)));
    const barStart = normalizePercent(left);
    const barEnd = normalizePercent(right);

    bounds.set(bin.index, {
      barStart,
      barEnd,
      barWidth: Math.max(0, barEnd - barStart),
    });
  });

  return bins.map((bin) => {
    const binBounds = bounds.get(bin.index) ?? {
      barStart: 0,
      barEnd: 0,
      barWidth: 0,
    };

    return {
      ...bin,
      ...binBounds,
      frequency: Math.min(Math.max(bin.frequency, options.minFrequency), options.maxFrequency),
    };
  });
}

function getIndexPercent(index: number, count: number) {
  return count <= 1 ? 0.5 : index / (count - 1);
}

function normalizePercent(percent: number) {
  return Number.isFinite(percent) ? Math.min(Math.max(percent, 0), 1) : 0;
}
