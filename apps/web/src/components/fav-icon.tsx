'use client'

import Image from 'next/image'

type FavIconProps = {
  url: string | null
  alt: string
}

export default function FavIcon({ url, alt }: FavIconProps) {
  if (!url) {
    return null
  }

  return (
    <Image src={url} alt={alt} width={16} height={16} className='inset-0' />
  )
}
