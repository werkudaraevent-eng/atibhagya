'use client'

import { useCombobox, useMultipleSelection } from 'downshift'
import { useId, useMemo, useState } from 'react'

import styles from './TokenSelect.module.css'

export type TokenOption = { value: string; label: string }

type Props = {
  label: string
  options: TokenOption[]
  /** The chosen values, in order. One at most when `multiple` is off. */
  selected: string[]
  onChange: (values: string[]) => void
  multiple?: boolean
  placeholder?: string
  required?: boolean
  invalid?: boolean
  /** Accessible name of a chip's remove control, e.g. "Remove". */
  removeLabel: string
  /** "No match" — shown when the typed text matches nothing. */
  emptyLabel: string
  /** "+{n} more" — the collapsed-chips control. */
  moreLabel: string
  /** "Show fewer" — its counterpart. */
  fewerLabel: string
}

/** Chips shown before the rest collapse behind "+n more". */
const VISIBLE = 4

const fold = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')

/**
 * A combobox with tokens: what has been chosen sits inside the field as
 * chips, the cursor sits right after them, and typing filters the list —
 * which is what makes seventy-three products pickable. Downshift supplies
 * the keyboard and screen-reader behaviour; the look is the form's own.
 */
export function TokenSelect({
  label,
  options,
  selected,
  onChange,
  multiple = true,
  placeholder,
  required,
  invalid,
  removeLabel,
  emptyLabel,
  moreLabel,
  fewerLabel,
}: Props) {
  const id = useId()
  const [input, setInput] = useState('')
  const [expanded, setExpanded] = useState(false)

  const byValue = useMemo(() => new Map(options.map((o) => [o.value, o])), [options])
  const chosen = useMemo(
    () => selected.map((v) => byValue.get(v) ?? { value: v, label: v }),
    [selected, byValue],
  )

  const candidates = useMemo(() => {
    const needle = fold(input.trim())
    return options.filter(
      (o) => (!multiple || !selected.includes(o.value)) && (!needle || fold(o.label).includes(needle)),
    )
  }, [options, selected, input, multiple])

  const { getSelectedItemProps, getDropdownProps, removeSelectedItem } =
    useMultipleSelection<TokenOption>({
      selectedItems: multiple ? chosen : [],
      onSelectedItemsChange: ({ selectedItems }) => onChange((selectedItems ?? []).map((o) => o.value)),
    })

  const single = !multiple ? (chosen[0] ?? null) : null

  const {
    isOpen,
    highlightedIndex,
    getInputProps,
    getItemProps,
    getMenuProps,
    getToggleButtonProps,
    getLabelProps,
  } = useCombobox<TokenOption>({
    id,
    items: candidates,
    inputValue: input,
    itemToString: (o) => o?.label ?? '',
    selectedItem: single,
    // Keep the field open and the text clear after a pick, so several can
    // be chosen in a row without reopening.
    stateReducer: (_state, { changes, type }) => {
      if (
        type === useCombobox.stateChangeTypes.InputKeyDownEnter ||
        type === useCombobox.stateChangeTypes.ItemClick
      ) {
        return { ...changes, isOpen: multiple, highlightedIndex: 0, inputValue: '' }
      }
      return changes
    },
    onInputValueChange: ({ inputValue, type }) => {
      // Downshift fills the input with the single choice's label on blur;
      // the label is shown as a chip already, so keep the input as typed.
      if (type === useCombobox.stateChangeTypes.InputBlur) return
      setInput(inputValue ?? '')
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (!selectedItem) return
      if (multiple) onChange([...selected.filter((v) => v !== selectedItem.value), selectedItem.value])
      else onChange([selectedItem.value])
    },
  })

  const collapsed = multiple && !expanded && chosen.length > VISIBLE
  const shown = collapsed ? chosen.slice(0, VISIBLE - 1) : chosen
  const hidden = chosen.length - shown.length

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

      <div
        className={[styles.field, isOpen ? styles.open : '', invalid ? styles.invalid : '']
          .filter(Boolean)
          .join(' ')}
      >
        {shown.map((item, index) => (
          <span
            key={item.value}
            className={styles.chip}
            title={item.label}
            {...(multiple ? getSelectedItemProps({ selectedItem: item, index }) : {})}
          >
            <span className={styles.chipText}>{item.label}</span>
            <button
              type="button"
              className={styles.chipRemove}
              aria-label={`${removeLabel}: ${item.label}`}
              onClick={(e) => {
                e.stopPropagation()
                if (multiple) removeSelectedItem(item)
                else onChange([])
              }}
            >
              ×
            </button>
          </span>
        ))}

        {collapsed ? (
          <button type="button" className={styles.more} onClick={() => setExpanded(true)}>
            {moreLabel.replace('{n}', String(hidden))}
          </button>
        ) : null}
        {multiple && expanded && chosen.length > VISIBLE ? (
          <button type="button" className={styles.more} onClick={() => setExpanded(false)}>
            {fewerLabel}
          </button>
        ) : null}

        <input
          className={styles.input}
          placeholder={chosen.length ? '' : placeholder}
          aria-invalid={invalid || undefined}
          aria-required={required || undefined}
          {...getInputProps(multiple ? getDropdownProps({ preventKeyAction: isOpen }) : {})}
        />

        <button
          type="button"
          className={styles.toggle}
          aria-label={label}
          {...getToggleButtonProps()}
        />
      </div>

      <ul className={isOpen ? `${styles.menu} ${styles.menuOpen}` : styles.menu} {...getMenuProps()}>
        {isOpen
          ? candidates.length === 0
            ? (
                <li className={styles.empty}>{emptyLabel}</li>
              )
            : candidates.map((item, index) => (
                <li
                  key={item.value}
                  className={
                    index === highlightedIndex ? `${styles.item} ${styles.itemActive}` : styles.item
                  }
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
