/**
 * The two scripts inlined into <head>, run before first paint.
 *
 * Plain strings in a plain module — deliberately not exported from the
 * client components that use their keys. A value exported from a
 * `'use client'` file and read in a server component is not the value but a
 * client reference: interpolated into the page it rendered as
 * `function(){throw Error("Attempted to call THEME_SCRIPT() from the
 * server…")}`, which is what the browser then tried to run.
 */

export const THEME_KEY = 'atibhagya:theme'

/** The remembered theme, or the system's, set on <html> before anything paints. */
export const THEME_SCRIPT = `(function(){try{var k='${THEME_KEY}';var s=localStorage.getItem(k);var d=s?s==='dark':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.dataset.theme=d?'dark':'light'}catch(e){}})()`

/** <html lang> from the URL, as the document is parsed. */
export const LANG_SCRIPT = `(function(){var p=location.pathname;document.documentElement.lang=(p==='/id'||p.indexOf('/id/')===0)?'id':'en'})()`
