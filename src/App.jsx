import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import MentionFeed from './pages/MentionFeed'
import Alerts from './pages/Alerts'
import ContentRepository from './pages/ContentRepository'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/mentions" element={<MentionFeed />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/content" element={<ContentRepository />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  )
}
