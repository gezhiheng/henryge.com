import type { ClassValue } from 'clsx'
import type { CSSProperties } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function enterStage(stage: number): CSSProperties {
  return { '--enter-stage': stage } as CSSProperties
}
