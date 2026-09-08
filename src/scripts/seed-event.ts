/**
 * Seeds the first event — Prambanan Shiva Festival 2027 — with its three
 * journeys, from the client's programme PDFs as laid out in the design
 * handoff. English only: the Indonesian side falls back to English until
 * the team writes it in the CMS. Photographs and the programme PDF are left
 * for the media library.
 *
 * Safe to run twice: an event or journey whose slug already exists is left
 * exactly as it is.
 *
 *   npm run seed:event
 *   npm run seed:event:staging
 */
import 'dotenv/config'
import { getPayload, type Payload } from 'payload'

type Any = Record<string, any>

/** The reusable experiences: a day's activities point at these. */
const LIB: Record<string, { t: string; d: string }> = {
  arrival: { t: 'Arrival at Yogyakarta', d: 'Check-in and a slow first evening — the journey begins by arriving, not rushing.' },
  sound: { t: 'Javanese Sound Healing', d: 'Deep relaxation through the resonant tones of the singing bowl, the delicate melodies of siteran, and the soulful expression of tembang Jawa — a gentle space for reflection, restoration, and inner balance.' },
  forest: { t: 'Forest Therapy', d: 'Mindful engagement with nature through the senses — greenery, rustling leaves, rough bark, fresh earthy air — restoring physical, emotional, and mental wellbeing.' },
  dance: { t: 'Intuitive Javanese Dance Meditation', d: 'Before there is movement, there is meaning. Circle sharing and card reflection lead into your own embodied exploration — not for performance, but for presence.' },
  kotagede: { t: 'Kotagede', d: 'Historic streets, traditional architecture, silver craftsmanship, and an intimate atmosphere shaped by centuries of Javanese culture.' },
  kraton: { t: 'Kraton Yogyakarta', d: 'Royal traditions, philosophy, art, and ceremonial heritage that reflect the enduring cultural identity of Yogyakarta.' },
  tea: { t: 'Tea Blending Ritual', d: 'Craft a personalised blend from herbs, flowers, and premium tea leaves — a calming sensory practice guided by experienced facilitators.' },
  wiron: { t: 'Mindful Wiron', d: 'The symbolic art of pleating kain batik as a grounding ritual — anchoring the body, engaging the hands, and centring the mind.' },
  kedulan: { t: 'Kedulan Temple', d: 'Begin with a traditional melukat — a gentle water cleansing ritual to refresh body and mind before the journey.' },
  ijo: { t: 'Ijo Temple', d: 'Wander the heritage of Ijo, taking in its architecture, surrounding nature, and peaceful atmosphere.' },
  boko: { t: 'Ratu Boko', d: 'Ancient heritage meets breathtaking sunset views. An intention-setting practice invites you to pause and set a meaning for the days ahead.' },
  barong: { t: 'Barong Temple', d: 'A serene setting for prayer and spiritual reflection — a meaningful connection with the sacred heritage of the temple.' },
  sambisari: { t: 'Sambisari Temple', d: 'Explore the unique sunken temple — ancient architecture, tranquil surroundings, and cultural heritage.' },
  kelongan: { t: 'Sari Kelongan Temple', d: 'A lesser-known site of distinctive architecture, quiet atmosphere, and timeless charm.' },
  fest: { t: 'Mahashivaratri · Wisnu Park', d: 'The sacred night — purification, puja, japa and meditation, arati, pradakshina. Chanting the 1,008 Names; receiving the Nawa Datu thread.' },
  tawur: { t: 'Tawur Agung Kesanga · Wisnu Mandala', d: 'Purification of the universe on the eve of Nyepi — prayers for the wellbeing of all living beings, before entering the silence.' },
}

type Day = { t: string; kicker: string; d: string; items: string[]; hi?: boolean }

type Program = {
  slug: string
  name: string
  len: string
  words: string
  kicker: string
  d: string
  statement: string
  days: Day[]
}

const PROGRAMS: Program[] = [
  {
    slug: 'path-of-shiva',
    name: 'Path of Shiva',
    len: '4D3N',
    words: 'Four days, three nights',
    kicker: 'Leisure journey',
    d: 'A relaxed journey around Prambanan, discovering temples of the Shiva tradition — cultural discovery and gentle reflection at an easy, immersive pace.',
    statement:
      'Four days, three nights. An easy, immersive pace around Prambanan — temples of the Shiva tradition, gentle reflection, and mindful leisure — arriving at the festival already quiet.',
    days: [
      { t: 'Arrival · Javanese Sound Healing', kicker: 'Arrive & settle', d: 'Experience deep relaxation through the soothing harmony of traditional Javanese sounds — a peaceful immersion into sound, tradition, and mindfulness.', items: ['arrival', 'sound'] },
      { t: 'Sacred Journey of Shiva', kicker: 'Pilgrimage · three stops, one thread', d: 'More than a leisure escape: heritage, nature, culture, and wellness in one meaningful day — slowing down, exploring timeless places, and creating moments of reflection.', items: ['kedulan', 'ijo', 'boko'] },
      { t: 'Shiva Festival', kicker: 'The sacred night', d: 'Mahashivaratri at Prambanan — a night of silence, light, and the presence of Shiva.', items: ['fest'], hi: true },
      { t: 'Tawur Agung', kicker: 'Ahead of Nyepi', d: 'Purifying the universe, restoring harmony — the closing dawn of the journey.', items: ['tawur'], hi: true },
    ],
  },
  {
    slug: 'soulful-journey',
    name: 'Soulful Journey',
    len: '5D4N',
    words: 'Five days, four nights',
    kicker: 'Pre-event retreat',
    d: 'An intimate retreat for a limited number of participants — pilgrimage and wellness combined, to slow down and reconnect before the festival.',
    statement:
      'Five days, four nights. An intimate retreat for a limited number of participants — pilgrimage and wellness woven together, so that you slow down, reconnect, and arrive at Prambanan prepared.',
    days: [
      { t: 'Arrival · Javanese Sound Healing', kicker: 'Arrive & settle', d: 'Experience deep relaxation through the soothing harmony of traditional Javanese sounds — a gentle space for reflection, restoration, and inner balance.', items: ['arrival', 'sound'] },
      { t: 'Forest Therapy · Javanese Dance Meditation', kicker: 'Wellness · nature & body', d: 'A day given to the senses and to the body — restoring wellbeing in the forest, then listening inward through intuitive movement.', items: ['forest', 'dance'] },
      { t: 'Sacred Journey of Shiva', kicker: 'Pilgrimage · three stops, one thread', d: 'Sacred purification, exploration, and intention setting — the thread that prepares you for the festival.', items: ['kedulan', 'ijo', 'boko'] },
      { t: 'Shiva Festival', kicker: 'The sacred night', d: 'Mahashivaratri at Prambanan — a night of silence, light, and the presence of Shiva.', items: ['fest'], hi: true },
      { t: 'Tawur Agung', kicker: 'Ahead of Nyepi', d: 'Purifying the universe, restoring harmony — the closing dawn of the journey.', items: ['tawur'], hi: true },
    ],
  },
  {
    slug: 'maha-laku',
    name: 'Mahā Laku',
    len: '8D7N',
    words: 'Eight days, seven nights',
    kicker: 'Exclusive retreat',
    d: 'A smaller group, a more personal pace — pilgrimage, wellness, and cultural exploration across Yogyakarta and its surrounding heritage sites.',
    statement:
      'Eight days, seven nights. A small group and a personal pace across Yogyakarta and Central Java — pilgrimage, wellness, and living culture — arriving at Prambanan for Mahashivaratri on 6 March and Tawur Agung on 7 March.',
    days: [
      { t: 'Arrival · Javanese Sound Healing', kicker: 'Arrive & settle', d: 'Experience deep relaxation through the soothing harmony of traditional Javanese sounds — a gentle space for reflection, restoration, and inner balance.', items: ['arrival', 'sound'] },
      { t: 'Yogyakarta Heritage Tour', kicker: 'Culture · two landscapes', d: 'Discover Yogyakarta through two of its most meaningful cultural landscapes — where history, artistry, spirituality, and community continue to live together.', items: ['kotagede', 'kraton'] },
      { t: 'Forest Therapy · Javanese Dance Meditation', kicker: 'Wellness · nature & body', d: 'A day given to the senses and to the body — restoring wellbeing in the forest, then listening inward through intuitive movement.', items: ['forest', 'dance'] },
      { t: 'Tea Blending Ritual · Mindful Wiron', kicker: 'Mindful Javanese rituals', d: 'Two rituals of the hands — one of scent and taste, one of cloth and fold — each a way of centring the mind.', items: ['tea', 'wiron'] },
      { t: 'Sacred Journey of Shiva I', kicker: 'Purification & pilgrimage', d: 'A sacred purification and pilgrimage through the legacy of Shiva in the ancient Mataram Kingdom — melukat, reflection, and the Shiva temples of Yogyakarta.', items: ['kedulan', 'ijo', 'boko'] },
      { t: 'Sacred Journey of Shiva II', kicker: 'Reflection & hidden heritage', d: 'Quieter temples, deeper stillness — a second day among the sacred sites.', items: ['barong', 'sambisari', 'kelongan'] },
      { t: 'Shiva Festival', kicker: 'The sacred night', d: 'Mahashivaratri at Prambanan — a night of silence, light, and the presence of Shiva.', items: ['fest'], hi: true },
      { t: 'Tawur Agung', kicker: 'Ahead of Nyepi', d: 'Purifying the universe, restoring harmony — the closing dawn of the journey.', items: ['tawur'], hi: true },
    ],
  },
]

const EVENT_SLUG = 'prambanan-shiva-festival-2027'

const event = (journeyIds: (string | number)[]) => ({
  slug: EVENT_SLUG,
  title: 'Prambanan Shiva Festival 2027',
  eyebrow: 'Prambanan Shiva Festival 2027 · Yogyakarta',
  headline: 'The Holy Month of Shiva — for spiritual peace and harmony.',
  statement:
    'Two sacred days at the House of Shiva, and three curated journeys that lead you there — shaped by Atibhagya in collaboration with the festival.',
  dates: [
    { label: 'Mahashivaratri', date: '2027-03-06T12:00:00.000Z', time: '14.00 – 08.00 WIB', venue: 'Wisnu Park, Prambanan Temple' },
    { label: 'Tawur Agung Kesanga', date: '2027-03-07T12:00:00.000Z', time: '09.00 WIB', venue: 'Wisnu Mandala, Prambanan Temple' },
  ],
  introLabel: 'Why we walk to Prambanan',
  introHeadline:
    'Wellbeing, for us, has always been shaped by place and by living tradition. Few places hold both like Prambanan.',
  introBody:
    'In March 2027 the temple observes Mahashivaratri — the sacred night of Shiva — followed at dawn by Tawur Agung Kesanga, the purification of the universe before Nyepi. Atibhagya curates the days around them: sound, forest, water, and stillness, so that you arrive at the festival already quiet.',
  daysLabel: 'The sacred days · 6 – 7 March 2027',
  daysHeadline: 'A night of silence and light, then a dawn that purifies the universe.',
  days: [
    {
      kicker: 'Saturday · 6 March',
      meta: '14.00 – 08.00 WIB · Wisnu Park',
      title: 'Mahashivaratri',
      body:
        'Observed on the fourteenth night of Phalguna — a time for purification, self-discipline, prayer, and contemplation. At Prambanan the night is kept through collective worship that restores harmony within oneself, with others, with nature, and with the Divine.',
      listLabel: 'The sacred procession',
      listStyle: 'thread',
      list: [
        { title: 'Purification', body: 'Purifying the body and mind before entering the sacred space and beginning the worship.' },
        { title: 'Puja & Yadnya', body: 'Offering prayers and sacred offerings to Lord Shiva as an expression of devotion and gratitude.' },
        { title: 'Japa & Meditation', body: 'Chanting sacred Shiva mantras, including the Names of Shiva, followed by silent meditation and inner reflection.' },
        { title: 'Arati', body: 'Offering sacred light as a symbol of divine presence, spiritual illumination, and awakened consciousness.' },
        { title: 'Pradakshina & Namaskara', body: 'Circumambulating the sacred lingga and bowing in reverence — humility and devotion.' },
      ],
      notes: [
        { title: 'Chanting the 1,008 Names', body: 'A sacred invocation chanted throughout the worship — calming the mind and awakening spiritual energy.' },
        { title: 'Nawa Datu', body: 'The nine-coloured thread received after worship — protection, balance, and harmony in life.' },
      ],
    },
    {
      kicker: 'Sunday · 7 March',
      meta: '09.00 WIB · Wisnu Mandala',
      title: 'Tawur Agung Kesanga',
      body:
        'Held the day before Nyepi, the Day of Silence — an act of purification of the universe, restoring balance with Bhuta Kala and offering prayers for the safety and wellbeing of all living beings. It prepares body and spirit for the profound silence that follows.',
      listLabel: 'The meaning of Tawur Agung',
      listStyle: 'rows',
      list: [
        { title: 'Purification of the universe', body: 'Purifying negative energies and restoring balance and harmony throughout the universe.' },
        { title: 'Yadnya & sacred offering', body: 'Devotion to Ida Sang Hyang Widhi Wasa and His manifestations through sincere, sacred offerings.' },
        { title: 'Wellbeing of all living beings', body: 'Prayers for safety, health, peace, and happiness for all forms of life.' },
        { title: 'Preparing the silence of Nyepi', body: 'Purifying body and mind for Catur Brata Penyepian, the disciplines observed during Nyepi.' },
      ],
      quoteEyebrow: 'Vasudhaiva Kutumbakam',
      quote:
        'With sincere hearts — together we honour the sanctity of the ceremony and uphold peace, harmony, and respect as we welcome the silence of Nyepi.',
    },
  ],
  placeLabel: 'The spirit of Prambanan',
  placeNumber: '856',
  placeCaption: 'CE · Wantil\nInscription',
  placeHeadline: 'Prambanan was known as Shivagrha — the House of Shiva.',
  placeBody:
    'More than an architectural legacy, the temple was a sacred place dedicated to the worship of Lord Shiva. Through the festival this living heritage is celebrated and given new meaning — a heritage that continues to be experienced, preserved, and passed on. A journey inward: to reflect, release what no longer serves us, and restore harmony within ourselves, with others, nature, and life.',
  journeysLabel: 'Three curated journeys',
  journeysHeadline: 'Each leads into the festival — at its own pace, depth, and length of stay.',
  journeys: journeyIds,
  defaultJourney: journeyIds[1] ?? journeyIds[0],
  closingEyebrow: 'Reserve a place · March 2027',
  closingHeadline: 'Walk the path of Shiva with us.',
  closingBody:
    'Tell us which journey speaks to you and how many are travelling. Groups are kept small, so we confirm places in order of enquiry.',
  closingCtaLabel: 'Start a conversation',
  contactLine: '@voiceofprambanan',
  collaborationLine: 'In collaboration with Prambanan Shiva Festival\nAtibhagya Wellness · Member of Werkudara Group',
  navLabel: 'Festival 2027',
  homeHeadline: 'Two sacred days at the House of Shiva. Three journeys that lead you there.',
  metaTitle: 'Prambanan Shiva Festival 2027 · Atibhagya',
  metaDescription:
    'Mahashivaratri and Tawur Agung Kesanga at Prambanan, 6–7 March 2027, with three curated journeys by Atibhagya that lead you there.',
})

/** A product with this title, if the catalogue has one, so the day links to it. */
async function productId(payload: Payload, title: string): Promise<string | number | undefined> {
  const found = await payload.find({
    collection: 'products',
    limit: 1,
    depth: 0,
    where: { title: { like: title } },
  })
  const doc = found.docs[0] as Any | undefined
  return doc && String(doc.title).toLowerCase() === title.toLowerCase() ? doc.id : undefined
}

async function seedEvent() {
  const payload = await getPayload({ config: (await import('../payload.config')).default })

  const journeyIds: (string | number)[] = []
  let order = (await payload.find({ collection: 'journeys', limit: 1, depth: 0 })).totalDocs

  for (const program of PROGRAMS) {
    const existing = await payload.find({
      collection: 'journeys',
      limit: 1,
      depth: 0,
      where: { slug: { equals: program.slug } },
    })
    if (existing.docs[0]) {
      journeyIds.push(existing.docs[0].id)
      payload.logger.info(`Journey "${program.name}" already exists — left as it is`)
      continue
    }

    const days = []
    for (const day of program.days) {
      const items = []
      for (const key of day.items) {
        const lib = LIB[key]!
        const product = await productId(payload, lib.t)
        items.push({ title: lib.t, ...(product ? { product } : {}) })
      }
      days.push({ title: day.t, kicker: day.kicker, highlight: Boolean(day.hi), note: day.d, items })
    }

    const created = await payload.create({
      collection: 'journeys',
      locale: 'en',
      data: {
        slug: program.slug,
        title: program.name,
        positioning: program.d,
        description: program.statement,
        summary: program.kicker,
        durationText: program.words,
        durationShort: program.len,
        days,
        order: order++,
        // Published outright: a draft would not appear on the site or in
        // the event's journey list.
        _status: 'published',
      } as never,
    })
    journeyIds.push(created.id)
    payload.logger.info(`Seeded journey "${program.name}"`)
  }

  const existingEvent = await payload.find({
    collection: 'events',
    limit: 1,
    depth: 0,
    where: { slug: { equals: EVENT_SLUG } },
  })
  if (existingEvent.docs[0]) {
    payload.logger.info('Event already exists — left as it is')
  } else {
    await payload.create({
      collection: 'events',
      locale: 'en',
      data: { ...event(journeyIds), _status: 'published' } as never,
    })
    payload.logger.info('Seeded event "Prambanan Shiva Festival 2027"')
  }

  payload.logger.info('Done. Add the photographs and the programme PDF in the admin.')
  process.exit(0)
}

seedEvent().catch((err) => {
  console.error(err)
  process.exit(1)
})
