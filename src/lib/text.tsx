import { Fragment } from 'react'

/**
 * Renders a string's line breaks as <br>. The design's copy is set line by
 * line — the breaks are typography, not markup, so editors keep control of
 * them from a plain textarea in Payload.
 */
export function Lines({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {line}
          {i < lines.length - 1 ? <br /> : null}
        </Fragment>
      ))}
    </>
  )
}
