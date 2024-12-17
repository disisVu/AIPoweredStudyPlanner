import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthenticationLayout, MainLayout } from '@/layouts'
import { LoginPage, RegistrationPage, TaskSchedulingPage } from '@/pages'
import { Toaster } from '@/components/ui/toaster'
import { ProtectedRoute } from '@/routes/protectedRoute'
import '@/App.css'
import { TaskManagementPage } from '@/pages/TaskManagement/TaskManagementPage'

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
          <Route index element={<TaskSchedulingPage />} />
          <Route path='scheduling' element={<TaskSchedulingPage />} />
          <Route path='add-task' element={<TaskManagementPage />} />
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
