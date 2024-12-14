import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthenticationLayout, MainLayout } from '@/layouts'
import { HomePage, LoginPage, RegistrationPage, TaskSchedulingPage } from '@/pages'
import { Toaster } from '@/components/ui/toaster'
import { ProtectedRoute } from '@/routes/protectedRoute'
import '@/App.css'

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Protected routes */}
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomePage />} />
          <Route path='scheduling' element={<TaskSchedulingPage />} />
        </Route>
        {/* Authentication routes */}
        <Route path='/auth' element={<AuthenticationLayout />}>
          <Route path='login' element={<LoginPage />} />
          <Route path='registration' element={<RegistrationPage />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
