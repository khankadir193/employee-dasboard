import { useMemo, useState } from 'react'

import Routes from './routes.jsx'

export default function App() {
  // Minimal "router" state to emulate navigation without extra deps.
  const [view, setView] = useState('dashboard')

  const routeProps = useMemo(() => ({ view }), [view])

  return (
    <div style={{ padding: 16, maxWidth: 1100, margin: '0 auto' }}>
      <header style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Employee Analytics Dashboard</h1>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button onClick={() => setView('dashboard')}>Dashboard</button>
          <button onClick={() => setView('report')}>Performance</button>
        </div>
      </header>

      <main style={{ marginTop: 16 }}>
        <Routes {...routeProps} />
      </main>
    </div>
  )
}

