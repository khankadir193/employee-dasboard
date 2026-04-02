import { useMemo } from 'react'

import useEmployees from '../hooks/useEmployees.js'
import useEmployeeAnalytics from '../hooks/useEmployeeAnalytics.js'

export default function PerformanceReport() {
  const { employees } = useEmployees()
  const { metrics } = useEmployeeAnalytics(employees)

  const report = useMemo(() => {
    if (!employees.length) {
      return {
        topPerformers: [],
        deptRows: [],
        recentJoiners: [],
      }
    }

    const deptMap = new Map()
    for (const e of employees) {
      const dept = e.department ?? 'Unknown'
      const existing = deptMap.get(dept) ?? {
        department: dept,
        count: 0,
        totalSalary: 0,
        performanceTotal: 0,
      }
      existing.count += 1
      existing.totalSalary += Number(e.salary ?? 0)
      existing.performanceTotal += Number(e.performanceScore ?? 0)
      deptMap.set(dept, existing)
    }

    const deptRows = Array.from(deptMap.values())
      .map((d) => ({
        ...d,
        avgSalary: d.count ? d.totalSalary / d.count : 0,
        avgPerformance: d.count ? d.performanceTotal / d.count : 0,
      }))
      .sort((a, b) => b.avgPerformance - a.avgPerformance)

    const topPerformers = [...employees]
      .sort((a, b) => {
        const perfDelta = Number(b.performanceScore ?? 0) - Number(a.performanceScore ?? 0)
        if (perfDelta !== 0) return perfDelta
        return Number(b.salary ?? 0) - Number(a.salary ?? 0)
      })
      .slice(0, 5)

    const recentJoiners = [...employees]
      .sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())
      .slice(0, 5)

    return { topPerformers, deptRows, recentJoiners }
  }, [employees])

  return (
    <div>
      <h2 style={{ margin: '0 0 12px' }}>Performance Report</h2>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="card" style={{ padding: 16 }}>
          <div style={{ opacity: 0.85, fontWeight: 700 }}>Total Employees</div>
          <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6 }}>
            {(metrics?.employeesCount ?? 0).toLocaleString()}
          </div>
        </div>
        <div className="card" style={{ padding: 16 }}>
          <div style={{ opacity: 0.85, fontWeight: 700 }}>Average Salary</div>
          <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6 }}>
            ${Math.round(metrics?.avgSalary ?? 0).toLocaleString()}
          </div>
        </div>
        <div className="card" style={{ padding: 16 }}>
          <div style={{ opacity: 0.85, fontWeight: 700 }}>Top Department</div>
          <div style={{ fontSize: 18, fontWeight: 800, marginTop: 8 }}>{metrics?.topDepartment ?? '-'}</div>
        </div>
      </div>

      <section className="card" style={{ padding: 16, marginTop: 12 }}>
        <h3 style={{ fontSize: 18, marginBottom: 10 }}>Department Performance</h3>
        {report.deptRows.length ? (
          <div style={{ display: 'grid', gap: 8 }}>
            {report.deptRows.map((row) => (
              <div
                key={row.department}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr',
                  gap: 10,
                  padding: '10px 12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10,
                }}
              >
                <strong>{row.department}</strong>
                <span>Count: {row.count}</span>
                <span>Avg Perf: {row.avgPerformance.toFixed(2)}</span>
                <span>Avg Salary: ${Math.round(row.avgSalary).toLocaleString()}</span>
              </div>
            ))}
          </div>
        ) : (
          <p>No department data available.</p>
        )}
      </section>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginTop: 12 }}>
        <section className="card" style={{ padding: 16 }}>
          <h3 style={{ fontSize: 18, marginBottom: 10 }}>Top 5 Performers</h3>
          <div style={{ display: 'grid', gap: 8 }}>
            {report.topPerformers.map((e, idx) => (
              <div
                key={`${e.name}-${e.joinDate}-${idx}`}
                style={{ display: 'flex', justifyContent: 'space-between', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 6 }}
              >
                <span>
                  {e.name} - {e.department}
                </span>
                <strong>{Number(e.performanceScore ?? 0).toFixed(1)}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="card" style={{ padding: 16 }}>
          <h3 style={{ fontSize: 18, marginBottom: 10 }}>Recent Joiners</h3>
          <div style={{ display: 'grid', gap: 8 }}>
            {report.recentJoiners.map((e, idx) => (
              <div
                key={`${e.name}-${e.joinDate}-recent-${idx}`}
                style={{ display: 'flex', justifyContent: 'space-between', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 6 }}
              >
                <span>{e.name}</span>
                <span style={{ opacity: 0.85 }}>{e.joinDate}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

