import { resolveFineControlFactor } from "@ryhrm-gz/audio-ui-core";

export type FineControlProp = boolean | number;

export type FineControlAxesProp<T extends string> = boolean | Partial<Record<T, number>>;

export function isFineControlEnabled(
  fineControl: FineControlProp | FineControlAxesProp<string> | undefined,
): boolean {
  return fineControl !== false;
}

export function resolveFineFactor(fineControl: FineControlProp | undefined = true): number {
  if (typeof fineControl === "number") {
    return resolveFineControlFactor(fineControl);
  }

  return resolveFineControlFactor();
}

export function resolveFineAxisFactor<T extends string>(
  axis: T,
  fineControl: FineControlAxesProp<T> | undefined = true,
): number {
  if (typeof fineControl === "object" && typeof fineControl[axis] === "number") {
    return resolveFineControlFactor(fineControl[axis]);
  }

  return resolveFineControlFactor();
}
