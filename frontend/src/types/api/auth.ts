import { User } from 'firebase/auth'

export interface AuthResponse {
  success: boolean
  message: string
  data?: {
    user: User
    idToken: string
  }
}
