import Image from 'next/image'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { getAllPosts } from '../lib/posts'

export default function Home() {
  const posts = getAllPosts()
  const latestPosts = posts.slice(0, 3)

  return (
    <div className="mx-auto max-w-2xl space-y-12">
      <section className="space-y-5 text-pretty md:space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-3xl font-semibold md:text-4xl">
            Henry Ge
          </h1>
          <Image
            src="/avatar.svg"
            alt="Henry Ge avatar"
            width={44}
            height={44}
            className="rounded-full border border-border/60"
            priority
          />
        </div>
        <p className="text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
          <span>离开世界之前，一切都是过程。</span>
        </p>
        <p className="text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
          <span>Hey! 我是葛智恒，A.K.A. Henry Ge，目前是一名全栈开发工程师。</span>
        </p>
        <p className="text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
          <span>目前在做 AI Native 全栈，偶尔参与开源。早期从事 Java 后端开发，后转向前端方向，也曾在创业公司独立负责过项目。</span>
        </p>
        <p className="text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
          <span>我一直以来的观念是「不给自己设限」，所以有什么感兴趣的技术都会接触。比如曾经学过一段时间 Rust，很喜欢它明确语义的设计哲学和优雅的错误处理。</span>
        </p>
        <p className="text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
          <span>代码之外和工作之余，我喜欢打游戏、追番、阅读、打篮球、看球赛和弹尤克里里。喜欢的书包括《只是为了好玩》、《哈利·波特》和《明朝那些事儿》。另外我还是斯蒂芬库里和金州勇士的忠实球迷，Let&apos;s go Warriors!</span>
        </p>
        <p className="text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
          <span>目前在不断探索与尝试，希望找到一个真正热爱的方向，长期投入，同时也保留对生活本身的感受与享受。</span>
        </p>
      </section>

      <Separator />

      <section className="space-y-6" id="archive">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">最近</h2>
          </div>
          <Link
            href="/posts"
            className="text-sm text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
          >
            查看全部
          </Link>
        </div>
        <div className="space-y-6">
          {latestPosts.map(post => (
            <article key={post.slug} className="space-y-1">
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
                <span className="text-xs text-muted-foreground">
                  {post.formattedDate}
                </span>
                <Link
                  href={`/posts/${post.slug}`}
                  className="text-lg font-semibold text-foreground transition-colors hover:text-muted-foreground"
                >
                  {post.title}
                </Link>
              </div>
              <p className="text-sm text-muted-foreground">
                {post.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
