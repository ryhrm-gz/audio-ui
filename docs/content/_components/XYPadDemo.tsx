import { useState } from "react";
import { XYPad } from "@ryhrm-gz/audio-ui-react";

export function XYPadDemo() {
  const [value, setValue] = useState({ x: 20, y: 70 });

  return (
    <div className="audio-demo" data-variant="xypad">
      <span className="demo-label">Filter position</span>
      <XYPad.Root
        className="demo-xypad"
        defaultValue={{ x: 20, y: 70 }}
        maxX={100}
        maxY={100}
        minX={0}
        minY={0}
        onValueChange={setValue}
        stepX={1}
        stepY={1}
        value={value}
      >
        <XYPad.Area className="demo-xypad-area">
          <span className="demo-xypad-crosshair" aria-hidden="true" />
          <XYPad.Thumb aria-label="Filter position" className="demo-xypad-thumb" />
        </XYPad.Area>
        <XYPad.Value
          className="demo-readout"
          format={(nextValue) => `X ${nextValue.x} / Y ${nextValue.y}`}
        />
      </XYPad.Root>
    </div>
  );
}
