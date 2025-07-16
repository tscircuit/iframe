import { useEffect, useRef, useState } from "react"

export interface TscircuitIframeProps {
  fsMap?: Record<string, string>
  entrypoint?: string
  code?: string
  height?: string | number

  showRunButton?: boolean

  /**
   * Called when rendering is finished
   */
  onRenderFinished?: (params: { circuitJson: any }) => void

  /**
   * Called when the initial render is finished (fast)
   */
  onInitialRender?: (params: { circuitJson: any }) => void

  /**
   * Called when rendering is started
   */
  onRenderStarted?: () => void
  /**
   * Called when an error occurs
   */
  onError?: (error: Error) => void

  /**
   * Called when an edit event occurs
   */
  onEditEvent?: (editEvent: any) => void

  /**
   * Optional project URL whose pathname will be used when
   * reporting autorouting bugs
   */
  projectUrl?: string
}

export const TscircuitIframe = (runFrameProps: TscircuitIframeProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  let additionalProps = {}

  if (runFrameProps.code) {
    additionalProps = {
      fsMap: {
        "index.tsx": runFrameProps.code,
      },
    }
  }

  if (runFrameProps.fsMap) {
    additionalProps = {
      fsMap: runFrameProps.fsMap,
      entrypoint: runFrameProps.entrypoint,
    }
  }

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.runframe_type === "runframe_ready_to_receive") {
        // Filter out functions from props to avoid DataCloneError
        const cloneableProps = Object.fromEntries(
          Object.entries({ ...runFrameProps, ...additionalProps }).filter(
            ([_, value]) => typeof value !== "function",
          ),
        )

        iframeRef.current?.contentWindow?.postMessage(
          {
            runframe_type: "runframe_props_changed",
            runframe_props: cloneableProps,
          },
          "*",
        )
        setIsLoading(false)
      }

      // Handle runframe events
      if (event.data?.runframe_type === "runframe_event") {
        const { type } = event.data.runframe_event

        if (type === "error") {
          runFrameProps.onError?.(
            new Error(event.data.runframe_event.error_message),
          )
        } else if (type === "render_finished") {
          runFrameProps.onRenderFinished?.(event.data.runframe_event)
        } else if (type === "initial_render") {
          runFrameProps.onInitialRender?.(event.data.runframe_event)
        } else if (type === "render_started") {
          runFrameProps.onRenderStarted?.()
        } else if (type === "edit_event") {
          runFrameProps.onEditEvent?.(event.data.runframe_event)
        }
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [runFrameProps])

  return (
    <div>
      {isLoading && (
        <div className="skeleton-container">
          <div>
            <div className="skeleton-header" />
            <div className="skeleton-body" />
          </div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src="https://runframe.tscircuit.com/iframe.html"
        title="tscircuit code runner and preview"
        frameBorder="0"
        scrolling="no"
        style={{
          overflow: "hidden",
          width: "100%",
          height: runFrameProps.height ?? 600,
          border: "none",
          padding: 0,
          margin: 0,
          boxSizing: "border-box",
          display: isLoading ? "none" : "block",
        }}
        onLoad={() => {
          // The iframe is loaded, but we'll only hide the skeleton
          // when we receive the "runframe_ready_to_receive" message
        }}
      />
    </div>
  )
}

export default TscircuitIframe
