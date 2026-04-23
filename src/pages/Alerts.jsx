import { useState } from 'react'
import {
  Bell, BellOff, Plus, Trash2, Mail, MessageSquare,
  Smartphone, Check, AlertTriangle, Info, Zap,
} from 'lucide-react'
import { alertItems, alertRules } from '../data/mockData'
import PlatformBadge from '../components/PlatformBadge'

function Toggle({ on, onChange }) {
  return (
    <div className={`toggle-switch ${on ? 'on' : ''}`} onClick={() => onChange(!on)}>
      <div className="toggle-thumb" />
    </div>
  )
}

function AlertItemCard({ alert }) {
  return (
    <div className="alert-item" style={{ opacity: alert.read ? 0.7 : 1 }}>
      <div className={`alert-dot ${alert.priority}`} />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <span className="alert-title">{alert.title}</span>
          {!alert.read && (
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent)', flexShrink: 0 }} />
          )}
        </div>
        <div className="alert-desc">{alert.description}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
          <PlatformBadge platform={alert.platform} />
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{alert.time}</span>
          <span className={`sentiment-badge ${alert.priority === 'high' ? 'negative' : alert.priority === 'medium' ? 'neutral' : 'positive'}`}>
            {alert.priority}
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end', flexShrink: 0 }}>
        <button className="mention-action-btn primary" style={{ fontSize: 11 }}>
          <Zap size={10} />
          View
        </button>
        <button className="mention-action-btn" style={{ fontSize: 11 }}>
          <Check size={10} />
          Mark read
        </button>
      </div>
    </div>
  )
}

export default function Alerts() {
  const [tab, setTab] = useState('inbox')
  const [rules, setRules] = useState(alertRules)

  const toggleRule = (id) => {
    setRules(r => r.map(rule => rule.id === id ? { ...rule, enabled: !rule.enabled } : rule))
  }

  const unread = alertItems.filter(a => !a.read)
  const read = alertItems.filter(a => a.read)

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Alerts</div>
          <div className="page-sub">{unread.length} unread · {alertItems.length} total this week</div>
        </div>
        <button className="btn btn-primary">
          <Plus size={14} />
          New Alert Rule
        </button>
      </div>

      {/* Summary chips */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'High Priority', count: alertItems.filter(a => a.priority === 'high').length, color: 'var(--color-danger)', bg: 'var(--color-danger-dim)' },
          { label: 'Medium Priority', count: alertItems.filter(a => a.priority === 'medium').length, color: 'var(--color-warning)', bg: 'var(--color-warning-dim)' },
          { label: 'Low Priority', count: alertItems.filter(a => a.priority === 'low').length, color: 'var(--color-success)', bg: 'var(--color-success-dim)' },
        ].map(s => (
          <div key={s.label} style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', background: s.bg, border: `1px solid ${s.color}33`, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.count}</span>
            <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="tab-bar">
        {[
          { key: 'inbox', label: `Inbox (${unread.length})` },
          { key: 'all', label: 'All Alerts' },
          { key: 'rules', label: 'Alert Rules' },
          { key: 'channels', label: 'Delivery Channels' },
        ].map(t => (
          <button key={t.key} className={`tab-btn ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'inbox' && (
        <div className="alerts-list">
          {unread.length === 0 ? (
            <div className="empty-state">
              <Bell size={40} />
              <p>All caught up — no unread alerts.</p>
            </div>
          ) : (
            unread.map(a => <AlertItemCard key={a.id} alert={a} />)
          )}
        </div>
      )}

      {tab === 'all' && (
        <div className="alerts-list">
          {alertItems.map(a => <AlertItemCard key={a.id} alert={a} />)}
        </div>
      )}

      {tab === 'rules' && (
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Alert Rules</div>
              <div className="card-sub">Configure what triggers notifications</div>
            </div>
            <button className="btn btn-secondary" style={{ fontSize: 12, height: 32, padding: '0 12px' }}>
              <Plus size={12} />
              Add Rule
            </button>
          </div>
          {rules.map((rule, i) => (
            <div key={rule.id} className="toggle-row" style={i === rules.length - 1 ? { borderBottom: 'none' } : {}}>
              <div className="toggle-info">
                <div className="toggle-label">{rule.name}</div>
                <div className="toggle-desc">Delivers via: {rule.channel}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button className="icon-btn" style={{ width: 28, height: 28 }}>
                  <Trash2 size={13} color="var(--color-danger)" />
                </button>
                <Toggle on={rule.enabled} onChange={() => toggleRule(rule.id)} />
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'channels' && (
        <div className="section-gap">
          <div className="card">
            <div className="card-title" style={{ marginBottom: 16 }}>Delivery Channels</div>

            {[
              {
                icon: MessageSquare,
                name: 'Slack Integration',
                desc: 'Sends high-priority alerts to #brand-monitoring channel',
                status: 'Connected',
                color: 'var(--color-success)',
              },
              {
                icon: Mail,
                name: 'Email Notifications',
                desc: 'Delivers digest summaries to brand-team@company.com',
                status: 'Connected',
                color: 'var(--color-success)',
              },
              {
                icon: Smartphone,
                name: 'In-App Notifications',
                desc: 'Push alerts inside the BrandIntel dashboard',
                status: 'Active',
                color: 'var(--color-accent-light)',
              },
            ].map(channel => (
              <div key={channel.name} className="toggle-row">
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--color-surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12, flexShrink: 0 }}>
                  <channel.icon size={16} color="var(--color-text-secondary)" />
                </div>
                <div className="toggle-info">
                  <div className="toggle-label">{channel.name}</div>
                  <div className="toggle-desc">{channel.desc}</div>
                </div>
                <div style={{ display: 'flex', align: 'center', gap: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: channel.color, background: `${channel.color}22`, padding: '3px 8px', borderRadius: 20 }}>
                    {channel.status}
                  </span>
                  <button className="btn btn-ghost" style={{ height: 28, fontSize: 11, padding: '0 10px' }}>
                    Configure
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-title" style={{ marginBottom: 4 }}>Quiet Hours</div>
            <div className="card-sub" style={{ marginBottom: 16 }}>Suppress non-critical alerts during these times</div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <select className="filter-select">
                {['10:00 PM', '11:00 PM', '12:00 AM'].map(t => <option key={t}>{t}</option>)}
              </select>
              <span style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>to</span>
              <select className="filter-select">
                {['7:00 AM', '8:00 AM', '9:00 AM'].map(t => <option key={t}>{t}</option>)}
              </select>
              <button className="btn btn-primary" style={{ marginLeft: 8 }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
