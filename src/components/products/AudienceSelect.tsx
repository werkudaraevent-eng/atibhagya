'use client'

import { useSelect } from 'downshift'
import { useId } from 'react'

import styles from './AudienceSelect.module.css'

type Option = { value: string; label: string }

type Props = {
  /** The small word before the control, e.g. "For". */
  label: string
  options: Option[]
  value: string
  onChange: (value: string) => void
}

/**
 * "For · anyone ▾" on the catalogue: the browser's own dropdown cannot be
 * styled, and in dark mode it opened as a white box with ivory text — so
 * the list is drawn here, in the page's own ink and paper, with Downshift
 * handling the keyboard and screen-reader side.
 */
export function AudienceSelect({ label, options, value, onChange }: Props) {
  const id = useId()
  const current = options.find((o) => o.value === value) ?? options[0]

  const { isOpen, highlightedIndex, getToggleButtonProps, getLabelProps, getMenuProps, getItemProps } =
    useSelect<Option>({
      id,
      items: options,
      itemToString: (o) => o?.label ?? '',
      selectedItem: current ?? null,
      onSelectedItemChange: ({ selectedItem }) => onChange(selectedItem?.value ?? ''),
    })

  return (
    <div className={styles.root}>
      <span className={styles.label} {...getLabelProps()}>
        {label}
      </span>
      <button type="button" className={styles.button} {...getToggleButtonProps()}>
        {current?.label ?? ''}
        <span className={styles.chevron} aria-hidden="true" />
      </button>

      <ul className={isOpen ? `${styles.menu} ${styles.menuOpen}` : styles.menu} {...getMenuProps()}>
        {isOpen
          ? options.map((item, index) => (
              <li
                key={item.value}
                className={[
                  styles.item,
                  index === highlightedIndex ? styles.itemActive : '',
                  item.value === value ? styles.itemChosen : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                {...getItemProps({ item, index })}
              >
                {item.label}
              </li>
            ))
          : null}
      </ul>
    </div>
  )
}
