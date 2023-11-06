import parse from 'node-html-parser'
import { fetch } from 'undici'

export async function extractSEO(url: string) {
  const res = await fetch(url, {
    headers: {
      accept: 'text/html',
    },
  })
  const html = await res.text()

  const root = parse(html)

  const title = root.querySelectorAll('title').pop()?.text
  const description = root
    .querySelector('meta[name=description]')
    ?.getAttribute('content')
  let favIconUrl = root.querySelector('link[rel=icon]')?.getAttribute('href')

  if (favIconUrl && !favIconUrl?.startsWith('http')) {
    const urlObject = new URL(url)
    favIconUrl = urlObject.origin.concat(favIconUrl)
  }

  return {
    title,
    description,
    favIconUrl,
  }
}
