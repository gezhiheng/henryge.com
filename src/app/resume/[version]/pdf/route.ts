import { getResumeData, hasResumeVersion, resumePdfContentDisposition } from '../../resume-data'
import { renderResumePDF } from '../../resume-pdf'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface ResumeVersionPdfRouteContext {
  params: Promise<{ version: string }>
}

export async function GET(_request: Request, { params }: ResumeVersionPdfRouteContext) {
  const { version } = await params

  if (!hasResumeVersion(version)) {
    return new Response('Resume version not found', { status: 404 })
  }

  try {
    const resumeData = getResumeData(version)
    const buffer = await renderResumePDF(resumeData)

    return new Response(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': resumePdfContentDisposition(resumeData),
        'Cache-Control': 'public, max-age=3600',
      },
    })
  }
  catch (error) {
    console.error('Failed to render resume PDF:', error)
    return new Response('Failed to generate PDF', { status: 500 })
  }
}
