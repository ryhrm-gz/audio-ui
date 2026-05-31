import type { XYPadRangeOptions, XYPadState, XYPadValue } from "@ryhrm-gz/audio-ui-core";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { ElementProps, RenderProp, RenderState } from "../shared/render.tsx";

export type { DataAttributes, ElementProps, RenderProp, RenderState } from "../shared/render.tsx";

export interface XYPadRootProps
  extends
    Omit<ComponentPropsWithoutRef<"div">, "defaultValue" | "onChange" | "children">,
    XYPadRangeOptions {
  value?: XYPadValue;
  defaultValue?: XYPadValue;
  disabled?: boolean;
  readOnly?: boolean;
  fineControl?: boolean;
  resetOnDoubleClick?: boolean;
  allowTrackClick?: boolean;
  name?: string;
  required?: boolean;
  children?: ReactNode | ((state: RenderState<XYPadState>) => ReactNode);
  onValueChange?: (value: XYPadValue) => void;
  onValueCommit?: (value: XYPadValue) => void;
  render?: RenderProp<ElementProps, XYPadState>;
}

export interface XYPadAreaProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "defaultValue" | "onChange"
> {
  render?: RenderProp<ElementProps, XYPadState>;
}

export interface XYPadThumbProps extends Omit<
  ComponentPropsWithoutRef<"span">,
  "defaultValue" | "onChange"
> {
  render?: RenderProp<ElementProps, XYPadState>;
}

export interface XYPadValueProps extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  children?: ReactNode | ((state: RenderState<XYPadState>) => ReactNode);
  format?: (value: XYPadValue, state: XYPadState) => ReactNode;
  render?: RenderProp<ElementProps, XYPadState>;
}

export interface XYPadHiddenInputProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "children" | "type" | "value"
> {}
