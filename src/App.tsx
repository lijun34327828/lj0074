import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import Products from '@/pages/Products'
import Plans from '@/pages/Plans'
import SettingsPage from '@/pages/Settings'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Products />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  )
}
