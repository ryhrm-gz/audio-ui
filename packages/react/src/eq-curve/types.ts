import type {
  EQCurveBand,
  EQCurveBandType,
  EQCurveBandState,
  EQCurveOptions,
  EQCurvePoint,
  EQCurveState,
  EQCurveValue as CoreEQCurveValue,
} from "@ryhrm-gz/audio-ui-core";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { FineControlAxesProp } from "../shared/fine-control.ts";
import type { ElementProps, RenderProp, RenderState } from "../shared/render.tsx";

export type { DataAttributes, ElementProps, RenderProp, RenderState } from "../shared/render.tsx";
export type { EQCurveBand, EQCurveBandState, EQCurveBandType, EQCurvePoint };

export type EQCurveValue = CoreEQCurveValue;

export interface EQCurveRootProps
  extends
    Omit<ComponentPropsWithoutRef<"div">, "defaultValue" | "onChange" | "children">,
    EQCurveOptions {
  value?: EQCurveValue;
  defaultValue?: EQCurveValue;
  disabled?: boolean;
  readOnly?: boolean;
  fineControl?: FineControlAxesProp<"frequency" | "gain" | "q">;
  name?: string;
  required?: boolean;
  children?: ReactNode | ((state: RenderState<EQCurveState>) => ReactNode);
  onValueChange?: (value: EQCurveValue) => void;
  onValueCommit?: (value: EQCurveValue) => void;
  render?: RenderProp<ElementProps, EQCurveState>;
}

export interface EQCurveGraphProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "defaultValue" | "onChange"
> {
  render?: RenderProp<ElementProps, EQCurveState>;
}

export interface EQCurveGridProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "defaultValue" | "onChange"
> {
  render?: RenderProp<ElementProps, EQCurveState>;
}

export interface EQCurveCurveProps extends Omit<
  ComponentPropsWithoutRef<"svg">,
  "defaultValue" | "onChange"
> {
  render?: RenderProp<ElementProps, EQCurveState>;
}

export interface EQCurveBandsProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "defaultValue" | "onChange" | "children"
> {
  children?: ReactNode | ((band: EQCurveBandState, state: EQCurveState) => ReactNode);
  render?: RenderProp<ElementProps, EQCurveState>;
}

export interface EQCurveBandRenderState extends EQCurveState {
  band: EQCurveBandState;
}

export interface EQCurveBandProps extends Omit<
  ComponentPropsWithoutRef<"span">,
  "defaultValue" | "onChange"
> {
  band: EQCurveBand | EQCurveBandState | string;
  render?: RenderProp<ElementProps, EQCurveBandRenderState>;
}

export interface EQCurveValueProps extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  children?: ReactNode | ((state: RenderState<EQCurveState>) => ReactNode);
  format?: (value: EQCurveValue, state: EQCurveState) => ReactNode;
  render?: RenderProp<ElementProps, EQCurveState>;
}

export interface EQCurveHiddenInputProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "children" | "type" | "value"
> {}
