# TODO / Change Record

## React project scaffold
- Created a Vite React project in `employee-analytics-dashboard/`.
- Converted the template to JavaScript (switched entry to `src/main.jsx`, added `react` + `react-dom` deps, removed TS scaffold files).

## Title
- Updated `index.html` `<title>` to `Employee Analytics Dashboard`.

## Folder structure reorg
- Reorganized `src/` to match the requested `react-performance-lab/` layout (converted `.ts/.tsx` names to `.js/.jsx`).
- Added placeholder components/pages/hooks/services/utils/constants/workers and `src/performance-metrics/*.md`.
- Updated `src/main.jsx` to render `src/app/App.jsx`.
- Left `src/style.css` intact from the Vite template for basic styling.

## Global styling
- Added `src/styles/` with `global.css`, `variables.css`, `reset.css`, `themes.css`.
- Updated `src/main.jsx` to import `src/styles/global.css` (new responsive, modern styling).

## Next steps (not implemented yet)
- Replace placeholder routing with `react-router-dom`.
- Wire up real employee filtering + fetching.
- Move expensive analytics to `src/workers/salaryWorker.js`.

## Hardcoded data + Dashboard rendering
- Added `src/utils/hardcodedEmployees.js` with the provided employee records.
- Updated `src/services/employeeService.js` to return the hardcoded dataset.
- Updated Dashboard UI to show KPI cards and an employee grid.
- Implemented basic filter UI (department + min performance score) and apply to the rendered list.
- Added `role` back to each employee record and display it on employee cards.

