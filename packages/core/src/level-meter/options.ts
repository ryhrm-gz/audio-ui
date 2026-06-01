import type { LevelMeterOptions, LevelMeterScalePoint, LevelMeterSegment } from "./types.ts";

export const defaultLevelMeterScale = [
  { value: -60, percent: 0, label: "-60" },
  { value: -36, percent: 0.36, label: "-36" },
  { value: -24, percent: 0.55, label: "-24" },
  { value: -12, percent: 0.73, label: "-12" },
  { value: -6, percent: 0.82, label: "-6" },
  { value: 0, percent: 0.91, label: "0" },
  { value: 6, percent: 1, label: "+6" },
] satisfies LevelMeterScalePoint[];

export const defaultLevelMeterSegments = [
  { id: "nominal", from: -60, to: -12, label: "Nominal" },
  { id: "warning", from: -12, to: 0, label: "Warning" },
  { id: "clip", from: 0, to: 6, label: "Clip" },
] satisfies LevelMeterSegment[];

export const defaultLevelMeterOptions = {
  min: -60,
  max: 6,
  clip: 0,
  channels: 1,
  orientation: "vertical",
  scale: defaultLevelMeterScale,
  segments: defaultLevelMeterSegments,
} satisfies Required<LevelMeterOptions>;

export function resolveLevelMeterOptions(options: LevelMeterOptions = {}) {
  const [min, max] = resolveRange(options.min, options.max);
  const clip = clamp(resolveFinite(options.clip, defaultLevelMeterOptions.clip), min, max);
  const channels = resolveChannels(options.channels);
  const orientation = resolveOrientation(options.orientation);
  const scale = resolveLevelMeterScale(options.scale, { min, max });
  const segments = resolveLevelMeterSegments(options.segments, { min, max });

  return {
    min,
    max,
    clip,
    channels,
    orientation,
    scale,
    segments,
  };
}

export function resolveLevelMeterScale(
  scale: readonly LevelMeterScalePoint[] | undefined,
  options: Pick<Required<LevelMeterOptions>, "min" | "max">,
) {
  const source = scale?.length ? scale : defaultLevelMeterScale;
  const resolvedScale = source
    .map((point) => ({
      value: clamp(resolveFinite(point.value, options.min), options.min, options.max),
      percent: clamp(resolveFinite(point.percent, getLinearPercent(point.value, options)), 0, 1),
      label: point.label ?? formatLevelMeterScaleLabel(point.value),
    }))
    .sort((a, b) => a.percent - b.percent);

  if (resolvedScale.length > 0) {
    return resolvedScale;
  }

  return [
    { value: options.min, percent: 0, label: formatLevelMeterScaleLabel(options.min) },
    { value: options.max, percent: 1, label: formatLevelMeterScaleLabel(options.max) },
  ];
}

export function resolveLevelMeterSegments(
  segments: readonly LevelMeterSegment[] | undefined,
  options: Pick<Required<LevelMeterOptions>, "min" | "max">,
) {
  const source = segments?.length ? segments : defaultLevelMeterSegments;

  return source
    .map((segment, index) => {
      const from = clamp(resolveFinite(segment.from, options.min), options.min, options.max);
      const to = clamp(resolveFinite(segment.to, options.max), options.min, options.max);
      const start = Math.min(from, to);
      const end = Math.max(from, to);
      const startPercent = getLinearPercent(start, options);
      const endPercent = getLinearPercent(end, options);

      return {
        id: segment.id ?? `${index}`,
        label: segment.label ?? segment.id ?? `${start}..${end}`,
        from: start,
        to: end,
        startPercent,
        endPercent,
        sizePercent: endPercent - startPercent,
      };
    })
    .filter((segment) => segment.sizePercent > 0)
    .sort((a, b) => a.startPercent - b.startPercent);
}

function resolveRange(min: number | undefined, max: number | undefined): [number, number] {
  const nextMin = resolveFinite(min, defaultLevelMeterOptions.min);
  const nextMax = resolveFinite(max, defaultLevelMeterOptions.max);

  return nextMin <= nextMax ? [nextMin, nextMax] : [nextMax, nextMin];
}

function resolveChannels(channels: number | undefined): number {
  if (typeof channels !== "number" || !Number.isFinite(channels)) {
    return defaultLevelMeterOptions.channels;
  }

  return Math.max(1, Math.round(channels));
}

function resolveOrientation(orientation: LevelMeterOptions["orientation"]) {
  return orientation === "horizontal" ? orientation : defaultLevelMeterOptions.orientation;
}

function resolveFinite(value: number | undefined, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getLinearPercent(
  value: number,
  options: Pick<Required<LevelMeterOptions>, "min" | "max">,
) {
  if (options.max === options.min) {
    return 0;
  }

  return (value - options.min) / (options.max - options.min);
}

function formatLevelMeterScaleLabel(value: number) {
  if (value > 0) {
    return `+${value}`;
  }

  return `${value}`;
}
