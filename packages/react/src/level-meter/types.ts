import type {
  LevelMeterOptions,
  LevelMeterScalePoint,
  LevelMeterSegmentState,
  LevelMeterState,
  LevelMeterValue,
} from "@ryhrm-gz/audio-ui-core";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { ElementProps, RenderProp, RenderState } from "../shared/render.tsx";

export type { DataAttributes, ElementProps, RenderProp, RenderState } from "../shared/render.tsx";

export interface LevelMeterRootProps
  extends
    Omit<ComponentPropsWithoutRef<"div">, "defaultValue" | "onChange" | "children">,
    LevelMeterOptions {
  value?: LevelMeterValue;
  peak?: LevelMeterValue;
  disabled?: boolean;
  children?: ReactNode | ((state: RenderState<LevelMeterState>) => ReactNode);
  render?: RenderProp<ElementProps, LevelMeterState>;
}

export interface LevelMeterTrackProps extends ComponentPropsWithoutRef<"div"> {
  render?: RenderProp<ElementProps, LevelMeterState>;
}

export interface LevelMeterBarProps extends ComponentPropsWithoutRef<"span"> {
  channel?: number;
  render?: RenderProp<ElementProps, LevelMeterState>;
}

export interface LevelMeterPeakProps extends ComponentPropsWithoutRef<"span"> {
  channel?: number;
  render?: RenderProp<ElementProps, LevelMeterState>;
}

export interface LevelMeterSegmentsProps extends Omit<
  ComponentPropsWithoutRef<"span">,
  "children" | "defaultValue" | "onChange"
> {
  channel?: number;
  children?:
    | ReactNode
    | ((segment: LevelMeterSegmentState, state: RenderState<LevelMeterState>) => ReactNode);
  render?: RenderProp<ElementProps, LevelMeterState>;
}

export interface LevelMeterScaleProps extends Omit<
  ComponentPropsWithoutRef<"span">,
  "children" | "defaultValue" | "onChange"
> {
  children?:
    | ReactNode
    | ((mark: LevelMeterScalePoint, state: RenderState<LevelMeterState>) => ReactNode);
  render?: RenderProp<ElementProps, LevelMeterState>;
}

export interface LevelMeterValueProps extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  channel?: number;
  children?: ReactNode | ((state: RenderState<LevelMeterState>) => ReactNode);
  format?: (value: number, state: LevelMeterState) => ReactNode;
  render?: RenderProp<ElementProps, LevelMeterState>;
}
