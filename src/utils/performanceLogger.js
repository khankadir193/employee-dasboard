const performanceLogger = {
  now: () => (typeof performance !== 'undefined' ? performance.now() : Date.now()),

  log: (label, payload) => {
    // Keep as a no-op by default to avoid noise.
    // You can enable console logging while profiling.
    void label
    void payload
  },
}

export default performanceLogger

