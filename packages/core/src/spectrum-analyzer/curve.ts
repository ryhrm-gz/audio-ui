import type { SpectrumAnalyzerBinState } from "./types.ts";

export function getSpectrumAnalyzerPath(points: readonly SpectrumAnalyzerBinState[]) {
  return points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${roundPath(point.x)} ${roundPath(1 - point.y)}`,
    )
    .join(" ");
}

export function getSpectrumAnalyzerBarsPath(bins: readonly SpectrumAnalyzerBinState[]) {
  return bins
    .map((bin) => {
      const left = roundPath(bin.barStart);
      const right = roundPath(bin.barEnd);
      const top = roundPath(1 - bin.y);

      return `M ${left} 1 L ${left} ${top} L ${right} ${top} L ${right} 1 Z`;
    })
    .join(" ");
}

function roundPath(value: number) {
  return Number(value.toFixed(6));
}
