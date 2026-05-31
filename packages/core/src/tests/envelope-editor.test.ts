import { expect, test } from "vite-plus/test";
import {
  createEnvelopeEditorState,
  getEnvelopeEditorPoints,
  getEnvelopeEditorSegments,
  getEnvelopeEditorValueFromPointPosition,
  getNextEnvelopeEditorKeyboardValue,
  normalizeEnvelopeEditorValue,
} from "../index.ts";

test("normalizes ADSR values to configured time and level ranges", () => {
  expect(
    normalizeEnvelopeEditorValue(
      { attack: 0.026, decay: 0.183, sustain: 1.2, release: -1 },
      { minTime: 0, maxTime: 2, stepTime: 0.01, minLevel: 0, maxLevel: 1, stepLevel: 0.05 },
    ),
  ).toEqual({ attack: 0.03, decay: 0.18, sustain: 1, release: 0 });
});

test("converts ADSR values into editable points", () => {
  expect(
    getEnvelopeEditorPoints(
      { attack: 0.5, decay: 0.25, sustain: 0.4, release: 0.75 },
      { maxTime: 2, stepTime: 0.01 },
    ),
  ).toEqual([
    {
      id: "attack",
      phase: "attack",
      time: 0.5,
      level: 1,
      x: 0.25,
      y: 1,
      editableTime: true,
      editableLevel: false,
    },
    {
      id: "sustain",
      phase: "sustain",
      time: 0.75,
      level: 0.4,
      x: 0.375,
      y: 0.4,
      editableTime: true,
      editableLevel: true,
    },
    {
      id: "release",
      phase: "release",
      time: 1.5,
      level: 0,
      x: 0.75,
      y: 0,
      editableTime: true,
      editableLevel: false,
    },
  ]);
});

test("creates ADSR segments from the editable points", () => {
  const segments = getEnvelopeEditorSegments({
    attack: 0.5,
    decay: 0.25,
    sustain: 0.4,
    release: 0.75,
  });

  expect(segments.map((segment) => segment.phase)).toEqual([
    "attack",
    "decay",
    "sustain",
    "release",
  ]);
  expect(segments[0]?.start).toEqual({ x: 0, y: 0 });
  expect(segments[1]?.start).toEqual(segments[0]?.end);
  expect(segments[3]?.start).toEqual(segments[1]?.end);
});

test("converts dragged point positions back to ADSR values", () => {
  expect(
    getEnvelopeEditorValueFromPointPosition(
      "sustain",
      { x: 0.5, y: 0.25 },
      { attack: 0.2, decay: 0.2, sustain: 0.5, release: 0.2 },
      { maxTime: 1, stepTime: 0.01, stepLevel: 0.01 },
    ),
  ).toEqual({ attack: 0.2, decay: 0.3, sustain: 0.25, release: 0.2 });

  expect(
    getEnvelopeEditorValueFromPointPosition(
      "release",
      { x: 0.4, y: 0.9 },
      { attack: 0.2, decay: 0.4, sustain: 0.5, release: 0.2 },
      { maxTime: 2, stepTime: 0.01 },
    ),
  ).toEqual({ attack: 0.2, decay: 0.4, sustain: 0.5, release: 0.2 });
});

test("handles point keyboard movement", () => {
  expect(
    getNextEnvelopeEditorKeyboardValue(
      { attack: 0.1, decay: 0.2, sustain: 0.5, release: 0.3 },
      "attack",
      "ArrowRight",
      { stepTime: 0.05 },
    ),
  ).toEqual({ attack: 0.15, decay: 0.2, sustain: 0.5, release: 0.3 });
  expect(
    getNextEnvelopeEditorKeyboardValue(
      { attack: 0.1, decay: 0.2, sustain: 0.5, release: 0.3 },
      "sustain",
      "ArrowUp",
      { stepLevel: 0.1 },
    ),
  ).toEqual({ attack: 0.1, decay: 0.2, sustain: 0.6, release: 0.3 });
  expect(
    getNextEnvelopeEditorKeyboardValue(
      { attack: 0.1, decay: 0.2, sustain: 0.5, release: 0.3 },
      "release",
      "Home",
      { minTime: 0.05, maxTime: 2 },
    ),
  ).toEqual({ attack: 0.1, decay: 0.2, sustain: 0.5, release: 0.05 });
  expect(
    getNextEnvelopeEditorKeyboardValue(
      { attack: 0.1, decay: 0.2, sustain: 0.5, release: 0.3 },
      "attack",
      "Escape",
    ),
  ).toBeUndefined();
});

test("creates a complete serializable EnvelopeEditor state object", () => {
  expect(
    createEnvelopeEditorState(
      { attack: 0.2, decay: 0.3, sustain: 0.6, release: 0.5 },
      { maxTime: 2 },
    ),
  ).toMatchObject({
    value: { attack: 0.2, decay: 0.3, sustain: 0.6, release: 0.5 },
    minTime: 0,
    maxTime: 2,
    minLevel: 0,
    maxLevel: 1,
    stepTime: 0.01,
    stepLevel: 0.01,
    mode: "adsr",
    disabled: false,
    readOnly: false,
    totalDuration: 1,
    timelineDuration: 2,
    activePoint: null,
  });
});
