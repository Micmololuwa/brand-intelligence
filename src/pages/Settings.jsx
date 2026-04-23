import { useState } from 'react'
import { Plus, Trash2, Save } from 'lucide-react'

function Toggle({ on, onChange }) {
  return (
    <div className={`toggle-switch ${on ? 'on' : ''}`} onClick={() => onChange(!on)}>
      <div className="toggle-thumb" />
    </div>
  )
}

const DEFAULT_KEYWORDS = ['BrandIntel', 'Brand Intel', 'brandintl', '@brandintelhq']

const DEFAULT_SOURCES = [
  { name: 'Twitter / X', desc: 'Real-time tweet tracking via X API', on: true },
  { name: 'Reddit', desc: 'Posts and comments from relevant subreddits', on: true },
  { name: 'LinkedIn', desc: 'Public posts, articles, and company pages', on: true },
  { name: 'YouTube', desc: 'Video titles, descriptions, and comments', on: true },
  { name: 'Instagram', desc: 'Public captions and tagged posts', on: false },
  { name: 'TikTok', desc: 'Video descriptions and comment tracking', on: false },
  { name: 'Web & Blogs', desc: 'News sites, blogs, and forum mentions', on: true },
]

export default function Settings() {
  const [keywords, setKeywords] = useState(DEFAULT_KEYWORDS)
  const [newKw, setNewKw] = useState('')
  const [sources, setSources] = useState(DEFAULT_SOURCES)
  const [notifications, setNotifications] = useState({
    email: true,
    slack: true,
    inapp: true,
    digest: false,
  })

  const addKeyword = () => {
    if (newKw.trim() && !keywords.includes(newKw.trim())) {
      setKeywords(k => [...k, newKw.trim()])
      setNewKw('')
    }
  }

  const removeKeyword = (kw) => setKeywords(k => k.filter(x => x !== kw))

  const toggleSource = (name) => {
    setSources(s => s.map(src => src.name === name ? { ...src, on: !src.on } : src))
  }

  return (
    <div className="section-gap">
      <div className="page-header">
        <div>
          <div className="page-title">Settings</div>
          <div className="page-sub">Manage keywords, sources, and notification preferences</div>
        </div>
      </div>

      {/* Keyword tracking */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Tracked Keywords</div>
            <div className="card-sub">We monitor all mentions containing these terms</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {keywords.map(kw => (
            <div key={kw} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--color-accent-dim)', border: '1px solid var(--color-accent)', borderRadius: 20, padding: '4px 10px' }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-accent-light)' }}>{kw}</span>
              <button onClick={() => removeKeyword(kw)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--color-accent-light)', opacity: 0.6 }}>
                <Trash2 size={11} />
              </button>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            className="search-input"
            style={{ maxWidth: 300 }}
            placeholder="Add keyword or phrase..."
            value={newKw}
            onChange={e => setNewKw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addKeyword()}
          />
          <button className="btn btn-primary" onClick={addKeyword}>
            <Plus size={13} />
            Add
          </button>
        </div>
      </div>

      {/* Sources */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Monitored Sources</div>
          <div className="card-sub">Toggle which platforms are included in monitoring</div>
        </div>
        {sources.map((s, i) => (
          <div key={s.name} className="toggle-row" style={i === sources.length - 1 ? { borderBottom: 'none' } : {}}>
            <div className="toggle-info">
              <div className="toggle-label">{s.name}</div>
              <div className="toggle-desc">{s.desc}</div>
            </div>
            <Toggle on={s.on} onChange={() => toggleSource(s.name)} />
          </div>
        ))}
      </div>

      {/* Notifications */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Notification Preferences</div>
        </div>
        {[
          { key: 'email', label: 'Email Alerts', desc: 'Send high-priority alerts to your inbox' },
          { key: 'slack', label: 'Slack Alerts', desc: 'Post to #brand-monitoring Slack channel' },
          { key: 'inapp', label: 'In-App Notifications', desc: 'Bell icon in dashboard header' },
          { key: 'digest', label: 'Daily Digest Email', desc: 'Morning summary of previous day activity' },
        ].map((n, i, arr) => (
          <div key={n.key} className="toggle-row" style={i === arr.length - 1 ? { borderBottom: 'none' } : {}}>
            <div className="toggle-info">
              <div className="toggle-label">{n.label}</div>
              <div className="toggle-desc">{n.desc}</div>
            </div>
            <Toggle
              on={notifications[n.key]}
              onChange={v => setNotifications(prev => ({ ...prev, [n.key]: v }))}
            />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-primary">
          <Save size={13} />
          Save Settings
        </button>
      </div>
    </div>
  )
}
