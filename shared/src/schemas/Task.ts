import { z } from 'zod'
import { Refine_MongoId } from '../utils/RefineMongoId'

export const TaskSchema = z.object({
  _id: z.string().refine(Refine_MongoId, { message: "Invalid id" }).optional(),
  user_id: z.string(),
  name: z.string(),
  deadline: z.coerce.date(),
  created_at: z.coerce.date().default(() => new Date()),
  updated_at: z.coerce.date(),
})

export type Task = z.infer<typeof TaskSchema>