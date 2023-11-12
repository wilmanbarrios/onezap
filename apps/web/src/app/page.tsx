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

  return (
    <main className='px-5 py-6'>
      <LinkList items={items} />
    </main>
  )
}
