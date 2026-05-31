import type {
  StepSequencerOptions,
  StepSequencerState,
  StepSequencerStepState,
  StepSequencerTrackState,
  StepSequencerValue,
  StepSequencerValueInput,
} from "@ryhrm-gz/audio-ui-core";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { ElementProps, RenderProp, RenderState } from "../shared/render.tsx";

export type { DataAttributes, ElementProps, RenderProp, RenderState } from "../shared/render.tsx";

export interface StepSequencerRootProps
  extends
    Omit<ComponentPropsWithoutRef<"div">, "children" | "defaultValue" | "onChange">,
    StepSequencerOptions {
  value?: StepSequencerValueInput;
  defaultValue?: StepSequencerValueInput;
  disabled?: boolean;
  readOnly?: boolean;
  name?: string;
  required?: boolean;
  children?: ReactNode | ((state: RenderState<StepSequencerState>) => ReactNode);
  onValueChange?: (value: StepSequencerValue) => void;
  render?: RenderProp<ElementProps, StepSequencerState>;
}

export interface StepSequencerTracksProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> {
  children?:
    | ReactNode
    | ((
        track: RenderState<StepSequencerTrackState>,
        state: RenderState<StepSequencerState>,
      ) => ReactNode);
  render?: RenderProp<ElementProps, StepSequencerState>;
}

export interface StepSequencerTrackProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  track: number;
  children?: ReactNode | ((track: RenderState<StepSequencerTrackState>) => ReactNode);
  render?: RenderProp<ElementProps, StepSequencerTrackState>;
}

export interface StepSequencerStepsProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  track: number;
  children?:
    | ReactNode
    | ((
        step: RenderState<StepSequencerStepState>,
        track: RenderState<StepSequencerTrackState>,
        state: RenderState<StepSequencerState>,
      ) => ReactNode);
  render?: RenderProp<ElementProps, StepSequencerTrackState>;
}

export interface StepSequencerStepProps extends Omit<
  ComponentPropsWithoutRef<"button">,
  "children" | "value"
> {
  track: number;
  step: number;
  children?: ReactNode | ((state: RenderState<StepSequencerStepState>) => ReactNode);
  render?: RenderProp<ElementProps, StepSequencerStepState>;
}

export interface StepSequencerPlayheadProps extends Omit<
  ComponentPropsWithoutRef<"span">,
  "children"
> {
  render?: RenderProp<ElementProps, StepSequencerState>;
}

export interface StepSequencerHiddenInputProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "children" | "type" | "value"
> {}
