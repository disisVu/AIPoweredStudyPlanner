import { z } from 'zod'
import { Refine_MongoId } from '../utils/RefineMongoId'

export const TaskSchema = z.object({
  _id: z.string().refine(Refine_MongoId, { message: "Invalid id" }).optional(),
  user_id: z.string(),
  name: z.string(),
  description: z.string(),
  priority: z.enum(['H', 'M', 'L']),
  status: z.enum(['T', 'IP', 'C']),
  estimatedTime: z.number().int().positive(),
  deadline: z.coerce.date(),
  created_at: z.coerce.date().default(() => new Date()),
  updated_at: z.coerce.date(),
})

export type Task = z.infer<typeof TaskSchema>
