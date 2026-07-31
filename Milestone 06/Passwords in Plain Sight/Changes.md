# Changes - Passwords in Plain Sight

## Summary

Updated the authentication flow so user passwords are handled securely instead of being stored or checked in plain text.

## What Changed

- Added `bcryptjs` as a dependency for password hashing and verification.
- Updated signup logic to hash the submitted password before creating a user record.
- Replaced the unsafe direct password string comparison in login with `bcrypt.compare`.
- Kept login responses generic for invalid credentials so the API does not reveal whether the email or password was wrong.
- Continued excluding the password field from the profile response with `.select('-password')`.

## Files Updated

- `package.json`
- `package-lock.json`
- `backend/controllers/authController.js`
- `.gitignore`

## Security Impact

The app no longer relies on storing or comparing raw passwords. Passwords should be saved as bcrypt hashes, and login should validate the submitted password against the stored hash.

## Note

In `backend/controllers/authController.js`, the signup code currently creates the user with a `hashedPassword` property while the Mongoose schema expects the field to be named `password`. Before final testing, store the hashed value under `password` so the database record matches the schema and `bcrypt.compare(password, user.password)` works correctly.
