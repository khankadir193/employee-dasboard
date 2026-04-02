export default function EmployeeRow({ employee }) {
  if (!employee) return null

  return (
    <div style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid #eee' }}>
      <div style={{ flex: 2 }}>{employee.name ?? 'Employee'}</div>
      <div style={{ flex: 1, opacity: 0.8 }}>{employee.department ?? 'Department'}</div>
      <div style={{ flex: 1, opacity: 0.8 }}>{employee.role ?? 'Role'}</div>
    </div>
  )
}

