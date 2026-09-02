'use client'

import { useSelect } from 'downshift'
import { useId } from 'react'

import styles from './TokenSelect.module.css'
import type { TokenOption } from './TokenSelect'

type Props = {
  label: string
  options: TokenOption[]
  value: string
  onChange: (value: string) => void
  /** Shown while nothing is chosen; omit when a choice is always made. */
  placeholder?: string
  required?: boolean
  invalid?: boolean
}

/**
 * A single choice from a short list. The browser's own dropdown cannot be
 * styled — it opens in the operating system's blue — so the list is drawn
 * here, in the same panel as the searchable fields, with Downshift handling
 * the keyboard and screen-reader side.
 */
export function ChoiceSelect({
  label,
  options,
  value,
  onChange,
  placeholder,
  required,
  invalid,
}: Props) {
  const id = useId()
  const current = options.find((o) => o.value === value) ?? null

  const {
    isOpen,
    highlightedIndex,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getItemProps,
  } = useSelect<TokenOption>({
    id,
    items: options,
    itemToString: (o) => o?.label ?? '',
    selectedItem: current,
    onSelectedItemChange: ({ selectedItem }) => onChange(selectedItem?.value ?? ''),
  })

  return (
    <div className={styles.root}>
      <label className={styles.label} {...getLabelProps()}>
        {label}
        {required ? (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        ) : null}
      </label>

      <button
        type="button"
        className={[styles.button, isOpen ? styles.open : '', invalid ? styles.invalid : '']
          .filter(Boolean)
          .join(' ')}
        aria-invalid={invalid || undefined}
        aria-required={required || undefined}
        {...getToggleButtonProps()}
      >
        {current ? (
          <span>{current.label}</span>
        ) : (
          <span className={styles.placeholder}>{placeholder ?? ''}</span>
        )}
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
