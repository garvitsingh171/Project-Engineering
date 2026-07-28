const rate_limit = require('express-rate-limit');

const bookingLimiter = rate_limit({
    windowMs: 60 * 1000,
    max: 10,
    message: {
        message: "Too many booking attempts."
    }
});

module.exports = bookingLimiter;