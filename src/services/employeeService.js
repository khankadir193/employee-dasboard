import { HARD_CODED_EMPLOYEES } from '../utils/hardcodedEmployees.js'

const employeeService = {
  async getEmployees() {
    // Hardcoded dataset (as requested).
    return HARD_CODED_EMPLOYEES
  },
}

export default employeeService

