import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase'

export const handleLogin = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    const idToken = await user.getIdToken()
    return idToken
  } catch (error) {
    throw new Error('Login failed: ' + error)
  }
}
