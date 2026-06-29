import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getResumeData, hasResumeVersion } from '../resume-data'
import ResumeView from '../resume-view'

interface ResumeVersionPageProps {
  params: Promise<{ version: string }>
}

export async function generateMetadata({ params }: ResumeVersionPageProps): Promise<Metadata> {
  const { version } = await params
  if (!hasResumeVersion(version)) {
    return { title: 'Resume' }
  }

  const resumeData = getResumeData(version)

  return {
    title: `Resume ${version}`,
    description: `${resumeData.profile.name} 的简历`,
  }
}

export default async function ResumeVersionPage({ params }: ResumeVersionPageProps) {
  const { version } = await params

  if (!hasResumeVersion(version)) {
    notFound()
  }

  return (
    <ResumeView
      resumeData={getResumeData(version)}
      pdfHref={`/resume/${encodeURIComponent(version)}/pdf`}
    />
  )
}
