import EmployeeCard from './EmployeeCard.jsx'

import { memo } from 'react'

export default memo(EmployeeList)

function EmployeeList({ employees = [] }) {
  if (!employees.length) {
    return (
      <div className="card" style={{ padding: 16 }}>
        <div style={{ fontWeight: 800 }}>No employees found</div>
        <div style={{ marginTop: 6, opacity: 0.8 }}>Try adjusting your filters.</div>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
      {employees.map((e, idx) => (
        <EmployeeCard key={`${e.name}-${e.joinDate}-${idx}`} employee={e} />
      ))}
    </div>
  )
}

