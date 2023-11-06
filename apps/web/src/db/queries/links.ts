import { desc } from 'drizzle-orm'
import { db } from '..'
import { links } from '../schema'

export async function fetchLinks() {
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
    .orderBy(desc(links.createdAt))
}
