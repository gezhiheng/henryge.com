/* eslint-disable react-refresh/only-export-components */
import { getRecentPosts } from '@/lib/posts'
import { siteConfig } from '@/lib/site'
import {
  createSocialCardImage,
  SOCIAL_CARD_CONTENT_TYPE,
  SOCIAL_CARD_SIZE,
} from '@/lib/social-card'

export const runtime = 'nodejs'
export const contentType = SOCIAL_CARD_CONTENT_TYPE
export const size = SOCIAL_CARD_SIZE

export async function GET() {
  const latestPosts = getRecentPosts()

  return createSocialCardImage({
    variant: 'home',
    title: 'Henry Ge',
    description: siteConfig.description,
    latestPosts,
  })
}
