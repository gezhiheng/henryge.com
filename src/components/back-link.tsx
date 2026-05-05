'use client'

import { useRouter } from 'next/navigation'

interface BackLinkProps {
  fallbackHref?: string
  className?: string
  label?: string
  ariaLabel?: string
}

export default function BackLink({
  fallbackHref = '/',
  className,
  label = '> cd ..',
  ariaLabel = '返回',
}: BackLinkProps) {
  const router = useRouter()

  const handleClick = () => {
    if (typeof window !== 'undefined') {
      let referrerUrl: URL | null = null

      try {
        referrerUrl = document.referrer ? new URL(document.referrer) : null
      }
      catch {
        referrerUrl = null
      }

      const hasSameOriginReferrer = referrerUrl?.origin === window.location.origin

      if (hasSameOriginReferrer && window.history.length > 1) {
        router.back()
        return
      }
    }

    router.push(fallbackHref)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
      aria-label={ariaLabel}
    >
      {label}
    </button>
  )
}
