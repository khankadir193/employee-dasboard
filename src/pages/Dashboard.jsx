import { useCallback, useMemo, useState } from 'react'

import EmployeeList from '../components/employee/EmployeeList.jsx'
import EmployeeFilters from '../components/employee/EmployeeFilters.jsx'

import useEmployees from '../hooks/useEmployees.js'
import useEmployeeAnalytics from '../hooks/useEmployeeAnalytics.js'

export default function Dashboard() {
  const { employees } = useEmployees()
  const { metrics } = useEmployeeAnalytics(employees)

  const [filters, setFilters] = useState({ department: '', minPerformance: '' })

  const filteredEmployees = useMemo(() => {
    const minPerfNum = filters.minPerformance === '' ? null : Number(filters.minPerformance)

    return employees.filter((e) => {
      if (filters.department && e.department !== filters.department) return false
      if (minPerfNum !== null && !Number.isNaN(minPerfNum) && e.performanceScore < minPerfNum) return false
      return true
    })
  }, [employees, filters])

  const handleFiltersChange = useCallback((next) => {
    setFilters(next)
  }, [])

  return (
    <div>
      <h2 style={{ margin: '0 0 12px' }}>Dashboard</h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12,
          marginBottom: 12,
        }}
      >
        <div className="card" style={{ padding: 16 }}>
          <div style={{ fontWeight: 700, opacity: 0.9 }}>Employees</div>
          <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6 }}>{metrics?.employeesCount ?? 0}</div>
        </div>
        <div className="card" style={{ padding: 16 }}>
          <div style={{ fontWeight: 700, opacity: 0.9 }}>Avg Salary</div>
          <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6 }}>
            {metrics?.avgSalary ? `$${Math.round(metrics.avgSalary).toLocaleString()}` : '$0'}
          </div>
        </div>
        <div className="card" style={{ padding: 16 }}>
          <div style={{ fontWeight: 700, opacity: 0.9 }}>Top Department</div>
          <div style={{ fontSize: 18, fontWeight: 800, marginTop: 6 }}>{metrics?.topDepartment ?? '-'}</div>
        </div>
      </div>

      <EmployeeFilters filters={filters} onChange={handleFiltersChange} />

      <div style={{ marginTop: 16 }}>
        {/* Render full large dataset directly (requested). */}
        <EmployeeList employees={filteredEmployees} />
      </div>
    </div>
  )
}

