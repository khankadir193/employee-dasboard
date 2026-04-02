const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)]

export function generateEmployees(count = 20) {
  const names = ['Ava', 'Noah', 'Mia', 'Leo', 'Sophia', 'Ethan', 'Olivia', 'James']
  const departments = ['Engineering', 'HR', 'Finance', 'Sales', 'Marketing']
  const roles = ['Manager', 'Analyst', 'Developer', 'Designer', 'Coordinator']

  return Array.from({ length: count }).map((_, i) => {
    const name = `${randomPick(names)} ${String.fromCharCode(65 + (i % 26))}.`
    const department = randomPick(departments)
    const role = randomPick(roles)

    return {
      id: i + 1,
      name,
      email: `employee${i + 1}@example.com`,
      department,
      role,
      salary: 70000 + Math.round(Math.random() * 90000),
    }
  })
}

