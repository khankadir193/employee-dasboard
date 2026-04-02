/**
 * App performance audit (Web Vitals–style).
 * Records persist in localStorage until the user clears them or browser/site data is removed.
 * (Browser storage survives OS restarts; it is not tied to a single machine shutdown.)
 */

const STORAGE_KEY = 'employee-dashboard-performance-records'
/** Keep many runs; each record is small. Trim oldest if over limit. */
const MAX_RECORDS = 200

/** Industry-style targets (align with Lighthouse / Web Vitals guidance). */
export const AUDIT_THRESHOLDS = {
  fcp: { goodMs: 1800, poorMs: 3000, label: 'First Contentful Paint' },
  lcp: { goodMs: 2500, poorMs: 4000, label: 'Largest Contentful Paint' },
  fid: { goodMs: 100, poorMs: 300, label: 'First Input Delay' },
  cls: { good: 0.1, poor: 0.25, label: 'Cumulative Layout Shift' },
  tbt: { goodMs: 200, poorMs: 600, label: 'Total Blocking Time' },
  tti: { goodMs: 3800, poorMs: 7300, label: 'Time to Interactive (est.)' },
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function scoreFromThresholds(value, good, poor) {
  if (value === null || value === undefined || Number.isNaN(value)) return 50
  if (value <= good) return 100
  if (value >= poor) return 0
  return Math.round(((poor - value) / (poor - good)) * 100)
}

function statusForLowerIsBetter(value, good, poor) {
  if (value === null || value === undefined || Number.isNaN(value)) return 'unknown'
  if (value <= good) return 'pass'
  if (value <= poor) return 'warn'
  return 'fail'
}

/**
 * Per-metric check + human-readable improvement hint.
 */
export function evaluateAudit(webVitals = {}) {
  const { fcpMs, lcpMs, fidMs, cls, tbtMs, ttiMs } = webVitals
  const checks = []
  const improvements = []

  const add = (key, label, value, unit, good, poor, formatter) => {
    const st = statusForLowerIsBetter(value, good, poor)
    const display = value === null || value === undefined ? '—' : formatter ? formatter(value) : `${value}${unit}`
    checks.push({
      key,
      label,
      value,
      display,
      unit,
      status: st,
      good,
      poor,
    })
    if (st === 'fail' || st === 'warn') {
      if (key === 'fcp')
        improvements.push(
          st === 'fail'
            ? 'FCP: Reduce render-blocking resources, optimize critical CSS, and defer non-critical JS.'
            : 'FCP: Consider smaller above-the-fold payload and faster server response.'
        )
      if (key === 'lcp')
        improvements.push(
          st === 'fail'
            ? 'LCP: Optimize largest image/text paint (preload hero assets, proper sizing, CDN, reduce TTFB).'
            : 'LCP: Aim under 2.5s — compress images and avoid large client-rendered hero content.'
        )
      if (key === 'fid')
        improvements.push(
          'FID: Break up long JS tasks, defer third-party scripts, and reduce main-thread work during input.'
        )
      if (key === 'cls')
        improvements.push(
          'CLS: Reserve space for images/ads/fonts; avoid inserting content above existing layout without dimensions.'
        )
      if (key === 'tbt')
        improvements.push(
          'TBT: Split long tasks, use web workers for heavy work, and audit bundle size.'
        )
      if (key === 'tti')
        improvements.push(
          'TTI: Reduce JS parse/compile cost and delay non-essential scripts until after interactive.'
        )
    }
    if (st === 'unknown' && key === 'fid')
      improvements.push('FID: No first input yet — interact with the page (click/type) before or during audit for a real FID.')
  }

  add('fcp', AUDIT_THRESHOLDS.fcp.label, fcpMs, ' ms', AUDIT_THRESHOLDS.fcp.goodMs, AUDIT_THRESHOLDS.fcp.poorMs, (v) => `${v} ms`)
  add('lcp', AUDIT_THRESHOLDS.lcp.label, lcpMs, ' ms', AUDIT_THRESHOLDS.lcp.goodMs, AUDIT_THRESHOLDS.lcp.poorMs, (v) => `${v} ms`)
  add('fid', AUDIT_THRESHOLDS.fid.label, fidMs, ' ms', AUDIT_THRESHOLDS.fid.goodMs, AUDIT_THRESHOLDS.fid.poorMs, (v) => `${v} ms`)
  add('cls', AUDIT_THRESHOLDS.cls.label, cls, '', AUDIT_THRESHOLDS.cls.good, AUDIT_THRESHOLDS.cls.poor, (v) => String(v))
  add('tbt', AUDIT_THRESHOLDS.tbt.label, tbtMs, ' ms', AUDIT_THRESHOLDS.tbt.goodMs, AUDIT_THRESHOLDS.tbt.poorMs, (v) => `${v} ms`)
  add('tti', AUDIT_THRESHOLDS.tti.label, ttiMs, ' ms', AUDIT_THRESHOLDS.tti.goodMs, AUDIT_THRESHOLDS.tti.poorMs, (v) => `${v} ms`)

  const fail = checks.filter((c) => c.status === 'fail').length
  const warn = checks.filter((c) => c.status === 'warn').length
  let summaryStatus = 'pass'
  if (fail > 0) summaryStatus = 'fail'
  else if (warn > 0) summaryStatus = 'needs_improvement'

  const uniqueImprovements = [...new Set(improvements)]

  return {
    summaryStatus,
    summaryLabel:
      summaryStatus === 'pass'
        ? 'All measured metrics meet or approach good targets.'
        : summaryStatus === 'needs_improvement'
          ? 'Some metrics need improvement to match best-practice targets.'
          : 'One or more metrics are in the poor range — prioritize fixes below.',
    checks,
    improvements: uniqueImprovements,
    counts: { pass: checks.filter((c) => c.status === 'pass').length, warn, fail, unknown: checks.filter((c) => c.status === 'unknown').length },
  }
}

function readNavigationTiming() {
  if (typeof performance === 'undefined') return null
  const [nav] = performance.getEntriesByType('navigation')
  if (!nav) return null

  return {
    domInteractiveMs: Math.round(nav.domInteractive || 0),
    domContentLoadedMs: Math.round(nav.domContentLoadedEventEnd),
    loadEventMs: Math.round(nav.loadEventEnd),
    transferSizeKb: Math.round((nav.transferSize || 0) / 1024),
  }
}

function readEntryByName(type, name) {
  if (typeof performance === 'undefined') return null
  const entries = performance.getEntriesByType(type)
  const entry = entries.find((e) => e.name === name)
  return entry ? Math.round(entry.startTime) : null
}

async function collectWebVitalsSnapshot(windowMs = 1500) {
  const snapshot = {
    fcpMs: readEntryByName('paint', 'first-contentful-paint'),
    lcpMs: null,
    fidMs: null,
    cls: 0,
    tbtMs: 0,
    ttiMs: null,
  }

  if (typeof PerformanceObserver === 'undefined') return snapshot

  let clsValue = 0
  let lcpValue = null
  let fidValue = null
  const longTasks = []

  const observers = []
  const register = (type, handler) => {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) handler(entry)
      })
      observer.observe({ type, buffered: true })
      observers.push(observer)
    } catch {
      // Entry type not supported.
    }
  }

  register('largest-contentful-paint', (entry) => {
    lcpValue = Math.round(entry.startTime)
  })

  register('first-input', (entry) => {
    const delay = entry.processingStart - entry.startTime
    if (fidValue === null) fidValue = Math.max(0, Math.round(delay))
  })

  register('layout-shift', (entry) => {
    if (!entry.hadRecentInput) clsValue += entry.value
  })

  register('longtask', (entry) => {
    longTasks.push({
      start: entry.startTime,
      duration: entry.duration,
      end: entry.startTime + entry.duration,
    })
  })

  await new Promise((resolve) => setTimeout(resolve, windowMs))
  observers.forEach((o) => o.disconnect())

  snapshot.lcpMs = lcpValue
  snapshot.fidMs = fidValue
  snapshot.cls = Number(clsValue.toFixed(3))

  const navigation = readNavigationTiming()
  const fcpRef = snapshot.fcpMs ?? 0
  const lastLongTaskEnd = longTasks.reduce((max, t) => Math.max(max, t.end), 0)
  const interactiveRef = navigation?.domInteractiveMs ?? 0
  const ttiEstimate = Math.max(fcpRef, lcpValue ?? 0, interactiveRef, lastLongTaskEnd)
  snapshot.ttiMs = ttiEstimate > 0 ? Math.round(ttiEstimate) : null

  const tbt = longTasks.reduce((sum, t) => {
    const startsAfterFcp = t.start >= fcpRef
    const beforeTti = snapshot.ttiMs ? t.start <= snapshot.ttiMs : true
    if (!startsAfterFcp || !beforeTti) return sum
    return sum + Math.max(0, t.duration - 50)
  }, 0)
  snapshot.tbtMs = Math.round(tbt)

  return snapshot
}

export function getPerformanceRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function clearPerformanceRecords() {
  localStorage.removeItem(STORAGE_KEY)
}

function persistRecords(next) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch (e) {
    if (e?.name === 'QuotaExceededError' && next.length > 1) {
      persistRecords(next.slice(0, Math.floor(next.length / 2)))
    }
  }
}

export async function runPerformanceAudit() {
  const navigation = readNavigationTiming()
  const vitals = await collectWebVitalsSnapshot(1500)

  const fcpScore = scoreFromThresholds(vitals.fcpMs, AUDIT_THRESHOLDS.fcp.goodMs, AUDIT_THRESHOLDS.fcp.poorMs)
  const lcpScore = scoreFromThresholds(vitals.lcpMs, AUDIT_THRESHOLDS.lcp.goodMs, AUDIT_THRESHOLDS.lcp.poorMs)
  const fidScore = scoreFromThresholds(vitals.fidMs, AUDIT_THRESHOLDS.fid.goodMs, AUDIT_THRESHOLDS.fid.poorMs)
  const ttiScore = scoreFromThresholds(vitals.ttiMs, AUDIT_THRESHOLDS.tti.goodMs, AUDIT_THRESHOLDS.tti.poorMs)
  const tbtScore = scoreFromThresholds(vitals.tbtMs, AUDIT_THRESHOLDS.tbt.goodMs, AUDIT_THRESHOLDS.tbt.poorMs)
  const clsScore = scoreFromThresholds(vitals.cls, AUDIT_THRESHOLDS.cls.good, AUDIT_THRESHOLDS.cls.poor)

  const overallScore = clamp(
    Math.round(
      fcpScore * 0.1 +
        lcpScore * 0.25 +
        fidScore * 0.2 +
        ttiScore * 0.2 +
        tbtScore * 0.15 +
        clsScore * 0.1
    ),
    0,
    100
  )

  const webVitals = {
    fcpMs: vitals.fcpMs,
    lcpMs: vitals.lcpMs,
    fidMs: vitals.fidMs,
    ttiMs: vitals.ttiMs,
    tbtMs: vitals.tbtMs,
    cls: vitals.cls,
  }

  const evaluation = evaluateAudit(webVitals)

  const record = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    overallScore,
    scores: {
      fcpScore,
      lcpScore,
      fidScore,
      ttiScore,
      tbtScore,
      clsScore,
    },
    webVitals,
    evaluation,
    diagnostics: {
      domInteractiveMs: navigation?.domInteractiveMs ?? null,
      domContentLoadedMs: navigation?.domContentLoadedMs ?? null,
      loadEventMs: navigation?.loadEventMs ?? null,
      transferSizeKb: navigation?.transferSizeKb ?? null,
    },
  }

  const next = [record, ...getPerformanceRecords()].slice(0, MAX_RECORDS)
  persistRecords(next)
  return record
}

export const AUDIT_STORAGE_KEY = STORAGE_KEY
