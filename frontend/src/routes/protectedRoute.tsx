// import { Navigate } from 'react-router-dom'
// import { useEffect, useState } from 'react'
// import { onAuthStateChanged } from 'firebase/auth'
// import { auth } from '@/firebase'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     setIsAuthenticated(!!user) // User is authenticated if `user` is not null
  //   })

  //   // Cleanup listener on unmount
  //   return () => unsubscribe()
  // }, [])

  // // Render a loading state while checking authentication
  // if (isAuthenticated === null) {
  //   return <div>Loading...</div>
  // }

  // // Redirect unauthenticated users
  // if (!isAuthenticated) {
  //   return <Navigate to='/auth/login' replace />
  // }

  // Render the protected content for authenticated users
  return <>{children}</>
}

export { ProtectedRoute }
