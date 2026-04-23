import { Bell, Search, RefreshCw } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const TITLES = {
  '/': 'Dashboard',
  '/mentions': 'Mention Feed',
  '/alerts': 'Alerts',
  '/content': 'Content Repository',
  '/reports': 'Reports',
  '/settings': 'Settings',
}

export default function Topbar() {
  const { pathname } = useLocation()
  const title = TITLES[pathname] ?? 'BrandIntel'

  return (
    <header className="topbar">
      <div className="topbar-title">{title}</div>

      <div className="live-badge">
        <span className="pulse-dot" />
        Live
      </div>

      <div className="topbar-actions">
        <button className="icon-btn" title="Search">
          <Search size={16} />
        </button>
        <button className="icon-btn" title="Refresh">
          <RefreshCw size={15} />
        </button>
        <button className="icon-btn" title="Notifications">
          <Bell size={16} />
          <span className="dot" />
        </button>
      </div>
    </header>
  )
}
