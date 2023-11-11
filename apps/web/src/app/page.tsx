import { createLink, deleteLink } from '@/actions/links'
import FavIcon from '@/components/fav-icon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { fetchLinks } from '@/db/queries/links'
import { currentUser } from '@clerk/nextjs/server'
import { X } from 'lucide-react'

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
    <main className='px-5 pt-5'>
      <section>
        <form
          action={createLink}
          className='flex items-center justify-start w-[400px]'
        >
          <Input type='text' name='url' placeholder='URL...' />
          <Button type='submit' className='ml-4'>
            Add
          </Button>
        </form>

        <ul className='mt-5 text-sm space-y-1'>
          {items.map((item) => (
            <li key={item.nanoId} className='group'>
              <div className='flex items-center justify-start'>
                <FavIcon
                  url={item.favIconUrl}
                  alt={item.title || 'site icon'}
                />
                <div>{item.title || item.url}</div>
                <div className='hidden group-hover:block ml-2'>
                  <form action={manageItem} className='flex'>
                    <input type='hidden' name='linkId' value={item.nanoId} />
                    <button type='submit' name='intent' value='delete-link'>
                      <X className='w-4 h-4' />
                    </button>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
