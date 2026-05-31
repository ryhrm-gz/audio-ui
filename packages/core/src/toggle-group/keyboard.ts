import type { ToggleGroupKeyboardItem, ToggleGroupOptions } from "./types.ts";

export function getNextToggleGroupFocusedIndex(
  currentIndex: number,
  key: string,
  items: readonly ToggleGroupKeyboardItem[],
  options: Pick<ToggleGroupOptions, "orientation"> = {},
): number | undefined {
  if (items.length === 0) {
    return undefined;
  }

  if (key === "Home") {
    return getFirstEnabledIndex(items);
  }

  if (key === "End") {
    return getLastEnabledIndex(items);
  }

  const orientation = options.orientation ?? "horizontal";
  const direction = getDirection(key, orientation);

  if (direction === 0) {
    return undefined;
  }

  for (let offset = 1; offset <= items.length; offset += 1) {
    const nextIndex = wrapIndex(currentIndex + direction * offset, items.length);

    if (!items[nextIndex]?.disabled) {
      return nextIndex;
    }
  }

  return undefined;
}

function getDirection(key: string, orientation: "horizontal" | "vertical"): number {
  if (orientation === "vertical") {
    if (key === "ArrowDown") {
      return 1;
    }

    if (key === "ArrowUp") {
      return -1;
    }

    return 0;
  }

  if (key === "ArrowRight") {
    return 1;
  }

  if (key === "ArrowLeft") {
    return -1;
  }

  return 0;
}

function getFirstEnabledIndex(items: readonly ToggleGroupKeyboardItem[]): number | undefined {
  const index = items.findIndex((item) => !item.disabled);
  return index === -1 ? undefined : index;
}

function getLastEnabledIndex(items: readonly ToggleGroupKeyboardItem[]): number | undefined {
  for (let index = items.length - 1; index >= 0; index -= 1) {
    if (!items[index]?.disabled) {
      return index;
    }
  }

  return undefined;
}

function wrapIndex(index: number, length: number): number {
  return ((index % length) + length) % length;
}
