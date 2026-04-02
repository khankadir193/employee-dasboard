/**
 * Placeholder for expensive analytics.
 * Later, move heavy work to a Web Worker.
 */
export function calculateEmployeeAnalytics(employees = []) {
  const totalSalary = employees.reduce((sum, e) => sum + (e.salary ?? 0), 0)
  const avgSalary = employees.length ? totalSalary / employees.length : 0

  // Very small "metrics" object to keep UI responsive.
  return {
    employeesCount: employees.length,
    avgSalary,
    topDepartment:
      employees.length
        ? (() => {
            const m = new Map()
            for (const e of employees) {
              const key = e.department ?? 'Unknown'
              m.set(key, (m.get(key) ?? 0) + 1)
            }
            let best = null
            for (const [dept, c] of m.entries()) {
              if (!best || c > best.count) best = { dept, count: c }
            }
            return best?.dept ?? 'Unknown'
          })()
        : null,
  }
}

