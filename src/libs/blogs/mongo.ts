import { getApiBase } from '@/libs/seo/site'

export type ContentBlock =
  | {
      type: 'heading'
      level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
      text?: string
      items?: string[]
    }
  | {
      type: 'paragraph'
      text?: string
      items?: string[]
    }
  | {
      type: 'list'
      style?: 'ul' | 'ol'
      items?: string[]
      text?: string
    }

export type MongoBlog = {
  _id: string
  title: string
  slug: string
  coverImage?: string
  tags?: string[]
  metaDescription?: string
  contentBlocks?: ContentBlock[][]
  createdAt: string
  updatedAt?: string
}

export type MongoBlogListResponse = {
  blogs: MongoBlog[]
  total: number
}

export const BLOGS_PER_PAGE = 12

function apiBase() {
  return getApiBase().replace(/\/$/, '')
}

export async function fetchMongoBlogs(opts: {
  page?: number
  limit?: number
  search?: string
} = {}): Promise<MongoBlogListResponse> {
  const page = opts.page ?? 1
  const limit = opts.limit ?? 12
  const search = opts.search
    ? `&search=${encodeURIComponent(opts.search)}`
    : ''

  try {
    const res = await fetch(
      `${apiBase()}/api/blogs/list?page=${page}&limit=${limit}${search}`,
      { next: { revalidate: 30 } }
    )
    if (!res.ok) return { blogs: [], total: 0 }
    const data = (await res.json()) as MongoBlogListResponse
    return {
      blogs: Array.isArray(data.blogs) ? data.blogs : [],
      total: Number(data.total) || 0,
    }
  } catch {
    return { blogs: [], total: 0 }
  }
}

export async function fetchMongoBlogBySlug(
  slug: string
): Promise<MongoBlog | null> {
  try {
    const res = await fetch(
      `${apiBase()}/api/blogs/slug/${encodeURIComponent(slug)}`,
      { cache: 'no-store' }
    )
    if (!res.ok) return null
    return (await res.json()) as MongoBlog
  } catch {
    return null
  }
}

export function blogCoverSrc(coverImage?: string) {
  if (!coverImage) return ''
  const trimmed = coverImage.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
}
