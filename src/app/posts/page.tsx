import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import { cn, enterStage } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Posts',
  description: 'Where I share thoughts, life, and more.'
}

export default function PostsPage () {
  const posts = getAllPosts()
  const postsByYear = posts.reduce<Record<string, typeof posts>>(
    (grouped, post) => {
      const year = new Date(post.date).getFullYear().toString()
      if (!grouped[year]) {
        grouped[year] = []
      }
      grouped[year].push(post)
      return grouped
    },
    {}
  )
  const years = Object.keys(postsByYear).sort((a, b) => Number(b) - Number(a))

  return (
    <div className='space-y-12 min-h-screen max-w-2xl mx-auto overflow-y-clip'>
      <div className='page-enter space-y-3' id='archive' style={enterStage(1)}>
        <h1 className='text-3xl font-semibold md:text-4xl'>Posts</h1>
        <p className='text-base text-muted-foreground'>
          Where i share thoughts, life, and more.
        </p>
      </div>

      <div className='space-y-12 md:space-y-18'>
        {years.map((year, index) => (
          <section
            key={year}
            style={enterStage(index + 2)}
            className={cn(
              'page-enter relative pt-4 md:pt-6',
              postsByYear[year].length === 1 && 'pb-0 md:pb-8'
            )}
          >
            <div className='pointer-events-none absolute -top-4 -left-5 -z-10 text-[5rem] font-semibold leading-none tracking-tight text-foreground/3 dark:text-foreground/8 md:-top-7 md:-left-10 lg:-left-12 md:text-[7.5rem]'>
              {year}
            </div>
            <div className='relative z-10 space-y-6'>
              {postsByYear[year].map(post => (
                <article key={post.slug} className='space-y-2'>
                  <div className='flex md:flex-row flex-col flex-wrap items-baseline gap-3'>
                    <Link
                      href={`/posts/${post.slug}`}
                      className='text-lg font-medium text-foreground transition-colors hover:text-muted-foreground'
                    >
                      {post.title}
                    </Link>
                    <span className='text-xs text-muted-foreground'>
                      {post.formattedDate}
                      {' '}
                      ·
                      {' '}
                      {post.readingTime}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
