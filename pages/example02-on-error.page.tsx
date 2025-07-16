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
      
      {/* This will cause an error - invalid JSX */}
      <invalidComponent missingClosing="true"
        <nested>
          <malformed syntax />
        </nested>
      />
    </board>
  )
}
  `,
}

export default () => (
  <div>
    <TscircuitIframe
      fsMap={fsMap}
      showRunButton={true}
      onError={(error) => {
        console.log("Error caught:", error)
        alert(`Error: ${error.message || error}`)
      }}
    />
    <div>
      <span style={{ fontFamily: "sans-serif", marginTop: 10 }}>
        Example with error handling - contains invalid TSX that should trigger
        onError callback
      </span>
      <pre>
        {`
const fsMap = {
  "index.ts": \`
// ... valid code ...
      
{/* This will cause an error - invalid JSX */}
<invalidComponent missingClosing="true"
  <nested>
    <malformed syntax />
  </nested>
/>
\`
}

<TscircuitIframe 
  fsMap={fsMap} 
  showRunButton={true}
  onError={(error) => {
    console.log("Error caught:", error)
    alert(\`Error: \${error.message || error}\`)
  }}
/>
        `}
      </pre>
    </div>
  </div>
)
