import type {
  CompressorCurveOptions,
  CompressorCurvePoint,
  CompressorCurveState,
  CompressorCurveValue as CoreCompressorCurveValue,
} from "@ryhrm-gz/audio-ui-core";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { ElementProps, RenderProp, RenderState } from "../shared/render.tsx";

export type { DataAttributes, ElementProps, RenderProp, RenderState } from "../shared/render.tsx";
export type { CompressorCurvePoint };

export type CompressorCurveValue = CoreCompressorCurveValue;

export interface CompressorCurveRootProps
  extends
    Omit<ComponentPropsWithoutRef<"div">, "defaultValue" | "onChange" | "children">,
    CompressorCurveOptions {
  value?: CompressorCurveValue;
  defaultValue?: CompressorCurveValue;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  children?: ReactNode | ((state: RenderState<CompressorCurveState>) => ReactNode);
  render?: RenderProp<ElementProps, CompressorCurveState>;
}

export interface CompressorCurveGraphProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "defaultValue" | "onChange"
> {
  render?: RenderProp<ElementProps, CompressorCurveState>;
}

export interface CompressorCurveGridProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "defaultValue" | "onChange"
> {
  render?: RenderProp<ElementProps, CompressorCurveState>;
}

export interface CompressorCurveCurveProps extends Omit<
  ComponentPropsWithoutRef<"svg">,
  "defaultValue" | "onChange"
> {
  render?: RenderProp<ElementProps, CompressorCurveState>;
}

export interface CompressorCurveValueProps extends Omit<
  ComponentPropsWithoutRef<"span">,
  "children"
> {
  children?: ReactNode | ((state: RenderState<CompressorCurveState>) => ReactNode);
  format?: (value: CompressorCurveValue, state: CompressorCurveState) => ReactNode;
  render?: RenderProp<ElementProps, CompressorCurveState>;
}

export interface CompressorCurveHiddenInputProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "children" | "type" | "value"
> {}
