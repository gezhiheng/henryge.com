import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { enterStage } from '@/lib/utils'
import projects, { tagStyles } from './projects-array'

interface Project {
  title: string
  href: string
  tags: string[]
  description?: string
  img?: string
}

export const metadata: Metadata = {
  title: 'Projects',
  description: `A collection of projects I&apos;m working on and have worked on.`
}

export default function ProjectsPage () {
  return (
    <div className='space-y-12 min-h-screen max-w-2xl mx-auto overflow-y-clip'>
      <div className='page-enter space-y-3' id='archive' style={enterStage(1)}>
        <h1 className='text-3xl font-semibold md:text-4xl'>Projects</h1>
        <p className='text-base text-muted-foreground'>
          A collection of projects I&apos;m working on and have worked on.
        </p>
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {projects.map((project: Project, index) => (
          <Link
            key={project.title}
            href={project.href}
            target='_blank'
            rel='noopener noreferrer'
            className='page-enter group'
            style={enterStage(index + 2)}
          >
            <Card className='flex h-full flex-col overflow-hidden border-border/60 bg-card/60 transition-shadow hover:shadow-md'>
              {project.img && (
                <div className='relative w-full aspect-video border-b border-border/60'>
                  <Image
                    src={project.img}
                    alt={project.title}
                    fill
                    className='object-cover'
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className='text-lg group-hover:underline underline-offset-4'>
                  {project.title}
                </CardTitle>
                <CardDescription className='line-clamp-3'>
                  {project.description ?? ''}
                </CardDescription>
              </CardHeader>
              <CardContent className='mt-auto'>
                <div className='flex flex-wrap gap-2'>
                  {project.tags.map(tag => (
                    <Badge
                      key={tag}
                      variant='outline'
                      className={
                        tagStyles[tag]
                        ?? 'border-border/60 bg-muted/40 text-muted-foreground dark:bg-muted/20'
                      }
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
