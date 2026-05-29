import type { KnobAngleRange, KnobRange, KnobState } from "@audio-ui/core";
import type { ComponentPropsWithoutRef, ElementType, ReactElement, ReactNode } from "react";

export type DataAttributes = Record<`data-${string}`, string | number | boolean | undefined>;
export type ElementProps = Record<string, unknown>;
export type RenderState<TState> = TState & DataAttributes;
export type RenderProp<TProps extends ElementProps, TState> =
  | ReactElement
  | ((props: TProps, state: RenderState<TState>) => ReactElement | null);

export interface KnobRootProps
  extends
    Omit<ComponentPropsWithoutRef<"div">, "defaultValue" | "onChange" | "children">,
    KnobRange,
    KnobAngleRange {
  value?: number;
  defaultValue?: number;
  disabled?: boolean;
  readOnly?: boolean;
  name?: string;
  required?: boolean;
  children?: ReactNode | ((state: RenderState<KnobState>) => ReactNode);
  onValueChange?: (value: number) => void;
  onValueCommit?: (value: number) => void;
  render?: RenderProp<ElementProps, KnobState>;
}

export interface KnobControlProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "defaultValue" | "onChange"
> {
  render?: RenderProp<ElementProps, KnobState>;
}

export interface KnobThumbProps extends ComponentPropsWithoutRef<"span"> {
  render?: RenderProp<ElementProps, KnobState>;
}

export interface KnobValueProps extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  children?: ReactNode | ((state: RenderState<KnobState>) => ReactNode);
  format?: (value: number, state: KnobState) => ReactNode;
  render?: RenderProp<ElementProps, KnobState>;
}

export interface KnobHiddenInputProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "children" | "type" | "value"
> {}

export type KnobElement = ElementType;
