import { z} from 'zod'

export const tasksSchema=z.object({
  name: z.string()
   .min(4, {message:'Must be at least 4 characters'}),
  description: z.string()
   .max(400,{message:'Must be at most 400 characters'})
   .optional(),
  date:z.string(),
  start:z.string(),
  end:z.string(),  habit:z.number()
  .optional(),
  }
)
