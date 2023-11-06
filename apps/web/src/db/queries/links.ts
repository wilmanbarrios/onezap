import { desc, eq } from 'drizzle-orm'
import { db } from '..'
import { links } from '../schema'

export async function fetchLinks(userId?: string) {
  if (!userId) {
    return Promise.resolve([])
  }

  return await db
    .select({
      nanoId: links.nanoId,
      url: links.url,
      title: links.title,
      description: links.description,
      favIconUrl: links.favIconUrl,
      createdAt: links.createdAt,
    })
    .from(links)
    .where(eq(links.userId, userId))
    .orderBy(desc(links.createdAt))
}
