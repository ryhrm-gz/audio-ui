import type {
  FaderOptions,
  FaderRange as FaderRangeOptions,
  FaderScalePoint,
  FaderState,
} from "@ryhrm-gz/audio-ui-core";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { ElementProps, RenderProp, RenderState } from "../shared/render.tsx";

export type { DataAttributes, ElementProps, RenderProp, RenderState } from "../shared/render.tsx";

export interface FaderRootProps
  extends
    Omit<ComponentPropsWithoutRef<"div">, "defaultValue" | "onChange" | "children">,
    FaderRangeOptions,
    Pick<FaderOptions, "inverted" | "scale" | "unity"> {
  value?: number;
  defaultValue?: number;
  disabled?: boolean;
  readOnly?: boolean;
  fineControl?: boolean;
  resetOnDoubleClick?: boolean;
  allowTrackClick?: boolean;
  name?: string;
  required?: boolean;
  children?: ReactNode | ((state: RenderState<FaderState>) => ReactNode);
  onValueChange?: (value: number) => void;
  onValueCommit?: (value: number) => void;
  render?: RenderProp<ElementProps, FaderState>;
}

export interface FaderTrackProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "defaultValue" | "onChange"
> {
  render?: RenderProp<ElementProps, FaderState>;
}

export interface FaderRangeProps extends ComponentPropsWithoutRef<"span"> {
  render?: RenderProp<ElementProps, FaderState>;
}

export interface FaderScaleProps extends Omit<
  ComponentPropsWithoutRef<"span">,
  "children" | "defaultValue" | "onChange"
> {
  children?: ReactNode | ((mark: FaderScalePoint, state: RenderState<FaderState>) => ReactNode);
  render?: RenderProp<ElementProps, FaderState>;
}

export interface FaderThumbProps extends Omit<
  ComponentPropsWithoutRef<"span">,
  "defaultValue" | "onChange"
> {
  render?: RenderProp<ElementProps, FaderState>;
}

export interface FaderValueProps extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  children?: ReactNode | ((state: RenderState<FaderState>) => ReactNode);
  format?: (value: number, state: FaderState) => ReactNode;
  render?: RenderProp<ElementProps, FaderState>;
}

export interface FaderHiddenInputProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "children" | "type" | "value"
> {}
