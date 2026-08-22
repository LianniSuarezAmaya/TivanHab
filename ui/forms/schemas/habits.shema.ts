import {z} from 'zod'

export const habitsSchema=z.object({
  key: z.number()
  .optional(),
  name: z.string()
  .min(4, {message:'Must be at least 4 charrrracters'})
  .max(13, {message:'Must be at most 13 characters'}),
  description: z.string()
  .max(400, {message:'Must be at most 23 characters'})
  .optional(),
  date:z.string(),
  start:z.string(),
  end:z.string(),
  repeat: z.enum(['daily' , 'monthly' ,'weekly']),
  daysOfWeek : z.array(z.number()).optional()

}
)
