import NewArticles from './NewArticles'
import { fetchMongoBlogs, blogCoverSrc } from '@/libs/blogs/mongo'

interface Blog {
  id: number | string
  title: string
  slug: string
  coverImage: string
  metaDescription?: string
  createdAt?: string
  date: string
  excerpt?: string
}

const WP_API =
  process.env.NEXT_PUBLIC_WP_API_URL || 'https://wp.reifexa.de/wp-json/wp/v2'

export default async function BlogsPage({ limit = 8 }: { limit?: number }) {
  let blogs: Blog[] = []

  try {
    const { blogs: mongoBlogs } = await fetchMongoBlogs({ page: 1, limit })
    if (mongoBlogs.length > 0) {
      blogs = mongoBlogs.map(post => ({
        id: post._id,
        slug: post.slug,
        title: post.title,
        date: post.createdAt,
        excerpt: post.metaDescription || '',
        coverImage: blogCoverSrc(post.coverImage),
      }))
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.warn('[Mongo] Blog fetch skipped:', msg)
  }

  if (blogs.length === 0) {
    try {
      const res = await fetch(`${WP_API}/posts?per_page=${limit}&_embed`, {
        next: { revalidate: 60 },
      })

      if (res.ok) {
        const data = await res.json()
        blogs = data.map(
          (post: {
            id: number
            slug: string
            title?: { rendered?: string }
            date?: string
            excerpt?: { rendered?: string }
            _embedded?: {
              'wp:featuredmedia'?: { source_url?: string }[]
            }
          }) => ({
            id: post.id,
            slug: post.slug,
            title: post.title?.rendered || '',
            date: post.date || '',
            excerpt: post.excerpt?.rendered || '',
            coverImage:
              post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
          })
        )
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error)
      console.warn('[WP] Blog fetch skipped:', msg)
    }
  }

  return <NewArticles blogs={blogs} />
}
