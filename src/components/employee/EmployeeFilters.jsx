import { useEffect, useState } from 'react'

import { departmentFilters } from '../../constants/filters.js'

export default function EmployeeFilters({ filters = {}, onChange }) {
  const [draft, setDraft] = useState(filters)

  useEffect(() => {
    setDraft(filters)
  }, [filters])

  return (
    <div className="card" style={{ padding: 16, marginTop: 12 }}>
      <div className="cardHeader">
        <div>
          <div style={{ fontWeight: 800 }}>Filters</div>
          <div style={{ opacity: 0.75, fontSize: 13, marginTop: 3 }}>Narrow down employees by department and performance.</div>
        </div>

        <button
          type="button"
          onClick={() => onChange?.(draft)}
          style={{ whiteSpace: 'nowrap', fontWeight: 700 }}
        >
          Apply
        </button>
      </div>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginTop: 14 }}>
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

