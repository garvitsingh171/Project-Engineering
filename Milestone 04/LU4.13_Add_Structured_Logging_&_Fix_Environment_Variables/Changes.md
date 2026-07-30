# LU 4.13 Changes - Structured Logging and Environment Variables

## Current Issues in Logging and Configuration

- `server/server.js` depends on environment values like `PORT`, but it does not load `.env` with `dotenv.config()`.
- `server/prisma/schema.prisma` hardcodes the database URL as `file:./dev.db` instead of using `env("DATABASE_URL")`.
- The backend does not validate required environment variables at startup, so configuration mistakes may only appear later as confusing runtime errors.
- Controller logs are vague, for example `Fetching all...`, `Error logic hit`, and `Roommate fail`.
- Error logs do not include useful context such as route action, request body, or the real error message.
- API error responses often return `{ error: "Fail" }`, which makes frontend debugging difficult.
- Request logging exists through `morgan('dev')`, but application-level logs are still scattered and inconsistent.
- The frontend depends on the API base URL and should use `VITE_API_URL` consistently so the backend URL is not hardcoded into the app.

## Changes Implemented or Planned

- Load backend environment variables at startup with `require('dotenv').config()`.
- Use `process.env.PORT` for the backend port.
- Add startup validation for required variables such as `DATABASE_URL` and `PORT`.
- Update Prisma configuration to read the database URL from `.env` using `env("DATABASE_URL")`.
- Keep Morgan request logging enabled so each HTTP request is visible during development.
- Replace vague `console.log(...)` messages with structured logs that include fields like `level`, `action`, and `message`.
- Replace generic error responses with route-specific messages such as `Failed to create expense`, `Failed to fetch expenses`, and `Failed to create roommate`.
- Add validation for expense creation so missing description, invalid amount, or missing payer ID returns `400 Bad Request`.
- Add validation for roommate creation so blank names are rejected before hitting the database.
- Use `import.meta.env.VITE_API_URL` in the frontend for API calls.
- Improve frontend loading and error states so users receive feedback when requests are pending or fail.

## Why These Changes Improve Debugging and Reliability

- Loading `.env` makes configuration portable across local development, testing, and deployment environments.
- Startup validation follows a fail-fast approach: the app stops immediately when required configuration is missing instead of failing later in unclear ways.
- Moving `DATABASE_URL` into `.env` prevents database configuration from being scattered across source files.
- Structured logs make it easier to search and understand backend behavior because each log clearly states what action happened and whether it succeeded or failed.
- Including error messages in logs helps identify the real failure instead of hiding it behind generic messages.
- Route-specific API errors make frontend debugging easier because the client can tell which operation failed.
- Input validation protects the database from bad data and gives users faster, clearer feedback.
- Environment-based frontend API URLs prevent the app from breaking when the backend port or deployment URL changes.
- Loading and error states improve reliability from the user's perspective because the interface no longer appears frozen or silent during slow or failed requests.
