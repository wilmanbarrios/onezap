import { createLink, deleteLink } from '@/actions/links'
import { fetchLinks } from '@/db/queries/links'
import { UserButton } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'

export default async function Home() {
  const user = await currentUser()
  const items = await fetchLinks()

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
      <header>
        <nav>
          <ul>
            <li>
              <h1>logo</h1>
            </li>
            <li>
              <ul>
                {!user ? (
                  <>
                    <li>
                      <Link href='/sign-in'>Sign in</Link>
                    </li>
                    <li>
                      <Link href='/sign-up'>Sign up</Link>
                    </li>
                  </>
                ) : null}
                <li>
                  <UserButton afterSignOutUrl='/' />
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        <form style={{ backgroundColor: 'gold' }}>
          <input
            type='search'
            aria-label='Search links'
            placeholder='Search links...'
          />
          <button type='submit'>Search</button>
        </form>

        <article>
          <section style={{ backgroundColor: 'tomato' }}>
            <form action={createLink}>
              <input type='text' name='url' />
              <button type='submit'>Add link</button>
            </form>
          </section>
          <section style={{ backgroundColor: 'aqua' }}>
            <ul>
              {items.map((item) => (
                <li key={item.nanoId}>
                  <form action={manageItem}>
                    <input type='hidden' name='linkId' value={item.nanoId} />
                    <p>{item.title}</p>
                    <button type='submit' name='intent' value='delete-link'>
                      Delete
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          </section>
        </article>
      </main>
    </div>
  )
}
