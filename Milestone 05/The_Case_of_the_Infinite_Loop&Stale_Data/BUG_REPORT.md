# Bug Report

## Bug #1 — Infinite Product Search Requests

**File:** `src/pages/ProductSearch.jsx`  
**Line(s):** 34-56

### Expected Behaviour

Typing in the product search box should trigger one controlled search for the current query after a short delay.

### Actual Behaviour

The original bug caused repeated API requests and made the page feel stuck because the effect kept re-running after its own state updates.

### Root Cause

The search effect depended on state that was updated inside the same effect. When `setResults()` created a new results array, React treated that as a dependency change and ran the effect again, creating a loop.

### Fix Applied

The effect should depend only on `query`, because the query is the user input that should trigger a new search. `results` should not be in the dependency array.

## Bug #2 — Stale Product Search Results

**File:** `src/pages/ProductSearch.jsx`  
**Line(s):** 34-56

### Expected Behaviour

When a user types quickly, the UI should show results for the latest search query only.

### Actual Behaviour

The original bug allowed older requests to finish after newer ones. A slower response for an earlier query could overwrite the correct results for the latest query.

### Root Cause

The API has random response delays, so requests can resolve out of order. Without debounce cleanup or a stale-response guard, React may apply results from an older query after the user has already typed a newer one.

### Fix Applied

The search work should be debounced with `setTimeout`, and the cleanup function should cancel the pending timeout when the query changes. For a complete stale-data fix, also ignore responses from old effects after cleanup.

## Bug #3 — Order Status Badge Does Not Reliably Update

**File:** `src/pages/OrderManager.jsx`  
**Line(s):** 52-59

### Expected Behaviour

When an agent changes an order status from the dropdown, the API should save the change and the coloured status badge should immediately reflect the new status.

### Actual Behaviour

The API call succeeds, but the UI update is unreliable because the code mutates the existing state array and existing order object. React may not detect a meaningful state change when the same array reference is passed back into `setOrders`.

### Root Cause

React state must be treated as immutable. The buggy code does this:

```js
const updatedOrders = orders;
order.status = newStatus;
setOrders(updatedOrders);
```

`updatedOrders` is the same array reference as `orders`, and `order.status = newStatus` mutates an existing object. Since React receives the same array reference, it can skip the re-render.

If the badge appears to change during testing, that can happen because another state update, such as `setSaving(null)`, causes a render afterward. That does not make the state update pattern correct. The order state was still mutated directly.

### Fix Applied

Create a new array and a new object for the changed order:

```js
setOrders(
  orders.map((order) =>
    order.id === orderId ? { ...order, status: newStatus } : order
  )
);
```

This gives React a new state reference and keeps the update predictable.
