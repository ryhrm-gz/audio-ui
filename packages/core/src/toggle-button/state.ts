import type { ToggleButtonOptions, ToggleButtonState } from "./types.ts";

export function createToggleButtonState(
  pressed = false,
  options: ToggleButtonOptions = {},
): ToggleButtonState {
  return {
    pressed: Boolean(pressed),
    mode: options.mode ?? "toggle",
  };
}
