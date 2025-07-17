# @tscircuit/iframe

Run [tscircuit code](https://github.com/tscircuit/tscircuit) or [Circuit JSON](https://github.com/tscircuit/circuit-json) inside an iframe. Extremely lightweight wrapper around the [tscircuit runframe iframe](https://github.com/tscircuit/runframe)

[Online Playground](https://example-iframe.tscircuit.com)

<img width="4052" height="2122" alt="image" src="https://github.com/user-attachments/assets/104a396d-8763-4bcd-bb4a-33efe8d7ad2a" />

## Installation

```
bun add @tscircuit/iframe
# npm add @tscircuit/iframe
```

## Usage

```tsx
import { TscircuitIframe } from "@tscircuit/iframe"

const fsMap = {
  "index.ts": `
import { PushButton } from "@tsci/seveibar.push-button"
import { SmdUsbC } from "@tsci/seveibar.smd-usb-c"

export default () => {
  return (
    <board width="12mm" height="30mm">
      <SmdUsbC
        connections={{
          GND1: "net.GND",
          GND2: "net.GND",
          VBUS1: "net.VBUS",
          VBUS2: "net.VBUS",
        }}
        pcbY={-10}
        schX={-4}
      />
      <led
        name="LED"
        supplierPartNumbers={{
          jlcpcb: ["965799"],
        }}
        color="red"
        footprint="0603"
        pcbY={12}
        schY={2}
      />
      <PushButton
        name="SW1"
        pcbY={0}
        connections={{ pin2: ".R1 > .pos", pin3: "net.VBUS" }}
        schY={-2}
      />
      <resistor name="R1" footprint="0603" resistance="1k" pcbY={7} />

      <trace from=".R1 > .neg" to=".LED .pos" />
      <trace from=".LED .neg" to="net.GND" />
    </board>
  )
}`,
}

export default () => <TscircuitIframe fsMap={fsMap} />
```

## API

### `<TscircuitIframe />`

| Prop | Type | Description |
| --- | --- | --- |
| `fsMap` | `Record<string, string>` | Map of filenames to file contents that will be executed in the iframe. |
| `entrypoint` | `string` | Name of the entry file within `fsMap`. |
| `code` | `string` | Convenience prop to run a single file. Equivalent to providing `fsMap` with `index.tsx`. |
| `height` | `string \| number` | Height of the iframe. Defaults to `600`. |
| `showRunButton` | `boolean` | Whether to display a run button inside the iframe. |
| `onRenderFinished` | `(params: { circuitJson: any }) => void` | Called when rendering completes. |
| `onInitialRender` | `(params: { circuitJson: any }) => void` | Called after the initial, fast render. |
| `onRenderStarted` | `() => void` | Called when rendering begins. |
| `onError` | `(error: Error) => void` | Called when an error occurs while running or rendering code. |
| `onEditEvent` | `(editEvent: any) => void` | Called when the user performs an edit action. |
| `projectUrl` | `string` | Optional project URL used when reporting autorouting issues. |
