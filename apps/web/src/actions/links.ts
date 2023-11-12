'use server'

import { db } from '@/db'
import { links } from '@/db/schema'
import { createLinkSchema } from '@/db/validators/links'
import { generatePublicId } from '@/utils/nanoid'
import { extractSEO } from '@/utils/seo'
import { currentUser } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function createLink(item: string) {
  const user = await currentUser()
  if (!user) {
    return { ok: false, message: 'Not user found!' }
  }

  const { url } = createLinkSchema.parse({
    url: item,
  })

  const seo = await extractSEO(url)

  const { title, description, favIconUrl } = createLinkSchema.parse({
    ...seo,
    url,
  })

  await db.insert(links).values({
    nanoId: generatePublicId(),
    userId: user.id,
    url,
    title,
    description,
    favIconUrl,
  })

  revalidatePath('/')

  return { ok: true, message: 'New link added!' }
}

export async function deleteLink(linkId: string) {
  try {
    await db.delete(links).where(eq(links.nanoId, linkId))

    revalidatePath('/')

    return { ok: true, message: 'Link was deleted!' }
  } catch (err: any) {
    return { ok: false, message: err.message, context: { err } }
  }
}
