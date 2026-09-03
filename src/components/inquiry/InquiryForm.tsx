'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

import { submitInquiry } from '@/app/(site)/[locale]/inquiry/actions'
import page from '@/components/site/Page.module.css'
import type { Locale, SiteContent } from '@/lib/content/types'
import type { Dict } from '@/lib/i18n/ui'
import { TEXT_KINDS, type FormField, type PickSource } from '@/lib/inquiry-fields'
import {
  DRAFT_KEY,
  DRAFT_STORAGE_KEY,
  PICK_KEY,
  emptyDraft,
  readField,
  validate,
  visibleFields,
  type FieldErrors,
  type InquiryDraft,
} from '@/lib/inquiries'
import styles from './InquiryForm.module.css'
import { ChoiceSelect } from './ChoiceSelect'
import { TokenSelect } from './TokenSelect'
import { Turnstile, turnstileSiteKey } from './Turnstile'

/**
 * The draft lives in `sessionStorage`: it survives closing the dialog and
 * coming back, and is gone when the tab closes — a name, an address and a
 * phone number should not wait indefinitely on a shared computer.
 */
const store = () => window.sessionStorage

export type Choice = { slug: string; title: string }

/** "Products you are interested in" → "Products": the recap keys stay short. */
const shortKey = (label: string) => label.split(/\s+you\s|\syang\s/i)[0].trim()

/** The lists on the site a "choose from the site" field can draw on. */
export type Choices = Record<PickSource, Choice[]>

type Props = {
  locale: Locale
  dict: Dict
  site: SiteContent
  choices: Choices
  /** Prefill carried by the CTA from a product or journey page. */
  initialProducts?: string[]
  initialJourneys?: string[]
  onDone?: () => void
  /**
   * The invitation above the form — eyebrow, headline, lede. It belongs to
   * the form, so it leaves with the form once the inquiry has been sent and
   * the thank-you stands alone.
   */
  heading?: ReactNode
  /** Wraps the form and the thank-you alike, e.g. the page's narrow column. */
  frameClassName?: string
  /** Extra room above the thank-you where the heading used to be. */
  doneClassName?: string
}

/**
 * The inquiry form, rendered from the field list the team built in the CMS.
 * Text kinds write to their own key on the draft; picks hold slugs from one
 * of the site's lists; ideas are the visitor's own words; custom questions
 * are answered by name.
 */
export function InquiryForm({
  locale,
  dict,
  site,
  choices,
  initialProducts = [],
  initialJourneys = [],
  onDone,
  heading,
  frameClassName,
  doneClassName,
}: Props) {
  const t = dict.inquiry
  const [draft, setDraft] = useState<InquiryDraft>({
    ...emptyDraft,
    productSlugs: initialProducts,
    journeySlugs: initialJourneys,
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [idea, setIdea] = useState('')
  const [token, setToken] = useState('')
  const trapRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const doneRef = useRef<HTMLHeadingElement>(null)
  const skipFirstSave = useRef(true)

  // Restore a draft, but never let it overwrite the prefill the CTA carried.
  useEffect(() => {
    try {
      const stored = store().getItem(DRAFT_STORAGE_KEY)
      if (!stored) return
      const saved = JSON.parse(stored) as Partial<InquiryDraft>
      setDraft(() => ({
        ...emptyDraft,
        ...saved,
        productSlugs: [...new Set([...initialProducts, ...(saved.productSlugs ?? [])])],
        journeySlugs: [...new Set([...initialJourneys, ...(saved.journeySlugs ?? [])])],
      }))
    } catch {
      // A corrupt draft is not worth interrupting anyone over.
    }
    // Runs once; the prefill props are fixed for the life of the form.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (skipFirstSave.current) {
      skipFirstSave.current = false
      return
    }
    if (done) return
    try {
      store().setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft))
    } catch {
      // Private browsing, quota — the form still works without a saved draft.
    }
  }, [draft, done])

  useEffect(() => {
    if (done) doneRef.current?.focus()
  }, [done])

  // The private/group choices come from the CMS. If the draft (or the default)
  // names one that no longer exists, fall to the first real choice rather than
  // send a value the team has removed.
  const audienceField = t.fields.find((f) => f.kind === 'audience')
  const audienceChoices = audienceField?.options.length
    ? audienceField.options
    : t.audienceOptions
  useEffect(() => {
    if (!audienceField) return
    if (audienceChoices.some((o) => o.value === draft.audience)) return
    const first = audienceChoices[0]?.value ?? ''
    setDraft((current) => ({ ...current, audience: first }))
  }, [audienceField, audienceChoices, draft.audience])

  const clearError = (name: string) =>
    setErrors((current) => ({ ...current, [name]: undefined }))

  const set = <K extends keyof InquiryDraft>(key: K, value: InquiryDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  /** Writes a text field's value to wherever that kind lives on the draft. */
  const write = (field: FormField, value: string) => {
    if (field.kind === 'custom') {
      setDraft((current) => ({
        ...current,
        answers: { ...current.answers, [field.name]: value },
      }))
    } else if (field.kind !== 'pick' && field.kind !== 'ideas') {
      set(DRAFT_KEY[field.kind], value)
    }
    clearError(field.name)
  }

  const addIdea = () => {
    const label = idea.trim()
    if (!label || draft.customActivities.includes(label)) return
    set('customActivities', [...draft.customActivities, label])
    setIdea('')
    clearError('ideas')
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (submitting) return

    const found = validate(draft, t.fields, t.errors)
    if (Object.keys(found).length > 0) {
      setErrors(found)
      // Take the reader to the first thing that needs attention, rather
      // than leaving them at the button wondering why nothing happened.
      requestAnimationFrame(() => {
        const flagged = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')
        if (!flagged) return
        // The ideas row flags its frame, not a control; focus the input inside.
        const control = flagged.matches('input, textarea, select, button, [tabindex]')
          ? flagged
          : flagged.querySelector<HTMLElement>('input, textarea, button')
        control?.focus()
      })
      return
    }

    setSubmitting(true)
    setFormError(null)
    const result = await submitInquiry(locale, draft, trapRef.current?.value ?? '', token)
    setSubmitting(false)

    if (result.ok) {
      try {
        store().removeItem(DRAFT_STORAGE_KEY)
      } catch {
        // Nothing to clean up.
      }
      setDone(true)
      return
    }

    setFormError(result.error)
  }

  if (done) {
    // What they asked for, read back: the picks by title, and the month.
    const titles = (source: PickSource, slugs: string[]) =>
      slugs.map((s) => choices[source]?.find((c) => c.slug === s)?.title ?? s)
    const recap: { key: string; value: string }[] = [
      { key: t.products, value: titles('products', draft.productSlugs).join(', ') },
      { key: t.journeys, value: titles('journeys', draft.journeySlugs).join(', ') },
      { key: t.categories, value: titles('categories', draft.categorySlugs).join(', ') },
      { key: t.ideas, value: draft.customActivities.join(', ') },
      { key: t.date, value: draft.preferredDate },
    ].filter((row) => row.value)

    return (
      <div className={doneClassName}>
        <div className={frameClassName}>
          <div className={`${styles.done} ${styles.appear}`}>
            <div className={styles.doneEyebrow}>{t.doneEyebrow}</div>
            <h2 className={styles.doneHeading} id="inquiry-title" tabIndex={-1} ref={doneRef}>
              {t.doneHeading}
            </h2>
            <p className={styles.doneBody}>{t.doneBody.replace('{time}', site.responseTime)}</p>

            {recap.length ? (
              <dl className={styles.doneRecap}>
                {recap.map((row) => (
                  <div key={row.key} className={styles.doneRecapRow}>
                    <dt className={styles.doneRecapKey}>{shortKey(row.key)}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            <p className={styles.doneContact}>
              {t.doneContact} <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
            {onDone ? (
              <button type="button" className={styles.doneBack} onClick={onDone}>
                {t.doneBack}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    )
  }

  const renderError = (name: string) =>
    errors[name] ? (
      <span className={styles.error} role="alert">
        {errors[name]}
      </span>
    ) : null

  /** The chosen items, drawn inside the field's own line. */
  const renderChips = (items: { key: string; label: string; remove: () => void }[]) =>
    items.map((chip) => (
      <span key={chip.key} className={styles.chip}>
        {chip.label}
        <button
          type="button"
          className={styles.chipRemove}
          onClick={chip.remove}
          aria-label={`${t.remove}: ${chip.label}`}
        >
          ×
        </button>
      </span>
    ))

  // A field with a rule only mounts once its trigger allows it, so its
  // mount is the moment to ease it in rather than have it snap into place.
  const widthClass = (field: FormField) =>
    [styles.field, field.width === 'full' ? styles.wide : '', field.showWhen ? styles.appear : '']
      .filter(Boolean)
      .join(' ')

  const shown = visibleFields(draft, t.fields)

  /** The label, with a quiet gold mark when the field must be filled. */
  const renderLabel = (field: FormField) => (
    <span className={styles.label}>
      {field.label}
      {field.required ? (
        <span className={styles.required} aria-hidden="true">
          *
        </span>
      ) : null}
    </span>
  )

  const anyRequired = shown.some((f) => f.required)

  const tokenLabels = {
    removeLabel: t.remove,
    emptyLabel: t.noMatch,
    moreLabel: t.moreChips,
    fewerLabel: t.fewerChips,
  }

  /**
   * A field fed by one of the site's lists: a searchable combobox, with the
   * choices as chips inside it when several are allowed.
   */
  const renderPick = (field: FormField) => {
    const source = field.source ?? 'products'
    const key = PICK_KEY[source]

    return (
      <div key={field.name} className={widthClass(field)}>
        <TokenSelect
          label={field.label}
          options={(choices[source] ?? []).map((c) => ({ value: c.slug, label: c.title }))}
          selected={draft[key]}
          multiple={field.multiple !== false}
          required={field.required}
          invalid={Boolean(errors[field.name])}
          placeholder={field.placeholder ?? t.typeToSearch}
          onChange={(values) => {
            set(key, values)
            clearError(field.name)
          }}
          {...tokenLabels}
        />
        {field.help ? <span className={styles.hint}>{field.help}</span> : null}
        {renderError(field.name)}
      </div>
    )
  }

  /** Free text, as many entries as the visitor likes. */
  const renderIdeas = (field: FormField) => (
    <div key={field.name} className={widthClass(field)}>
      {renderLabel(field)}

      <div className={styles.tokens} aria-invalid={errors[field.name] ? true : undefined}>
        {renderChips(
          draft.customActivities.map((label) => ({
            key: label,
            label,
            remove: () => set('customActivities', draft.customActivities.filter((l) => l !== label)),
          })),
        )}
        <input
          className={styles.input}
          type="text"
          name="idea"
          placeholder={field.placeholder ?? t.ideasPlaceholder}
          value={idea}
          aria-label={field.label}
          onChange={(e) => setIdea(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addIdea()
            }
          }}
        />
        <button type="button" className={styles.addButton} onClick={addIdea}>
          {t.addIdea}
        </button>
      </div>

      {field.help ? <span className={styles.hint}>{field.help}</span> : null}
      {renderError(field.name)}
    </div>
  )

  /** A custom "choose several": the picked values live in one answer, comma-joined. */
  const renderMultiselect = (field: FormField) => (
    <div key={field.name} className={widthClass(field)}>
      <TokenSelect
        label={field.label}
        options={field.options}
        selected={readField(draft, field).split(', ').filter(Boolean)}
        required={field.required}
        invalid={Boolean(errors[field.name])}
        placeholder={field.placeholder ?? t.typeToSearch}
        onChange={(values) => write(field, values.join(', '))}
        {...tokenLabels}
      />
      {field.help ? <span className={styles.hint}>{field.help}</span> : null}
      {renderError(field.name)}
    </div>
  )

  /**
   * One choice from a short list — the private/group field, or a custom
   * "choose one". The private/group field has no empty choice: it is a
   * preference, and the first choice is the honest default. A custom one
   * starts blank.
   */
  const renderChoice = (field: FormField) => (
    <div key={field.name} className={widthClass(field)}>
      <ChoiceSelect
        label={field.label}
        options={field.kind === 'audience' ? audienceChoices : field.options}
        value={readField(draft, field)}
        required={field.required}
        invalid={Boolean(errors[field.name])}
        placeholder={field.kind === 'audience' ? undefined : (field.placeholder ?? '—')}
        onChange={(value) => write(field, value)}
      />
      {field.help ? <span className={styles.hint}>{field.help}</span> : null}
      {renderError(field.name)}
    </div>
  )

  const renderField = (field: FormField) => {
    if (field.kind === 'pick') return renderPick(field)
    if (field.kind === 'ideas') return renderIdeas(field)
    if (field.type === 'multiselect') return renderMultiselect(field)
    if (field.type === 'select') return renderChoice(field)

    const value = readField(draft, field)
    const invalid = errors[field.name] ? true : undefined
    const autoComplete = field.kind === 'custom' ? undefined : TEXT_KINDS[field.kind].autoComplete

    return (
      <label key={field.name} className={widthClass(field)}>
        {renderLabel(field)}

        {field.type === 'textarea' ? (
          <textarea
            className={styles.textarea}
            name={field.name}
            rows={field.kind === 'goal' ? 4 : 3}
            value={value}
            placeholder={field.placeholder}
            aria-invalid={invalid}
            aria-required={field.required || undefined}
            onChange={(e) => write(field, e.target.value)}
          />
        ) : field.type === 'checkbox' ? (
          <span className={styles.checkbox}>
            <input
              type="checkbox"
              name={field.name}
              checked={value === 'yes'}
              aria-invalid={invalid}
              onChange={(e) => write(field, e.target.checked ? 'yes' : '')}
            />
            <span>{field.placeholder ?? ''}</span>
          </span>
        ) : (
          <input
            className={styles.input}
            type={field.type}
            name={field.name}
            autoComplete={autoComplete}
            value={value}
            placeholder={field.placeholder}
            aria-invalid={invalid}
            aria-required={field.required || undefined}
            onChange={(e) => write(field, e.target.value)}
          />
        )}

        {field.help ? <span className={styles.hint}>{field.help}</span> : null}
        {renderError(field.name)}
      </label>
    )
  }

  return (
    <>
      {/* On its own, as a single child: an element handed in from a server
          component and placed straight into a list of siblings draws React's
          missing-key warning, though nothing is actually a list. */}
      {heading ? <div>{heading}</div> : null}
      <div className={frameClassName}>
    <form ref={formRef} className={styles.form} onSubmit={onSubmit} noValidate>
      {/* Off-screen rather than display:none — plenty of bots skip hidden
          fields but fill anything they can read. */}
      <input
        ref={trapRef}
        type="text"
        name="website"
        className={styles.trap}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {anyRequired ? (
        <p className={styles.requiredNote}>
          <span className={styles.required} aria-hidden="true">
            *
          </span>{' '}
          {t.requiredNote}
        </p>
      ) : null}

      <div className={styles.grid}>{shown.map(renderField)}</div>

      {formError ? (
        <p className={`${styles.error} ${styles.formError}`} role="alert">
          {formError}
        </p>
      ) : null}

      {/* Invisible unless Cloudflare has a question; a box appears here if so. */}
      {turnstileSiteKey ? (
        <div className={styles.verify}>
          <Turnstile siteKey={turnstileSiteKey} onToken={setToken} />
        </div>
      ) : null}

      <div className={styles.actions}>
        <button
          type="submit"
          className={`${page.buttonPrimary} ${styles.submit}`}
          disabled={submitting}
        >
          {submitting ? t.sending : t.submit}
        </button>
        {t.privacyNote ? <p className={styles.privacy}>{t.privacyNote}</p> : null}
      </div>
    </form>
      </div>
    </>
  )
}
