import type { Metadata } from 'next'

import { ProductListScreen } from '@/components/products/ProductListScreen'
import type { Locale } from '@/lib/content/types'
import { dict } from '@/lib/i18n/ui'

export const revalidate = 300

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = dict(locale as Locale)

  return {
    title: `${t.nav.products} · Atibhagya`,
    description: t.products.intro,
    alternates: {
      canonical: locale === 'id' ? '/id/product' : '/product',
      languages: { en: '/product', id: '/id/product' },
    },
  }
}

export default async function ProductListPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return <ProductListScreen locale={locale as Locale} />
}
