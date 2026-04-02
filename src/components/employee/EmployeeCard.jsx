export default function EmployeeCard({ employee }) {
  if (!employee) return null
  return (
    <div className="card" style={{ padding: 16, textAlign: 'left' }}>
      <div style={{ fontWeight: 800, fontSize: 16 }}>{employee.name ?? 'Employee'}</div>
      <div style={{ opacity: 0.9, marginTop: 6, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ opacity: 0.85 }}>Dept:</span>
        <span style={{ fontWeight: 700 }}>{employee.department ?? '-'}</span>
      </div>
      <div style={{ opacity: 0.9, marginTop: 6, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ opacity: 0.85 }}>Role:</span>
        <span style={{ fontWeight: 700 }}>{employee.role ?? '-'}</span>
      </div>
      <div style={{ opacity: 0.9, marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ opacity: 0.85 }}>Salary:</span>
        <span style={{ fontWeight: 800 }}>${Number(employee.salary ?? 0).toLocaleString()}</span>
      </div>
      <div style={{ opacity: 0.9, marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ opacity: 0.85 }}>Performance:</span>
        <span style={{ fontWeight: 800 }}>{employee.performanceScore ?? '-'}</span>
      </div>
      <div style={{ opacity: 0.75, marginTop: 10, fontSize: 13 }}>
        Joined: {employee.joinDate ?? '-'}
      </div>
    </div>
  )
}

