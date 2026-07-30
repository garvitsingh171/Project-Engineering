# STATES-AUDIT.md

## Move 1 - Current State Audit

| Screen | Loading state now | Error state now | Empty state now |
|---|---|---|---|
| Dashboard | Shows page heading and blank dashboard area while stats are loading. | Error is ignored, so the user still sees the dashboard shell without knowing what failed. | Not applicable to array data, but missing fallback if stats are unavailable. |
| Orders | Shows heading and an empty grid while orders are loading. | Error is ignored, so the page appears empty. | Empty array renders a blank orders grid. |
| Products | Shows heading/buttons and an empty product grid while loading. | Error is ignored, so the page appears empty. | Empty array renders a blank product grid. |
| Customers | Shows table headers and empty table body while loading. | Error is ignored, so the table appears empty. | Empty array renders table headers with no rows. |

## Move 2 - Missing States Checklist

| Screen | Missing Loading | Missing Error | Missing Empty |
|---|---:|---:|---:|
| Dashboard | Yes | Yes | Yes |
| Orders | Yes | Yes | Yes |
| Products | Yes | Yes | Yes |
| Customers | Yes | Yes | Yes |

## Move 3 - Loading State Plan

Use skeleton screens for Orders, Products, and Customers because these pages show repeated records. Use a spinner or stat-card skeletons for Dashboard because it loads summary metrics.

For Orders, render 4 skeleton cards matching `OrderCard`.

Skeleton classes:
- Container: `grid grid-cols-1 gap-4`
- Card: `bg-white rounded-xl border border-gray-100 p-5 shadow-sm animate-pulse`
- Text bars: `h-4 bg-gray-200 rounded`
- Small bars: `h-3 bg-gray-100 rounded`
- Badge: `h-6 w-20 bg-gray-200 rounded-full`

## Move 4 - Error Copy

| Screen | Error message |
|---|---|
| Dashboard | We couldn't load your dashboard metrics. Check your connection and try again. |
| Orders | We couldn't load your orders. Check your connection and try again. |
| Products | We couldn't load product inventory. Check your connection and try again. |
| Customers | We couldn't load your customer list. Check your connection and try again. |

## Move 5 - Empty State Copy

| Screen | Title | Message | CTA |
|---|---|---|---|
| Dashboard | No dashboard data yet | Metrics will appear here once orders and customers are available. | None |
| Orders | No orders yet | New orders will appear here once customers start purchasing. | None |
| Products | No products found | Add your first product to start building your inventory. | Add Product |
| Customers | No customers yet | Customers will appear here after they place their first order. | None |

## Move 6 - Orders Sketch

Add sketch file to PR:

`/screenshots/orders-states-sketch.png`

Sketch must show:
- Loading: 4 skeleton order cards
- Error: message + Retry button
- Empty: icon + title + message