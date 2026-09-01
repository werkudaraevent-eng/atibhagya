import Image from 'next/image'

/** Replaces the Payload wordmark on the login screen and the nav. */
export const Logo = () => (
  <Image
    src="/logo-atibhagya-gold.png"
    alt="Atibhagya"
    width={220}
    height={54}
    style={{ width: 220, height: 'auto' }}
    priority
  />
)

/** The small mark beside the collection nav. */
export const Icon = () => (
  <Image
    src="/icon.png"
    alt="Atibhagya"
    width={28}
    height={28}
    style={{ width: 28, height: 28, borderRadius: 2 }}
  />
)
