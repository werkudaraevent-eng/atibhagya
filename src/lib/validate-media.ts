import type { Validate } from 'payload'

/** Formats the image pipeline (Sharp, `next/image`) can actually render. */
export const WEB_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

/**
 * Refuses to save a document that points at a media file the site cannot
 * show.
 *
 * The `media` collection already turns away BMP and TIFF at upload, but a
 * file uploaded before that rule existed is still selectable, and a document
 * that references it would publish cleanly and then render an empty panel.
 * This check runs on the referencing field, so the editor is told at the
 * moment they press Publish, with the file named.
 */
/** A short, silent loop the browser can play inline: MP4 (H.264) or WebM. */
export const VIDEO_TYPES = ['video/mp4', 'video/webm']

/** The hero video is optional, but if it is set it has to be a video. */
export const videoFile: Validate = async (value, { req }) => {
  if (value === null || value === undefined || value === '') return true
  const id =
    typeof value === 'object' && value !== null && 'id' in value
      ? (value as { id: string | number }).id
      : (value as string | number)
  try {
    const media = (await req.payload.findByID({ collection: 'media', id, depth: 0 })) as {
      mimeType?: string | null
      filename?: string | null
      filesize?: number | null
    }
    const type = media.mimeType ?? ''
    if (!VIDEO_TYPES.includes(type)) {
      return `"${media.filename ?? id}" is ${type || 'not a video'}. The hero video must be an MP4 (H.264) or WebM file.`
    }
    const mb = (media.filesize ?? 0) / 1_048_576
    if (mb > 12) {
      return `"${media.filename}" is ${mb.toFixed(1)} MB. Keep the hero video under 12 MB — export at 1920×1080, 10–15 seconds, around 4 Mbps, no audio track.`
    }
    return true
  } catch {
    return true
  }
}

/** A programme or brochure: PDF only, and a size a phone will download. */
export const pdfFile: Validate = async (value, { req }) => {
  if (value === null || value === undefined || value === '') return true
  const id =
    typeof value === 'object' && value !== null && 'id' in value
      ? (value as { id: string | number }).id
      : (value as string | number)
  try {
    const media = (await req.payload.findByID({ collection: 'media', id, depth: 0 })) as {
      mimeType?: string | null
      filename?: string | null
      filesize?: number | null
    }
    if ((media.mimeType ?? '') !== 'application/pdf') {
      return `"${media.filename ?? id}" is not a PDF.`
    }
    const mb = (media.filesize ?? 0) / 1_048_576
    if (mb > 20) {
      return `"${media.filename}" is ${mb.toFixed(1)} MB. Keep a programme under 20 MB — export it for screen, with images at 150 dpi.`
    }
    return true
  } catch {
    return true
  }
}

export const webImage: Validate = async (value, { req }) => {
  if (value === null || value === undefined || value === '') return true

  const id =
    typeof value === 'object' && value !== null && 'id' in value
      ? (value as { id: string | number }).id
      : (value as string | number)

  try {
    const media = (await req.payload.findByID({
      collection: 'media',
      id,
      depth: 0,
    })) as { mimeType?: string | null; filename?: string | null }

    const type = media.mimeType ?? ''
    if (type.startsWith('video/')) return true
    if (WEB_IMAGE_TYPES.includes(type)) return true

    return `"${media.filename ?? id}" is ${type || 'an unknown type'}, which the site cannot display. Export it as JPEG, PNG or WebP and upload that instead.`
  } catch {
    // A missing file is caught by the relationship itself.
    return true
  }
}
