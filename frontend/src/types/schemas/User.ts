import { z } from 'zod'
import { Refine_MongoId } from '@/utils/RefineMongoId'

export const UserSchema = z.object({
  _id: z.string().refine(Refine_MongoId, { message: 'Invalid id' }).optional(),
  uid: z.string(), // Firebase user ID
  activeFocusTimerId: z.string().refine(Refine_MongoId, { message: 'Invalid id' }).nullable()
})

export type User = z.infer<typeof UserSchema>
