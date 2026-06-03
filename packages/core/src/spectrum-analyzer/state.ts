import { resolveSpectrumAnalyzerOptions } from "./options.ts";
import type {
  SpectrumAnalyzerOptions,
  SpectrumAnalyzerState,
  SpectrumAnalyzerValue,
} from "./types.ts";
import { getSpectrumAnalyzerBins, normalizeSpectrumAnalyzerValue } from "./value.ts";

export function createSpectrumAnalyzerState(
  value?: SpectrumAnalyzerValue,
  options: SpectrumAnalyzerOptions = {},
): SpectrumAnalyzerState {
  const resolvedOptions = resolveSpectrumAnalyzerOptions(options);
  const bins = getSpectrumAnalyzerBins(value, resolvedOptions);
  const peak = bins.reduce<SpectrumAnalyzerState["peak"]>((currentPeak, bin) => {
    if (currentPeak === null || bin.magnitude > currentPeak.magnitude) {
      return bin;
    }

    return currentPeak;
  }, null);

  return {
    ...resolvedOptions,
    value: normalizeSpectrumAnalyzerValue(value, resolvedOptions),
    bins,
    curve: [...bins].sort((a, b) => a.x - b.x),
    peak,
    binCount: bins.length,
    empty: bins.length === 0,
  };
}
