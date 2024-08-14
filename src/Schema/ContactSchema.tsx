import { z } from "zod"

const phoneRegex: RegExp = /^\(\d{2}\) \d{5}-\d{4}$/

export const contactSchema = z.object({
  name: z.string().regex(/^[^\d]*$/, {message: "o nome não pode conter números."}).max(32, {message: "deve ser menos que 33 caracteres."}),
  phone: z.string().regex(phoneRegex, { message: "deve ser (XX)XXXXX-XXXX." }),
  email: z.string().email({message: "E-mail inválido."}).max(60, {message: "deve ser menos que 61 caracteres."}),
  address: z.string().max(255, {message: "deve ser menos que 256 caracteres."}),
  note: z.string().max(255, {message: "deve ser menos que 256 caracteres."}),
  type: z.string()
})

export type ContactSchemaType = z.infer<typeof contactSchema>