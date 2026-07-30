# Changes

## What Was Refactored

- Kept `DashboardPage.jsx` as the state manager for tasks, filters, search, and task creation.
- Extracted the dashboard stats grid into `components/dashboard/StatsRow.jsx`.
- Converted `components/shared/StatCard.jsx` into a reusable single-card component.
- Extracted the task list into `components/dashboard/TaskList.jsx`.
- Extracted each task row into `components/shared/TaskItem.jsx`.
- Updated `AddTaskInput.jsx` so it receives task input state and add behavior through props.
- Updated `TaskFilterBar.jsx` so it receives filter/search state and setters through props.

## Why These Changes Matter

- `DashboardPage.jsx` now coordinates state and composes components instead of rendering every UI detail directly.
- Shared components are reusable because they receive data through props instead of depending on page-specific state.
- Dashboard-specific components keep related UI grouped without making the page file large again.
- The app behavior remains the same: users can add tasks, filter tasks, search tasks, complete tasks, and delete tasks.

## Final Component Structure

```txt
src/
├── pages/
│   └── DashboardPage.jsx
├── components/
│   ├── dashboard/
│   │   ├── AddTaskInput.jsx
│   │   ├── DashboardHeader.jsx
│   │   ├── StatsRow.jsx
│   │   ├── TaskFilterBar.jsx
│   │   └── TaskList.jsx
│   └── shared/
│       ├── StatCard.jsx
│       └── TaskItem.jsx
└── data/
    └── tasks.js
```
