### Optimization Progress (Memo + Code-Splitting)

✅ **Previous:**
- Search/filter responsive.
- Virtualization `FixedSizeList` for 400k records.
- EmployeeCard memoized.

✅ **Step 1: Memo Components**
- EmployeeFilters.jsx, EmployeeList.jsx wrapped `memo()`.

✅ **Step 2: Lazy Loading**
- routes.jsx: `React.lazy` Dashboard/PerformanceReport + Suspense fallback.

✅ **Step 3: Vite Config**
- manualChunks: vendor (React/react-window), dashboard (pages/components), analytics (hooks/services).
- chunkSizeWarningLimit: 1000kb.

⏳ **Step 4: Test**
- `npm run build` - check chunks smaller.
- Verify lazy/memo perf.


⏳ **Step 4: Test**
- `npm run build` - analyze chunks.
- Runtime perf.

