import { describe, expect, test } from "vite-plus/test";
import {
  createStepSequencerState,
  normalizeStepSequencerPlayhead,
  normalizeStepSequencerValue,
  resolveStepSequencerKeyboardTarget,
  setStepSequencerStepActive,
  toggleStepSequencerStep,
} from "./index.ts";

describe("StepSequencer", () => {
  test("normalizes a boolean grid to the configured dimensions", () => {
    expect(
      normalizeStepSequencerValue([[true, false, true], [true]], {
        trackCount: 3,
        stepCount: 4,
      }),
    ).toEqual([
      [true, false, true, false],
      [true, false, false, false],
      [false, false, false, false],
    ]);
  });

  test("creates tracks, flat steps, playhead state, and CSS positions", () => {
    const state = createStepSequencerState(
      [
        [true, false, true, false],
        [false, true, false, false],
      ],
      {
        disabledSteps: [[false, true]],
        playhead: 2,
        loopStart: 1,
        loopEnd: 3,
      },
    );

    expect(state).toMatchObject({
      trackCount: 2,
      stepCount: 4,
      playhead: 2,
      playheadPercent: 2 / 3,
      loopStart: 1,
      loopEnd: 3,
      orientation: "horizontal",
    });
    expect(state.tracks).toHaveLength(2);
    expect(state.steps).toHaveLength(8);
    expect(state.activeSteps.map((step) => [step.trackIndex, step.stepIndex])).toEqual([
      [0, 0],
      [0, 2],
      [1, 1],
    ]);
    expect(state.currentSteps.map((step) => step.stepIndex)).toEqual([2, 2]);
    expect(state.tracks[0]?.steps[1]).toMatchObject({
      disabled: true,
      current: false,
      inLoop: true,
      stepPercent: 1 / 3,
      trackPercent: 0,
    });
    expect(state.tracks[1]?.trackPercent).toBe(1);
  });

  test("sets and toggles steps without mutating the input value", () => {
    const value = [[true, false]];
    const active = setStepSequencerStepActive(value, 0, 1, true);
    const toggled = toggleStepSequencerStep(active, 0, 0);

    expect(value).toEqual([[true, false]]);
    expect(active).toEqual([[true, true]]);
    expect(toggled).toEqual([[false, true]]);
  });

  test("clamps playhead and resolves keyboard navigation targets", () => {
    const state = createStepSequencerState([], { trackCount: 2, stepCount: 4 });

    expect(normalizeStepSequencerPlayhead(99, 4)).toBe(3);
    expect(normalizeStepSequencerPlayhead(Number.NaN, 4)).toBeUndefined();
    expect(
      resolveStepSequencerKeyboardTarget({ trackIndex: 1, stepIndex: 2 }, "ArrowLeft", state),
    ).toEqual({
      trackIndex: 1,
      stepIndex: 1,
    });
    expect(
      resolveStepSequencerKeyboardTarget({ trackIndex: 1, stepIndex: 2 }, "ArrowDown", state),
    ).toEqual({
      trackIndex: 1,
      stepIndex: 2,
    });
    expect(
      resolveStepSequencerKeyboardTarget({ trackIndex: 1, stepIndex: 2 }, "Home", state),
    ).toEqual({
      trackIndex: 1,
      stepIndex: 0,
    });
    expect(
      resolveStepSequencerKeyboardTarget({ trackIndex: 1, stepIndex: 2 }, "Escape", state),
    ).toBeUndefined();
  });
});
