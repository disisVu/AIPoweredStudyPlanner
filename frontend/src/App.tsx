import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthenticationLayout, MainLayout } from '@/layouts'
import { LoginPage, RegistrationPage, TaskSchedulingPage, TaskManagementPage, AnalyticsDashboard } from '@/pages'
import { Toaster } from '@/components/ui/toaster'
import { ProtectedRoute } from '@/routes/protectedRoute'
import '@/App.css'
import { Provider } from 'react-redux'
import { store } from '@/store'

function App() {
  return (
    <Provider store={store}>
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
            <Route path='task-scheduling' element={<TaskSchedulingPage />} />
            <Route path='task-management' element={<TaskManagementPage />} />
            <Route path='analytic-dashboard' element={<AnalyticsDashboard />} />
          </Route>
          {/* Authentication routes */}
          <Route path='/auth' element={<AuthenticationLayout />}>
            <Route path='login' element={<LoginPage />} />
            <Route path='registration' element={<RegistrationPage />} />
          </Route>
        </Routes>
        <Toaster />
      </BrowserRouter>
    </Provider>
  )
}

export default App
