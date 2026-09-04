/**
 * One-off: puts the small type sizes on the `--type-scale` token and lifts
 * their base a step. Run once; kept for the record of what was changed.
 *
 *   node scripts/scale-type.cjs
 *
 * Rewrites, in every site stylesheet (not the admin's):
 *   font: … 15px/1.9 …        →  font: … calc(15.5px * var(--type-scale))/1.9 …
 *   font-size: 12px;          →  font-size: calc(12.5px * var(--type-scale));
 * for sizes under 20px. Headlines (clamp) and large decorative sizes are
 * left alone. The base lift follows the table agreed with the client:
 * labels 10/10.5 → 11, nav 11 → 11.5, body 15 → 15.5, captions +0.5.
 */
const fs = require('fs')
const path = require('path')

const LIFT = {
  9: 10,
  9.5: 10.5,
  10: 11,
  10.5: 11,
  11: 11.5,
  12: 12.5,
  12.5: 13,
  13: 13.5,
  13.5: 14,
  14: 14.5,
  14.5: 15,
  15: 15.5,
  15.5: 16,
  16: 16.5,
  17: 17.5,
  18: 18.5,
}

const scaled = (px) => {
  const n = Number(px)
  if (!(n < 20)) return null
  const base = LIFT[n] ?? n
  return `calc(${base}px * var(--type-scale))`
}

const walk = (dir, out = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === '(payload)' || entry.name === 'node_modules') continue
      walk(p, out)
    } else if (entry.name.endsWith('.css')) out.push(p)
  }
  return out
}

let files = 0
let edits = 0
for (const file of walk(path.join(__dirname, '..', 'src'))) {
  const before = fs.readFileSync(file, 'utf8')
  let count = 0
  let after = before
    // font shorthand: "<weight> <size>px/<line-height>" — only plain px sizes.
    .replace(/(font:\s*[^;]*?)(\b\d+(?:\.\d+)?)px\//g, (m, head, px) => {
      const v = scaled(px)
      if (!v) return m
      count++
      return `${head}${v}/`
    })
    // standalone font-size
    .replace(/font-size:\s*(\d+(?:\.\d+)?)px;/g, (m, px) => {
      const v = scaled(px)
      if (!v) return m
      count++
      return `font-size: ${v};`
    })
  if (after !== before) {
    fs.writeFileSync(file, after)
    files++
    edits += count
    console.log(`${count.toString().padStart(3)}  ${path.relative(process.cwd(), file)}`)
  }
}
console.log(`\n${edits} sizes in ${files} files`)
