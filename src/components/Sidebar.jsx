import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  MessageSquare,
  Bell,
  FolderOpen,
  BarChart3,
  Settings,
  Zap,
  Radio,
} from 'lucide-react'

const NAV = [
  {
    section: 'Monitor',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
      { label: 'Mention Feed', icon: MessageSquare, to: '/mentions', badge: '10' },
      { label: 'Alerts', icon: Bell, to: '/alerts', badge: '3' },
    ],
  },
  {
    section: 'Content',
    items: [
      { label: 'Repository', icon: FolderOpen, to: '/content' },
      { label: 'Reports', icon: BarChart3, to: '/reports' },
    ],
  },
  {
    section: 'System',
    items: [
      { label: 'Settings', icon: Settings, to: '/settings' },
    ],
  },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Radio size={16} color="white" strokeWidth={2.5} />
        </div>
        <div>
          <div className="sidebar-logo-text">BrandIntel</div>
          <div className="sidebar-logo-sub">Intelligence Platform</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV.map(({ section, items }) => (
          <div key={section}>
            <div className="nav-section-label">{section}</div>
            {items.map(({ label, icon: Icon, to, badge }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              >
                <Icon size={16} strokeWidth={2} />
                {label}
                {badge && <span className="nav-item-badge">{badge}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">MK</div>
          <div>
            <div className="user-name">Maya Kalu</div>
            <div className="user-role">Brand Manager</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
