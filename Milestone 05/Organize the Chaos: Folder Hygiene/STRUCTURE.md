# Structure Analysis

## Current State

The current `src/` directory is flat. Every component, hook, service, utility, route-level view, stylesheet, and app entry file lives in the same folder:

```text
src/
├── App.jsx
├── Button.jsx
├── CartItem.jsx
├── CartSummary.jsx
├── CheckoutModal.jsx
├── Dashboard.jsx
├── EmptyState.jsx
├── ErrorMessage.jsx
├── LoginForm.jsx
├── LogoutButton.jsx
├── Modal.jsx
├── Navbar.jsx
├── OrderCard.jsx
├── OrdersList.jsx
├── ProductCard.jsx
├── ProductList.jsx
├── Spinner.jsx
├── apiClient.js
├── cartService.js
├── formatCurrency.js
├── index.css
├── loginService.js
├── main.jsx
├── ordersService.js
├── productsService.js
├── truncateText.js
├── useCart.js
├── useDebounce.js
├── useLogin.js
└── useProducts.js
```

## Time-to-find Estimate

For a new engineer, finding the cart checkout logic would probably take about 3 to 5 minutes in this flat structure. The checkout behavior is split across `CartSummary.jsx`, `CheckoutModal.jsx`, and `cartService.js`, but those files sit beside unrelated auth, product, order, layout, shared UI, service, and utility files. The names are fairly clear, so it is not impossible to find, but the flat folder forces the engineer to scan many unrelated files before understanding the cart flow.

## File Move Plan

```text
App.jsx → App.jsx
main.jsx → main.jsx
index.css → index.css

apiClient.js → services/apiClient.js

Button.jsx → shared/components/Button.jsx
EmptyState.jsx → shared/components/EmptyState.jsx
ErrorMessage.jsx → shared/components/ErrorMessage.jsx
Modal.jsx → shared/components/Modal.jsx
Navbar.jsx → shared/components/Navbar.jsx
Spinner.jsx → shared/components/Spinner.jsx

formatCurrency.js → shared/utils/formatCurrency.js
truncateText.js → shared/utils/truncateText.js

useDebounce.js → shared/hooks/useDebounce.js

LoginForm.jsx → features/auth/LoginForm.jsx
LogoutButton.jsx → features/auth/LogoutButton.jsx
loginService.js → features/auth/loginService.js
useLogin.js → features/auth/useLogin.js

ProductList.jsx → features/products/ProductList.jsx
ProductCard.jsx → features/products/ProductCard.jsx
productsService.js → features/products/productsService.js
useProducts.js → features/products/useProducts.js

CartSummary.jsx → features/cart/CartSummary.jsx
CartItem.jsx → features/cart/CartItem.jsx
CheckoutModal.jsx → features/cart/CheckoutModal.jsx
cartService.js → features/cart/cartService.js
useCart.js → features/cart/useCart.js

Dashboard.jsx → features/orders/Dashboard.jsx
OrdersList.jsx → features/orders/OrdersList.jsx
OrderCard.jsx → features/orders/OrderCard.jsx
ordersService.js → features/orders/ordersService.js
```

Decision notes:

- Auth-specific files: `LoginForm.jsx`, `LogoutButton.jsx`, `loginService.js`, `useLogin.js`.
- Product-specific files: `ProductList.jsx`, `ProductCard.jsx`, `productsService.js`, `useProducts.js`.
- Cart-specific files: `CartSummary.jsx`, `CartItem.jsx`, `CheckoutModal.jsx`, `cartService.js`, `useCart.js`.
- Order-specific files: `Dashboard.jsx`, `OrdersList.jsx`, `OrderCard.jsx`, `ordersService.js`.
- Shared UI components: `Button.jsx`, `EmptyState.jsx`, `ErrorMessage.jsx`, `Modal.jsx`, `Navbar.jsx`, `Spinner.jsx`.
- Shared utilities: `formatCurrency.js`, `truncateText.js`.
- Shared hooks: `useDebounce.js`.
- Shared service infrastructure: `apiClient.js`.
- App shell and entry files stay at the top level for now: `App.jsx`, `main.jsx`, `index.css`.
