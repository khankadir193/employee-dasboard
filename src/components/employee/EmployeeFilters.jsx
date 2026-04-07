import { useEffect, useState } from 'react'
import useDebounce from '../../hooks/useDebounce.js'
import { departmentFilters } from '../../constants/filters.js'
import { memo } from 'react'

export default memo(EmployeeFilters)

function EmployeeFilters({ filters = {}, onChange }) {
  const [draft, setDraft] = useState(filters)
  const debouncedSearch = useDebounce(draft.search || '', 300)

  useEffect(() => {
    setDraft(filters)
  }, [filters])

  // Live apply search on debounce change
  useEffect(() => {
    if (onChange) {
      onChange({ ...draft, search: debouncedSearch })
    }
  }, [debouncedSearch, draft, onChange])

  const handleSearchChange = (value) => {
    setDraft((d) => ({ ...d, search: value }))
  }

  const clearSearch = () => {
    setDraft((d) => ({ ...d, search: '' }))
  }

  const handleApplyFilters = () => {
    onChange?.({ ...draft, search: debouncedSearch })
  }

  return (
    <div className="card" style={{ padding: 16, marginTop: 12 }}>
      <div className="cardHeader">
        <div>
          <div style={{ fontWeight: 800 }}>Filters</div>
          <div style={{ opacity: 0.75, fontSize: 13, marginTop: 3 }}>
            Narrow down employees by department and performance.
          </div>
        </div>
        <button
          type="button"
          onClick={handleApplyFilters}
          style={{ whiteSpace: 'nowrap', fontWeight: 700 }}
          className="apply-btn"
        >
          Apply
        </button>
      </div>

      {/* Search Section - Prominent above filters, full-width responsive */}
      <div style={{ marginTop: 14, marginBottom: 16 }}>
        <label style={{ display: 'block', width: '100%' }}>
          <span style={{ fontSize: 13, opacity: 0.8, fontWeight: 700, display: 'block', marginBottom: 6 }}>
            🔍 Search employees
          </span>
          <div style={{ position: 'relative', display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={draft.search ?? ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by name, role, or department..."
              className="search-input"
              style={{
                flex: 1,
                padding: '10px 16px 10px 44px',
                border: '1px solid var(--border, #e5e4e7)',
                borderRadius: '8px',
                fontSize: '16px',
                background: 'var(--bg, #fff)',
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              aria-label="Search employees"
            />
            {draft.search && (
              <button
                type="button"
                onClick={clearSearch}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  fontSize: '18px',
                  cursor: 'pointer',
                  opacity: 0.6,
                  padding: 0
                }}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
            Search updates automatically
          </div>
        </label>
      </div>

      {/* Filters Grid - Responsive */}
      <div 
        className="filters-grid"
        style={{
          display: 'grid',
          gap: '12px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          marginTop: 0
        }}
      >
        <label className="filter-label">
          <span style={{ fontSize: 13, opacity: 0.8, fontWeight: 700 }}>Department</span>
          <select
            value={draft.department ?? ''}
            onChange={(e) => setDraft((d) => ({ ...d, department: e.target.value }))}
            className="filter-select"
            aria-label="Department filter"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid var(--border, #e5e4e7)',
              borderRadius: '6px',
              fontSize: '14px',
              background: 'var(--bg, #fff)',
              outline: 'none'
            }}
          >
            <option value="">All Departments</option>
            {departmentFilters.map((d) => (
              <option value={d} key={d}>
                {d}
              </option>
            ))}
          </select>
        </label>

        <label className="filter-label">
          <span style={{ fontSize: 13, opacity: 0.8, fontWeight: 700 }}>Min Performance</span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={5}
            step={0.1}
            value={draft.minPerformance ?? ''}
            onChange={(e) => setDraft((d) => ({ ...d, minPerformance: e.target.value }))}
            placeholder="e.g. 4.0"
            className="filter-input"
            aria-label="Min performance filter"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid var(--border, #e5e4e7)',
              borderRadius: '6px',
              fontSize: '14px',
              background: 'var(--bg, #fff)',
              outline: 'none'
            }}
          />
        </label>
      </div>

      <style jsx>{`
        .filters-grid {
          @media (max-width: 640px) {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
        .search-input:focus {
          border-color: var(--accent, #aa3bff);
          box-shadow: 0 0 0 3px rgba(170, 59, 255, 0.1);
        }
        .filter-label {
          display: grid;
          gap: 6px;
        }
        .filter-select:focus,
        .filter-input:focus {
          border-color: var(--accent, #aa3bff);
          box-shadow: 0 0 0 3px rgba(170, 59, 255, 0.1);
        }
        @media (max-width: 640px) {
          .search-input {
            font-size: 16px !important;
            padding-left: 16px !important;
          }
        }
      `}</style>
    </div>
  )
}

