import { getFineStep } from "@ryhrm-gz/audio-ui-core";

export type FineControlProp = boolean | number;

export type FineControlAxesProp<T extends string> = boolean | Partial<Record<T, number>>;

export function isFineControlEnabled(
  fineControl: FineControlProp | FineControlAxesProp<string> | undefined,
): boolean {
  return fineControl !== false;
}

export function resolveFineValueStep(
  step: number,
  fineControl: FineControlProp | undefined = true,
): number {
  if (typeof fineControl === "number") {
    return fineControl;
  }

  return getFineStep(step);
}

export function resolveFineAxisValueStep<T extends string>(
  step: number,
  axis: T,
  fineControl: FineControlAxesProp<T> | undefined = true,
): number {
  if (typeof fineControl === "object" && typeof fineControl[axis] === "number") {
    return fineControl[axis]!;
  }

  return getFineStep(step);
}
