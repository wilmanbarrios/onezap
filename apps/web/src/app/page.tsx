import { deleteLink } from '@/actions/links'
import LinkList from '@/components/links-list'
import { fetchLinks } from '@/db/queries/links'
import { currentUser } from '@clerk/nextjs/server'

type SearchParams = {
  searchParams: {
    search?: string
  }
}

export default async function Home({ searchParams }: SearchParams) {
  const { search } = searchParams
  const user = await currentUser()
  const items = await fetchLinks(user?.id, search)

  async function manageItem(formData: FormData) {
    'use server'
    const intent = formData.get('intent') as string
    const linkId = formData.get('linkId') as string

    if (!intent) {
      return { ok: false, message: 'No intent provided!' }
    }
    if (!linkId) {
      return { ok: false, message: 'No link provided!' }
    }

    if (intent === 'delete-link') {
      return await deleteLink(linkId)
    }
  }

  return (
    <main className='px-5 py-6'>
      <LinkList items={items} />
    </main>
  )
}
