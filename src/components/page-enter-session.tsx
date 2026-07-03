'use client'

import { usePathname } from 'next/navigation'
import { useLayoutEffect } from 'react'

function syncPageEnter(pathname: string) {
  try {
    const key = `page-enter:${pathname}`
    const isFirstVisit = sessionStorage.getItem(key) !== '1'
    document.documentElement.dataset.pageEnter = isFirstVisit ? 'new' : 'seen'
    if (isFirstVisit) {
      sessionStorage.setItem(key, '1')
    }
  }
  catch {
    document.documentElement.dataset.pageEnter = 'seen'
  }
}

export default function PageEnterSession() {
  const pathname = usePathname()

  useLayoutEffect(() => {
    syncPageEnter(pathname)
  }, [pathname])

  return null
}
