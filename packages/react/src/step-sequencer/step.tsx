import { resolveStepSequencerKeyboardTarget } from "@ryhrm-gz/audio-ui-core";
import { forwardRef, type CSSProperties, type KeyboardEvent, type MouseEvent } from "react";
import { getRenderState, mergeProps, renderElement } from "../shared/render.tsx";
import { useStepSequencerContext } from "./context.tsx";
import type { StepSequencerStepProps } from "./types.ts";

export const Step = forwardRef<HTMLButtonElement, StepSequencerStepProps>(
  function Step(props, ref) {
    const {
      track: trackIndex,
      step: stepIndex,
      children,
      render,
      style,
      type = "button",
      onClick,
      onKeyDown,
      ...elementProps
    } = props;
    const context = useStepSequencerContext("StepSequencer.Step");
    const { state, readOnly, getStep, toggleStep } = context;
    const step = getStep(trackIndex, stepIndex);

    if (step === undefined) {
      throw new Error(`StepSequencer.Step could not find track ${trackIndex}, step ${stepIndex}.`);
    }

    const disabled = context.disabled || step.disabled;
    const canToggle = !disabled && !readOnly;

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);

      if (event.defaultPrevented || !canToggle) {
        return;
      }

      toggleStep(step.trackIndex, step.stepIndex);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(event);

      if (event.defaultPrevented) {
        return;
      }

      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();

        if (canToggle) {
          toggleStep(step.trackIndex, step.stepIndex);
        }

        return;
      }

      const target = resolveStepSequencerKeyboardTarget(step, event.key, state);

      if (target === undefined) {
        return;
      }

      event.preventDefault();
      focusStep(event.currentTarget, target.trackIndex, target.stepIndex);
    };

    const renderState = getRenderState(step, {
      disabled,
      readOnly,
      dragging: false,
    });
    const content = typeof children === "function" ? children(renderState) : children;
    const stepProps = mergeProps(elementProps, {
      ref,
      type,
      disabled,
      "aria-pressed": step.active,
      "aria-readonly": readOnly ? true : undefined,
      "data-part": "step",
      "data-active": step.active ? "" : undefined,
      "data-disabled": disabled ? "" : undefined,
      "data-readonly": readOnly ? "" : undefined,
      "data-track-index": step.trackIndex,
      "data-step-index": step.stepIndex,
      "data-playhead": step.current ? "" : undefined,
      style: {
        ...style,
        "--step-sequencer-track-count": state.trackCount,
        "--step-sequencer-step-count": state.stepCount,
        "--step-sequencer-track-index": step.trackIndex,
        "--step-sequencer-step-index": step.stepIndex,
        "--step-sequencer-step-percent": step.stepPercent,
        "--step-sequencer-playhead-percent": state.playheadPercent,
      } as CSSProperties,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
    });

    return renderElement(
      "button",
      render,
      stepProps,
      renderState,
      content ?? `${step.stepIndex + 1}`,
    );
  },
);

function focusStep(element: HTMLButtonElement, trackIndex: number, stepIndex: number): void {
  const root = element.closest('[data-audio-ui="step-sequencer"]');
  const target = root?.querySelector<HTMLButtonElement>(
    `[data-part="step"][data-track-index="${trackIndex}"][data-step-index="${stepIndex}"]`,
  );

  target?.focus();
}
