import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { UserJSON, UserWebhookEvent } from '@clerk/nextjs/server'
import { env } from '@/env.mjs'
import { db } from '@/db'
import { users } from '@/db/schema'

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const CLERK_SIGNING_SECRET = env.CLERK_SIGNING_SECRET

  if (!CLERK_SIGNING_SECRET) {
    throw new Error(
      'Please add CLERK_SIGNING_SECRET from Clerk Dashboard to .env or .env.local'
    )
  }

  // Get the headers
  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new SVIX instance with your secret.
  const wh = new Webhook(CLERK_SIGNING_SECRET)

  let evt: UserWebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as UserWebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }

  // Get the ID and type
  const userData = evt.data as UserJSON

  await db.insert(users).values({
    firstName: userData.first_name,
    lastName: userData.last_name,
    email: userData.email_addresses.shift()?.email_address,
    createdAt: new Date(userData.created_at),
  })

  console.log(`Webhook with and ID of ${userData.id} and type of ${evt.type}`)
  console.log('Webhook body:', body)

  return new Response('', { status: 201 })
}
