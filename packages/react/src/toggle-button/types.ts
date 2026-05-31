import type { ToggleButtonMode, ToggleButtonState } from "@ryhrm-gz/audio-ui-core";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { ElementProps, RenderProp, RenderState } from "../shared/render.tsx";

export type { DataAttributes, ElementProps, RenderProp, RenderState } from "../shared/render.tsx";

export interface ToggleButtonRootProps extends Omit<
  ComponentPropsWithoutRef<"button">,
  "children" | "defaultValue" | "onChange" | "value"
> {
  pressed?: boolean;
  defaultPressed?: boolean;
  mode?: ToggleButtonMode;
  name?: string;
  value?: string;
  required?: boolean;
  children?: ReactNode | ((state: RenderState<ToggleButtonState>) => ReactNode);
  onPressedChange?: (pressed: boolean) => void;
  render?: RenderProp<ElementProps, ToggleButtonState>;
}

export interface ToggleButtonHiddenInputProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "children" | "type" | "value"
> {
  value?: string;
}
