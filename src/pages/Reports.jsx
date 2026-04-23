import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import { Download, FileText, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'
import { dailyMentions, platformBreakdown, topContent, topSources, weeklyTrend } from '../data/mockData'
import PlatformBadge from '../components/PlatformBadge'
import { useState } from 'react'

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

export default function Reports() {
  const [dateRange, setDateRange] = useState('Last 7 days')

  const totalMentions = dailyMentions.reduce((a, d) => a + d.mentions, 0)
  const totalPositive = dailyMentions.reduce((a, d) => a + d.positive, 0)
  const totalNegative = dailyMentions.reduce((a, d) => a + d.negative, 0)
  const sentimentScore = Math.round((totalPositive / totalMentions) * 100)

  return (
    <div className="section-gap">
      <div className="page-header">
        <div>
          <div className="page-title">Reports</div>
          <div className="page-sub">Brand performance analytics · April 2026</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select className="filter-select" value={dateRange} onChange={e => setDateRange(e.target.value)}>
            {['Last 7 days', 'Last 30 days', 'This month', 'Custom'].map(d => <option key={d}>{d}</option>)}
          </select>
          <button className="btn btn-secondary">
            <Download size={13} />
            Export PDF
          </button>
          <button className="btn btn-ghost">
            <FileText size={13} />
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          {
            label: 'Total Mentions',
            value: totalMentions,
            sub: 'This week',
            change: '+41%',
            up: true,
          },
          {
            label: 'Sentiment Score',
            value: `${sentimentScore}%`,
            sub: 'Positive ratio',
            change: '+6pts',
            up: true,
          },
          {
            label: 'Negative Mentions',
            value: totalNegative,
            sub: 'Requiring attention',
            change: '+2',
            up: false,
          },
          {
            label: 'Avg Response Time',
            value: '< 4 min',
            sub: 'Time to detect',
            change: '↓ 20%',
            up: true,
          },
        ].map(k => (
          <div key={k.label} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '16px 18px' }}>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: -0.5 }}>{k.value}</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>{k.sub}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: k.up ? 'var(--color-success)' : 'var(--color-danger)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
              {k.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {k.change}
            </div>
          </div>
        ))}
      </div>

      {/* Mention volume chart */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Daily Mention Volume</div>
            <div className="card-sub">Stacked by sentiment — last 7 days</div>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            {[
              { color: '#22c55e', label: 'Positive' },
              { color: '#ef4444', label: 'Negative' },
              { color: '#6366f1', label: 'Neutral' },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--color-text-muted)' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={dailyMentions} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="positive" name="Positive" stackId="a" fill="#22c55e" radius={[0, 0, 0, 0]} />
            <Bar dataKey="neutral" name="Neutral" stackId="a" fill="#6366f1" />
            <Bar dataKey="negative" name="Negative" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="two-col">
        {/* Platform pie */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Platform Distribution</div>
              <div className="card-sub">Mentions by source this week</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie
                  data={platformBreakdown}
                  dataKey="mentions"
                  nameKey="platform"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  strokeWidth={0}
                >
                  {platformBreakdown.map(entry => (
                    <Cell key={entry.platform} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {platformBreakdown.map(p => (
                <div key={p.platform} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{p.platform}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)' }}>{p.mentions}</span>
                    <span style={{ fontSize: 11, color: 'var(--color-text-muted)', width: 30, textAlign: 'right' }}>{p.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly trend */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Weekly Growth Trend</div>
              <div className="card-sub">Month of April — total mentions per week</div>
            </div>
            <span style={{ fontSize: 12, color: 'var(--color-success)', fontWeight: 700, background: 'var(--color-success-dim)', padding: '3px 10px', borderRadius: 20 }}>
              +130% MTD
            </span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={weeklyTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="mentions" name="Mentions" stroke="#6366f1" fill="url(#gTotal)" strokeWidth={2.5} dot={{ fill: '#6366f1', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top content + top sources */}
      <div className="two-col">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Top Performing Content</div>
            <div className="card-sub">By mention count this week</div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Content</th>
                <th>Platform</th>
                <th>Mentions</th>
              </tr>
            </thead>
            <tbody>
              {topContent.map((c, i) => (
                <tr key={c.title}>
                  <td style={{ color: 'var(--color-text-muted)', fontWeight: 700 }}>{i + 1}</td>
                  <td style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{c.title}</td>
                  <td><PlatformBadge platform={c.platform} /></td>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--color-accent-light)' }}>{c.mentions}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Top Sources</div>
            <div className="card-sub">By mention frequency & reach</div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Source</th>
                <th>Platform</th>
                <th>Reach</th>
                <th>Mentions</th>
              </tr>
            </thead>
            <tbody>
              {topSources.map(s => (
                <tr key={s.name}>
                  <td style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{s.name}</td>
                  <td><PlatformBadge platform={s.platform} /></td>
                  <td style={{ color: 'var(--color-text-muted)' }}>{s.reach}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{s.mentions}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
