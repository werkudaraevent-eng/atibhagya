'use client'

import { useEffect, useRef, useState } from 'react'

import { submitInquiry } from '@/app/[locale]/inquiry/actions'
import page from '@/components/site/Page.module.css'
import type { Locale, SiteContent } from '@/lib/content/types'
import type { Dict } from '@/lib/i18n/ui'
import {
  DRAFT_STORAGE_KEY,
  emptyDraft,
  missingAnswers,
  validate,
  type FieldErrors,
  type InquiryDraft,
} from '@/lib/inquiries'
import styles from './InquiryForm.module.css'

export type Choice = { slug: string; title: string }

type Props = {
  locale: Locale
  dict: Dict
  site: SiteContent
  products: Choice[]
  journeys: Choice[]
  /** Prefill carried by the CTA from a product or journey page. */
  initialProducts?: string[]
  initialJourneys?: string[]
  onDone?: () => void
}

export function InquiryForm({
  locale,
  dict,
  site,
  products,
  journeys,
  initialProducts = [],
  initialJourneys = [],
  onDone,
}: Props) {
  const t = dict.inquiry
  const [draft, setDraft] = useState<InquiryDraft>({
    ...emptyDraft,
    productSlugs: initialProducts,
    journeySlugs: initialJourneys,
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [answerErrors, setAnswerErrors] = useState<string[]>([])
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [custom, setCustom] = useState('')
  const trapRef = useRef<HTMLInputElement>(null)
  const doneRef = useRef<HTMLHeadingElement>(null)
  const skipFirstSave = useRef(true)

  // Restore a draft, but never let it overwrite the prefill the CTA carried.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(DRAFT_STORAGE_KEY)
      if (!stored) return
      const saved = JSON.parse(stored) as InquiryDraft
      setDraft((current) => ({
        ...emptyDraft,
        ...saved,
        productSlugs: [...new Set([...initialProducts, ...(saved.productSlugs ?? [])])],
        journeySlugs: [...new Set([...initialJourneys, ...(saved.journeySlugs ?? [])])],
        ...(current.productSlugs.length ? {} : {}),
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
      window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft))
    } catch {
      // Private browsing, quota — the form still works without a saved draft.
    }
  }, [draft, done])

  useEffect(() => {
    if (done) doneRef.current?.focus()
  }, [done])

  const set = <K extends keyof InquiryDraft>(key: K, value: InquiryDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const addProduct = (slug: string) => {
    if (!slug || draft.productSlugs.includes(slug)) return
    set('productSlugs', [...draft.productSlugs, slug])
  }

  const addJourney = (slug: string) => {
    if (!slug || draft.journeySlugs.includes(slug)) return
    set('journeySlugs', [...draft.journeySlugs, slug])
  }

  const addCustom = () => {
    const label = custom.trim()
    if (!label || draft.customActivities.includes(label)) return
    set('customActivities', [...draft.customActivities, label])
    setCustom('')
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (submitting) return

    const found = validate(draft, t.errors)
    const missing = missingAnswers(draft, t.questions)
    if (Object.keys(found).length > 0 || missing.length > 0) {
      setErrors(found)
      setAnswerErrors(missing)
      return
    }
    setAnswerErrors([])

    setSubmitting(true)
    setFormError(null)
    const result = await submitInquiry(locale, draft, trapRef.current?.value ?? '')
    setSubmitting(false)

    if (result.ok) {
      try {
        window.localStorage.removeItem(DRAFT_STORAGE_KEY)
      } catch {
        // Nothing to clean up.
      }
      setDone(true)
      return
    }

    setFormError(result.error)
  }

  if (done) {
    return (
      <div className={styles.done}>
        <div className={styles.doneMark} aria-hidden="true">
          &ldquo;
        </div>
        <h2 className={styles.doneHeading} tabIndex={-1} ref={doneRef}>
          {t.doneHeading}
        </h2>
        <p className={styles.doneBody}>{t.doneBody.replace('{time}', site.responseTime)}</p>
        <p className={styles.doneContact}>
          {t.doneContact} <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
        <div className={styles.doneRule} />
        {onDone ? (
          <button type="button" className={styles.doneBack} onClick={onDone}>
            {t.doneBack}
          </button>
        ) : null}
      </div>
    )
  }

  const chips = [
    ...draft.productSlugs.map((slug) => ({
      key: `p:${slug}`,
      label: products.find((p) => p.slug === slug)?.title ?? slug,
      remove: () => set('productSlugs', draft.productSlugs.filter((s) => s !== slug)),
    })),
    ...draft.journeySlugs.map((slug) => ({
      key: `j:${slug}`,
      label: journeys.find((j) => j.slug === slug)?.title ?? slug,
      remove: () => set('journeySlugs', draft.journeySlugs.filter((s) => s !== slug)),
    })),
    ...draft.customActivities.map((label) => ({
      key: `c:${label}`,
      label,
      remove: () => set('customActivities', draft.customActivities.filter((l) => l !== label)),
    })),
  ]

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
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

      <div className={styles.grid}>
        <label className={styles.field}>
          <span className={styles.label}>{t.name}</span>
          <input
            className={styles.input}
            type="text"
            autoComplete="name"
            value={draft.name}
            onChange={(e) => set('name', e.target.value)}
            aria-invalid={errors.name ? true : undefined}
            required
          />
          {errors.name ? (
            <span className={styles.error} role="alert">
              {errors.name}
            </span>
          ) : null}
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t.email}</span>
          <input
            className={styles.input}
            type="email"
            autoComplete="email"
            value={draft.email}
            onChange={(e) => set('email', e.target.value)}
            aria-invalid={errors.email ? true : undefined}
            required
          />
          {errors.email ? (
            <span className={styles.error} role="alert">
              {errors.email}
            </span>
          ) : null}
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t.phone}</span>
          <input
            className={styles.input}
            type="tel"
            autoComplete="tel"
            value={draft.phone}
            onChange={(e) => set('phone', e.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t.audience}</span>
          <select
            className={styles.select}
            value={draft.audience}
            onChange={(e) => set('audience', e.target.value)}
          >
            {t.audienceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t.organisation}</span>
          <input
            className={styles.input}
            type="text"
            autoComplete="organization"
            value={draft.organisation}
            onChange={(e) => set('organisation', e.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t.pax}</span>
          <input
            className={styles.input}
            type="text"
            value={draft.pax}
            onChange={(e) => set('pax', e.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t.location}</span>
          <input
            className={styles.input}
            type="text"
            value={draft.preferredLocation}
            onChange={(e) => set('preferredLocation', e.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t.date}</span>
          <input
            className={styles.input}
            type="month"
            value={draft.preferredDate}
            onChange={(e) => set('preferredDate', e.target.value)}
          />
        </label>

        <label className={`${styles.field} ${styles.wide}`}>
          <span className={styles.label}>{t.goal}</span>
          <textarea
            className={styles.textarea}
            rows={4}
            value={draft.goal}
            onChange={(e) => set('goal', e.target.value)}
            aria-invalid={errors.goal ? true : undefined}
            required
          />
          {errors.goal ? (
            <span className={styles.error} role="alert">
              {errors.goal}
            </span>
          ) : null}
        </label>

        <label className={`${styles.field} ${styles.wide}`}>
          <span className={styles.label}>{t.notes}</span>
          <textarea
            className={styles.textarea}
            rows={3}
            value={draft.notes}
            onChange={(e) => set('notes', e.target.value)}
          />
        </label>

        {/* Questions the team added in the CMS. */}
        {t.questions.map((question) => {
          const value = draft.answers[question.name] ?? ''
          const invalid = answerErrors.includes(question.name)
          const setAnswer = (next: string) => {
            setDraft((current) => ({
              ...current,
              answers: { ...current.answers, [question.name]: next },
            }))
            setAnswerErrors((current) => current.filter((n) => n !== question.name))
          }

          return (
            <label
              key={question.name}
              className={
                question.width === 'half' ? styles.field : `${styles.field} ${styles.wide}`
              }
            >
              <span className={styles.label}>{question.label}</span>

              {question.type === 'textarea' ? (
                <textarea
                  className={styles.textarea}
                  rows={3}
                  value={value}
                  placeholder={question.placeholder}
                  aria-invalid={invalid || undefined}
                  onChange={(e) => setAnswer(e.target.value)}
                />
              ) : question.type === 'select' ? (
                <select
                  className={styles.select}
                  value={value}
                  aria-invalid={invalid || undefined}
                  onChange={(e) => setAnswer(e.target.value)}
                >
                  <option value="" />
                  {question.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : question.type === 'checkbox' ? (
                <span className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={value === 'yes'}
                    onChange={(e) => setAnswer(e.target.checked ? 'yes' : '')}
                  />
                  <span>{question.placeholder ?? ''}</span>
                </span>
              ) : (
                <input
                  className={styles.input}
                  type={question.type}
                  value={value}
                  placeholder={question.placeholder}
                  aria-invalid={invalid || undefined}
                  onChange={(e) => setAnswer(e.target.value)}
                />
              )}

              {question.help ? <span className={styles.hint}>{question.help}</span> : null}
              {invalid ? (
                <span className={styles.error} role="alert">
                  {dict.inquiry.errors.required}
                </span>
              ) : null}
            </label>
          )
        })}

        <fieldset className={styles.activities}>
          <legend className={styles.label}>{t.interested}</legend>
          <p className={styles.hint}>{t.interestedHint}</p>

          {chips.length ? (
            <div className={styles.chips}>
              {chips.map((chip) => (
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
              ))}
            </div>
          ) : null}

          <div className={styles.adders}>
            <label className={styles.adder}>
              <span className={styles.label}>{dict.nav.products}</span>
              <select
                className={styles.select}
                value=""
                onChange={(e) => addProduct(e.target.value)}
              >
                <option value="" />
                {products
                  .filter((p) => !draft.productSlugs.includes(p.slug))
                  .map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.title}
                    </option>
                  ))}
              </select>
            </label>

            <label className={styles.adder}>
              <span className={styles.label}>{dict.nav.journeys}</span>
              <select
                className={styles.select}
                value=""
                onChange={(e) => addJourney(e.target.value)}
              >
                <option value="" />
                {journeys
                  .filter((j) => !draft.journeySlugs.includes(j.slug))
                  .map((j) => (
                    <option key={j.slug} value={j.slug}>
                      {j.title}
                    </option>
                  ))}
              </select>
            </label>

            <label className={styles.adder}>
              <span className={styles.label}>{t.addCustom}</span>
              <input
                className={styles.input}
                type="text"
                placeholder={t.customPlaceholder}
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addCustom()
                  }
                }}
              />
            </label>

            <button type="button" className={styles.addButton} onClick={addCustom}>
              {t.addCustom}
            </button>
          </div>
        </fieldset>
      </div>

      {formError ? (
        <p className={`${styles.error} ${styles.formError}`} role="alert">
          {formError}
        </p>
      ) : null}

      <div className={styles.actions}>
        <button
          type="submit"
          className={`${page.buttonPrimary} ${styles.submit}`}
          disabled={submitting}
        >
          {submitting ? t.sending : t.submit}
        </button>
      </div>
    </form>
  )
}
