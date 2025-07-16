import { useState } from "react"
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

export default function ExampleWithErrorTable() {
  const [errors, setErrors] = useState<string[]>([])

  const handleError = (error: any) => {
    const message = error?.message || String(error)
    setErrors((prev) => [...prev, message])
    // Optionally, you can still log to console if desired
    // console.log("Error caught:", error)
    // alert(`Error: ${message}`)
  }

  return (
    <div>
      <TscircuitIframe
        fsMap={fsMap}
        showRunButton={true}
        onError={handleError}
      />
      <div style={{ marginTop: 20 }}>
        <span
          style={{
            fontFamily: "sans-serif",
            marginBottom: 10,
            display: "block",
          }}
        >
          Example with error handling - contains invalid TSX that should trigger
          onError callback
        </span>
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            marginTop: 10,
            fontFamily: "monospace",
            background: "#fafbfc",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  background: "#f0f0f0",
                  textAlign: "left",
                }}
              >
                Errors Caught
              </th>
            </tr>
          </thead>
          <tbody>
            {errors.length === 0 ? (
              <tr>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    color: "#888",
                  }}
                >
                  No errors yet.
                </td>
              </tr>
            ) : (
              errors.map((err, idx) => (
                <tr key={idx}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {err}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <pre style={{ marginTop: 20 }}>
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
    // Add error to array and display in table
  }}
/>
          `}
        </pre>
      </div>
    </div>
  )
}
