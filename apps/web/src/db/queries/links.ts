import { SQL, and, desc, eq, like } from 'drizzle-orm'
import { db } from '..'
import { links } from '../schema'

export async function fetchLinks(userId?: string, search?: string) {
  if (!userId) {
    return Promise.resolve([])
  }
  const condition: SQL[] = []

  // TODO: I probably need to add an index to this to make it faster
  condition.push(eq(links.userId, userId))

  if (search?.length) {
    // TODO: this needs to be able to filter in a case insensitive
    // TODO: I probably need to add an index to this to make it faster
    condition.push(like(links.url, `%${search}%`))
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
    .where(and(...condition))
    .orderBy(desc(links.createdAt))
}

async function link() {
  const link = await db.select().from(links).limit(1)
  return link[0]
}

export type Link = Awaited<ReturnType<typeof link>>
