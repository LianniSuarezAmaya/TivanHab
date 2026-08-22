import {z} from 'zod'

export const nothesSchema=z.object({
key : z
.number()
.optional(),
title: z.string()
.min(4, {message:'Must be at least 4 characters'}),
content: z.string()
.max(90,{message:'Must be at most 90 characters'})
.optional(),
}
)
