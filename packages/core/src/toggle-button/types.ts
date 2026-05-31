export type ToggleButtonMode = "toggle" | "momentary";
export type ToggleButtonAction = "toggle" | "press" | "release";

export interface ToggleButtonOptions {
  mode?: ToggleButtonMode;
  disabled?: boolean;
}

export interface ToggleButtonState {
  pressed: boolean;
  mode: ToggleButtonMode;
}
