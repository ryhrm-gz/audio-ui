export type ToggleGroupType = "single" | "multiple";
export type ToggleGroupOrientation = "horizontal" | "vertical";

export type ToggleGroupValue = string | readonly string[];

export interface ToggleGroupOptions {
  type?: ToggleGroupType;
  orientation?: ToggleGroupOrientation;
  allowEmpty?: boolean;
  disabled?: boolean;
}

export interface ToggleGroupItemOptions {
  disabled?: boolean;
}

export interface ToggleGroupKeyboardItem {
  disabled?: boolean;
}

export interface ToggleGroupState {
  type: ToggleGroupType;
  value: string | string[];
  values: string[];
  orientation: ToggleGroupOrientation;
  allowEmpty: boolean;
}
