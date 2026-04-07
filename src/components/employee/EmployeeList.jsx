import './EmployeeList.css'
import EmployeeCard from './EmployeeCard.jsx'
import Pagination from '../common/Pagination.jsx'
import { memo } from 'react'

export default memo(EmployeeList)

function EmployeeList({ 
  employees = [], 
  totalCount = 0,
  currentPage = 1,
  pageSize = 12,
  onPageChange 
}) {
  if (!employees.length) {
    return (
      <div className="card" style={{ padding: 16 }}>
        <div style={{ fontWeight: 800 }}>No employees found</div>
        <div style={{ marginTop: 6, opacity: 0.8 }}>Try adjusting your filters.</div>
      </div>
    )
  }

  return (
    <>
      <div className="employee-grid">
        {employees.map((e, idx) => (
          <EmployeeCard key={`${e.id}-${currentPage}-${idx}`} employee={e} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </>
  )
}

