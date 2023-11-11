'use client'

import { useRouter } from 'next/navigation'
import { ChangeEvent, useEffect, useTransition } from 'react'
import debounce from 'lodash.debounce'
import { Input } from './ui/input'
import { Loader } from 'lucide-react'

type SearchProps = {
  onLoading?: (isLoading: boolean) => void
}

export default function Search({ onLoading }: SearchProps) {
  const router = useRouter()
  const [isLoading, startTransition] = useTransition()

  const handleChange = debounce((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    let query = '/'
    if (value.length > 0) {
      query = `?search=${value}`
    }

    startTransition(() => router.push(query))
  }, 300)

  useEffect(() => {
    onLoading?.(isLoading)

    return () => {
      onLoading?.(isLoading)
    }
  }, [isLoading])

  useEffect(() => {
    return () => handleChange.cancel()
  }, [handleChange])

  return (
    <div>
      {isLoading ? <Loader className='animate-spin' /> : null}
      <Input
        type='search'
        placeholder='Search...'
        className='w-64'
        onChange={handleChange}
      />
    </div>
  )
}
