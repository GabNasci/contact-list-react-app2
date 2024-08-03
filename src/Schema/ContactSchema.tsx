import { z } from "zod"

const phoneRegex: RegExp = /^\(\d{2}\) \d{5}-\d{4}$/

export const contactSchema = z.object({
  name: z.string(),
  phone: z.string().regex(phoneRegex, { message: "must be (XX)XXXXX-XXXX" }),
  email: z.string().email(),
  address: z.string(),
  note: z.string(),
  type: z.string()
})

export type ContactSchemaType = z.infer<typeof contactSchema>