export type EnvelopeEditorMode = "adsr";

export type EnvelopeEditorPhase = "attack" | "decay" | "sustain" | "release";

export type EnvelopeEditorPointId = "attack" | "sustain" | "release";

export interface EnvelopeEditorValue {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

export interface EnvelopeEditorOptions {
  minTime?: number;
  maxTime?: number;
  minLevel?: number;
  maxLevel?: number;
  stepTime?: number;
  stepLevel?: number;
  mode?: EnvelopeEditorMode;
  disabled?: boolean;
  readOnly?: boolean;
}

export interface EnvelopeEditorValueOptions {
  valueStepTime?: number;
  valueStepLevel?: number;
}

export interface ResolvedEnvelopeEditorOptions {
  minTime: number;
  maxTime: number;
  minLevel: number;
  maxLevel: number;
  stepTime: number;
  stepLevel: number;
  mode: EnvelopeEditorMode;
  disabled: boolean;
  readOnly: boolean;
}

export interface EnvelopeEditorPosition {
  x: number;
  y: number;
}

export interface EnvelopeEditorPoint extends EnvelopeEditorPosition {
  id: EnvelopeEditorPointId;
  phase: EnvelopeEditorPhase;
  time: number;
  level: number;
  editableTime: boolean;
  editableLevel: boolean;
}

export interface EnvelopeEditorSegment {
  phase: EnvelopeEditorPhase;
  start: EnvelopeEditorPosition;
  end: EnvelopeEditorPosition;
  startTime: number;
  endTime: number;
  startLevel: number;
  endLevel: number;
}

export interface EnvelopeEditorPointRect {
  graphX: number;
  graphY: number;
  graphWidth: number;
  graphHeight: number;
  pointX: number;
  pointY: number;
}

export interface EnvelopeEditorState extends ResolvedEnvelopeEditorOptions {
  value: EnvelopeEditorValue;
  points: EnvelopeEditorPoint[];
  segments: EnvelopeEditorSegment[];
  totalDuration: number;
  timelineDuration: number;
  activePoint: EnvelopeEditorPointId | null;
  disabled: boolean;
  readOnly: boolean;
}
