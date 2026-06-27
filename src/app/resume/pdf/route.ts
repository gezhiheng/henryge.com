import { renderResumePDF } from '../resume-pdf'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const buffer = await renderResumePDF()

    return new Response(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume.pdf"',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  }
  catch (error) {
    console.error('Failed to render resume PDF:', error)
    return new Response('Failed to generate PDF', { status: 500 })
  }
}
