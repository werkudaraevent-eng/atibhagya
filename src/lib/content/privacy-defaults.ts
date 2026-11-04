import type { Locale } from './types'

/**
 * The privacy policy as first written, in both languages: the seed, the
 * fallback for an empty CMS field, and what the admin shows in each box.
 *
 * It describes what the code actually does — what the inquiry form keeps,
 * who processes it, and when it is deleted. `{email}` becomes the contact
 * address from Site settings and `{months}` the retention period set on the
 * policy itself, so the text cannot drift from either. Have it read by
 * counsel before publishing; it is a draft, not legal advice.
 */
export type PrivacySection = { heading: string; body: string }

export type PrivacyContent = {
  meta: { title: string; description: string }
  eyebrow: string
  headline: string
  lede: string
  /** `YYYY-MM-DD`, shown as "Last updated". */
  updated: string
  sections: PrivacySection[]
  /** Months after which an inquiry is deleted. Not localised. */
  retentionMonths: number
}

export const DEFAULT_RETENTION_MONTHS = 24

const en: PrivacyContent = {
  meta: {
    title: 'Privacy policy',
    description: 'How Atibhagya handles the details you share through the inquiry form.',
  },
  eyebrow: 'Your data',
  headline: 'Privacy policy',
  lede: 'What we keep when you write to us, why, for how long, and how to have it removed.',
  updated: '2026-11-04',
  retentionMonths: DEFAULT_RETENTION_MONTHS,
  sections: [
    {
      heading: 'Who we are',
      body: 'Atibhagya is a wellness experience brand of Werkudara Group, based in Indonesia. We decide how the personal data described here is used and are responsible for it. You can reach us at {email}.',
    },
    {
      heading: 'What we collect',
      body: 'Only what you write in the inquiry form: your name and email address and, if you choose to give them, your phone or WhatsApp number, company or community, group size, preferred place and month, the experiences you are interested in, and your notes. We use no advertising or analytics cookies. Your browser remembers your light or dark theme and an unsent draft of the form; that stays on your device.',
    },
    {
      heading: 'Why we use it',
      body: 'To reply to your inquiry and plan the experience you asked about, at your request. We do not sell your data, share it for anyone else’s marketing, or send you marketing.',
    },
    {
      heading: 'Who can see it',
      body: 'Only the members of our team who handle inquiries. Service providers process it on our behalf: Vercel (hosting), Neon (database), Cloudflare (file storage and spam protection) and our email provider (notifications). Some of them store data outside Indonesia.',
    },
    {
      heading: 'How long we keep it',
      body: 'Each inquiry is deleted automatically {months} months after it arrives. Encrypted backups of the database are kept for a limited period and then deleted.',
    },
    {
      heading: 'Your rights',
      body: 'Under Indonesia’s Personal Data Protection Law (UU PDP No. 27/2022) you may ask to see, correct or delete your data, withdraw your consent, or object to how it is used. Write to {email} and we will act on it.',
    },
    {
      heading: 'Changes',
      body: 'When this policy changes, the date at the top changes with it.',
    },
  ],
}

const id: PrivacyContent = {
  meta: {
    title: 'Kebijakan privasi',
    description: 'Cara Atibhagya memperlakukan data yang Anda kirim melalui formulir pertanyaan.',
  },
  eyebrow: 'Data Anda',
  headline: 'Kebijakan privasi',
  lede: 'Apa yang kami simpan saat Anda menghubungi kami, untuk apa, berapa lama, dan cara menghapusnya.',
  updated: '2026-11-04',
  retentionMonths: DEFAULT_RETENTION_MONTHS,
  sections: [
    {
      heading: 'Siapa kami',
      body: 'Atibhagya adalah merek pengalaman wellness milik Werkudara Group yang berbasis di Indonesia. Kami menentukan dan bertanggung jawab atas penggunaan data pribadi yang dijelaskan di sini. Hubungi kami di {email}.',
    },
    {
      heading: 'Data yang kami kumpulkan',
      body: 'Hanya yang Anda tulis di formulir pertanyaan: nama dan alamat email, serta bila Anda memilih mengisinya, nomor telepon atau WhatsApp, perusahaan atau komunitas, jumlah peserta, tempat dan bulan yang diinginkan, pengalaman yang Anda minati, dan catatan Anda. Kami tidak memakai cookie iklan maupun analitik. Peramban Anda mengingat tema terang atau gelap dan draf formulir yang belum terkirim; keduanya tetap di perangkat Anda.',
    },
    {
      heading: 'Untuk apa kami memakainya',
      body: 'Untuk membalas pertanyaan Anda dan merencanakan pengalaman yang Anda minta, atas permintaan Anda. Kami tidak menjual data Anda, tidak membagikannya untuk pemasaran pihak lain, dan tidak mengirimi Anda materi pemasaran.',
    },
    {
      heading: 'Siapa yang dapat melihatnya',
      body: 'Hanya anggota tim kami yang menangani pertanyaan. Penyedia layanan memprosesnya atas nama kami: Vercel (hosting), Neon (basis data), Cloudflare (penyimpanan berkas dan perlindungan spam), dan penyedia email kami (notifikasi). Sebagian dari mereka menyimpan data di luar Indonesia.',
    },
    {
      heading: 'Berapa lama kami menyimpannya',
      body: 'Setiap pertanyaan dihapus otomatis {months} bulan setelah diterima. Cadangan basis data yang terenkripsi disimpan dalam jangka waktu terbatas lalu dihapus.',
    },
    {
      heading: 'Hak Anda',
      body: 'Berdasarkan Undang-Undang Pelindungan Data Pribadi (UU PDP No. 27/2022), Anda dapat meminta untuk melihat, memperbaiki, atau menghapus data Anda, menarik persetujuan, atau keberatan atas penggunaannya. Tulis ke {email} dan kami akan menindaklanjutinya.',
    },
    {
      heading: 'Perubahan',
      body: 'Bila kebijakan ini berubah, tanggal di bagian atas ikut berubah.',
    },
  ],
}

export const privacyDefaults = (locale: Locale): PrivacyContent => (locale === 'id' ? id : en)

/** Fills `{email}` and `{months}` into a paragraph of the policy. */
export const fillPrivacyTokens = (text: string, values: { email: string; months: number }) =>
  text.replaceAll('{email}', values.email).replaceAll('{months}', String(values.months))
