import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { dict } from '@/lib/i18n/ui'
import type { FormField } from '@/lib/inquiry-fields'
import { emptyDraft, isVisible, validate, visibleFields, type InquiryDraft } from '@/lib/inquiries'

const errors = dict('en').inquiry.errors

const field = (over: Partial<FormField> & Pick<FormField, 'kind' | 'name'>): FormField => ({
  label: over.name,
  type: 'text',
  required: false,
  width: 'full',
  options: [],
  ...over,
})

const NAME = field({ kind: 'name', name: 'name', required: true })
const EMAIL = field({ kind: 'email', name: 'email', type: 'email', required: true })
const AUDIENCE = field({ kind: 'audience', name: 'audience', type: 'select' })
const ORG = field({
  kind: 'organisation',
  name: 'organisation',
  required: true,
  showWhen: { field: 'audience', values: ['group'] },
})
const FIELDS = [NAME, EMAIL, AUDIENCE, ORG]

const draft = (over: Partial<InquiryDraft> = {}): InquiryDraft => ({ ...emptyDraft, ...over })

describe('validate', () => {
  it('asks for every required field the visitor can see', () => {
    const found = validate(draft(), FIELDS, errors)
    assert.equal(found.name, errors.name)
    assert.equal(found.email, errors.email)
  })

  it('rejects an address without a domain', () => {
    const found = validate(draft({ name: 'Ayu', email: 'ayu@' }), FIELDS, errors)
    assert.equal(found.email, errors.emailInvalid)
  })

  it('accepts a complete private inquiry', () => {
    assert.deepEqual(validate(draft({ name: 'Ayu', email: 'ayu@example.com' }), FIELDS, errors), {})
  })

  it('does not require a field hidden by its rule', () => {
    const found = validate(draft({ name: 'Ayu', email: 'ayu@example.com' }), FIELDS, errors)
    assert.equal(found.organisation, undefined)
  })

  it('requires that field once its rule shows it', () => {
    const found = validate(
      draft({ name: 'Ayu', email: 'ayu@example.com', audience: 'group' }),
      FIELDS,
      errors,
    )
    assert.ok(found.organisation)
  })

  it('treats whitespace as empty', () => {
    const found = validate(draft({ name: '   ', email: 'ayu@example.com' }), FIELDS, errors)
    assert.equal(found.name, errors.name)
  })
})

describe('visibleFields', () => {
  it('drops a field whose trigger answer does not match', () => {
    assert.deepEqual(
      visibleFields(draft(), FIELDS).map((f) => f.name),
      ['name', 'email', 'audience'],
    )
  })

  it('ignores a rule pointing at a field that no longer exists', () => {
    const orphan = field({ kind: 'notes', name: 'notes', showWhen: { field: 'gone', values: ['x'] } })
    assert.equal(isVisible(orphan, draft(), [orphan]), true)
  })

  it('does not loop forever on two fields pointing at each other', () => {
    const a = field({ kind: 'custom', name: 'a', type: 'select', showWhen: { field: 'b', values: ['x'] } })
    const b = field({ kind: 'custom', name: 'b', type: 'select', showWhen: { field: 'a', values: ['x'] } })
    assert.doesNotThrow(() => visibleFields(draft(), [a, b]))
  })
})
