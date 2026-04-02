/**
 * Placeholder for a Web Worker.
 * Not wired up yet in the UI.
 */

export function calculateSalaryStats(employees = []) {
  const total = employees.reduce((sum, e) => sum + (e.salary ?? 0), 0)
  const avg = employees.length ? total / employees.length : 0
  return { totalSalary: total, avgSalary: avg }
}

