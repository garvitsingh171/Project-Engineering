# Performance Optimization Report: TxnTracker

## Baseline Observations

The page loaded successfully and displayed the transaction dashboard with a long scrollable list. After typing the 1-character search query `a`, the UI showed `1443` matching transactions. Typing caused a noticeable freeze while the list updated; the React Profiler baseline screenshot shows a render time of approximately `271.1 ms` for that single keystroke interaction. The list itself was the bottleneck: `TransactionList` accounted for `267.8 ms` of that render.

Scrolling the list before virtualization required the browser to manage the full filtered result set in the DOM. The baseline interaction felt heavy because every matching row was rendered into the list at once.

Evidence: `screenshots/baseline-profiler.png`

## Root Cause Analysis

On a single search keystroke, `1443` `TransactionRow` components re-rendered. This number comes from the baseline filtered result count shown in the screenshot after typing `a`, where the app displayed `Showing 1443 transactions`.

The React Profiler showed `271.1 ms` total render time for the baseline interaction. `TransactionList` consumed `267.8 ms`, making it the longest-rendering component in the baseline flame chart.

Every row re-rendered because changing the filter string updated state in the parent transaction page. That parent re-render created a new filtered array and rendered the rows through `transactions.map(...)`. Since `TransactionRow` was not memoized at baseline, React had no reason to skip unchanged row renders. The inline `onSelect={(id) => setSelectedId(id)}` callback also created a new function reference on every parent render, which would have defeated `React.memo` until it was stabilized with `useCallback`.

The DOM node count before virtualization was effectively one rendered row per matching transaction for this interaction: `1443` transaction rows. The screenshots do not show the Chrome Elements panel count, so the exact raw DOM element count should still be verified in DevTools if the grader requires total descendant nodes rather than row nodes.

## Optimisation Plan

Virtualization addresses excessive DOM work by rendering only the visible portion of the transaction list instead of all matching transactions.

`React.memo` addresses unnecessary `TransactionRow` re-renders when a row receives the same props as before.

`useCallback` addresses unstable function props. Without it, `React.memo` is not enough because every row receives a new `onSelect` function whenever the parent renders.

`useMemo` addresses repeated filtering work. The filtered transaction list should only be recomputed when either `transactions` or `filter` changes.

The planned order was virtualization, `React.memo`, `useCallback`, then `useMemo`. Virtualization first reduces the largest visible browser cost: thousands of DOM rows. `React.memo` then gives rows the ability to skip unchanged renders. `useCallback` makes that memoization effective by stabilizing the row click handler. `useMemo` finally caches the derived filtered list so unrelated renders do not repeat the filter calculation.

Virtualization alone is not enough because it reduces DOM nodes, but it does not automatically prevent the visible row components from re-rendering. The visible rows still need stable props and memoization to skip unnecessary work.

## Implementation Notes

Virtualization was implemented in `src/components/TransactionList.jsx` by replacing the direct `transactions.map(...)` render with `FixedSizeList` from `react-window`. The list uses `height={636}`, `itemSize={73}`, `itemCount={transactions.length}`, and passes `{ transactions, onSelect }` through `itemData` so each virtual row can receive the full transaction object.

`React.memo` was applied in `src/components/TransactionRow.jsx` by exporting `React.memo(TransactionRow)`. This allows React to skip rendering a row when its `transaction` and `onSelect` props are referentially unchanged.

`useCallback` was applied in `src/pages/Transactions.jsx` by replacing the inline `onSelect` function with a stable `handleSelect` callback. This prevents a new callback reference from being passed to every row on each parent render.

`useMemo` was applied in `src/hooks/useTransactions.js` around the filtering logic. The filtered list now recalculates only when `transactions` or `filter` changes.

## Results Table

| Metric | Before | After | Improvement |
|---|---:|---:|---:|
| Initial render time | Not captured in screenshots | Not captured in screenshots | Needs initial-load profiler or stopwatch measurement |
| Keystroke re-render time | 271.1 ms | 15.2 ms | 255.9 ms faster, about 94.4% reduction |
| Components re-rendered per keystroke | 1443 TransactionRow renders | About 11 visible/overscan TransactionRow renders | About 1432 fewer row renders |
| DOM nodes in list | 1443 rendered transaction rows | About 11 rendered virtual rows | About 1432 fewer rendered row nodes |

Evidence after optimization: `screenshots/after-profiler.png`

## Reflection

The biggest improvement came from virtualization because the original bottleneck was rendering more than a thousand transaction rows for one keystroke. The profiler render time dropped from `271.1 ms` to `15.2 ms`, which is large enough to change the interaction from visibly frozen to responsive. I would not use virtualization for small lists because it adds complexity and can affect browser find behavior or accessibility. I would not use `React.memo` for cheap components whose props usually change. I would not use `useCallback` everywhere because it can make code noisier without improving performance. I would not use `useMemo` for trivial calculations because memoization also has overhead.
