# LU 4.12 Review - Fix Broken Caching

Reviewed `Milestone 04/LU4.12_Fix_Broken_Caching/backend/src/index.js`.

## What Was Improved

- Added `CACHE_TTL`, `setCache(...)`, `getCache(...)`, and `invalidateTaskCache(...)` helper functions.
- Changed the list cache key from `global_data_key` to `tasks:all`.
- Updated `GET /tasks` to read cached data through `getCache(...)`.
- Updated `GET /tasks` to fetch task data with `await prisma.task.findMany()` before caching it.
- Added cache invalidation after `POST /tasks` by calling `invalidateTaskCache()`.
- Added cache invalidation after `DELETE /tasks/:id` by calling `invalidateTaskCache(id)`.
- Added `500` JSON error responses in backend `catch` blocks so requests no longer silently fail.
- Changed `POST /tasks` to return `201 Created`, which is the correct status for successful creation.
- Added a `404` response in `GET /tasks/:id` when a task does not exist.
- Avoided caching missing task detail results by returning before `setCache(...)` when `task` is null.

## Issues Still Remaining

- `setCache(...)` currently has a syntax error: `expiresAt: Date.now() + CACHE_TTL;` should use a comma or no punctuation before the closing object. As written, the server will not start.
- `CACHE_TTL = 30 * 1000` is missing a semicolon. This is not fatal, but adding one keeps the style cleaner.
- `GET /tasks` still has a logic issue: after `const tasksPromise = await prisma.task.findMany()`, the variable is already an array, so `const tasks = await tasksPromise` is unnecessary and confusing. Rename it to `tasks` and return it directly.
- `GET /tasks` checks `cache.has(cacheKey)` before calling `getCache(cacheKey)`. If an entry exists but is expired, `getCache(...)` returns `null`, and the route may return `null` instead of refetching from the database. Prefer `const cachedTasks = getCache(cacheKey); if (cachedTasks) return ...`.
- `GET /tasks/:id` uses the cache key `tasks${id}`, but `invalidateTaskCache(id)` deletes `tasks:${id}`. The missing colon means detail cache invalidation will not work.
- `GET /tasks/:id` returns `cache.get(cacheKey)` after checking `getCache(cacheKey)`. Because `setCache(...)` stores a wrapper object, this would return `{ data, expiresAt }` instead of the task. Return the value from `getCache(...)` instead.
- `GET /tasks/:id` uses `if (getCache(cacheKey))`, which calls the cache function once for the check and then reads the raw map again. Store the result in a variable.
- Error messages in several routes say `Failed to fetch tasks` even for create, delete, and single-task fetch failures.
- Old `BUG` comments still describe the broken starter behavior even after some fixes. They should either be removed or rewritten once the code is correct.

## Recommended Next Steps

- Fix the syntax error inside `setCache(...)` first.
- Make the detail cache key exactly `tasks:${id}`.
- In `GET /tasks`, use `const cachedTasks = getCache('tasks:all')`; only return if it is not expired.
- In `GET /tasks/:id`, use `const cachedTask = getCache(cacheKey)` and return `cachedTask`, not `cache.get(cacheKey)`.
- Rename `tasksPromise` to `tasks` because the query is already awaited.
- Use route-specific error messages.
