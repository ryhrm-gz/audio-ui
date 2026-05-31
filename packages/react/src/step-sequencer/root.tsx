import {
  areStepSequencerValuesEqual,
  createStepSequencerState,
  setStepSequencerStepActive,
  toggleStepSequencerStep,
  type StepSequencerState,
  type StepSequencerValue,
} from "@ryhrm-gz/audio-ui-core";
import { forwardRef, useCallback, useMemo, useState, type CSSProperties } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { StepSequencerContext, type StepSequencerContextValue } from "./context.tsx";
import type { StepSequencerRootProps } from "./types.ts";

export const Root = forwardRef<HTMLDivElement, StepSequencerRootProps>(function Root(props, ref) {
  const {
    value,
    defaultValue,
    trackCount,
    stepCount,
    disabledSteps,
    playhead,
    loopStart,
    loopEnd,
    orientation,
    disabled = false,
    readOnly = false,
    name,
    required,
    children,
    onValueChange,
    render,
    style,
    ...elementProps
  } = props;
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? []);
  const rawValue = isControlled ? value : internalValue;
  const state = useMemo(
    () =>
      createStepSequencerState(rawValue, {
        trackCount,
        stepCount,
        disabledSteps,
        playhead,
        loopStart,
        loopEnd,
        orientation,
      }),
    [disabledSteps, loopEnd, loopStart, orientation, playhead, rawValue, stepCount, trackCount],
  );

  const getStateForValue = useCallback(
    (nextValue: StepSequencerValue): StepSequencerState =>
      createStepSequencerState(nextValue, {
        trackCount,
        stepCount,
        disabledSteps,
        playhead,
        loopStart,
        loopEnd,
        orientation,
      }),
    [disabledSteps, loopEnd, loopStart, orientation, playhead, stepCount, trackCount],
  );

  const setValue = useCallback(
    (nextValue: StepSequencerValue) => {
      const nextState = getStateForValue(nextValue);

      if (!isControlled) {
        setInternalValue(nextState.value);
      }

      if (!areStepSequencerValuesEqual(state.value, nextState.value)) {
        onValueChange?.(nextState.value);
      }
    },
    [getStateForValue, isControlled, onValueChange, state.value],
  );

  const setStepActive = useCallback(
    (trackIndex: number, stepIndex: number, active: boolean) => {
      setValue(
        setStepSequencerStepActive(state.value, trackIndex, stepIndex, active, {
          trackCount: state.trackCount,
          stepCount: state.stepCount,
        }),
      );
    },
    [setValue, state.stepCount, state.trackCount, state.value],
  );

  const toggleStep = useCallback(
    (trackIndex: number, stepIndex: number) => {
      setValue(
        toggleStepSequencerStep(state.value, trackIndex, stepIndex, {
          trackCount: state.trackCount,
          stepCount: state.stepCount,
        }),
      );
    },
    [setValue, state.stepCount, state.trackCount, state.value],
  );

  const getStep = useCallback(
    (trackIndex: number, stepIndex: number) => state.tracks[trackIndex]?.steps[stepIndex],
    [state.tracks],
  );

  const contextValue = useMemo<StepSequencerContextValue>(
    () => ({
      state,
      disabled,
      readOnly,
      name,
      required,
      getStep,
      setStepActive,
      toggleStep,
      setValue,
    }),
    [disabled, getStep, name, readOnly, required, setStepActive, setValue, state, toggleStep],
  );
  const renderState = getRenderState(state, { disabled, readOnly, dragging: false });
  const content = typeof children === "function" ? children(renderState) : children;
  const rootProps = mergeProps(elementProps, {
    ref,
    role: "group",
    "data-audio-ui": "step-sequencer",
    "data-part": "root",
    "data-orientation": state.orientation,
    "data-disabled": disabled ? "" : undefined,
    "data-readonly": readOnly ? "" : undefined,
    "data-playhead": state.playhead === undefined ? undefined : state.playhead,
    style: {
      ...style,
      "--step-sequencer-track-count": state.trackCount,
      "--step-sequencer-step-count": state.stepCount,
      "--step-sequencer-playhead-percent": state.playheadPercent,
    } as CSSProperties,
  });

  return (
    <StepSequencerContext.Provider value={contextValue}>
      {renderElement("div", render, rootProps, renderState, content)}
    </StepSequencerContext.Provider>
  );
});
