import { defaultKnobOptions, resolveKnobOptions } from "./options.ts";
import type { KnobLinearDrag, KnobRange } from "./types.ts";
import { normalizeKnobValue } from "./value.ts";

export function getKnobValueFromLinearDrag(drag: KnobLinearDrag, options: KnobRange = {}) {
  const { min, max, step } = resolveKnobOptions(options);
  const range = max - min;
  const trackSize =
    Number.isFinite(drag.trackSize) && drag.trackSize > 0 ? drag.trackSize : defaultKnobOptions.max;
  const delta = drag.startY - drag.pointY;
  const nextValue = drag.startValue + range * (delta / trackSize);

  return normalizeKnobValue(nextValue, { min, max, step });
}
