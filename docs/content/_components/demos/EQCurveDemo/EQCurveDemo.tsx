import { useState } from "react";
import { EQCurve, type EQCurveValueType } from "@ryhrm-gz/audio-ui-react";
import styles from "./index.module.css";

const initialBands = [
  { id: "low", type: "low-shelf", frequency: 110, gain: 3, q: 0.8 },
  { id: "mud", type: "bell", frequency: 380, gain: -4.5, q: 1.4 },
  { id: "presence", type: "bell", frequency: 3200, gain: 2.5, q: 1.1 },
  { id: "air", type: "high-shelf", frequency: 9000, gain: 4, q: 0.7 },
] as const;

export function EQCurveDemo() {
  const [value, setValue] = useState<EQCurveValueType>([...initialBands]);

  return (
    <div className={styles.root} data-variant="eq-curve">
      <span className={styles.label}>Parametric EQ</span>
      <EQCurve.Root
        className={styles.eqCurve}
        curveResolution={96}
        name="channel-eq"
        onValueChange={setValue}
        stepFrequency={5}
        stepGain={0.1}
        stepQ={0.1}
        value={value}
      >
        <EQCurve.Graph className={styles.eqGraph}>
          <EQCurve.Grid className={styles.eqGrid} />
          <EQCurve.Curve className={styles.eqLine} />
          <EQCurve.Bands className={styles.eqBands}>
            {(band) => (
              <EQCurve.Band
                key={band.id}
                aria-label={`${band.id} EQ band`}
                band={band}
                className={styles.eqBand}
              />
            )}
          </EQCurve.Bands>
        </EQCurve.Graph>
        <EQCurve.Value
          className={[styles.readout, styles.eqReadout].join(" ")}
          format={(nextValue, state) => {
            const activeBand =
              state.bands.find((band) => band.id === state.activeBand) ??
              nextValue[1] ??
              nextValue[0];

            return activeBand === undefined
              ? "0 bands"
              : `${Math.round(activeBand.frequency)} Hz / ${activeBand.gain.toFixed(1)} dB / Q ${activeBand.q.toFixed(1)}`;
          }}
        />
        <EQCurve.HiddenInput />
      </EQCurve.Root>
    </div>
  );
}
