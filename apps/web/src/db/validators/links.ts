import { z } from 'zod'

export const createLinkSchema = z.object({
  url: z.string().min(1).url(),
  title: z.string().optional(),
  description: z.string().optional(),
  favIconUrl: z.string().url().optional(),
})
