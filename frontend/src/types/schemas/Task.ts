import { z } from 'zod'
import { Refine_MongoId } from '@/utils/RefineMongoId'

export const TaskSchema = z.object({
  _id: z.string().refine(Refine_MongoId, { message: 'Invalid id' }).optional(),
  user_id: z.string(),
  name: z.string(),
  description: z.string(),
  priority: z.enum(['H', 'M', 'L']),
  status: z.enum(['T', 'IP', 'C', 'E']),
  estimatedTime: z.number().int().positive(),
  deadline: z.coerce.date(),
  isDistributed: z.boolean().default(false),
  createdAt: z.coerce.date().default(() => new Date()),
  updatedAt: z.coerce.date()
})

export type Task = z.infer<typeof TaskSchema>
