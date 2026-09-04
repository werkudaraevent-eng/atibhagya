import type { Locale, SiteContent } from '../content/types'
import type { Element } from '../elements'
import { defaultFields, type FormField, type LabelKey } from '../inquiry-fields'

export type Dict = {
  nav: { products: string; journeys: string; about: string; inquiry: string }
  menu: string
  close: string
  languageLabel: string
  skipToContent: string
  /** Accessible name of the breadcrumb landmark. */
  youAreHere: string
  /** Accessible name of the path indicator. */
  yourPath: string
  /** The light/dark switch: what pressing it will do. */
  theme: { toDark: string; toLight: string }
  readMore: string
  footer: { enquiries: string; explore: string; social: string }
  products: {
    eyebrow: string
    headline: string
    intro: string
    all: string
    empty: string
    /** Templates with {shown}/{total} and {n} placeholders. */
    showing: string
    loadMore: string
    remaining: string
    filterCategory: string
    forLabel: string
    anyone: string
    /** The five elements, as the second filter and a mark on each product. */
    elementLabel: string
    anyElement: string
    elements: Record<Element, string>
    searchPlaceholder: string
    clear: string
    reset: string
    related: string
    detailEyebrow: string
    /** The detail page's main chapter, on the path indicator and chapter mark. */
    experience: string
    whatToExpect: string
    duration: string
    venue: string
    suitableFor: string
    element: string
    facilities: string
    facilitator: string
    inquire: string
    suitable: Record<string, string>
  }
  journeys: {
    eyebrow: string
    headline: string
    intro: string
    detailEyebrow: string
    /** The detail page's main chapter, on the path indicator and chapter mark. */
    itinerary: string
    day: string
    overview: string
    duration: string
    facilities: string
    inclusion: string
    exclusion: string
    pax: string
    location: string
    inquire: string
    empty: string
  }
  inquiry: {
    metaTitle: string
    metaDescription: string
    eyebrow: string
    headline: string
    lede: string
    name: string
    email: string
    phone: string
    audience: string
    audienceOptions: { value: string; label: string }[]
    organisation: string
    pax: string
    location: string
    date: string
    goal: string
    notes: string
    /** Default labels of the pick fields, by source. */
    products: string
    journeys: string
    categories: string
    ideas: string
    ideasPlaceholder: string
    addIdea: string
    /** The line above the form explaining the required mark. */
    requiredNote: string
    /** Token fields: typed text that matches nothing, and the collapsed chips. */
    noMatch: string
    moreChips: string
    fewerChips: string
    typeToSearch: string
    remove: string
    submit: string
    sending: string
    /** Under the submit button: what happens to what the visitor writes. */
    privacyNote: string
    error: string
    errors: {
      name: string
      email: string
      emailInvalid: string
      goal: string
      required: string
      /** Too many submissions from one address in a short time. */
      tooMany: string
      /** The bot check did not pass, or its token had expired. */
      verify: string
    }
    /** The small word above the thank-you, e.g. "Received". */
    doneEyebrow: string
    doneHeading: string
    /** Template with a {time} placeholder — a plain string so the dictionary can cross into a client component. */
    doneBody: string
    doneContact: string
    doneBack: string
    /**
     * The form itself, in order. The CMS replaces this list; the labels above
     * are the approved wording each built-in falls back to.
     */
    fields: FormField[]
  }
}

/** The built-in labels, and the default form assembled from them. */
const inquiryFields = (labels: Record<LabelKey, string>) => ({
  ...labels,
  fields: defaultFields(labels),
})

const en: Dict = {
  nav: { products: 'Product', journeys: 'Journey', about: 'About', inquiry: 'Inquiry' },
  menu: 'Menu',
  close: 'Close',
  languageLabel: 'Language',
  skipToContent: 'Skip to content',
  youAreHere: 'You are here',
  yourPath: 'Where you are on the page',
  theme: { toDark: 'Switch to dark mode', toLight: 'Switch to light mode' },
  readMore: 'Read more',
  footer: { enquiries: 'Enquiries', explore: 'Explore', social: 'Social' },
  products: {
    eyebrow: 'The catalogue',
    headline: 'Explore practices\nfor body, mind, and connection.',
    intro: 'Experiences can stand alone or be combined into a complete journey.',
    all: 'All',
    empty: 'Nothing in this category yet.',
    showing: '{shown} of {total}',
    loadMore: 'Load more',
    remaining: '{n} more to explore',
    filterCategory: 'Category',
    forLabel: 'For',
    anyone: 'Anyone',
    elementLabel: 'Element',
    anyElement: 'Any',
    elements: { earth: 'Earth', water: 'Water', fire: 'Fire', air: 'Air', ether: 'Space' },
    searchPlaceholder: 'Search',
    clear: 'Clear search',
    reset: 'Clear filters',
    related: 'Related experiences',
    detailEyebrow: 'Product',
    experience: 'The experience',
    whatToExpect: 'What to expect',
    duration: 'Duration',
    venue: 'Venue',
    suitableFor: 'Suitable for',
    element: 'Element',
    facilities: 'Facilities',
    facilitator: 'Facilitator',
    inquire: 'Inquire this experience',
    suitable: {
      solo: 'Solo',
      group: 'Group',
      corporate: 'Corporate',
      couple: 'Couple',
      community: 'Community',
    },
  },
  journeys: {
    eyebrow: 'Journeys',
    headline: 'Wellness as a\njourney, not a menu.',
    intro: 'Curated multi-day or multi-stop experiences.',
    detailEyebrow: 'Journey',
    itinerary: 'Itinerary',
    day: 'Day',
    overview: 'Journey overview',
    duration: 'Duration',
    facilities: 'Facilities',
    inclusion: 'Inclusion',
    exclusion: 'Exclusion',
    pax: 'Suggested pax',
    location: 'Location preference',
    inquire: 'Inquire this journey',
    empty: 'Journeys are being prepared.',
  },
  inquiry: {
    metaTitle: 'Inquiry · Atibhagya',
    metaDescription: 'A few details help us shape the right wellness experience.',
    eyebrow: 'Start a conversation',
    headline: 'Tell us what you need.',
    lede: 'A few details help us shape the right wellness experience.',
    ...inquiryFields({
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      audience: 'Private / group',
      organisation: 'Company / community',
      pax: 'Participants / pax',
      location: 'Preferred location',
      date: 'Date',
      goal: 'Goal of activity',
      notes: 'Notes',
      products: 'Products you are interested in',
      journeys: 'Journeys you are interested in',
      categories: 'Categories you are interested in',
      ideas: 'Anything else you have in mind',
    }),
    audienceOptions: [
      { value: 'private', label: 'Private' },
      { value: 'group', label: 'Group' },
      { value: 'corporate', label: 'Corporate' },
    ],
    ideasPlaceholder: 'Write your own, then add it',
    addIdea: '+ Add',
    requiredNote: 'Required',
    noMatch: 'Nothing matches that',
    moreChips: '+{n} more',
    fewerChips: 'Show fewer',
    typeToSearch: 'Type to search…',
    remove: 'Remove',
    submit: 'Submit inquiry',
    sending: 'Sending…',
    privacyNote:
      'What you write here is used only to reply to you and plan your visit. Atibhagya keeps it for that purpose and does not sell it or use it for marketing. Write to us at any time to have it removed.',
    error: 'We could not send that just now. Please try once more, or write to us directly.',
    errors: {
      name: 'We’d love a name to write back to.',
      email: 'An email address, so we can reply.',
      emailInvalid: 'That address doesn’t look quite right.',
      goal: 'A sentence is plenty — it tells us what the journey is for.',
      required: 'we need this one.',
      tooMany: 'That is a few inquiries in a short while. Please wait a few minutes and try again, or write to us directly.',
      verify: 'We could not confirm the form was sent by a person. Please try once more.',
    },
    doneEyebrow: 'Received',
    doneHeading: 'Thank you — your inquiry is with us.',
    doneBody: 'One of our team will write back to you {time}.',
    doneContact: 'If it is urgent, reach us directly:',
    doneBack: 'Back to Atibhagya',
  },
}

const id: Dict = {
  nav: { products: 'Pengalaman', journeys: 'Perjalanan', about: 'Tentang', inquiry: 'Kontak' },
  menu: 'Menu',
  close: 'Tutup',
  languageLabel: 'Bahasa',
  skipToContent: 'Lompat ke konten',
  youAreHere: 'Posisi Anda',
  yourPath: 'Posisi Anda di halaman',
  theme: { toDark: 'Ganti ke mode gelap', toLight: 'Ganti ke mode terang' },
  readMore: 'Selengkapnya',
  footer: { enquiries: 'Pertanyaan', explore: 'Jelajahi', social: 'Media sosial' },
  products: {
    eyebrow: 'Katalog',
    headline: 'Jelajahi praktik\nuntuk raga, jiwa, dan keterhubungan.',
    intro: 'Setiap pengalaman bisa berdiri sendiri atau dirangkai menjadi satu perjalanan utuh.',
    all: 'Semua',
    empty: 'Belum ada di kategori ini.',
    showing: '{shown} dari {total}',
    loadMore: 'Tampilkan lagi',
    remaining: '{n} lainnya untuk dijelajahi',
    filterCategory: 'Kategori',
    forLabel: 'Untuk',
    anyone: 'Siapa saja',
    elementLabel: 'Unsur',
    anyElement: 'Semua',
    elements: { earth: 'Tanah', water: 'Air', fire: 'Api', air: 'Udara', ether: 'Ruang' },
    searchPlaceholder: 'Cari',
    clear: 'Hapus pencarian',
    reset: 'Hapus filter',
    related: 'Pengalaman terkait',
    detailEyebrow: 'Pengalaman',
    experience: 'Pengalamannya',
    whatToExpect: 'Yang akan Anda alami',
    duration: 'Durasi',
    venue: 'Lokasi',
    suitableFor: 'Cocok untuk',
    element: 'Unsur',
    facilities: 'Fasilitas',
    facilitator: 'Fasilitator',
    inquire: 'Tanyakan pengalaman ini',
    suitable: {
      solo: 'Perorangan',
      group: 'Kelompok',
      corporate: 'Korporat',
      couple: 'Berdua',
      community: 'Komunitas',
    },
  },
  journeys: {
    eyebrow: 'Perjalanan',
    headline: 'Wellness sebagai\nperjalanan, bukan daftar menu.',
    intro: 'Pengalaman terkurasi lintas hari dan lintas tempat.',
    detailEyebrow: 'Perjalanan',
    itinerary: 'Rangkaian perjalanan',
    day: 'Hari',
    overview: 'Ringkasan perjalanan',
    duration: 'Durasi',
    facilities: 'Fasilitas',
    inclusion: 'Termasuk',
    exclusion: 'Tidak termasuk',
    pax: 'Saran jumlah peserta',
    location: 'Preferensi lokasi',
    inquire: 'Tanyakan perjalanan ini',
    empty: 'Perjalanan sedang disiapkan.',
  },
  inquiry: {
    metaTitle: 'Kontak · Atibhagya',
    metaDescription: 'Beberapa detail membantu kami membentuk pengalaman wellness yang tepat.',
    eyebrow: 'Mulai percakapan',
    headline: 'Ceritakan apa yang Anda butuhkan.',
    lede: 'Beberapa detail membantu kami membentuk pengalaman wellness yang tepat.',
    ...inquiryFields({
      name: 'Nama',
      email: 'Email',
      phone: 'Telepon',
      audience: 'Privat / kelompok',
      organisation: 'Perusahaan / komunitas',
      pax: 'Jumlah peserta',
      location: 'Lokasi yang diinginkan',
      date: 'Tanggal',
      goal: 'Tujuan kegiatan',
      notes: 'Catatan',
      products: 'Pengalaman yang diminati',
      journeys: 'Perjalanan yang diminati',
      categories: 'Kategori yang diminati',
      ideas: 'Hal lain yang Anda pikirkan',
    }),
    audienceOptions: [
      { value: 'private', label: 'Privat' },
      { value: 'group', label: 'Kelompok' },
      { value: 'corporate', label: 'Korporat' },
    ],
    ideasPlaceholder: 'Tulis sendiri, lalu tambahkan',
    addIdea: '+ Tambah',
    requiredNote: 'Wajib diisi',
    noMatch: 'Tidak ada yang cocok',
    moreChips: '+{n} lagi',
    fewerChips: 'Tampilkan lebih sedikit',
    typeToSearch: 'Ketik untuk mencari…',
    remove: 'Hapus',
    submit: 'Kirim',
    sending: 'Mengirim…',
    privacyNote:
      'Apa yang Anda tulis di sini hanya dipakai untuk membalas Anda dan merencanakan kunjungan. Atibhagya menyimpannya untuk keperluan itu saja, tidak menjualnya, dan tidak memakainya untuk pemasaran. Hubungi kami kapan saja untuk menghapusnya.',
    error: 'Kami belum bisa mengirimnya sekarang. Coba sekali lagi, atau tulis langsung kepada kami.',
    errors: {
      name: 'Kami ingin tahu nama Anda untuk membalas.',
      email: 'Alamat email, agar kami bisa membalas.',
      emailInvalid: 'Alamat itu sepertinya belum tepat.',
      goal: 'Satu kalimat sudah cukup — itu memberi tahu kami tujuan perjalanannya.',
      required: 'bagian ini perlu diisi.',
      tooMany: 'Sudah beberapa pesan dalam waktu singkat. Mohon tunggu beberapa menit dan coba lagi, atau tulis langsung kepada kami.',
      verify: 'Kami belum bisa memastikan formulir ini dikirim oleh orang. Silakan coba sekali lagi.',
    },
    doneEyebrow: 'Diterima',
    doneHeading: 'Terima kasih — pesan Anda sudah sampai.',
    doneBody: 'Salah satu dari tim kami akan membalas {time}.',
    doneContact: 'Jika mendesak, hubungi kami langsung:',
    doneBack: 'Kembali ke Atibhagya',
  },
}

export const dict = (locale: Locale): Dict => (locale === 'id' ? id : en)

/**
 * The dictionary with the menu words the team set in Site settings laid
 * over the approved ones. Every page that has fetched the site uses this,
 * so the header, the mobile menu, the footer and the page marks all say
 * the same thing.
 */
export const withSite = (t: Dict, site: SiteContent): Dict => ({
  ...t,
  nav: { ...t.nav, ...site.nav },
})
