const { verifyToken } = require('../utils');
const { UnauthenticatedError } = require('../errors');

const authenticateUser = (req, res, next) => {
    const { token } = req.signedCookies;
    if (!token) {
        throw new UnauthenticatedError('Invalid authentication');
    }
    try {
        const { id, name, role } = verifyToken(token);
        req.user = { id, name, role }
        return next();
    } catch (error) {
        throw new UnauthenticatedError('Invalid authentication');
    }
}

module.exports = authenticateUser;