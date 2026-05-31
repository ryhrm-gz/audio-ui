import { getEnvelopeEditorTimelineDuration } from "./options.ts";
import { resolveEnvelopeEditorOptions } from "./options.ts";
import type {
  EnvelopeEditorOptions,
  EnvelopeEditorPoint,
  EnvelopeEditorPointId,
  EnvelopeEditorPointRect,
  EnvelopeEditorPosition,
  EnvelopeEditorSegment,
  EnvelopeEditorValue,
  EnvelopeEditorValueOptions,
} from "./types.ts";
import {
  getEnvelopeEditorLevelFromPercent,
  getEnvelopeEditorLevelPercent,
  getEnvelopeEditorTimeFromPercent,
  getEnvelopeEditorTotalDuration,
  normalizeEnvelopeEditorValue,
} from "./value.ts";

export function getEnvelopeEditorPoints(
  value: EnvelopeEditorValue,
  options: EnvelopeEditorOptions = {},
): EnvelopeEditorPoint[] {
  const normalizedValue = normalizeEnvelopeEditorValue(value, options);
  const timelineDuration = getEnvelopeEditorTimelineDuration(options);
  const attackTime = normalizedValue.attack;
  const sustainTime = normalizedValue.attack + normalizedValue.decay;
  const releaseTime = getEnvelopeEditorTotalDuration(normalizedValue);

  return [
    {
      id: "attack",
      phase: "attack",
      time: attackTime,
      level: getMaxLevel(options),
      x: getTimePosition(attackTime, timelineDuration),
      y: 1,
      editableTime: true,
      editableLevel: false,
    },
    {
      id: "sustain",
      phase: "sustain",
      time: sustainTime,
      level: normalizedValue.sustain,
      x: getTimePosition(sustainTime, timelineDuration),
      y: getEnvelopeEditorLevelPercent(normalizedValue.sustain, options),
      editableTime: true,
      editableLevel: true,
    },
    {
      id: "release",
      phase: "release",
      time: releaseTime,
      level: getMinLevel(options),
      x: getTimePosition(releaseTime, timelineDuration),
      y: 0,
      editableTime: true,
      editableLevel: false,
    },
  ];
}

export function getEnvelopeEditorSegments(
  value: EnvelopeEditorValue,
  options: EnvelopeEditorOptions = {},
): EnvelopeEditorSegment[] {
  const points = getEnvelopeEditorPoints(value, options);
  const start = {
    x: 0,
    y: 0,
  };
  const attack = getEnvelopeEditorPoint(points, "attack");
  const sustain = getEnvelopeEditorPoint(points, "sustain");
  const release = getEnvelopeEditorPoint(points, "release");
  const minLevel = getMinLevel(options);
  const maxLevel = getMaxLevel(options);

  return [
    {
      phase: "attack",
      start,
      end: attack,
      startTime: 0,
      endTime: attack.time,
      startLevel: minLevel,
      endLevel: maxLevel,
    },
    {
      phase: "decay",
      start: attack,
      end: sustain,
      startTime: attack.time,
      endTime: sustain.time,
      startLevel: maxLevel,
      endLevel: sustain.level,
    },
    {
      phase: "sustain",
      start: sustain,
      end: sustain,
      startTime: sustain.time,
      endTime: sustain.time,
      startLevel: sustain.level,
      endLevel: sustain.level,
    },
    {
      phase: "release",
      start: sustain,
      end: release,
      startTime: sustain.time,
      endTime: release.time,
      startLevel: sustain.level,
      endLevel: minLevel,
    },
  ];
}

export function getEnvelopeEditorPositionFromPointRect(
  point: EnvelopeEditorPointRect,
): EnvelopeEditorPosition {
  const width = getValidSize(point.graphWidth);
  const height = getValidSize(point.graphHeight);

  return {
    x: clampPercent((point.pointX - point.graphX) / width),
    y: clampPercent(1 - (point.pointY - point.graphY) / height),
  };
}

export function getEnvelopeEditorValueFromPointPosition(
  pointId: EnvelopeEditorPointId,
  position: EnvelopeEditorPosition,
  value: EnvelopeEditorValue,
  options: EnvelopeEditorOptions & EnvelopeEditorValueOptions = {},
) {
  const normalizedValue = normalizeEnvelopeEditorValue(value, options);
  const timelineDuration = getEnvelopeEditorTimelineDuration(options);
  const time = getEnvelopeEditorTimeFromPercent(position.x, timelineDuration, options);
  const level = getEnvelopeEditorLevelFromPercent(position.y, options);

  switch (pointId) {
    case "attack":
      return normalizeEnvelopeEditorValue(
        {
          ...normalizedValue,
          attack: time,
        },
        options,
      );
    case "sustain":
      return normalizeEnvelopeEditorValue(
        {
          ...normalizedValue,
          decay: time - normalizedValue.attack,
          sustain: level,
        },
        options,
      );
    case "release":
      return normalizeEnvelopeEditorValue(
        {
          ...normalizedValue,
          release: time - normalizedValue.attack - normalizedValue.decay,
        },
        options,
      );
    default:
      return normalizedValue;
  }
}

export function getEnvelopeEditorValueFromPointRect(
  pointId: EnvelopeEditorPointId,
  point: EnvelopeEditorPointRect,
  value: EnvelopeEditorValue,
  options: EnvelopeEditorOptions & EnvelopeEditorValueOptions = {},
) {
  return getEnvelopeEditorValueFromPointPosition(
    pointId,
    getEnvelopeEditorPositionFromPointRect(point),
    value,
    options,
  );
}

function getEnvelopeEditorPoint(points: EnvelopeEditorPoint[], pointId: EnvelopeEditorPointId) {
  return points.find((point) => point.id === pointId) as EnvelopeEditorPoint;
}

function getTimePosition(time: number, timelineDuration: number) {
  if (timelineDuration <= 0) {
    return 0;
  }

  return clampPercent(time / timelineDuration);
}

function getMinLevel(options: EnvelopeEditorOptions) {
  return resolveEnvelopeEditorOptions(options).minLevel;
}

function getMaxLevel(options: EnvelopeEditorOptions) {
  return resolveEnvelopeEditorOptions(options).maxLevel;
}

function clampPercent(percent: number) {
  return Math.min(Math.max(percent, 0), 1);
}

function getValidSize(size: number) {
  return Number.isFinite(size) && size > 0 ? size : 1;
}
