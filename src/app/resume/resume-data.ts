import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import matter from 'gray-matter'

export interface ResumeProfile {
  name: string
  title: string
  email: string
  phone?: string
  github?: string
  website?: string
}

export interface ResumeExperience {
  company: string
  position: string
  start: string
  end: string
  description: string
}

export interface ResumeProjectLink {
  label?: string
  url: string
}

export interface ResumeProject {
  name: string
  description: string
  links?: ResumeProjectLink[]
  techStack?: string
  highlights?: string[]
}

export interface ResumeOpenSourceItem {
  description: string
  link?: string
}

export interface ResumeEducation {
  school: string
  degree: string
  major: string
  start: string
  end: string
}

export interface ResumeSkillGroup {
  category: string
  items: string[]
}

export interface ResumeData {
  profile: ResumeProfile
  skills: ResumeSkillGroup[]
  experiences: ResumeExperience[]
  projects: ResumeProject[]
  openSource: ResumeOpenSourceItem[]
  education: ResumeEducation[]
}

interface MarkdownBlock {
  title: string
  body: string
}

const resumeMarkdownPath = path.join(process.cwd(), 'src', 'app', 'resume', 'resume.md')

function field(data: Record<string, unknown>, key: string) {
  const value = data[key]
  if ((typeof value !== 'string' && typeof value !== 'number') || String(value).trim().length === 0) {
    throw new Error(`Missing resume frontmatter field: ${key}`)
  }
  return String(value).trim()
}

function optionalField(data: Record<string, unknown>, key: string) {
  const value = data[key]
  return typeof value === 'string' || typeof value === 'number' ? String(value).trim() || undefined : undefined
}

function splitSections(markdown: string) {
  const sections = new Map<string, string[]>()
  let currentTitle: string | null = null

  for (const line of markdown.split(/\r?\n/)) {
    if (line.startsWith('## ')) {
      currentTitle = line.slice(3).trim()
      sections.set(currentTitle, [])
      continue
    }

    if (currentTitle) {
      sections.get(currentTitle)?.push(line)
    }
  }

  return sections
}

function requiredSection(sections: Map<string, string[]>, title: string) {
  const lines = sections.get(title)
  if (!lines) {
    throw new Error(`Missing resume markdown section: ${title}`)
  }
  return lines.join('\n').trim()
}

function splitBlocks(markdown: string) {
  const blocks: MarkdownBlock[] = []
  let current: MarkdownBlock | null = null

  for (const line of markdown.split(/\r?\n/)) {
    if (line.startsWith('### ')) {
      current = { title: line.slice(4).trim(), body: '' }
      blocks.push(current)
      continue
    }

    if (current) {
      current.body += `${line}\n`
    }
  }

  return blocks.map(block => ({ ...block, body: block.body.trim() }))
}

function lines(markdown: string) {
  return markdown
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
}

function stripListMarker(line: string) {
  return line.replace(/^[-*]\s+/, '').trim()
}

function splitOnce(value: string, separator: RegExp) {
  const match = value.match(separator)
  if (!match?.index && match?.index !== 0) {
    return [value.trim(), ''] as const
  }
  return [
    value.slice(0, match.index).trim(),
    value.slice(match.index + match[0].length).trim(),
  ] as const
}

function splitPeriod(period: string) {
  const [start, end] = period.split('~').map(value => value.trim())
  if (!start || !end) {
    throw new Error(`Invalid resume period: ${period}`)
  }
  return { start, end }
}

function parseLinks(value: string) {
  const links: ResumeProjectLink[] = []
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g

  for (const match of value.matchAll(linkPattern)) {
    const label = match[1]?.trim()
    const url = match[2]?.trim()
    if (url) {
      links.push(label ? { label, url } : { url })
    }
  }

  return links
}

function normalizeText(markdown: string) {
  return lines(markdown).join(' ')
}

function parseSkills(markdown: string): ResumeSkillGroup[] {
  return lines(markdown).map((line) => {
    const [category, rawItems] = splitOnce(stripListMarker(line), /[:：]/)
    if (!category || !rawItems) {
      throw new Error(`Invalid skill line: ${line}`)
    }

    return {
      category,
      items: rawItems.split('、').map(item => item.trim()).filter(Boolean),
    }
  })
}

function parseExperiences(markdown: string): ResumeExperience[] {
  return splitBlocks(markdown).map((block) => {
    const [company, position, period] = block.title.split('|').map(value => value.trim())
    if (!company || !position || !period) {
      throw new Error(`Invalid experience heading: ${block.title}`)
    }

    return {
      company,
      position,
      ...splitPeriod(period),
      description: normalizeText(block.body),
    }
  })
}

function parseProjects(markdown: string): ResumeProject[] {
  return splitBlocks(markdown).map((block) => {
    const description: string[] = []
    const highlights: string[] = []
    let links: ResumeProjectLink[] | undefined
    let techStack: string | undefined

    for (const line of lines(block.body)) {
      if (line.startsWith('链接：')) {
        links = parseLinks(line.slice(3))
        continue
      }

      if (line.startsWith('技术栈：')) {
        techStack = line.slice(4).trim()
        continue
      }

      if (line.startsWith('- ')) {
        highlights.push(stripListMarker(line))
        continue
      }

      description.push(line)
    }

    return {
      name: block.title,
      description: description.join(' '),
      links,
      techStack,
      highlights,
    }
  })
}

function parseOpenSource(markdown: string): ResumeOpenSourceItem[] {
  return lines(markdown).map((line) => {
    const text = stripListMarker(line)
    const [link] = parseLinks(text)
    const description = link ? text.slice(0, text.lastIndexOf('[')).trim() : text

    return link ? { description, link: link.url } : { description }
  })
}

function parseEducation(markdown: string): ResumeEducation[] {
  return lines(markdown).map((line) => {
    const [degree, school, major, period] = stripListMarker(line).split('|').map(value => value.trim())
    if (!degree || !school || !major || !period) {
      throw new Error(`Invalid education line: ${line}`)
    }

    return {
      degree,
      school,
      major,
      ...splitPeriod(period),
    }
  })
}

function readResumeData(): ResumeData {
  const file = fs.readFileSync(resumeMarkdownPath, 'utf8')
  const { data, content } = matter(file)
  const frontmatter = data as Record<string, unknown>
  const sections = splitSections(content)

  return {
    profile: {
      name: field(frontmatter, 'name'),
      title: field(frontmatter, 'title'),
      email: field(frontmatter, 'email'),
      phone: optionalField(frontmatter, 'phone'),
      github: optionalField(frontmatter, 'github'),
      website: optionalField(frontmatter, 'website'),
    },
    skills: parseSkills(requiredSection(sections, '技术栈')),
    experiences: parseExperiences(requiredSection(sections, '工作经历')),
    projects: parseProjects(requiredSection(sections, '项目经历')),
    openSource: parseOpenSource(requiredSection(sections, '开源经历')),
    education: parseEducation(requiredSection(sections, '教育经历')),
  }
}

const resumeData = readResumeData()

export default resumeData
