import { resolveFineControlFactor } from "../shared/range.ts";
import { defaultKnobOptions, resolveKnobOptions } from "./options.ts";
import type { KnobDragOptions, KnobLinearDrag, KnobRange } from "./types.ts";
import { normalizeKnobValue } from "./value.ts";

export function getKnobValueFromLinearDrag(
  drag: KnobLinearDrag,
  options: KnobRange = {},
  dragOptions: KnobDragOptions = {},
) {
  const { min, max, step } = resolveKnobOptions(options);
  const dragFactor = dragOptions.fine ? resolveFineControlFactor(dragOptions.fineFactor) : 1;
  const range = max - min;
  const trackSize =
    Number.isFinite(drag.trackSize) && drag.trackSize > 0 ? drag.trackSize : defaultKnobOptions.max;
  const delta = drag.startY - drag.pointY;
  const nextValue = drag.startValue + range * (delta / trackSize) * dragFactor;

  return normalizeKnobValue(nextValue, { min, max, step });
}
