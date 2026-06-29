import type { Metadata } from 'next'
import { getResumeData } from './resume-data'
import ResumeView from './resume-view'

const resumeData = getResumeData()

export const metadata: Metadata = {
  title: 'Resume',
  description: `${resumeData.profile.name} 的简历`,
}

export default function ResumePage() {
  return <ResumeView resumeData={resumeData} pdfHref='/resume/pdf' />
}
