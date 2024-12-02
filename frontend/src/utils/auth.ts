import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase' // Ensure correct import path

export const handleLogin = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)

    // Get the signed-in user
    const user = userCredential.user

    // Fetch the ID token
    const idToken = await user.getIdToken()

    console.log('User ID Token:', idToken)

    // You can send this token to your server for verification if needed
  } catch (error) {
    console.error('Error during login:', error)
  }
}
