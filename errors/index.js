const BadRequestError = require('./bad-request');
const NotFoundError = require('./not-found');
const UnauthorizedError = require('./unauthorized');
const UnauthenticatedError = require('./unauthenticated');
const TooManyRequestsError = require('./too-many-requests');


module.exports = {
    BadRequestError,
    NotFoundError,
    UnauthenticatedError,
    UnauthorizedError,
    TooManyRequestsError
}