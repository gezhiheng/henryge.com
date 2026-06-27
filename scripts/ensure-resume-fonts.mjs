import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const projectRoot = process.cwd()
const sourceFontsDir = path.join(projectRoot, 'public', 'fonts')
const standalonePublicDir = path.join(projectRoot, '.next', 'standalone', 'public', 'fonts')

async function ensureResumeFontsInStandalone() {
  const sourceStats = await fs.stat(sourceFontsDir).catch(() => null)
  const standaloneStats = await fs.stat(path.join(projectRoot, '.next', 'standalone')).catch(() => null)

  if (!sourceStats?.isDirectory() || !standaloneStats?.isDirectory()) {
    return
  }

  await fs.mkdir(standalonePublicDir, { recursive: true })
  await fs.cp(sourceFontsDir, standalonePublicDir, { force: true, recursive: true })
}

ensureResumeFontsInStandalone().catch((error) => {
  console.error('Failed to copy resume fonts into standalone output.')
  console.error(error)
  process.exit(1)
})
