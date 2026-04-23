import { useState } from 'react'
import { Search, ExternalLink, Tag, UserPlus, ChevronDown, Filter, Zap } from 'lucide-react'
import { mentions } from '../data/mockData'
import PlatformBadge from '../components/PlatformBadge'

const PLATFORMS = ['All', 'Twitter', 'Reddit', 'LinkedIn', 'YouTube', 'Instagram', 'Web', 'TikTok']
const SENTIMENTS = ['All', 'positive', 'negative', 'neutral']

function highlight(text, keyword) {
  if (!keyword) return text
  const parts = text.split(new RegExp(`(${keyword})`, 'gi'))
  return parts.map((part, i) =>
    part.toLowerCase() === keyword.toLowerCase()
      ? <mark key={i}>{part}</mark>
      : part
  )
}

function MentionCard({ mention }) {
  const [tagged, setTagged] = useState(false)

  return (
    <div className="mention-card">
      <div className="mention-card-top">
        <div className="mention-meta">
          <PlatformBadge platform={mention.platform} />
          <span className="mention-author">{mention.author}</span>
          <span className="mention-time">· {mention.timestamp}</span>
          <span className={`sentiment-badge ${mention.sentiment}`}>{mention.sentiment}</span>
          {mention.assignee && (
            <span className="tag">
              <UserPlus size={9} />
              {mention.assignee}
            </span>
          )}
        </div>
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Zap size={10} />
          {mention.reach}
        </div>
      </div>

      <p className="mention-text">
        {highlight(mention.text, mention.keyword)}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="mention-actions">
          <a
            href={mention.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mention-action-btn primary"
            style={{ textDecoration: 'none' }}
          >
            <ExternalLink size={11} />
            View Source
          </a>
          <button
            className="mention-action-btn"
            onClick={() => setTagged(t => !t)}
          >
            <Tag size={11} />
            {tagged ? 'Tagged' : 'Tag'}
          </button>
          <button className="mention-action-btn">
            <UserPlus size={11} />
            Assign
          </button>
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {mention.tags.map(t => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function MentionFeed() {
  const [search, setSearch] = useState('')
  const [platform, setPlatform] = useState('All')
  const [sentiment, setSentiment] = useState('All')
  const [dateRange, setDateRange] = useState('Today')

  const filtered = mentions.filter(m => {
    const matchPlatform = platform === 'All' || m.platform === platform
    const matchSentiment = sentiment === 'All' || m.sentiment === sentiment
    const matchSearch = !search || m.text.toLowerCase().includes(search.toLowerCase()) || m.author.toLowerCase().includes(search.toLowerCase())
    return matchPlatform && matchSentiment && matchSearch
  })

  const counts = {
    positive: mentions.filter(m => m.sentiment === 'positive').length,
    negative: mentions.filter(m => m.sentiment === 'negative').length,
    neutral: mentions.filter(m => m.sentiment === 'neutral').length,
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Mention Feed</div>
          <div className="page-sub">{filtered.length} mentions found · Showing results for "BrandIntel"</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary">
            <Filter size={13} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Sentiment quick stats */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Positive', count: counts.positive, color: 'var(--color-success)', bg: 'var(--color-success-dim)' },
          { label: 'Negative', count: counts.negative, color: 'var(--color-danger)', bg: 'var(--color-danger-dim)' },
          { label: 'Neutral', count: counts.neutral, color: 'var(--color-text-secondary)', bg: 'var(--color-surface-3)' },
        ].map(s => (
          <div
            key={s.label}
            onClick={() => setSentiment(sentiment === s.label.toLowerCase() ? 'All' : s.label.toLowerCase())}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              background: sentiment === s.label.toLowerCase() ? s.bg : 'var(--color-surface)',
              border: `1px solid ${sentiment === s.label.toLowerCase() ? s.color : 'var(--color-border)'}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.15s',
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>{s.count}</span>
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        <div className="search-input-wrap">
          <Search size={14} />
          <input
            className="search-input"
            placeholder="Search mentions, authors, keywords..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <select className="filter-select" value={platform} onChange={e => setPlatform(e.target.value)}>
          {PLATFORMS.map(p => <option key={p}>{p}</option>)}
        </select>

        <select className="filter-select" value={sentiment} onChange={e => setSentiment(e.target.value)}>
          {SENTIMENTS.map(s => <option key={s}>{s === 'All' ? 'All Sentiments' : s}</option>)}
        </select>

        <select className="filter-select" value={dateRange} onChange={e => setDateRange(e.target.value)}>
          {['Today', 'Last 7 days', 'Last 30 days', 'Custom'].map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      {/* Feed */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <Search size={40} />
          <p>No mentions match your filters.</p>
        </div>
      ) : (
        <div className="feed-list">
          {filtered.map(m => <MentionCard key={m.id} mention={m} />)}
        </div>
      )}

      {filtered.length > 0 && (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <button className="btn btn-ghost">Load more mentions</button>
        </div>
      )}
    </div>
  )
}
