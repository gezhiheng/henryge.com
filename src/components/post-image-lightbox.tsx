'use client'

import { X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface PostImageLightboxProps {
  containerId: string
}

interface ActiveImage {
  alt: string
  src: string
}

interface PointerStart {
  image: HTMLImageElement
  pointerId: number
  x: number
  y: number
}

const TAP_MOVE_THRESHOLD = 8
const SCROLL_KEYS = new Set([
  ' ',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'End',
  'Home',
  'PageDown',
  'PageUp',
])

export default function PostImageLightbox ({
  containerId
}: PostImageLightboxProps) {
  const [activeImage, setActiveImage] = useState<ActiveImage | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const pointerStartRef = useRef<PointerStart | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const getPostImage = (target: EventTarget | null) => {
      if (!(target instanceof HTMLImageElement)) {
        return null
      }

      const container = document.getElementById(containerId)
      if (!container || !container.contains(target)) {
        return null
      }

      if (!target.classList.contains('post-image')) {
        return null
      }

      return target
    }

    const openImage = (image: HTMLImageElement) => {
      const src = image.getAttribute('src')
      if (!src) {
        return
      }

      setActiveImage({
        src,
        alt: image.getAttribute('alt') ?? 'Post image'
      })
    }

    const handlePointerDown = (event: PointerEvent) => {
      const image = getPostImage(event.target)
      if (!image || !event.isPrimary) {
        pointerStartRef.current = null
        return
      }

      pointerStartRef.current = {
        image,
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
      }
    }

    const handlePointerUp = (event: PointerEvent) => {
      const start = pointerStartRef.current
      pointerStartRef.current = null

      if (!start || start.pointerId !== event.pointerId) {
        return
      }

      const moved = Math.hypot(event.clientX - start.x, event.clientY - start.y)
      if (moved > TAP_MOVE_THRESHOLD) {
        return
      }

      openImage(start.image)
    }

    const handlePointerCancel = () => {
      pointerStartRef.current = null
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ') {
        return
      }

      const image = getPostImage(event.target)
      if (!image) {
        return
      }

      event.preventDefault()
      openImage(image)
    }

    document.addEventListener('pointerdown', handlePointerDown, { passive: true })
    document.addEventListener('pointerup', handlePointerUp, { passive: true })
    document.addEventListener('pointercancel', handlePointerCancel, { passive: true })
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('pointerup', handlePointerUp)
      document.removeEventListener('pointercancel', handlePointerCancel)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [containerId])

  useEffect(() => {
    if (!activeImage) {
      return
    }

    const scrollY = window.scrollY
    const previousHtmlOverflow = document.documentElement.style.overflow
    const previousOverflow = document.body.style.overflow
    const previousPosition = document.body.style.position
    const previousTop = document.body.style.top
    const previousWidth = document.body.style.width
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'

    const preventScroll = (event: Event) => {
      event.preventDefault()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveImage(null)
        return
      }

      if (SCROLL_KEYS.has(event.key)) {
        event.preventDefault()
      }
    }

    window.addEventListener('wheel', preventScroll, { passive: false, capture: true })
    window.addEventListener('touchmove', preventScroll, { passive: false, capture: true })
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow
      document.body.style.overflow = previousOverflow
      document.body.style.position = previousPosition
      document.body.style.top = previousTop
      document.body.style.width = previousWidth
      window.scrollTo(0, scrollY)
      window.removeEventListener('wheel', preventScroll, { capture: true })
      window.removeEventListener('touchmove', preventScroll, { capture: true })
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeImage])

  if (!isMounted || !activeImage) {
    return null
  }

  return createPortal(
    <div
      className='fixed inset-0 z-100 flex items-center justify-center bg-background/70 backdrop-blur-xl p-4 animate-in fade-in'
      onClick={() => setActiveImage(null)}
      role='dialog'
      aria-modal='true'
      aria-label='Image preview'
    >
      <button
        type='button'
        className='absolute top-4 right-4 z-10 flex size-11 items-center justify-center rounded-full border border-border/70 bg-background/85 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60'
        onClick={(event) => {
          event.stopPropagation()
          setActiveImage(null)
        }}
        aria-label='关闭图片预览'
      >
        <X className='h-5 w-5' />
      </button>
      <div
        className='relative h-[90vh] w-[min(96vw,1600px)] cursor-zoom-out'
        onClick={() => setActiveImage(null)}
      >
        <Image
          key={activeImage.src}
          src={activeImage.src}
          alt={activeImage.alt}
          fill
          sizes='96vw'
          className='object-contain'
          priority
          unoptimized
        />
      </div>
    </div>,
    document.body
  )
}
