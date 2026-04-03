import { useMemo, useState } from 'react'

import Routes from './routes.jsx'
import { runPerformanceAudit } from '../utils/appPerformanceAudit.js'

export default function App() {
  // Minimal "router" state to emulate navigation without extra deps.
  const [view, setView] = useState('dashboard')
  const [isAuditing, setIsAuditing] = useState(false)
  const [lastAuditScore, setLastAuditScore] = useState(null)

  const routeProps = useMemo(() => ({ view }), [view])

  async function handleRunAudit() {
    if (isAuditing) return
    setIsAuditing(true)
    try {
      const record = await runPerformanceAudit()
      setLastAuditScore(record.overallScore)
      window.dispatchEvent(new CustomEvent('performance-audit-saved', { detail: record }))
      try {
        localStorage.setItem('employee-dashboard-next-performance-tab', 'runaudit')
      } catch {
        // ignore
      }
      setView('report')
    } finally {
      setIsAuditing(false)
    }
  }

  return (
    <div style={{ padding: 16, maxWidth: 1100, margin: '0 auto' }}>
      <header style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <h1 style={{ margin: 0, fontSize: 'clamp(1.1rem, 2vw, 1.8rem)' }}>Employee Analytics Dashboard</h1>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={() => setView('dashboard')}>Dashboard</button>
          <button onClick={() => setView('report')}>Performance</button>
          <button onClick={handleRunAudit} disabled={isAuditing} title="Run app performance audit and save history">
            {isAuditing ? 'Running Audit...' : 'Run Audit'}
          </button>
        </div>
      </header>

      {lastAuditScore !== null ? (
        <div className="card" style={{ padding: 10, marginTop: 12 }}>
          <strong>Latest Audit Score:</strong> {lastAuditScore}/100
        </div>
      ) : null}

      <main style={{ marginTop: 16 }}>
        <Routes {...routeProps} />
      </main>
    </div>
  )
}

