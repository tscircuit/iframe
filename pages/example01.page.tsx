import { ShikiHighlighter } from "react-shiki"
import TscircuitIframe from "../lib/TscircuitIframe"

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
}
  `,
}

const codeExample = `
const fsMap = {
  "index.ts": \`
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
}\`
}

<TscircuitIframe fsMap={fsMap} />
`

export default () => (
  <div>
    <TscircuitIframe fsMap={fsMap} />
    <div>
      <span style={{ fontFamily: "sans-serif", marginTop: 10 }}>
        Example usage:
      </span>
      <div style={{ marginTop: 12, border: "1px solid #ddd" }}>
        <ShikiHighlighter
          language="tsx"
          theme="github-light"
          style={{ borderRadius: 6, fontSize: 14 }}
        >
          {codeExample}
        </ShikiHighlighter>
      </div>
    </div>
  </div>
)
