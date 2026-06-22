import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Merriweather } from 'next/font/google'
import DotsBackground from '@/components/dots-background'
import SiteFooter from '@/components/site-footer'
import SiteHeader from '@/components/site-header'
import { siteConfig } from '@/lib/site'
import { generateSocialMetadata } from '@/lib/social-metadata'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const merriweather = Merriweather({
  variable: '--font-merriweather',
  weight: ['400', '700'],
  subsets: ['latin'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  weight: ['400', '500', '600'],
  subsets: ['latin'],
})

const defaultSocialMetadata = generateSocialMetadata()

export const metadata: Metadata = {
  ...defaultSocialMetadata.metadata,
  metadataBase: new URL(siteConfig.url),
  title: {
    default: defaultSocialMetadata.resolved.title,
    template: `%s — ${siteConfig.name}`,
  },
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
  const storedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = storedTheme === "dark" || (!storedTheme && prefersDark) ? "dark" : "light";
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
})();`,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${merriweather.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <DotsBackground />
          <SiteHeader />
          <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-16 pt-10">
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  )
}
