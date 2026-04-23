import { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, PieChart, Pie,
} from 'recharts'
import {
  TrendingUp, TrendingDown, MessageSquare, Bell, FileText,
  ArrowUpRight, Eye, ExternalLink, AlertTriangle,
} from 'lucide-react'
import { mentions, dailyMentions, platformBreakdown, topSources, topContent, alertItems, weeklyTrend } from '../data/mockData'
import PlatformBadge from '../components/PlatformBadge'

function StatCard({ label, value, change, up, icon: Icon, iconColor, iconBg }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <div className="stat-label">{label}</div>
        <div className="stat-icon" style={{ background: iconBg }}>
          <Icon size={15} color={iconColor} strokeWidth={2} />
        </div>
      </div>
      <div className="stat-value">{value}</div>
      <div className={`stat-change ${up ? 'up' : 'down'}`}>
        {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {change} vs last week
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 10, padding: '10px 14px' }}>
      <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 6 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ fontSize: 12, color: p.color, display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
          {p.name}: <strong style={{ color: 'var(--color-text-primary)' }}>{p.value}</strong>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const unread = alertItems.filter(a => !a.read)
  const recentMentions = mentions.slice(0, 5)

  return (
    <div className="section-gap">
      {/* Stats */}
      <div className="stats-grid">
        <StatCard
          label="Total Mentions Today"
          value="484"
          change="+41%"
          up
          icon={MessageSquare}
          iconColor="#6366f1"
          iconBg="rgba(99,102,241,0.12)"
        />
        <StatCard
          label="Positive Mentions"
          value="312"
          change="+28%"
          up
          icon={TrendingUp}
          iconColor="#22c55e"
          iconBg="rgba(34,197,94,0.12)"
        />
        <StatCard
          label="Alerts Triggered"
          value="7"
          change="+2"
          up
          icon={Bell}
          iconColor="#f59e0b"
          iconBg="rgba(245,158,11,0.12)"
        />
        <StatCard
          label="Content Published"
          value="8"
          change="+3"
          up
          icon={FileText}
          iconColor="#8b5cf6"
          iconBg="rgba(139,92,246,0.12)"
        />
      </div>

      {/* Charts row */}
      <div className="two-col">
        {/* Area chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Mentions This Week</div>
              <div className="card-sub">Daily breakdown by sentiment</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={dailyMentions} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gPos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gNeg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gNeu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="positive" name="Positive" stroke="#22c55e" fill="url(#gPos)" strokeWidth={2} />
              <Area type="monotone" dataKey="negative" name="Negative" stroke="#ef4444" fill="url(#gNeg)" strokeWidth={2} />
              <Area type="monotone" dataKey="neutral" name="Neutral" stroke="#6366f1" fill="url(#gNeu)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Platform breakdown */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Mentions by Platform</div>
              <div className="card-sub">Share of voice this week</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie
                  data={platformBreakdown}
                  dataKey="mentions"
                  nameKey="platform"
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={65}
                  strokeWidth={0}
                >
                  {platformBreakdown.map((entry) => (
                    <Cell key={entry.platform} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {platformBreakdown.map(p => (
                <div key={p.platform} className="progress-row">
                  <div className="progress-label" style={{ display: 'flex', alignItems: 'center', gap: 6, width: 100 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12 }}>{p.platform}</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${p.pct}%`, background: p.color }} />
                  </div>
                  <div className="progress-pct">{p.pct}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="two-col">
        {/* Recent mentions */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Recent Mentions</div>
              <div className="card-sub">Latest tracked conversations</div>
            </div>
            <a href="/mentions" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--color-accent-light)', textDecoration: 'none' }}>
              View all <ArrowUpRight size={12} />
            </a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {recentMentions.map((m, i) => (
              <div key={m.id}>
                <div style={{ display: 'flex', gap: 12, padding: '10px 0', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)' }}>{m.author}</span>
                      <PlatformBadge platform={m.platform} />
                      <span className={`sentiment-badge ${m.sentiment}`}>{m.sentiment}</span>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.5, WebkitLineClamp: 2, overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical' }}>
                      {m.text}
                    </p>
                  </div>
                  <div style={{ marginLeft: 'auto', flexShrink: 0, fontSize: 11, color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                    {m.timestamp}
                  </div>
                </div>
                {i < recentMentions.length - 1 && <div className="divider" style={{ margin: 0 }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Right column: alerts + top sources */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Active alerts */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <AlertTriangle size={14} color="var(--color-warning)" />
                  Active Alerts
                </div>
                <div className="card-sub">{unread.length} unread</div>
              </div>
            </div>
            <div className="alerts-list">
              {unread.slice(0, 3).map(a => (
                <div key={a.id} className="alert-item" style={{ padding: '10px 12px' }}>
                  <div className={`alert-dot ${a.priority}`} />
                  <div style={{ flex: 1 }}>
                    <div className="alert-title" style={{ fontSize: 12 }}>{a.title}</div>
                    <div className="alert-desc" style={{ fontSize: 11 }}>{a.time} · {a.platform}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top sources */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Top Sources</div>
                <div className="card-sub">Highest reach this week</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {topSources.slice(0, 4).map((s, i) => (
                <div key={s.name}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)' }}>{s.name}</span>
                      <PlatformBadge platform={s.platform} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{s.reach}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-accent-light)', background: 'var(--color-accent-dim)', padding: '1px 6px', borderRadius: 20 }}>{s.mentions}</span>
                    </div>
                  </div>
                  {i < 3 && <div className="divider" style={{ margin: 0 }} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly trend */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Monthly Mention Trend</div>
            <div className="card-sub">Week-over-week growth in April</div>
          </div>
          <span style={{ fontSize: 12, color: 'var(--color-success)', fontWeight: 600, background: 'var(--color-success-dim)', padding: '3px 10px', borderRadius: 20 }}>
            +130% MTD
          </span>
        </div>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={weeklyTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="mentions" name="Mentions" fill="var(--color-accent)" radius={[4, 4, 0, 0]} maxBarSize={60} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
