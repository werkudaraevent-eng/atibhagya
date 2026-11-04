import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import type { PayloadRequest } from 'payload'

import { Inquiries } from '@/collections/Inquiries'
import { Products } from '@/collections/Products'
import { Users } from '@/collections/Users'
import { canEditContent, canHandleInquiries, isAdmin } from '@/lib/access'

const admin = { id: 1, roles: ['admin'] }
const editor = { id: 2, roles: ['editor'] }
const sales = { id: 3, roles: ['sales'] }
const editorAndSales = { id: 4, roles: ['editor', 'sales'] }

/** Runs one access function as `user` (null = a visitor). */
const can = async (fn: unknown, user: unknown) => {
  const access = fn as (args: { req: PayloadRequest }) => unknown
  return access({ req: { user } as unknown as PayloadRequest })
}

describe('role helpers', () => {
  it('admins do everything', () => {
    assert.equal(isAdmin(admin), true)
    assert.equal(canEditContent(admin), true)
    assert.equal(canHandleInquiries(admin), true)
  })

  it('editors write content but do not see inquiries', () => {
    assert.equal(canEditContent(editor), true)
    assert.equal(canHandleInquiries(editor), false)
  })

  it('sales see inquiries but do not write content', () => {
    assert.equal(canHandleInquiries(sales), true)
    assert.equal(canEditContent(sales), false)
  })

  it('roles add up', () => {
    assert.equal(canEditContent(editorAndSales), true)
    assert.equal(canHandleInquiries(editorAndSales), true)
  })

  it('a visitor or a malformed user has no role', () => {
    for (const user of [null, undefined, {}, { roles: 'admin' }]) {
      assert.equal(isAdmin(user), false)
      assert.equal(canHandleInquiries(user), false)
    }
  })
})

describe('inquiries access', () => {
  const { access } = Inquiries

  it('nobody creates through the API, not even an admin', async () => {
    assert.equal(await can(access?.create, null), false)
    assert.equal(await can(access?.create, admin), false)
  })

  it('visitors and editors cannot read', async () => {
    assert.equal(await can(access?.read, null), false)
    assert.equal(await can(access?.read, editor), false)
  })

  it('sales and admins can read and update', async () => {
    for (const user of [sales, admin]) {
      assert.equal(await can(access?.read, user), true)
      assert.equal(await can(access?.update, user), true)
    }
  })

  it('only an admin deletes', async () => {
    assert.equal(await can(access?.delete, sales), false)
    assert.equal(await can(access?.delete, admin), true)
  })
})

describe('content access', () => {
  it('sales cannot change a product', async () => {
    assert.equal(await can(Products.access?.update, sales), false)
    assert.equal(await can(Products.access?.update, editor), true)
  })
})

describe('users access', () => {
  it('only an admin creates accounts', async () => {
    assert.equal(await can(Users.access?.create, editor), false)
    assert.equal(await can(Users.access?.create, admin), true)
  })

  it('a non-admin may update only themselves', async () => {
    assert.deepEqual(await can(Users.access?.update, editor), { id: { equals: 2 } })
  })
})
