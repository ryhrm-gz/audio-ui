import { getEnvelopeEditorTimelineDuration, resolveEnvelopeEditorOptions } from "./options.ts";
import { getEnvelopeEditorPoints, getEnvelopeEditorSegments } from "./points.ts";
import type {
  EnvelopeEditorOptions,
  EnvelopeEditorPointId,
  EnvelopeEditorState,
  EnvelopeEditorValue,
  EnvelopeEditorValueOptions,
} from "./types.ts";
import { getEnvelopeEditorTotalDuration, normalizeEnvelopeEditorValue } from "./value.ts";

export function createEnvelopeEditorState(
  value: EnvelopeEditorValue,
  options: EnvelopeEditorOptions &
    EnvelopeEditorValueOptions & { activePoint?: EnvelopeEditorPointId | null } = {},
): EnvelopeEditorState {
  const resolvedOptions = resolveEnvelopeEditorOptions(options);
  const normalizedValue = normalizeEnvelopeEditorValue(value, {
    ...resolvedOptions,
    valueStepTime: options.valueStepTime,
    valueStepLevel: options.valueStepLevel,
  });

  return {
    ...resolvedOptions,
    value: normalizedValue,
    points: getEnvelopeEditorPoints(normalizedValue, resolvedOptions),
    segments: getEnvelopeEditorSegments(normalizedValue, resolvedOptions),
    totalDuration: getEnvelopeEditorTotalDuration(normalizedValue),
    timelineDuration: getEnvelopeEditorTimelineDuration(resolvedOptions),
    activePoint: options.activePoint ?? null,
  };
}
