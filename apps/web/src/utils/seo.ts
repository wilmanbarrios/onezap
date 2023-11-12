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

  const title = root
    .querySelector('meta[property="og:title"]')
    ?.getAttribute('content')
  const description = root
    .querySelector('meta[property="og:description"]')
    ?.getAttribute('content')

  const urlObject = new URL(url)

  let icon = root.querySelector('link[rel=icon]')?.getAttribute('href')
  if (icon?.startsWith('/.')) {
    icon = icon.replace('/.', urlObject.origin)
  } else if (icon?.startsWith('/')) {
    icon = urlObject.origin.concat(icon)
  }

  const favIconUrl =
    icon || `https://icons.duckduckgo.com/ip3/${urlObject.hostname}.ico`

  console.log({ favIconUrl })

  return {
    title,
    description,
    favIconUrl,
  }
}
