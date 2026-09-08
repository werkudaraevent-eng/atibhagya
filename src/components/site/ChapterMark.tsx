import styles from './ChapterMark.module.css'

/**
 * The chapter mark: the current chapter's number and name, set vertically
 * at the left edge of the screen.
 *
 * Empty in the markup. The motion system fills it from whichever
 * `[data-stage][data-chapter]` section is passing the middle of the screen,
 * fading it out, swapping the words after 450ms and fading it back — so a
 * chapter change reads as a turn of the page rather than a flicker. Hidden
 * outside chapters, on small screens, and from assistive technology (the
 * sections carry their own headings).
 */
export function ChapterMark() {
  return (
    <div className={styles.mark} data-role="chapter" aria-hidden="true">
      <span className={styles.number} data-role="chapterN" />
      <span className={styles.rule} />
      <span className={styles.title} data-role="chapterT" />
    </div>
  )
}
