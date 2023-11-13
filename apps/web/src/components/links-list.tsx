'use client'

import { Link } from '@/db/queries/links'
import { useMemo, useOptimistic, useRef } from 'react'
import FavIcon from './fav-icon'
import { Hourglass, Link as LinkIcon, Loader, X } from 'lucide-react'
import { createLink, deleteLink } from '@/actions/links'
import { Input } from './ui/input'
import { diffForHumans } from '@/utils/dates'
import groupBy from 'lodash.groupby'
import { format, isToday } from 'date-fns'

type OptimisticLink = Pick<
  Link,
  'nanoId' | 'url' | 'title' | 'description' | 'favIconUrl' | 'createdAt'
> & {
  optimistic?: boolean
}

type CreateAction = {
  action: 'create'
  url: string
}

type DeleteAction = {
  action: 'delete'
  nanoId: string
}

type OptimisticItemsReducer = CreateAction | DeleteAction

type LinkListProps = {
  items: OptimisticLink[]
}

export default function LinkList({ items }: LinkListProps) {
  const [optimisticItems, addOptimisticItem] = useOptimistic<
    OptimisticLink[],
    OptimisticItemsReducer
  >(items, (state, reducer) => {
    switch (reducer.action) {
      case 'create': {
        return [
          {
            id: Date.now(),
            nanoId: Date.now().toString(),
            title: null,
            description: null,
            url: reducer.url,
            favIconUrl: null,
            userId: null,
            group: null,
            createdAt: new Date(),
            updatedAt: null,
            optimistic: true,
          },
          ...state,
        ]
      }
      case 'delete': {
        return state.filter((item) => item.nanoId !== reducer.nanoId)
      }
    }
  })
  const formRef = useRef<HTMLFormElement>(null)
  const itemsGrouped = useMemo(() => {
    const grouping = groupBy(optimisticItems, (item) =>
      format(item.createdAt, 'yyyy-MM-dd')
    )
    return Object.entries(grouping).map(([, v]) => v)
  }, [optimisticItems])

  const lastItem = optimisticItems[0].optimistic
    ? optimisticItems[1]
    : optimisticItems[0]

  async function handleCreate(formData: FormData) {
    const url = formData.get('url') as string

    if (!url) {
      return { ok: false, message: 'No link provided!' }
    }

    addOptimisticItem({ url, action: 'create' })
    formRef.current?.reset()

    await createLink(url)
  }

  async function handleDelete(formData: FormData) {
    const linkId = formData.get('linkId') as string

    if (!linkId) {
      return { ok: false, message: 'No link provided!' }
    }

    addOptimisticItem({ nanoId: linkId, action: 'delete' })

    await deleteLink(linkId)
  }

  return (
    <section>
      <div className='flex items-baseline justify-start font-extralight text-2xl mb-6'>
        <p className=''>{optimisticItems.length} zaps</p>
        {!isToday(lastItem.createdAt) ? (
          <>
            <p className='text-sm ml-4 mr-1'>last added</p>
            <time
              className='text-sm'
              dateTime={lastItem.createdAt.toISOString()}
            >
              {diffForHumans(lastItem.createdAt)}
            </time>
          </>
        ) : null}
      </div>

      <form
        ref={formRef}
        action={handleCreate}
        className='flex w-full items-center space-x-2'
      >
        <Input type='text' name='url' placeholder='Add URL...' />
      </form>

      <div className='text-sm'>
        {itemsGrouped.map((group, index) => (
          <div key={index} className='mt-5'>
            <div className='flex align-baseline font-extralight text-lg justify-start space-x-2'>
              <div className='ml-1.5 inline-flex items-center mr-1'>
                <LinkIcon className='w-4 h-4 mr-1.5' />
                <p>{group.length} links</p>
              </div>
              <div className='flex items-center text-base'>
                <Hourglass className='w-4 h-4 mr-1.5 text-zinc-500' />
                <time
                  className='lowercase'
                  dateTime={group[0].createdAt.toISOString()}
                >
                  {diffForHumans(group[0].createdAt)}
                </time>
              </div>
            </div>
            <ul className='mt-2 space-y-1.5'>
              {group.map((item) => (
                <li key={item.nanoId} className='group'>
                  <div className='flex'>
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
                      className='ml-3 w-full h-5 truncate'
                    >
                      {item.title || item.url}
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
          </div>
        ))}
      </div>
    </section>
  )
}
