import useEmployeeAnalytics from '../hooks/useEmployeeAnalytics.js'

export default function PerformanceReport() {
  const { metrics } = useEmployeeAnalytics()

  return (
    <div>
      <h2 style={{ margin: '0 0 12px' }}>Performance Report</h2>
      <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Summary</div>
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {JSON.stringify(metrics, null, 2)}
        </pre>
      </div>
    </div>
  )
}

