import { useState } from "react";
import { XYPad } from "@ryhrm-gz/audio-ui-react";

export function XYPadBipolarExample() {
  const [value, setValue] = useState({ x: -0.4, y: 0.6 });

  return (
    <div className="audio-demo" data-variant="xypad">
      <span className="demo-label">Bipolar</span>
      <XYPad.Root
        className="demo-xypad"
        defaultValue={{ x: -0.4, y: 0.6 }}
        maxX={1}
        maxY={1}
        minX={-1}
        minY={-1}
        onValueChange={setValue}
        stepX={0.01}
        stepY={0.01}
        value={value}
      >
        <XYPad.Area className="demo-xypad-area">
          <span className="demo-xypad-crosshair" aria-hidden="true" />
          <XYPad.Thumb aria-label="Pan and width" className="demo-xypad-thumb" />
        </XYPad.Area>
        <XYPad.Value
          className="demo-readout"
          format={(nextValue) => `X ${nextValue.x} / Y ${nextValue.y}`}
        />
      </XYPad.Root>
    </div>
  );
}

export function XYPadCoarseStepsExample() {
  const [value, setValue] = useState({ x: 4, y: 12 });

  return (
    <div className="audio-demo" data-variant="xypad">
      <span className="demo-label">Coarse steps</span>
      <XYPad.Root
        className="demo-xypad"
        defaultValue={{ x: 4, y: 12 }}
        maxX={16}
        maxY={16}
        minX={0}
        minY={0}
        onValueChange={setValue}
        stepX={4}
        stepY={4}
        value={value}
      >
        <XYPad.Area className="demo-xypad-area">
          <span className="demo-xypad-crosshair" aria-hidden="true" />
          <XYPad.Thumb aria-label="Macro position" className="demo-xypad-thumb" />
        </XYPad.Area>
        <XYPad.Value
          className="demo-readout"
          format={(nextValue) => `X ${nextValue.x} / Y ${nextValue.y}`}
        />
      </XYPad.Root>
    </div>
  );
}

export function XYPadDisabledExample() {
  return (
    <div className="audio-demo" data-variant="xypad">
      <span className="demo-label">Disabled</span>
      <XYPad.Root
        className="demo-xypad"
        defaultValue={{ x: 50, y: 50 }}
        disabled
        maxX={100}
        maxY={100}
        minX={0}
        minY={0}
        stepX={1}
        stepY={1}
      >
        <XYPad.Area className="demo-xypad-area">
          <span className="demo-xypad-crosshair" aria-hidden="true" />
          <XYPad.Thumb aria-label="Locked pad" className="demo-xypad-thumb" />
        </XYPad.Area>
        <XYPad.Value
          className="demo-readout"
          format={(nextValue) => `X ${nextValue.x} / Y ${nextValue.y}`}
        />
      </XYPad.Root>
    </div>
  );
}
