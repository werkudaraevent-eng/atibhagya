import styles from './CatalogueIndex.module.css'

/**
 * Rendered once per catalogue page. `Motion` writes the number of
 * whichever row is passing the middle of the screen into it, and fades it out
 * when the catalogue is not in view.
 */
export function CatalogueIndex() {
  return <span className={styles.marker} data-index-marker aria-hidden="true" />
}
