import { useState } from "react";
import { EQCurve, type EQCurveValueType } from "@ryhrm-gz/audio-ui-react";

const masteringBands = [
  { id: "low-trim", type: "low-shelf", frequency: 80, gain: -1.5, q: 0.7 },
  { id: "body", type: "bell", frequency: 240, gain: 0.8, q: 1.2 },
  { id: "presence", type: "bell", frequency: 4500, gain: 1.2, q: 1 },
  { id: "air", type: "high-shelf", frequency: 12000, gain: 2, q: 0.7 },
] as const;

const disabledBands = [
  { id: "low", type: "low-shelf", frequency: 120, gain: 2, q: 0.8 },
  { id: "high", type: "high-shelf", frequency: 8000, gain: -2, q: 0.7 },
] as const;

function EQCurveExample({
  bands,
  disabled = false,
  label,
  maxGain = 24,
  minGain = -24,
}: {
  bands: EQCurveValueType;
  disabled?: boolean;
  label: string;
  maxGain?: number;
  minGain?: number;
}) {
  const [value, setValue] = useState<EQCurveValueType>([...bands]);

  return (
    <div className="audio-demo" data-variant="eq-curve">
      <span className="demo-label">{label}</span>
      <EQCurve.Root
        className="demo-eq-curve"
        curveResolution={96}
        disabled={disabled}
        maxGain={maxGain}
        minGain={minGain}
        onValueChange={setValue}
        stepFrequency={5}
        stepGain={0.1}
        stepQ={0.1}
        value={value}
      >
        <EQCurve.Graph className="demo-eq-graph">
          <EQCurve.Grid className="demo-eq-grid" />
          <EQCurve.Curve className="demo-eq-line" />
          <EQCurve.Bands className="demo-eq-bands">
            {(band) => (
              <EQCurve.Band
                key={band.id}
                aria-label={`${band.id} EQ band`}
                band={band}
                className="demo-eq-band"
              />
            )}
          </EQCurve.Bands>
        </EQCurve.Graph>
        <EQCurve.Value
          className="demo-readout demo-eq-readout"
          format={(nextValue, state) => {
            const activeBand =
              state.bands.find((band) => band.id === state.activeBand) ?? nextValue[0];

            return activeBand === undefined
              ? "0 bands"
              : `${Math.round(activeBand.frequency)} Hz / ${activeBand.gain.toFixed(1)} dB / Q ${activeBand.q.toFixed(1)}`;
          }}
        />
      </EQCurve.Root>
    </div>
  );
}

export function EQCurveMasteringExample() {
  return <EQCurveExample bands={[...masteringBands]} label="Mastering" maxGain={9} minGain={-9} />;
}

export function EQCurveDisabledBandsExample() {
  return <EQCurveExample bands={[...disabledBands]} disabled label="Disabled bands" />;
}
