import { BrowserRouter, Routes, Route } from 'react-router-dom'
import '~/App.css'
import { MainLayout } from '~/layouts'
import { HomePage } from '~/pages'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainLayout />}>
          <Route index element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
