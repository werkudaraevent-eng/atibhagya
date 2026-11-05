import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { neutraliseFormula, neutraliseFormulas } from '@/lib/csv-safe'

describe('neutraliseFormula', () => {
  for (const attack of ['=HYPERLINK("http://x","y")', '+1+1', '-2+3', '@SUM(A1)', '\t=1', '\r=1']) {
    it(`quotes ${JSON.stringify(attack.slice(0, 12))}`, () => {
      assert.equal(neutraliseFormula(attack), `'${attack}`)
    })
  }

  it('leaves ordinary text, numbers and empty values alone', () => {
    assert.equal(neutraliseFormula('Ayu Lestari'), 'Ayu Lestari')
    assert.equal(neutraliseFormula('ayu@example.com'), 'ayu@example.com')
    assert.equal(neutraliseFormula(12), 12)
    assert.equal(neutraliseFormula(null), null)
  })

  it('cleans every cell of every row', () => {
    assert.deepEqual(neutraliseFormulas([{ name: '=cmd', pax: 4 }]), [{ name: "'=cmd", pax: 4 }])
  })
})
