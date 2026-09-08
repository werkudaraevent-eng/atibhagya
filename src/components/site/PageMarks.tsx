import { ChapterMark } from './ChapterMark'
import { PathIndicator, type Stage } from './PathIndicator'

/**
 * The two fixed marks every page carries: the path indicator at the
 * bottom right and the chapter mark at the left edge. The page declares its
 * stages here, in the same order as its `[data-stage]` sections, ending in
 * the footer's "Enquiries" — the same last stop on every page.
 */
export function PageMarks({ stages, label }: { stages: Stage[]; label: string }) {
  return (
    <>
      <PathIndicator stages={stages} label={label} />
      <ChapterMark />
    </>
  )
}
