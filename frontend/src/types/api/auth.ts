import { User } from 'firebase/auth'

export interface LoginUserResponse {
  success: boolean
  message: string
  data?: {
    user: User
    idToken: string
  }
}
