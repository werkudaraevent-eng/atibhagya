import type { CollectionSlug, DocumentViewServerProps, GlobalSlug } from 'payload'

import { Gutter, SetDocumentStepNav } from '@payloadcms/ui'
import { formatDate } from '@payloadcms/ui/shared'
import Link from 'next/link'
import { formatAdminURL } from 'payload/shared'

/**
 * The Versions tab, with a column Payload's own list lacks: who saved it.
 *
 * The built-in table is fixed at date, ID and status. This one reads the
 * `updatedBy` stamp each version carries (see src/lib/audit.ts) and lists
 * it beside the date, so "who changed this and when" is answered from the
 * list rather than by opening each version in turn. Everything else — the
 * links, the status pills, the paging — works as before.
 */

type Editor = { email?: string; name?: string } | number | string | null | undefined

type Row = {
  id: number | string
  updatedAt: string
  autosave?: boolean
  version?: {
    _status?: string
    updatedBy?: Editor
  }
}

const PER_PAGE = 20

/** The editor's name, else their address; nothing when the stamp is absent. */
const who = (value: Editor) => {
  if (!value || typeof value !== 'object') return null
  return value.name?.trim() || value.email || null
}

export async function VersionsView(props: DocumentViewServerProps) {
  const {
    initPageResult: { collectionConfig, docID, globalConfig, req },
    searchParams,
  } = props
  const { payload, i18n, user } = req
  const { config } = payload

  const page = Math.max(1, Number(searchParams?.page ?? 1) || 1)
  const snapshotFree = config.localization ? { snapshot: { not_equals: true } } : undefined

  const common = {
    depth: 1,
    limit: PER_PAGE,
    page,
    sort: '-updatedAt',
    req,
    user,
    overrideAccess: false,
  } as const

  const [list, published] = collectionConfig
    ? await Promise.all([
        payload.findVersions({
          ...common,
          collection: collectionConfig.slug as CollectionSlug,
          where: { and: [{ parent: { equals: docID } }, ...(snapshotFree ? [snapshotFree] : [])] },
        }),
        payload.findVersions({
          collection: collectionConfig.slug as CollectionSlug,
          where: {
            and: [
              { parent: { equals: docID } },
              { 'version._status': { equals: 'published' } },
              ...(snapshotFree ? [snapshotFree] : []),
            ],
          },
          depth: 0,
          limit: 1,
          sort: '-updatedAt',
          req,
          user,
          overrideAccess: false,
        }),
      ])
    : await Promise.all([
        payload.findGlobalVersions({
          ...common,
          slug: globalConfig!.slug as GlobalSlug,
          where: snapshotFree,
        }),
        payload.findGlobalVersions({
          slug: globalConfig!.slug as GlobalSlug,
          where: {
            and: [{ 'version._status': { equals: 'published' } }, ...(snapshotFree ? [snapshotFree] : [])],
          },
          depth: 0,
          limit: 1,
          sort: '-updatedAt',
          req,
          user,
          overrideAccess: false,
        }),
      ])

  const rows = list.docs as unknown as Row[]
  const currentlyPublishedId = (published.docs[0] as unknown as Row | undefined)?.id
  const hasDrafts = Boolean((collectionConfig ?? globalConfig)?.versions?.drafts)

  const adminRoute = config.routes.admin
  const hrefFor = (id: Row['id']) =>
    formatAdminURL({
      adminRoute,
      path: collectionConfig
        ? `/collections/${collectionConfig.slug}/${docID}/versions/${id}`
        : `/globals/${globalConfig!.slug}/versions/${id}`,
    })
  const pageHref = (n: number) =>
    formatAdminURL({
      adminRoute,
      path: collectionConfig
        ? `/collections/${collectionConfig.slug}/${docID}/versions?page=${n}`
        : `/globals/${globalConfig!.slug}/versions?page=${n}`,
    })

  const status = (row: Row) => {
    if (!hasDrafts) return null
    if (row.version?._status === 'published') {
      return row.id === currentlyPublishedId ? i18n.t('version:currentlyPublished') : i18n.t('version:previouslyPublished')
    }
    return i18n.t('version:draft')
  }

  const plural = collectionConfig?.labels?.plural
  const pluralLabel =
    typeof plural === 'function' ? plural({ i18n, t: i18n.t }) : (plural ?? globalConfig?.label)

  return (
    <>
      <SetDocumentStepNav
        collectionSlug={collectionConfig?.slug}
        globalSlug={globalConfig?.slug}
        id={docID}
        pluralLabel={pluralLabel}
        useAsTitle={collectionConfig?.admin?.useAsTitle || globalConfig?.slug}
        view={i18n.t('version:versions')}
      />
      <main className="versions">
        <Gutter className="versions__wrap">
          {rows.length === 0 ? (
            <div className="versions__no-versions">{i18n.t('version:noFurtherVersionsFound')}</div>
          ) : (
            <div className="table table--appearance-default">
              <table cellPadding="0" cellSpacing="0">
                <thead>
                  <tr>
                    <th>{i18n.t('general:updatedAt')}</th>
                    <th>Last edited by</th>
                    <th>{i18n.t('version:versionID')}</th>
                    {hasDrafts ? <th>{i18n.t('version:status')}</th> : null}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const editor = who(row.version?.updatedBy)
                    const label = status(row)
                    return (
                      <tr key={row.id}>
                        <td>
                          <Link href={hrefFor(row.id)} prefetch={false}>
                            {formatDate({ date: row.updatedAt, i18n, pattern: config.admin.dateFormat })}
                          </Link>
                        </td>
                        <td>{editor ?? <span style={{ opacity: 0.5 }}>—</span>}</td>
                        <td>{String(row.id)}</td>
                        {hasDrafts ? (
                          <td>
                            <div className="autosave-cell__items">
                              {row.autosave ? <span className="pill pill--style-light pill--size-small">{i18n.t('version:autosave')}</span> : null}
                              <span
                                className={
                                  row.id === currentlyPublishedId
                                    ? 'pill pill--style-success pill--size-small'
                                    : 'pill pill--style-light pill--size-small'
                                }
                              >
                                {label}
                              </span>
                            </div>
                          </td>
                        ) : null}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {list.totalPages > 1 ? (
            <div className="versions__page-controls" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              {list.hasPrevPage ? <Link href={pageHref(page - 1)}>‹ {i18n.t('general:previous')}</Link> : null}
              <span className="versions__page-info">
                {(page - 1) * PER_PAGE + 1}-{Math.min(page * PER_PAGE, list.totalDocs)} {i18n.t('general:of')} {list.totalDocs}
              </span>
              {list.hasNextPage ? <Link href={pageHref(page + 1)}>{i18n.t('general:next')} ›</Link> : null}
            </div>
          ) : null}
        </Gutter>
      </main>
    </>
  )
}
