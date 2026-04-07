# Employee Dashboard - Full Stack Analytics App

## 🎯 Overview
Modern React dashboard for employee data analytics (400k+ records). Features search, filters, metrics, **optimized for massive datasets** with virtualization.

**Tech Stack:**
- React 19 + Vite 8 (fast HMR/build)
- Client-side filtering/search (debounced)
- `react-window` virtualization (renders ~20/400k cards)
- Performance audits (Web Vitals tracking)
- Responsive design (mobile/desktop grid/list)

## 📁 Project Structure
```
employee-dasboard/
├── src/
│   ├── app/                 # Router + main App.jsx
│   ├── components/
│   │   └── employee/        # Core UI: EmployeeList (virtual), EmployeeFilters (search+dept+perf), EmployeeCard (memoized)
│   ├── hooks/               # useEmployees, useDebounce, useEmployeeAnalytics
│   ├── services/            # employeeService.js (hardcoded 400k dataset)
│   ├── utils/               # generateEmployees, performanceLogger, appPerformanceAudit (Web Vitals)
│   ├── constants/           # filters.js (depts/roles)
│   └── style.css            # CSS vars + responsive base
├── public/                  # Assets
├── TODO.md                  # Development journey/interview log
└── package.json             # Minimal deps: React, react-window
```

## 🚀 Quick Start
```bash
npm install
npm run dev  # http://localhost:5173
```

**Test Large Data:**
- Search \"Marketing\" → instant filtered virtual list.
- Scroll 400k → smooth (only visible rendered).
- Filter dept/perf → combines with search.
- Resize → responsive list.

## 🔧 Key Optimizations (Large Dataset)
1. **Virtualization**: `FixedSizeList` (react-window) - renders 10-20 cards viewport.
2. **Memoization**: `React.memo(EmployeeCard)` - no re-render props stable.
3. **Debounced Search**: 300ms `useDebounce` on Apply.
4. **useMemo Filter**: Client-side on full array (fast JS).
5. **Responsive**: Mobile single column, desktop multi.

## 📊 Features
- **Dashboard**: Metrics (count, avg salary, top dept).
- **Search**: Name/role/dept (case-insensitive).
- **Filters**: Dept dropdown, min perf slider.
- **Performance**: Web Vitals audit utils.
- **Scalable**: 400k records no lag/crash.

## 🛠 Development Approach
See [TODO.md](TODO.md) for step-by-step (AI-assisted):
1. Setup Vite/React scaffold.
2. Hardcoded massive dataset.
3. Filters → search addition.
4. Virtualization optimization.
5. Fixes: imports, parse errors, responsive cols.

**Interview Highlights:**
- Handled 400k DOM challenge → virtualization.
- Tools: search_files/read_file for analysis.
- Edge cases: Bounds check, memo, debounce.

## 📈 Performance Audit
Utils track FCP/LCP/FID/CLS/TBT/TTI. Run locally, check localStorage.

## Build & Deploy
```bash
npm run build  # dist/
npm run preview
```

MIT License. Scale-ready employee analytics!
