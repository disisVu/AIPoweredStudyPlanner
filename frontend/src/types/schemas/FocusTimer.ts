import { z } from 'zod'
import { Refine_MongoId } from '@/utils/RefineMongoId'

export const FocusTimerSchema = z.object({
  _id: z.string().refine(Refine_MongoId, { message: 'Invalid id' }).optional(),
  userId: z.string(),
  taskId: z.string(),
  eventId: z.string(),
  focusDuration: z.number().int().positive(),
  breakDuration: z.number().int().positive(),
  remainingTime: z.number().int().positive(),
  timeSpent: z.number().int().positive(),
  isActive: z.boolean(),
  createdAt: z.coerce.date().default(() => new Date())
})

export type FocusTimer = z.infer<typeof FocusTimerSchema>
