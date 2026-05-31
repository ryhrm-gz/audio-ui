import type {
  ToggleGroupOrientation,
  ToggleGroupState,
  ToggleGroupType,
} from "@ryhrm-gz/audio-ui-core";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { ElementProps, RenderProp, RenderState } from "../shared/render.tsx";

export type { DataAttributes, ElementProps, RenderProp, RenderState } from "../shared/render.tsx";

export interface ToggleGroupRootProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> {
  type?: ToggleGroupType;
  value?: string | readonly string[];
  defaultValue?: string | readonly string[];
  allowEmpty?: boolean;
  orientation?: ToggleGroupOrientation;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  children?: ReactNode | ((state: RenderState<ToggleGroupState>) => ReactNode);
  onValueChange?: (value: string | string[]) => void;
  render?: RenderProp<ElementProps, ToggleGroupState>;
}

export interface ToggleGroupItemProps extends Omit<
  ComponentPropsWithoutRef<"button">,
  "children" | "value"
> {
  value: string;
  children?:
    | ReactNode
    | ((state: RenderState<ToggleGroupState & { pressed: boolean }>) => ReactNode);
  render?: RenderProp<ElementProps, ToggleGroupState & { pressed: boolean }>;
}

export interface ToggleGroupHiddenInputProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "children" | "type" | "value"
> {}
