import Dashboard from '../pages/Dashboard.jsx'
import PerformanceReport from '../pages/PerformanceReport.jsx'

/**
 * Simple placeholder routing layer.
 * Replace with `react-router-dom` later if you want real URL routing.
 */
export default function Routes({ view }) {
  if (view === 'report') return <PerformanceReport />
  return <Dashboard />
}

