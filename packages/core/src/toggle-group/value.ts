import type { ToggleGroupOptions, ToggleGroupValue } from "./types.ts";

export function normalizeToggleGroupValue(
  value: ToggleGroupValue | undefined,
  options: ToggleGroupOptions = {},
): string | string[] {
  const type = options.type ?? "single";

  if (type === "multiple") {
    return isValueArray(value) ? normalizeValueArray(value) : value === undefined ? [] : [value];
  }

  if (isValueArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

export function getToggleGroupValues(
  value: ToggleGroupValue | undefined,
  options: ToggleGroupOptions = {},
): string[] {
  const normalizedValue = normalizeToggleGroupValue(value, options);
  return Array.isArray(normalizedValue)
    ? normalizeValueArray(normalizedValue)
    : normalizedValue === ""
      ? []
      : [normalizedValue];
}

export function isToggleGroupItemPressed(
  value: ToggleGroupValue | undefined,
  itemValue: string,
  options: ToggleGroupOptions = {},
): boolean {
  return getToggleGroupValues(value, options).includes(itemValue);
}

export function getNextToggleGroupValue(
  value: ToggleGroupValue | undefined,
  itemValue: string,
  options: ToggleGroupOptions = {},
): string | string[] {
  if (options.disabled) {
    return normalizeToggleGroupValue(value, options);
  }

  const type = options.type ?? "single";
  const values = getToggleGroupValues(value, options);
  const isPressed = values.includes(itemValue);

  if (type === "multiple") {
    return isPressed
      ? values.filter((currentValue) => currentValue !== itemValue)
      : [...values, itemValue];
  }

  if (isPressed) {
    return options.allowEmpty ? "" : itemValue;
  }

  return itemValue;
}

function normalizeValueArray(value: readonly string[]): string[] {
  const seen = new Set<string>();
  const values: string[] = [];

  for (const itemValue of value) {
    if (seen.has(itemValue)) {
      continue;
    }

    seen.add(itemValue);
    values.push(itemValue);
  }

  return values;
}

function isValueArray(value: ToggleGroupValue | undefined): value is readonly string[] {
  return Array.isArray(value);
}
