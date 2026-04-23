import { useState } from 'react'
import {
  Search, Grid, List, Twitter, Instagram, Globe,
  Youtube, MessageCircle, Music, Linkedin, Tag,
  MessageSquare, Calendar, ExternalLink, Plus,
} from 'lucide-react'
import { contentItems } from '../data/mockData'
import PlatformBadge from '../components/PlatformBadge'

const PLATFORM_ICONS = {
  Twitter: Twitter,
  Instagram: Instagram,
  LinkedIn: Linkedin,
  Reddit: MessageCircle,
  YouTube: Youtube,
  Web: Globe,
  TikTok: Music,
}

const TYPE_COLORS = {
  'Social Post': '#6366f1',
  'Blog Post': '#22c55e',
  'Video': '#ef4444',
  'Article': '#0a66c2',
  'Press Release': '#f59e0b',
  'Forum Post': '#ff4500',
}

function ContentCard({ item }) {
  const Icon = PLATFORM_ICONS[item.platform] ?? Globe
  const typeColor = TYPE_COLORS[item.type] ?? '#6366f1'

  return (
    <div className="content-card">
      <div className="content-card-thumb" style={{ background: `linear-gradient(135deg, ${item.color}22, ${item.color}08)` }}>
        <Icon size={32} color={item.color} strokeWidth={1.5} style={{ opacity: 0.6 }} />
        <div style={{
          position: 'absolute', top: 8, right: 8,
          background: 'rgba(0,0,0,0.4)', borderRadius: 6,
          padding: '2px 8px', fontSize: 10, fontWeight: 600, color: 'white',
        }}>
          {item.type}
        </div>
      </div>
      <div className="content-card-body">
        <div className="content-card-title">{item.title}</div>
        <div className="content-card-meta">
          <PlatformBadge platform={item.platform} />
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
            <Calendar size={9} />
            {item.publishDate}
          </span>
        </div>
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <MessageSquare size={11} />
            <strong style={{ color: 'var(--color-text-primary)' }}>{item.mentions}</strong> mentions
          </span>
          <span className="tag" style={{ fontSize: 10 }}>{item.campaign}</span>
        </div>
      </div>
    </div>
  )
}

function ContentRow({ item }) {
  const Icon = PLATFORM_ICONS[item.platform] ?? Globe

  return (
    <tr>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: `${item.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={16} color={item.color} strokeWidth={1.5} />
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 13 }}>{item.title}</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{item.type}</div>
          </div>
        </div>
      </td>
      <td><PlatformBadge platform={item.platform} /></td>
      <td><span className="tag">{item.campaign}</span></td>
      <td style={{ color: 'var(--color-text-muted)' }}>{item.publishDate}</td>
      <td>
        <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.mentions}</span>
      </td>
      <td>
        <span style={{ fontSize: 11, color: 'var(--color-success)', background: 'var(--color-success-dim)', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>
          {item.status}
        </span>
      </td>
      <td>
        <button className="mention-action-btn primary" style={{ fontSize: 11 }}>
          <ExternalLink size={10} />
          Open
        </button>
      </td>
    </tr>
  )
}

const TYPES = ['All', 'Social Post', 'Blog Post', 'Video', 'Article', 'Press Release', 'Forum Post']
const CAMPAIGNS = ['All', 'Q4 Launch', 'Content Marketing', 'Product Awareness', 'Thought Leadership', 'Community', 'Brand Awareness', 'PR']

export default function ContentRepository() {
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [typeFilter, setTypeFilter] = useState('All')
  const [campaignFilter, setCampaignFilter] = useState('All')

  const filtered = contentItems.filter(c => {
    const matchType = typeFilter === 'All' || c.type === typeFilter
    const matchCampaign = campaignFilter === 'All' || c.campaign === campaignFilter
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase())
    return matchType && matchCampaign && matchSearch
  })

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Content Repository</div>
          <div className="page-sub">{contentItems.length} pieces published · Week of Apr 14–21, 2026</div>
        </div>
        <button className="btn btn-primary">
          <Plus size={14} />
          Add Content
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total Pieces', value: contentItems.length, color: 'var(--color-accent)' },
          { label: 'Total Mentions', value: contentItems.reduce((a, c) => a + c.mentions, 0), color: 'var(--color-success)' },
          { label: 'Campaigns', value: [...new Set(contentItems.map(c => c.campaign))].length, color: 'var(--color-warning)' },
          { label: 'Platforms', value: [...new Set(contentItems.map(c => c.platform))].length, color: '#8b5cf6' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color, letterSpacing: -0.5 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        <div className="search-input-wrap">
          <Search size={14} />
          <input
            className="search-input"
            placeholder="Search content..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="filter-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          {TYPES.map(t => <option key={t}>{t === 'All' ? 'All Types' : t}</option>)}
        </select>
        <select className="filter-select" value={campaignFilter} onChange={e => setCampaignFilter(e.target.value)}>
          {CAMPAIGNS.map(c => <option key={c}>{c === 'All' ? 'All Campaigns' : c}</option>)}
        </select>
        <div style={{ display: 'flex', gap: 2, background: 'var(--color-surface-2)', borderRadius: 8, padding: 3 }}>
          <button
            onClick={() => setViewMode('grid')}
            className="icon-btn"
            style={{ background: viewMode === 'grid' ? 'var(--color-surface)' : 'none', color: viewMode === 'grid' ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}
          >
            <Grid size={14} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className="icon-btn"
            style={{ background: viewMode === 'list' ? 'var(--color-surface)' : 'none', color: viewMode === 'list' ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}
          >
            <List size={14} />
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <Search size={40} />
          <p>No content matches your filters.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="content-grid">
          {filtered.map(item => <ContentCard key={item.id} item={item} />)}
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Content</th>
                <th>Platform</th>
                <th>Campaign</th>
                <th>Published</th>
                <th>Mentions</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => <ContentRow key={item.id} item={item} />)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
