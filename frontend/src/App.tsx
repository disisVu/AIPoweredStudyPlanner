import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthenticationLayout, MainLayout } from '@/layouts'
import { HomePage, LoginPage, RegistrationPage } from '@/pages'
import { Toaster } from '@/components/ui/toaster'
import '@/App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainLayout />}>
          <Route index element={<HomePage />} />
        </Route>
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
