import type {
  RangeSliderOptions,
  RangeSliderRange as RangeSliderRangeOptions,
  RangeSliderState,
  RangeSliderThumbIndex,
  RangeSliderValue,
} from "@ryhrm-gz/audio-ui-core";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { ElementProps, RenderProp, RenderState } from "../shared/render.tsx";

export type { DataAttributes, ElementProps, RenderProp, RenderState } from "../shared/render.tsx";

export interface RangeSliderRootProps
  extends
    Omit<ComponentPropsWithoutRef<"div">, "defaultValue" | "onChange" | "children">,
    RangeSliderRangeOptions,
    Pick<RangeSliderOptions, "orientation" | "inverted"> {
  value?: RangeSliderValue;
  defaultValue?: RangeSliderValue;
  disabled?: boolean;
  readOnly?: boolean;
  fineControl?: boolean;
  resetOnDoubleClick?: boolean;
  name?: string;
  required?: boolean;
  children?: ReactNode | ((state: RenderState<RangeSliderState>) => ReactNode);
  onValueChange?: (value: RangeSliderValue) => void;
  onValueCommit?: (value: RangeSliderValue) => void;
  render?: RenderProp<ElementProps, RangeSliderState>;
}

export interface RangeSliderTrackProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "defaultValue" | "onChange"
> {
  render?: RenderProp<ElementProps, RangeSliderState>;
}

export interface RangeSliderRangeProps extends ComponentPropsWithoutRef<"span"> {
  render?: RenderProp<ElementProps, RangeSliderState>;
}

export interface RangeSliderThumbProps extends Omit<
  ComponentPropsWithoutRef<"span">,
  "defaultValue" | "onChange"
> {
  index: RangeSliderThumbIndex;
  render?: RenderProp<ElementProps, RangeSliderState>;
}

export interface RangeSliderValueProps extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  index?: RangeSliderThumbIndex;
  children?: ReactNode | ((state: RenderState<RangeSliderState>) => ReactNode);
  format?: (
    value: RangeSliderValue | number,
    state: RangeSliderState,
    index?: RangeSliderThumbIndex,
  ) => ReactNode;
  render?: RenderProp<ElementProps, RangeSliderState>;
}

export interface RangeSliderHiddenInputProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "children" | "type" | "value"
> {}
