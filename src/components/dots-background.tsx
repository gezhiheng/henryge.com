'use client'

import { useEffect, useRef } from 'react'

const SCALE = 200
const LENGTH = 10
const SPACING = 15

interface Point { x: number, y: number, opacity: number }

function hash3(x: number, y: number, z: number) {
  const v = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453
  return v - Math.floor(v)
}

function smoothstep(t: number) {
  return t * t * (3 - 2 * t)
}

function noise3(x: number, y: number, z: number) {
  const x0 = Math.floor(x)
  const y0 = Math.floor(y)
  const z0 = Math.floor(z)
  const x1 = x0 + 1
  const y1 = y0 + 1
  const z1 = z0 + 1

  const tx = smoothstep(x - x0)
  const ty = smoothstep(y - y0)
  const tz = smoothstep(z - z0)

  const n000 = hash3(x0, y0, z0)
  const n100 = hash3(x1, y0, z0)
  const n010 = hash3(x0, y1, z0)
  const n110 = hash3(x1, y1, z0)
  const n001 = hash3(x0, y0, z1)
  const n101 = hash3(x1, y0, z1)
  const n011 = hash3(x0, y1, z1)
  const n111 = hash3(x1, y1, z1)

  const nx00 = n000 + (n100 - n000) * tx
  const nx10 = n010 + (n110 - n010) * tx
  const nx01 = n001 + (n101 - n001) * tx
  const nx11 = n011 + (n111 - n011) * tx

  const nxy0 = nx00 + (nx10 - nx00) * ty
  const nxy1 = nx01 + (nx11 - nx01) * ty

  return nxy0 + (nxy1 - nxy0) * tz
}

function buildPoints(width: number, height: number) {
  const points: Point[] = []
  for (let x = -SPACING / 2; x < width + SPACING; x += SPACING) {
    for (let y = -SPACING / 2; y < height + SPACING; y += SPACING) {
      points.push({ x, y, opacity: Math.random() * 0.5 + 0.5 })
    }
  }
  return points
}

export default function DotsBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const pointsRef = useRef<Point[]>([])
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const width = window.innerWidth
      const height = window.innerHeight

      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      pointsRef.current = buildPoints(width, height)
    }

    const drawFrame = (animated: boolean) => {
      const width = window.innerWidth
      const height = window.innerHeight
      const t = animated ? Date.now() / 2500 : 0
      const isDark = document.documentElement.classList.contains('dark')
      const dotRgb = isDark ? '120, 120, 120' : '180, 180, 180'

      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = isDark ? '#000000' : '#ffffff'
      ctx.fillRect(0, 0, width, height)

      for (const p of pointsRef.current) {
        const nx = p.x / SCALE
        const ny = p.y / SCALE
        const rad = (noise3(nx, ny, t) - 0.5) * 2 * Math.PI
        const length = (noise3(nx, ny, t * 2) + 0.5) * LENGTH
        const x = p.x + Math.cos(rad) * length
        const y = p.y + Math.sin(rad) * length
        const alpha
          = (Math.abs(Math.cos(rad)) * 0.5 + 0.5) * p.opacity * 0.45
        ctx.fillStyle = `rgba(${dotRgb}, ${alpha})`
        ctx.beginPath()
        ctx.arc(x, y, 1, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const draw = () => {
      drawFrame(true)
      rafRef.current = window.requestAnimationFrame(draw)
    }

    const stopAnimation = () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }

    const syncAnimation = () => {
      stopAnimation()

      if (motionQuery.matches || document.hidden) {
        drawFrame(false)
        return
      }

      draw()
    }

    resize()
    syncAnimation()

    const handleResize = () => {
      resize()
      if (motionQuery.matches || document.hidden) {
        drawFrame(false)
      }
    }
    const handleThemeChange = () => {
      if (motionQuery.matches || document.hidden) {
        drawFrame(false)
      }
    }
    const themeObserver = new MutationObserver(handleThemeChange)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    window.addEventListener('resize', handleResize)
    document.addEventListener('visibilitychange', syncAnimation)
    motionQuery.addEventListener('change', syncAnimation)

    return () => {
      stopAnimation()
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', syncAnimation)
      motionQuery.removeEventListener('change', syncAnimation)
      themeObserver.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10"
      aria-hidden="true"
    />
  )
}
