import type {
  EnvelopeEditorPhase,
  EnvelopeEditorPoint,
  EnvelopeEditorPointId,
  EnvelopeEditorSegment,
  EnvelopeEditorState,
  EnvelopeEditorValue as CoreEnvelopeEditorValue,
  EnvelopeEditorOptions,
} from "@ryhrm-gz/audio-ui-core";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { ElementProps, RenderProp, RenderState } from "../shared/render.tsx";

export type { DataAttributes, ElementProps, RenderProp, RenderState } from "../shared/render.tsx";
export type {
  EnvelopeEditorPhase,
  EnvelopeEditorPoint,
  EnvelopeEditorPointId,
  EnvelopeEditorSegment,
};

export type EnvelopeEditorValue = CoreEnvelopeEditorValue;

export interface EnvelopeEditorRootProps
  extends
    Omit<ComponentPropsWithoutRef<"div">, "defaultValue" | "onChange" | "children">,
    EnvelopeEditorOptions {
  value?: EnvelopeEditorValue;
  defaultValue?: EnvelopeEditorValue;
  fineControl?: boolean;
  name?: string;
  required?: boolean;
  children?: ReactNode | ((state: RenderState<EnvelopeEditorState>) => ReactNode);
  onValueChange?: (value: EnvelopeEditorValue) => void;
  onValueCommit?: (value: EnvelopeEditorValue) => void;
  render?: RenderProp<ElementProps, EnvelopeEditorState>;
}

export interface EnvelopeEditorGraphProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "defaultValue" | "onChange"
> {
  render?: RenderProp<ElementProps, EnvelopeEditorState>;
}

export interface EnvelopeEditorSegmentsProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "defaultValue" | "onChange" | "children"
> {
  children?:
    | ReactNode
    | ((segment: EnvelopeEditorSegment, state: EnvelopeEditorState) => ReactNode);
  render?: RenderProp<ElementProps, EnvelopeEditorState>;
}

export interface EnvelopeEditorSegmentState extends EnvelopeEditorState {
  segment: EnvelopeEditorSegment;
}

export interface EnvelopeEditorSegmentProps extends Omit<
  ComponentPropsWithoutRef<"span">,
  "defaultValue" | "onChange"
> {
  phase: EnvelopeEditorPhase;
  render?: RenderProp<ElementProps, EnvelopeEditorSegmentState>;
}

export interface EnvelopeEditorPointsProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "defaultValue" | "onChange" | "children"
> {
  children?: ReactNode | ((point: EnvelopeEditorPoint, state: EnvelopeEditorState) => ReactNode);
  render?: RenderProp<ElementProps, EnvelopeEditorState>;
}

export interface EnvelopeEditorPointState extends EnvelopeEditorState {
  point: EnvelopeEditorPoint;
}

export interface EnvelopeEditorPointProps extends Omit<
  ComponentPropsWithoutRef<"span">,
  "defaultValue" | "onChange"
> {
  point: EnvelopeEditorPointId;
  render?: RenderProp<ElementProps, EnvelopeEditorPointState>;
}

export interface EnvelopeEditorValueProps extends Omit<
  ComponentPropsWithoutRef<"span">,
  "children"
> {
  children?: ReactNode | ((state: RenderState<EnvelopeEditorState>) => ReactNode);
  format?: (value: EnvelopeEditorValue, state: EnvelopeEditorState) => ReactNode;
  render?: RenderProp<ElementProps, EnvelopeEditorState>;
}

export interface EnvelopeEditorHiddenInputProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "children" | "type" | "value"
> {}
