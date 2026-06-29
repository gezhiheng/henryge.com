import type { ReactNode } from 'react'
import type { ResumeData } from './resume-data'
import { Download } from 'lucide-react'
import { Fragment } from 'react'
import { parseInlineMarkdown } from './resume-data'

const paperClass = 'resume-paper relative min-h-screen bg-white px-5 py-6 dark:bg-[#fafafa] md:min-h-0 md:border md:border-[#dcdcdc] md:px-12 md:py-10 md:shadow-[0_1px_1px_rgba(0,0,0,0.03),0_6px_18px_rgba(0,0,0,0.05),0_28px_56px_rgba(0,0,0,0.06)] md:dark:border-[#dcdcdc] md:dark:shadow-[0_8px_32px_rgba(0,0,0,0.45)]'
const sectionTitleClass = 'border-b border-[#dcdcdc] pb-1 text-[17px] font-bold tracking-wide text-[#202124] sm:text-[18px]'
const bodyTextClass = 'break-words text-[14px] leading-[1.65] text-[#555] sm:text-[13px]'
const linkClass = 'break-all text-[#1a56db] no-underline transition-colors hover:text-[#1446b8] hover:underline sm:break-normal'

function renderInlineText(text: string) {
  return parseInlineMarkdown(text).map(part => (
    part.strong
      ? <strong key={`strong-${part.offset}`} className='font-semibold text-[#252525]'>{part.text}</strong>
      : part.text
  ))
}

function inlineTextKey(text: string) {
  return parseInlineMarkdown(text).map(part => part.text).join('')
}

export default function ResumeView({
  resumeData,
  pdfHref,
}: {
  resumeData: ResumeData
  pdfHref: string
}) {
  const { profile, skills, experiences, projects, openSource, education } = resumeData

  const contactItems: Array<{ key: string, node: ReactNode }> = []

  if (profile.phone) {
    contactItems.push({ key: 'phone', node: <span>{profile.phone}</span> })
  }
  if (profile.email) {
    contactItems.push({
      key: 'email',
      node: (
        <a href={`mailto:${profile.email}`} className={linkClass}>
          {profile.email}
        </a>
      ),
    })
  }
  if (profile.github) {
    contactItems.push({
      key: 'github',
      node: (
        <a
          href={`https://${profile.github}`}
          target='_blank'
          rel='noopener noreferrer'
          className={linkClass}
        >
          {profile.github}
        </a>
      ),
    })
  }
  if (profile.website) {
    contactItems.push({
      key: 'website',
      node: (
        <a
          href={`https://${profile.website}`}
          target='_blank'
          rel='noopener noreferrer'
          className={linkClass}
        >
          {profile.website}
        </a>
      ),
    })
  }

  return (
    <div>
      <div className='resume-toolbar'>
        <a href={pdfHref} download className='download-pdf' aria-label='下载 PDF' title='下载 PDF'>
          <Download aria-hidden='true' strokeWidth={2} />
          <span className='download-pdf-label'>下载 PDF</span>
        </a>
      </div>

      <article className={paperClass}>
        <header>
          <h1 className='border-b border-[#e4e4e4] pb-1 text-[26px] font-bold leading-tight tracking-tight text-[#202124]'>
            {profile.name}
          </h1>
          <p className='mt-2 text-[15px] text-[#4b4b4b] sm:text-[14px]'>{profile.title}</p>
          <div className='mt-2 grid gap-y-1.5 text-[14px] text-[#555] sm:flex sm:flex-wrap sm:items-center sm:text-[13px]'>
            {contactItems.map((item, index) => (
              <Fragment key={item.key}>
                {index > 0 && (
                  <span className='mx-2.5 hidden text-[#ccc] sm:inline' aria-hidden='true'>
                    ·
                  </span>
                )}
                {item.node}
              </Fragment>
            ))}
          </div>
        </header>

        <section className='mt-6 md:mt-5'>
          <h2 className={sectionTitleClass}>技术栈</h2>
          <div className='mt-3 space-y-2'>
            {skills.map(group => (
              <div key={group.category} className='grid gap-1 sm:grid-cols-[max-content_1fr] sm:gap-x-3'>
                <span className='text-[14px] font-semibold text-[#252525] sm:text-[13px]'>
                  {group.category}
                  ：
                </span>
                <span className={bodyTextClass}>{renderInlineText(group.items.join('、'))}</span>
              </div>
            ))}
          </div>
        </section>

        <section className='mt-6'>
          <h2 className={sectionTitleClass}>工作经历</h2>
          <div className='mt-3 space-y-4'>
            {experiences.map(exp => (
              <div key={`${exp.company}-${exp.start}`} className='space-y-1'>
                <div className='flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between'>
                  <h3 className='text-[14px] font-bold text-[#202124] sm:text-[13px]'>
                    {exp.company}
                    {' '}
                    |
                    {' '}
                    {exp.position}
                  </h3>
                  <span className='shrink-0 text-[14px] tabular-nums text-[#666] sm:text-[13px]'>
                    {exp.start}
                    {' '}
                    ~
                    {' '}
                    {exp.end}
                  </span>
                </div>
                <p className={bodyTextClass}>{renderInlineText(exp.description)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className='mt-6'>
          <h2 className={sectionTitleClass}>项目经历</h2>
          <div className='mt-3 space-y-4'>
            {projects.map(project => (
              <div key={project.name} className='space-y-1.5'>
                <div className='flex flex-wrap items-baseline gap-x-2 gap-y-1'>
                  <h3 className='text-[14px] font-bold text-[#202124] sm:text-[13px]'>{project.name}</h3>
                  {project.description && (
                    <span className='text-[14px] text-[#333] sm:text-[13px]'>{renderInlineText(project.description)}</span>
                  )}
                  {project.links?.map(link => (
                    <a
                      key={link.url}
                      href={link.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className={`text-[14px] sm:text-[13px] ${linkClass}`}
                    >
                      |
                      {' '}
                      {link.label ?? (link.url.includes('github.com') ? 'GitHub' : link.url.includes('npmjs.com') ? 'npm' : '介绍')}
                    </a>
                  ))}
                </div>
                {project.techStack && (
                  <p className='wrap-break-word text-[13px] leading-snug text-[#777] sm:text-[12px]'>{renderInlineText(project.techStack)}</p>
                )}
                {project.highlights && project.highlights.length > 0 && (
                  <ul className='space-y-1.5 pl-4'>
                    {project.highlights.map(highlight => (
                      <li key={inlineTextKey(highlight)} className={`${bodyTextClass} list-none before:mr-2 before:text-[#999] before:content-["•"]`}>
                        {renderInlineText(highlight)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className='mt-6'>
          <h2 className={sectionTitleClass}>开源经历</h2>
          <ul className='mt-3 space-y-2 pl-4'>
            {openSource.map(item => (
              <li key={inlineTextKey(item.description)} className={`${bodyTextClass} list-none before:mr-2 before:text-[#999] before:content-["•"]`}>
                {renderInlineText(item.description)}
                {item.link && (
                  <>
                    {' '}
                    <a
                      href={item.link}
                      target='_blank'
                      rel='noopener noreferrer'
                      className={linkClass}
                    >
                      |
                      {' '}
                      {item.link.includes('npmjs.com') ? 'npm' : 'GitHub'}
                    </a>
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className='mt-6'>
          <h2 className={sectionTitleClass}>教育经历</h2>
          <div className='mt-3 flex flex-wrap gap-x-2 gap-y-1'>
            {education.map(edu => (
              <div key={edu.school} className='flex flex-wrap items-center gap-x-2'>
                <span className='text-[14px] text-[#555] sm:text-[13px]'>{edu.degree}</span>
                <span className='text-[14px] text-[#555] sm:text-[13px]'>{edu.school}</span>
                <span className='text-[14px] text-[#555] sm:text-[13px]'>{edu.major}</span>
                <span className='text-[14px] tabular-nums text-[#555] sm:text-[13px]'>
                  {edu.start}
                  {' '}
                  ~
                  {' '}
                  {edu.end}
                </span>
              </div>
            ))}
          </div>
        </section>
      </article>
    </div>
  )
}
