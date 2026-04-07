import { useEffect, useState } from 'react'
import useDebounce from '../../hooks/useDebounce.js'

import { departmentFilters } from '../../constants/filters.js'

export default function EmployeeFilters({ filters = {}, onChange }) {
  const [draft, setDraft] = useState(filters)
  const debouncedSearch = useDebounce(draft.search || '', 300)

  useEffect(() => {
    setDraft(filters)
  }, [filters])

  const handleSearchChange = (value) => {
    setDraft((d) => ({ ...d, search: value }))
  }

  return (
    <div className="card" style={{ padding: 16, marginTop: 12 }}>
      <div className="cardHeader">
        <div>
          <div style={{ fontWeight: 800 }}>Filters</div>
          <div style={{ opacity: 0.75, fontSize: 13, marginTop: 3 }}>Narrow down employees by department and performance.</div>
        </div>

        <button
          type="button"
          onClick={() => onChange?.({ ...draft, search: debouncedSearch })}
          style={{ whiteSpace: 'nowrap', fontWeight: 700 }}
        >
          Apply
        </button>
      </div>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', marginTop: 14 }}>
        <label style={{ display: 'grid', gap: 6, width: '100%' }}>
          <span style={{ fontSize: 13, opacity: 0.8, fontWeight: 700 }}>Search</span>
          <input
            type="text"
            value={draft.search ?? ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by name, role, or department..."
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid var(--border, #e5e4e7)',
              borderRadius: '6px',
              fontSize: '14px',
              background: 'var(--bg, #fff)'
            }}
            aria-label="Search employees"
          />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span style={{ fontSize: 13, opacity: 0.8, fontWeight: 700 }}>Department</span>
          <select
            value={draft.department ?? ''}
            onChange={(e) => setDraft((d) => ({ ...d, department: e.target.value }))}
            aria-label="Department filter"
          >
            <option value="">All</option>
            {departmentFilters.map((d) => (
              <option value={d} key={d}>
                {d}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span style={{ fontSize: 13, opacity: 0.8, fontWeight: 700 }}>Min Performance</span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={5}
            value={draft.minPerformance ?? ''}
            onChange={(e) => setDraft((d) => ({ ...d, minPerformance: e.target.value }))}
            placeholder="e.g. 4"
            aria-label="Min performance filter"
          />
        </label>
      </div>
    </div>
  )
}

