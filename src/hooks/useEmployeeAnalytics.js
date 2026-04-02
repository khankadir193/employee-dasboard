import { useMemo } from 'react'

import { calculateEmployeeAnalytics } from '../utils/heavyCalculation.js'
import performanceLogger from '../utils/performanceLogger.js'

export default function useEmployeeAnalytics(employees = []) {
  const metrics = useMemo(() => {
    const startedAt = performanceLogger.now?.() ?? Date.now()
    const result = calculateEmployeeAnalytics(employees)
    const finishedAt = performanceLogger.now?.() ?? Date.now()
    performanceLogger.log?.('calculateEmployeeAnalytics', { durationMs: finishedAt - startedAt })
    return result
  }, [employees])

  return { metrics }
}

