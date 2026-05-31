import type { ToggleButtonAction, ToggleButtonOptions } from "./types.ts";

export function getNextToggleButtonPressed(
  pressed: boolean,
  action: ToggleButtonAction = "toggle",
  options: ToggleButtonOptions = {},
): boolean {
  if (options.disabled) {
    return pressed;
  }

  if (options.mode === "momentary") {
    if (action === "press") {
      return true;
    }

    if (action === "release") {
      return false;
    }
  }

  if (action === "toggle") {
    return !pressed;
  }

  return pressed;
}
