import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { jwtDecode } from 'jwt-decode'
import { auth } from '@/firebase'
import { storeUserCredentialsInLocalStorage } from '../utils'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken()
          const decodedToken: { exp: number } = jwtDecode(token)
          const isTokenValid = decodedToken.exp * 1000 > Date.now()
          storeUserCredentialsInLocalStorage(token, user.uid, user)

          setIsAuthenticated(isTokenValid)
        } catch {
          setIsAuthenticated(false)
        }
      } else {
        setIsAuthenticated(false)
      }
    })

    // Cleanup listener on unmount
    return () => unsubscribe()
  }, [])

  // Render a loading state while checking authentication
  if (isAuthenticated === null) {
    return <div>Loading...</div>
  }

  // Redirect unauthenticated users
  if (!isAuthenticated) {
    return <Navigate to='/auth/login' replace />
  }

  // Render the protected content for authenticated users
  return <>{children}</>
}

export { ProtectedRoute }
