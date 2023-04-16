const {StatusCodes} = require('http-status-codes');
const CustomAPIError = require('./custom-api');

class TooManyRequests extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.TOO_MANY_REQUESTS
    }
}

module.exports = TooManyRequests;