import { StrictMode, useMemo, useState, type CSSProperties } from "react";
import { createRoot } from "react-dom/client";
import { Knob } from "@audio-ui/react";
import "./styles.css";

interface KnobPreset {
  id: string;
  label: string;
  detail: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
  accent: string;
}

const presets: KnobPreset[] = [
  {
    id: "gain",
    label: "Gain",
    detail: "Input channel",
    min: -60,
    max: 12,
    step: 0.5,
    defaultValue: -6,
    unit: "dB",
    accent: "#f5b84b",
  },
  {
    id: "pan",
    label: "Pan",
    detail: "Stereo bus",
    min: -100,
    max: 100,
    step: 1,
    defaultValue: 0,
    unit: "%",
    accent: "#42c3a7",
  },
  {
    id: "filter",
    label: "Cutoff",
    detail: "Low-pass filter",
    min: 20,
    max: 20_000,
    step: 10,
    defaultValue: 2400,
    unit: "Hz",
    accent: "#6aa9ff",
  },
];

function App() {
  const [presetId, setPresetId] = useState(presets[0]?.id ?? "gain");
  const preset = presets.find((item) => item.id === presetId) ?? presets[0];
  const [values, setValues] = useState(() =>
    Object.fromEntries(presets.map((item) => [item.id, item.defaultValue])),
  );
  const [commitValue, setCommitValue] = useState(preset.defaultValue);
  const value = values[preset.id] ?? preset.defaultValue;
  const formattedValue = formatValue(value, preset);
  const percent = useMemo(
    () => ((value - preset.min) / (preset.max - preset.min)) * 100,
    [preset, value],
  );

  const setPresetValue = (nextValue: number) => {
    setValues((current) => ({ ...current, [preset.id]: nextValue }));
  };

  return (
    <main className="shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Audio UI</p>
          <h1>Component Lab</h1>
        </div>

        <nav className="component-list" aria-label="Components">
          {presets.map((item) => (
            <button
              className="component-button"
              data-selected={item.id === preset.id ? "" : undefined}
              key={item.id}
              onClick={() => {
                setPresetId(item.id);
                setCommitValue(values[item.id] ?? item.defaultValue);
              }}
              type="button"
            >
              <span>
                <strong>{item.label}</strong>
                <small>{item.detail}</small>
              </span>
              <span className="status-dot" style={{ "--accent": item.accent } as CSSProperties} />
            </button>
          ))}
        </nav>
      </aside>

      <section className="workspace" style={{ "--accent": preset.accent } as CSSProperties}>
        <header className="workspace-header">
          <div>
            <p className="eyebrow">Knob primitive</p>
            <h2>{preset.label}</h2>
          </div>
          <output className="readout" aria-label={`${preset.label} value`}>
            {formattedValue}
          </output>
        </header>

        <div className="preview-grid">
          <section className="stage" aria-label="Interactive preview">
            <PreviewKnob
              accent={preset.accent}
              label={preset.label}
              max={preset.max}
              min={preset.min}
              onCommit={setCommitValue}
              onValueChange={setPresetValue}
              step={preset.step}
              unit={preset.unit}
              value={value}
            />
            <div className="meter-row" aria-label="Value meter">
              <span>{formatValue(preset.min, preset)}</span>
              <meter max={preset.max} min={preset.min} value={value} />
              <span>{formatValue(preset.max, preset)}</span>
            </div>
          </section>

          <aside className="inspector" aria-label="Inspector">
            <label className="field">
              <span>Value</span>
              <input
                max={preset.max}
                min={preset.min}
                onChange={(event) => setPresetValue(event.currentTarget.valueAsNumber)}
                step={preset.step}
                type="range"
                value={value}
              />
            </label>

            <div className="data-grid">
              <span>Min</span>
              <strong>{formatValue(preset.min, preset)}</strong>
              <span>Max</span>
              <strong>{formatValue(preset.max, preset)}</strong>
              <span>Step</span>
              <strong>{formatValue(preset.step, preset)}</strong>
              <span>Percent</span>
              <strong>{Math.round(percent)}%</strong>
              <span>Last commit</span>
              <strong>{formatValue(commitValue, preset)}</strong>
            </div>
          </aside>
        </div>

        <section className="variant-grid" aria-label="Variants">
          <Variant title="Compact">
            <PreviewKnob
              accent={preset.accent}
              compact
              label={`${preset.label} compact`}
              max={preset.max}
              min={preset.min}
              onValueChange={setPresetValue}
              step={preset.step}
              unit={preset.unit}
              value={value}
            />
          </Variant>
          <Variant title="Disabled">
            <PreviewKnob
              accent="#8b95a7"
              compact
              disabled
              label={`${preset.label} disabled`}
              max={preset.max}
              min={preset.min}
              onValueChange={setPresetValue}
              step={preset.step}
              unit={preset.unit}
              value={value}
            />
          </Variant>
          <Variant title="Read only">
            <PreviewKnob
              accent="#c274db"
              compact
              label={`${preset.label} read only`}
              max={preset.max}
              min={preset.min}
              onValueChange={setPresetValue}
              readOnly
              step={preset.step}
              unit={preset.unit}
              value={value}
            />
          </Variant>
          <Variant title="Render prop">
            <Knob.Root
              className="render-prop"
              max={preset.max}
              min={preset.min}
              onValueChange={setPresetValue}
              step={preset.step}
              value={value}
            >
              {(state) => (
                <>
                  <Knob.Control
                    aria-label={`${preset.label} render prop`}
                    className="strip-control"
                    style={{ "--accent": preset.accent } as CSSProperties}
                  >
                    <Knob.Thumb className="strip-thumb" />
                  </Knob.Control>
                  <Knob.Value className="strip-value">
                    {formatValue(state.value, preset)}
                  </Knob.Value>
                </>
              )}
            </Knob.Root>
          </Variant>
        </section>
      </section>
    </main>
  );
}

interface PreviewKnobProps {
  accent: string;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  value: number;
  compact?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  onValueChange: (value: number) => void;
  onCommit?: (value: number) => void;
}

function PreviewKnob({
  accent,
  compact = false,
  disabled = false,
  label,
  max,
  min,
  onCommit,
  onValueChange,
  readOnly = false,
  step,
  unit,
  value,
}: PreviewKnobProps) {
  return (
    <Knob.Root
      className="knob"
      data-compact={compact ? "" : undefined}
      disabled={disabled}
      max={max}
      min={min}
      onValueChange={onValueChange}
      onValueCommit={onCommit}
      readOnly={readOnly}
      step={step}
      style={{ "--accent": accent } as CSSProperties}
      value={value}
    >
      <Knob.Control aria-label={label} className="knob-control">
        <Knob.Thumb className="knob-thumb" />
      </Knob.Control>
      <Knob.Value className="knob-value" format={(nextValue) => formatNumber(nextValue, unit)} />
      <Knob.HiddenInput name={label.toLowerCase().replaceAll(" ", "-")} />
    </Knob.Root>
  );
}

function Variant({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <article className="variant">
      <header>
        <h3>{title}</h3>
      </header>
      {children}
    </article>
  );
}

function formatValue(value: number, preset: KnobPreset) {
  return formatNumber(value, preset.unit);
}

function formatNumber(value: number, unit: string) {
  const roundedValue = Math.abs(value) >= 1000 ? Math.round(value) : value;
  return `${roundedValue.toLocaleString("en-US", { maximumFractionDigits: 1 })} ${unit}`;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
