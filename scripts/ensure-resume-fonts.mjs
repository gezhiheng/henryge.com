import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const projectRoot = process.cwd()
const sourceFontsDir = path.join(projectRoot, 'public', 'fonts')
const sourceResumeMarkdown = path.join(projectRoot, 'src', 'app', 'resume', 'resume.md')
const sourceResumeVersionsDir = path.join(projectRoot, 'src', 'app', 'resume', 'versions')
const standalonePublicDir = path.join(projectRoot, '.next', 'standalone', 'public', 'fonts')
const standaloneResumeMarkdown = path.join(projectRoot, '.next', 'standalone', 'src', 'app', 'resume', 'resume.md')
const standaloneResumeVersionsDir = path.join(projectRoot, '.next', 'standalone', 'src', 'app', 'resume', 'versions')

async function ensureResumeFontsInStandalone() {
  const sourceStats = await fs.stat(sourceFontsDir).catch(() => null)
  const resumeMarkdownStats = await fs.stat(sourceResumeMarkdown).catch(() => null)
  const resumeVersionsStats = await fs.stat(sourceResumeVersionsDir).catch(() => null)
  const standaloneStats = await fs.stat(path.join(projectRoot, '.next', 'standalone')).catch(() => null)

  if (!standaloneStats?.isDirectory()) {
    return
  }

  if (sourceStats?.isDirectory()) {
    await fs.mkdir(standalonePublicDir, { recursive: true })
    await fs.cp(sourceFontsDir, standalonePublicDir, { force: true, recursive: true })
  }

  if (resumeMarkdownStats?.isFile()) {
    await fs.mkdir(path.dirname(standaloneResumeMarkdown), { recursive: true })
    await fs.copyFile(sourceResumeMarkdown, standaloneResumeMarkdown)
  }

  if (resumeVersionsStats?.isDirectory()) {
    await fs.mkdir(standaloneResumeVersionsDir, { recursive: true })
    await fs.cp(sourceResumeVersionsDir, standaloneResumeVersionsDir, { force: true, recursive: true })
  }
}

ensureResumeFontsInStandalone().catch((error) => {
  console.error('Failed to copy resume assets into standalone output.')
  console.error(error)
  process.exit(1)
})
