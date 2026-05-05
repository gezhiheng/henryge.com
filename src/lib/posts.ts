import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import { visit } from 'unist-util-visit'
import { formatDate, formatReadingTime } from '@/lib/format'
import { siteConfig } from '@/lib/site'

export interface PostFrontmatter {
  title: string
  description: string
  date: string
  image?: string
  tags?: string[]
}

export type PostMeta = PostFrontmatter & {
  slug: string
  readingTime: string
  formattedDate: string
}

export type Post = PostMeta & {
  content: string
  contentHtml: string
}

const postsDirectory = path.join(process.cwd(), 'content')
const publicDirectory = path.join(process.cwd(), 'public')
const siteOrigin = new URL(siteConfig.url).origin

interface RehypePoint {
  line: number
  column: number
  offset?: number
}

interface RehypePosition {
  start: RehypePoint
  end: RehypePoint
}

interface RehypeNode {
  type: string
  data?: Record<string, unknown>
  position?: RehypePosition
}

interface RehypeParent extends RehypeNode {
  children: RehypeContent[]
}

interface RehypeText extends RehypeNode {
  type: 'text'
  value: string
}

interface RehypeComment extends RehypeNode {
  type: 'comment'
  value: string
}

interface RehypeDoctype extends RehypeNode {
  type: 'doctype'
}

type RehypeContent = RehypeComment | RehypeDoctype | RehypeElement | RehypeText

interface RehypeElement extends RehypeParent {
  type: 'element'
  tagName: string
  properties: Record<string, unknown>
  children: RehypeContent[]
}

interface RehypeRoot extends RehypeParent {
  type: 'root'
  children: RehypeContent[]
}

function getPostFilePaths() {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  return fs
    .readdirSync(postsDirectory)
    .filter(fileName => fileName.endsWith('.md'))
}

function getSlugFromFileName(fileName: string) {
  return fileName.replace(/\.md$/, '')
}

function versionPublicAssetSrc(src: string) {
  if (!src.startsWith('/') || src.startsWith('//')) {
    return src
  }

  const [srcWithoutHash, hash = ''] = src.split('#')
  const [pathname, search = ''] = srcWithoutHash.split('?')
  const assetPath = path.join(publicDirectory, pathname.replace(/^\/+/, ''))

  if (!fs.existsSync(assetPath)) {
    return src
  }

  const assetStat = fs.statSync(assetPath)
  if (!assetStat.isFile()) {
    return src
  }

  const params = new URLSearchParams(search)
  params.set('v', Math.trunc(assetStat.mtimeMs).toString())

  const query = params.toString()
  const hashSuffix = hash ? `#${hash}` : ''

  return `${pathname}?${query}${hashSuffix}`
}

function rehypeImageDefaults() {
  return (tree: RehypeRoot) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'img') {
        return
      }

      const src = typeof node.properties?.src === 'string'
        ? versionPublicAssetSrc(node.properties.src)
        : node.properties?.src
      const ariaLabel = typeof node.properties?.alt === 'string' && node.properties.alt
        ? `查看大图：${node.properties.alt}`
        : '查看图片大图'

      node.properties = {
        ...node.properties,
        src,
        loading: 'lazy',
        decoding: 'async',
        className: ['post-image'],
        role: 'button',
        tabIndex: 0,
        ...{ 'aria-label': ariaLabel },
      }
    })
  }
}

function isElementNode(node: RehypeContent): node is RehypeElement {
  return node.type === 'element'
}

function isWhitespaceTextNode(node: RehypeContent): node is RehypeText {
  return node.type === 'text' && node.value.trim() === ''
}

function extractGalleryImages(node: RehypeElement) {
  if (node.tagName !== 'p') {
    return []
  }

  const images: RehypeElement[] = []

  for (const child of node.children) {
    if (isWhitespaceTextNode(child)) {
      continue
    }

    if (isElementNode(child) && child.tagName === 'img') {
      images.push(child)
      continue
    }

    return []
  }

  return images.length > 1 ? images : []
}

function toStringTokenArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string')
  }

  if (typeof value === 'string') {
    return value.split(/\s+/).filter(Boolean)
  }

  return []
}

function appendClassName(node: RehypeElement, className: string) {
  const classNames = toStringTokenArray(node.properties?.className)

  if (!classNames.includes(className)) {
    classNames.push(className)
  }

  node.properties = {
    ...(node.properties ?? {}),
    className: classNames,
  }
}

function isExternalHref(href: string) {
  try {
    const url = new URL(href, siteConfig.url)
    return (url.protocol === 'http:' || url.protocol === 'https:') && url.origin !== siteOrigin
  }
  catch {
    return false
  }
}

function rehypeExternalLinks() {
  return (tree: RehypeRoot) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'a') {
        return
      }

      const href = typeof node.properties?.href === 'string'
        ? node.properties.href
        : ''

      if (!href || !isExternalHref(href)) {
        return
      }

      const relTokens = toStringTokenArray(node.properties?.rel)

      for (const rel of ['noopener', 'noreferrer']) {
        if (!relTokens.includes(rel)) {
          relTokens.push(rel)
        }
      }

      appendClassName(node, 'external-link')
      node.properties = {
        ...(node.properties ?? {}),
        target: '_blank',
        rel: relTokens,
      }
    })
  }
}

function rehypeHorizontalGallery() {
  return (tree: RehypeRoot) => {
    visit(tree, 'element', (node, index, parent) => {
      if (typeof index !== 'number' || !parent) {
        return
      }

      const images = extractGalleryImages(node)
      if (images.length < 2) {
        return
      }

      const gallery: RehypeElement = {
        type: 'element',
        tagName: 'div',
        properties: {
          'className': ['post-gallery'],
          'tabIndex': 0,
          'role': 'region',
          'aria-label': 'Horizontal image gallery',
        },
        children: images.map((image) => {
          appendClassName(image, 'post-gallery-image')

          return {
            type: 'element',
            tagName: 'figure',
            properties: {
              className: ['post-gallery-item'],
            },
            children: [image],
          }
        }),
      }

      parent.children[index] = gallery
    })
  }
}

export function getAllPosts(): PostMeta[] {
  const fileNames = getPostFilePaths()

  const posts = fileNames.map((fileName) => {
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    const slug = getSlugFromFileName(fileName)
    const stats = readingTime(content)

    return {
      slug,
      title: String(data.title),
      description: String(data.description),
      date: String(data.date),
      image: typeof data.image === 'string' ? data.image : undefined,
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      readingTime: formatReadingTime(stats.minutes),
      formattedDate: formatDate(String(data.date)),
    }
  })

  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

export function getPostBySlug(slug: string): Post | null {
  const normalizedSlug = decodeURIComponent(slug).replace(/\.md$/, '')
  const fullPath = path.join(postsDirectory, `${normalizedSlug}.md`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  const stats = readingTime(content)

  const processedContent = remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: 'wrap',
      properties: {
        className: ['heading-anchor'],
      },
    })
    .use(rehypeImageDefaults)
    .use(rehypeExternalLinks)
    .use(rehypeHorizontalGallery)
    .use(rehypeStringify)
    .processSync(content)
    .toString()

  return {
    slug: normalizedSlug,
    title: String(data.title),
    description: String(data.description),
    date: String(data.date),
    image: typeof data.image === 'string' ? data.image : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    readingTime: formatReadingTime(stats.minutes),
    formattedDate: formatDate(String(data.date)),
    content,
    contentHtml: processedContent,
  }
}
