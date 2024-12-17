import {
  signInWithEmailAndPassword,
  AuthError,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  setPersistence,
  browserLocalPersistence,
  User
} from 'firebase/auth'
import { auth } from '@/firebase'
import { AuthResponse } from '@/types/api/auth'
import { provider } from '@/services/firebase/firebase_google_provider'
import { FirebaseError } from 'firebase/app'

export const loginWithEmailAndPassword = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    // Set persistence
    await setPersistence(auth, browserLocalPersistence)

    // Attempt to sign in the user with email and password
    const userCredential = await signInWithEmailAndPassword(auth, email, password)

    // Get the signed-in user
    const user = userCredential.user

    // Fetch the ID token
    const idToken = await user.getIdToken()

    storeUserCredentialsInLocalStorage(idToken, user.uid, user)

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

export const loginWithGoogle = async (): Promise<AuthResponse> => {
  try {
    // Set persistence
    await setPersistence(auth, browserLocalPersistence)

    const result = await signInWithPopup(auth, provider)
    const credential = GoogleAuthProvider.credentialFromResult(result)
    const token = credential?.accessToken
    const user = result.user

    storeUserCredentialsInLocalStorage(token!, user.uid, user)

    return {
      success: true,
      message: 'Login with Google successfully.',
      data: {
        user: user,
        idToken: token!
      }
    }
  } catch (error) {
    const firebaseError = error as AuthError
    // Handle Errors here.
    const errorMessage = firebaseError.message
    // The email of the user's account used.
    return {
      success: false,
      message: errorMessage
    }
  }
}

export const signOutUser = async (): Promise<AuthResponse> => {
  try {
    await signOut(auth)
    return {
      success: true,
      message: 'Sign out successfully.'
    }
  } catch (error) {
    const firebaseError = error as FirebaseError
    // Handle Errors here.
    const errorMessage = firebaseError.message
    // The email of the user's account used.
    return {
      success: false,
      message: errorMessage
    }
  }
}

export const getUserCredentials = (): { accessToken: string | null; uid: string | null } => {
  try {
    const accessToken = localStorage.getItem('accessToken')
    const uid = localStorage.getItem('uid')

    if (!accessToken) {
      console.error('Access token not found in stored user data.')
    }
    if (!uid) {
      console.error('UID not found in stored user data.')
    }
    return { accessToken, uid }
  } catch (error) {
    console.error('Error parsing user data from local storage:', error)
    return { accessToken: null, uid: null }
  }
}

export const storeUserCredentialsInLocalStorage = (accessToken: string, uid: string, user: User): void => {
  localStorage.setItem('accessToken', accessToken)
  localStorage.setItem('uid', uid)

  const userData = {
    displayName: user.displayName,
    email: user.email
  }
  localStorage.setItem('authUser', JSON.stringify(userData))
}

export const getStoredUser = (): {
  displayName: string
  email: string
} | null => {
  const userData = localStorage.getItem('authUser')
  return userData ? JSON.parse(userData) : null
}
