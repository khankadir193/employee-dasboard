import { useEffect, useState } from 'react'

import employeeService from '../services/employeeService.js'

export default function useEmployees() {
  const [employees, setEmployees] = useState([])

  useEffect(() => {
    let alive = true
    employeeService
      .getEmployees()
      .then((data) => {
        if (alive) setEmployees(data)
      })
      .catch(() => {
        // Placeholder: keep empty list on errors for now.
      })

    return () => {
      alive = false
    }
  }, [])

  return { employees }
}

