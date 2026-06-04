import type {
  SliderOptions,
  SliderRange as SliderRangeOptions,
  SliderState,
  SliderThumbIndex,
  SliderValue,
} from "@ryhrm-gz/audio-ui-core";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { FineControlProp } from "../shared/fine-control.ts";
import type { ElementProps, RenderProp, RenderState } from "../shared/render.tsx";

export type { DataAttributes, ElementProps, RenderProp, RenderState } from "../shared/render.tsx";

export interface SliderRootProps
  extends
    Omit<ComponentPropsWithoutRef<"div">, "defaultValue" | "onChange" | "children">,
    SliderRangeOptions,
    Pick<SliderOptions, "orientation" | "inverted" | "origin"> {
  value?: SliderValue;
  defaultValue?: SliderValue;
  disabled?: boolean;
  readOnly?: boolean;
  fineControl?: FineControlProp;
  resetOnDoubleClick?: boolean;
  allowTrackClick?: boolean;
  name?: string;
  required?: boolean;
  children?: ReactNode | ((state: RenderState<SliderState>) => ReactNode);
  render?: RenderProp<ElementProps, SliderState>;
  onValueChange?: (value: SliderValue) => void;
  onValueCommit?: (value: SliderValue) => void;
}

export interface SliderTrackProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "defaultValue" | "onChange"
> {
  render?: RenderProp<ElementProps, SliderState>;
}

export interface SliderRangeProps extends ComponentPropsWithoutRef<"span"> {
  render?: RenderProp<ElementProps, SliderState>;
}

export interface SliderThumbProps extends Omit<
  ComponentPropsWithoutRef<"span">,
  "defaultValue" | "onChange"
> {
  index: SliderThumbIndex;
  render?: RenderProp<ElementProps, SliderState>;
}

export interface SliderValueProps extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  index?: SliderThumbIndex;
  children?: ReactNode | ((state: RenderState<SliderState>) => ReactNode);
  format?: (value: SliderValue | number, state: SliderState, index?: SliderThumbIndex) => ReactNode;
  render?: RenderProp<ElementProps, SliderState>;
}

export interface SliderHiddenInputProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "children" | "type" | "value"
> {}
