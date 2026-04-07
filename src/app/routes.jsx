import { lazy, Suspense } from 'react'
const Dashboard = lazy(() => import('../pages/Dashboard.jsx'))
const PerformanceReport = lazy(() => import('../pages/PerformanceReport.jsx'))

/**
 * Simple placeholder routing layer.
 * Replace with `react-router-dom` later if you want real URL routing.
 */
export default function Routes({ view }) {
  return (
    <Suspense fallback={<div style={{ padding: 32, textAlign: 'center', opacity: 0.7 }}>Loading page...</div>}>
      {view === 'report' ? <PerformanceReport /> : <Dashboard />}
    </Suspense>
  )
}

