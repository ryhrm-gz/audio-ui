import {
  cloneElement,
  createElement,
  isValidElement,
  type ElementType,
  type ReactElement,
  type ReactNode,
} from "react";

export type DataAttributes = Record<`data-${string}`, string | number | boolean | undefined>;
export type ElementProps = Record<string, unknown>;
export type RenderState<TState> = TState & DataAttributes;
export type RenderProp<TProps extends ElementProps, TState> =
  | ReactElement
  | ((props: TProps, state: RenderState<TState>) => ReactElement | null);

export function getRenderState<TState>(
  state: TState,
  flags: { disabled: boolean; readOnly: boolean; dragging: boolean },
): RenderState<TState> {
  return {
    ...state,
    "data-disabled": flags.disabled ? "" : undefined,
    "data-readonly": flags.readOnly ? "" : undefined,
    "data-dragging": flags.dragging ? "" : undefined,
  } as RenderState<TState>;
}

export function renderElement<TProps extends ElementProps, TState>(
  fallback: ElementType,
  render: RenderProp<TProps, TState> | undefined,
  props: TProps,
  state: RenderState<TState>,
  children?: ReactNode,
) {
  const nextProps =
    children === undefined
      ? props
      : ({
          ...props,
          children,
        } as TProps);

  if (typeof render === "function") {
    return render(nextProps, state);
  }

  if (isValidElement(render)) {
    return cloneElement(render, mergeProps(render.props as ElementProps, nextProps));
  }

  return createElement(fallback, nextProps);
}

export function mergeProps(...propsList: ElementProps[]) {
  const mergedProps: ElementProps = {};

  for (const props of propsList) {
    for (const [key, value] of Object.entries(props)) {
      const existingValue = mergedProps[key];

      if (
        key.startsWith("on") &&
        typeof existingValue === "function" &&
        typeof value === "function"
      ) {
        mergedProps[key] = (...args: unknown[]) => {
          existingValue(...args);
          value(...args);
        };
        continue;
      }

      if (key === "style" && isRecord(existingValue) && isRecord(value)) {
        mergedProps[key] = {
          ...existingValue,
          ...value,
        };
        continue;
      }

      if (value !== undefined) {
        mergedProps[key] = value;
      }
    }
  }

  return mergedProps;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
