import { NotFoundBody } from '@/components/site/NotFoundBody'

export const metadata = {
  title: 'Not found · Atibhagya',
}

/** The site-wide 404, inside the site's own document, in the reader's language. */
export default function NotFound() {
  return <NotFoundBody />
}
