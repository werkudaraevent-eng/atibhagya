import {
  aboutEn,
  categoriesEn,
  homeEn,
  journeysEn,
  productsEn,
  siteEn,
  venuesEn,
} from './defaults.en'
import type {
  AboutContent,
  HomeContent,
  Journey,
  Product,
  ProductCategory,
  SiteContent,
  Venue,
} from './types'

/**
 * Indonesian translation. Images, structure and relationships are shared with
 * the English default — only copy differs, so a photo swapped once reaches
 * both locales.
 */
export const siteId: SiteContent = {
  ...siteEn,
  whatsappLabel: 'WhatsApp',
  address: 'Yogyakarta, Indonesia',
  footerTagline: 'Kesejahteraan yang berakar\npada tempat dan kehadiran.',
  footerLegal: '© 2026 Atibhagya. Seluruh hak cipta dilindungi.',
  responseTime: 'dalam dua hari kerja',
  nav: { products: 'Pengalaman', journeys: 'Perjalanan', about: 'Tentang', inquiry: 'Kontak', events: 'Acara' },
}

export const homeId: HomeContent = {
  meta: {
    title: 'Atibhagya — Kesejahteraan, berakar di Indonesia',
    description:
      'Atibhagya merangkai pengalaman wellness yang berakar pada kearifan Indonesia — mempertemukan alam, praktik mindful, tradisi budaya, dan keramahan kontemporer.',
  },
  hero: {
    ...homeEn.hero,
    eyebrow: 'Atibhagya · Indonesia',
    headline: 'Wellness yang berakar\npada tempat dan kehadiran.',
    statement:
      'Temukan cara yang lebih bermakna untuk merasakan kesejahteraan melalui kearifan Indonesia yang hidup.',
    ctaLabel: 'Jelajahi pengalaman kami',
  },
  why: {
    eyebrow: 'Mengapa Atibhagya',
    headline: 'Cara yang lebih tenang dalam merancang wellness.',
    body: 'Tenang, membumi, berbudaya, dan lentur untuk kebutuhan privat, kelompok, maupun korporat. Kami percaya kesejahteraan tidak lahir dari satu perawatan atau satu momen — ia dibentuk melalui rangkaian pengalaman yang disengaja.',
    pillars: [
      {
        title: 'Alam',
        body: 'Alam bukan latar belakang. Ia mengubah tempo sebuah pengalaman, mengundang gerak dan kehadiran, serta menciptakan ruang untuk refleksi dan pemulihan.',
      },
      {
        title: 'Keheningan',
        body: 'Mindfulness, refleksi, dan praktik yang disengaja membuka ruang untuk mendengarkan ke dalam, menemukan kejernihan, dan kembali pada keseimbangan.',
      },
      {
        title: 'Kearifan budaya',
        body: 'Tradisi Indonesia dan kearifan lokal diperlakukan sebagai pengetahuan yang hidup — dialami dengan konteks, rasa hormat, dan relevansi bagi hari ini.',
      },
    ],
  },
  featured: {
    eyebrow: 'Pengalaman pilihan',
    headline: 'Pengalaman pilihan',
  },
  event: {
    label: 'Satu musim di Prambanan',
    ctaLabel: 'Kenali festivalnya',
  },
  cta: {
    ...homeEn.cta,
    headline: 'Rancang perjalanan wellness Anda.',
    body: 'Sampaikan tujuan perjalanannya, sisanya kami bentuk mengikuti itu — untuk satu tamu, kelompok privat, atau satu organisasi.',
    label: 'Mulai percakapan',
  },
}

export const aboutId: AboutContent = {
  ...aboutEn,
  meta: {
    title: 'Tentang · Atibhagya',
    description:
      'Atibhagya adalah brand pengalaman wellness yang terinspirasi kearifan Indonesia yang hidup.',
  },
  eyebrow: 'Tentang Atibhagya',
  headline: 'Cara yang lebih penuh pertimbangan\nuntuk merasakan wellness.',
  lede: 'Berakar pada budaya dan alam, dirancang dengan kesederhanaan kontemporer.',
  body: [
    'Atibhagya adalah brand pengalaman wellness yang terinspirasi kearifan Indonesia yang hidup. Kami merancang perjalanan yang membantu orang melambat, memulihkan keseimbangan, dan terhubung kembali — dengan diri sendiri, dengan sesama, dan dengan tempat yang mereka kunjungi.',
    'Pengalaman kami mempertemukan praktik wellness tradisional, mindfulness, gerak, alam, perjumpaan budaya, ekspresi kreatif, hidangan yang menutrisi, dan keramahan kontemporer. Setiap elemen dipilih dengan tujuan, lalu dirangkai menjadi perjalanan yang utuh — bukan sekadar kumpulan aktivitas.',
    'Baik untuk pemulihan pribadi, retret kelompok privat, pertemuan korporat, maupun perjalanan insentif, Atibhagya membuka ruang agar kesejahteraan menjadi sesuatu yang dialami, dibagikan, dan diingat.',
  ],
  statement: 'Bukan sekadar waktu untuk pergi, melainkan kembali pada keseimbangan.',
  values: [
    { title: 'Tenang', caption: 'ruang sebelum hiasan' },
    { title: 'Jernih', caption: 'hierarki yang sederhana' },
    { title: 'Peduli', caption: 'manusiawi dan membumi' },
  ],
  ctaHeadline: 'Ceritakan apa yang Anda butuhkan.',
  ctaLabel: 'Bicara dengan tim kami',
}

export const categoriesId: ProductCategory[] = [
  { ...categoriesEn[0], name: 'Ritual & Upacara' },
  { ...categoriesEn[1], name: 'Penyembuhan & Bunyi' },
  { ...categoriesEn[2], name: 'Yoga & Gerak' },
  { ...categoriesEn[3], name: 'Spa & Retret' },
  { ...categoriesEn[4], name: 'Alam & Nutrisi' },
  { ...categoriesEn[5], name: 'Seni & Budaya' },
]

export const venuesId: Venue[] = venuesEn

const catId = (slug: string) => categoriesId.find((c) => c.slug === slug)

export const productsId: Product[] = [
  {
    ...productsEn[0],
    subtitle: 'Ritual Api Pemberkatan',
    description:
      'Ritual api upacara: energi atau niat yang tak lagi dibutuhkan dipersembahkan ke dalam api suci untuk ditransformasikan. Tamu bermeditasi di ruang api upacara sementara pemimpin ritual melantunkan mantra dan membunyikan lonceng, mempersembahkan bulir dan makanan ke dalam nyala api untuk melepaskan sumbatan pikiran.',
    highlightText:
      'Melepaskan energi dan hal yang tak lagi dibutuhkan, serta membantu mewujudkan niat baru. Menyeimbangkan energi, suara, dan pikiran.',
    durationText: '60 menit',
    facilities: ['Ritual persembahan', 'Kain tradisional', 'Bantal mata'],
    whatToExpect:
      'Ritual disiapkan dan dipimpin dalam konteks budayanya sendiri. Tamu dituntun melalui persembahan, api, dan keheningan sesudahnya.',
    category: catId('rituals-ceremony'),
  },
  {
    ...productsEn[1],
    title: 'Spa Ritual Jawa',
    subtitle: 'Tradisi spa kuno',
    description:
      'Rangkaian spa ritual Jawa yang otentik, bersumber dari tradisi keraton dan dijalankan sebagai sebuah laku, bukan daftar perawatan.',
    highlightText: 'Perawatan sebagai tradisi, bukan layanan.',
    facilities: ['Ramuan herbal', 'Kain tradisional'],
    category: catId('spa-retreats'),
  },
  {
    ...productsEn[2],
    title: 'Meditasi Jawa',
    subtitle: 'Keheningan yang dipandu',
    description:
      'Praktik meditasi yang dipandu dalam tradisi Jawa, membuka ruang untuk mendengarkan ke dalam dan kembali pada keseimbangan.',
    highlightText: 'Ruang untuk mendengarkan ke dalam.',
    facilities: ['Sesi terpandu'],
    category: catId('rituals-ceremony'),
  },
  {
    ...productsEn[3],
    title: 'Ritual Penyucian Tradisional',
    subtitle: 'Air dan niat',
    description:
      'Ritus penyucian yang dijalankan sebagaimana ia dijalankan turun-temurun, dengan konteks budaya yang dijelaskan, bukan dijadikan hiasan.',
    highlightText: 'Dijaga, bukan dipertunjukkan.',
    facilities: ['Ritual persembahan', 'Kain tradisional'],
    category: catId('rituals-ceremony'),
  },
  {
    ...productsEn[4],
    subtitle: 'Panahan tradisional yang mindful',
    description:
      'Panahan tradisional Jawa yang dilakukan sambil duduk dan ditarik dari hati — sebuah latihan ketenangan, napas, dan perhatian; bukan soal ketepatan bidikan.',
    highlightText: 'Membidik dengan rasa, bukan dengan mata.',
    facilities: ['Peralatan disediakan', 'Kain tradisional'],
    category: catId('spa-retreats'),
  },
  {
    ...productsEn[5],
    title: 'Pertemuan yang Mindful',
    subtitle: 'Untuk tim dan organisasi',
    description:
      'Kesejahteraan yang dirangkai ke dalam cara sebuah tim berkumpul: sesi yang lebih tenang, tempo yang dipertimbangkan, dan ruang untuk kejernihan di sela jam kerja.',
    highlightText: 'Berkumpul dengan perhatian lebih.',
    facilities: ['Ruang pertemuan', 'Sesi terpandu'],
    category: catId('healing-sound'),
  },
]

export const journeysId: Journey[] = [
  {
    ...journeysEn[0],
    title: 'Perjalanan Kembali ke Keseimbangan',
    positioning:
      'Sebuah alur singkat melalui gerak, keheningan, dan tradisi yang hidup — disusun agar setiap hari punya alasan untuk mengikuti hari sebelumnya.',
    description:
      'Dirancang bagi tamu yang menginginkan pengalaman utuh, bukan sekumpulan aktivitas — dimulai dari kedatangan dan menenangkan diri, terbuka ke praktik dan tempat, lalu ditutup dengan waktu untuk membawa sesuatu pulang.',
    summary: 'Beberapa hari · Indonesia',
    durationText: 'Tiga hari',
    facilities: ['Akomodasi', 'Hidangan', 'Transfer lokal'],
    inclusions: ['Praktik terpandu', 'Pengalaman budaya', 'Pendampingan fasilitator'],
    exclusions: ['Penerbangan internasional', 'Pengeluaran pribadi'],
    suggestedPax: 'Perorangan dan kelompok kecil',
    locationPreference: 'Jawa atau Bali',
    days: [
      {
        title: 'Kedatangan dan menenangkan diri',
        note: 'Pembukaan yang lembut. Tidak ada yang diminta selain hadir.',
        items: [
          { time: '15:00', title: 'Kedatangan dan sambutan', facilitatorNames: [] },
          { time: '17:00', title: 'Agni Hotra', productSlug: 'agni-hotra', venueName: 'Om Ham Resort', facilitatorNames: [] },
        ],
      },
      {
        title: 'Praktik dan tempat',
        note: 'Hari terpenuh, seimbang antara gerak dan istirahat.',
        items: [
          { time: '07:00', title: 'Meditasi Jawa', productSlug: 'javanese-meditation', facilitatorNames: [] },
          { time: '10:00', title: 'Jemparingan', productSlug: 'jemparingan', facilitatorNames: [] },
          { time: '16:00', title: 'Spa Ritual Jawa', productSlug: 'javanese-ritual-spa', facilitatorNames: [] },
        ],
      },
      {
        title: 'Membawanya pulang',
        note: 'Ditutup dengan tenang, dengan sesuatu untuk dibawa kembali.',
        items: [
          { time: '07:00', title: 'Ritual Penyucian Tradisional', productSlug: 'traditional-cleansing-ritual', facilitatorNames: [] },
          { time: '11:00', title: 'Percakapan penutup dan keberangkatan', facilitatorNames: [] },
        ],
      },
    ],
  },
  {
    ...journeysEn[1],
    title: 'Retret Kelompok',
    positioning:
      'Waktu bersama yang dibentuk di sekitar kesejahteraan, bagi komunitas dan tim yang menginginkan lebih dari sekadar pergantian suasana.',
    description:
      'Dibangun mengikuti kelompoknya, bukan template: keseimbangan aktivitas, privasi, pendampingan, dan kedalaman budaya ditentukan oleh siapa yang berangkat.',
    summary: 'Beberapa hari · Sesuai kesepakatan',
    facilities: ['Ruang pertemuan', 'Akomodasi', 'Hidangan'],
    inclusions: ['Praktik terpandu', 'Pendampingan fasilitator'],
    exclusions: ['Penerbangan', 'Pengeluaran pribadi'],
    suggestedPax: 'Kelompok privat dan tim',
    locationPreference: 'Sesuai kesepakatan',
    days: [
      {
        title: 'Berkumpul',
        items: [
          { time: '16:00', title: 'Kedatangan dan orientasi', facilitatorNames: [] },
          { time: '19:00', title: 'Hidangan bersama', facilitatorNames: [] },
        ],
      },
      {
        title: 'Bersama, dengan cara berbeda',
        items: [
          { time: '09:00', title: 'Pertemuan yang Mindful', productSlug: 'mindful-meetings', facilitatorNames: [] },
          { time: '15:00', title: 'Jemparingan', productSlug: 'jemparingan', facilitatorNames: [] },
        ],
      },
    ],
  },
]
