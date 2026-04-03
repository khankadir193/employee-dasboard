import { useEffect, useMemo, useState } from 'react'

import useEmployees from '../hooks/useEmployees.js'
import useEmployeeAnalytics from '../hooks/useEmployeeAnalytics.js'
import { clearPerformanceRecords, getPerformanceRecords } from '../utils/appPerformanceAudit.js'

function statusColor(status) {
  if (status === 'pass') return 'rgba(34, 197, 94, 0.35)'
  if (status === 'warn') return 'rgba(234, 179, 8, 0.35)'
  if (status === 'fail') return 'rgba(239, 68, 68, 0.35)'
  return 'rgba(255,255,255,0.12)'
}

export default function PerformanceReport() {
  const { employees } = useEmployees()
  const { metrics } = useEmployeeAnalytics(employees)
  const [auditRecords, setAuditRecords] = useState(() => getPerformanceRecords())
  const [activeTab, setActiveTab] = useState(() => {
    try {
      return localStorage.getItem('employee-dashboard-next-performance-tab') === 'runaudit' ? 'runaudit' : 'performance'
    } catch {
      return 'performance'
    }
  })

  useEffect(() => {
    const refresh = () => setAuditRecords(getPerformanceRecords())
    window.addEventListener('performance-audit-saved', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('performance-audit-saved', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  useEffect(() => {
    if (activeTab !== 'runaudit') return
    try {
      localStorage.removeItem('employee-dashboard-next-performance-tab')
    } catch {
      // ignore
    }
  }, [activeTab])

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
      <h2 style={{ margin: '0 0 12px' }}>
        {activeTab === 'runaudit' ? 'Audit Report' : 'Performance Report'}
      </h2>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12, alignItems: 'center' }}>
        <button
          type="button"
          onClick={() => setActiveTab('performance')}
          aria-pressed={activeTab === 'performance'}
          style={{
            fontWeight: 800,
            background: activeTab === 'performance' ? 'rgba(124, 58, 237, 0.25)' : undefined,
          }}
        >
          Performance
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('runaudit')}
          aria-pressed={activeTab === 'runaudit'}
          style={{
            fontWeight: 800,
            background: activeTab === 'runaudit' ? 'rgba(124, 58, 237, 0.25)' : undefined,
          }}
        >
          RunAudit
        </button>
      </div>

      {activeTab === 'performance' ? (
        <>
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

          <div
            style={{
              display: 'grid',
              gap: 12,
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              marginTop: 12,
            }}
          >
            <section className="card" style={{ padding: 16 }}>
              <h3 style={{ fontSize: 18, marginBottom: 10 }}>Top 5 Performers</h3>
              <div style={{ display: 'grid', gap: 8 }}>
                {report.topPerformers.map((e, idx) => (
                  <div
                    key={`${e.name}-${e.joinDate}-${idx}`}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 12,
                      borderBottom: '1px solid rgba(255,255,255,0.1)',
                      paddingBottom: 6,
                    }}
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
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 12,
                      borderBottom: '1px solid rgba(255,255,255,0.1)',
                      paddingBottom: 6,
                    }}
                  >
                    <span>{e.name}</span>
                    <span style={{ opacity: 0.85 }}>{e.joinDate}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </>
      ) : null}

      {activeTab === 'runaudit' ? (
        <section className="card" style={{ padding: 16, marginTop: 12 }}>
        <div className="cardHeader" style={{ marginBottom: 10 }}>
          <div>
            <h3 style={{ fontSize: 18, marginBottom: 4 }}>App Performance Audit Records</h3>
            <p style={{ margin: 0, fontSize: 13, opacity: 0.8 }}>
              Reports are saved in this browser (localStorage) until you clear them or clear site data. Each Run Audit
              recalculates metrics and appends a new report.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              clearPerformanceRecords()
              setAuditRecords([])
            }}
          >
            Clear Records
          </button>
        </div>

        {auditRecords.length ? (
          <div style={{ display: 'grid', gap: 8 }}>
            {auditRecords.map((r) => (
              <div
                key={r.id}
                style={{
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10,
                  padding: 12,
                  display: 'grid',
                  gap: 10,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                    <strong>Score: {r.overallScore}/100</strong>
                    {r.evaluation?.summaryStatus ? (
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 800,
                          padding: '4px 8px',
                          borderRadius: 999,
                          background: statusColor(
                            r.evaluation.summaryStatus === 'pass'
                              ? 'pass'
                              : r.evaluation.summaryStatus === 'needs_improvement'
                                ? 'warn'
                                : 'fail'
                          ),
                        }}
                      >
                        {r.evaluation.summaryStatus === 'pass'
                          ? 'CHECK: OK'
                          : r.evaluation.summaryStatus === 'needs_improvement'
                            ? 'NEEDS IMPROVEMENT'
                            : 'ACTION REQUIRED'}
                      </span>
                    ) : null}
                  </div>
                  <span style={{ opacity: 0.8 }}>{new Date(r.createdAt).toLocaleString()}</span>
                </div>

                {r.evaluation?.summaryLabel ? (
                  <p style={{ margin: 0, fontSize: 14, opacity: 0.9 }}>{r.evaluation.summaryLabel}</p>
                ) : null}

                {r.evaluation?.checks?.length ? (
                  <div style={{ display: 'grid', gap: 6, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                    {r.evaluation.checks.map((c) => (
                      <div
                        key={c.key}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: 8,
                          padding: '8px 10px',
                          borderRadius: 8,
                          background: statusColor(c.status),
                          fontSize: 13,
                          flexWrap: 'wrap',
                        }}
                      >
                        <span style={{ fontWeight: 700 }}>{c.label}</span>
                        <span>
                          {c.display}{' '}
                          <span style={{ opacity: 0.85 }}>
                            (
                            {c.status === 'pass'
                              ? 'good'
                              : c.status === 'warn'
                                ? 'needs improvement'
                                : c.status === 'fail'
                                  ? 'poor'
                                  : 'n/a'}
                            )
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ margin: 0, fontSize: 13, opacity: 0.85 }}>
                    Run <strong>Run Audit</strong> again to generate full pass/warn checks and improvement hints for this
                    history entry.
                  </p>
                )}

                {r.evaluation?.improvements?.length ? (
                  <div>
                    <div style={{ fontWeight: 800, marginBottom: 6 }}>Suggested improvements</div>
                    <ul style={{ margin: 0, paddingLeft: 18, opacity: 0.95 }}>
                      {r.evaluation.improvements.map((line, i) => (
                        <li key={i} style={{ marginBottom: 4 }}>
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <details style={{ fontSize: 13, opacity: 0.9 }}>
                  <summary style={{ cursor: 'pointer', fontWeight: 700 }}>Raw metrics</summary>
                  <div style={{ marginTop: 8, display: 'grid', gap: 4, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
                    <span>FCP: {r.webVitals?.fcpMs ?? '—'} ms</span>
                    <span>LCP: {r.webVitals?.lcpMs ?? '—'} ms</span>
                    <span>FID: {r.webVitals?.fidMs ?? '—'} ms</span>
                    <span>TTI: {r.webVitals?.ttiMs ?? '—'} ms</span>
                    <span>TBT: {r.webVitals?.tbtMs ?? '—'} ms</span>
                    <span>CLS: {r.webVitals?.cls ?? '—'}</span>
                    <span>DCL: {r.diagnostics?.domContentLoadedMs ?? '—'} ms</span>
                    <span>Load: {r.diagnostics?.loadEventMs ?? '—'} ms</span>
                  </div>
                </details>
              </div>
            ))}
          </div>
        ) : (
          <p>No saved audit records yet. Click "Run Audit" in the header.</p>
        )}
      </section>
      ) : null}
    </div>
  )
}

