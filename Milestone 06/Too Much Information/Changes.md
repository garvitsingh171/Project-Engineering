# Changes - Too Much Information

## Move 1 - Pre-Refactor Audit

This file is the contract for the refactor. Every over-exposed field listed here should be removed from auth responses before submission.

### POST /auth/signup

Current behavior: `routes/auth.js` inserts a new user with `RETURNING *` and responds with `res.status(201).json({ user: result.rows[0] })`.

Fields currently exposed that should not be returned:

- `password_hash`: exposes the stored credential hash. Even though it is not the raw password, leaking it gives an attacker material for offline cracking.
- `verification_token`: exposes an account verification secret. A client does not need this token in the signup response, and leaking it could allow account verification flow abuse.
- `stripe_customer_id`: internal billing provider identifier. The frontend does not need it to complete registration.
- `reset_password_token`: password reset secret. It should never be returned to a normal client response.
- `last_login_ip`: operational/security metadata. It can reveal user location/network information and is not needed after signup.
- `subscription_plan`: business/account metadata not required to complete signup.
- `feature_flags`: internal rollout/configuration data. Exposing it can reveal hidden or unreleased features.
- `salary`: private HR/payroll data with no role in authentication.
- `is_admin`: authorization implementation detail. The frontend should rely on a normalized role or server authorization checks, not this duplicate boolean.
- `created_at`: database metadata not required to complete signup.
- `updated_at`: database metadata not required to complete signup.

Fields safe to keep for signup:

- `id`: needed so the frontend can identify the authenticated user.
- `name`: useful to initialize the frontend session.
- `email`: useful to show the signed-in identity.
- `role`: useful if the frontend needs role-aware navigation after signup.

### POST /auth/login

Current behavior: `routes/auth.js` selects `SELECT * FROM users WHERE email = $1` and responds with `res.json({ token, user })`.

Fields currently exposed in `user` that should not be returned:

- `password_hash`: exposes the stored credential hash and enables offline attack attempts.
- `verification_token`: account verification secret that the frontend does not need during login.
- `reset_password_token`: password reset secret that must never be sent to clients.
- `stripe_customer_id`: internal billing provider identifier not needed to initialize an auth session.
- `last_login_ip`: security metadata that may reveal private network/location information.
- `subscription_plan`: business metadata not required for authentication.
- `feature_flags`: internal product configuration data.
- `salary`: highly sensitive payroll data unrelated to auth.
- `is_admin`: duplicate authorization detail; use `role` as the supported auth claim instead.
- `created_at`: database metadata not needed for login.
- `updated_at`: database metadata not needed for login.

Fields safe to keep for login:

- `id`: needed to identify the authenticated user in the client session.
- `name`: useful display field.
- `email`: useful display/account field.
- `role`: needed for role-aware UI and safe JWT authorization.

### GET /auth/me

Current behavior: `routes/auth.js` selects `SELECT * FROM users WHERE id = $1` and responds with `res.json({ user: result.rows[0] })`.

Fields currently exposed that should not be returned:

- `password_hash`: credential hash must never be included in profile responses.
- `verification_token`: account verification secret not needed by `/me`.
- `reset_password_token`: password reset secret must never be exposed.
- `stripe_customer_id`: internal billing identifier. Do not expose unless a billing-specific endpoint explicitly requires it.
- `last_login_ip`: private security metadata not needed for profile display.
- `feature_flags`: internal rollout/configuration data. Keep this server-side unless a public feature configuration endpoint is intentionally designed.
- `salary`: private HR/payroll data unrelated to a normal auth profile.
- `is_admin`: duplicate implementation detail. `role` is enough for auth and UI decisions.
- `updated_at`: internal database metadata not required by profile display.

Fields acceptable for `/auth/me`:

- `id`: identifies the current user.
- `name`: profile display field.
- `email`: profile/account display field.
- `role`: needed for role-aware UI.
- `subscription_plan`: optional profile/account context, acceptable only if the frontend displays account plan information.
- `created_at`: optional profile context, acceptable only if the UI shows account creation date.

## Move 2 - JWT Claims Audit

Current login JWT payload:

- `userId`: required. The auth middleware uses `req.user.userId` in `/auth/me` to load the user record.
- `email`: not required by current middleware. Convenient display data only, and it can become stale if the email changes.
- `role`: required/acceptable. Safe authorization claim for role-aware downstream checks.
- `isAdmin`: not required. Duplicate of `role` and can create inconsistent authorization logic.
- `stripeCustomerId`: not required. Billing provider identifier should not be stored in an auth token.
- `subscriptionPlan`: not required. Business metadata can become stale and should be fetched from the server when needed.
- `featureFlags`: not required. Internal configuration data does not belong in a JWT.

Target JWT payload:

```js
{
  userId: user.id,
  role: user.role
}
```

## Move 3 - Response Mappers To Build

Create a file such as `response-mappers.js`. A good location for this project would be `utils/response-mappers.js` or `routes/response-mappers.js`. Keep it simple and import it into `routes/auth.js`.

### `toAuthUser(user)`

Use this mapper for `/auth/signup` and `/auth/login`.

Keep:

- `id`: needed by the frontend to store the authenticated user identity.
- `name`: needed for basic display after auth.
- `email`: needed for account display and session initialization.
- `role`: needed for role-aware UI and matches the safe JWT role claim.

Remove everything else, especially `password_hash`, tokens, billing identifiers, feature flags, IPs, salary, and timestamps.

Expected shape:

```js
export function toAuthUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
}
```

### `toProfileUser(user)`

Use this mapper for `/auth/me`.

Keep:

- `id`: identifies the profile owner.
- `name`: profile display field.
- `email`: profile/account display field.
- `role`: role-aware display/authorization context.
- `subscription_plan`: optional account context if the frontend needs to show the plan.
- `created_at`: optional account context if the frontend shows member-since information.

Remove:

- `password_hash`, `verification_token`, `reset_password_token`, `stripe_customer_id`, `last_login_ip`, `feature_flags`, `salary`, `is_admin`, and `updated_at`.

Expected shape:

```js
export function toProfileUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    subscription_plan: user.subscription_plan,
    created_at: user.created_at
  };
}
```

## Move 4 - Apply Mappers To Auth Routes

Do this code work by hand, endpoint by endpoint:

1. Add the response mapper file.
2. Import `toAuthUser` and `toProfileUser` into `routes/auth.js`.
3. In `/auth/signup`, keep the insert working, but return `res.status(201).json({ user: toAuthUser(result.rows[0]) })`.
4. In `/auth/login`, keep the password check working, but sign only `{ userId: user.id, role: user.role }`.
5. In `/auth/login`, return `res.json({ token, user: toAuthUser(user) })`.
6. In `/auth/me`, return `res.json({ user: toProfileUser(result.rows[0]) })`.
7. Optional improvement: replace `RETURNING *` and `SELECT *` with explicit column lists so sensitive fields are not fetched unless needed.

## Move 5 - Verification And Deployment Notes

After the code changes, run:

```bash
npm install
npm start
```

Test these endpoints:

- `POST /auth/signup`: should still create a user and return a user object without sensitive fields.
- `POST /auth/login`: should still return a valid JWT and a user object without sensitive fields.
- `GET /auth/me`: should still return the current user profile without sensitive/internal fields.

Decode the login JWT and verify it contains only:

- `userId`
- `role`
- standard JWT fields added by the library, such as `iat` and `exp`

Deployment documentation still needed after you deploy:

- Add a `Live Deployment` section to `README.md`.
- Add the deployed URL there.
- Add the same deployed URL to the Pull Request description.
