import type { ReactNode } from 'react'

export default function ResumeLayout({ children }: { children: ReactNode }) {
  return (
    <div className='resume-shell mx-auto w-full max-w-none md:-mt-10 md:max-w-[760px]'>
      {children}
    </div>
  )
}
