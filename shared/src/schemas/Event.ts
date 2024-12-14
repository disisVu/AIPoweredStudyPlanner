import { z } from 'zod'
import { Refine_MongoId } from '../utils/RefineMongoId'

export const EventSchema = z.object({
  _id: z.string().refine(Refine_MongoId, { message: "Invalid id" }).optional(),
  task_id: z.string(),
  user_id: z.string(),
  start_time: z.coerce.date(),
  end_time: z.coerce.date(),
  created_at: z.coerce.date().default(() => new Date())
})

export type Event = z.infer<typeof EventSchema>