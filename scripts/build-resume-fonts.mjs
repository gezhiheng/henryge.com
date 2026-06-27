// Dev-only tool: regenerates subsetted Noto Sans SC fonts from src/app/resume/resume.md.
// Run manually with `pnpm build:fonts` after updating the resume markdown.
// Requires Python fonttools (pip install fonttools) and curl.
// The output files in public/fonts/ are committed to git — no Python needed at build time.
import { execSync } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const projectRoot = process.cwd()
const fontsDir = path.join(projectRoot, 'public', 'fonts')
const vfPath = path.join(projectRoot, '.next', 'cache', 'NotoSansSC-VF.ttf')
const bodyFull = path.join(projectRoot, '.next', 'cache', 'NotoSansSC-Body-full.ttf')
const regularFull = path.join(projectRoot, '.next', 'cache', 'NotoSansSC-Regular-full.ttf')
const boldFull = path.join(projectRoot, '.next', 'cache', 'NotoSansSC-Bold-full.ttf')
const dataSource = path.join(projectRoot, 'src', 'app', 'resume', 'resume.md')
const pdfSource = path.join(projectRoot, 'src', 'app', 'resume', 'resume-pdf.tsx')
const combinedTextPath = path.join(projectRoot, '.next', 'cache', 'resume-font-text.txt')

const VF_URL = 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf'

async function exists(p) {
  return fs.stat(p).then(() => true).catch(() => false)
}

async function ensureDir(p) {
  await fs.mkdir(path.dirname(p), { recursive: true })
}

async function downloadVf() {
  if (await exists(vfPath)) {
    return
  }
  console.log('[fonts] Downloading Noto Sans SC variable font…')
  await ensureDir(vfPath)
  execSync(`curl -L --retry 3 --retry-delay 5 -o "${vfPath}" "${VF_URL}"`, { stdio: 'inherit' })
}

function instanceAndSubset(input, output, textFile) {
  execSync(`pyftsubset "${input}" --text-file="${textFile}" --layout-features='*' --no-hinting --desubroutinize --output-file="${output}"`, { stdio: 'inherit' })
}

async function buildFonts() {
  await downloadVf()
  await ensureDir(path.join(fontsDir, 'public'))

  // Combine all source files that contain text rendered into the PDF
  // (resume.md for content, resume-pdf.tsx for section titles/labels)
  const dataText = await fs.readFile(dataSource, 'utf8')
  const pdfText = await fs.readFile(pdfSource, 'utf8')
  await ensureDir(combinedTextPath)
  await fs.writeFile(combinedTextPath, dataText + pdfText, 'utf8')

  console.log('[fonts] Instantiating Body (350)…')
  execSync(`fonttools varLib.instancer "${vfPath}" wght=350 -o "${bodyFull}"`, { stdio: 'inherit' })

  console.log('[fonts] Instantiating Regular (400)…')
  execSync(`fonttools varLib.instancer --update-name-table "${vfPath}" wght=400 -o "${regularFull}"`, { stdio: 'inherit' })

  console.log('[fonts] Instantiating Bold (700)…')
  execSync(`fonttools varLib.instancer --update-name-table "${vfPath}" wght=700 -o "${boldFull}"`, { stdio: 'inherit' })

  await fs.mkdir(fontsDir, { recursive: true })

  console.log('[fonts] Subsetting Body from resume sources…')
  instanceAndSubset(bodyFull, path.join(fontsDir, 'NotoSansSC-Body.ttf'), combinedTextPath)

  console.log('[fonts] Subsetting Regular from resume sources…')
  instanceAndSubset(regularFull, path.join(fontsDir, 'NotoSansSC-Regular.ttf'), combinedTextPath)

  console.log('[fonts] Subsetting Bold from resume sources…')
  instanceAndSubset(boldFull, path.join(fontsDir, 'NotoSansSC-Bold.ttf'), combinedTextPath)

  console.log('[fonts] Done.')
}

buildFonts().catch((error) => {
  console.error('[fonts] Failed to build resume fonts.')
  console.error(error)
  process.exit(1)
})
