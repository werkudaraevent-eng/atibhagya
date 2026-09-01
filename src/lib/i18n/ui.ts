import type { Locale } from '../content/types'

export type Dict = {
  nav: { products: string; journeys: string; about: string; inquiry: string }
  menu: string
  close: string
  languageLabel: string
  skipToContent: string
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
    searchPlaceholder: string
    clear: string
    reset: string
    related: string
    detailEyebrow: string
    whatToExpect: string
    duration: string
    venue: string
    suitableFor: string
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
    interested: string
    interestedHint: string
    addCustom: string
    customPlaceholder: string
    remove: string
    submit: string
    sending: string
    error: string
    errors: { name: string; email: string; emailInvalid: string; goal: string; required: string }
    doneHeading: string
    /** Template with a {time} placeholder — a plain string so the dictionary can cross into a client component. */
    doneBody: string
    doneContact: string
    doneBack: string
    /** Questions the team has added in the CMS. Empty by default. */
    questions: CustomQuestion[]
  }
}

/** A question configured under Inquiries → Inquiry form. */
export type CustomQuestion = {
  name: string
  label: string
  type: 'text' | 'textarea' | 'email' | 'tel' | 'number' | 'date' | 'select' | 'checkbox'
  required: boolean
  width: 'full' | 'half'
  placeholder?: string
  help?: string
  options: { value: string; label: string }[]
}

const en: Dict = {
  nav: { products: 'Product', journeys: 'Journey', about: 'About', inquiry: 'Inquiry' },
  menu: 'Menu',
  close: 'Close',
  languageLabel: 'Language',
  skipToContent: 'Skip to content',
  readMore: 'Read more',
  footer: { enquiries: 'Enquiries', explore: 'Explore', social: 'Social' },
  products: {
    eyebrow: '01 / Products',
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
    searchPlaceholder: 'Search',
    clear: 'Clear search',
    reset: 'Clear filters',
    related: 'Related experiences',
    detailEyebrow: '01 / Product',
    whatToExpect: 'What to expect',
    duration: 'Duration',
    venue: 'Venue',
    suitableFor: 'Suitable for',
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
    eyebrow: '01 / Journeys',
    headline: 'Wellness as a\njourney, not a menu.',
    intro: 'Curated multi-day or multi-stop experiences.',
    detailEyebrow: '01 / Journey',
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
    eyebrow: '01 / Inquiry',
    headline: 'Tell us what you need.',
    lede: 'A few details help us shape the right wellness experience.',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    audience: 'Private / group',
    audienceOptions: [
      { value: 'private', label: 'Private' },
      { value: 'group', label: 'Group' },
      { value: 'corporate', label: 'Corporate' },
    ],
    organisation: 'Company / community',
    pax: 'Participants / pax',
    location: 'Preferred location',
    date: 'Date',
    goal: 'Goal of activity',
    notes: 'Notes',
    interested: 'Interested activities',
    interestedHint: 'Add anything else you have in mind, or write your own.',
    addCustom: '+ Custom activity',
    customPlaceholder: 'Something else you have in mind',
    remove: 'Remove',
    submit: 'Submit inquiry',
    sending: 'Sending…',
    error: 'We could not send that just now. Please try once more, or write to us directly.',
    errors: {
      name: 'We’d love a name to write back to.',
      email: 'An email address, so we can reply.',
      emailInvalid: 'That address doesn’t look quite right.',
      goal: 'A sentence is plenty — it tells us what the journey is for.',
      required: 'we need this one.',
    },
    doneHeading: 'Thank you. Your inquiry is on its way.',
    doneBody: 'One of our team will write back to you {time}.',
    doneContact: 'If it is urgent, reach us directly:',
    doneBack: 'Back to Atibhagya',
    questions: [],
  },
}

const id: Dict = {
  nav: { products: 'Pengalaman', journeys: 'Perjalanan', about: 'Tentang', inquiry: 'Kontak' },
  menu: 'Menu',
  close: 'Tutup',
  languageLabel: 'Bahasa',
  skipToContent: 'Lompat ke konten',
  readMore: 'Selengkapnya',
  footer: { enquiries: 'Pertanyaan', explore: 'Jelajahi', social: 'Media sosial' },
  products: {
    eyebrow: '01 / Pengalaman',
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
    searchPlaceholder: 'Cari',
    clear: 'Hapus pencarian',
    reset: 'Hapus filter',
    related: 'Pengalaman terkait',
    detailEyebrow: '01 / Pengalaman',
    whatToExpect: 'Yang akan Anda alami',
    duration: 'Durasi',
    venue: 'Lokasi',
    suitableFor: 'Cocok untuk',
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
    eyebrow: '01 / Perjalanan',
    headline: 'Wellness sebagai\nperjalanan, bukan daftar menu.',
    intro: 'Pengalaman terkurasi lintas hari dan lintas tempat.',
    detailEyebrow: '01 / Perjalanan',
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
    eyebrow: '01 / Kontak',
    headline: 'Ceritakan apa yang Anda butuhkan.',
    lede: 'Beberapa detail membantu kami membentuk pengalaman wellness yang tepat.',
    name: 'Nama',
    email: 'Email',
    phone: 'Telepon',
    audience: 'Privat / kelompok',
    audienceOptions: [
      { value: 'private', label: 'Privat' },
      { value: 'group', label: 'Kelompok' },
      { value: 'corporate', label: 'Korporat' },
    ],
    organisation: 'Perusahaan / komunitas',
    pax: 'Jumlah peserta',
    location: 'Lokasi yang diinginkan',
    date: 'Tanggal',
    goal: 'Tujuan kegiatan',
    notes: 'Catatan',
    interested: 'Pengalaman yang diminati',
    interestedHint: 'Tambahkan yang lain, atau tulis sendiri.',
    addCustom: '+ Aktivitas sendiri',
    customPlaceholder: 'Hal lain yang Anda pikirkan',
    remove: 'Hapus',
    submit: 'Kirim',
    sending: 'Mengirim…',
    error: 'Kami belum bisa mengirimnya sekarang. Coba sekali lagi, atau tulis langsung kepada kami.',
    errors: {
      name: 'Kami ingin tahu nama Anda untuk membalas.',
      email: 'Alamat email, agar kami bisa membalas.',
      emailInvalid: 'Alamat itu sepertinya belum tepat.',
      goal: 'Satu kalimat sudah cukup — itu memberi tahu kami tujuan perjalanannya.',
      required: 'bagian ini perlu diisi.',
    },
    doneHeading: 'Terima kasih. Pesan Anda sedang menuju kami.',
    doneBody: 'Salah satu dari tim kami akan membalas {time}.',
    doneContact: 'Jika mendesak, hubungi kami langsung:',
    doneBack: 'Kembali ke Atibhagya',
    questions: [],
  },
}

export const dict = (locale: Locale): Dict => (locale === 'id' ? id : en)
