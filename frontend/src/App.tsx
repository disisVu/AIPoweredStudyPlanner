import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthenticationLayout, MainLayout } from '@/layouts'
import { Toaster } from '@/components/ui/toaster'
import { LoadingIndicator } from '@/components/Indicator'
import { ProtectedRoute } from '@/routes'
import { Provider } from 'react-redux'
import { store } from '@/store'
import '@/App.css'

// Lazy load the page components
const LoginPage = lazy(() => import('@/pages/Authentication/LoginPage'))
const RegistrationPage = lazy(() => import('@/pages/Authentication/RegistrationPage'))
const TaskSchedulingPage = lazy(() => import('@/pages/TaskScheduling/TaskSchedulingPage'))
const TaskManagementPage = lazy(() => import('@/pages/TaskManagement/TaskManagementPage'))
const AnalyticsDashboard = lazy(() => import('@/pages/Analytics/AnalyticsDashboard'))

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
            <Route
              index
              element={
                <Suspense fallback={<LoadingIndicator />}>
                  <TaskSchedulingPage />
                </Suspense>
              }
            />
            <Route
              path='task-scheduling'
              element={
                <Suspense fallback={<LoadingIndicator />}>
                  <TaskSchedulingPage />
                </Suspense>
              }
            />
            <Route
              path='task-management'
              element={
                <Suspense fallback={<LoadingIndicator />}>
                  <TaskManagementPage />
                </Suspense>
              }
            />
            <Route
              path='analytic-dashboard'
              element={
                <Suspense fallback={<LoadingIndicator />}>
                  <AnalyticsDashboard />
                </Suspense>
              }
            />
          </Route>
          {/* Authentication routes */}
          <Route path='/auth' element={<AuthenticationLayout />}>
            <Route
              path='login'
              element={
                <Suspense fallback={<LoadingIndicator />}>
                  <LoginPage />
                </Suspense>
              }
            />
            <Route
              path='registration'
              element={
                <Suspense fallback={<LoadingIndicator />}>
                  <RegistrationPage />
                </Suspense>
              }
            />
          </Route>
        </Routes>
        <Toaster />
      </BrowserRouter>
    </Provider>
  )
}

export default App
