const rateLimiter = require('express-rate-limit');

const rateLimit = ({ windowMs, max, message }) => {
    const limit = rateLimiter({
        windowMs,
        max,
        message,
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        skipFailedRequests: true
    });
    return limit
}




const accountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: 'Too many accounts created. Please try later.'
});
const resetPasswordLimit = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 4,
    message: 'Too many reset password requests. Please try later.'
});

module.exports = {
    accountLimiter,
    resetPasswordLimit
};