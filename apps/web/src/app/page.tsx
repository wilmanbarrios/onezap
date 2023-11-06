import { createLink, deleteLink } from '@/actions/links'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchLinks } from '@/db/queries/links'
import { ClerkLoaded, ClerkLoading, UserButton } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'
import { X } from 'lucide-react'

export default async function Home() {
  const user = await currentUser()
  const items = await fetchLinks(user?.id)

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
    <div>
      <header className='flex items-center justify-between px-5 py-6 border-b border-black/5'>
        <Link href='/' className='text-2xl font-extralight'>
          ⚡<span className='italic'>One</span>Zap
        </Link>

        <nav>
          <ul className='flex items-center justify-between space-x-4'>
            {user ? (
              <>
                <li>
                  <Input
                    type='search'
                    placeholder='Search...'
                    className='w-72'
                  />
                </li>
                <li className='w-8 h-8'>
                  <ClerkLoading>
                    <Skeleton className='w-full h-full rounded-full' />
                  </ClerkLoading>
                  <ClerkLoaded>
                    <UserButton afterSignOutUrl='/' />
                  </ClerkLoaded>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Button asChild>
                    <Link href='/sign-in'>Sign in</Link>
                  </Button>
                </li>
                <li>
                  <Button asChild variant='ghost'>
                    <Link href='/sign-up'>Sign up</Link>
                  </Button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>

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
                  <div className='relative w-4 h-4 mr-4'>
                    {item.favIconUrl ? (
                      <img
                        src={item.favIconUrl}
                        alt={item.title || 'site icon'}
                        width={16}
                        height={16}
                      />
                    ) : (
                      <Skeleton className='w-full h-full rounded-full' />
                    )}
                  </div>
                  {item.title ? (
                    <div>{item.title}</div>
                  ) : (
                    <Skeleton className='h-4 w-72' />
                  )}
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
    </div>
  )
}
