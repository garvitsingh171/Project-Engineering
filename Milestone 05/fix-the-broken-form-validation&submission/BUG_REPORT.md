# BUG_REPORT.md

## Project

TrackFlow - Bug Report Form

## Ticket

FE-114 - The bug reporter form is itself buggy.

## Summary

The bug report form allowed invalid submissions, gave poor feedback during and after submission, and did not surface server-side failures. The fixes should be made in `src/App.jsx` only, as required by the assignment.

## Bugs Found

### Bug 1: Form Submits With Empty Required Fields

**Problem:**  
The `validate()` function always returned `true`, so the form submitted even when required fields were empty.

**Fix:**  
Add real validation for required fields before calling `submitBugReport()`. If validation fails, populate the `errors` state and stop submission.

**Expected Result:**  
Submitting an empty form should show validation messages and should not call the API.

### Bug 2: Submit Button Allows Duplicate Submissions

**Problem:**  
The form did not properly use the `loading` state to prevent repeated clicks during the API request.

**Fix:**  
Set `loading` to `true` before the API call, disable the submit button while loading, show a loading label, and reset `loading` in `finally`.

**Expected Result:**  
While the request is in progress, the submit button should be disabled and display `Submitting...`.

### Bug 3: Form Does Not Clear After Successful Submission

**Problem:**  
After a successful API response, the submitted data remained in the form.

**Fix:**  
Reset the `form` state back to its initial empty values after a successful submission.

**Expected Result:**  
After success, the form fields should clear and a success message should be shown.

### Bug 4: Server-Side Errors Are Silently Swallowed

**Problem:**  
When `submitBugReport()` rejected a request, such as when the title contains `login`, the user did not receive clear feedback.

**Fix:**  
Catch the error, save the message in `serverError`, and display a visible error banner above the form fields.

**Expected Result:**  
Submitting a title containing `login` should show the server error message:

`A bug report with a similar title already exists. Please be more specific.`

### Bug 5: Per-Field Validation Messages Are Missing

**Problem:**  
The app had an `errors` state, but the validation logic did not populate it correctly for each field.

**Fix:**  
Store validation messages by field name, such as `errors.title`, `errors.severity`, `errors.component`, `errors.description`, and `errors.stepsCount`, then render each message near its input.

**Expected Result:**  
Each invalid field should show its own helpful error message near the field.

### Bug 6: "No. of Steps" Accepts Invalid Values

**Problem:**  
The `stepsCount` input accepted empty values, `0`, and negative numbers.

**Fix:**  
Validate `stepsCount` as a positive number greater than `0`.

**Expected Result:**  
Values like empty input, `0`, and `-5` should be rejected with a field-level error message.

## Validation Checklist

- Empty form submission is blocked.
- Required field messages appear next to the correct inputs.
- `No. of Steps` rejects empty, zero, and negative values.
- Valid form submission shows a success message.
- Valid form submission clears all input fields.
- Submit button is disabled while the request is in progress.
- Rapid clicking does not create duplicate submissions.
- Title containing `login` shows the server-side error message.

## Files Changed

- `src/App.jsx`

## Files Not Changed

- `src/api.js`
- `src/index.css`

## Test Commands

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:5173
```
