import type {
  SliderOptions,
  SliderRange as SliderRangeOptions,
  SliderState,
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
  value?: number;
  defaultValue?: number;
  disabled?: boolean;
  readOnly?: boolean;
  fineControl?: FineControlProp;
  resetOnDoubleClick?: boolean;
  allowTrackClick?: boolean;
  name?: string;
  required?: boolean;
  children?: ReactNode | ((state: RenderState<SliderState>) => ReactNode);
  onValueChange?: (value: number) => void;
  onValueCommit?: (value: number) => void;
  render?: RenderProp<ElementProps, SliderState>;
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
  render?: RenderProp<ElementProps, SliderState>;
}

export interface SliderValueProps extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  children?: ReactNode | ((state: RenderState<SliderState>) => ReactNode);
  format?: (value: number, state: SliderState) => ReactNode;
  render?: RenderProp<ElementProps, SliderState>;
}

export interface SliderHiddenInputProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "children" | "type" | "value"
> {}
