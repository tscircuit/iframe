import { ShikiHighlighter } from "react-shiki"
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
    </board>
  )
}
  `,
}

const codeExample = `
interface EventRecord {
  timestamp: string
  eventType: string
  payload: string
}

const [events, setEvents] = useState<EventRecord[]>([])

const recordEvent = (eventType: string, data: any) => {
  const timestamp = new Date().toLocaleTimeString()
  const payload = JSON.stringify(data, null, 2)
  setEvents(prev => [...prev, { timestamp, eventType, payload }])
}

<TscircuitIframe 
  fsMap={fsMap} 
  showRunButton={true}
  onRenderStarted={() => recordEvent("render_started", {})}
  onInitialRender={(data) => recordEvent("initial_render", data)}
  onRenderFinished={(data) => recordEvent("render_finished", data)}
  onError={(error) => recordEvent("error", { message: error.message })}
  onEditEvent={(data) => recordEvent("edit_event", data)}
/>
`

interface EventRecord {
  timestamp: string
  eventType: string
  payload: string
}

export default function ExampleWithEvents() {
  const [events, setEvents] = useState<EventRecord[]>([])

  const recordEvent = (eventType: string, data: any) => {
    const timestamp = new Date().toLocaleTimeString()
    const payload = JSON.stringify(data, null, 2)
    setEvents(prev => [...prev, { timestamp, eventType, payload }])
  }

  const clearEvents = () => {
    setEvents([])
  }

  return (
    <div>
      <TscircuitIframe
        fsMap={fsMap}
        showRunButton={true}
        onRenderStarted={() => recordEvent("render_started", {})}
        onInitialRender={(data) => recordEvent("initial_render", data)}
        onRenderFinished={(data) => recordEvent("render_finished", data)}
        onError={(error) => recordEvent("error", { message: error.message })}
        onEditEvent={(data) => recordEvent("edit_event", data)}
      />
      <div style={{ marginTop: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <span
            style={{
              fontFamily: "sans-serif",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Events Log ({events.length} events)
          </span>
          <button
            onClick={clearEvents}
            style={{
              padding: "4px 8px",
              fontSize: 12,
              background: "#f0f0f0",
              border: "1px solid #ccc",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        </div>
        <div style={{ maxHeight: 300, overflow: "auto", border: "1px solid #ddd" }}>
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
              fontFamily: "monospace",
              fontSize: 12,
            }}
          >
            <thead>
              <tr style={{ background: "#f0f0f0" }}>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                    width: "120px",
                  }}
                >
                  Timestamp
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                    width: "150px",
                  }}
                >
                  Event Type
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                  }}
                >
                  Payload
                </th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "center",
                      color: "#888",
                    }}
                  >
                    No events recorded yet. Click "Run" to trigger events.
                  </td>
                </tr>
              ) : (
                events.map((event, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        verticalAlign: "top",
                      }}
                    >
                      {event.timestamp}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        verticalAlign: "top",
                        fontWeight: "bold",
                        color: event.eventType === "error" ? "#d73a49" : "#0366d6",
                      }}
                    >
                      {event.eventType}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        verticalAlign: "top",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        maxWidth: "400px",
                      }}
                    >
                      {event.payload}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 20 }}>
          <span
            style={{
              fontFamily: "sans-serif",
              marginBottom: 10,
              display: "block",
            }}
          >
            Example with event recording - shows all events emitted by TscircuitIframe
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
    </div>
  )
}