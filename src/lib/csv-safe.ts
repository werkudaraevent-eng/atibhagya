/**
 * CSV injection (OWASP): a cell a visitor typed that starts with `=`, `+`,
 * `-`, `@`, a tab or a carriage return is run as a formula when the export
 * is opened in Excel or Sheets — `=HYPERLINK(...)` in a name field is enough.
 * Prefixing a single quote makes the spreadsheet show it as text. Only
 * strings are touched; numbers and dates keep their type.
 */
const FORMULA_START = /^[=+\-@\t\r]/

export const neutraliseFormula = (value: unknown): unknown =>
  typeof value === 'string' && FORMULA_START.test(value) ? `'${value}` : value

export const neutraliseFormulas = (rows: Record<string, unknown>[]) =>
  rows.map((row) =>
    Object.fromEntries(Object.entries(row).map(([key, value]) => [key, neutraliseFormula(value)])),
  )
