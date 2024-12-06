import { signInWithEmailAndPassword, AuthError } from 'firebase/auth'
import { auth } from '@/firebase' // Ensure correct import path
import { LoginUserResponse } from '@/types/api/auth'

export const handleLogin = async (email: string, password: string): Promise<LoginUserResponse> => {
  try {
    // Attempt to sign in the user with email and password
    const userCredential = await signInWithEmailAndPassword(auth, email, password)

    // Get the signed-in user
    const user = userCredential.user

    // Fetch the ID token
    const idToken = await user.getIdToken()

    console.log('User ID Token:', idToken)

    // Return the user and token for further processing
    return {
      success: true,
      message: 'Login successful.',
      data: {
        user,
        idToken
      }
    }
  } catch (error) {
    const firebaseError = error as AuthError
    let errorMessage = 'An error occurred during login.'

    // Handle specific Firebase auth errors
    switch (firebaseError.code) {
      case 'auth/user-not-found':
        errorMessage = 'No user found with the provided email.'
        break
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password. Please try again.'
        break
      case 'auth/invalid-email':
        errorMessage = 'The email address is not valid.'
        break
      case 'auth/too-many-requests':
        errorMessage = 'Too many unsuccessful login attempts. Please try again later.'
        break
      default:
        errorMessage = firebaseError.message || 'An unknown error occurred.'
        break
    }

    console.error('Error during login:', errorMessage, firebaseError)

    // Return an error response
    return {
      success: false,
      message: errorMessage
    }
  }
}
