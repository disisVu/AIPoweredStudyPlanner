import { z } from 'zod'
import { Refine_MongoId } from '@/utils/RefineMongoId'

export const EventSchema = z.object({
  _id: z.string().refine(Refine_MongoId, { message: 'Invalid id' }).optional(),
  taskId: z.string(),
  userId: z.string(),
  title: z.string(),
  start: z.coerce.date(),
  end: z.coerce.date(),
  createdAt: z.coerce.date().default(() => new Date())
})

export type Event = z.infer<typeof EventSchema>
