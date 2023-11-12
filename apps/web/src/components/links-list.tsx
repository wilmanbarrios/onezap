'use client'

import { Link } from '@/db/queries/links'
import { useOptimistic, useRef } from 'react'
import FavIcon from './fav-icon'
import { Loader, Plus, X } from 'lucide-react'
import { createLink, deleteLink } from '@/actions/links'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { diffForHumans } from '@/utils/dates'

type OptimisticLink = Link & {
  optimistic: boolean
  action: 'create' | 'delete'
}

type LinkListProps = {
  items: OptimisticLink[]
}

export default function LinkList({ items }: LinkListProps) {
  const [optimisticItems, addOptimisticItem] = useOptimistic<
    OptimisticLink[],
    { newItem?: string; id?: string; action: OptimisticLink['action'] }
  >(items, (state, { newItem, id, action }) => {
    switch (action) {
      case 'create': {
        return [
          { nanoId: Date.now(), url: newItem, optimistic: true },
          ...state,
        ]
      }
      case 'delete': {
        return state.filter((item) => item.nanoId !== id)
      }
    }
  })
  const formRef = useRef<HTMLFormElement>(null)
  const lastItem = optimisticItems[0].optimistic
    ? optimisticItems[1]
    : optimisticItems[0]

  async function handleCreate(formData: FormData) {
    const url = formData.get('url') as string

    if (!url) {
      return { ok: false, message: 'No link provided!' }
    }

    addOptimisticItem({ newItem: url, action: 'create' })
    formRef.current?.reset()

    await createLink(url)
  }

  async function handleDelete(formData: FormData) {
    const linkId = formData.get('linkId') as string

    if (!linkId) {
      return { ok: false, message: 'No link provided!' }
    }

    addOptimisticItem({ id: linkId, action: 'delete' })

    await deleteLink(linkId)
  }

  return (
    <section>
      <form
        ref={formRef}
        action={handleCreate}
        className='flex w-full items-center space-x-2'
      >
        <Input type='text' name='url' placeholder='URL...' />
        <Button type='submit' className='ml-4'>
          <Plus className='mr-2 h-4 w-4' /> Add
        </Button>
      </form>

      <div className='mt-5 text-zinc-500 flex items-baseline justify-start '>
        <p className='text-lg font-light'>{optimisticItems.length} links</p>
        <p className='text-sm ml-4 mr-1'>last modified</p>
        <time className='text-sm' dateTime={lastItem.createdAt.toISOString()}>
          {diffForHumans(lastItem.createdAt)}
        </time>
      </div>

      <ul className='mt-2 text-sm space-y-1.5'>
        {optimisticItems.map((item) => (
          <li key={item.nanoId} className='group'>
            <div className='flex items-center justify-start'>
              <div className='relative inline-flex items-center w-5 h-5 mx-1'>
                {item.optimistic ? (
                  <Loader className='animate-spin absolute w-full h-full' />
                ) : (
                  <FavIcon
                    url={item.favIconUrl}
                    alt={item.title || 'site icon'}
                  />
                )}
              </div>
              <a
                href={item.url}
                target='_blank'
                referrerPolicy='no-referrer'
                className='truncate ml-3 w-full h-5'
              >
                <span>{item.title || item.url}</span>{' '}
              </a>
              <div className='invisible group-hover:visible mx-1'>
                <form action={handleDelete} className='flex'>
                  <button type='submit' name='linkId' value={item.nanoId}>
                    <X className='w-5 h-5 text-black/60' />
                  </button>
                </form>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
