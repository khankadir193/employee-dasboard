import { memo } from 'react'

export default memo(function Pagination({ 
  currentPage, 
  totalCount, 
  pageSize = 12, 
  onPageChange, 
  className = '' 
}) {
  const totalPages = Math.ceil(totalCount / pageSize)
  if (totalPages <= 1) return null

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []
    let l = Math.max(2, currentPage - delta)
    let r = Math.min(totalPages - 1, currentPage + delta)

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= l && i <= r)) {
        range.push(i)
      }
    }

    for (let i of range) {
      if (rangeWithDots.length && i - rangeWithDots[rangeWithDots.length - 1] !== 1) {
        rangeWithDots.push('...')
      }
      rangeWithDots.push(i)
    }

    return rangeWithDots
  }

  return (
    <div className={`pagination ${className}`} style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      gap: 8, 
      marginTop: 24,
      flexWrap: 'wrap',
      padding: '16px 0'
    }}>
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        style={{
          padding: '8px 12px',
          border: '1px solid var(--border)',
          background: currentPage === 1 ? 'var(--bg)' : 'transparent',
          borderRadius: 6,
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          opacity: currentPage === 1 ? 0.5 : 1
        }}
        aria-label="First page"
      >
        « First
      </button>

      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        style={{
          padding: '8px 12px',
          border: '1px solid var(--border)',
          background: 'transparent',
          borderRadius: 6,
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          opacity: currentPage === 1 ? 0.5 : 1
        }}
        aria-label="Previous page"
      >
        ‹ Prev
      </button>

      {getVisiblePages().map((page, idx) => (
        <button
          key={idx}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
          style={{
            minWidth: 36,
            padding: '8px 12px',
            border: currentPage === page ? '2px solid var(--accent)' : '1px solid var(--border)',
            background: currentPage === page ? 'var(--accent-bg)' : 'transparent',
            color: currentPage === page ? 'var(--accent)' : 'inherit',
            borderRadius: 6,
            cursor: page === '...' ? 'default' : 'pointer',
            fontWeight: currentPage === page ? 700 : 'normal'
          }}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        style={{
          padding: '8px 12px',
          border: '1px solid var(--border)',
          background: 'transparent',
          borderRadius: 6,
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          opacity: currentPage === totalPages ? 0.5 : 1
        }}
        aria-label="Next page"
      >
        Next ›
      </button>

      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        style={{
          padding: '8px 12px',
          border: '1px solid var(--border)',
          background: currentPage === totalPages ? 'var(--bg)' : 'transparent',
          borderRadius: 6,
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          opacity: currentPage === totalPages ? 0.5 : 1
        }}
        aria-label="Last page"
      >
        Last »
      </button>

      <div style={{ marginLeft: 'auto', fontSize: 13, opacity: 0.8, whiteSpace: 'nowrap' }}>
        Page {currentPage} of {totalPages} ({totalCount} total)
      </div>
    </div>
  )
})

