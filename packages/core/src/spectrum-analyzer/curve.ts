import type { SpectrumAnalyzerBinState } from "./types.ts";

export function getSpectrumAnalyzerPath(points: readonly SpectrumAnalyzerBinState[]) {
  return points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${roundPath(point.x)} ${roundPath(1 - point.y)}`,
    )
    .join(" ");
}

function roundPath(value: number) {
  return Number(value.toFixed(6));
}
